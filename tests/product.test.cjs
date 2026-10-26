const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {Liquid} = require('liquidjs');
const {parseHTML, DOMParser} = require('linkedom');
const {filters, productFixture} = require('../scripts/product_fixture.cjs');
const root = path.resolve(__dirname, '..');
const engine = new Liquid({root: path.join(root, 'snippets'), extname: '.liquid'});
filters(engine);
engine.registerFilter('asset_url', name => `/assets/${name}`);
const sectionSource = fs.readFileSync(path.join(root, 'sections/product-landing.liquid'), 'utf8');
const schema = JSON.parse(sectionSource.match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
const defaults = Object.fromEntries(schema.settings.filter(s => s.id).map(s => [s.id, s.default]));
function product(selected = 0) {
  return {...productFixture({handle:'ficha', name:'Producto de prueba', brand:'DECOKASA', price:12000, sku:'SKU-001', intro:'Descripción'}, 0, selected), url:'/products/ficha'};
}
async function html(p = product(), settings = {}) {
  return engine.parseAndRender(sectionSource.replace(/{% schema %}[\s\S]*?{% endschema %}/, ''), {product:p, routes:{root_url:'/', all_products_collection_url:'/collections/all'}, section:{id:'product-test', settings:{...defaults, ...settings}, blocks:[]}});
}
test('Ficha Liquid: rutas, galería, variantes y ajustes editoriales sin datos duplicados', async () => {
  const doc = parseHTML(await html()).document;
  assert.equal(doc.querySelector('.breadcrumb a').getAttribute('href'), '/');
  assert.equal(doc.querySelector('[data-gallery-panel]:not([hidden]) img').getAttribute('loading'), 'eager');
  assert.equal(doc.querySelectorAll('[data-gallery-panel]').length, 3);
  assert.equal(doc.querySelector('[data-option-link]:not([aria-current])').getAttribute('href'), '/products/ficha?option_values=demo-option-0-1');
  assert.equal(doc.querySelectorAll('[name=variant_id] option').length, 1);
  assert.equal(doc.querySelector('.product-demo'), null);
  const hidden = parseHTML(await html(product(), {show_price:false, show_sku:false, show_vendor:false, show_description:false})).document;
  assert.equal(hidden.querySelector('[data-product-price]'), null);
  assert.equal(hidden.querySelector('.product-sku'), null);
  assert.equal(hidden.querySelector('.product-vendor'), null);
  assert.equal(hidden.querySelector('.product-information'), null);
});
test('Opciones múltiples conservan IDs seleccionados y una combinación inexistente no permite solicitar', async () => {
  const p = product();
  p.options_with_values.push({name:'Tamaño', position:2, selected_value:'M', values:[{id:21, name:'M', selected:true},{id:22, name:'L', selected:false}]});
  p.selected_or_first_available_variant = null;
  p.images = []; p.featured_image = null;
  const doc = parseHTML(await html(p)).document;
  assert.equal(doc.querySelector('[data-option-link]:not([aria-current])').getAttribute('href'), '/products/ficha?option_values=demo-option-0-1,21');
  assert.equal(doc.querySelectorAll('[data-option-link]')[3].getAttribute('href'), '/products/ficha?option_values=demo-option-0-0,22');
  assert.equal(doc.querySelector('[data-open-request]').getAttribute('aria-disabled'), 'true');
  assert.equal(doc.querySelectorAll('[name=variant_id] option').length, 0);
  assert.ok(doc.querySelector('.product-no-image'));
});
async function runtime(fetcher, initialProduct = product()) {
  const {window, document} = parseHTML(await html(initialProduct));
  delete window.decokasaProductDetail;
  const navigations = [], histories = [], requests = [], loaded = [];
  const location = {href:'https://example.test/products/ficha', origin:'https://example.test', assign:url=>navigations.push(url)};
  document.addEventListener('shopify:section:load', event=>{
    loaded.push(event.target);
    for (const input of event.target.querySelectorAll('input')) input.reportValidity = () => true;
  });
  for (const input of document.querySelectorAll('input')) input.reportValidity = () => true;
  vm.runInNewContext(fs.readFileSync(path.join(root,'assets/product-detail.js'),'utf8'), {window, document, location, URL, DOMParser, AbortController, Event:window.Event, CustomEvent:window.CustomEvent, history:{replaceState:(_,__,url)=>histories.push(String(url))}, fetch:async(url, options)=>{requests.push({url:String(url), options});return fetcher();}});
  const click = selector=>document.querySelector(selector).dispatchEvent(new window.Event('click', {bubbles:true, cancelable:true}));
  return {document, window, click, navigations, histories, requests, loaded};
}
const settle = async()=>{await new Promise(resolve=>setImmediate(resolve));await new Promise(resolve=>setImmediate(resolve));};
function groupedProduct(selected = 0) {
  const p = product(selected);
  p.variants.forEach((variant, index) => {
    variant.metafields.decokasa.gallery_images = {value:Array.from({length:index ? 4 : 1}, (_, angle) => ({
      id:`media-${index}-${angle}`, media_type:'image',
      preview_image:{src:`/color-${index}-angle-${angle}.webp`, alt:`Color ${index}, ángulo ${angle}`}
    }))};
  });
  return p;
}
test('Galería por variante: cuatro ángulos ordenados, foto inicial visible y carga diferida del resto', async () => {
  const doc = parseHTML(await html(groupedProduct(1))).document;
  assert.deepEqual([...doc.querySelectorAll('[data-gallery-panel]')].map(el=>el.dataset.galleryPanel), ['media-1-0','media-1-1','media-1-2','media-1-3']);
  assert.equal(doc.querySelectorAll('[data-gallery-panel]:not([hidden])').length, 1);
  assert.equal(doc.querySelector('[data-gallery-panel]:not([hidden]) img').getAttribute('src'), '/color-1-angle-0.webp');
  assert.equal(doc.querySelector('[data-gallery-panel]:not([hidden]) img').getAttribute('loading'), 'eager');
  assert.ok([...doc.querySelectorAll('[data-gallery-panel][hidden] img')].every(img=>img.getAttribute('loading')==='lazy'));
  assert.equal(doc.querySelectorAll('[data-gallery-choice]').length, 4);
  const single = parseHTML(await html(groupedProduct())).document;
  assert.equal(single.querySelectorAll('[data-gallery-panel]').length, 1);
  assert.equal(single.querySelectorAll('[data-gallery-choice]').length, 0);
});
test('Seleccionar un ángulo y cambiar de color reemplaza la galería sin mezclar fotos', async () => {
  const nextHTML = await html(groupedProduct());
  const app = await runtime(()=>({ok:true, text:async()=>nextHTML}), groupedProduct(1));
  app.click('[data-gallery-choice="media-1-3"]');
  assert.equal(app.document.querySelector('[data-gallery-panel]:not([hidden])').dataset.galleryPanel, 'media-1-3');
  assert.equal(app.document.querySelector('[data-gallery-choice="media-1-3"]').getAttribute('aria-current'), 'true');
  app.document.querySelector('[data-product-quantity]').value='3';
  app.document.querySelector('[data-product-quantity]').dispatchEvent(new app.window.Event('input', {bubbles:true}));
  app.document.querySelector('[name=name]').value='Cliente de prueba';
  app.click('[data-option-link]:not([aria-current])'); await settle();
  assert.equal(app.document.querySelectorAll('[data-gallery-panel]').length, 1);
  assert.equal(app.document.querySelector('[data-gallery-panel]:not([hidden])').dataset.galleryPanel, 'media-0-0');
  assert.equal(app.document.querySelector('[data-product-quantity]').value, '3');
  assert.equal(app.document.querySelector('[name=name]').value, 'Cliente de prueba');
  assert.equal(app.navigations.length, 0);
});
test('Cambio nativo de variante reemplaza sección y conserva cantidad/contacto sin enviarlos', async () => {
  const nextHTML = await html(product(1));
  const app = await runtime(()=>({ok:true, text:async()=>nextHTML}));
  const quantity = app.document.querySelector('[data-product-quantity]'); quantity.value='3';
  quantity.dispatchEvent(new app.window.Event('input', {bubbles:true}));
  app.document.querySelector('[name=name]').value='Cliente de prueba';
  app.document.querySelector('[data-request-details]').open=true;
  app.click('[data-option-link]:not([aria-current])');
  await settle();
  assert.match(app.document.querySelector('[data-product-price]').textContent, /140.00/);
  assert.equal(app.document.querySelector('[data-sku]').textContent, 'SKU-002');
  assert.equal(app.document.querySelector('[data-product-quantity]').value, '3');
  assert.equal(app.document.querySelector('[name=name]').value, 'Cliente de prueba');
  assert.equal(app.document.querySelector('[data-request-details]').open, true);
  assert.equal(app.loaded.length, 1);
  assert.equal(app.navigations.length, 0);
  assert.equal(app.requests.length, 1);
  assert.equal(app.requests[0].url, 'https://example.test/products/ficha?option_values=demo-option-0-1&section_id=product-test');
  assert.equal(app.requests[0].options.body, undefined);
  assert.deepEqual(app.histories, ['https://example.test/products/ficha?option_values=demo-option-0-1']);
});
test('Una respuesta fallida de Shopify conserva la navegación normal a la variante', async () => {
  const app = await runtime(()=>({ok:false}));
  app.click('[data-option-link]:not([aria-current])'); await settle();
  assert.deepEqual(app.navigations, ['https://example.test/products/ficha?option_values=demo-option-0-1']);
  assert.equal(app.histories.length, 0);
  assert.equal(app.document.querySelector('[data-product-page]').hasAttribute('aria-busy'), false);
});
test('El botón de objetivo abre el modal de detalles y actualiza estado al alcanzar la meta', async () => {
  const nextHTML = await html(product(0));
  const app = await runtime(()=>({ok:true, text:async()=>nextHTML}));
  const actionBtn = app.document.querySelector('[data-reward-modal-open]');
  const modal = app.document.querySelector('[data-reward-modal]');
  assert.ok(actionBtn, 'El botón de objetivo debe existir');
  assert.ok(modal, 'El modal de regalo especial debe existir');

  // Abre el modal al hacer click en el botón
  app.click('[data-reward-modal-open]');
  assert.equal(actionBtn.getAttribute('aria-expanded'), 'true');
  assert.ok(modal.classList.contains('is-open') || modal.hasAttribute('open'));

  // Cierra el modal con el botón de cierre
  app.click('[data-reward-modal-close]');
  assert.equal(actionBtn.getAttribute('aria-expanded'), 'false');

  // Tres unidades de 120 superan la meta de 252 (140, variante más cara, × 1.8).
  const quantity = app.document.querySelector('[data-product-quantity]');
  quantity.value = '3';
  quantity.dispatchEvent(new app.window.Event('input', { bubbles: true }));
  app.click('[data-add-request]');
  assert.ok(actionBtn.classList.contains('unlocked'));
  assert.match(app.document.querySelector('[data-reward-action-text]').textContent, /¡Regalo Desbloqueado!/);
});

test('La previsualización del monto estimado se actualiza en tiempo real al cambiar la cantidad', async () => {
  const single = {...product(), has_only_default_variant:true, options_with_values:[]};
  const app = await runtime(() => { throw Error('No network needed'); }, single);
  const estimateEl = app.document.querySelector('[data-estimated-amount]');
  const breakdownEl = app.document.querySelector('[data-estimated-breakdown]');
  const quantity = app.document.querySelector('[data-product-quantity]');
  assert.ok(estimateEl, 'Debe existir el elemento del monto estimado');
  assert.ok(breakdownEl, 'Debe existir el desglose del monto');
  assert.equal(estimateEl.textContent.trim(), 'S/. 120.00 PEN');
  assert.match(breakdownEl.textContent, /1 unidad × S\/\. 120\.00 PEN/);

  // Al aumentar la cantidad a 4 (como en la captura del usuario: 120 * 4 = 480)
  quantity.value = '4';
  quantity.dispatchEvent(new app.window.Event('input', { bubbles: true }));
  assert.equal(estimateEl.textContent.trim(), 'S/. 480.00 PEN');
  assert.match(breakdownEl.textContent, /4 unidades × S\/\. 120\.00 PEN/);
});

function chair(selected = 0) {
  const p = groupedProduct(selected);
  p.variants.forEach((variant, index) => {
    variant.title = index ? 'Negro' : 'Blanco';
    variant.price = index ? 30000 : 27900;
    const value = p.options_with_values[0].values[index];
    value.name = variant.title;
  });
  p.options_with_values[0].name = 'Color';
  p.options_with_values[0].selected_value = p.variants[selected].title;
  p.price_max = 30000;
  return p;
}
test('Una solicitud conserva colores, IDs, SKU y precios distintos al cambiar la sección', async () => {
  const nextHTML = await html(chair(1));
  const app = await runtime(()=>({ok:true, text:async()=>nextHTML}), chair());
  const $ = selector=>app.document.querySelector(selector);
  assert.equal($('[data-open-request]').getAttribute('aria-disabled'), 'true');
  assert.equal($('[data-reward-goal]').dataset.threshold, '54000');
  app.click('[data-add-request]');
  assert.equal($('[data-reward-percent]').textContent, '52% de la meta');
  assert.match($('[data-reward-title]').textContent, /261.00 PEN/);
  const draft = {id:'test-reference', snapshot:'test'};
  $('[data-request-form]').decokasaDraft = draft;
  app.click('[data-option-link]:not([aria-current])'); await settle();
  assert.equal($('[data-request-form]').decokasaDraft, draft);
  assert.equal($('[data-reward-goal]').dataset.threshold, '54000');
  assert.equal($('[data-reward-current]').textContent, 'S/. 279.00 PEN');
  app.click('[data-add-request]');
  const items = JSON.parse(JSON.stringify($('[data-request-form]').decokasaRequestItems()));
  assert.deepEqual(items.map(item=>[item.title,item.shopify_variant_id,item.sku,item.quantity,item.price_cents]), [
    ['Blanco','DEMO-V-0-A','SKU-001',1,27900],
    ['Negro','DEMO-V-0-B','SKU-002',1,30000]
  ]);
  assert.equal($('[data-estimated-amount]').textContent, 'S/. 579.00 PEN');
  assert.equal($('[data-reward-current]').textContent, 'S/. 579.00 PEN');
  assert.equal($('[data-reward-percent]').textContent, '100% de la meta');
  assert.ok($('[data-reward-goal]').classList.contains('unlocked'));
  assert.equal($('[data-open-request]').getAttribute('aria-disabled'), 'false');
  assert.equal(app.document.querySelectorAll('[data-request-form-lines] li').length, 2);
  assert.equal(app.navigations.length, 0);
  // Repeating the current color merges quantities, not duplicate lines.
  app.click('[data-add-request]');
  assert.equal(app.document.querySelectorAll('[data-request-line]').length, 2);
  assert.equal($('[data-request-line="DEMO-V-0-B"] [data-line-quantity]').value, '2');
  assert.equal($('[data-estimated-amount]').textContent, 'S/. 879.00 PEN');
  app.click('[data-request-line="DEMO-V-0-A"] [data-line-step="1"]');
  assert.equal($('[data-estimated-amount]').textContent, 'S/. 1158.00 PEN');
  assert.ok($('[data-reward-modal-open]').classList.contains('unlocked'));
  app.click('[data-request-line="DEMO-V-0-B"] [data-line-remove]');
  assert.equal($('[data-estimated-amount]').textContent, 'S/. 558.00 PEN');
  assert.ok($('[data-reward-modal-open]').classList.contains('unlocked'));
  app.click('[data-line-step="-1"]');
  assert.equal($('[data-estimated-amount]').textContent, 'S/. 279.00 PEN');
  assert.equal($('[data-reward-modal-open]').classList.contains('unlocked'), false);
  app.click('[data-line-remove]');
  assert.equal($('[data-estimated-amount]').textContent, 'S/. 0.00 PEN');
  assert.equal($('[data-open-request]').getAttribute('aria-disabled'), 'true');
  assert.equal($('[data-enable-form]').disabled, true);
  assert.equal($('[data-reward-percent]').textContent, '0% de la meta');
});

test('Meta global usa el mayor precio de venta, aunque la variante no esté disponible, e ignora la meta fija anterior', async () => {
  const p = chair();
  p.variants[1].available = false;
  p.compare_at_price_max = 50000;
  const doc = parseHTML(await html(p, {reward_threshold:1000})).document;
  assert.equal(doc.querySelector('[data-reward-goal]').dataset.threshold, '54000');
  assert.match(doc.querySelector('[data-reward-action-text]').textContent, /540.00 PEN/);
  assert.match(doc.querySelector('.reward-modal-badge').textContent, /540.00 PEN/);
  assert.match(doc.querySelector('.reward-modal-lead').textContent, /540.00 PEN/);
  assert.equal(schema.settings.some(setting => setting.id === 'reward_threshold'), false);
});

test('Producto único: meta redondeada al céntimo, desbloqueo en el importe exacto y sin meta si el precio es cero', async () => {
  const single = productFixture({handle:'unico', name:'Producto único', price:1999, has_only_default_variant:true}, 1);
  const app = await runtime(() => { throw Error('No network needed'); }, single);
  const $ = selector => app.document.querySelector(selector);
  assert.equal($('[data-reward-goal]').dataset.threshold, '3598');
  assert.match($('[data-reward-action-text]').textContent, /35.98 PEN/);
  assert.match($('[data-reward-title]').textContent, /15.99 PEN/);
  const quantity = $('[data-product-quantity]');
  quantity.value = '2'; quantity.dispatchEvent(new app.window.Event('input', {bubbles:true}));
  assert.ok($('[data-reward-goal]').classList.contains('unlocked'));
  quantity.value = '1'; quantity.dispatchEvent(new app.window.Event('input', {bubbles:true}));
  assert.equal($('[data-reward-goal]').classList.contains('unlocked'), false);
  // An exact-boundary total must qualify, not require one more cent.
  $('[data-product-price]').dataset.cents = '3598';
  quantity.dispatchEvent(new app.window.Event('input', {bubbles:true}));
  assert.ok($('[data-reward-goal]').classList.contains('unlocked'));
  const noPrice = productFixture({handle:'sin-precio', name:'Por cotizar', price:0, has_only_default_variant:true}, 2);
  const empty = await runtime(() => { throw Error('No network needed'); }, noPrice);
  assert.equal(empty.document.querySelector('[data-reward-goal]'), null);
  assert.equal(empty.document.querySelector('[data-reward-modal]'), null);
});
test('Cantidades inválidas no se agregan y las ediciones válidas recalculan el total', async () => {
  const app = await runtime(()=>{throw Error('No network needed');}, chair());
  const $ = selector=>app.document.querySelector(selector);
  for (const value of ['0','-1','1.5','1000001','NaN','']) {
    $('[data-product-quantity]').value = value;
    app.click('[data-add-request]');
    assert.equal(app.document.querySelectorAll('[data-request-line]').length, 0);
  }
  $('[data-product-quantity]').value = '1'; app.click('[data-add-request]');
  const input = $('[data-line-quantity]');
  input.value = '3'; input.dispatchEvent(new app.window.Event('input', {bubbles:true}));
  assert.equal($('[data-estimated-amount]').textContent, 'S/. 837.00 PEN');
  input.value = '0'; input.dispatchEvent(new app.window.Event('change', {bubbles:true}));
  assert.equal(input.value, '3');
  assert.equal($('[data-estimated-amount]').textContent, 'S/. 837.00 PEN');
});
test('Un fallo al cambiar de color conserva la solicitud y permite reintentar', async () => {
  const app = await runtime(()=>({ok:false}), chair());
  app.click('[data-add-request]');
  app.click('[data-option-link]:not([aria-current])'); await settle();
  assert.equal(app.navigations.length, 0);
  assert.equal(app.document.querySelectorAll('[data-request-line]').length, 1);
  assert.equal(app.document.querySelector('[data-estimated-amount]').textContent, 'S/. 279.00 PEN');
  assert.match(app.document.querySelector('[data-selection-status]').textContent, /reintentar/);
});

