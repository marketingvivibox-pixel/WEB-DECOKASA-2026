const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { Liquid } = require('liquidjs');
const { parseHTML } = require('linkedom');
const { calculate, estimateTotal } = require('../assets/landing-piso-spc.js');
const { filters } = require('../scripts/product_fixture.cjs');
const root = path.resolve(__dirname, '..');

function motionFixture({desktop = true, reduced = false} = {}) {
  const { runInNewContext } = require('node:vm');
  const controllers = new WeakMap(), observed = new Set(), animations = [];
  const desktopMedia = Object.assign(new EventTarget(), {matches: desktop});
  const reducedMedia = Object.assign(new EventTarget(), {matches: reduced});
  const group = {children: []};
  const targets = Array.from({length: 3}, (_, index) => ({
    contains: node => node?.owner === index,
    closest: () => group,
    animate: (frames, options) => {
      const animation = {frames, options, canceled: false, cancel() {this.canceled = true; this.oncancel?.();}};
      animations.push(animation);
      return animation;
    }
  }));
  group.children = targets;
  const page = Object.assign(new EventTarget(), {querySelectorAll: () => targets});
  let notify;
  const window = {
    Element: {prototype: {animate() {}}},
    matchMedia: query => query.includes('min-width') ? desktopMedia : reducedMedia,
    IntersectionObserver: class {
      constructor(callback) {notify = callback;}
      observe(target) {observed.add(target);}
      unobserve(target) {observed.delete(target);}
      disconnect() {observed.clear();}
    }
  };
  const document = {activeElement: null};
  const source = fs.readFileSync(path.join(root, 'assets/landing-piso-spc.js'), 'utf8');
  const motion = source.slice(source.indexOf('  function initDesktopMotion('), source.indexOf('  function initDesktopNavigation('));
  runInNewContext(`${motion}\ninitDesktopMotion(page);`, {page, document, window, AbortController, motionControllers: controllers});
  return {
    observed, animations, document,
    enter: (index, isIntersecting = true) => notify([{target: targets[index], isIntersecting}]),
    setDesktop: matches => {desktopMedia.matches = matches; desktopMedia.dispatchEvent(new Event('change'));},
    setReduced: matches => {reducedMedia.matches = matches; reducedMedia.dispatchEvent(new Event('change'));},
    interact: (index, type) => {
      const event = new Event(type);
      Object.defineProperty(event, 'target', {value: {owner: index}});
      page.dispatchEvent(event);
    },
    cleanup: () => controllers.get(page)()
  };
}

test('SPC: entradas de escritorio solo al aparecer, una vez y con secuencia limitada', () => {
  const motion = motionFixture();
  assert.equal(motion.observed.size, 3);
  motion.enter(0, false);
  assert.equal(motion.animations.length, 0);
  motion.enter(1);
  assert.equal(motion.animations.length, 1);
  assert.equal(motion.animations[0].options.delay, 70);
  assert.equal(motion.animations[0].options.fill, 'backwards');
  motion.enter(1);
  assert.equal(motion.animations.length, 1);
  motion.document.activeElement = {owner: 2};
  motion.enter(2);
  assert.equal(motion.animations.length, 1);
  motion.cleanup();
  assert.equal(motion.observed.size, 0);
  assert.equal(motion.animations[0].canceled, true);
});

test('SPC: móvil y movimiento reducido desactivan entradas incluso durante la animación', () => {
  const motion = motionFixture({desktop: false});
  assert.equal(motion.observed.size, 0);
  motion.setDesktop(true);
  motion.enter(0);
  motion.setReduced(true);
  assert.equal(motion.observed.size, 0);
  assert.equal(motion.animations[0].canceled, true);
  motion.enter(1);
  assert.equal(motion.animations.length, 1);
  motion.setReduced(false);
  assert.equal(motion.observed.size, 2);
  motion.setDesktop(false);
  assert.equal(motion.observed.size, 0);
  motion.cleanup();
  motion.setDesktop(true);
  assert.equal(motion.observed.size, 0);
  const reduced = motionFixture({reduced: true});
  assert.equal(reduced.observed.size, 0);
  reduced.cleanup();
});

test('SPC: teclado y puntero muestran inmediatamente el control animado', () => {
  const motion = motionFixture();
  motion.enter(0);
  motion.interact(0, 'focusin');
  assert.equal(motion.animations[0].canceled, true);
  motion.enter(1);
  motion.interact(1, 'pointerdown');
  assert.equal(motion.animations[1].canceled, true);
  motion.cleanup();
});

