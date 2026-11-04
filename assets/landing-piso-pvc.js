(function () {
  'use strict';

  function parseArea(value) {
    const text = String(value ?? '').trim();
    if (!/^\d+(?:[.,]\d+)?$/.test(text)) return null;
    const area = Number(text.replace(',', '.'));
    return Number.isFinite(area) && area >= 0.1 && area <= 10000 ? area : null;
  }

  function calculate(areaValue, includeCuts, coverageValue) {
    const area = parseArea(areaValue);
    const coverage = Number(coverageValue);
    if (area === null || !Number.isFinite(coverage) || coverage <= 0) return null;
    const required = area * (includeCuts ? 1.1 : 1);
    const boxes = Math.ceil(Number((required / coverage).toFixed(10)));
    return {area, coverage, required, boxes, covered: Number((boxes * coverage).toFixed(4)), includeCuts: !!includeCuts};
  }

  function matchVariant(sku, variants, finish = '') {
    // Confirmed finishes are Shopify's Acabado option; an explicit SKU takes precedence.
    if (!String(sku || '').trim() && !finish) return null;
    const matches = variants.filter(variant => sku ? variant.sku === sku : variant.finish === finish);
    return matches.length === 1 ? matches[0] : null;
  }

  function quoteMessage(title, finish, result, variant) {
    const lines = [`Hola, quiero cotizar ${title}.`];
    if (finish) lines.push(`Acabado: ${finish}.`);
    if (variant?.sku) lines.push(`SKU: ${variant.sku}.`);
    lines.push(`Área: ${result.area} m²${result.includeCuts ? ' + 10% para cortes' : ''}.`);
    lines.push(`Cálculo referencial: ${result.boxes} ${result.boxes === 1 ? 'caja' : 'cajas'} de ${result.coverage} m² (${result.covered} m² de cobertura).`);
    lines.push('Por favor, confirmen presentación, precio, disponibilidad y envío.');
    return lines.join('\n');
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = {parseArea, calculate, matchVariant, quoteMessage};
  if (typeof document === 'undefined' || window.DecokasaPvc) return;
  const instances = new Map();
  const number = new Intl.NumberFormat('es-PE', {maximumFractionDigits: 2});
  const money = new Intl.NumberFormat('es-PE', {style: 'currency', currency: 'PEN'});

  function initialize(root) {
    if (instances.has(root)) return;
    const events = new AbortController();
    const on = (element, type, callback, options = {}) => element?.addEventListener(type, callback, {...options, signal: events.signal});
    const area = root.querySelector('[data-area]');
    const waste = root.querySelector('[data-waste]');
    const error = root.querySelector('[data-area-error]');
    const boxes = root.querySelector('[data-boxes]');
    const covered = root.querySelector('[data-covered]');
    const total = root.querySelector('[data-total]');
    const quote = root.querySelector('[data-quote]');
    const miniFloor = root.querySelector('[data-mini-floor]');
    const catalog = root.querySelector('[data-catalog]');
    const rail = root.querySelector('[data-finish-rail]');
    const pauseButton = root.querySelector('[data-rail-pause]');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const variants = JSON.parse(root.querySelector('[data-pvc-variants]')?.textContent || '[]');
    const swatches = [...root.querySelectorAll('.pvc-swatch')];
    let finish = '', variant = null, opener = null, previousOverflow = '', dialogLocked = false;
    let debounce = 0, animationFrame = 0, tileFrame = 0, railFrame = 0, resumeTimer = 0;
    let paused = motion.matches, hovering = false, touching = false, inView = false, focused = false;
    let lastTime = 0, railPosition = 0, loopWidth = 0;

    function animateTiles() {
      cancelAnimationFrame(tileFrame);
      miniFloor.classList.remove('is-building');
      if (motion.matches) return;
      // Two frames restart the animation even when two values are changed quickly.
      tileFrame = requestAnimationFrame(() => { tileFrame = requestAnimationFrame(() => miniFloor.classList.add('is-building')); });
    }

    function update(animate = true) {
      const coverage = Number(variant?.coverage) > 0 ? variant.coverage : root.dataset.coverage;
      const result = calculate(area.value, waste.checked, coverage);
      area.setAttribute('aria-invalid', String(!result));
      error.hidden = !!result;
      quote.setAttribute('aria-disabled', String(!result));
      total.hidden = true;
      if (!result) {
        boxes.textContent = '—';
        covered.textContent = 'Revisa el área para calcular tu proyecto.';
        quote.removeAttribute('href');
        miniFloor.classList.remove('is-building');
        return;
      }
      boxes.textContent = `${number.format(result.boxes)} ${result.boxes === 1 ? 'caja' : 'cajas'}`;
      covered.textContent = `${number.format(result.covered)} m² de cobertura · ${number.format(result.coverage)} m² por caja`;
      if (variant && Number(variant.price) > 0) {
        total.hidden = false;
        total.textContent = `${money.format(result.boxes * variant.price / 100)} estimados`;
      }
      quote.href = `https://wa.me/${root.dataset.phone}?text=${encodeURIComponent(quoteMessage(root.dataset.productTitle, finish, result, variant))}`;
      if (animate) animateTiles();
    }

    function unlockDialog() {
      if (dialogLocked) document.body.style.overflow = previousOverflow;
      dialogLocked = false;
      opener?.focus({preventScroll: true});
    }

    function closeCatalog() { if (catalog.open) catalog.close(); }
    on(catalog, 'close', unlockDialog);
    on(catalog, 'click', event => {
      if (event.target !== catalog) return;
      const box = catalog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeCatalog();
    });

    on(root, 'click', event => {
      const openButton = event.target.closest('[data-catalog-open]');
      if (openButton) {
        opener = openButton;
        previousOverflow = document.body.style.overflow;
        catalog.showModal();
        document.body.style.overflow = 'hidden';
        dialogLocked = true;
      }
      if (event.target.closest('[data-catalog-close]')) closeCatalog();
      const pick = event.target.closest('[data-pick-finish]');
      if (!pick) return;
      finish = pick.dataset.pickFinish;
      const swatch = swatches.find(item => item.dataset.pickFinish === finish);
      variant = matchVariant(swatch?.dataset.finishSku, variants, finish);
      root.querySelector('[data-selected-name]').textContent = finish;
      root.querySelectorAll('[data-pick-finish]').forEach(item => item.setAttribute('aria-pressed', String(item.dataset.pickFinish === finish)));
      const source = swatch?.querySelector('img')?.src;
      if (source) miniFloor.style.setProperty('--finish', `url("${source.replace(/["\\\n\r]/g, '')}")`);
      update();
      closeCatalog();
      if (pick.closest('[data-finish-rail]')) {
        root.querySelector('.pvc-selected').focus({preventScroll: true});
        root.querySelector('[data-pvc]').scrollIntoView({behavior: motion.matches ? 'instant' : 'smooth', block: 'center'});
      }
    });
    on(area, 'input', () => { clearTimeout(debounce); debounce = setTimeout(update, 180); });
    on(waste, 'change', () => update());
    on(quote, 'click', event => {
      clearTimeout(debounce);
      update(false);
      if (quote.getAttribute('aria-disabled') === 'true') {event.preventDefault(); area.focus();}
    });

    if (rail && rail.children.length > 1) {
      const originals = [...rail.children];
      originals.forEach(card => {
        const clone = card.cloneNode(true);
        clone.dataset.railClone = '';
        clone.setAttribute('aria-hidden', 'true');
        clone.setAttribute('tabindex', '-1');
        rail.appendChild(clone);
      });
      function measureRail() {
        const clone = rail.querySelector('[data-rail-clone]');
        loopWidth = clone.getBoundingClientRect().left - originals[0].getBoundingClientRect().left;
        railPosition = rail.scrollLeft;
      }
      function normalizeScroll() {
        if (!loopWidth) return;
        if (rail.scrollLeft >= loopWidth) rail.scrollLeft -= loopWidth;
        if (rail.scrollLeft < 0) rail.scrollLeft += loopWidth;
        railPosition = rail.scrollLeft;
      }
      function stop() {cancelAnimationFrame(railFrame); railFrame = 0; lastTime = 0;}
      function tick(now) {
        if (lastTime && loopWidth) {
          railPosition += Math.min(now - lastTime, 64) * 0.018;
          if (railPosition >= loopWidth) railPosition -= loopWidth;
          rail.scrollLeft = railPosition;
        }
        lastTime = now;
        railFrame = requestAnimationFrame(tick);
      }
      function reconcilePlayback() {
        stop();
        pauseButton.setAttribute('aria-pressed', String(paused));
        pauseButton.textContent = paused ? 'Activar movimiento' : 'Pausar movimiento';
        if (!paused && !hovering && !touching && !focused && inView && !document.hidden && !catalog.open) {
          railPosition = rail.scrollLeft;
          railFrame = requestAnimationFrame(tick);
        }
      }
      on(pauseButton, 'click', () => {paused = !paused; reconcilePlayback();});
      on(rail, 'pointerenter', event => {if (event.pointerType === 'mouse') {hovering = true; reconcilePlayback();}});
      on(rail, 'pointerleave', () => {hovering = false; reconcilePlayback();});
      on(rail, 'pointerdown', () => {touching = true; clearTimeout(resumeTimer); reconcilePlayback();});
      on(window, 'pointerup', () => {if (touching) resumeTimer = setTimeout(() => {touching = false; reconcilePlayback();}, 1500);});
      on(window, 'pointercancel', () => {touching = false; reconcilePlayback();});
      on(rail, 'focusin', () => {focused = true; reconcilePlayback();});
      on(rail, 'focusout', event => {focused = rail.contains(event.relatedTarget); reconcilePlayback();});
      on(rail, 'scroll', () => {if (!railFrame) normalizeScroll();}, {passive:true});
      on(document, 'visibilitychange', reconcilePlayback);
      on(catalog, 'close', reconcilePlayback);
      on(root, 'click', event => {if (event.target.closest('[data-catalog-open]')) reconcilePlayback();});
      on(motion, 'change', () => {paused = motion.matches; reconcilePlayback();});
      function step(direction) {
        paused = true;
        reconcilePlayback();
        if (direction < 0 && rail.scrollLeft < 1) rail.scrollLeft = loopWidth;
        rail.scrollBy({left: direction * (originals[0].getBoundingClientRect().width + parseFloat(getComputedStyle(rail).gap)), behavior: motion.matches ? 'instant' : 'smooth'});
      }
      on(root.querySelector('[data-rail-prev]'), 'click', () => step(-1));
      on(root.querySelector('[data-rail-next]'), 'click', () => step(1));
      const resize = new ResizeObserver(measureRail);
      resize.observe(rail);
      const visibility = new IntersectionObserver(entries => {inView = entries[0].isIntersecting; reconcilePlayback();}, {threshold:0.15});
      visibility.observe(rail);
      instances.set(root, () => {resize.disconnect(); visibility.disconnect(); stop();});
      measureRail();
      reconcilePlayback();
    }
    const disposeRail = instances.get(root);
    instances.set(root, () => {
      disposeRail?.();
      if (catalog.open) catalog.close();
      unlockDialog();
      events.abort();
      clearTimeout(debounce); clearTimeout(resumeTimer);
      cancelAnimationFrame(animationFrame); cancelAnimationFrame(tileFrame);
      rail?.querySelectorAll('[data-rail-clone]').forEach(clone => clone.remove());
      instances.delete(root);
    });
    update();
  }

  function mount(scope) {scope.querySelectorAll('[data-pvc-landing]').forEach(initialize);}
  window.DecokasaPvc = {mount};
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => mount(document), {once:true});
  else mount(document);
  document.addEventListener('shopify:section:load', event => mount(event.target));
  document.addEventListener('shopify:section:unload', event => event.target.querySelectorAll('[data-pvc-landing]').forEach(root => instances.get(root)?.()));
})();
