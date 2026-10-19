// Local fixtures only. Never included in the Shopify theme ZIP.
const escape = value => String(value ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function filters(engine) {
  engine.registerFilter('image_url', image => image?.src || image);
  engine.registerFilter('image_tag', (src, ...args) => {
    const attrs = Object.fromEntries(args.filter(Array.isArray));
    delete attrs.widths;
    return `<img src="${escape(src)}" width="440" height="330" ${Object.entries(attrs).map(([key, value]) => `${key}="${escape(value)}"`).join(' ')}>`;
  });
  engine.registerFilter('stylesheet_tag', src => `<link rel="stylesheet" href="${escape(src)}">`);
  engine.registerFilter('money_with_currency', value => `S/. ${(Number(value) / 100).toFixed(2)} PEN`);
}
function productFixture(entry, index, selected = 0) {
  const images = [0, 1, 2].map(n => ({id: `demo-image-${index}-${n}`, src: `assets/product-${entry.handle}-${n}.svg`, alt: `${entry.name} · imagen ${n + 1}`}));
  const isSingleVariant = Boolean(entry.has_only_default_variant);
  const variantTitles = isSingleVariant ? ['Default Title'] : ['Estándar', 'Alternativa'];
  const variants = variantTitles.map((title, n) => ({id: `DEMO-V-${index}-${n ? 'B' : 'A'}`, title: isSingleVariant ? entry.name : title, price: entry.price + n * 2000, sku: n ? entry.sku.replace(/001$/, '002') : entry.sku, featured_image: images[n], metafields: {decokasa: {coverage_m2: {value: entry.coverage ? (n ? 2.5 : entry.coverage) : null}}}}));
  const values = variants.map((variant, n) => ({id: `demo-option-${index}-${n}`, name: variant.title, selected: selected === n, variant}));
  return {...entry, id: `DEMO-P-${index}`, title: entry.name, vendor: entry.brand, url: `landing-${entry.handle}.html`, description: `<p>${escape(entry.intro)}</p>`, images: isSingleVariant ? [images[0]] : images, featured_image: images[0], has_only_default_variant: isSingleVariant, selected_or_first_available_variant: variants[selected] || variants[0], options_with_values: isSingleVariant ? [] : [{name: 'Presentación', position: 1, selected_value: variants[selected]?.title || 'Estándar', values}], metafields: {decokasa: {coverage_m2: {value: entry.coverage || null}}}, variants};
}
module.exports = {filters, productFixture};
