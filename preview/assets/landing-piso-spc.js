(function () {
  'use strict';

  function calculate(area, coverage, waste) {
    area = Number(area); coverage = Number(coverage);
    if (!Number.isFinite(area) || area < 0.01 || area > 100000 || !Number.isFinite(coverage) || coverage <= 0) return null;
    const netArea = Number(area.toFixed(2));
    const targetArea = waste ? Number((area * 1.1).toFixed(2)) : netArea;
    const wasteArea = waste ? Number((targetArea - netArea).toFixed(2)) : 0;
    const boxes = Math.ceil(area * (waste ? 1.1 : 1) / coverage - 1e-10);
    const covered = boxes * coverage;
    const leftover = Number(Math.max(0, covered - targetArea).toFixed(2));
    const planks = boxes * 10;
    return {
      boxes,
      covered,
      netArea,
      targetArea,
      wasteArea,
      leftover,
      planks
    };
  }

  function estimateTotal(boxes, rawPrice) {
    if (rawPrice == null || String(rawPrice).trim() === '') return null;
    const price = Number(rawPrice);
    if (!Number.isInteger(boxes) || boxes < 1 || !Number.isFinite(price) || price < 0) return null;
    return boxes * price / 100;
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { calculate, estimateTotal };
  if (typeof document === 'undefined' || window.DecokasaSPC) return;

  const initialized = new WeakSet();
  const pageControllers = new WeakMap();
  const calculatorLayoutControllers = new WeakMap();
  const navigationControllers = new WeakMap();
  const motionControllers = new WeakMap();
  const layerControllers = new WeakMap();
  const finishControllers = new WeakMap();
  const loadingControllers = new WeakMap();
  const escapeXML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
  const number = new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const integer = new Intl.NumberFormat('es-PE', { maximumFractionDigits: 0 });

  const testimonialControllers = new WeakMap();
  function initMediaLoading(page) {
    if (loadingControllers.has(page)) return;
    const images = new Set();
    let frame = 0;
    const visibility = window.IntersectionObserver ? new window.IntersectionObserver(entries => {
      entries.forEach(({target, isIntersecting}) => {
        target.classList.toggle('spc-media-visible', isIntersecting && target.classList.contains('spc-media-pending'));
      });
    }) : null;
    const clear = image => {
      image.classList.remove('spc-media-pending', 'spc-media-visible');
      visibility?.unobserve(image);
    };
    const refresh = image => {
      if ((image.getAttribute('src') || image.getAttribute('srcset')) && !image.complete) {
        image.classList.add('spc-media-pending');
        visibility?.observe(image);
      } else clear(image);
    };
    const loaded = event => refresh(event.currentTarget);
    const failed = event => clear(event.currentTarget);
    const watch = image => {
      if (!images.has(image)) {
        images.add(image);
        image.addEventListener('load', loaded);
        image.addEventListener('error', failed);
      }
      refresh(image);
    };
    const unwatch = image => {
      image.removeEventListener('load', loaded);
      image.removeEventListener('error', failed);
      clear(image);
      images.delete(image);
    };
    const visit = (node, callback) => {
      if (node.matches?.('img')) callback(node);
      node.querySelectorAll?.('img').forEach(callback);
    };
    visit(page, watch);
    const changes = window.MutationObserver ? new window.MutationObserver(records => {
      records.forEach(record => {
        if (record.type === 'attributes') {
          const image = record.target.matches('img') ? record.target : record.target.closest('picture')?.querySelector('img');
          if (image) watch(image);
        } else {
          record.removedNodes.forEach(node => visit(node, image => {if (!page.contains(image)) unwatch(image);}));
          record.addedNodes.forEach(node => visit(node, watch));
        }
      });
    }) : null;
    changes?.observe(page, {subtree: true, childList: true, attributes: true, attributeFilter: ['src', 'srcset', 'sizes', 'media']});
    const resize = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        images.forEach(image => {if (image.closest('picture')) refresh(image);});
      });
    };
    window.addEventListener('resize', resize);
    loadingControllers.set(page, () => {
      changes?.disconnect();
      window.removeEventListener('resize', resize);
      window.cancelAnimationFrame(frame);
      images.forEach(unwatch);
      visibility?.disconnect();
      loadingControllers.delete(page);
    });
  }

  function initDesktopMotion(page) {
    // Progressive enhancement: content is visible even without JS or animation support.
    if (!window.IntersectionObserver || !window.Element?.prototype.animate) return;
    const desktop = window.matchMedia('(min-width: 1024px)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const controller = new AbortController();
    const seen = new WeakSet();
    const active = new Map();
    const targets = [...page.querySelectorAll([
      '.spc-v2-composition-heading', '.spc-v2-composition-copy', '.spc-v2-sala-composicion',
      '.spc-v2-colors-heading', '.spc-v2-sample', '.spc-v2-spec-heading', '.spc-v2-spec-data',
      '.spc-v2-tablones-ficha', '.spc-v2-cert-heading', '.spc-seals > img',
      '.spc-v2-click-word', '.spc-v2-click-copy', '.spc-v2-click-fondo', '.spc-v2-benefits > li',
      '.spc-v2-layers-heading', '.spc-v2-layer-diagram',
      '.spc-calc-title-group', '.spc-v2-testimonials-heading', '.spc-v2-results-heading',
      '.spc-v2-shipping-heading', '.spc-v2-shipping-copy', '.spc-v2-footer-heading'
    ].join(','))];
    const stop = () => {
      active.forEach(animation => animation.cancel());
      active.clear();
    };
    const observer = new window.IntersectionObserver(entries => {
      if (!desktop.matches || reducedMotion.matches) return;
      entries.forEach(({target, isIntersecting}) => {
        if (!isIntersecting || seen.has(target)) return;
        seen.add(target);
        observer.unobserve(target);
        if (target.contains(document.activeElement)) return;
        const group = target.closest('.spc-v2-samples, .spc-v2-benefits, .spc-seals');
        const index = group ? [...group.children].indexOf(target) : 0;
        const animation = target.animate([
          {opacity: 0, transform: 'translate3d(0, 20px, 0)'},
          {opacity: 1, transform: 'none'}
        ], {duration: 720, delay: Math.min(240, Math.max(0, index) * 70), easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'backwards'});
        active.set(target, animation);
        animation.onfinish = animation.oncancel = () => active.delete(target);
      });
    }, {threshold: .12});
    const configure = () => {
      observer.disconnect();
      stop();
      if (desktop.matches && !reducedMotion.matches) targets.forEach(target => {
        if (!seen.has(target)) observer.observe(target);
      });
    };
    const options = {signal: controller.signal};
    desktop.addEventListener('change', configure, options);
    reducedMotion.addEventListener('change', configure, options);
    // A keyboard or pointer interaction always takes priority over an entrance.
    const revealControl = event => active.forEach((animation, target) => {
      if (target.contains(event.target)) { animation.cancel(); active.delete(target); }
    });
    page.addEventListener('focusin', revealControl, options);
    page.addEventListener('pointerdown', revealControl, options);
    configure();
    motionControllers.set(page, () => {
      observer.disconnect();
      stop();
      controller.abort();
      motionControllers.delete(page);
    });
  }

  function initDesktopNavigation(page) {
    const links = [...page.querySelectorAll('[data-spc-calculator-link], [data-spc-desktop-anchor]')];
    if (!links.length) return;
    const desktop = window.matchMedia('(min-width: 1024px)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const controller = new AbortController();
    const on = (node, type, fn, options = {}) => node.addEventListener(type, fn, {...options, signal: controller.signal});
    let frame = 0;
    const cancel = () => { window.cancelAnimationFrame(frame); frame = 0; };
    const finish = (target, hash) => {
      frame = 0;
      target.focus({preventScroll: true});
      if (window.location.hash !== hash) window.history.pushState(null, '', hash);
    };
    links.forEach(link => on(link, 'click', event => {
      if (!desktop.matches || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const hash = link.getAttribute('href');
      const target = hash?.startsWith('#') ? document.getElementById(hash.slice(1)) : null;
      if (!target || !page.contains(target)) return;
      event.preventDefault();
      cancel();
      const start = window.scrollY;
      const margin = parseFloat(window.getComputedStyle(target).scrollMarginTop) || 0;
      const end = Math.max(0, Math.min(start + target.getBoundingClientRect().top - margin, document.documentElement.scrollHeight - window.innerHeight));
      const distance = end - start;
      if (reducedMotion.matches || Math.abs(distance) < 2) {
        window.scrollTo({top: end, behavior: 'instant'});
        finish(target, hash);
        return;
      }
      const duration = Math.min(1600, Math.max(900, Math.abs(distance) * .35));
      let started;
      const tick = time => {
        started ??= time;
        const t = Math.min(1, (time - started) / duration);
        // Smootherstep: both velocity and acceleration settle to zero at each end.
        const eased = t * t * t * (t * (t * 6 - 15) + 10);
        window.scrollTo({top: start + distance * eased, behavior: 'instant'});
        if (t < 1) frame = window.requestAnimationFrame(tick);
        else finish(target, hash);
      };
      frame = window.requestAnimationFrame(tick);
    }));
    // Give control back immediately when the visitor starts navigating manually.
    ['wheel', 'touchstart', 'pointerdown'].forEach(type => on(window, type, cancel, {passive: true}));
    on(window, 'keydown', event => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Escape'].includes(event.key)) cancel();
    });
    on(window, 'resize', cancel);
    on(reducedMotion, 'change', cancel);
    navigationControllers.set(page, () => {
      cancel();
      controller.abort();
      navigationControllers.delete(page);
    });
  }

  function initCalculatorLayout(page, form) {
    const desktop = form.querySelector('[data-desktop-plan]');
    const details = form.querySelector('.spc-calc-details');
    if (!desktop || !details) return;
    // Move the same live content between layouts: no duplicate IDs or stale results.
    const selectors = ['[data-schematic-wrap]', '.spc-breakdown-details', '.spc-calc-help', '.spc-planks-info'];
    const slots = selectors.map(selector => {
      const node = details.querySelector(selector);
      if (!node) return null;
      const anchor = document.createComment('calculator mobile position');
      node.before(anchor);
      return {node, anchor};
    }).filter(Boolean);
    const media = window.matchMedia('(min-width: 1024px)');
    const arrange = () => slots.forEach(({node, anchor}) => {
      if (media.matches) desktop.append(node);
      else anchor.after(node);
    });
    media.addEventListener('change', arrange);
    arrange();
    calculatorLayoutControllers.set(page, () => {
      media.removeEventListener('change', arrange);
      slots.forEach(({node, anchor}) => { anchor.after(node); anchor.remove(); });
      calculatorLayoutControllers.delete(page);
    });
  }

  function initTestimonials(page) {
    const section = page.querySelector('[data-spc-testimonials]');
    const viewport = section?.querySelector('[data-testimonial-viewport]');
    const original = viewport?.querySelector('[data-testimonial-original]');
    if (!original || testimonialControllers.has(page)) return;
    const cards = [...original.children];
    if (cards.length < 2) { viewport.dataset.single = ''; return; }
    delete viewport.dataset.single;
    const track = original.parentElement;
    const button = section.querySelector('[data-testimonial-pause]');
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const abort = new AbortController();
    const on = (el, event, fn, options = {}) => el.addEventListener(event, fn, {...options, signal:abort.signal});
    let span = 0, frame = 0, previous = 0, position = 0, manualUntil = 0;
    let paused = false, touching = false, hovered = false, focused = false, visible = false, rebuilding = false;
    function copy(node) {
      const clone = node.cloneNode(true);
      clone.removeAttribute('data-testimonial-original');
      clone.setAttribute('aria-hidden', 'true');
      clone.inert = true;
      for (const el of [clone, ...clone.querySelectorAll('*')]) {
        el.removeAttribute('id'); el.removeAttribute('data-shopify-editor-block');
        if (el.tagName === 'IMG') el.loading = 'eager';
      }
      return clone;
    }
    function normalize() {
      if (!span || rebuilding) return;
      let x = viewport.scrollLeft;
      if (x < span * .5 || x >= span * 1.5) {
        x = span + ((x - span) % span + span) % span;
        if (x >= span * 1.5) x -= span;
        viewport.scrollLeft = x;
      }
      position = viewport.scrollLeft;
    }
    function rebuild() {
      const phase = span ? ((viewport.scrollLeft % span) + span) % span / span : null;
      rebuilding = true;
      track.replaceChildren(original);
      original.replaceChildren(...cards);
      // Short collections also fill the viewport; only the original cards are exposed to readers.
      let count = 0;
      while (original.getBoundingClientRect().width < viewport.clientWidth && count++ < 12) {
        cards.forEach(card => original.append(copy(card)));
      }
      span = original.getBoundingClientRect().width;
      track.prepend(copy(original)); track.append(copy(original));
      position = span + (phase === null ? viewport.clientWidth * .05 : phase * span);
      viewport.scrollLeft = position;
      rebuilding = false; previous = 0;
    }
    function tick(time) {
      frame = 0;
      const elapsed = previous ? Math.min(time - previous, 50) : 0;
      previous = time;
      if (!paused && !media.matches && !touching && !hovered && !focused && time > manualUntil && !document.hidden) {
        position += elapsed * .024 * viewport.clientWidth / 1080;
        viewport.scrollLeft = position;
        if (position >= span * 1.5) { position -= span; viewport.scrollLeft = position; }
      }
      if (visible && !document.hidden) frame = requestAnimationFrame(tick);
    }
    function start() { if (!frame && visible && !document.hidden) { previous = 0; frame = requestAnimationFrame(tick); } }
    function stop() { cancelAnimationFrame(frame); frame = 0; previous = 0; }
    on(viewport, 'scroll', () => {
      // Preserve subpixel accumulation during autoplay; native scroll positions may be rounded.
      if (touching || focused || performance.now() < manualUntil) normalize();
    }, {passive:true});
    on(viewport, 'pointerdown', () => { touching = true; manualUntil = Infinity; });
    on(window, 'pointerup', () => { if (touching) { touching = false; manualUntil = performance.now() + 2500; normalize(); } });
    on(window, 'pointercancel', () => { touching = false; manualUntil = performance.now() + 2500; normalize(); });
    on(viewport, 'wheel', () => { manualUntil = performance.now() + 2500; }, {passive:true});
    on(viewport, 'mouseenter', () => { hovered = true; });
    on(viewport, 'mouseleave', () => { hovered = false; });
    on(viewport, 'focusin', () => { focused = true; });
    on(viewport, 'focusout', () => { focused = false; position = viewport.scrollLeft; });
    on(viewport, 'keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const step = cards[0].getBoundingClientRect().width + 22 * viewport.clientWidth / 1080;
      viewport.scrollLeft = event.key === 'Home' ? span : event.key === 'End' ? span * 2 - step : viewport.scrollLeft + (event.key === 'ArrowRight' ? step : -step);
      normalize();
    });
    on(button, 'click', () => {
      paused = !paused;
      button.setAttribute('aria-pressed', String(paused));
      button.setAttribute('aria-label', paused ? 'Reanudar testimonios' : 'Pausar testimonios');
      button.firstElementChild.textContent = paused ? '▷' : 'Ⅱ';
      position = viewport.scrollLeft;
    });
    function motion() { button.hidden = media.matches; position = viewport.scrollLeft; }
    on(media, 'change', motion);
    on(document, 'visibilitychange', () => { if (document.hidden) stop(); else start(); });
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (visible) start(); else stop(); });
    const resize = new ResizeObserver(rebuild);
    rebuild(); motion(); observer.observe(section); resize.observe(viewport);
    on(document, 'shopify:block:select', event => {
      const card = event.target.closest('.spc-quote');
      if (!card || !original.contains(card)) return;
      paused = true; button.setAttribute('aria-pressed','true'); button.setAttribute('aria-label','Reanudar testimonios'); button.firstElementChild.textContent = '▷';
      viewport.scrollLeft = span + card.offsetLeft - original.offsetLeft - (viewport.clientWidth - card.offsetWidth) / 2;
      normalize();
    });
    testimonialControllers.set(page, () => { stop(); abort.abort(); observer.disconnect(); resize.disconnect(); track.replaceChildren(original); original.replaceChildren(...cards); button.hidden = true; testimonialControllers.delete(page); initialized.delete(page); });
  }

  function initDesktopLayers(page) {
    const explorer = page.querySelector('[data-layer-explorer]');
    if (!explorer) return;
    const buttons = [...explorer.querySelectorAll('[data-layer-target]')];
    const markers = [...page.querySelectorAll('[data-layer-marker]')];
    const title = explorer.querySelector('[data-layer-title]');
    const description = explorer.querySelector('[data-layer-description]');
    const fact = explorer.querySelector('[data-layer-fact]');
    const layers = [
      ['El acabado empieza en la superficie.', 'La protección UV es la capa exterior del piso. Ayuda a conservar el aspecto de su acabado.', 'Protección superficial'],
      ['Una capa para el uso de cada día.', 'La capa de desgaste protege el diseño decorativo frente al uso cotidiano del piso.', '0,3 mm de capa de desgaste'],
      ['La personalidad de tu espacio.', 'Aquí está el diseño que aporta el aspecto de madera. Elige entre tonos cálidos, oscuros o neutros.', 'Acabados con aspecto de madera'],
      ['El núcleo de tu nuevo piso.', 'El tablero rígido combina polvo de piedra y PVC. Es la base estructural del piso SPC.', '4 mm de espesor del piso'],
      ['La base ya viene incorporada.', 'Incluye espuma integrada: no necesita una capa de espuma adicional sobre la superficie de instalación.', '1,5 mm de espuma integrada']
    ];
    const controller = new AbortController();
    const choose = index => {
      const layer = layers[index];
      if (!layer) return;
      buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
      markers.forEach(marker => marker.classList.toggle('is-active', Number(marker.dataset.layerMarker) === index));
      title.textContent = layer[0];
      description.textContent = layer[1];
      fact.textContent = `0${index + 1} / 05 · ${layer[2]}`;
    };
    buttons.forEach((button, index) => {
      button.addEventListener('click', () => choose(index), {signal: controller.signal});
      button.addEventListener('keydown', event => {
        if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length;
        choose(next);
        buttons[next].focus({preventScroll: true});
      }, {signal: controller.signal});
    });
    layerControllers.set(page, () => {controller.abort(); layerControllers.delete(page);});
  }

  function initDesktopFinishes(page) {
    const media = window.matchMedia('(min-width: 1024px)');
    const links = [...page.querySelectorAll('[data-color]')].map(swatch => ({
      link: swatch.closest('.spc-v2-sample')?.querySelector('a'),
      color: swatch.dataset.color
    })).filter(item => item.link);
    links.forEach(item => {item.original = item.link.getAttribute('href');});
    const restore = item => {
      if (item.original === null) item.link.removeAttribute('href');
      else item.link.setAttribute('href', item.original);
    };
    const update = () => links.forEach(item => {
      if (media.matches && page.dataset.phone) {
        item.link.href = `https://wa.me/${page.dataset.phone}?text=${encodeURIComponent(`Hola, quisiera consultar el acabado ${item.color} del piso SPC de Decokasa.`)}`;
      } else restore(item);
    });
    media.addEventListener('change', update);
    update();
    finishControllers.set(page, () => {
      media.removeEventListener('change', update);
      links.forEach(restore);
      finishControllers.delete(page);
    });
  }

  function init(scope) {
    const pages = [...scope.querySelectorAll('[data-spc-page]')];
    if (scope.matches?.('[data-spc-page]')) pages.unshift(scope);

    pages.forEach(page => {
      if (initialized.has(page)) return;
      initialized.add(page);
      initDesktopNavigation(page);
      initDesktopMotion(page);
      initTestimonials(page);
      initMediaLoading(page);
      initDesktopLayers(page);
      initDesktopFinishes(page);

      const swatches = [...page.querySelectorAll('[data-color]')];
      const status = page.querySelector('[data-color-status]');
      const form = page.querySelector('[data-spc-calculator]');
      if (!form) return;
      initCalculatorLayout(page, form);

      const directArea = form.querySelector('[name="area"]');
      const wasteCheckbox = form.querySelector('[name="waste"]');
      const errorEl = form.querySelector('[data-calc-error]');
      const resultCard = form.querySelector('[data-calc-result]');
      const contactBtn = form.querySelector('[data-calc-contact]');

      // Result breakdown fields
      const boxesEl = form.querySelector('[data-boxes]');
      const boxesStatusEl = form.querySelector('[data-boxes-status]');
      const estimateEl = form.querySelector('[data-calc-estimate]');
      const targetLabelEl = form.querySelector('[data-target-label]');
      const netAreaEl = form.querySelector('[data-net-area]');
      const targetAreaEl = form.querySelector('[data-target-area]');
      const coveredEl = form.querySelector('[data-covered]');
      const leftoverEl = form.querySelector('[data-leftover]');
      const planksTextEl = form.querySelector('[data-planks-text]');

      // Mode tabs & panels
      const modeTabs = [...form.querySelectorAll('[data-calc-mode]')];
      const panels = [...form.querySelectorAll('[data-panel]')];
      const roomsContainer = form.querySelector('[data-rooms-container]');
      const addRoomBtn = form.querySelector('[data-add-room]');
      const roomsCountEl = form.querySelector('[data-rooms-count]');
      const schematicStage = form.querySelector('[data-schematic-stage]');
      const schematicLegend = form.querySelector('[data-schematic-legend]');
      const miniSpace = form.querySelector('[data-mini-space]');
      const miniStage = form.querySelector('[data-mini-stage]');
      const miniArea = form.querySelector('[data-mini-area]');
      const quickChips = [...form.querySelectorAll('[data-quick-area]')];

      let currentMode = 'dimensions';
      let selectedColorIdx = 0;
      let lastCalculation = null;

      // Catalog link update
      const contactUpdate = () => {
        if (!contactBtn) return;
        const catalogTarget = page.querySelector('.spc-colors')?.id ? `#${page.querySelector('.spc-colors').id}` : '#spc-colores';
        const catalogUrl = page.dataset.catalogUrl || catalogTarget;
        contactBtn.setAttribute('href', catalogUrl);
      };

      const chooseColor = index => {
        if (!swatches.length) return;
        selectedColorIdx = (index + swatches.length) % swatches.length;
        swatches.forEach((swatch, i) => swatch.setAttribute('aria-pressed', String(i === selectedColorIdx)));
        if (status) status.textContent = `${swatches[selectedColorIdx].dataset.color} · Color de referencia`;
        const swatch = swatches[selectedColorIdx];
        const source = swatch.querySelector('img');
        const preview = page.querySelector('[data-finish-image]');
        if (preview && source) {
          preview.src = source.src;
          preview.alt = `Muestra de piso SPC en ${swatch.dataset.color.toLowerCase()}`;
        }
        page.querySelectorAll('[data-finish-name], [data-finish-summary]').forEach(node => {node.textContent = swatch.dataset.color;});
        const finishIndex = page.querySelector('[data-finish-index]');
        if (finishIndex) finishIndex.textContent = `0${selectedColorIdx + 1} / 0${swatches.length}`;
        const description = page.querySelector('[data-finish-description]');
        if (description) description.textContent = ['Un tono cálido para espacios acogedores.', 'Un tono profundo que realza la madera.', 'Un tono neutro para combinar con tu estilo.'][selectedColorIdx] || '';
        contactUpdate();
      };

      swatches.forEach((swatch, i) => swatch.addEventListener('click', () => chooseColor(i)));
      page.querySelectorAll('[data-color-step]').forEach(button => {
        button.hidden = false;
        button.addEventListener('click', () => chooseColor(selectedColorIdx + Number(button.dataset.colorStep)));
      });

      // Mode switching
      function setMode(mode) {
        currentMode = mode;
        modeTabs.forEach(tab => {
          const isActive = tab.dataset.calcMode === mode;
          tab.classList.toggle('is-active', isActive);
          tab.setAttribute('aria-selected', String(isActive));
          tab.tabIndex = isActive ? 0 : -1;
        });
        panels.forEach(panel => {
          panel.hidden = panel.dataset.panel !== mode;
        });
        updateRoomsUI();
        recalculate();
      }

      modeTabs.forEach(tab => {
        tab.addEventListener('click', () => setMode(tab.dataset.calcMode));
        tab.addEventListener('keydown', event => {
          if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
          event.preventDefault();
          const index = modeTabs.indexOf(tab);
          const next = event.key === 'Home' ? 0 : event.key === 'End' ? modeTabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + modeTabs.length) % modeTabs.length;
          setMode(modeTabs[next].dataset.calcMode);
          modeTabs[next].focus();
        });
      });

      const isWasteChecked = () => {
        if (!wasteCheckbox) return true;
        if (typeof wasteCheckbox.checked === 'boolean') return wasteCheckbox.checked;
        return wasteCheckbox.checked !== undefined ? !!wasteCheckbox.checked : wasteCheckbox.hasAttribute('checked');
      };

      // Quick chips in direct mode
      quickChips.forEach(chip => {
        chip.addEventListener('click', () => {
          setMode('direct');
          if (directArea) {
            directArea.value = chip.dataset.quickArea;
            directArea.dispatchEvent(new Event('input', { bubbles: true }));
          }
        });
      });

      // Room manager
      function getRoomsData() {
        if (!roomsContainer) return [];
        const cards = [...roomsContainer.querySelectorAll('[data-room-item]')];
        return cards.map(card => {
          const nameInput = card.querySelector('[data-room-name]');
          const lenInput = card.querySelector('[data-dim="length"]');
          const widInput = card.querySelector('[data-dim="width"]');
          const length = parseFloat(lenInput?.value) || 0;
          const width = parseFloat(widInput?.value) || 0;
          const hasInput = !!(lenInput?.value || widInput?.value);
          const valid = Number.isFinite(length) && Number.isFinite(width) && length >= 0.1 && length <= 100 && width >= 0.1 && width <= 100;
          const area = valid ? length * width : 0;
          return {
            element: card,
            name: nameInput?.value.trim() || '',
            length,
            width,
            hasInput,
            valid,
            area
          };
        });
      }

      function updateRoomsUI() {
        const rooms = getRoomsData();
        const count = rooms.length;
        if (roomsCountEl) {
          roomsCountEl.textContent = `${count} ${count === 1 ? 'ambiente' : 'ambientes'}`;
        }
        rooms.forEach((r, idx) => {
          const subtotalEl = r.element.querySelector('[data-room-subtotal]');
          if (subtotalEl) {
            subtotalEl.textContent = `${number.format(r.area)} m²`;
          }
          const removeBtn = r.element.querySelector('[data-room-remove]');
          if (removeBtn) {
            removeBtn.hidden = count <= 1;
          }
        });
        renderSchematic(rooms);
      }

      function renderSchematic(rooms) {
        if (!schematicStage) return;

        if (currentMode === 'direct') {
          const directVal = parseFloat(directArea?.value) || 0;
          if (!Number.isFinite(directVal) || directVal < 0.01 || directVal > 100000) {
            schematicStage.innerHTML = `
              <div class="spc-schematic-empty">
                <svg viewBox="0 0 40 40" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="6" y="6" width="28" height="28" rx="3" stroke-dasharray="3 3"/><path d="M6 14h28M14 6v28"/></svg>
                <span>Ingresa el total en m² para generar tu plano visual</span>
              </div>
            `;
            if (schematicLegend) schematicLegend.textContent = 'En espera de m²';
            return;
          }
          if (schematicLegend) schematicLegend.textContent = `Área directa · ${number.format(directVal)} m²`;
          const approxSide = Math.sqrt(directVal);
          const w = 260;
          const h = 100;
          const x = (420 - w) / 2;
          const y = (160 - h) / 2;
          schematicStage.innerHTML = `
            <svg viewBox="0 0 420 160" class="spc-schematic-svg" preserveAspectRatio="xMidYMid meet">
              <defs>
                <pattern id="spc-grid-dir" width="16" height="16" patternUnits="userSpaceOnUse">
                  <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#spc-grid-dir)" rx="8" />
              <g class="spc-svg-room spc-svg-room--animate" style="--room-delay:0s;" transform="translate(${x}, ${y})">
                <rect width="${w}" height="${h}" rx="8" class="spc-chain-fill" />
                <rect width="${w}" height="${h}" rx="8" pathLength="100" class="spc-chain-outline" />
                <line x1="6" y1="6" x2="${w - 6}" y2="${h - 6}" class="spc-chain-guide" />
                <text x="${w / 2}" y="${h / 2 - 14}" text-anchor="middle" class="spc-svg-name spc-chain-name">Área Total Calculada</text>
                <text x="${w / 2}" y="${h / 2 + 3}" text-anchor="middle" class="spc-svg-dim spc-chain-dim">~${number.format(approxSide)}m × ~${number.format(approxSide)}m proporcional</text>
                <text x="${w / 2}" y="${h / 2 + 20}" text-anchor="middle" class="spc-svg-area spc-chain-area">${number.format(directVal)} m²</text>
              </g>
            </svg>
          `;
          return;
        }

        const valid = rooms.filter(r => r.valid);
        if (valid.length === 0) {
          schematicStage.innerHTML = `
            <div class="spc-schematic-empty">
              <svg viewBox="0 0 40 40" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="6" y="6" width="28" height="28" rx="3" stroke-dasharray="3 3"/><path d="M6 14h28M14 6v28"/></svg>
              <span>Ingresa largo y ancho para visualizar tu plano a escala</span>
            </div>
          `;
          if (schematicLegend) schematicLegend.textContent = 'En espera de medidas';
          return;
        }

        // Calculate layout
        const totalArea = valid.reduce((acc, r) => acc + r.area, 0);
        if (schematicLegend) schematicLegend.textContent = `${valid.length} ${valid.length === 1 ? 'zona' : 'zonas'} · ${number.format(totalArea)} m² netos`;

        const svgW = 420;
        const columns = Math.min(4, valid.length);
        const svgH = Math.ceil(valid.length / columns) * 160;
        const padding = 16;

        let roomRects = [];
        if (valid.length === 1) {
          const r = valid[0];
          const aspect = Math.max(0.75, Math.min(1.4, (r.length || 1) / (r.width || 1)));
          const w = Math.round(Math.min(180, Math.max(140, 150 * Math.sqrt(aspect))));
          const h = Math.round(Math.min(124, Math.max(98, 116 / Math.sqrt(aspect))));
          const x = Math.round((svgW - w) / 2);
          const y = Math.round((svgH - h) / 2);
          const cleanName = (r.name || 'Ambiente 1').replace(/\s*\(.*\)/, '').trim() || 'Ambiente 1';
          roomRects = [{
            x,
            y,
            w,
            h,
            name: cleanName.length > 16 ? cleanName.slice(0, 15) + '…' : cleanName,
            dim: `${number.format(r.length)}m × ${number.format(r.width)}m`,
            area: `${number.format(r.area)} m²`,
            fontSizeName: 13,
            fontSizeDim: 11,
            fontSizeArea: 13.5
          }];
        } else {
          // At most four rooms per row, including the eight-room maximum.
          const gap = columns === 2 ? 18 : 12;
          const availW = svgW - padding * 2;
          const totalGap = (columns - 1) * gap;
          const roomW = Math.min(145, Math.floor((availW - totalGap) / columns));

          const maxWid = Math.max(...valid.map(r => r.width), 1);

          roomRects = valid.map((r, i) => {
            const row = Math.floor(i / columns);
            const rowColumns = Math.min(columns, valid.length - row * columns);
            const rowWidth = rowColumns * roomW + (rowColumns - 1) * gap;
            const x = Math.round((svgW - rowWidth) / 2) + (i % columns) * (roomW + gap);
            const relH = Math.max(0.85, Math.min(1.15, (r.width / maxWid) || 1));
            const h = Math.round(Math.max(90, Math.min(122, 110 * relH)));
            const y = row * 160 + Math.round((160 - h) / 2);
            const cleanName = (r.name || `Ambiente ${i + 1}`).replace(/\s*\(.*\)/, '').trim() || `Ambiente ${i + 1}`;
            const maxChars = roomW > 125 ? 15 : roomW > 105 ? 12 : 11;
            const displayName = cleanName.length > maxChars ? cleanName.slice(0, maxChars - 1) + '…' : cleanName;
            const rect = {
              x,
              y,
              w: roomW,
              h,
              name: displayName,
              dim: `${number.format(r.length)}m × ${number.format(r.width)}m`,
              area: `${number.format(r.area)} m²`,
              fontSizeName: columns === 4 ? 10 : valid.length === 2 ? 12 : 11,
              fontSizeDim: valid.length === 2 ? 10 : 9.5,
              fontSizeArea: valid.length === 2 ? 12 : 11
            };
            return rect;
          });
        }

        let svg = schematicStage.querySelector('svg.spc-schematic-svg');
        const isDimensionSvg = svg && svg.dataset.mode === 'dimensions';

        if (!isDimensionSvg) {
          const svgItems = roomRects.map((rect, idx) => {
            const rw = rect.w;
            const rh = rect.h;
            const roomDelay = (idx * 0.22).toFixed(2);
            return `
              <g class="spc-svg-room spc-svg-room--animate" data-room-idx="${idx}" style="--room-delay:${roomDelay}s; transform: translate(${rect.x}px, ${rect.y}px);" transform="translate(${rect.x}, ${rect.y})">
                <rect width="${rw}" height="${rh}" rx="8" class="spc-chain-fill" />
                <rect width="${rw}" height="${rh}" rx="8" pathLength="100" class="spc-chain-outline" />
                <line x1="5" y1="5" x2="${rw - 5}" y2="${rh - 5}" class="spc-chain-guide" />
                <text x="${rw / 2}" y="${rh / 2 - 14}" text-anchor="middle" class="spc-svg-name spc-chain-name" style="font-size:${rect.fontSizeName}px">${escapeXML(rect.name)}</text>
                <text x="${rw / 2}" y="${rh / 2 + 2}" text-anchor="middle" class="spc-svg-dim spc-chain-dim" style="font-size:${rect.fontSizeDim}px">${rect.dim}</text>
                <text x="${rw / 2}" y="${rh / 2 + 20}" text-anchor="middle" class="spc-svg-area spc-chain-area" style="font-size:${rect.fontSizeArea}px">${rect.area}</text>
              </g>
            `;
          }).join('');

          schematicStage.innerHTML = `
            <svg viewBox="0 0 ${svgW} ${svgH}" class="spc-schematic-svg" data-mode="dimensions" preserveAspectRatio="xMidYMid meet">
              <defs>
                <pattern id="spc-grid" width="16" height="16" patternUnits="userSpaceOnUse">
                  <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#spc-grid)" rx="8" />
              <g class="spc-svg-rooms-group">
                ${svgItems}
              </g>
            </svg>
          `;
        } else {
          svg.setAttribute('viewBox', `0 0 ${svgW} ${svgH}`);
          const roomsGroup = svg.querySelector('.spc-svg-rooms-group');
          if (roomsGroup) {
            const existingEls = [...roomsGroup.querySelectorAll('.spc-svg-room')];

            roomRects.forEach((rect, idx) => {
              const rw = rect.w;
              const rh = rect.h;
              let el = roomsGroup.querySelector(`[data-room-idx="${idx}"]`);
              if (el) {
                el.style.transform = `translate(${rect.x}px, ${rect.y}px)`;
                el.setAttribute('transform', `translate(${rect.x}, ${rect.y})`);

                const fillRect = el.querySelector('.spc-chain-fill');
                const outlineRect = el.querySelector('.spc-chain-outline');
                const guide = el.querySelector('.spc-chain-guide');
                const nameText = el.querySelector('.spc-svg-name');
                const dimText = el.querySelector('.spc-svg-dim');
                const areaText = el.querySelector('.spc-svg-area');

                if (fillRect) { fillRect.setAttribute('width', rw); fillRect.setAttribute('height', rh); }
                if (outlineRect) { outlineRect.setAttribute('width', rw); outlineRect.setAttribute('height', rh); }
                if (guide) { guide.setAttribute('x2', rw - 5); guide.setAttribute('y2', rh - 5); }
                if (nameText) {
                  nameText.setAttribute('x', rw / 2);
                  nameText.setAttribute('y', rh / 2 - 14);
                  nameText.style.fontSize = `${rect.fontSizeName}px`;
                  nameText.textContent = rect.name;
                }
                if (dimText) {
                  dimText.setAttribute('x', rw / 2);
                  dimText.setAttribute('y', rh / 2 + 2);
                  dimText.style.fontSize = `${rect.fontSizeDim}px`;
                  dimText.textContent = rect.dim;
                }
                if (areaText) {
                  areaText.setAttribute('x', rw / 2);
                  areaText.setAttribute('y', rh / 2 + 20);
                  areaText.style.fontSize = `${rect.fontSizeArea}px`;
                  areaText.textContent = rect.area;
                }
              } else {
                const newG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                newG.setAttribute('class', 'spc-svg-room spc-svg-room--animate');
                newG.setAttribute('data-room-idx', String(idx));
                newG.setAttribute('style', `--room-delay:0.18s; transform: translate(${rect.x}px, ${rect.y}px);`);
                newG.setAttribute('transform', `translate(${rect.x}, ${rect.y})`);
                newG.innerHTML = `
                  <rect width="${rw}" height="${rh}" rx="8" class="spc-chain-fill" />
                  <rect width="${rw}" height="${rh}" rx="8" pathLength="100" class="spc-chain-outline" />
                  <line x1="5" y1="5" x2="${rw - 5}" y2="${rh - 5}" class="spc-chain-guide" />
                  <text x="${rw / 2}" y="${rh / 2 - 14}" text-anchor="middle" class="spc-svg-name spc-chain-name" style="font-size:${rect.fontSizeName}px">${escapeXML(rect.name)}</text>
                  <text x="${rw / 2}" y="${rh / 2 + 2}" text-anchor="middle" class="spc-svg-dim spc-chain-dim" style="font-size:${rect.fontSizeDim}px">${rect.dim}</text>
                  <text x="${rw / 2}" y="${rh / 2 + 20}" text-anchor="middle" class="spc-svg-area spc-chain-area" style="font-size:${rect.fontSizeArea}px">${rect.area}</text>
                `;
                roomsGroup.appendChild(newG);
              }
            });

            existingEls.forEach(el => {
              const idx = parseInt(el.getAttribute('data-room-idx'), 10);
              if (idx >= roomRects.length) {
                el.remove();
              }
            });
          }
        }
      }

      // A small, always-visible room preview. The full labelled sketch stays in details.
      function renderMiniSpace() {
        if (!miniSpace || !miniStage) return;
        const valid = Boolean(lastCalculation);
        miniSpace.classList.toggle('is-empty', !valid);
        if (miniArea) miniArea.textContent = valid ? `${number.format(lastCalculation.netArea)} m²` : '— m²';
        const rooms = !valid ? [{ length: 1, width: 1 }] : currentMode === 'direct'
          ? [{ length: 1, width: 1 }]
          : getRoomsData().filter(room => room.valid);
        // Keep existing nodes (and animation) when only price, cuts or room names change.
        const signature = JSON.stringify([valid, currentMode, valid ? lastCalculation.netArea : 0, rooms.map(room => [room.length, room.width])]);
        if (miniStage.dataset.geometry === signature) return;
        miniStage.dataset.geometry = signature;
        const columns = Math.min(4, rooms.length);
        const rows = Math.ceil(rooms.length / columns);
        const cellWidth = 136 / columns;
        const cellHeight = 48 / rows;
        const tiles = rooms.map((room, index) => {
          const ratio = Math.max(0.5, Math.min(2, room.length / room.width));
          const height = Math.min(cellHeight - 6, (cellWidth - 8) / ratio);
          const width = height * ratio;
          const x = (index % columns) * cellWidth + (cellWidth - width) / 2;
          const y = Math.floor(index / columns) * cellHeight + (cellHeight - height) / 2;
          return `<g class="spc-mini-room" style="--mini-delay:${index * 160}ms;transform-origin:${x + width / 2}px ${y + height / 2}px">
            <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="2"/>
            <path d="M${x + width / 2} ${y}v${height} M${x} ${y + height / 2}h${width}"/>
          </g>`;
        }).join('');
        miniStage.innerHTML = `<svg viewBox="0 0 136 48" focusable="false" aria-hidden="true">${tiles}</svg>`;
      }

      function attachRoomListeners(card) {
        card.querySelectorAll('input').forEach(inp => {
          inp.addEventListener('input', () => {
            updateRoomsUI();
            recalculate();
          });
        });
        const removeBtn = card.querySelector('[data-room-remove]');
        if (removeBtn) {
          removeBtn.addEventListener('click', () => {
            const rooms = roomsContainer.querySelectorAll('[data-room-item]');
            if (rooms.length > 1) {
              card.remove();
              updateRoomsUI();
              recalculate();
            }
          });
        }
      }

      if (roomsContainer) {
        roomsContainer.querySelectorAll('[data-room-item]').forEach(attachRoomListeners);
      }

      let roomSerial = roomsContainer?.querySelectorAll('[data-room-item]').length || 0;
      if (addRoomBtn && roomsContainer) {
        addRoomBtn.addEventListener('click', () => {
          const currentRooms = roomsContainer.querySelectorAll('[data-room-item]');
          if (currentRooms.length >= 8) return;
          const newIdx = roomSerial++;
          const sectionId = page.dataset.sectionId || 'spc';
          const newCard = document.createElement('div');
          newCard.className = 'spc-room-card spc-room-card--animate-in';
          newCard.dataset.roomItem = String(newIdx);
          newCard.innerHTML = `
            <div class="spc-room-header">
              <input type="text" class="spc-room-name-input" value="Ambiente ${newIdx + 1}" aria-label="Nombre del ambiente" placeholder="Nombre" data-room-name>
              <span class="spc-room-subtotal" data-room-subtotal>0.00 m²</span>
              <button type="button" class="spc-room-remove" data-room-remove aria-label="Eliminar este ambiente" title="Eliminar ambiente">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div class="spc-room-fields">
              <div class="spc-dim-field">
                <label for="room-${newIdx}-len-${sectionId}">Largo</label>
                <div class="spc-dim-box">
                  <input id="room-${newIdx}-len-${sectionId}" type="number" step="0.01" min="0.1" max="100" inputmode="decimal" placeholder="3.50" data-dim="length">
                  <span class="spc-unit">m</span>
                </div>
              </div>
              <span class="spc-dim-mult" aria-hidden="true">×</span>
              <div class="spc-dim-field">
                <label for="room-${newIdx}-wid-${sectionId}">Ancho</label>
                <div class="spc-dim-box">
                  <input id="room-${newIdx}-wid-${sectionId}" type="number" step="0.01" min="0.1" max="100" inputmode="decimal" placeholder="2.80" data-dim="width">
                  <span class="spc-unit">m</span>
                </div>
              </div>
            </div>
          `;
          roomsContainer.appendChild(newCard);
          attachRoomListeners(newCard);
          updateRoomsUI();
          newCard.querySelector('[data-dim="length"]')?.focus();
        });
      }

      // Use the same Shopify variant price and currency as the request summary.
      function updateEstimate() {
        if (!estimateEl) return;
        if (!lastCalculation) { estimateEl.textContent = '—'; return; }
        const request = page.querySelector('#solicitud [data-request-form]');
        const select = request?.querySelector('[name="variant_id"]');
        const option = select?.selectedOptions?.[0] || select?.querySelector('option[selected]');
        const total = estimateTotal(lastCalculation.boxes, option?.dataset.price);
        estimateEl.textContent = total === null ? estimateEl.dataset.unconfirmed : new Intl.NumberFormat('es-PE', {
          style: 'currency', currency: request?.dataset.currency || 'PEN'
        }).format(total);
      }

      // Calculation execution
      function recalculate() {
        let areaVal = 0;
        let invalidRoom = false;
        if (currentMode === 'dimensions') {
          const rooms = getRoomsData();
          invalidRoom = rooms.some(room => room.hasInput && !room.valid);
          areaVal = rooms.reduce((acc, r) => acc + r.area, 0);
          // Sync with hidden/direct input for any legacy form listeners
          if (directArea) directArea.value = areaVal > 0 && !invalidRoom ? areaVal.toFixed(2) : '';
        } else {
          areaVal = parseFloat(directArea?.value) || 0;
        }

        const coverage = parseFloat(page.dataset.coverage) || 2.196;
        const waste = isWasteChecked();
        if (targetLabelEl) targetLabelEl.textContent = waste ? 'Con cortes (+10%)' : 'Sin cortes extra';

        const calc = invalidRoom ? null : calculate(areaVal, coverage, waste);
        if (!calc) {
          lastCalculation = null;
          renderMiniSpace();
          if (errorEl) {
            errorEl.hidden = !invalidRoom && areaVal === 0;
            errorEl.textContent = invalidRoom ? 'Completa el largo y ancho de cada ambiente entre 0,1 y 100 metros.' : 'Ingresa un área válida entre 0,01 y 100 000 m².';
          }
          if (boxesEl) boxesEl.textContent = '— cajas';
          if (boxesStatusEl) boxesStatusEl.textContent = 'Ingresa medidas para calcular';
          if (netAreaEl) netAreaEl.textContent = '0.00 m²';
          if (targetAreaEl) targetAreaEl.textContent = '0.00 m²';
          if (coveredEl) coveredEl.textContent = '0.00 m²';
          if (leftoverEl) leftoverEl.textContent = '0.00 m²';
          if (planksTextEl) planksTextEl.textContent = 'Equivale a -- planchas (10 planchas/caja)';
          if (resultCard) resultCard.classList.remove('has-result');
          updateEstimate();
          return;
        }

        lastCalculation = { ...calc, includeWaste: waste };
        renderMiniSpace();
        updateEstimate();

        if (errorEl) errorEl.hidden = true;
        if (resultCard) resultCard.classList.add('has-result');

        if (boxesEl) {
          const oldVal = boxesEl.textContent;
          const newVal = `${calc.boxes} ${calc.boxes === 1 ? 'caja' : 'cajas'}`;
          boxesEl.textContent = newVal;
          if (oldVal !== newVal) {
            boxesEl.classList.remove('spc-metric-pulse');
            void boxesEl.offsetWidth;
            boxesEl.classList.add('spc-metric-pulse');
          }
        }
        if (boxesStatusEl) boxesStatusEl.textContent = `Cubren ${number.format(calc.covered)} m²${waste ? ' · Incluye cortes' : ''}`;
        if (netAreaEl) netAreaEl.textContent = `${number.format(calc.netArea)} m²`;
        if (targetAreaEl) targetAreaEl.textContent = `${number.format(calc.targetArea)} m²`;
        if (coveredEl) coveredEl.textContent = `${number.format(calc.covered)} m²`;
        if (leftoverEl) leftoverEl.textContent = `${number.format(calc.leftover)} m²`;
        if (planksTextEl) planksTextEl.textContent = `Equivale a ${integer.format(calc.planks)} planchas de 122 × 18,4 cm`;

        if (currentMode === 'direct') {
          renderSchematic([]);
        }

        contactUpdate();

        // Synchronize request form (#solicitud) with calculated boxes
        const formBox = page.querySelector('#solicitud');
        if (formBox && lastCalculation && lastCalculation.boxes > 0) {
          const formQty = formBox.querySelector('[name="quantity"]');
          if (formQty && formQty.value !== String(lastCalculation.boxes)) {
            formQty.value = lastCalculation.boxes;
            formQty.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }
      }

      // Input events on waste & direct area
      if (wasteCheckbox) {
        wasteCheckbox.addEventListener('change', recalculate);
      }
      if (directArea) {
        directArea.addEventListener('input', () => {
          recalculate();
          if (currentMode === 'direct') renderSchematic([]);
        });
      }

      if (contactBtn) {
        contactBtn.addEventListener('click', e => {
          const href = contactBtn.getAttribute('href') || '';
          if (href.startsWith('#')) {
            const target = document.getElementById(href.slice(1));
            if (target) {
              e.preventDefault();
              target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        });
      }

      // Order action modal controls
      const orderBtn = page.querySelector('[data-open-request]');
      const modalEl = page.querySelector('[data-spc-modal]');
      let scheduleStickyCta = () => {};
      let requestReturnFocus;
      let generatedRequestComment = '';

      function openOrderModal() {
        if (!modalEl) return;
        const opener = document.activeElement;
        requestReturnFocus = opener;
        const reqForm = modalEl.querySelector('[data-request-form]');
        if (reqForm) {
          const fieldset = reqForm.querySelector('fieldset');
          if (fieldset) fieldset.disabled = false;
          const submitBtn = reqForm.querySelector('[data-enable-form]');
          if (submitBtn) submitBtn.disabled = false;
          const qtyInput = reqForm.querySelector('[name="quantity"]');
          if (qtyInput && lastCalculation && lastCalculation.boxes > 0) {
            qtyInput.value = lastCalculation.boxes;
            qtyInput.dispatchEvent(new Event('input', { bubbles: true }));
          }
          const commentInput = reqForm.querySelector('[name="comment"]');
          const desktopRequest = window.matchMedia('(min-width: 1024px)').matches;
          const canUpdateComment = desktopRequest
            ? commentInput && (!commentInput.value.trim() || commentInput.value === generatedRequestComment)
            : commentInput && lastCalculation && lastCalculation.boxes > 0;
          if (canUpdateComment) {
            const finish = swatches[selectedColorIdx]?.dataset.color;
            const finishReference = desktopRequest && finish ? ` Acabado de referencia: ${finish} (por confirmar con el asesor).` : '';
            if (lastCalculation && lastCalculation.boxes > 0) {
              const wasteMsg = lastCalculation.includeWaste ? ' (+10% merma)' : '';
              let details = '';
              if (currentMode === 'dimensions') {
                const rooms = getRoomsData();
                if (rooms && rooms.length > 0) {
                  const rDetails = rooms.map(r => `${r.name || 'Ambiente'}: ${number.format(r.length)}m × ${number.format(r.width)}m (${number.format(r.area)} m²)`).join(', ');
                  details = ` [Ambientes: ${rDetails}]`;
                }
              }
              generatedRequestComment = `Solicitud de Piso SPC: ${lastCalculation.boxes} cajas calculadas para ${number.format(lastCalculation.netArea)} m² netos${wasteMsg} (cobertura total ${number.format(lastCalculation.covered)} m²).${details}${finishReference}`;
            } else {
              generatedRequestComment = `Me gustaría recibir asesoría para mi proyecto con piso SPC.${finishReference}`;
            }
            commentInput.value = generatedRequestComment;
          }
        }
        modalEl.showModal();
        document.body.classList.add('spc-modal-open');
        scheduleStickyCta();
      }

      function closeOrderModal() {
        modalEl?.close();
      }
      const syncModalState = () => {
        document.body.classList.toggle('spc-modal-open', !!page.querySelector('dialog[open]'));
        scheduleStickyCta();
      };
      modalEl?.addEventListener('close', () => {
        syncModalState();
        if (!page.querySelector('dialog[open]') && requestReturnFocus?.isConnected) {
          requestReturnFocus.focus({ preventScroll: true });
        }
      });

      if (orderBtn) {
        orderBtn.addEventListener('click', e => {
          e.preventDefault();
          if (!lastCalculation) {
            if (errorEl) {
              errorEl.textContent = 'Completa las medidas para calcular tu cantidad.';
              errorEl.hidden = false;
            }
            const firstIncomplete = [...form.querySelectorAll('[data-dim]')].find(input => !input.value || !input.validity.valid);
            (currentMode === 'direct' ? directArea : firstIncomplete)?.focus();
            return;
          }
          openOrderModal();
        });
      }

      if (modalEl) {
        modalEl.querySelectorAll('[data-modal-close]').forEach(btn => {
          btn.addEventListener('click', e => {
            e.preventDefault();
            closeOrderModal();
          });
        });

      }

      page.querySelectorAll('a[href="#solicitud"]').forEach(link => {
        if (link !== orderBtn) {
          link.addEventListener('click', e => {
            e.preventDefault();
            openOrderModal();
          });
        }
      });

      if (window.location.hash === '#solicitud') {
        setTimeout(openOrderModal, 300);
      }

      // Initialize request form inside #solicitud
      const reqForm = page.querySelector('#solicitud [data-request-form]');
      if (reqForm && !reqForm.dataset.initialized && !reqForm.dataset.spcInitialized) {
        reqForm.dataset.spcInitialized = 'true';
        reqForm.dataset.initialized = 'true';
        const fieldset = reqForm.querySelector('fieldset');
        const submitBtn = reqForm.querySelector('[data-enable-form]');
        if (fieldset) fieldset.disabled = false;
        if (submitBtn) submitBtn.disabled = false;

        const qtyInput = reqForm.querySelector('[name="quantity"]');
        const summaryQty = reqForm.closest('.form-box')?.querySelector('[data-form-qty]');
        const summaryTotal = reqForm.closest('.form-box')?.querySelector('[data-form-total]');
        const select = reqForm.querySelector('[name="variant_id"]');
        const currency = reqForm.dataset.currency || 'PEN';

        function updateFormSummary() {
          const qty = Math.max(1, parseInt(qtyInput?.value, 10) || 1);
          if (summaryQty) summaryQty.textContent = `${qty} ${qty === 1 ? 'caja' : 'cajas'}`;
          if (summaryTotal) {
            const rawPrice = (select?.selectedOptions?.[0] || select?.querySelector('option[selected]'))?.dataset.price;
            const price = rawPrice?.trim() ? Number(rawPrice) : NaN;
            if (!Number.isFinite(price) || price < 0) {
              summaryTotal.textContent = 'Importe por confirmar';
              return;
            }
            const total = (qty * price) / 100;
            summaryTotal.textContent = new Intl.NumberFormat('es-PE', { style: 'currency', currency }).format(total);
          }
        }
        if (qtyInput) {
          qtyInput.addEventListener('input', updateFormSummary);
          updateFormSummary();
        }

        select?.addEventListener('change', updateFormSummary);
        select?.addEventListener('change', updateEstimate);
        reqForm.addEventListener('submit', e => {
          e.preventDefault();
          if (!reqForm.reportValidity()) return;
          const statusEl = reqForm.querySelector('[data-request-status]');
          if (statusEl) {
            statusEl.textContent = 'Simulación completada. No se ha enviado ni registrado una solicitud. Contacta con un asesor para realizar tu pedido.';
            statusEl.hidden = false;
            statusEl.focus();
          }
        });
      }

      form.addEventListener('submit', event => {
        event.preventDefault();
        recalculate();
        if (orderBtn && lastCalculation) {
          orderBtn.focus();
        }
      });

      // Mobile Persistent Sticky CTA ("Realizar pedido")
      const mobileStickyCta = page.querySelector('[data-spc-sticky-cta]');
      const calcSection = page.querySelector('.spc-v2-calculator');

      if (mobileStickyCta && calcSection) {
        let ticking = false;
        let frame;
        const controller = new AbortController();

        const updateStickyCta = () => {
          const calcRect = calcSection.getBoundingClientRect();
          // The calculator is in the viewport (active zone)
          const calcVisible = calcRect.top < window.innerHeight * 0.75 && calcRect.bottom > window.innerHeight * 0.15;
          const modalOpen = document.body.classList.contains('spc-modal-open');
          const isMobile = window.matchMedia('(max-width: 767px)').matches;
          const shouldShow = isMobile && window.scrollY > 0 && !calcVisible && !modalOpen;

          mobileStickyCta.classList.toggle('is-visible', shouldShow);
          mobileStickyCta.inert = !shouldShow;
          ticking = false;
        };

        scheduleStickyCta = () => {
          if (ticking) return;
          ticking = true;
          frame = window.requestAnimationFrame(updateStickyCta);
        };

        window.addEventListener('scroll', scheduleStickyCta, { passive: true, signal: controller.signal });
        window.addEventListener('resize', scheduleStickyCta, { signal: controller.signal });
        pageControllers.set(page, () => {
          controller.abort();
          window.cancelAnimationFrame(frame);
          pageControllers.delete(page);
          document.body.classList.remove('spc-modal-open');
        });
        scheduleStickyCta();

        // Smooth scroll to calculator on click
        mobileStickyCta.addEventListener('click', e => {
          e.preventDefault();
          calcSection.focus({ preventScroll: true });
          calcSection.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
        }, { signal: controller.signal });
      }

      // Initial run
      chooseColor(0);
      updateRoomsUI();
      recalculate();
    });
  }

  window.DecokasaSPC = { init };
  init(document);
  document.addEventListener('shopify:section:load', event => init(event.target));
  document.addEventListener('shopify:section:unload', event => {
    const pages = [...event.target.querySelectorAll('[data-spc-page]')];
    if (event.target.matches?.('[data-spc-page]')) pages.unshift(event.target);
    pages.forEach(page => { loadingControllers.get(page)?.(); testimonialControllers.get(page)?.(); pageControllers.get(page)?.(); calculatorLayoutControllers.get(page)?.(); navigationControllers.get(page)?.(); motionControllers.get(page)?.(); layerControllers.get(page)?.(); finishControllers.get(page)?.(); initialized.delete(page); });
  });
})();
