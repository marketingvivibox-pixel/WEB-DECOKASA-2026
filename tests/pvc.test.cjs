const test = require('node:test');
const assert = require('node:assert/strict');
const {parseArea, calculate, matchVariant, quoteMessage, initializeLayers, initializeImageLoading} = require('../assets/landing-piso-pvc.js');
const fs = require('node:fs');
const path = require('node:path');
const {Liquid} = require('liquidjs');
const {parseHTML} = require('linkedom');
const {filters, productFixture} = require('../scripts/product_fixture.cjs');
const {pvcFixture, codes: pvcCodes} = require('../scripts/pvc_fixture.cjs');

test('PVC native finishes share twenty distinct rooms, real swatches and pending prices across both routes', async () => {
  const root = path.resolve(__dirname, '..');
  const engine = new Liquid({root:path.join(root, 'snippets'), extname:'.liquid'});
  filters(engine);
  engine.registerFilter('asset_url', name => `/assets/${name}`);
  const main = JSON.parse(fs.readFileSync(path.join(root, 'templates/product.landing-pvc.json'), 'utf8')).sections.main;
  const blocks = main.block_order.map(id => ({id, ...main.blocks[id]}));
  const source = fs.readFileSync(path.join(root, 'sections/landing-piso-pvc.liquid'), 'utf8').replace(/{% schema %}[\s\S]*?{% endschema %}/, '');
  const product = pvcFixture(18);
  product.url = '/products/piso-pvc';
  for (const landing of [false, true]) {
    const doc = parseHTML(await engine.parseAndRender(source, {
      template:{suffix:'landing-pvc'}, request:{path:product.url + (landing ? '/landing' : '')}, product,
      routes:{root_url:'/', all_products_collection_url:'/collections/all'},
      section:{id:'pvc-room-test', settings:main.settings, blocks}
    })).document;
    if (landing) {
      const variants = JSON.parse(doc.querySelector('[data-pvc-variants]').textContent);
      assert.equal(variants.length, 20);
      assert.equal(new Set(variants.map(variant => variant.image)).size, 20);
      assert.deepEqual(variants.filter(variant => !variant.price).map(variant => variant.finish), ['7172-4','7172-8','7195-8']);
      variants.forEach((variant, index) => {
        assert.equal(variant.finish, pvcCodes[index]);
        assert.match(variant.image, new RegExp('ambiente-pvc-' + pvcCodes[index].toLowerCase() + '\\.webp'));
        assert.match(variant.swatch, new RegExp('piso-pvc-' + pvcCodes[index].toLowerCase() + '\\.webp'));
      });
      assert.match(doc.querySelector('[data-catalog-room]').src, /ambiente-pvc-7172-8/);
      assert.equal(doc.querySelector('[data-catalog-room-code]').textContent, '7172-8');
      assert.ok(doc.querySelector('[data-catalog-confirm]'));
    } else {
      const choices = Array.from(doc.querySelectorAll('[data-option-link]'));
      assert.equal(choices.length, 20);
      choices.forEach((choice, index) => assert.match(choice.querySelector('img').src, new RegExp('piso-pvc-' + pvcCodes[index].toLowerCase() + '\\.webp')));
      assert.match(doc.querySelector('[data-gallery-panel]:not([hidden]) img').src, /ambiente-pvc-7172-8/);
      assert.match(doc.querySelector('[data-estimated-amount]').textContent, /Por confirmar/);
    }
  }
});

test('Flooring selects the advertising view only for its explicit landing route or theme editor', async () => {
  const engine = new Liquid({root:path.resolve(__dirname, '../snippets'), extname:'.liquid'});
  filters(engine);
  const source = "{% render 'flooring-route-view', template: template, request: request, product: product %}";
  for (const material of ['pvc', 'spc']) {
  for (const [url, expected] of [
    ['/products/piso-pvc', 'product'],
    ['/products/piso-pvc?utm_source=facebook', 'product'],
    ['/products/piso-pvc/landing?utm_source=facebook&variant=123', 'landing'],
    ['/es/products/piso-pvc/landing', 'landing'],
    ['/collections/acabados/products/piso-pvc/landing', 'landing'],
    ['/products/otro-producto/landing', 'product'],
    ['/products/piso-pvc/landing-extra', 'product'],
    ['/products/piso-pvc/landing/otra-pagina', 'product']
  ]) {
    const context = {template:{suffix:`landing-${material}`}, product:{handle:`piso-${material}`}, request:{path:new URL(url.replaceAll('pvc', material), 'https://example.test').pathname}};
    assert.equal((await engine.parseAndRender(source, context)).trim(), expected, url);
  }
  const editor = {template:{suffix:`landing-${material}`}, product:{handle:`piso-${material}`}, request:{path:`/products/piso-${material}`, design_mode:true}};
  assert.equal((await engine.parseAndRender(source, editor)).trim(), 'landing');
  assert.equal((await engine.parseAndRender(source, {...editor, template:{suffix:'otro-producto'}})).trim(), 'product');
  }
});

