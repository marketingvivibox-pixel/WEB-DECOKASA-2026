(() => {
  const curtain = document.querySelector('.motion-curtain');
  if (!curtain || window.Shopify?.designMode) return;

  const motion = window.matchMedia('(prefers-reduced-motion: no-preference)');
  const homePath = new URL(document.body.dataset.motionHome, location.href).pathname;
  const catalogPath = new URL(document.body.dataset.motionCatalog, location.href).pathname;
  const collectionsPath = catalogPath.endsWith('/all') ? catalogPath.slice(0, -3) : null;

  function viewFor(url) {
    if (url.origin !== location.origin || url.protocol !== location.protocol) return;
    if (url.pathname === homePath) return 'home';
    if (url.pathname === catalogPath || (collectionsPath && url.pathname.startsWith(collectionsPath))) {
      return 'catalog';
    }
  }

  function changesView(from, to) {
    const fromView = viewFor(from);
    const toView = viewFor(to);
    return fromView && toView && fromView !== toView;
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
      if (viewTransition && (!motion.matches || !activation?.entry?.url ||
        !changesView(new URL(location.href), new URL(activation.entry.url)))) {
        viewTransition.skipTransition();
      }
    });
    let pageRevealed = false;
    window.addEventListener('pagereveal', ({ viewTransition }) => {
      pageRevealed = true;
      revealContent(viewTransition);
    }, { once: true });
    window.addEventListener('pageshow', () => {
      if (!pageRevealed) revealContent();
    }, { once: true });
    return;
  }

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
    if (!changesView(new URL(location.href), destination)) return;
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
