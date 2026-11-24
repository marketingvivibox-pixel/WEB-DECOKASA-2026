(() => {
  'use strict';

  if (window.Shopify?.designMode) return;

  const curtain = document.querySelector('.motion-curtain');
  if (!curtain) return;

  const motion = window.matchMedia('(prefers-reduced-motion: no-preference)');
  const vtContextKey = 'decokasa.vt.context';
  const homeDataset = document.body?.dataset?.motionHome || '/';
  const catalogDataset = document.body?.dataset?.motionCatalog || '/collections/all';
  const homePath = new URL(homeDataset, location.href).pathname;
  const catalogPath = new URL(catalogDataset, location.href).pathname;
  const collectionsPath = catalogPath.endsWith('/all') ? catalogPath.slice(0, -3) : null;

  function viewFor(url) {
    if (!url || url.origin !== location.origin || url.protocol !== location.protocol) return null;
    if (url.pathname === homePath) return 'home';
    if (url.pathname === catalogPath || (collectionsPath && url.pathname.startsWith(collectionsPath))) {
      return 'catalog';
    }
    return 'other';
  }

  function isCurtainTransition(from, to) {
    const fromView = viewFor(from);
    const toView = viewFor(to);
    return (fromView === 'home' && toView === 'catalog') || (fromView === 'catalog' && toView === 'home');
  }

  function isCustomLandingUrl(url) {
    if (!url) return false;
    const p = url.pathname.toLowerCase();
    return p.endsWith('landing-piso-spc.html') || p.endsWith('landing-pisos-pvc.html');
  }

  function extractProductHandle(url) {
    if (!url || isCustomLandingUrl(url)) return '';
    const shopifyMatch = url.pathname.match(/\/products\/([^/?#]+)/i);
    if (shopifyMatch) return decodeURIComponent(shopifyMatch[1]);
    const previewMatch = url.pathname.match(/landing-([a-z0-9-]+)\.html$/i);
    if (previewMatch) return previewMatch[1].toLowerCase();
    return '';
  }

  function sanitizeIdent(raw) {
    return String(raw || '').toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/^-+|-+$/g, '') || 'item';
  }

  function isVisibleInViewport(el) {
    if (!el || el.hidden || el.offsetParent === null) return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 &&
      rect.bottom > -80 && rect.top < window.innerHeight + 120 &&
      rect.right > -40 && rect.left < window.innerWidth + 40;
  }

  function readContext() {
    try {
      const saved = JSON.parse(sessionStorage.getItem(vtContextKey) || 'null');
      if (saved && Date.now() - saved.time < 8000) return saved;
    } catch {}
    return null;
  }

  function writeContext(data) {
    try {
      sessionStorage.setItem(vtContextKey, JSON.stringify({ ...data, time: Date.now() }));
    } catch {}
  }

  // Record clicked product card handle before navigation starts so back/related/card morphs always match
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    let destination;
    try { destination = new URL(link.href, location.href); } catch { return; }
    if (destination.origin !== location.origin) return;
    const clickedCard = link.closest('.catalog-card[data-product-handle]');
    const currentProduct = document.querySelector('[data-product-page][data-product-handle]');
    writeContext({
      clickedHandle: clickedCard?.dataset.productHandle || extractProductHandle(destination),
      fromProductHandle: currentProduct?.dataset.productHandle || '',
      fromHref: location.href,
      toHref: destination.href
    });
  }, true);

  function bindProductPageElements(productPage, cleanupList, usedNames) {
    if (!productPage) return false;
    const pairs = [
      [productPage.querySelector('.product-image-stage'), 'dk-product-media'],
      [productPage.querySelector('.product-summary h1'), 'dk-product-title'],
      [productPage.querySelector('.product-vendor'), 'dk-product-vendor'],
      [productPage.querySelector('[data-product-price]'), 'dk-product-price'],
      [productPage.querySelector('.product-purchase .product-cta, .request-continue'), 'dk-product-cta']
    ];
    let bound = false;
    for (const [el, name] of pairs) {
      if (!el || el.hidden || usedNames.has(name)) continue;
      usedNames.add(name);
      el.style.viewTransitionName = name;
      cleanupList.push(el);
      bound = true;
    }
    return bound;
  }

  function bindProductCardElements(card, cleanupList, usedNames) {
    if (!card || !isVisibleInViewport(card)) return false;
    const pairs = [
      [card.querySelector('.catalog-card-media'), 'dk-product-media'],
      [card.querySelector('h3'), 'dk-product-title'],
      [card.querySelector('.tag'), 'dk-product-vendor'],
      [card.querySelector('[data-card-price]'), 'dk-product-price'],
      [card.querySelector('.interface-card-action'), 'dk-product-cta']
    ];
    let bound = false;
    for (const [el, name] of pairs) {
      if (!el || el.hidden || usedNames.has(name)) continue;
      usedNames.add(name);
      el.style.viewTransitionName = name;
      cleanupList.push(el);
      bound = true;
    }
    return bound;
  }

  function bindRemainingGridCards(excludeHandle, cleanupList, usedNames) {
    const cards = document.querySelectorAll('.catalog-grid .catalog-card[data-product-handle]');
    for (const card of cards) {
      const handle = card.dataset.productHandle;
      if (!handle || handle === excludeHandle || !isVisibleInViewport(card)) continue;
      const name = 'dk-card-' + sanitizeIdent(handle);
      if (usedNames.has(name)) continue;
      usedNames.add(name);
      card.style.viewTransitionName = name;
      cleanupList.push(card);
    }
  }

  function setupMorphTargets(role, fromUrl, toUrl) {
    const cleanupList = [];
    const usedNames = new Set();
    const ctx = readContext();
    const currentProductPage = document.querySelector('[data-product-page][data-product-handle]');
    const currentPageHandle = currentProductPage?.dataset.productHandle || '';
    const fromHandle = extractProductHandle(fromUrl) || ctx?.fromProductHandle || '';
    const toHandle = extractProductHandle(toUrl) || ctx?.clickedHandle || '';

    if (role === 'outgoing') {
      if (toHandle) {
        // Navigating TO a product page (from Home, Catalog, Search, or Related Products on another Product Page)
        const matchingCard = [...document.querySelectorAll(`.catalog-card[data-product-handle="${CSS.escape(toHandle)}"]`)]
          .find(isVisibleInViewport);
        if (matchingCard) {
          bindProductCardElements(matchingCard, cleanupList, usedNames);
        }
      } else if (currentProductPage && currentPageHandle) {
        // Leaving a product page back to Catalog / Home / Search
        bindProductPageElements(currentProductPage, cleanupList, usedNames);
      }
      bindRemainingGridCards(toHandle || currentPageHandle, cleanupList, usedNames);
    } else if (role === 'incoming') {
      if (currentProductPage && currentPageHandle) {
        // Arriving ON a product page
        bindProductPageElements(currentProductPage, cleanupList, usedNames);
      } else if (fromHandle) {
        // Returning FROM a product page onto Catalog / Home: morph back into its card if visible!
        const targetCard = [...document.querySelectorAll(`.catalog-card[data-product-handle="${CSS.escape(fromHandle)}"]`)]
          .find(isVisibleInViewport);
        if (targetCard) {
          bindProductCardElements(targetCard, cleanupList, usedNames);
        }
      }
      bindRemainingGridCards(currentPageHandle || fromHandle, cleanupList, usedNames);
    }

    return () => {
      for (const el of cleanupList) {
        el.style.viewTransitionName = '';
      }
      delete document.documentElement.dataset.transitionMode;
    };
  }

  function revealContent(transition) {
    if (!motion.matches || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting) continue;
        observer.unobserve(target);
        if (target.closest('[data-motion-group]')) {
          const siblings = [...target.parentElement.children].filter((item) => item.matches('[data-motion]'));
          const column = Math.min(siblings.indexOf(target), 3);
          target.style.setProperty('--motion-delay', `calc(var(--motion-stagger) * ${column})`);
        }
        target.dataset.motionActive = '';
      }
    }, { rootMargin: '0px 0px -12px' });

    const observe = () => document.querySelectorAll('[data-motion]').forEach((item) => observer.observe(item));
    if (transition) transition.finished.then(observe, observe);
    else observe();
  }

  const supportsNavigationTransition = window === window.top && location.protocol !== 'file:' && 'onpageswap' in window &&
    'onpagereveal' in window && CSS.supports('view-transition-name: decokasa-curtain');

  if (supportsNavigationTransition) {
    window.addEventListener('pageswap', ({ viewTransition, activation }) => {
      if (!viewTransition) return;
      if (!motion.matches || !activation?.entry?.url) {
        viewTransition.skipTransition();
        return;
      }
      const fromUrl = new URL(location.href);
      const toUrl = new URL(activation.entry.url);
      if (toUrl.origin !== fromUrl.origin || isCustomLandingUrl(fromUrl) || isCustomLandingUrl(toUrl)) {
        viewTransition.skipTransition();
        return;
      }

      if (isCurtainTransition(fromUrl, toUrl)) {
        document.documentElement.dataset.transitionMode = 'curtain';
        viewTransition.finished.finally(() => {
          delete document.documentElement.dataset.transitionMode;
        });
      } else {
        document.documentElement.dataset.transitionMode = 'morph';
        const cleanup = setupMorphTargets('outgoing', fromUrl, toUrl);
        viewTransition.finished.finally(cleanup);
      }
    });

    let pageRevealed = false;
    window.addEventListener('pagereveal', ({ viewTransition }) => {
      pageRevealed = true;
      if (!viewTransition) {
        revealContent();
        return;
      }
      if (!motion.matches) {
        viewTransition.skipTransition();
        revealContent();
        return;
      }

      const navActivation = window.navigation?.activation;
      const ctx = readContext();
      let fromUrl = null;
      try {
        if (navActivation?.from?.url) fromUrl = new URL(navActivation.from.url);
        else if (ctx?.fromHref) fromUrl = new URL(ctx.fromHref);
      } catch {}
      const toUrl = new URL(location.href);

      if (!fromUrl || fromUrl.origin !== toUrl.origin || isCustomLandingUrl(fromUrl) || isCustomLandingUrl(toUrl)) {
        viewTransition.skipTransition();
        revealContent();
        return;
      }

      if (isCurtainTransition(fromUrl, toUrl)) {
        document.documentElement.dataset.transitionMode = 'curtain';
        viewTransition.finished.finally(() => {
          delete document.documentElement.dataset.transitionMode;
        });
      } else {
        document.documentElement.dataset.transitionMode = 'morph';
        const cleanup = setupMorphTargets('incoming', fromUrl, toUrl);
        viewTransition.finished.finally(cleanup);
      }

      revealContent(viewTransition);
    }, { once: true });

    window.addEventListener('pageshow', () => {
      if (!pageRevealed) revealContent();
    }, { once: true });
    return;
  }

  // Fallback for browsers without Cross-Document View Transitions (e.g. Firefox)
  const storageKey = 'decokasa.curtain';
  let navigating = false;

  function playCurtain(state) {
    curtain.dataset.curtainState = state;
    const animation = curtain.getAnimations?.()[0];
    return animation ? animation.finished.catch(() => {}) : Promise.resolve();
  }

  window.addEventListener('pageshow', ({ persisted }) => {
    if (!persisted) return;
    navigating = false;
    delete curtain.dataset.curtainState;
  });

  document.addEventListener('click', async (event) => {
    if (!motion.matches || event.defaultPrevented || event.button !== 0 ||
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest?.('a[href]');
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;

    const destination = new URL(link.href, location.href);
    if (!isCurtainTransition(new URL(location.href), destination)) return;
    event.preventDefault();
    if (navigating) return;

    navigating = true;
    await playCurtain('cover');
    try {
      sessionStorage.setItem(storageKey, JSON.stringify({ url: destination.href, time: Date.now() }));
    } catch {}
    location.assign(destination.href);
  });

  let arrival;
  try {
    arrival = JSON.parse(sessionStorage.getItem(storageKey) || 'null');
    sessionStorage.removeItem(storageKey);
  } catch {}

  if (motion.matches && arrival?.url === location.href && Date.now() - arrival.time < 10000) {
    playCurtain('reveal').then(() => {
      delete curtain.dataset.curtainState;
      revealContent();
    });
  } else {
    revealContent();
  }
})();
