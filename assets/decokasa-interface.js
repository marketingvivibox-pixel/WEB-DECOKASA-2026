(() => {
  'use strict';

  const storageKey = 'decokasa.storefront.v1';
  const maxUnits = 1000000;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const footerMobile = matchMedia('(max-width: 699px)');
  const mobileNavQuery = matchMedia('(max-width: 899px)');
  const initializedCarousels = new WeakSet();
  const initializedFooters = new WeakSet();
  const initializedMobileNavs = new WeakSet();

  function readStore() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (Array.isArray(saved?.cart) && Array.isArray(saved?.favorites)) return saved;
    } catch {}
    return {cart: [], favorites: []};
  }

  let store = readStore();

  function saveStore() {
    try { localStorage.setItem(storageKey, JSON.stringify(store)); } catch {}
  }

  function announce(message) {
    const status = document.querySelector('[data-interface-status]');
    if (status) status.textContent = message;
  }

  function refreshFavorites() {
    document.querySelectorAll('[data-interface-favorite]').forEach(button => {
      button.hidden = false;
      button.setAttribute('aria-pressed', String(store.favorites.includes(button.dataset.interfaceFavorite)));
    });
  }

  function requestUrl(item) {
    const url = new URL(item.url, location.href);
    if (url.origin !== location.origin) return null;
    url.searchParams.set('variant', item.variant);
    url.searchParams.set('unidades', item.units);
    return url;
  }

  function renderCart() {
    refreshCartCount();
    const dialog = document.querySelector('[data-interface-cart-dialog]');
    if (!dialog) return;
    const list = dialog.querySelector('[data-cart-items]');
    list.replaceChildren();
    for (const item of store.cart) {
      const url = requestUrl(item);
      if (!url) continue;
      const row = document.createElement('li');
      const title = document.createElement('strong');
      title.textContent = item.title;
      const quantity = document.createElement('input');
      quantity.type = 'number';
      quantity.min = '1';
      quantity.max = String(maxUnits);
      quantity.step = '1';
      quantity.value = item.units;
      quantity.setAttribute('aria-label', 'Cantidad de ' + item.title);
      const link = document.createElement('a');
      link.textContent = 'Abrir solicitud';
      link.href = url.href;
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = 'Quitar';
      remove.setAttribute('aria-label', 'Quitar ' + item.title);
      quantity.addEventListener('change', () => {
        if (!quantity.reportValidity() || !validUnits(quantity.value)) {
          quantity.value = item.units;
          return;
        }
        item.units = Number(quantity.value);
        link.href = requestUrl(item).href;
        saveStore();
        refreshCartCount();
      });
      remove.addEventListener('click', () => {
        const index = store.cart.indexOf(item);
        store.cart.splice(index, 1);
        saveStore();
        renderCart();
        (list.children[index]?.querySelector('button') || list.lastElementChild?.querySelector('button') || dialog.querySelector('[autofocus]')).focus();
      });
      row.append(title, quantity, link, remove);
      list.append(row);
    }
    dialog.querySelector('[data-cart-empty]').hidden = list.childElementCount !== 0;
    dialog.querySelector('[data-cart-next]').hidden = list.childElementCount === 0;
  }

  function refreshCartCount() {
    const count = store.cart.reduce((total, item) => total + item.units, 0);
    document.querySelectorAll('[data-interface-cart-count]').forEach(badge => {
      badge.textContent = count > 99 ? '99+' : String(count);
      badge.hidden = count === 0;
      badge.parentElement.setAttribute('aria-label', count ? 'Abrir carrito (' + count + ' unidades)' : 'Abrir carrito');
    });
  }

  function validUnits(value) {
    const units = Number(value);
    return Number.isSafeInteger(units) && units >= 1 && units <= maxUnits;
  }

  function addToCart({title, url, variant, units}) {
    if (!variant || !url || !validUnits(units)) return;
    const destination = new URL(url, location.href);
    if (destination.origin !== location.origin) return;
    destination.search = '';
    destination.hash = '';
    const productUrl = destination.pathname;
    const existing = store.cart.find(item => item.variant === variant && item.url === productUrl);
    if (existing && !validUnits(existing.units + units)) {
      announce('La cantidad máxima por presentación es 1 000 000.');
      return;
    }
    if (existing) existing.units += units;
    else store.cart.push({title, url: productUrl, variant, units});
    saveStore();
    renderCart();
    announce(title + ' se agregó al carrito.');
  }

  function addProduct(page, units) {
    const selected = page.querySelector('[name=variant_id] option');
    if (!selected) return;
    const title = page.dataset.interfaceTitle;
    const presentation = selected.textContent.trim();
    addToCart({
      title: presentation && presentation !== 'Default Title' && presentation !== title ? title + ' · ' + presentation : title,
      url: page.dataset.productUrl,
      variant: selected.value,
      units
    });
  }

  function setCardAction(action) {
    const available = action.dataset.available === 'true' && Boolean(action.dataset.variant);
    const title = action.closest('[data-interface-title]').dataset.interfaceTitle;
    action.querySelector('[data-card-action-label]').textContent = available ? 'Agregar al carrito' : 'Ver ficha';
    action.setAttribute('aria-label', available ? 'Agregar ' + title + ' al carrito' : 'Ver ' + title);
  }

  function initMobileCategoryNav(shell) {
    if (!shell || initializedMobileNavs.has(shell)) return;
    const nav = shell.querySelector('.store-nav');
    if (!nav) return;
    initializedMobileNavs.add(shell);

    const prevArrow = shell.querySelector('[data-store-nav-arrow="-1"]');
    const nextArrow = shell.querySelector('[data-store-nav-arrow="1"]');

    let paused = false;
    let pauseTimer = null;
    let direction = 1;
    let lastTime = 0;
    const speed = 18;
    let accum = 0;
    let endCooldown = 0;

    function tempPause(ms = 2000) {
      paused = true;
      if (pauseTimer) clearTimeout(pauseTimer);
      pauseTimer = setTimeout(() => {
        paused = false;
      }, ms);
    }

    function syncArrows() {
      if (!prevArrow || !nextArrow) return;
      const maxScroll = nav.scrollWidth - nav.clientWidth;
      if (maxScroll <= 4) {
        prevArrow.style.opacity = '0.25';
        nextArrow.style.opacity = '0.25';
        return;
      }
      prevArrow.style.opacity = nav.scrollLeft <= 2 ? '0.25' : '1';
      nextArrow.style.opacity = nav.scrollLeft >= maxScroll - 2 ? '0.25' : '1';
      if (nav.scrollLeft >= maxScroll - 2) {
        direction = -1;
      } else if (nav.scrollLeft <= 2) {
        direction = 1;
      }
    }

    if (prevArrow) {
      prevArrow.addEventListener('click', (e) => {
        e.preventDefault();
        tempPause(2200);
        direction = -1;
        nav.scrollBy({ left: -160, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
      });
    }

    if (nextArrow) {
      nextArrow.addEventListener('click', (e) => {
        e.preventDefault();
        tempPause(2200);
        direction = 1;
        nav.scrollBy({ left: 160, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
      });
    }

    nav.addEventListener('pointerdown', () => {
      paused = true;
      if (pauseTimer) clearTimeout(pauseTimer);
    }, { passive: true });

    window.addEventListener('pointerup', () => {
      if (paused) tempPause(1800);
    }, { passive: true });

    window.addEventListener('pointercancel', () => {
      if (paused) tempPause(1800);
    }, { passive: true });

    nav.addEventListener('scroll', syncArrows, { passive: true });

    function tick(time) {
      if (!lastTime) lastTime = time;
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (!paused && mobileNavQuery.matches && !reducedMotion.matches) {
        const maxScroll = nav.scrollWidth - nav.clientWidth;
        if (maxScroll > 6) {
          if (time >= endCooldown) {
            accum += speed * delta * direction;
            if (Math.abs(accum) >= 1) {
              const step = Math.trunc(accum);
              accum -= step;
              nav.scrollLeft += step;

              if (direction === 1 && nav.scrollLeft >= maxScroll - 1) {
                direction = -1;
                endCooldown = time + 1400;
                accum = 0;
              } else if (direction === -1 && nav.scrollLeft <= 1) {
                direction = 1;
                endCooldown = time + 1400;
                accum = 0;
              }
            }
          }
        }
      }
      syncArrows();
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    syncArrows();
  }

  function initCarousel(container) {
    if (initializedCarousels.has(container)) return;
    const track = container.querySelector('[data-carousel-track]');
    const controls = container.querySelector('[data-carousel-controls]');
    if (!track || !controls) return;
    initializedCarousels.add(container);
    const items = Array.from(track.children);
    const previous = controls.querySelector('[data-carousel-step="-1"]');
    const next = controls.querySelector('[data-carousel-step="1"]');
    const dots = controls.querySelector('[data-carousel-dots]');
    const indicators = [];
    const offset = index => items[index].offsetLeft - items[0].offsetLeft;

    function move(index) {
      track.scrollTo({left: offset(Math.max(0, Math.min(items.length - 1, index))), behavior: reducedMotion.matches ? 'auto' : 'smooth'});
    }

    function activeItem() {
      return items.reduce((closest, item, index) => Math.abs(offset(index) - track.scrollLeft) < Math.abs(offset(closest) - track.scrollLeft) ? index : closest, 0);
    }

    function sync() {
      const max = track.scrollWidth - track.clientWidth;
      controls.hidden = max < 2;
      previous.disabled = track.scrollLeft < 2;
      next.disabled = track.scrollLeft >= max - 2;
      if (dots && items.length) {
        const active = activeItem();
        indicators.forEach((button, index) => {
          if (index === active) button.setAttribute('aria-current', 'true');
          else button.removeAttribute('aria-current');
        });
      }
    }

    if (!items.length) return;
    if (dots) items.forEach((item, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', 'Ir a la diapositiva ' + (index + 1));
      button.setAttribute('aria-controls', track.id);
      button.addEventListener('click', () => move(index));
      indicators.push(button);
      dots.append(button);
    });
    previous.addEventListener('click', () => move(activeItem() - 1));
    next.addEventListener('click', () => move(activeItem() + 1));
    track.addEventListener('scroll', sync, {passive: true});
    new ResizeObserver(sync).observe(track);
    sync();
  }

  function init() {
    document.querySelectorAll('[data-interface-cart], [data-interface-product-add]').forEach(button => { button.hidden = false; });
    document.querySelectorAll('[data-interface-card-add]').forEach(setCardAction);
    document.querySelectorAll('[data-carousel]').forEach(initCarousel);
    document.querySelectorAll('.navigation-shell').forEach(initMobileCategoryNav);
    document.querySelectorAll('[data-footer-disclosure]').forEach(details => {
      if (!initializedFooters.has(details)) {
        details.open = !footerMobile.matches || Boolean(details.querySelector('.decokasa-book-access'));
        initializedFooters.add(details);
      }
    });
    renderCart();
    refreshFavorites();
  }

  function applyCartQuantity() {
    const query = new URLSearchParams(location.search);
    const units = query.get('unidades');
    const page = document.querySelector('[data-product-page]');
    const selected = page?.querySelector('[name=variant_id] option');
    const quantity = page?.querySelector('[data-product-quantity]');
    if (!quantity || selected?.value !== query.get('variant') || !validUnits(units)) return;
    quantity.value = units;
    quantity.dispatchEvent(new Event('input', {bubbles: true}));
    const add = page.querySelector('[data-add-request]');
    if (!add || add.disabled) return;
    page.dataset.cartPrefill = '';
    add.click();
    delete page.dataset.cartPrefill;
  }

  document.addEventListener('click', event => {
    if (event.defaultPrevented || !event.target.closest) return;
    const promoToggle = event.target.closest('[data-promo-toggle]');
    if (promoToggle) {
      const bar = promoToggle.closest('.interface-promo');
      if (!bar) return;
      const paused = bar.dataset.promoPaused === 'true';
      bar.dataset.promoPaused = paused ? 'false' : 'true';
      promoToggle.textContent = paused ? '❚❚' : '▶';
      promoToggle.setAttribute('aria-label', paused ? 'Pausar texto en movimiento' : 'Reanudar texto en movimiento');
      return;
    }
    const favorite = event.target.closest('[data-interface-favorite]');
    if (favorite) {
      const handle = favorite.dataset.interfaceFavorite;
      store.favorites = favorite.getAttribute('aria-pressed') === 'true'
        ? store.favorites.filter(value => value !== handle)
        : [...store.favorites, handle];
      saveStore();
      refreshFavorites();
      return;
    }
    const openCart = event.target.closest('[data-interface-cart]');
    if (openCart) {
      document.querySelector('[data-interface-cart-dialog]')?.showModal();
      return;
    }
    const cardAction = event.target.closest('[data-interface-card-add][data-available="true"]');
    if (cardAction && !(event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)) {
      event.preventDefault();
      const card = cardAction.closest('[data-interface-title]');
      const color = card.querySelector('[data-card-color][aria-current="true"]')?.dataset.colorName;
      addToCart({title: card.dataset.interfaceTitle + (color ? ' · ' + color : ''), url: cardAction.href, variant: cardAction.dataset.variant, units: 1});
      return;
    }
    const productAction = event.target.closest('[data-interface-product-add]');
    if (!productAction) return;
    const page = productAction.closest('[data-product-page]');
    const quantity = page.querySelector('[data-product-quantity]');
    if (quantity.reportValidity()) addProduct(page, Number(quantity.value));
  });

  document.addEventListener('decokasa:cart-add', event => addProduct(event.target, event.detail.quantity));
  document.addEventListener('decokasa:card-variant', event => {
    const action = event.target.querySelector('[data-interface-card-add]');
    if (!action) return;
    action.dataset.available = event.detail.colorCart;
    action.dataset.variant = event.detail.colorVariant;
    setCardAction(action);
  });
  document.addEventListener('shopify:section:load', init);
  window.addEventListener('storage', event => {
    if (event.key !== storageKey && event.key !== null) return;
    store = readStore();
    renderCart();
    refreshFavorites();
  });
  footerMobile.addEventListener('change', () => {
    document.querySelectorAll('[data-footer-disclosure]').forEach(details => {
      details.open = !footerMobile.matches || Boolean(details.querySelector('.decokasa-book-access'));
    });
  });
  document.addEventListener('DOMContentLoaded', () => {
    init();
    // The product script must register the existing request builder first.
    setTimeout(applyCartQuantity, 0);
  });
})();