function navigationFixture({desktop = true, reduced = false} = {}) {
  const { runInNewContext } = require('node:vm');
  const frames = new Map();
  const controllers = new WeakMap();
  const positions = [];
  let next = 0, focused = false;
  const media = Object.assign(new EventTarget(), {matches: reduced});
  const link = Object.assign(new EventTarget(), {getAttribute: () => '#calculator'});
  const window = Object.assign(new EventTarget(), {
    scrollY: 100, innerHeight: 1000, location: {hash: ''},
    matchMedia: query => query.includes('min-width') ? {matches: desktop} : media,
    getComputedStyle: () => ({scrollMarginTop: '30px'}),
    requestAnimationFrame: callback => { frames.set(++next, callback); return next; },
    cancelAnimationFrame: id => frames.delete(id),
    scrollTo: ({top, behavior}) => { assert.equal(behavior, 'instant'); window.scrollY = top; positions.push(top); }
  });
  window.history = {pushState: (_, __, hash) => {window.location.hash = hash;}};
  const target = {getBoundingClientRect: () => ({top: 4100 - window.scrollY}), focus: options => {assert.equal(options.preventScroll, true); focused = true;}};
  const page = {querySelector: () => link, contains: node => node === target};
  const document = {getElementById: () => target, documentElement: {scrollHeight: 9000}};
  const source = fs.readFileSync(path.join(root, 'assets/landing-piso-spc.js'), 'utf8');
  const navigation = source.slice(source.indexOf('  function initDesktopNavigation('), source.indexOf('  function initCalculatorLayout('));
  runInNewContext(`${navigation}\ninitDesktopNavigation(page);`, {page, document, window, AbortController, navigationControllers: controllers});
  return {
    window, frames, positions,
    focused: () => focused,
    cleanup: () => controllers.get(page)(),
    click: (options = {}) => { const event = Object.assign(new Event('click', {cancelable: true}), {button: 0, ...options}); link.dispatchEvent(event); return event; },
    step: time => { const pending = [...frames.values()]; frames.clear(); pending.forEach(callback => callback(time)); }
  };
}

test('SPC: el CTA de escritorio acelera, frena y enfoca la calculadora sin salto extra', () => {
  const navigation = navigationFixture();
  assert.equal(navigation.click().defaultPrevented, true);
  assert.equal(navigation.window.scrollY, 100);
  assert.equal(navigation.focused(), false);
  for (let time = 0; time <= 1500; time += 100) navigation.step(time);
  assert.equal(navigation.window.scrollY, 4070);
  assert.equal(navigation.window.location.hash, '#calculator');
  assert.equal(navigation.focused(), true);
  assert.equal(navigation.frames.size, 0);
  const positions = navigation.positions;
  const advances = positions.slice(1).map((position, index) => position - positions[index]);
  assert.ok(advances.every(distance => distance >= 0));
  assert.ok(advances[0] < advances[6] / 4);
  assert.ok(advances.at(-1) < advances[6] / 4);
  navigation.cleanup();
});

test('SPC: desplazamiento cancelable y limpieza al descargar la sección', () => {
  const navigation = navigationFixture();
  navigation.click(); navigation.step(0); navigation.step(300);
  const interrupted = navigation.window.scrollY;
  navigation.window.dispatchEvent(new Event('wheel'));
  navigation.step(1600);
  assert.equal(navigation.window.scrollY, interrupted);
  assert.equal(navigation.focused(), false);
  assert.equal(navigation.window.location.hash, '');
  navigation.click(); navigation.step(2000);
  navigation.cleanup(); navigation.step(4000);
  assert.equal(navigation.frames.size, 0);
  assert.equal(navigation.click().defaultPrevented, false);
});

test('SPC: respeta movimiento reducido, móvil y clics con modificadores', () => {
  const reduced = navigationFixture({reduced: true});
  reduced.click();
  assert.equal(reduced.window.scrollY, 4070);
  assert.equal(reduced.frames.size, 0);
  assert.equal(reduced.focused(), true);
  reduced.cleanup();
  const mobile = navigationFixture({desktop: false});
  assert.equal(mobile.click().defaultPrevented, false);
  assert.equal(mobile.window.scrollY, 100);
  mobile.cleanup();
  const modified = navigationFixture();
  assert.equal(modified.click({ctrlKey: true}).defaultPrevented, false);
  assert.equal(modified.frames.size, 0);
  modified.cleanup();
});

