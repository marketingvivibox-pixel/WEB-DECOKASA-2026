(function () {
  'use strict';
  if (window.decokasaProductDetail) return;
  window.decokasaProductDetail = true;
  const requests = new WeakMap();
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
        const qty = Math.max(1, Number(quantity.value) || 1);
        const estimateEl = page.querySelector('[data-estimated-amount]');
        const breakdownEl = page.querySelector('[data-estimated-breakdown]');
        if (cents > 0) {
          const totalCents = qty * cents;
          const formatted = `S/. ${(totalCents / 100).toFixed(2)} PEN`;
          if (estimateEl) estimateEl.textContent = formatted;
          const isBoxes = !!page.querySelector('[data-pvc]');
          const unitText = isBoxes ? (qty === 1 ? 'caja' : 'cajas') : (qty === 1 ? 'unidad' : 'unidades');
          if (breakdownEl) {
            breakdownEl.textContent = `${qty} ${unitText} × S/. ${(cents / 100).toFixed(2)} PEN`;
          }
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
      // Preserve contact values only in memory. Never place them in URLs or storage.
      const saved = [...page.querySelectorAll('[data-request-form] input, [data-request-form] textarea, [data-pvc] input')].filter(input => input.name !== 'variant_id');
      for (const input of saved) {
        const replacement = [...next.querySelectorAll('input, textarea')].find(other => other.name === input.name);
        if (replacement) { replacement.value = input.value; replacement.checked = input.checked; }
      }
      next.querySelector('[data-request-details]').open = page.querySelector('[data-request-details]').open;
      page.replaceWith(next);
      // Global form initialization also runs when Shopify reloads an editor section.
      next.dispatchEvent(new CustomEvent('shopify:section:load', {bubbles: true}));
      init(next);
      history.replaceState(null, '', destination);
      next.querySelector('[data-selection-status]').textContent = 'Presentación actualizada.';
      const focusLink = [...next.querySelectorAll('[data-option-link]')].find(item => item.getAttribute('href') === link.getAttribute('href'));
      (focusLink || next.querySelector('[data-selection-status]')).focus({preventScroll: true});
    } catch (error) {
      if (error.name !== 'AbortError') location.assign(destination.href);
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
      if (!input.reportValidity()) return;
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
