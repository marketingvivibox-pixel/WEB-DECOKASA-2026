(function () {
  'use strict';
  if (window.decokasaRequestForms) return;

  // Local preview only. These values must not be sent or placed in a URL until
  // a real, server-verified request flow has been configured and tested.
  function formatSummary(form, options = {}) {
    const value = name => form.querySelector(`[name="${name}"]`)?.value?.trim() || '';
    const lines = ['Simulación completada. Esta solicitud no fue enviada ni registrada.'];
    if (options.reference) lines.push(`Referencia de prueba: ${options.reference}`);
    lines.push('', `Producto: ${form.dataset.productTitle || 'Producto seleccionado'}`);
    if (Array.isArray(options.items)) {
      for (const item of options.items) {
        const sku = item.sku ? ` · SKU: ${item.sku}` : '';
        lines.push(`${item.title}: ${item.quantity} unidad(es)${sku} · S/. ${(item.quantity * item.price_cents / 100).toFixed(2)} PEN`);
      }
      const total = options.items.reduce((sum, item) => sum + item.quantity * item.price_cents, 0);
      lines.push(`Total estimado: S/. ${(total / 100).toFixed(2)} PEN`);
    } else {
      const select = form.querySelector('[name="variant_id"]');
      const option = select?.selectedOptions?.[0] || select?.querySelector('option[selected]') || select?.querySelector('option');
      if (option) lines.push(`Presentación: ${option.textContent.trim()}${option.dataset.sku ? ` · SKU: ${option.dataset.sku}` : ''}`);
      lines.push(`Cantidad: ${value('quantity')}`);
      const total = form.querySelector('[data-form-total]')?.textContent?.trim();
      if (total) lines.push(`Total estimado: ${total}`);
    }
    lines.push('', `Nombre: ${value('name')}`, `Teléfono: ${value('phone')}`);
    if (value('email')) lines.push(`Correo: ${value('email')}`);
    lines.push(`Dirección: ${value('street_address')}`);
    if (value('address_details')) lines.push(`Interior o urbanización: ${value('address_details')}`);
    lines.push(`Distrito: ${value('district')}`, `Provincia: ${value('province')}`, `Departamento: ${value('department')}`);
    if (value('address_reference')) lines.push(`Referencia de entrega: ${value('address_reference')}`);
    if (value('comment')) lines.push(`Comentario: ${value('comment')}`);
    lines.push('', 'Vista previa de prueba: no confirma el teléfono, la disponibilidad ni el importe.');
    return lines.join('\n');
  }

  function initForm(form) {
    if (form.dataset.requestStepsInitialized) return;
    const box = form.closest('.request-form-box');
    const steps = [...form.querySelectorAll('[data-request-step]')];
    const markers = [...box.querySelectorAll('[data-request-progress-item]')];
    const progress = box.querySelector('[data-request-progress]');
    const back = form.querySelector('[data-request-back]');
    const next = form.querySelector('[data-request-next]');
    const submit = form.querySelector('[data-enable-form]');
    if (!steps.length || !back || !next || !submit) return;
    form.dataset.requestStepsInitialized = 'true';
    let current = 0;

    function showStep(index, focus) {
      current = Math.max(0, Math.min(steps.length - 1, index));
      form.dataset.requestStep = String(current);
      steps.forEach((step, i) => { step.hidden = i !== current; });
      markers.forEach((marker, i) => {
        marker.classList.toggle('is-complete', i < current);
        if (i === current) marker.setAttribute('aria-current', 'step');
        else marker.removeAttribute('aria-current');
      });
      if (progress) progress.textContent = `Paso ${current + 1} de ${steps.length}`;
      back.hidden = current === 0;
      next.hidden = current === steps.length - 1;
      submit.hidden = current !== steps.length - 1;
      if (focus) {
        steps[current].querySelector('[data-request-step-heading]')?.focus();
        const dialog = form.closest('dialog');
        if (dialog) dialog.scrollTop = 0;
      }
    }

    function validStep(index) {
      const controls = steps[index].querySelectorAll('input, select, textarea');
      for (const control of controls) {
        if (control.disabled || control.willValidate === false || typeof control.checkValidity !== 'function' || control.checkValidity()) continue;
        showStep(index, false);
        control.reportValidity();
        return false;
      }
      return true;
    }

    back.addEventListener('click', () => showStep(current - 1, true));
    next.addEventListener('click', () => {
      if (validStep(current)) showStep(current + 1, true);
    });
    // Capture before either product implementation handles the final simulation.
    form.addEventListener('submit', event => {
      if (current < steps.length - 1) {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (validStep(current)) showStep(current + 1, true);
        return;
      }
      for (let i = 0; i < steps.length; i += 1) {
        if (!validStep(i)) {
          event.preventDefault();
          event.stopImmediatePropagation();
          return;
        }
      }
    }, true);
    form.addEventListener('input', () => {
      const status = form.querySelector('[data-request-status]');
      if (status) status.hidden = true;
    });
    form.decokasaShowRequestStep = showStep;
    showStep(0, false);
  }

  function init(scope = document) {
    if (scope.matches?.('[data-request-form]')) initForm(scope);
    scope.querySelectorAll('[data-request-form]').forEach(initForm);
  }
  window.decokasaRequestForms = { init, formatSummary };
  document.addEventListener('shopify:section:load', event => init(event.target));
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init());
  else init();
})();