test('SPC: el croquis conserva identidad y resultados al alternar móvil y escritorio', () => {
  const { runInNewContext } = require('node:vm');
  const { document } = parseHTML('<main><form><div data-desktop-plan></div><details class="spc-calc-details"><summary>Detalle</summary><div data-schematic-wrap><svg></svg></div><div class="spc-breakdown-details"><strong>11 cajas</strong></div><p class="spc-calc-help">Ayuda</p><p class="spc-planks-info">110 planchas</p></details></form></main>');
  const page = document.querySelector('main');
  const form = document.querySelector('form');
  const details = form.querySelector('details');
  const desktop = form.querySelector('[data-desktop-plan]');
  const original = [...details.children];
  const listeners = new Set();
  const media = {matches:false, addEventListener:(_, fn) => listeners.add(fn), removeEventListener:(_, fn) => listeners.delete(fn)};
  const controllers = new WeakMap();
  const source = fs.readFileSync(path.join(root, 'assets/landing-piso-spc.js'), 'utf8');
  const layout = source.slice(source.indexOf('  function initCalculatorLayout('), source.indexOf('  function initTestimonials('));
  runInNewContext(`${layout}\ninitCalculatorLayout(page, form);`, {document, page, form, window:{matchMedia:() => media}, calculatorLayoutControllers:controllers});
  assert.deepEqual([...details.children], original);
  for (let cycle = 0; cycle < 3; cycle++) {
    media.matches = true;
    listeners.forEach(fn => fn());
    assert.deepEqual([...desktop.children], original.slice(1));
    assert.equal(form.querySelectorAll('[data-schematic-wrap]').length, 1);
    desktop.querySelector('strong').textContent = '32 cajas';
    media.matches = false;
    listeners.forEach(fn => fn());
    assert.deepEqual([...details.children], original);
    assert.equal(details.querySelector('strong').textContent, '32 cajas');
    assert.equal(desktop.children.length, 0);
  }
  media.matches = true;
  listeners.forEach(fn => fn());
  controllers.get(page)();
  assert.equal(listeners.size, 0);
  assert.deepEqual([...details.children], original);
  assert.equal(details.childNodes.length, original.length);
});
test('SPC: rechaza áreas y rendimientos inválidos, sin producir pedidos ficticios', () => {
  for (const area of ['', 0, 0.001, -1, NaN, Infinity, 100001]) assert.equal(calculate(area, 2.196, true), null);
  for (const coverage of [0, -1, NaN, Infinity]) assert.equal(calculate(20, coverage, true), null);
});
test('SPC: redondea cajas completas, margen opcional y múltiplos exactos', () => {
  assert.equal(calculate(20, 2.196, true).boxes, 11);
  assert.equal(calculate(20, 2.196, false).boxes, 10);
  assert.equal(calculate(21.96, 2.196, false).boxes, 10);
  assert.equal(calculate(0.01, 2.196, true).boxes, 1);
  assert.equal(calculate(20, 2.196, true).covered, 11 * 2.196);
});

