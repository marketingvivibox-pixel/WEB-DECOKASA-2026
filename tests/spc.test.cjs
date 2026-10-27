const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { Liquid } = require('liquidjs');
const { parseHTML } = require('linkedom');
const { calculate } = require('../assets/landing-piso-spc.js');
const root = path.resolve(__dirname, '..');
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
test('SPC: datos nativos y privacidad del contenido de muestra en el tema', async () => {
  const engine = new Liquid({root:path.join(root, 'snippets'), extname:'.liquid'});
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
  assert.equal(doc.querySelector('.spc-testimonials'), null);
  assert.equal(doc.querySelector('.spc-seals'), null);
  assert.equal(doc.querySelectorAll('[data-color]').length, 3);
  assert.ok(doc.querySelector('.spc-button--catalog').getAttribute('href').startsWith('#spc-colores-'));
  assert.equal(doc.querySelectorAll('img[src$=".jpg"]').length, 0);
  const preview = parseHTML(await engine.parseAndRender(source, {...context, section:{...context.section, settings:{...settings, spc_design_preview:true}}})).document;
  assert.equal(preview.querySelectorAll('.spc-quote').length, 2);
  assert.equal(preview.querySelectorAll('.spc-seals img').length, 6);
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
  engine.registerFilter('asset_url', n => `/assets/${n}`);
  engine.registerFilter('stylesheet_tag', n => `<link rel="stylesheet" href="${n}">`);
  const raw = fs.readFileSync(path.join(root, 'sections/landing-piso-spc.liquid'), 'utf8');
  const source = raw.replace(/{% schema %}[\s\S]*?{% endschema %}/, '');
  const doc = parseHTML(await engine.parseAndRender(source, {
    section:{id:'spc-test', settings:{coverage_m2:'2.196', whatsapp_phone:'51941599516'}, blocks:[]},
    product:{title:'Piso SPC', selected_or_first_available_variant:{sku:'SPC-001'}}
  })).document;

  assert.equal(doc.querySelectorAll('[data-calc-mode]').length, 2);
  assert.ok(doc.querySelector('[data-calc-mode="dimensions"]'));
  assert.ok(doc.querySelector('[data-calc-mode="direct"]'));
  assert.ok(doc.querySelector('[data-known-meters-toggle]'));
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
