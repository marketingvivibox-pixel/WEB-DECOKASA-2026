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
  document.addEventListener('shopify:section:load', event=>loaded.push(event.target));
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

  // Cantidad para superar S/. 1,000 PEN (precio base 120 * 10 = 1200)
  const quantity = app.document.querySelector('[data-product-quantity]');
  quantity.value = '10';
  quantity.dispatchEvent(new app.window.Event('input', { bubbles: true }));
  assert.ok(actionBtn.classList.contains('unlocked'));
  assert.match(app.document.querySelector('[data-reward-action-text]').textContent, /¡Regalo Desbloqueado!/);
});

test('La previsualización del monto estimado se actualiza en tiempo real al cambiar la cantidad', async () => {
  const nextHTML = await html(product(0));
  const app = await runtime(() => ({ ok: true, text: async () => nextHTML }));
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

