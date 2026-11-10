const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { Liquid } = require('liquidjs');
const { parseHTML } = require('linkedom');
const root = path.resolve(__dirname, '..');
const engine = new Liquid({ root: path.join(root, 'snippets'), extname: '.liquid' });
require('../scripts/product_fixture.cjs').filters(engine);
engine.registerFilter('handleize', value => String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-'));
engine.registerFilter('asset_url', value => `/assets/${value}`);
const collections = require('./catalog-collections.json');
const routes = {root_url: '/', collections_url: '/collections', all_products_collection_url: '/collections/all', search_url: '/search'};
async function render(name, collection = {}, themeSettings = {}, sectionOverrides = {}, availableCollections = collections) {
  const raw = fs.readFileSync(path.join(root, 'sections', `${name}.liquid`), 'utf8');
  const schema = JSON.parse(raw.match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
  const source = raw.replace(/{% schema %}[\s\S]*?{% endschema %}/, '').replace(/{% (?:end)?paginate[^%]*%}/g, '');
  const html = await engine.parseAndRender(source, {routes, settings: themeSettings, collections: availableCollections, section: {settings: {...Object.fromEntries(schema.settings.filter(s => s.id).map(s => [s.id, s.default ?? ''])), ...sectionOverrides}}, shop: {vendors: [], types: []}, collection: {handle: 'all', url: '/collections/all', products: [], products_count: 0, filters: [], ...collection}});
  return parseHTML(html).document;
}
test('Shopify vacío conserva las cuatro marcas y las cinco categorías sin acciones inútiles', async () => {
  const doc = await render('catalog');
  const tabs = [...doc.querySelectorAll('.catalog-brands a')];
  assert.deepEqual(tabs.map(a => a.textContent.trim()), ['Todas las marcas', 'DECOKASA', 'Xion', 'Biflex', 'Mundo Baby']);
  assert.deepEqual(tabs.map(a => a.getAttribute('href')), ['/collections/all', '/collections/decokasa', '/collections/xion', '/collections/biflex', '/collections/mundo-baby']);
  assert.equal(doc.querySelectorAll('.catalog-route-links a').length, 9);
  assert.equal(doc.querySelector('#CatalogFilters button[type=submit]'), null);
  assert.equal(doc.querySelectorAll('[href*="/types?"], [href*="/vendors?"]').length, 0);
  assert.equal(doc.querySelectorAll('.product-card').length, 0);
  assert.match(doc.querySelector('.catalog-empty').textContent, /Estamos preparando/);
});
test('La colección de marca conserva su botón activo y la categoría conserva su título', async () => {
  const brand = await render('catalog', {handle: 'xion', url: '/collections/xion', title: 'Xion'});
  assert.equal(brand.querySelector('.catalog-brands [aria-current=page]').textContent.trim(), 'Xion');
  assert.equal(brand.querySelector('#CatalogFilters').getAttribute('action'), '/collections/xion');
  const category = await render('catalog', {handle: 'tecnologia', url: '/collections/tecnologia', title: 'Tecnología'});
  assert.equal(category.querySelector('.catalog-toolbar h2').textContent, 'Tecnología');
  assert.equal(category.querySelector('.catalog-route-links [aria-current=page]').textContent, 'Tecnología');
});
test('Cabecera e inicio llevan a colecciones permanentes', async () => {
  const header = await render('header'), home = await render('home');
  assert.deepEqual([...header.querySelectorAll('.category-panel a')].map(a => a.getAttribute('href')), ['/collections/all', '/collections/tecnologia', '/collections/electrodomesticos', '/collections/bebes', '/collections/fitness', '/collections/hogar-y-acabados']);
  assert.deepEqual([...home.querySelectorAll('.brand-visual')].map(a => a.getAttribute('href')), ['/collections/decokasa', '/collections/xion', '/collections/biflex', '/collections/mundo-baby']);
});
test('Los filtros nativos configurados conservan selección y botón de aplicación', async () => {
  const doc = await render('catalog', {filters: [{param_name: 'filter.p.vendor', values: [{param_name: 'filter.p.vendor', value: 'Xion', label: 'Xion', count: 1, active: true}]}]});
  assert.ok(doc.querySelector('input[name="filter.p.vendor"][checked]'));
  assert.ok(doc.querySelector('#CatalogFilters button[type=submit]'));
});

test('Las selecciones del editor reemplazan marcas, categorías y tarjetas sin editar enlaces', async () => {
  const changed = {handle: 'nueva-marca', title: 'Nueva marca', url: '/collections/otro-destino'};
  const settings = {catalog_brands: [changed], catalog_categories: [changed]};
  const catalog = await render('catalog', {handle: changed.handle}, settings);
  assert.deepEqual([...catalog.querySelectorAll('.catalog-brands a')].map(a => a.textContent.trim()), ['Todas las marcas', 'Nueva marca']);
  assert.equal(catalog.querySelector('.catalog-brands [aria-current=page]').getAttribute('href'), changed.url);
  const header = await render('header', {}, settings);
  assert.equal(header.querySelector('.category-shortcuts a').getAttribute('href'), changed.url);
  const home = await render('home', {}, {}, {xion_collection: changed});
  assert.equal(home.querySelector('.brand.xion').getAttribute('href'), changed.url);
});
test('No se generan enlaces a colecciones iniciales eliminadas o no disponibles', async () => {
  const header = await render('header', {}, {}, {}, {});
  assert.equal(header.querySelectorAll('.category-panel a').length, 1);
  const home = await render('home', {}, {}, {}, {});
  assert.ok([...home.querySelectorAll('.brand-visual')].every(a => a.getAttribute('href') === '/collections/all'));
});
