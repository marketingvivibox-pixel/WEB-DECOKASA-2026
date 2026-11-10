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
    const district = form.querySelector('[name=district]');

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

    invalid.add(district);
    submit();
    assert.equal(submissions, 0);
    assert.match(progress(), /Paso 3 de 3/);
    invalid.delete(district);
    submit();
    assert.equal(submissions, 1);
    assert.equal(form.querySelector('[data-enable-form]').hidden, false);
    assert.equal(form.querySelector('[data-request-next]').hidden, true);
  });
}
