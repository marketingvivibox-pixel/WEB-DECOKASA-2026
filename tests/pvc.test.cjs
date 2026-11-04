const test = require('node:test');
const assert = require('node:assert/strict');
const {parseArea, calculate, matchVariant, quoteMessage} = require('../assets/landing-piso-pvc.js');

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
