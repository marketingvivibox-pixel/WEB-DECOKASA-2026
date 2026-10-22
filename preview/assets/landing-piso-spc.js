(function () {
  'use strict';
  function calculate(area, coverage, waste) {
    area = Number(area); coverage = Number(coverage);
    if (!Number.isFinite(area) || area < 0.01 || area > 100000 || !Number.isFinite(coverage) || coverage <= 0) return null;
    const boxes = Math.ceil(area * (waste ? 1.1 : 1) / coverage - 1e-10);
    return { boxes, covered: boxes * coverage };
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = { calculate };
  if (typeof document === 'undefined' || window.DecokasaSPC) return;
  const initialized = new WeakSet();
  const number = new Intl.NumberFormat('es-PE', { maximumFractionDigits: 2 });
  function init(scope) {
    const pages = [...scope.querySelectorAll('[data-spc-page]')];
    if (scope.matches?.('[data-spc-page]')) pages.unshift(scope);
    pages.forEach(page => {
      if (initialized.has(page)) return;
      initialized.add(page);
      const swatches = [...page.querySelectorAll('[data-color]')];
      const status = page.querySelector('[data-color-status]');
      const form = page.querySelector('[data-spc-calculator]');
      const area = form.elements.area, waste = form.elements.waste;
      const error = form.querySelector('[data-calc-error]');
      const result = form.querySelector('[data-calc-result]');
      let selected = 0, calculation = null;
      const contact = () => {
        if (!calculation) return;
        const sku = page.dataset.sku ? ` (SKU ${page.dataset.sku})` : '';
        const message = `Hola, quiero asesoría sobre ${page.dataset.product}${sku}. Área: ${number.format(Number(area.value))} m². Estimación: ${calculation.boxes} cajas (${number.format(calculation.covered)} m²), ${waste.checked ? 'con 10% adicional para cortes' : 'sin adicional para cortes'}. Color de referencia: ${swatches[selected].dataset.color}. Quisiera confirmar disponibilidad y cotización.`;
        form.querySelector('[data-calc-contact]').href = `https://wa.me/${page.dataset.phone}?text=${encodeURIComponent(message)}`;
      };
      const choose = index => {
        selected = (index + swatches.length) % swatches.length;
        swatches.forEach((swatch, i) => swatch.setAttribute('aria-pressed', String(i === selected)));
        status.textContent = `${swatches[selected].dataset.color} · Color de referencia`;
        contact();
      };
      swatches.forEach((swatch, i) => swatch.addEventListener('click', () => choose(i)));
      page.querySelectorAll('[data-color-step]').forEach(button => {
        button.hidden = false;
        button.addEventListener('click', () => choose(selected + Number(button.dataset.colorStep)));
      });
      form.noValidate = true;
      form.addEventListener('input', () => {
        calculation = null; result.hidden = true; error.hidden = true; area.removeAttribute('aria-invalid');
      });
      form.addEventListener('submit', event => {
        event.preventDefault();
        calculation = calculate(area.value, page.dataset.coverage, waste.checked);
        result.hidden = !calculation; error.hidden = !!calculation;
        if (!calculation) {
          error.textContent = Number(page.dataset.coverage) > 0 ? 'Ingresa un área entre 0.01 y 100 000 m².' : 'Consulta al asesor para confirmar el rendimiento por caja.';
          area.setAttribute('aria-invalid', 'true'); area.focus(); return;
        }
        area.removeAttribute('aria-invalid');
        form.querySelector('[data-boxes]').textContent = `${calculation.boxes} ${calculation.boxes === 1 ? 'caja' : 'cajas'}`;
        form.querySelector('[data-covered]').textContent = `${number.format(calculation.covered)} m² en total · ${waste.checked ? 'con 10% adicional para cortes' : 'sin adicional para cortes'}`;
        contact();
      });
    });
  }
  window.DecokasaSPC = { init };
  init(document);
  document.addEventListener('shopify:section:load', event => init(event.target));
})();