test('SPC: el estimado usa cajas completas y precio en céntimos, sin inventar importes', () => {
  assert.equal(estimateTotal(calculate(20, 2.196, true).boxes, '9990'), 1098.9);
  assert.equal(estimateTotal(10, '0'), 0);
  for (const price of [undefined, null, '', ' ', 'sin precio', -1, Infinity]) assert.equal(estimateTotal(10, price), null);
  for (const boxes of [0, -1, 1.5, Infinity, NaN]) assert.equal(estimateTotal(boxes, 9990), null);
});
test('SPC: datos nativos y privacidad del contenido de muestra en el tema', async () => {
  const engine = new Liquid({root:path.join(root, 'snippets'), extname:'.liquid'});
  filters(engine);
  engine.registerFilter('asset_url', n => `/assets/${n}`);
  engine.registerFilter('stylesheet_tag', n => `<link rel="stylesheet" href="${n}">`);
  const raw = fs.readFileSync(path.join(root, 'sections/landing-piso-spc.liquid'), 'utf8');
  const schema = JSON.parse(raw.match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
  const settings = Object.fromEntries(schema.settings.map(s => [s.id, s.default ?? '']));
  const context = {section:{id:'spc-test', settings, blocks:[]}, product:{title:'SPC Prueba', selected_or_first_available_variant:{sku:'SKU-REAL', metafields:{decokasa:{coverage_m2:{value:2.5}}}}}};
  const source = raw.replace(/{% schema %}[\s\S]*?{% endschema %}/, '');
  const doc = parseHTML(await engine.parseAndRender(source, context)).document;
  assert.equal(doc.querySelector('[data-spc-page]').dataset.coverage, '2.5');
  assert.equal(doc.querySelector('[data-spc-page]').dataset.sku, 'SKU-REAL');
  assert.ok(doc.querySelector('.spc-testimonials--pending'));
  assert.equal(doc.querySelector('.spc-quote'), null);
  assert.equal(doc.querySelector('[data-testimonial-viewport]'), null);
  assert.ok(!doc.body.textContent.includes('Carlos M.'));
  assert.equal(doc.querySelector('.spc-seals'), null);
  assert.equal(doc.querySelectorAll('[data-color]').length, 3);
  assert.ok(doc.querySelector('.spc-button--catalog').getAttribute('href').startsWith('#spc-colores-'));
  assert.equal(doc.querySelectorAll('img[src$=".jpg"]').length, 0);
  const preview = parseHTML(await engine.parseAndRender(source, {...context, section:{...context.section, settings:{...settings, spc_design_preview:true}}})).document;
  assert.equal(preview.querySelectorAll('.spc-quote').length, 5);
  assert.equal(preview.querySelectorAll('.spc-seals img').length, 6);
  const illustrative = parseHTML(await engine.parseAndRender(source, {...context, section:{...context.section, settings:{...settings, show_illustrative_testimonials:true}}})).document;
  assert.equal(illustrative.querySelectorAll('.spc-quote--sample').length, 5);
  assert.ok(illustrative.querySelector('[data-testimonial-viewport]'));
  assert.match(illustrative.querySelector('.spc-testimonial-sample-note').textContent, /No son reseñas de clientes reales/);
  assert.equal(illustrative.querySelector('.spc-seals'), null);
  assert.equal(illustrative.querySelector('.spc-sample-check'), null);
  assert.equal(illustrative.querySelector('.spc-stars'), null);
  assert.equal(illustrative.querySelector('.spc-testimonials--pending'), null);
  assert.ok([...illustrative.querySelectorAll('.spc-quote img')].every(img => img.alt.includes('IA')));
  const template = JSON.parse(fs.readFileSync(path.join(root, 'templates/product.landing-spc.json'), 'utf8'));
  assert.equal(template.sections.main.settings.show_illustrative_testimonials, true);
  assert.equal(template.sections.main.settings.show_certifications, true);
  const configured = parseHTML(await engine.parseAndRender(source, {...context, section:{...context.section, settings:{...settings, ...template.sections.main.settings}}})).document;
  assert.deepEqual([...configured.querySelectorAll('.spc-seals img')].map(img => img.alt), ['FLOORSCORE', 'ANAB', 'ILAC', 'DAKKS', 'CNAS', 'EPH']);
  assert.ok(configured.querySelector('.spc-v2-certifications + .spc-v2-click'));
  assert.ok(configured.querySelector('[data-spc-calculator]'));
});

test('SPC: desglose jerárquico incluye netArea, targetArea, wasteArea, leftover y planks', () => {
  const res = calculate(20, 2.196, true);
  assert.equal(res.boxes, 11);
  assert.equal(res.netArea, 20);
  assert.equal(res.targetArea, 22);
  assert.equal(res.wasteArea, 2);
  assert.equal(res.planks, 110);
  assert.ok(res.leftover > 0);
  assert.equal(res.covered, 11 * 2.196);
});

test('SPC: elementos visuales de la calculadora interactiva (pestañas, ambientes, desglose y croquis)', async () => {
  const engine = new Liquid({root:path.join(root, 'snippets'), extname:'.liquid'});
  filters(engine);
  engine.registerFilter('asset_url', n => `/assets/${n}`);
  engine.registerFilter('stylesheet_tag', n => `<link rel="stylesheet" href="${n}">`);
  const raw = fs.readFileSync(path.join(root, 'sections/landing-piso-spc.liquid'), 'utf8');
  const source = raw.replace(/{% schema %}[\s\S]*?{% endschema %}/, '');
  const doc = parseHTML(await engine.parseAndRender(source, {
    section:{id:'spc-test', settings:{coverage_m2:'2.196', whatsapp_phone:'51941599516'}, blocks:[]},
    product:{title:'Piso SPC', selected_or_first_available_variant:{sku:'SPC-001'}}
  })).document;

  assert.ok(doc.querySelector('[data-spc-calculator]').closest('.spc-v2-calculator'));
  assert.equal(doc.querySelector('[data-spc-calc-dialog]'), null);
  assert.equal(doc.querySelector('[data-spc-quick-calculator]'), null);
  assert.equal(doc.querySelectorAll('[data-calc-mode]').length, 2);
  assert.ok(doc.querySelector('[data-calc-mode="dimensions"]'));
  assert.ok(doc.querySelector('[data-calc-mode="direct"]'));
  assert.equal(doc.querySelector('[data-known-meters-toggle]'), null);
  assert.equal(doc.querySelector('.spc-calc-details').hasAttribute('open'), false);
  assert.ok(doc.querySelector('.spc-calc-details [data-schematic-stage]'));
  assert.ok(doc.querySelector('[data-calc-estimate]'));
  assert.equal(doc.querySelectorAll('.spc-v2-calculator [data-open-request]').length, 1);
  assert.equal(doc.querySelector('.spc-v2-calculator .spc-actions'), null);
  assert.equal(doc.querySelector('[data-calc-mode="direct"]').textContent, 'Tengo los m²');
  assert.ok(doc.querySelector('[data-rooms-container]'));
  assert.ok(doc.querySelector('[data-add-room]'));
  assert.ok(doc.querySelector('[data-schematic-stage]'));
  assert.ok(doc.querySelector('[name="waste"]'));
  assert.ok(doc.querySelector('[data-boxes]'));
  assert.ok(doc.querySelector('[data-net-area]'));
  assert.ok(doc.querySelector('[data-target-area]'));
  assert.ok(doc.querySelector('[data-covered]'));
  assert.ok(doc.querySelector('[data-leftover]'));
  assert.ok(doc.querySelector('[data-calc-contact]'));
  assert.ok(doc.querySelector('[data-quick-area]'));
  const orderBtn = doc.querySelector('[data-open-request]');
  assert.ok(orderBtn, 'Debe existir el botón de Realizar pedido');
  assert.equal(orderBtn.getAttribute('href'), '#solicitud');
  assert.ok(doc.querySelector('#solicitud'), 'Debe existir el formulario con id solicitud');
  assert.ok(doc.querySelector('.spc-add-icon-badge'), 'El botón de agregar ambiente debe tener badge de icono con relleno');
});

test('SPC: testimonios reales conservan contenido escapado y controles sin muestras', async () => {
  const engine = new Liquid({root:path.join(root, 'snippets'), extname:'.liquid'});
  filters(engine);
  engine.registerFilter('asset_url', n => `/assets/${n}`);
  engine.registerFilter('stylesheet_tag', n => `<link rel="stylesheet" href="${n}">`);
  const raw = fs.readFileSync(path.join(root, 'sections/landing-piso-spc.liquid'), 'utf8');
  const source = raw.replace(/{% schema %}[\s\S]*?{% endschema %}/, '');
  const schema = JSON.parse(raw.match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
  assert.ok(schema.blocks[0].settings.some(s => s.id === 'headline'));
  const doc = parseHTML(await engine.parseAndRender(source, {
    section:{id:'real-test', settings:{spc_design_preview:true, show_illustrative_testimonials:true}, blocks:[{settings:{city:'Lima', name:'Ana <script>bad()</script>', headline:'Buen <acabado>', quote:'Una opinión & experiencia real.'}}]},
    product:{}
  })).document;
  const card=doc.querySelector('.spc-quote');
  assert.equal(doc.querySelectorAll('.spc-quote').length,1);
  assert.equal(card.querySelector('figcaption').textContent,'Ana <script>bad()</script>');
  assert.equal(card.querySelector('script'),null);
  assert.equal(card.querySelector('blockquote strong').textContent,'Buen <acabado>');
  assert.equal(card.querySelector('blockquote p').textContent,'Una opinión & experiencia real.');
  assert.equal(doc.querySelector('.spc-quote--sample'),null);
  assert.equal(doc.querySelector('.spc-testimonial-sample-note'),null);
  assert.equal(doc.querySelector('[data-testimonial-viewport]').getAttribute('tabindex'),'0');
  assert.ok(doc.querySelector('[data-testimonial-pause]'));
});
