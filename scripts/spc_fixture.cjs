// Local identifiers only; the image URLs are public product media.
const {productFixture} = require('./product_fixture.cjs');
const codes = ['0018-2', '001-2', '0020-1', '004-1', '0022', '0022-2', '007', '0021', '0013', '002-1', '0020'];
const tiers = [[1,9500],[6,9000],[12,8500],[50,8300],[100,8000],[200,7800],[300,7500],[400,7300],[500,7000]].map(([min_boxes, price_cents]) => ({min_boxes, price_cents}));
function spcFixture(selected = 0) {
  const product = productFixture({handle:'piso-spc', name:'Piso SPC', brand:'DECOKASA', category:'Acabados', sku:'DEMO-SPC', price:9500, coverage:2.196, intro:'Piso SPC para suelos, con sistema click y 11 acabados. Caja de 10 planchas.'}, 5);
  const image = (code, room) => ({id:`demo-spc-${room ? 'room' : 'swatch'}-${code}`, src:`https://cdn.shopify.com/s/files/1/0838/8398/3085/files/${room ? 'ambiente-spc' : 'piso-spc'}-${code}.webp`, alt:`${room ? 'Ambiente ilustrativo con piso' : 'Muestra del acabado'} SPC-${code}`, width:room ? 1254 : 455, height:room ? 1254 : 124});
  product.variants = codes.map((code, n) => {
    const room = image(code, true), swatch = image(code, false);
    const media = img => ({...img, media_type:'image', preview_image:img});
    return {id:`DEMO-SPC-${n}`, title:`SPC-${code}`, options:[`SPC-${code}`], sku:`DEMO-SPC-${code}`, price:9500, available:true, featured_image:room, metafields:{decokasa:{coverage_m2:{value:2.196}, gallery_images:{value:[media(room), media(swatch)]}, finish_swatch:{value:media(swatch)}}}};
  });
  product.images = product.variants.map(variant => variant.featured_image);
  product.selected_or_first_available_variant = product.variants[selected];
  product.featured_image = product.images[0];
  product.price_max = 9500;
  product.url = 'producto-piso-spc.html';
  product.options_with_values = [{name:'Acabado', position:1, selected_value:product.variants[selected].title, values:product.variants.map((variant, n) => ({id:`demo-spc-option-${n}`, name:variant.title, selected:n === selected, variant}))}];
  product.metafields.decokasa.quantity_prices = {value:tiers};
  return product;
}
module.exports = {spcFixture, tiers};
