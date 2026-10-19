// This adapter exists only for the local, clearly labeled demo. Shopify renders real variants.
document.querySelectorAll('[data-product-page]').forEach(page => {
  page.addEventListener('click', event => {
    const link = event.target.closest('[data-option-link]');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); event.stopPropagation();
    const variants = JSON.parse(page.querySelector('[data-preview-variants]').textContent);
    const variant = variants.find(item => item.optionValues === new URL(link.href, location.href).searchParams.get('option_values'));
    if (!variant) return;
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
    select.dispatchEvent(new Event('change', {bubbles: true}));
    page.dispatchEvent(new CustomEvent('decokasa:variant', {bubbles: true}));
    page.querySelectorAll('[data-option-link]').forEach(item => { if (item === link) item.setAttribute('aria-current', 'true'); else item.removeAttribute('aria-current'); });
    page.querySelector('.product-option-label strong').textContent = variant.title;
    page.querySelector(`[data-gallery-choice="${variant.imageId}"]`)?.click();
    page.querySelector('[data-selection-status]').textContent = 'Presentación de muestra actualizada.';
  });
});