test('Flooring layout isolates landing assets and restores the storefront header and footer on normal product routes', async () => {
  const root = path.resolve(__dirname, '..');
  const engine = new Liquid({root:path.join(root, 'snippets'), extname:'.liquid'});
  filters(engine);
  engine.registerFilter('asset_url', name => `/assets/${name}`);
  const source = fs.readFileSync(path.join(root, 'layout/theme.liquid'), 'utf8')
    .replace("{% section 'header' %}", '<header data-storefront-header></header>')
    .replace("{% section 'footer' %}", '<footer data-storefront-footer></footer>');
  for (const material of ['pvc', 'spc']) for (const landing of [false, true]) {
    const canonical = `https://example.test/products/piso-${material}`;
    const doc = parseHTML(await engine.parseAndRender(source, {
      template:{suffix:`landing-${material}`}, product:{handle:`piso-${material}`},
      request:{path:`/products/piso-${material}${landing ? '/landing' : ''}`, locale:{iso_code:'es'}},
      canonical_url:canonical, content_for_layout:'<h1>Piso</h1>', shop:{name:'Decokasa'}
    })).document;
    assert.equal(doc.body.className, landing ? `${material}-layout` : 'storefront-interface');
    assert.equal(Boolean(doc.querySelector('[data-storefront-header]')), !landing);
    assert.equal(Boolean(doc.querySelector('[data-storefront-footer]')), !landing);
    assert.equal(Boolean(doc.querySelector('[src*="decokasa.js"]')), !landing);
    assert.equal(Boolean(doc.querySelector('[src*="decokasa-motion.js"]')), !landing);
    assert.equal(doc.querySelector('link[rel="canonical"]').getAttribute('href'), canonical);
  }
});

test('PVC storefront reuses the normal product, native variants and calculator without landing assets or empty accordions', async () => {
  const root = path.resolve(__dirname, '..');
  const engine = new Liquid({root:path.join(root, 'snippets'), extname:'.liquid'});
  filters(engine);
  engine.registerFilter('asset_url', name => `/assets/${name}`);
  const main = JSON.parse(fs.readFileSync(path.join(root, 'templates/product.landing-pvc.json'), 'utf8')).sections.main;
  const product = productFixture({handle:'piso-pvc', name:'Piso PVC', sku:'DEMO-001', price:10000, coverage:5}, 6);
  product.url = '/products/piso-pvc';
  const source = fs.readFileSync(path.join(root, 'sections/landing-piso-pvc.liquid'), 'utf8').replace(/{% schema %}[\s\S]*?{% endschema %}/, '');
  const {document} = parseHTML(await engine.parseAndRender(source, {
    template:{suffix:'landing-pvc'}, request:{path:'/products/piso-pvc'}, product,
    routes:{root_url:'/', all_products_collection_url:'/collections/all'},
    section:{id:'pvc-storefront-test', settings:main.settings, blocks:main.block_order.map(id => ({id, ...main.blocks[id]}))}
  }));
  assert.equal(document.querySelectorAll('h1').length, 1);
  assert.equal(document.querySelector('[data-product-page]').dataset.productUrl, '/products/piso-pvc');
  assert.equal(document.querySelectorAll('[data-pvc]').length, 1);
  assert.ok(document.querySelector('[data-pvc] [name="area"]'));
  assert.equal(document.querySelector('[name="variant_id"] option').dataset.coverage, '5');
  assert.equal(document.querySelectorAll('[data-option-link]').length, 2);
  assert.equal(document.querySelector('.breadcrumb a').getAttribute('href'), '/');
  assert.equal(document.querySelector('[data-pvc-landing]'), null);
  assert.equal(document.querySelector('[src*="landing-piso-pvc.js"]'), null);
  assert.equal(document.querySelector('[href*="landing-piso-pvc.css"]'), null);
  assert.deepEqual(Array.from(document.querySelectorAll('details.product-information > summary'), item => item.textContent.trim()), ['Especificaciones']);
});

