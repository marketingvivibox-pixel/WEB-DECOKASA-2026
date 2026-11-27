// Local identifiers only; public media match the product's twenty real finishes.
const {productFixture} = require('./product_fixture.cjs');
const codes = ['FD801','FD802','FD806','FD807','FD809','FD810','FD811','FD814','FD815','FD816','FD817','FD817-1','FD818','FD821','FD822','FD823','FD828','7172-4','7172-8','7195-8'];
function pvcFixture(selected = 0) {
  const product = productFixture({handle:'piso-pvc', name:'Piso PVC autoadhesivo', brand:'DECOKASA', category:'Acabados', sku:'DEMO-PVC', price:9900, coverage:5, intro:'Piso PVC autoadhesivo. Caja de 36 planchas con rendimiento de 5 m².'}, 6);
  const image = (code, room) => ({id:`demo-pvc-${room ? 'room' : 'swatch'}-${code}`, src:`https://cdn.shopify.com/s/files/1/0838/8398/3085/files/${room ? 'ambiente-pvc' : 'piso-pvc'}-${code.toLowerCase()}.webp`, alt:`${room ? 'Ambiente ilustrativo con piso' : 'Muestra del acabado'} PVC ${code}`, width:room ? 1254 : 455, height:room ? 1254 : 124});
  const media = img => ({...img, media_type:'image', preview_image:img});
  product.variants = codes.map((code, index) => {
    const room = image(code, true), swatch = image(code, false);
    return {id:`DEMO-PVC-${index}`, title:code, options:[code], sku:`DEMO-PVC-${code}`, price:index < 17 ? 9900 : 0, available:true, featured_image:room, metafields:{decokasa:{coverage_m2:{value:5}, gallery_images:{value:[media(room),media(swatch)]}, finish_swatch:{value:media(swatch)}}}};
  });
  product.images = product.variants.map(variant => variant.featured_image);
  product.selected_or_first_available_variant = product.variants[selected];
  product.featured_image = product.images[0];
  product.price_max = 9900;
  product.url = 'producto-piso-pvc.html';
  product.options_with_values = [{name:'Acabado', position:1, selected_value:product.variants[selected].title, values:product.variants.map((variant, index) => ({id:`demo-pvc-option-${index}`, name:variant.title, selected:index === selected, variant}))}];
  return product;
}
module.exports = {pvcFixture, codes};
