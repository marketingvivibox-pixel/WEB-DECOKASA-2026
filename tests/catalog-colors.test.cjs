const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {Liquid} = require('liquidjs');
const {parseHTML} = require('linkedom');
const {filters} = require('../scripts/product_fixture.cjs');

const root = path.resolve(__dirname, '..');
const engine = new Liquid({root: path.join(root, 'snippets'), extname: '.liquid'});
filters(engine);
engine.registerFilter('handleize', value => String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-'));
const source = fs.readFileSync(path.join(root, 'assets/decokasa.js'), 'utf8');

function fixture(overrides = {}) {
  const variants = [
    {id: '101', options: ['M', 'Negro'], available: true, featured_image: {src: '/negro.jpg'}},
    {id: '102', options: ['M', 'Azul'], available: false, featured_image: {src: '/azul-m.jpg'}},
    {id: '103', options: ['L', 'Azul'], available: true, featured_image: {src: '/azul-l.jpg'}},
    {id: '104', options: ['M', 'Marrón'], available: false, featured_image: null},
    {id: '105', options: ['M', 'Roble claro'], available: true, featured_image: {src: '/roble.jpg'}}
  ];
  const colors = [
    {name: 'Negro', variant: variants[0]},
    {name: 'Azul', variant: variants[1], swatch: {color: {rgb: '19 105 204'}}},
    {name: 'Marrón', variant: variants[3]},
    {name: 'Roble claro', variant: variants[4]}
  ];
  return {
    title: 'Silla de prueba', vendor: 'DECOKASA', type: 'Sillas', handle: 'silla-prueba',
    url: '/products/silla-prueba', metafields: {}, featured_image: {src: '/principal.jpg'},
    options_with_values: [{name: 'Talla', position: 1, values: [{name: 'M'}, {name: 'L'}]}, {name: 'Color', position: 2, values: colors}],
    selected_or_first_available_variant: variants[0], variants, ...overrides
  };
}
async function render(product) {
  return engine.parseAndRender("{% render 'product-card', product: product %}", {product});
}
function interactive(html) {
  const {window, document} = parseHTML(`<!doctype html><html><body>${html}</body></html>`);
  window.location = {search: '', href: 'https://example.com/collections/all'};
  window.sessionStorage = {getItem: () => null, setItem: () => {}, removeItem: () => {}};
  vm.runInNewContext(source, {window, document, URLSearchParams, Uint8Array, Intl, Event: window.Event, CustomEvent: window.CustomEvent});
  return {window, document, click: element => element.dispatchEvent(new window.Event('click', {bubbles: true, cancelable: true}))};
}

test('Las muestras representan variantes reales, incluso con talla y color combinados', async () => {
  const {document} = parseHTML(await render(fixture()));
  const colors = [...document.querySelectorAll('[data-card-color]')];
  assert.deepEqual(colors.map(x => x.dataset.colorName), ['Negro', 'Azul', 'Marrón', 'Roble claro']);
  assert.equal(colors[0].getAttribute('aria-current'), 'true');
  assert.equal(colors[1].getAttribute('href'), '/products/silla-prueba?variant=103');
  assert.equal(colors[1].querySelector('.catalog-color-dot').getAttribute('style'), 'background-color: rgb(19 105 204)');
  assert.match(colors[2].getAttribute('aria-label'), /no disponible/);
  assert.match(colors[3].className, /catalog-color-choice--text/);
  assert.equal(colors[3].textContent.trim(), 'Roble claro');
  assert.equal(document.querySelector('.catalog-product-photo').getAttribute('src'), '/negro.jpg');
  assert.ok([...document.querySelectorAll('[data-card-link]')].every(a => a.getAttribute('href').endsWith('variant=101')));
});

test('Cambiar color actualiza imagen, disponibilidad y enlaces solo en la tarjeta elegida', async () => {
  const html = await render(fixture());
  const page = interactive(html + html);
  const [first, second] = page.document.querySelectorAll('.catalog-card');
  assert.equal(page.click(first.querySelector('[data-color-name=Azul]')), false);
  assert.equal(first.querySelector('.catalog-product-photo').getAttribute('src'), '/azul-l.jpg');
  assert.equal(first.querySelector('[data-card-color-label]').textContent, 'Color: Azul');
  assert.ok([...first.querySelectorAll('[data-card-link]')].every(a => a.getAttribute('href').endsWith('variant=103')));
  assert.equal(second.querySelector('.catalog-product-photo').getAttribute('src'), '/negro.jpg');
  page.click(first.querySelector('[data-color-name="Marrón"]'));
  assert.equal(first.querySelector('.catalog-product-photo').getAttribute('src'), '/principal.jpg');
  assert.equal(first.querySelector('[data-card-image-reference]').hidden, false);
  assert.equal(first.querySelector('[data-card-image-pending]').hidden, true);
  assert.match(first.querySelector('[data-card-color-label]').textContent, /Marrón.*no disponible/);
  page.click(first.querySelector('[data-color-name=Negro]'));
  assert.equal(first.querySelector('.catalog-product-photo').hidden, false);
  assert.equal(first.querySelector('[data-card-image-reference]').hidden, true);
  assert.equal(first.querySelector('[data-card-image-pending]').hidden, true);
});

test('Un producto futuro sin fotos mantiene una presentación honesta al cambiar de color', async () => {
  const product = fixture({featured_image: null});
  const page = interactive(await render(product));
  const card = page.document.querySelector('.catalog-card');
  page.click(card.querySelector('[data-color-name="Marrón"]'));
  assert.equal(card.querySelector('.catalog-product-photo').hidden, true);
  assert.equal(card.querySelector('[data-card-image-pending]').hidden, false);
  assert.match(card.querySelector('[data-card-image-pending]').textContent, /Imagen de este color no disponible/);
});

test('Las tarjetas sin colores o con destino personalizado conservan sus enlaces', async () => {
  const plain = fixture({options_with_values: [{name: 'Talla', position: 1, values: [{name:'S'}, {name:'M'}]}]});
  const custom = fixture({metafields: {decokasa: {landing_url: {value: '/pages/landing-especial'}}}});
  for (const [product, expected] of [[plain, '/products/silla-prueba'], [custom, '/pages/landing-especial']]) {
    const {document} = parseHTML(await render(product));
    assert.equal(document.querySelector('[data-card-color]'), null);
    assert.ok([...document.querySelectorAll('[data-card-link]')].every(a => a.getAttribute('href') === expected));
  }
});