test('PVC area accepts decimal comma and rejects invalid or unreasonable areas', () => {
  assert.equal(parseArea(' 12,5 '), 12.5);
  assert.equal(parseArea('0.1'), 0.1);
  for (const value of ['', '0', '-2', '1e2', '5 m2', '1,000.5', '10001', 'Infinity', '.5']) assert.equal(parseArea(value), null);
});
test('PVC orders whole boxes, including exact boundaries and optional cutting allowance', () => {
  assert.equal(calculate('10', false, 5).boxes, 2);
  assert.equal(calculate('10', true, 5).boxes, 3);
  assert.equal(calculate('10.01', false, 5).boxes, 3);
  assert.equal(calculate('10', true, 2.2).boxes, 5);
  assert.equal(calculate('0.1', true, 5).covered, 5);
  assert.equal(calculate('3', false, 0), null);
  assert.equal(calculate('invalid', false, 5), null);
});
test('PVC binds a unique confirmed Acabado option or exact SKU, never ambiguous values', () => {
  const variants = [{id: 1, finish: 'FD801', sku: '01PVCFD801', price: 20000}, {id: 2, finish: 'FD802', sku: '', price: 0}];
  assert.equal(matchVariant('FD801', variants), null);
  assert.equal(matchVariant('', variants), null);
  assert.equal(matchVariant('01PVCFD801', variants).id, 1);
  assert.equal(matchVariant('01PVCFD801', [...variants, variants[0]]), null);
  assert.equal(matchVariant('', variants, 'FD801').id, 1);
  assert.equal(matchVariant('', variants, 'FD802').id, 2);
  assert.equal(matchVariant('WRONG-SKU', variants, 'FD801'), null);
  assert.equal(matchVariant('', variants, 'FD999'), null);
  assert.equal(matchVariant('', [...variants, variants[0]], 'FD801'), null);
  assert.equal(matchVariant('', [{title: 'FD801'}], 'FD801'), null);
});
test('PVC advisor quote carries the chosen finish and calculation without inventing price or stock', () => {
  const quote = quoteMessage('Piso PVC autoadhesivo', 'FD801', calculate('12,5', true, 5), null);
  assert.match(quote, /Acabado: FD801/);
  assert.match(quote, /12.5 m² \+ 10%/);
  assert.match(quote, /3 cajas de 5 m² \(15 m²/);
  assert.match(quote, /confirmen presentación, precio, disponibilidad y envío/);
  assert.doesNotMatch(quote, /SKU:|S\//);
});

test('PVC editor schema names fit Shopify upload limits', () => {
  const source = fs.readFileSync(path.resolve(__dirname, '../sections/landing-piso-pvc.liquid'), 'utf8');
  const schema = JSON.parse(source.match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
  for (const entry of [schema, ...schema.blocks]) {
    assert.ok(entry.name.length <= 25, `Schema name exceeds 25 characters: ${entry.name}`);
  }
});

test('PVC review layout labels mockup samples and preserves the 20-finish catalog and calculator', async () => {
  const root = path.resolve(__dirname, '..');
  const engine = new Liquid({root:path.join(root, 'snippets'), extname:'.liquid'});
  filters(engine);
  engine.registerFilter('asset_url', name => `/assets/${name}`);
  engine.registerFilter('stylesheet_tag', name => `<link rel="stylesheet" href="${name}">`);
  const raw = fs.readFileSync(path.join(root, 'sections/landing-piso-pvc.liquid'), 'utf8');
  const source = raw.replace(/{% schema %}[\s\S]*?{% endschema %}/, '');
  const main = JSON.parse(fs.readFileSync(path.join(root, 'templates/product.landing-pvc.json'), 'utf8')).sections.main;
  const blocks = main.block_order.map(id => ({id, ...main.blocks[id]}));
  const context = {template:{suffix:'landing-pvc'}, request:{path:'/products/piso-pvc/landing'}, section:{id:'pvc-test', settings:main.settings, blocks}, product:{handle:'piso-pvc', title:'Piso PVC', variants:[]}};
  const render = async section => parseHTML(await engine.parseAndRender(source, {...context, section})).document;
  const doc = await render(context.section);
  assert.equal(doc.querySelectorAll('.pvc-review--sample').length, 5);
  assert.equal(doc.querySelector('.pvc-testimonials .pvc-heading p').textContent, 'Ejemplos ilustrativos');
  assert.ok([...doc.querySelectorAll('.pvc-review')].every(card => card.querySelector('.pvc-review__label').textContent === 'Ejemplo ilustrativo'));
  assert.ok([...doc.querySelectorAll('.pvc-review img')].every(img => img.alt === 'Retrato ilustrativo del mockup'));
  assert.equal(doc.querySelectorAll('.pvc-swatch').length, 20);
  assert.equal(doc.querySelector('[data-finish-rail]'), null);
  assert.ok(doc.querySelector('[data-pvc] [data-area]'));
  assert.equal(doc.querySelector('[data-pvc-landing]').dataset.coverage, '5');
  assert.equal(doc.querySelector('[data-rail-controls]').hidden, true);

  const landing = doc.querySelector('[data-pvc-landing]');
  const otherLanding = landing.cloneNode(true);
  doc.body.appendChild(otherLanding);
  const listeners = [];
  initializeLayers(landing, (element, type, callback) => {
    element.addEventListener(type, callback);
    listeners.push(() => element.removeEventListener(type, callback));
  });
  const buttons = [...landing.querySelectorAll('[data-pvc-layer-target]')];
  const markers = [...landing.querySelectorAll('[data-pvc-layer-marker]')];
  let focused;
  buttons.forEach((button, index) => { button.focus = () => { focused = index; }; });
  const press = (index, key) => {
    const event = new doc.defaultView.Event('keydown', {cancelable:true});
    event.key = key;
    buttons[index].dispatchEvent(event);
    assert.equal(event.defaultPrevented, true);
  };
  buttons[3].click();
  assert.equal(landing.querySelector('[data-pvc-layer-title]').textContent, 'Refuerzo de la estructura');
  assert.deepEqual(buttons.map(button => button.getAttribute('aria-pressed')), ['false', 'false', 'false', 'true', 'false']);
  assert.deepEqual(markers.map(marker => marker.classList.contains('is-active')), [false, false, false, true, false, false, false, false, true, false]);
  assert.equal(otherLanding.querySelector('[data-pvc-layer-title]').textContent, 'Protección superficial');
  press(3, 'End');
  assert.equal(focused, 4);
  assert.equal(landing.querySelector('[data-pvc-layer-fact]').textContent, '05 / 05 · Autoadhesivo');
  press(4, 'ArrowDown');
  assert.equal(focused, 0);
  press(0, 'ArrowUp');
  assert.equal(focused, 4);
  press(4, 'Home');
  assert.equal(focused, 0);
  assert.equal(landing.querySelector('[data-pvc-layer-fact]').textContent, '01 / 05 · Capa de desgaste');
  listeners.forEach(remove => remove());
  buttons[1].click();
  assert.equal(buttons[0].getAttribute('aria-pressed'), 'true');

  const real = await render({...context.section, blocks:[...blocks,
    {type:'testimonial', settings:{name:'Ana <Cliente>', city:'Lima', headline:'Mi experiencia', quote:'Reseña real autorizada'}},
    {type:'testimonial', settings:{name:'Sin publicar', quote:''}}
  ]});
  assert.equal(real.querySelectorAll('.pvc-review').length, 1);
  assert.equal(real.querySelector('.pvc-review--sample'), null);
  assert.equal(real.querySelector('.pvc-testimonials .pvc-heading p').textContent, 'De nuestros clientes');
  assert.equal(real.querySelector('.pvc-review h3').textContent, 'Ana <Cliente>');
  assert.equal(real.querySelector('.pvc-review h3').children.length, 0);
  assert.equal(real.querySelectorAll('.pvc-swatch').length, 20);
  const disabled = await render({...context.section, settings:{...main.settings, show_illustrative_testimonials:false}});
  assert.equal(disabled.querySelector('.pvc-testimonials'), null);
});

test('PVC skeleton settles cached, loaded, failed and cloned images, then cleans up on section unload', async () => {
  const {document, window} = parseHTML('<main><img id="cached"><img id="pending"><img id="failed"><img id="busy" aria-busy="false"></main>');
  const root = document.querySelector('main');
  const cached = document.getElementById('cached');
  const pending = document.getElementById('pending');
  const failed = document.getElementById('failed');
  const busy = document.getElementById('busy');
  [cached, pending, failed, busy].forEach(image => Object.defineProperty(image, 'complete', {value:image === cached}));
  const removers = [];
  const dispose = initializeImageLoading(root, (element, type, callback) => {
    element.addEventListener(type, callback);
    removers.push(() => element.removeEventListener(type, callback));
  });
  assert.equal(cached.classList.contains('pvc-image-loading'), false);
  assert.equal(cached.hasAttribute('aria-busy'), false);
  assert.equal(pending.classList.contains('pvc-image-loading'), true);
  assert.equal(pending.getAttribute('aria-busy'), 'true');
  pending.dispatchEvent(new window.Event('load'));
  failed.dispatchEvent(new window.Event('error'));
  for (const image of [pending, failed]) {
    assert.equal(image.classList.contains('pvc-image-loading'), false);
    assert.equal(image.hasAttribute('aria-busy'), false);
  }
  const clone = busy.cloneNode();
  Object.defineProperty(clone, 'complete', {value:true});
  root.appendChild(clone);
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(clone.classList.contains('pvc-image-loading'), false);
  assert.equal(clone.hasAttribute('aria-busy'), false);
  const newImage = document.createElement('img');
  Object.defineProperty(newImage, 'complete', {value:false});
  root.appendChild(newImage);
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(newImage.classList.contains('pvc-image-loading'), true);
  dispose();
  removers.forEach(remove => remove());
  assert.equal(root.querySelectorAll('.pvc-image-loading').length, 0);
  assert.equal(busy.getAttribute('aria-busy'), 'false');
  const unobserved = document.createElement('img');
  root.appendChild(unobserved);
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(unobserved.hasAttribute('aria-busy'), false);
});
