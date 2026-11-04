const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const {parseHTML}=require('linkedom');
const test=require('node:test');
const {Liquid}=require('liquidjs');
const {filters,productFixture}=require('../scripts/product_fixture.cjs');
const out=path.resolve(__dirname,'../preview');
const source=fs.readFileSync(path.resolve(__dirname,'../assets/decokasa.js'),'utf8');
function load(file,search='',html){
  const {window,document}=parseHTML(html??fs.readFileSync(path.join(out,file),'utf8'));
  delete window.decokasaProductDetail;
  const data=new Map(); let sends=0;
  for(const select of document.querySelectorAll('select')){
    let selected=select.querySelector('option')?.getAttribute('value')??select.querySelector('option')?.textContent;
    Object.defineProperty(select,'value',{get:()=>selected,set:v=>{selected=String(v);}});
    Object.defineProperty(select,'selectedOptions',{get:()=>{const options=[...select.querySelectorAll('option')], matched=options.filter(o=>(o.getAttribute('value')??o.textContent)===selected);return matched.length?matched:select.closest('[data-request-form]')?options.slice(0,1):[];}});
  }
  for(const form of document.querySelectorAll('form'))form.reportValidity=()=>true;
  window.location={search,href:`http://localhost/${file}${search}`,origin:'http://localhost'};
  window.sessionStorage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};
  class FormDataMock{constructor(form){this.values=[...form.querySelectorAll('[name]')].filter(e=>e.type!=='checkbox'||e.checked).map(e=>[e.name||e.getAttribute('name'),e.value]);}entries(){return this.values;}}
  const context={window,document,location:window.location,URL,URLSearchParams,Uint8Array,Intl,Event:window.Event,CustomEvent:window.CustomEvent,FormData:FormDataMock,fetch:()=>{sends++;throw Error('Unexpected network');}};
  vm.runInNewContext(source,context);
  if(document.querySelector('[data-product-page]')){
    for(const input of document.querySelectorAll('input'))input.reportValidity=()=>true;
    vm.runInNewContext(fs.readFileSync(path.resolve(__dirname,'../assets/product-detail.js'),'utf8'),context);
    vm.runInNewContext(fs.readFileSync(path.join(out,'product-demo.js'),'utf8'),context);
  }
  return {document,data,window,sends:()=>sends,event:(el,name)=>el.dispatchEvent(new window.Event(name,{cancelable:true,bubbles:true}))};
}
const home=load('DECOKASA-inicio.html');
assert.equal(home.document.querySelector('.brand.xion strong').textContent,'XION');
assert.equal(home.document.querySelector('.brand.baby strong').textContent,'MUNDOBABY');
assert.equal(home.document.querySelector('.brand.biflex strong').textContent,'BIFLEX');
assert.equal(home.document.querySelector('.whatsapp-float').getAttribute('href'),'https://wa.me/51941599516?text=Hola%2C+visit%C3%A9+la+tienda+DECOKASA+y+quisiera+ayuda+con+un+producto+o+una+cotizaci%C3%B3n.');
const catalog=load('catalogo.html','?marca=Xion');
const visible=()=>[...catalog.document.querySelectorAll('[data-card]')].filter(e=>!e.hidden);
assert.equal(visible().length,2);
const brand=catalog.document.querySelector('[data-filter-brand]');brand.value='Biflex';catalog.event(brand,'input');assert.equal(visible().length,1);
const category=catalog.document.querySelector('[data-filter-category]');category.value='Bebés';catalog.event(category,'input');assert.equal(visible().length,0);assert.equal(catalog.document.querySelector('[data-empty]').hidden,false);
catalog.event(catalog.document.querySelector('[data-empty] [data-filter-clear]'),'click');assert.equal(visible().length,5);
const query=catalog.document.querySelector('[data-filter-query]');query.value='audifonos';catalog.event(query,'input');assert.equal(visible().length,1);assert.match(visible()[0].dataset.title,/Audífonos/);
catalog.event(catalog.document.querySelector('[data-brand-choice="Biflex"]'),'click');assert.equal(query.value,'');assert.equal(visible().length,1);assert.equal(catalog.document.querySelector('[data-brand-choice="Biflex"]').getAttribute('aria-current'),'page');
catalog.event(catalog.document.querySelector('[data-filter-clear]'),'click');
const sort=catalog.document.querySelector('[data-catalog-sort]');sort.value='title-descending';catalog.event(sort,'change');assert.equal(catalog.document.querySelector('[data-catalog-grid] [data-card]').dataset.brand,'Mundo Baby');
sort.value='manual';catalog.event(sort,'change');assert.match(catalog.document.querySelector('[data-catalog-grid] [data-card]').dataset.title,/Audífonos/);
test('Ficha general PVC conserva calculadora, variantes, solicitudes y consentimiento',async()=>{
// The public PVC preview now uses its own landing. Keep exercising the general
// product form against the same demo product instead of depending on that page.
const root=path.resolve(__dirname,'..');
const engine=new Liquid({root:path.join(root,'snippets'),extname:'.liquid'});
filters(engine);engine.registerFilter('asset_url',name=>`assets/${name}`);
const sectionSource=fs.readFileSync(path.join(root,'sections/product-landing.liquid'),'utf8');
const schema=JSON.parse(sectionSource.match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
const settings=Object.fromEntries(schema.settings.filter(s=>s.id).map(s=>[s.id,s.default]));
const fixture=JSON.parse(fs.readFileSync(path.join(out,'products.json'),'utf8'))[4];
const product=productFixture(fixture,4);
let html=await engine.parseAndRender(sectionSource.replace(/{% schema %}[\s\S]*?{% endschema %}/,''),{product,routes:{root_url:'/',all_products_collection_url:'/collections/all'},section:{id:'generic-pvc-test',settings,blocks:[]}});
const doc=parseHTML(html).document;
const variants=product.variants.map((v,n)=>({...v,coverage:v.metafields?.decokasa?.coverage_m2?.value,imageId:v.featured_image?.id,optionValues:product.options_with_values[0]?.values[n]?.id||''}));
const script=doc.createElement('script');script.type='application/json';script.setAttribute('data-preview-variants','');script.textContent=JSON.stringify(variants);doc.querySelector('[data-product-page]').append(script);
const consent=parseHTML(fs.readFileSync(path.join(out,'landing-audifonos.html'),'utf8')).document.querySelector('.consent');
html=doc.toString()+(consent?.outerHTML||'');
const pvc=load('generic-pvc-test.html','?utm_source=meta&ad_id=123',html);
const $=s=>pvc.document.querySelector(s),area=$('[name=area]'),quantity=$('[name=quantity]');
assert.equal($('fieldset').disabled,false);
area.value='20';pvc.event(area,'input');assert.equal(Number(quantity.value),10);
const form=$('[data-request-form]');
const id=()=> $('[data-request-status]').textContent.match(/Referencia: ([a-f0-9-]+)/)[1];
assert.equal(pvc.event(form,'submit'),false);const first=id();pvc.event(form,'submit');assert.equal(id(),first);
area.value='22';pvc.event(area,'input');pvc.event(form,'submit');assert.notEqual(id(),first);
const variant=$('[data-option-link]:not([aria-current])');pvc.event(variant,'click');assert.equal(Number(quantity.value),10);assert.equal($('[data-sku]').textContent,'DEMO-PVC-002');assert.match($('[data-product-price]').textContent,/119/);
assert.equal(Number($('[data-product-quantity]').value),10);
pvc.event($('[data-quantity-step="1"]'),'click');assert.equal(Number(quantity.value),11);
pvc.event($('[data-open-request]'),'click');assert.equal($('[data-request-details]').open,true);
assert.equal([...pvc.document.querySelectorAll('[data-gallery-panel]')].filter(panel=>!panel.hidden).length,1);
assert.equal($('[data-gallery-choice][aria-current]').dataset.galleryChoice,'demo-image-4-1');
const latest=id();area.value='0';pvc.event(area,'input');pvc.event(form,'submit');assert.equal(id(),latest);assert.equal($('[data-calc-result]').classList.contains('error'),true);
pvc.event($('[data-consent="accepted"]'),'click');assert.equal(JSON.parse(pvc.data.get('decokasa.attribution')).first.ad_id,'123');
pvc.event($('[data-consent="rejected"]'),'click');assert.equal(pvc.data.has('decokasa.attribution'),false);assert.equal(pvc.data.has('decokasa.visitor'),false);
assert.equal(pvc.sends(),0);assert.equal([...pvc.data.keys()].some(k=>k.includes('draft')),false);
});
const multi=load('landing-audifonos.html');
const m=s=>multi.document.querySelector(s);
multi.event(m('[data-add-request]'),'click');
multi.event(m('[data-option-link]:not([aria-current])'),'click');
multi.event(m('[data-add-request]'),'click');
multi.event(m('[data-open-request]'),'click');
assert.equal(m('[data-request-details]').open,true);
const request=m('[data-request-form]');
multi.event(request,'submit');
const receipt=()=>m('[data-request-status]').textContent;
assert.match(receipt(),/Estándar: 1 unidad/);
assert.match(receipt(),/Alternativa: 1 unidad/);
assert.match(receipt(),/Total estimado:/);
const multiReference=receipt().match(/Referencia: ([a-f0-9-]+)/)[1];
multi.event(request,'submit');assert.ok(receipt().includes(multiReference));
// Looking at another color without adding it does not change the request identity.
multi.event(m('[data-option-link]:not([aria-current])'),'click');
multi.event(request,'submit');assert.ok(receipt().includes(multiReference));
multi.event(m('[data-line-step="1"]'),'click');
assert.equal(m('[data-request-status]').hidden,true);
multi.event(request,'submit');assert.equal(receipt().includes(multiReference),false);
assert.equal(multi.sends(),0);
assert.equal([...multi.data.keys()].some(k=>k.includes('draft')),false);
console.log('DOM simulado: catálogo, PVC, galería, solicitud multicolor, reintentos, consentimiento y cero envíos: correctos. No verifica renderizado visual ni validez nativa de campos.');
