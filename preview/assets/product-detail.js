(function () {
  'use strict';
  if (window.decokasaProductDetail) return;
  window.decokasaProductDetail = true;
  const requests = new WeakMap();
  // Selection survives section replacement, but never leaves this page's memory.
  const selections = new WeakMap();
  const money = cents => `S/. ${(cents / 100).toFixed(2)} PEN`;
  const validQuantity = value => Number.isSafeInteger(Number(value)) && Number(value) >= 1 && Number(value) <= 1000000;
  function initRequestBuilder(page, updateEstimated) {
    const builder = page.querySelector('[data-request-builder]');
    if (!builder) return;
    const lines = selections.get(page) || [];
    selections.set(page, lines);
    const form = page.querySelector('[data-request-form]');
    const quantity = page.querySelector('[data-product-quantity]');
    const formQuantity = form.querySelector('[name=quantity]');
    // These legacy controls describe only the displayed variant, not the request.
    formQuantity.disabled = true;
    form.decokasaRequestItems = () => lines.map(line => ({...line}));
    const status = builder.querySelector('[data-request-builder-status]');
    const list = builder.querySelector('[data-request-lines]');
    const summary = document.createElement('ul');
    summary.className = 'request-form-lines';
    summary.dataset.requestFormLines = '';
    form.before(summary);
    function refreshSummary() {
      summary.replaceChildren();
      for (const line of lines) {
        const item = document.createElement('li');
        item.textContent = `${line.title}: ${line.quantity} × ${money(line.price_cents)} = ${money(line.quantity * line.price_cents)}`;
        summary.appendChild(item);
      }
      builder.querySelector('[data-request-empty]').hidden = lines.length > 0;
      page.querySelector('[data-open-request]').setAttribute('aria-disabled', String(!lines.length));
      form.querySelector('[data-enable-form]').disabled = !lines.length;
      const receipt = form.querySelector('[data-request-status]');
      if (receipt) receipt.hidden = true;
      updateEstimated();
    }
    function render() {
      list.replaceChildren();
      for (const line of lines) {
        const row = document.createElement('li');
        row.dataset.requestLine = line.shopify_variant_id;
        row.innerHTML = '<div class="request-line-info"><strong data-line-title></strong><small data-line-price></small></div><div class="product-quantity request-line-quantity"><button type="button" data-line-step="-1">−</button><input type="number" min="1" max="1000000" step="1" inputmode="numeric" data-line-quantity><button type="button" data-line-step="1">+</button></div><strong data-line-total></strong><button type="button" class="request-line-remove" data-line-remove>Quitar</button>';
        row.querySelector('[data-line-title]').textContent = line.title;
        row.querySelector('[data-line-price]').textContent = `${money(line.price_cents)} por unidad`;
        row.querySelector('[data-line-total]').textContent = money(line.quantity * line.price_cents);
        const input = row.querySelector('[data-line-quantity]');
        input.value = line.quantity;
        input.setAttribute('aria-label', `Cantidad de ${line.title}`);
        row.querySelector('[data-line-remove]').setAttribute('aria-label', `Quitar ${line.title}`);
        row.querySelectorAll('[data-line-step]').forEach(button => {
          const down = button.dataset.lineStep === '-1';
          button.setAttribute('aria-label', `${down ? 'Disminuir' : 'Aumentar'} cantidad de ${line.title}`);
          button.disabled = down ? line.quantity <= 1 : line.quantity >= 1000000;
        });
        list.appendChild(row);
      }
      refreshSummary();
    }
    page.querySelector('[data-add-request]').addEventListener('click', () => {
      if (!quantity.reportValidity() || !validQuantity(quantity.value)) return;
      const option = form.querySelector('[name=variant_id] option');
      if (!option?.value) return;
      const price = Number(option.dataset.price);
      if (!Number.isSafeInteger(price) || price < 0) return;
      const existing = lines.find(line => line.shopify_variant_id === option.value);
      const count = Number(quantity.value) + (existing?.quantity || 0);
      if (!validQuantity(count)) { status.textContent = 'La cantidad máxima por presentación es 1 000 000.'; return; }
      if (existing) existing.quantity = count;
      else lines.push({shopify_product_id: form.dataset.productId, shopify_variant_id: option.value, sku: option.dataset.sku || '', title: option.textContent.trim(), quantity: count, price_cents: price});
      quantity.value = '1';
      quantity.dispatchEvent(new Event('input', {bubbles: true}));
      render();
      status.textContent = `${option.textContent.trim()} agregado. Puedes elegir otro color o completar tu solicitud.`;
    });
    list.addEventListener('click', event => {
      const row = event.target.closest('[data-request-line]');
      if (!row) return;
      const index = lines.findIndex(line => line.shopify_variant_id === row.dataset.requestLine);
      if (index < 0) return;
      const line = lines[index];
      const step = event.target.closest('[data-line-step]');
      const remove = event.target.closest('[data-line-remove]');
      if (!step && !remove) return;
      if (remove) lines.splice(index, 1);
      else line.quantity = Math.max(1, Math.min(1000000, line.quantity + Number(step.dataset.lineStep)));
      render();
      status.textContent = remove ? `${line.title} eliminado de tu solicitud.` : `${line.title}: ${line.quantity} unidades en tu solicitud.`;
      const replacement = [...list.children].find(item => item.dataset.requestLine === line.shopify_variant_id);
      const focus = step && replacement?.querySelector(`[data-line-step="${step.dataset.lineStep}"]:not([disabled])`);
      (focus || replacement?.querySelector('[data-line-quantity]') || list.querySelector('[data-line-remove]') || page.querySelector('[data-add-request]')).focus();
    });
    function editQuantity(event) {
      const input = event.target.closest('[data-line-quantity]');
      if (!input) return;
      const row = input.closest('[data-request-line]');
      const line = lines.find(item => item.shopify_variant_id === row.dataset.requestLine);
      if (!line) return;
      if (!validQuantity(input.value)) {
        if (event.type === 'change') { input.value = line.quantity; status.textContent = 'Usa una cantidad entera entre 1 y 1 000 000. Para eliminarla, elige Quitar.'; }
        return;
      }
      line.quantity = Number(input.value);
      row.querySelector('[data-line-total]').textContent = money(line.quantity * line.price_cents);
      row.querySelector('[data-line-step="-1"]').disabled = line.quantity <= 1;
      row.querySelector('[data-line-step="1"]').disabled = line.quantity >= 1000000;
      refreshSummary();
    }
    list.addEventListener('input', editQuantity);
    list.addEventListener('change', editQuantity);
    render();
  }
  function init(scope = document) {
    const pages = scope.matches?.('[data-product-page]') ? [scope] : scope.querySelectorAll('[data-product-page]');
    pages.forEach(page => {
      if (page.dataset.enhanced) return;
      const quantity = page.querySelector('[data-product-quantity]');
      const formQuantity = page.querySelector('[data-request-form] [name=quantity]');
      if (!quantity || !formQuantity) return;
      const updateEstimated = () => {
        const priceEl = page.querySelector('[data-product-price]');
        let cents = Number(priceEl?.dataset.cents || 0);
        if (!cents && priceEl) {
          const match = priceEl.textContent.match(/\d[\d,.]*/);
          if (match) cents = Math.round(parseFloat(match[0].replace(/,/g, '')) * 100);
        }
        const lines = selections.get(page);
        const qty = lines ? lines.reduce((sum, line) => sum + line.quantity, 0) : Math.max(1, Number(quantity.value) || 1);
        const estimateEl = page.querySelector('[data-estimated-amount]');
        const breakdownEl = page.querySelector('[data-estimated-breakdown]');
        if (lines || cents > 0) {
          const totalCents = lines ? lines.reduce((sum, line) => sum + line.quantity * line.price_cents, 0) : qty * cents;
          const formatted = `S/. ${(totalCents / 100).toFixed(2)} PEN`;
          if (estimateEl) estimateEl.textContent = formatted;
          const isBoxes = !!page.querySelector('[data-pvc]');
          const unitText = isBoxes ? (qty === 1 ? 'caja' : 'cajas') : (qty === 1 ? 'unidad' : 'unidades');
          if (breakdownEl) {
            breakdownEl.textContent = lines ? `${qty} ${unitText} · ${lines.length} ${lines.length === 1 ? 'presentación' : 'presentaciones'}` : `${qty} ${unitText} × S/. ${(cents / 100).toFixed(2)} PEN`;
          }
          if (lines) page.querySelector('[data-estimated-label]').textContent = 'Total estimado de tu solicitud:';
          const formQtyEl = page.querySelector('[data-form-qty]');
          const formTotalEl = page.querySelector('[data-form-total]');
          if (formQtyEl) formQtyEl.textContent = `${qty} ${unitText}`;
          if (formTotalEl) formTotalEl.textContent = formatted;

          // Meta de objetivo: Regalo especial desde S/. 1,000.00 PEN (100,000 centavos)
          const goalCard = page.querySelector('[data-reward-goal]');
          if (goalCard) {
            const thresholdCents = Number(goalCard.dataset.threshold) || 100000;
            const percent = Math.min(100, Math.round((totalCents / thresholdCents) * 100));
            const fillEl = goalCard.querySelector('[data-reward-fill]');
            const titleEl = goalCard.querySelector('[data-reward-title]');
            const currentEl = goalCard.querySelector('[data-reward-current]');
            const percentEl = goalCard.querySelector('[data-reward-percent]');
            const subtextEl = goalCard.querySelector('[data-reward-subtext]');
            const iconEl = goalCard.querySelector('[data-reward-icon]');
            const trackEl = goalCard.querySelector('.reward-progress-track');
            const estimateBar = page.querySelector('[data-estimated-bar]');

            if (fillEl) fillEl.style.width = `${percent}%`;
            if (trackEl) trackEl.setAttribute('aria-valuenow', String(percent));
            if (currentEl) currentEl.textContent = formatted;
            if (percentEl) percentEl.textContent = `${percent}% de la meta`;

            const actionTextEl = goalCard.querySelector('[data-reward-action-text]');
            const actionBtn = goalCard.querySelector('[data-reward-modal-open]');

            if (totalCents >= thresholdCents) {
              goalCard.classList.add('unlocked');
              if (iconEl) iconEl.textContent = '🎉';
              if (actionTextEl) actionTextEl.textContent = '¡Regalo Desbloqueado! · Ver detalles';
              if (actionBtn) {
                actionBtn.classList.add('unlocked');
                actionBtn.setAttribute('title', '¡Meta alcanzada! Haz clic para ver detalles de tu regalo');
              }
              if (titleEl) {
                titleEl.innerHTML = '¡Felicidades! Has alcanzado la meta y desbloqueaste tu <strong>Regalo Especial</strong> 🎁';
              }
              if (subtextEl) {
                subtextEl.textContent = `¡Genial! Tu solicitud supera los S/. ${(thresholdCents / 100).toFixed(2)} PEN. Tu asesor confirmará tu regalo sorpresa al coordinar la entrega.`;
              }
              if (estimateBar && !estimateBar.querySelector('.reward-unlocked-badge')) {
                const badge = document.createElement('span');
                badge.className = 'reward-unlocked-badge';
                badge.innerHTML = '🎁 ¡Regalo Especial Desbloqueado!';
                estimateBar.appendChild(badge);
              }
            } else {
              goalCard.classList.remove('unlocked');
              if (iconEl) iconEl.textContent = '🎁';
              if (actionTextEl) actionTextEl.textContent = `Meta S/. ${(thresholdCents / 100).toFixed(0)} · Ver regalo`;
              if (actionBtn) {
                actionBtn.classList.remove('unlocked');
                actionBtn.setAttribute('title', 'Ver detalles y beneficios del regalo especial');
              }
              const diffCents = thresholdCents - totalCents;
              const remainingFormatted = `S/. ${(diffCents / 100).toFixed(2)} PEN`;
              if (titleEl) {
                titleEl.innerHTML = `¡Agrega <strong>${remainingFormatted}</strong> más para desbloquear tu <strong>Regalo Especial</strong>!`;
              }
              if (subtextEl) {
                subtextEl.textContent = `Al alcanzar un monto de gasto de S/. ${(thresholdCents / 100).toFixed(2)} PEN recibes un regalo especial con tu pedido.`;
              }
              const existingBadge = estimateBar?.querySelector('.reward-unlocked-badge');
              if (existingBadge) existingBadge.remove();
            }
          }
        }
      };
      const sync = () => {
        quantity.value = formQuantity.value;
        const stepDown = page.querySelector('[data-quantity-step="-1"]');
        const stepUp = page.querySelector('[data-quantity-step="1"]');
        if (stepDown) stepDown.disabled = Number(quantity.value) <= 1;
        if (stepUp) stepUp.disabled = Number(quantity.value) >= 1000000;
        updateEstimated();
      };
      formQuantity.addEventListener('input', sync);
      formQuantity.addEventListener('invalid', event => { event.preventDefault(); quantity.focus(); quantity.reportValidity(); });
      page.addEventListener('decokasa:quantity', sync);
      page.addEventListener('decokasa:variant', updateEstimated);
      page.addEventListener('change', event => {
        if (event.target.matches('[name=variant_id]')) {
          updateEstimated();
        }
      });
      quantity.addEventListener('input', () => { formQuantity.value = quantity.value; formQuantity.dispatchEvent(new Event('input', {bubbles: true})); updateEstimated(); });
      page.dataset.enhanced = 'true';
      page.querySelector('[data-purchase-controls]').hidden = false;
      initRequestBuilder(page, updateEstimated);
      sync();
    });
  }
  async function changeOption(page, link) {
    const destination = new URL(link.href, location.href);
    // Combined listings and other products keep Shopify's normal navigation.
    if (destination.origin !== location.origin || destination.pathname !== new URL(page.dataset.productUrl, location.href).pathname) { location.assign(link.href); return; }
    requests.get(page)?.abort();
    const controller = new AbortController();
    requests.set(page, controller);
    page.setAttribute('aria-busy', 'true');
    page.querySelector('[data-selection-status]').textContent = 'Actualizando presentación…';
    const requestURL = new URL(destination);
    requestURL.searchParams.set('section_id', page.dataset.sectionId);
    try {
      const response = await fetch(requestURL, {signal: controller.signal, headers: {'Accept': 'text/html'}});
      if (!response.ok) throw new Error('Section unavailable');
      const parsed = new DOMParser().parseFromString(await response.text(), 'text/html');
      const next = parsed.querySelector('[data-product-page]');
      if (!next || next.dataset.sectionId !== page.dataset.sectionId) throw new Error('Invalid section');
      if (controller.signal.aborted) return;
      // Preserve contact values only in memory. Never place them in URLs or storage.
      const saved = [...page.querySelectorAll('[data-request-form] input, [data-request-form] textarea, [data-pvc] input')].filter(input => input.name !== 'variant_id');
      for (const input of saved) {
        const replacement = [...next.querySelectorAll('input, textarea')].find(other => other.name === input.name);
        if (replacement) { replacement.value = input.value; replacement.checked = input.checked; }
      }
      next.querySelector('[data-request-details]').open = page.querySelector('[data-request-details]').open;
      if (selections.has(page)) selections.set(next, selections.get(page));
      next.querySelector('[data-request-form]').decokasaDraft = page.querySelector('[data-request-form]').decokasaDraft;
      page.replaceWith(next);
      // Global form initialization also runs when Shopify reloads an editor section.
      next.dispatchEvent(new CustomEvent('shopify:section:load', {bubbles: true}));
      init(next);
      history.replaceState(null, '', destination);
      next.querySelector('[data-selection-status]').textContent = 'Presentación actualizada.';
      const focusLink = [...next.querySelectorAll('[data-option-link]')].find(item => item.getAttribute('href') === link.getAttribute('href'));
      (focusLink || next.querySelector('[data-selection-status]')).focus({preventScroll: true});
    } catch (error) {
      if (error.name !== 'AbortError') {
        if (selections.get(page)?.length) page.querySelector('[data-selection-status]').textContent = 'No se pudo cambiar la presentación. Tu solicitud sigue guardada aquí; vuelve a elegir el color para reintentar.';
        else location.assign(destination.href);
      }
    } finally { page.removeAttribute('aria-busy'); }
  }
  document.addEventListener('click', event => {
    const page = event.target.closest('[data-product-page]');
    if (!page) return;
    const choice = event.target.closest('[data-gallery-choice]');
    if (choice && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      page.querySelectorAll('[data-gallery-panel]').forEach(panel => { panel.hidden = panel.dataset.galleryPanel !== choice.dataset.galleryChoice; });
      page.querySelectorAll('[data-gallery-choice]').forEach(item => { if (item === choice) item.setAttribute('aria-current', 'true'); else item.removeAttribute('aria-current'); });
      page.querySelector('[data-gallery-status]').textContent = choice.getAttribute('aria-label');
    }
    const step = event.target.closest('[data-quantity-step]');
    if (step) {
      const input = page.querySelector('[data-product-quantity]');
      input.value = Math.max(1, Math.min(1000000, (Number(input.value) || 1) + Number(step.dataset.quantityStep)));
      input.dispatchEvent(new Event('input', {bubbles: true}));
    }
    const cta = event.target.closest('[data-open-request]');
    if (cta) {
      event.preventDefault();
      if (cta.getAttribute('aria-disabled') === 'true') return;
      const input = page.querySelector('[data-product-quantity]');
      if (!selections.has(page) && !input.reportValidity()) return;
      page.querySelector('[data-request-details]').open = true;
      page.querySelector('[name=name]').focus();
    }
    const modalTrigger = event.target.closest('[data-reward-modal-open]');
    if (modalTrigger) {
      event.preventDefault();
      const modal = page.querySelector('[data-reward-modal]');
      if (modal) {
        if (typeof modal.showModal === 'function') {
          try { modal.showModal(); } catch (e) { modal.setAttribute('open', ''); }
        } else {
          modal.setAttribute('open', '');
        }
        modal.classList.add('is-open');
        modalTrigger.setAttribute('aria-expanded', 'true');
      }
    }
    const modalClose = event.target.closest('[data-reward-modal-close]');
    if (modalClose) {
      event.preventDefault();
      const modal = document.querySelector('[data-reward-modal]');
      if (modal) {
        if (typeof modal.close === 'function') {
          try { modal.close(); } catch (e) { modal.removeAttribute('open'); }
        } else {
          modal.removeAttribute('open');
        }
        modal.classList.remove('is-open');
        const trigger = document.querySelector('[data-reward-modal-open]');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }
    }
    const link = event.target.closest('[data-option-link]');
    if (link && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) { event.preventDefault(); if (link.getAttribute('aria-current') !== 'true') changeOption(page, link); }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      const modal = document.querySelector('[data-reward-modal][open], [data-reward-modal].is-open');
      if (modal) {
        if (typeof modal.close === 'function') {
          try { modal.close(); } catch (e) { modal.removeAttribute('open'); }
        } else {
          modal.removeAttribute('open');
        }
        modal.classList.remove('is-open');
        const trigger = document.querySelector('[data-reward-modal-open]');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }
    }
  });
  document.addEventListener('shopify:section:load', event => init(event.target));
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init()); else init();
})();
