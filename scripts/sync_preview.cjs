// Render the demo header, homepage and catalog from the real Shopify sections.
const fs = require('node:fs');
const path = require('node:path');
const { Liquid } = require('liquidjs');
const { parseHTML } = require('linkedom');
const root = path.resolve(__dirname, '..');
const engine = new Liquid({ root: [path.join(root, 'snippets'), path.join(root, 'scripts/fixtures')], extname: '.liquid' });
const {filters, productFixture} = require('./product_fixture.cjs');
filters(engine);
engine.registerFilter('asset_url', name => `assets/${name}`);
engine.registerFilter('url_for_vendor', name => `catalogo.html?marca=${encodeURIComponent(name)}`);
engine.registerFilter('url_for_type', name => `catalogo.html?categoria=${encodeURIComponent(name)}`);
engine.registerFilter('handleize', name => String(name).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
const collections = Object.fromEntries(Object.entries(require('../tests/catalog-collections.json')).map(([handle, value]) => [handle, {...value, url: value.url.slice(1)}]));
const routes = { root_url: 'DECOKASA-inicio.html', search_url: 'catalogo.html', all_products_collection_url: 'catalogo.html', collections_url: 'collections' };
async function section(name, overrides = {}, context = {}) {
  const raw = fs.readFileSync(path.join(root, 'sections', `${name}.liquid`), 'utf8');
  const schema = JSON.parse(raw.match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
  const settings = { ...Object.fromEntries(schema.settings.filter(s => s.id).map(s => [s.id, s.default ?? ''])), ...overrides };
  // The local demo contains five examples; Shopify paginates the real collection.
  const source = raw.replace(/{% schema %}[\s\S]*?{% endschema %}/, '').replace(/{% paginate [\s\S]*?%}/g, '').replace(/{% endpaginate %}/g, '').replace('{% assign is_demo = false %}', `{% assign is_demo = ${context.is_demo === true} %}`);
  let html = await engine.parseAndRender(source, { section: { id: `preview-${name}`, settings, blocks: [] }, settings: {}, collections, routes, search: { terms: '' }, ...context });
  const permanentRoutes = {tecnologia: ['categoria', 'Tecnología'], electrodomesticos: ['categoria', 'Electrodomésticos'], bebes: ['categoria', 'Bebés'], fitness: ['categoria', 'Fitness'], 'hogar-y-acabados': ['categoria', 'Acabados'], decokasa: ['marca', 'DECOKASA'], xion: ['marca', 'Xion'], biflex: ['marca', 'Biflex'], 'mundo-baby': ['marca', 'Mundo Baby']};
  for (const [handle, [key, value]] of Object.entries(permanentRoutes)) html = html.replaceAll(`collections/${handle}`, `catalogo.html?${key}=${encodeURIComponent(value)}`);
  return html.replaceAll('collections/types?q=', 'catalogo.html?categoria=').replaceAll('collections/vendors?q=', 'catalogo.html?marca=');
}
async function main() {
  const template = JSON.parse(fs.readFileSync(path.join(root, 'templates/index.json'), 'utf8'));
  const homeSettings = template.sections?.main?.settings ?? {};
  const header = await section('header'), home = await section('home', homeSettings);
  const products = JSON.parse(fs.readFileSync(path.join(root, 'preview/products.json'), 'utf8')).map(product => ({...product, title: product.name, vendor: product.brand, type: product.category, url: `landing-${product.handle}.html`}));
  const catalogTemplate = JSON.parse(fs.readFileSync(path.join(root, 'templates/collection.json'), 'utf8'));
  const catalog = await section('catalog', catalogTemplate.sections?.main?.settings ?? {}, {is_demo: true, shop: {vendors: ['DECOKASA', 'Xion', 'Biflex', 'Mundo Baby'], types: [...new Set(products.map(product => product.type))]}, collection: {handle: 'all', title: 'Todos los productos', products, products_count: products.length, sort_by: 'manual'}});
  const css = fs.readFileSync(path.join(root, 'assets/decokasa.css'), 'utf8');
  const js = fs.readFileSync(path.join(root, 'assets/decokasa.js'), 'utf8');
  const preview = path.join(root, 'preview');
  fs.mkdirSync(path.join(preview, 'assets'), { recursive: true });
  const landings = {};
  for (const [index, entry] of products.entries()) {
    const product = productFixture({...entry, name: entry.title}, index);
    for (let n = 0; n < product.images.length; n++) {
      const isFlooring = entry.handle.includes('pvc') || entry.handle.includes('spc');
      let art = await engine.parseAndRender(isFlooring ? "{% render 'pvc-art' %}" : "{% render 'demo-art' %}", {});
      art = art.match(/<svg[\s\S]*?<\/svg>/)[0];
      if (n) art = art.replace('fill="none"', `fill="none" style="background:${n === 1 ? '#fff6cb' : '#f0f2f4'}"`);
      fs.writeFileSync(path.join(preview, product.images[n].src), art);
    }
    let html = await section('product-landing', {}, {product, is_demo: false, shop: {currency: 'PEN'}});
    const variants = product.variants.map((variant, n) => ({...variant, coverage: variant.metafields?.decokasa?.coverage_m2?.value, imageId: variant.featured_image?.id, optionValues: product.options_with_values[0]?.values[n]?.id || ''}));
    html += `<script type="application/json" data-preview-variants>${JSON.stringify(variants)}</script>`;
    // Keep the fixture data inside the product root for the local adapter.
    const parsed = parseHTML(html).document;
    parsed.querySelector('[data-product-page]').appendChild(parsed.querySelector('[data-preview-variants]'));
    landings[`landing-${entry.handle}.html`] = parsed.toString();
  }

  // Generate the exact "Piso SPC" product landing matching user screenshot 1
  const spcEntry = {
    handle: "piso-spc",
    name: "Piso SPC",
    brand: "MI TIENDA",
    category: "Acabados",
    sku: "Pendiente",
    price: 9500,
    intro: "Piso SPC de alta resistencia con acabado texturizado tipo madera natural, sistema click de encastre y máxima durabilidad.",
    has_only_default_variant: true
  };
  const spcProduct = productFixture(spcEntry, 5);
  let spcArt = await engine.parseAndRender("{% render 'pvc-art' %}", {});
  spcArt = spcArt.match(/<svg[\s\S]*?<\/svg>/)[0];
  fs.writeFileSync(path.join(preview, spcProduct.images[0].src), spcArt);
  let spcHtml = await section('product-landing', {}, {product: spcProduct, is_demo: false, shop: {currency: 'PEN'}});
  const spcVariants = spcProduct.variants.map((variant, n) => ({...variant, coverage: null, imageId: variant.featured_image?.id, optionValues: ''}));
  spcHtml += `<script type="application/json" data-preview-variants>${JSON.stringify(spcVariants)}</script>`;
  const spcParsed = parseHTML(spcHtml).document;
  spcParsed.querySelector('[data-product-page]').appendChild(spcParsed.querySelector('[data-preview-variants]'));
  landings['landing-piso-spc.html'] = spcParsed.toString();

  const previewFiles = [...new Set([...fs.readdirSync(preview).filter(f => f.endsWith('.html') && f !== 'DECOKASA-movil.html'), 'landing-piso-spc.html'])];
  for (const file of previewFiles) {
    const rawFile = fs.existsSync(path.join(preview, file)) ? fs.readFileSync(path.join(preview, file), 'utf8') : '';
    const { document } = parseHTML(rawFile || '<!doctype html><html><head><title></title></head><body><footer></footer></body></html>');
    document.querySelectorAll('link[rel="icon"]').forEach(el => el.remove());
    document.head.insertAdjacentHTML('beforeend', '<link rel="icon" type="image/png" sizes="128x128" href="assets/favicon.png">');
    const content = file === 'DECOKASA-inicio.html' ? home : file === 'catalogo.html' ? catalog : landings[file];
    const footer = document.querySelector('footer').outerHTML;
    const consent = document.querySelector('[data-consent-banner]')?.outerHTML ?? document.querySelector('.consent')?.outerHTML ?? '';
    document.querySelectorAll('style').forEach(el => el.remove());
    const html = `<!doctype html><html lang="es"><head>${document.head.innerHTML}<style>${css}</style></head><body>${header}<main id="main">${content}</main>${footer}${consent}<script>${js}</script>${landings[file] ? '<script src="product-demo.js" defer></script>' : ''}</body></html>`;
    fs.writeFileSync(path.join(preview, file), html.replace(/[ \t]+$/gm, ''));
  }
  fs.mkdirSync(path.join(preview, 'assets'), { recursive: true });
  for (const asset of fs.readdirSync(path.join(root, 'assets')).filter(name => /^(decokasa-.*\.webp|favicon\.png|product-detail\.(css|js))$/.test(name))) {
    fs.copyFileSync(path.join(root, 'assets', asset), path.join(preview, 'assets', asset));
  }
  console.log('Seven preview pages synchronized with the Shopify sections, including product details.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
