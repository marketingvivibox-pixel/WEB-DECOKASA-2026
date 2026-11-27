// Render the demo header, homepage and catalog from the real Shopify sections.
const { createHash } = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { Liquid } = require('liquidjs');
const { parseHTML } = require('linkedom');
const root = path.resolve(__dirname, '..');
require('./generate_spc_layout.cjs');
const engine = new Liquid({ root: [path.join(root, 'snippets'), path.join(root, 'scripts/fixtures')], extname: '.liquid' });
const {filters, productFixture} = require('./product_fixture.cjs');
const {spcFixture} = require('./spc_fixture.cjs');
const {pvcFixture} = require('./pvc_fixture.cjs');
filters(engine);
const buildVersion = Date.now();
engine.registerFilter('asset_url', name => (name.endsWith('.css') || name.endsWith('.js')) ? `assets/${name}?v=${buildVersion}` : `assets/${name}`);
function interfaceAssetUrl(name) {
  const contents = fs.readFileSync(path.join(root, 'assets', name));
  const version = createHash('sha256').update(contents).digest('hex').slice(0, 12);
  return `assets/${name}?v=${version}`;
}
engine.registerFilter('url_for_vendor', name => `catalogo.html?marca=${encodeURIComponent(name)}`);
engine.registerFilter('url_for_type', name => `catalogo.html?categoria=${encodeURIComponent(name)}`);
engine.registerFilter('handleize', name => String(name).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
const collections = Object.fromEntries(Object.entries(require('../tests/catalog-collections.json')).map(([handle, value]) => [handle, {...value, url: value.url.slice(1)}]));
const routes = { root_url: 'DECOKASA-inicio.html', search_url: 'catalogo.html', all_products_collection_url: 'catalogo.html', collections_url: 'collections' };
const settingsDataRaw = fs.readFileSync(path.join(root, 'config/settings_data.json'), 'utf8');
const globalThemeSettings = JSON.parse(settingsDataRaw.replace(/\/\*[\s\S]*?\*\//, '').trim()).current || {};
async function section(name, overrides = {}, context = {}) {
  const raw = fs.readFileSync(path.join(root, 'sections', `${name}.liquid`), 'utf8');
  const schema = JSON.parse(raw.match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
  const settings = { ...Object.fromEntries(schema.settings.filter(s => s.id).map(s => [s.id, s.default ?? ''])), ...overrides };
  // The local demo contains five examples; Shopify paginates the real collection.
  const source = raw.replace(/{% schema %}[\s\S]*?{% endschema %}/, '').replace(/{% paginate [\s\S]*?%}/g, '').replace(/{% endpaginate %}/g, '').replace('{% assign is_demo = false %}', `{% assign is_demo = ${context.is_demo === true} %}`);
  let html = await engine.parseAndRender(source, { settings: globalThemeSettings, collections, routes, search: { terms: '' }, ...context, section: { id: `preview-${name}`, blocks: [], ...context.section, settings: {...settings, ...context.section?.settings} } });
  const permanentRoutes = {'sillas-gerenciales': ['categoria', 'Sillas Gerenciales'], 'sillas-gamers': ['categoria', 'Sillas Gamers'], tecnologia: ['categoria', 'Tecnología'], electrodomesticos: ['categoria', 'Electrodomésticos'], bebes: ['categoria', 'Bebés'], fitness: ['categoria', 'Fitness'], 'hogar-y-acabados': ['categoria', 'Acabados'], decokasa: ['marca', 'DECOKASA'], xion: ['marca', 'Xion'], biflex: ['marca', 'Biflex'], 'mundo-baby': ['marca', 'Mundo Baby']};
  for (const [handle, [key, value]] of Object.entries(permanentRoutes)) html = html.replaceAll(`collections/${handle}`, `catalogo.html?${key}=${encodeURIComponent(value)}`);
  return html.replaceAll('collections/types?q=', 'catalogo.html?categoria=').replaceAll('collections/vendors?q=', 'catalogo.html?marca=');
}
async function main() {
  const template = JSON.parse(fs.readFileSync(path.join(root, 'templates/index.json'), 'utf8').replace(/^\s*\/\*[\s\S]*?\*\/\s*/, ''));
  const homeSettings = template.sections?.main?.settings ?? {};
  const products = require('../preview/products.json').map((entry, index) => productFixture(entry, index));
  collections.all = {products};
  // Shopify resolves collection settings to objects; use the fixture locally.
  const homePreviewSettings = {...homeSettings, featured_collection: collections[homeSettings.featured_collection] || collections.all};
  const header = await section('header'), home = await section('home', homePreviewSettings, {is_demo: true});
  const sharedFooter = (await section('footer')).replace('/pages/libro-de-reclamaciones', 'libro-reclamaciones.html');
  const bookLink = (await engine.parseAndRender(fs.readFileSync(path.join(root, 'snippets/book-link.liquid'), 'utf8'), {})).replace('/pages/libro-de-reclamaciones', 'libro-reclamaciones.html');
  const book = await section('libro-reclamaciones', {receiver_url: 'https://example.invalid/preview', supplier_address: 'Av. José Leal n.º 375, Lima, Lima, Lima'}, {shop: {privacy_policy: {url: ''}}});
  const catalogTemplate = JSON.parse(fs.readFileSync(path.join(root, 'templates/collection.json'), 'utf8'));
  const catalog = await section('catalog', catalogTemplate.sections?.main?.settings ?? {}, {is_demo: true, shop: {vendors: ['DECOKASA', 'Xion', 'Biflex', 'Mundo Baby'], types: [...new Set(products.map(product => product.type))]}, collection: {handle: 'all', title: 'Todos los productos', products, products_count: products.length, sort_by: 'manual'}});
  const css = fs.readFileSync(path.join(root, 'assets/decokasa.css'), 'utf8');
  const js = fs.readFileSync(path.join(root, 'assets/decokasa.js'), 'utf8');
  const preview = path.join(root, 'preview');
  fs.mkdirSync(path.join(preview, 'assets'), { recursive: true });
  const landings = {};
  for (const product of products) {
    for (let n = 0; n < product.images.length; n++) {
      const isFlooring = product.handle.includes('pvc') || product.handle.includes('spc');
      const source = isFlooring ? "{% render 'pvc-art' %}" : "{% render 'catalog-art', handle: handle %}";
      let art = await engine.parseAndRender(source, {handle: product.handle});
      if (product.handle === 'licuadora' && n === 1) art = art.replaceAll('#333d3f', '#c62e32').replaceAll('#323b3d', '#aa272b');
      if (product.handle === 'kit-fitness' && n === 1) art = art.replaceAll('#a789bb', '#598541').replaceAll('#5c4b70', '#47673b');
      art = art.match(/<svg[\s\S]*?<\/svg>/)[0];
      if (n) art = art.replace('fill="none"', `fill="none" style="background:${n === 1 ? '#fff6cb' : '#f0f2f4'}"`);
      fs.writeFileSync(path.join(preview, product.images[n].src), art);
    }
    let html = await section('product-landing', {}, {product, is_demo: true, shop: {currency: 'PEN'}});
    const variants = product.variants.map((variant, n) => ({...variant, coverage: variant.metafields?.decokasa?.coverage_m2?.value, imageId: variant.featured_image?.id, optionValues: product.options_with_values[0]?.values[n]?.id || ''}));
    html += `<script type="application/json" data-preview-variants>${JSON.stringify(variants)}</script>`;
    // Keep the fixture data inside the product root for the local adapter.
    const parsed = parseHTML(html).document;
    parsed.querySelector('[data-product-page]').appendChild(parsed.querySelector('[data-preview-variants]'));
    landings[`landing-${product.handle}.html`] = parsed.toString();
  }

  // Generate the custom "Piso SPC" product landing from sections/landing-piso-spc.liquid
  const spcProduct = spcFixture();
  // The normal preview uses the same settings and blocks as the deployed template.
  const spcTemplate = JSON.parse(fs.readFileSync(path.join(root, 'templates/product.landing-spc.json'), 'utf8'));
  const spcMain = spcTemplate.sections.main;
  const spcBlocks = (spcMain.block_order || Object.keys(spcMain.blocks || {})).map(id => ({id, ...spcMain.blocks[id]}));
  const spcContext = {product:spcProduct, template:{suffix:'landing-spc'}, shop:{currency:'PEN'}, section:{blocks:spcBlocks}};
  let spcHtml = await section('landing-piso-spc', spcMain.settings, {...spcContext, request:{path:'/products/piso-spc/landing'}, is_demo: false, section: {
    settings: {spc_design_preview:process.env.SPC_DESIGN_PREVIEW === '1'}, blocks: spcBlocks
  }});
  landings['landing-piso-spc.html'] = spcHtml;
  const spcStorefront = parseHTML(await section('landing-piso-spc', spcMain.settings, {...spcContext, request:{path:'/products/piso-spc'}, is_demo:true})).document;
  const spcPreviewVariants = spcProduct.variants.map((variant, index) => ({...variant, coverage:2.196, imageId:variant.featured_image.id, optionValues:spcProduct.options_with_values[0].values[index].id}));
  spcStorefront.querySelector('[data-product-page]').insertAdjacentHTML('beforeend', `<script type="application/json" data-preview-variants>${JSON.stringify(spcPreviewVariants)}</script>`);
  landings['producto-piso-spc.html'] = spcStorefront.toString();

  // The same PVC product renders the storefront or advertising view by path.
  // Prices and identifiers below are local fixtures, never store data.
  const pvcProduct = pvcFixture();
  const pvcMain = JSON.parse(fs.readFileSync(path.join(root, 'templates/product.landing-pvc.json'), 'utf8')).sections.main;
  const pvcBlocks = pvcMain.block_order.map(id => {
    const block = {id, ...pvcMain.blocks[id]};
    return block.type === 'finish' ? {...block, settings:{...block.settings, sku:`DEMO-PVC-${block.settings.code}`}} : block;
  });
  const pvcContext = {product: pvcProduct, is_demo: true, template: {suffix: 'landing-pvc'}, shop: {currency: 'PEN'}, section: {blocks: pvcBlocks}};
  landings['landing-pisos-pvc.html'] = await section('landing-piso-pvc', pvcMain.settings, {...pvcContext, request: {path: '/products/piso-pvc/landing'}});
  const pvcStorefront = parseHTML(await section('landing-piso-pvc', pvcMain.settings, {...pvcContext, request: {path: '/products/piso-pvc'}})).document;
  const pvcPreviewVariants = pvcProduct.variants.map((variant, index) => ({...variant, coverage: 5, imageId: variant.featured_image.id, optionValues: pvcProduct.options_with_values[0].values[index].id}));
  pvcStorefront.querySelector('[data-product-page]').insertAdjacentHTML('beforeend', `<script type="application/json" data-preview-variants>${JSON.stringify(pvcPreviewVariants)}</script>`);
  landings['producto-piso-pvc.html'] = pvcStorefront.toString();

  const previewFiles = [...new Set([...fs.readdirSync(preview).filter(f => f.endsWith('.html') && !['DECOKASA-movil.html', 'render_pdf.html'].includes(f)), 'landing-piso-spc.html', 'libro-reclamaciones.html', 'producto-piso-pvc.html', 'producto-piso-spc.html'])];
  const interfaceAssets = `<link data-preview-interface rel="stylesheet" href="${interfaceAssetUrl('decokasa-interface.css')}"><script data-preview-interface src="${interfaceAssetUrl('decokasa-interface.js')}" defer></script>`;
  for (const file of previewFiles) {
    const rawFile = fs.existsSync(path.join(preview, file)) ? fs.readFileSync(path.join(preview, file), 'utf8') : '';
    const { document } = parseHTML(rawFile || '<!doctype html><html><head><title></title></head><body><footer></footer></body></html>');
    document.querySelectorAll('link[rel="icon"], meta[charset], meta[name="viewport"], link[href*="landing-piso-spc.css"], link[href*="landing-piso-pvc.css"], [data-preview-motion], [data-preview-interface]').forEach(el => el.remove());
    document.head.insertAdjacentHTML('beforeend', '<link rel="icon" type="image/png" sizes="128x128" href="assets/favicon.png">');
    const content = file === 'DECOKASA-inicio.html' ? home : file === 'catalogo.html' ? catalog : file === 'libro-reclamaciones.html' ? book : landings[file];
    const motionPage = file === routes.root_url || file === routes.all_products_collection_url;
    const footer = sharedFooter.slice(0, sharedFooter.indexOf('</footer>') + '</footer>'.length);
    document.querySelectorAll('style').forEach(el => el.remove());
    const isLandingSpc = file === 'landing-piso-spc.html';
    const isLandingPvc = file === 'landing-pisos-pvc.html';
    const isLibro = file === 'libro-reclamaciones.html';
    const isCustomLanding = isLandingSpc || isLandingPvc;
    const motionEnabled = !isCustomLanding;
    const pageHeader = (isCustomLanding || isLibro) ? '' : header;
    const pageFooter = isCustomLanding ? '' : footer;
    const extraCss = isCustomLanding ? '' : `<style>${css}</style>`;
    const motionAssets = motionEnabled ? `<link data-preview-motion rel="stylesheet" href="${interfaceAssetUrl('decokasa-motion.css')}"><script data-preview-motion src="${interfaceAssetUrl('decokasa-motion.js')}" defer blocking="render"></script>` : '';
    const curtain = motionEnabled ? '<div class="motion-curtain" aria-hidden="true"></div>' : '';
    const motionData = motionEnabled ? ` data-motion-home="${routes.root_url}" data-motion-catalog="${routes.all_products_collection_url}"` : '';
    const bodyAttr = isLandingSpc ? ' class="spc-layout"' : isLandingPvc ? ' class="pvc-layout"' :
      isLibro ? ` class="storefront-interface book-layout"${motionData}` :
      ` class="storefront-interface"${motionData}`;
    if (isLandingPvc || file === 'producto-piso-pvc.html') document.querySelector('title').textContent = 'Piso PVC autoadhesivo · DECOKASA';
    if (isLandingSpc || file === 'producto-piso-spc.html') document.querySelector('title').textContent = 'Piso SPC · DECOKASA';
    const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${document.head.innerHTML}${extraCss}${isCustomLanding ? '' : interfaceAssets}${motionAssets}</head><body${bodyAttr}>${curtain}${pageHeader}<main id="main">${content}</main>${pageFooter}${isCustomLanding ? bookLink : ''}${isCustomLanding ? '' : `<script>${js}</script>`}${landings[file] && !isCustomLanding ? '<script src="product-demo.js" defer></script>' : ''}</body></html>`;
    fs.writeFileSync(path.join(preview, file), html.replace(/[ \t]+$/gm, ''), 'utf8');
  }
  fs.mkdirSync(path.join(preview, 'assets'), { recursive: true });
  for (const asset of fs.readdirSync(path.join(root, 'assets')).filter(name => /^(decokasa-.*\.webp|decokasa-(?:motion|interface)\.(css|js)|favicon\.png|flooring-pricing\.(css|js)|product-detail\.(css|js)|request-form\.(css|js)|libro-reclamaciones\.(css|js)|libro-ubigeo\.js|landing-piso-pvc\.(css|js)|pvc-.*\.webp|landing-piso-spc(?:-layout|-proportions|-desktop|-tones)?\.(css|js)|spc-catalogo-tonos-2026-11\.jpg|spc-.*\.(webp|png|svg|ttf|txt))$/.test(name))) {
    fs.copyFileSync(path.join(root, 'assets', asset), path.join(preview, 'assets', asset));
  }
  console.log(`${previewFiles.length} preview pages synchronized with the Shopify sections.`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
