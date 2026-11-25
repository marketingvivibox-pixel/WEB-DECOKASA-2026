(() => {
  'use strict';

  if (window.Shopify?.designMode) return;

  const motion = window.matchMedia('(prefers-reduced-motion: no-preference)');
  const vtContextKey = 'decokasa.vt.context';
  const prefetched = new Set();
  let lastClickedCard = null;

  function getRoutes() {
    const homeDataset = document.body?.dataset?.motionHome || '/';
    const catalogDataset = document.body?.dataset?.motionCatalog || '/collections/all';
    const homePath = new URL(homeDataset, location.href).pathname;
    const catalogPath = new URL(catalogDataset, location.href).pathname;
    const collectionsPath = catalogPath.endsWith('/all') ? catalogPath.slice(0, -3) : null;
    return { homePath, catalogPath, collectionsPath };
  }

  function viewFor(url) {
    if (!url || url.origin !== location.origin || url.protocol !== location.protocol) return null;
    const { homePath, catalogPath, collectionsPath } = getRoutes();
    if (url.pathname === homePath) return 'home';
    if (url.pathname === catalogPath || (collectionsPath && url.pathname.startsWith(collectionsPath))) {
      return 'catalog';
    }
    const p = url.pathname.toLowerCase();
    if (p.includes('libro-reclamaciones')) return 'book';
    return 'other';
  }

  function isCurtainTransition(from, to) {
    const fromView = viewFor(from);
    const toView = viewFor(to);
    return (fromView === 'home' && toView === 'catalog') || (fromView === 'catalog' && toView === 'home');
  }

  function isBookTransition(from, to) {
    return viewFor(from) === 'book' || viewFor(to) === 'book';
  }

  function isCatalogToCatalog(from, to) {
    return viewFor(from) === 'catalog' && viewFor(to) === 'catalog';
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
    if (!el || el.hidden) return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 &&
      rect.bottom > 0 && rect.top < window.innerHeight &&
      rect.right > 0 && rect.left < window.innerWidth;
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

  // Prefetch destination HTML on hover/focus so cross-document transitions start with 0ms network wait
  function prefetchUrl(href) {
    if (!href || prefetched.has(href) || prefetched.size > 16) return;
    let url;
    try { url = new URL(href, location.href); } catch { return; }
    if (url.origin !== location.origin || url.href === location.href || url.hash) return;
    prefetched.add(url.href);
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url.href;
    document.head?.appendChild(link);
  }

  document.addEventListener('pointerover', (event) => {
    const link = event.target.closest?.('a[href]');
    if (link) prefetchUrl(link.href);
  }, { passive: true });

  document.addEventListener('focusin', (event) => {
    const link = event.target.closest?.('a[href]');
    if (link) prefetchUrl(link.href);
  }, { passive: true });

  // Capture exact clicked product card handle before navigation begins
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    let destination;
    try { destination = new URL(link.href, location.href); } catch { return; }
    if (destination.origin !== location.origin) return;
    const clickedCard = link.closest('.catalog-card[data-product-handle]');
    lastClickedCard = clickedCard || null;
    const currentProduct = document.querySelector('[data-product-page][data-product-handle]');
    writeContext({
      clickedHandle: clickedCard?.dataset.productHandle || extractProductHandle(destination),
      fromProductHandle: currentProduct?.dataset.productHandle || '',
      fromHref: location.href,
      toHref: destination.href
    });
  }, true);

  function bindProductCardElements(card, bindOne) {
    if (!card) return;
    bindOne(card.querySelector('.catalog-card-media'), 'dk-product-media');
    bindOne(card.querySelector('.tag'), 'dk-product-vendor');
    bindOne(card.querySelector('h3'), 'dk-product-title');
    bindOne(card.querySelector('[data-card-price]'), 'dk-product-price');
    const compare = card.querySelector('[data-card-compare]');
    if (compare && !compare.hidden && compare.textContent.trim()) {
      bindOne(compare, 'dk-product-compare');
    }
  }

  function bindProductPageElements(productPage, bindOne) {
    if (!productPage) return;
    bindOne(productPage.querySelector('.product-image-stage'), 'dk-product-media');
    bindOne(productPage.querySelector('.product-vendor'), 'dk-product-vendor');
    bindOne(productPage.querySelector('.product-summary h1'), 'dk-product-title');
    bindOne(productPage.querySelector('[data-product-price], .product-price'), 'dk-product-price');
    const compare = productPage.querySelector('.product-compare-price');
    if (compare && !compare.hidden && compare.textContent.trim()) {
      bindOne(compare, 'dk-product-compare');
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

    const bindOne = (el, name) => {
      if (!el || el.hidden || usedNames.has(name)) return;
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      usedNames.add(name);
      el.style.viewTransitionName = name;
      cleanupList.push(el);
    };

    const findVisibleCard = (handle, preferred = null) => {
      if (!handle) return null;
      if (preferred && preferred.isConnected && preferred.dataset.productHandle === handle && isVisibleInViewport(preferred)) {
        return preferred;
      }
      return [...document.querySelectorAll(`.catalog-card[data-product-handle="${CSS.escape(handle)}"]`)]
        .find(isVisibleInViewport) || null;
    };

    if (role === 'outgoing') {
      const matchingCard = toHandle && toHandle !== currentPageHandle
        ? findVisibleCard(toHandle, lastClickedCard)
        : null;
      if (matchingCard) {
        bindProductCardElements(matchingCard, bindOne);
      } else if (currentProductPage && currentPageHandle) {
        bindProductPageElements(currentProductPage, bindOne);
      }
    } else if (role === 'incoming') {
      if (currentProductPage && currentPageHandle) {
        bindProductPageElements(currentProductPage, bindOne);
      } else if (fromHandle) {
        const targetCard = findVisibleCard(fromHandle);
        if (targetCard) {
          bindProductCardElements(targetCard, bindOne);
        }
      }
    }

    // Only assign individual grid card names on Collection <-> Collection navigations (avoids extra GPU layers elsewhere)
    if (isCatalogToCatalog(fromUrl, toUrl)) {
      const cards = document.querySelectorAll('.catalog-grid .catalog-card[data-product-handle]');
      for (const card of cards) {
        const handle = card.dataset.productHandle;
        if (!handle || !isVisibleInViewport(card)) continue;
        bindOne(card, 'dk-card-' + sanitizeIdent(handle));
      }
    }

    return () => {
      for (const el of cleanupList) {
        el.style.viewTransitionName = '';
      }
      delete document.documentElement.dataset.transitionMode;
    };
  }

  function revealContent(transition, skipInitialViewport = false) {
    if (!motion.matches || !('IntersectionObserver' in window)) return;

    const startObserving = () => {
      const items = document.querySelectorAll('[data-motion]');
      if (!items.length) return;

      if (skipInitialViewport) {
        // Prevent double-animating elements that already landed via View Transition
        for (const item of items) {
          const rect = item.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
            item.dataset.motionSettled = '';
          }
        }
      }

      const observer = new IntersectionObserver((entries) => {
        for (const { target, isIntersecting } of entries) {
          if (!isIntersecting) continue;
          observer.unobserve(target);
          if ('motionSettled' in target.dataset) continue;
          if (target.closest('[data-motion-group]')) {
            const siblings = [...target.parentElement.children].filter((item) => item.matches('[data-motion]'));
            const column = Math.min(siblings.indexOf(target), 3);
            target.style.setProperty('--motion-delay', `calc(var(--motion-stagger) * ${column})`);
          }
          target.dataset.motionActive = '';
        }
      }, { rootMargin: '0px 0px -12px' });

      items.forEach((item) => {
        if (!('motionSettled' in item.dataset)) observer.observe(item);
      });
    };

    const runWhenDomReady = () => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startObserving, { once: true });
      } else {
        startObserving();
      }
    };

    if (transition) transition.finished.then(runWhenDomReady, runWhenDomReady);
    else runWhenDomReady();
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
        document.documentElement.dataset.transitionMode = isBookTransition(fromUrl, toUrl) ? 'morph-book' : 'morph';
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
        revealContent(viewTransition, false);
      } else {
        document.documentElement.dataset.transitionMode = isBookTransition(fromUrl, toUrl) ? 'morph-book' : 'morph';
        const cleanup = setupMorphTargets('incoming', fromUrl, toUrl);
        viewTransition.finished.finally(cleanup);
        revealContent(viewTransition, true);
      }
    }, { once: true });

    window.addEventListener('pageshow', () => {
      if (!pageRevealed) revealContent();
    }, { once: true });
    return;
  }

  // Fallback for browsers without Cross-Document View Transitions (e.g. Firefox)
  const initFallback = () => {
    const curtain = document.querySelector('.motion-curtain');
    if (!curtain) return;
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
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFallback, { once: true });
  } else {
    initFallback();
  }
})();
