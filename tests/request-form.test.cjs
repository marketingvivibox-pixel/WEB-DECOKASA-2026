const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const { parseHTML } = require('linkedom');

const root = path.resolve(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'assets/request-form.js'), 'utf8');

for (const page of ['landing-audifonos.html', 'landing-piso-spc.html']) {
  test(`${page}: pasos, validación y conservación de datos`, () => {
    const { document, window } = parseHTML(fs.readFileSync(path.join(root, 'preview', page), 'utf8'));
    delete window.decokasaRequestForms;
    const form = document.querySelector('[data-request-form]');
    const box = form.closest('.request-form-box');
    const fields = [...form.querySelectorAll('input, select, textarea')];
    const invalid = new Set();
    let reports = 0;
    for (const field of fields) {
      field.checkValidity = () => !invalid.has(field);
      field.reportValidity = () => { reports += 1; return !invalid.has(field); };
    }
    vm.runInNewContext(script, { window, document });
    window.decokasaRequestForms.init(document); // Reinitializing must not duplicate listeners.
    let submissions = 0;
    form.addEventListener('submit', event => { event.preventDefault(); submissions += 1; });
    const click = selector => form.querySelector(selector).dispatchEvent(new window.Event('click', { bubbles: true, cancelable: true }));
    const submit = () => form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
    const progress = () => box.querySelector('[data-request-progress]').textContent;
    const visibleSteps = () => [...form.querySelectorAll('[data-request-step]')].filter(step => !step.hidden).length;
    const quantity = form.querySelector('[name=quantity]');
    const name = form.querySelector('[name=name]');

    assert.match(progress(), /Paso 1 de 3/);
    invalid.add(quantity);
    click('[data-request-next]');
    assert.match(progress(), /Paso 1 de 3/);
    assert.equal(reports, 1);
    invalid.delete(quantity);
    click('[data-request-next]');
    assert.match(progress(), /Paso 2 de 3/);
    assert.equal(visibleSteps(), 1);
    assert.equal(box.querySelectorAll('[aria-current=step]').length, 1);

    name.value = 'Cliente de prueba';
    invalid.add(name);
    submit();
    assert.equal(submissions, 0);
    assert.match(progress(), /Paso 2 de 3/);
    invalid.delete(name);
    submit();
    assert.equal(submissions, 0);
    assert.match(progress(), /Paso 3 de 3/);
    click('[data-request-back]');
    assert.equal(name.value, 'Cliente de prueba');
    click('[data-request-next]');

    for (const fieldName of ['department', 'province', 'district', 'street_address']) {
      const field = form.querySelector(`[name="${fieldName}"]`);
      assert.ok(field?.hasAttribute('required'), `${fieldName} es obligatorio`);
      invalid.add(field);
      submit();
      assert.equal(submissions, 0);
      assert.match(progress(), /Paso 3 de 3/);
      invalid.delete(field);
    }
    submit();
    assert.equal(submissions, 1);
    assert.equal(form.querySelector('[data-enable-form]').hidden, false);
    assert.equal(form.querySelector('[data-request-next]').hidden, true);
  });

  test(`${page}: vista previa de la ficha de entrega sin envío`, () => {
    const { document, window } = parseHTML(fs.readFileSync(path.join(root, 'preview', page), 'utf8'));
    delete window.decokasaRequestForms;
    vm.runInNewContext(script, { window, document });
    const form = document.querySelector('[data-request-form]');
    const values = {
      name: 'Cliente ficticio', phone: '999 111 222', email: 'prueba@example.invalid',
      department: 'Lima', province: 'Lima', district: 'Miraflores',
      street_address: 'Calle de prueba 123', address_details: 'Piso 2',
      address_reference: 'Frente al parque', comment: 'Solo datos de prueba'
    };
    for (const [name, value] of Object.entries(values)) form.querySelector(`[name="${name}"]`).value = value;
    const preview = window.decokasaRequestForms.formatSummary(form, {
      reference: 'test-123',
      items: [
        { title: 'Negro', quantity: 2, sku: 'DEMO-1', price_cents: 1234 },
        { title: 'Gris', quantity: 1, sku: 'DEMO-2', price_cents: 1000 }
      ]
    });
    for (const value of Object.values(values)) assert.ok(preview.includes(value), value);
    assert.match(preview, /Negro: 2 unidad\(es\).*SKU: DEMO-1.*24\.68/);
    assert.match(preview, /Gris: 1 unidad\(es\).*SKU: DEMO-2.*10\.00/);
    assert.match(preview, /Total estimado: S\/\. 34\.68 PEN/);
    assert.match(preview, /no fue enviada ni registrada/);
    assert.match(preview, /no confirma el teléfono/);
    assert.match(preview, /Referencia de prueba: test-123/);
    for (const field of ['email', 'address_details', 'address_reference', 'comment']) form.querySelector(`[name="${field}"]`).value = '';
    const single = window.decokasaRequestForms.formatSummary(form);
    assert.match(single, /Presentación:/);
    assert.match(single, /Cantidad:/);
    assert.doesNotMatch(single, /Correo:|Interior o urbanización:|Referencia de entrega:|Comentario:/);
  });
}
