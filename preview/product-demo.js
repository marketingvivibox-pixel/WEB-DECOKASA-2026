// This adapter exists only for the local, clearly labeled demo. Shopify renders real variants.
document.querySelectorAll('[data-product-page]').forEach(page => {
  const variantData = page.querySelector('[data-preview-variants]');
  if (!variantData) return;
  const variants = JSON.parse(variantData.textContent);
  function updateGallery(variant) {
    const media = variant.metafields?.decokasa?.gallery_images?.value;
    if (!media?.length) return;
    const stage = page.querySelector('[data-gallery-stage]');
    const thumbnails = page.querySelector('.product-thumbnails');
    stage.querySelectorAll('[data-gallery-panel]').forEach(panel => panel.remove());
    thumbnails.replaceChildren();
    media.forEach((item, index) => {
      const image = item.preview_image || item;
      const panel = document.createElement('div');
      panel.className = 'product-image-panel'; panel.dataset.galleryPanel = item.id; panel.hidden = index !== 0;
      const img = document.createElement('img');
      Object.assign(img, {src:image.src, alt:image.alt, width:image.width, height:image.height, className:'product-main-image'});
      panel.appendChild(img); stage.appendChild(panel);
      const thumb = document.createElement('a');
      thumb.className = 'product-thumbnail'; thumb.href = image.src; thumb.dataset.galleryChoice = item.id;
      thumb.setAttribute('aria-label', `Ver imagen ${index + 1}: ${image.alt}`);
      if (index === 0) thumb.setAttribute('aria-current', 'true');
      const small = img.cloneNode(); small.className = ''; thumb.appendChild(small); thumbnails.appendChild(thumb);
    });
  }
  function selectVariant(variant, link) {
    const select = page.querySelector('[name=variant_id]');
    const option = document.createElement('option');
    option.value = variant.id; option.textContent = variant.title;
    option.dataset.price = variant.price; option.dataset.sku = variant.sku; option.dataset.coverage = variant.coverage || '';
    option.selected = true; select.replaceChildren(option);
    page.dataset.pricePending = String(variant.price <= 0);
    const priceEl = page.querySelector('[data-product-price]');
    if (priceEl) {
      priceEl.dataset.cents = variant.price;
      priceEl.textContent = variant.price > 0 ? `S/. ${(variant.price / 100).toFixed(2)} PEN` : 'Precio por confirmar';
    }
    const sku = page.querySelector('dd[data-sku]');
    if (sku) sku.textContent = variant.sku || 'Pendiente';
    const compare = page.querySelector('.product-compare-price');
    if (compare && variant.compare_at_price) compare.textContent = 'S/. ' + (variant.compare_at_price / 100).toFixed(2) + ' PEN';
    updateGallery(variant);
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
