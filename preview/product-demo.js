// This adapter exists only for the local, clearly labeled demo. Shopify renders real variants.
document.querySelectorAll('[data-product-page]').forEach(page => {
  const variants = JSON.parse(page.querySelector('[data-preview-variants]').textContent);
  function selectVariant(variant, link) {
    const select = page.querySelector('[name=variant_id]');
    const option = document.createElement('option');
    option.value = variant.id; option.textContent = variant.title;
    option.dataset.price = variant.price; option.dataset.sku = variant.sku; option.dataset.coverage = variant.coverage || '';
    option.selected = true; select.replaceChildren(option);
    const priceEl = page.querySelector('[data-product-price]');
    if (priceEl) {
      priceEl.dataset.cents = variant.price;
      priceEl.textContent = `S/. ${(variant.price / 100).toFixed(2)} PEN`;
    }
    const sku = page.querySelector('dd[data-sku]');
    if (sku) sku.textContent = variant.sku || 'Pendiente';
    const compare = page.querySelector('.product-compare-price');
    if (compare && variant.compare_at_price) compare.textContent = 'S/. ' + (variant.compare_at_price / 100).toFixed(2) + ' PEN';
    select.dispatchEvent(new Event('change', {bubbles: true}));
    page.dispatchEvent(new CustomEvent('decokasa:variant', {bubbles: true}));
    page.querySelectorAll('[data-option-link]').forEach(item => { if (item === link) item.setAttribute('aria-current', 'true'); else item.removeAttribute('aria-current'); });
    const label = page.querySelector('.product-option-label strong');
    if (label) label.textContent = variant.title;
    page.querySelector(`[data-gallery-choice="${variant.imageId}"]`)?.click();
    page.querySelector('[data-selection-status]').textContent = 'Presentación de muestra actualizada.';
  }
  const links = [...page.querySelectorAll('[data-option-link]')];
  const optionValues = link => new URL(link.href, location.href).searchParams.get('option_values');
  page.addEventListener('click', event => {
    const link = event.target.closest('[data-option-link]');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    event.stopPropagation();
    const variant = variants.find(item => item.optionValues === optionValues(link));
    if (variant) selectVariant(variant, link);
  });
  const selected = new URLSearchParams(location.search).get('variant');
  const initial = variants.find(item => item.id === selected);
  if (initial) {
    selectVariant(initial, links.find(link => optionValues(link) === initial.optionValues));
  }
});
