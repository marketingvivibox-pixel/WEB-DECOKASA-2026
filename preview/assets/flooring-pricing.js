(function (root) {
  'use strict';
  function normalize(value) {
    if (!Array.isArray(value)) return [];
    return value.filter(tier => tier && Number.isSafeInteger(tier.min_boxes) && tier.min_boxes >= 1 && Number.isSafeInteger(tier.price_cents) && tier.price_cents > 0).sort((a, b) => a.min_boxes - b.min_boxes);
  }
  function read(element) {
    try { return normalize(JSON.parse(element?.dataset.quantityPrices || '[]')); }
    catch (_) { return []; }
  }
  function unitPrice(quantity, baseCents, tiers = []) {
    if (!Number.isSafeInteger(quantity) || quantity < 1) return baseCents;
    return normalize(tiers).reduce((price, tier) => quantity >= tier.min_boxes ? tier.price_cents : price, baseCents);
  }
  const api = {read, unitPrice};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.DecokasaFloorPricing = api;
})(typeof window === 'undefined' ? null : window);
