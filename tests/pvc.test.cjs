const test = require('node:test');
const assert = require('node:assert/strict');
const {parseArea, calculate, matchVariant, quoteMessage} = require('../assets/landing-piso-pvc.js');
const fs = require('node:fs');
const path = require('node:path');
const {Liquid} = require('liquidjs');
const {parseHTML} = require('linkedom');
const {filters} = require('../scripts/product_fixture.cjs');

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
  const context = {section:{id:'pvc-test', settings:main.settings, blocks}, product:{title:'Piso PVC', variants:[]}};
  const render = async section => parseHTML(await engine.parseAndRender(source, {...context, section})).document;
  const doc = await render(context.section);
  assert.equal(doc.querySelectorAll('.pvc-review--sample').length, 5);
  assert.match(doc.querySelector('.pvc-testimonials__note').textContent, /No son reseñas de clientes reales/);
  assert.ok([...doc.querySelectorAll('.pvc-review')].every(card => card.querySelector('.pvc-review__label').textContent === 'Ejemplo ilustrativo'));
  assert.ok([...doc.querySelectorAll('.pvc-review img')].every(img => img.alt === 'Retrato ilustrativo del mockup'));
  assert.equal(doc.querySelectorAll('.pvc-swatch').length, 20);
  assert.equal(doc.querySelector('[data-finish-rail]'), null);
  assert.ok(doc.querySelector('[data-pvc] [data-area]'));
  assert.equal(doc.querySelector('[data-pvc-landing]').dataset.coverage, '5');
  assert.equal(doc.querySelector('[data-rail-controls]').hidden, true);

  const real = await render({...context.section, blocks:[...blocks,
    {type:'testimonial', settings:{name:'Ana <Cliente>', city:'Lima', headline:'Mi experiencia', quote:'Reseña real autorizada'}},
    {type:'testimonial', settings:{name:'Sin publicar', quote:''}}
  ]});
  assert.equal(real.querySelectorAll('.pvc-review').length, 1);
  assert.equal(real.querySelector('.pvc-review--sample'), null);
  assert.equal(real.querySelector('.pvc-testimonials__note'), null);
  assert.equal(real.querySelector('.pvc-review h3').textContent, 'Ana <Cliente>');
  assert.equal(real.querySelector('.pvc-review h3').children.length, 0);
  assert.equal(real.querySelectorAll('.pvc-swatch').length, 20);
  const disabled = await render({...context.section, settings:{...main.settings, show_illustrative_testimonials:false}});
  assert.equal(disabled.querySelector('.pvc-testimonials'), null);
});
