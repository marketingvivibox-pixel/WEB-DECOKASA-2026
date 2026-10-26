(function(root){
  'use strict';
  const fields=['utm_source','utm_medium','utm_campaign','utm_content','utm_term','campaign_id','adset_id','adgroup_id','ad_id','creative_id','account_id','platform','fbclid','gclid','ttclid'];
  function uuid(){ if(root.crypto.randomUUID)return root.crypto.randomUUID(); const b=root.crypto.getRandomValues(new Uint8Array(16));b[6]=(b[6]&15)|64;b[8]=(b[8]&63)|128;return [...b].map((x,i)=>([4,6,8,10].includes(i)?'-':'')+x.toString(16).padStart(2,'0')).join(''); }
  function boxes(area,waste,coverage){area=Number(area);waste=Number(waste);coverage=Number(coverage);if(!Number.isFinite(area)||area<=0||area>100000||!Number.isFinite(waste)||waste<0||waste>30||!Number.isFinite(coverage)||coverage<=0)throw Error('Revisa los m², la merma (0–30%) y el rendimiento por caja.');return Math.ceil((area*(100+waste)/(100*coverage))-1e-10);}
  function origin(search,now){const params=new URLSearchParams(search),data={};for(const k of fields){const v=params.get(k);if(v&&v.length<=160&&/^[a-zA-Z0-9_.~%+ -]+$/.test(v))data[k]=v;}return Object.keys(data).length?{...data,captured_at:now}:null;}
  function updateAttribution(previous,current){if(!current)return previous;return {first:previous?.first||current,last:current};}
  function requestDraft(previous,snapshot){return previous?.snapshot===snapshot?previous:{id:uuid(),snapshot};}
  const api={boxes,origin,updateAttribution,uuid,requestDraft};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  if(!root.document)return;
  function reserveServiceBar(){
    const bar=root.document.querySelector('.service-bar');
    if(!bar)return;
    const sync=()=>root.document.documentElement.style.setProperty('--service-bar-height',`${bar.getBoundingClientRect().height}px`);
    sync();
    if(typeof root.ResizeObserver==='function')new root.ResizeObserver(sync).observe(bar);
    else root.addEventListener('resize',sync);
  }
  reserveServiceBar();
  function get(key){try{return root.sessionStorage.getItem(key);}catch{return null;}}
  function set(key,value){try{root.sessionStorage.setItem(key,value);}catch{}}
  function remove(key){try{root.sessionStorage.removeItem(key);}catch{}}
  let attribution=null;
  let consent=get('decokasa.consent')||'unknown';
  function capture(){if(consent!=='accepted')return;try{attribution=JSON.parse(get('decokasa.attribution')||'null');}catch{attribution=null;}const current=origin(root.location.search,new Date().toISOString());attribution=updateAttribution(attribution,current);set('decokasa.attribution',JSON.stringify(attribution));if(!get('decokasa.visitor'))set('decokasa.visitor',uuid());}
  capture();
  function init(){
    const consentMessage=document.querySelector('[data-consent-message]');
    function showConsent(){if(consentMessage)consentMessage.textContent=consent==='accepted'?'Seguimiento de prueba permitido. Puedes cambiar tu decisión. No se envían datos a servicios externos.':consent==='rejected'?'Seguimiento opcional desactivado. Puedes seguir usando el formulario.':'¿Permites conservar el origen de esta visita durante la prueba? Es opcional y no envía datos a servicios externos.';}
    showConsent();
    document.querySelectorAll('[data-consent]').forEach(button=>button.addEventListener('click',()=>{consent=button.dataset.consent;set('decokasa.consent',consent);set('decokasa.consent_date',new Date().toISOString());if(consent==='accepted')capture();else{attribution=null;remove('decokasa.attribution');remove('decokasa.visitor');}showConsent();}));
    const brand=document.querySelector('[data-filter-brand]'),category=document.querySelector('[data-filter-category]'),query=document.querySelector('[data-filter-query]');
    const filters=document.querySelector('[data-catalog-filters]');
    if(filters && typeof root.matchMedia==='function')filters.open=!root.matchMedia('(max-width: 899px)').matches;
    document.querySelector('[data-catalog-native-sort]')?.addEventListener('change',()=>document.getElementById('CatalogFilters')?.requestSubmit());
    if(brand){
      const p=new URLSearchParams(root.location.search),cards=[...document.querySelectorAll('[data-card]')],grid=document.querySelector('[data-catalog-grid]'),sort=document.querySelector('[data-catalog-sort]');
      const choices=[...document.querySelectorAll('[data-brand-choice]')];
      brand.value=p.get('marca')||'';category.value=p.get('categoria')||'';query.value=p.get('q')||'';
      const normalize=text=>text.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
      function filter(){
        let count=0;
        cards.forEach(card=>{const match=(!brand.value||card.dataset.brand===brand.value)&&(!category.value||card.dataset.category===category.value)&&normalize(card.textContent).includes(normalize(query.value.trim()));card.hidden=!match;if(match)count++;});
        document.querySelector('[data-count]').textContent=`${count} ${count===1?'producto':'productos'} de muestra`;
        document.querySelector('[data-empty]').hidden=count>0;
        choices.forEach(link=>{const active=link.dataset.brandChoice===brand.value;link.classList.toggle('is-selected',active);if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
        if(sort&&grid){const ordered=[...cards];if(sort.value!=='manual')ordered.sort((a,b)=>a.dataset.title.localeCompare(b.dataset.title,'es')*(sort.value==='title-descending'?-1:1));ordered.forEach(card=>grid.appendChild(card));}
      }
      [brand,category,query].forEach(input=>input.addEventListener('input',filter));
      sort?.addEventListener('change',filter);
      choices.forEach(link=>link.addEventListener('click',event=>{event.preventDefault();brand.value=link.dataset.brandChoice;category.value='';query.value='';filter();}));
      document.querySelectorAll('[data-filter-clear]').forEach(button=>button.addEventListener('click',()=>{brand.value='';category.value='';query.value='';filter();}));
      filter();
    }
    initForms(document);
  }
  function initForms(scope){
    scope.querySelectorAll('[data-request-form]').forEach(form=>{
      if(form.dataset.initialized)return;
      const page=form.closest('[data-product-page]')||scope;
      const selected=form.querySelector('[name=variant_id]').selectedOptions[0];
      if(!selected && !page.querySelector('[data-request-builder]'))return;
      form.dataset.initialized='true';
      form.querySelector('[data-enable-form]').disabled=false;
      const select=form.querySelector('[name=variant_id]'),qty=form.querySelector('[name=quantity]'),price=page.querySelector('[data-product-price]'),sku=page.querySelector('[data-sku]');
      const calc=page.querySelector('[data-pvc]'),result=calc?.querySelector('[data-calc-result]');
      form.querySelector('fieldset').disabled=false;
      function calculation(){if(!calc)return;try{const coverage=select.selectedOptions[0].dataset.coverage;const n=boxes(calc.querySelector('[name=area]').value,calc.querySelector('[name=waste]').value,coverage);result.textContent=`${n} cajas · ${(n*Number(coverage)).toLocaleString('es-PE',{maximumFractionDigits:2})} m² de cobertura`;qty.value=n;page.dispatchEvent(new CustomEvent('decokasa:quantity',{bubbles:true}));result.classList.remove('error');}catch(e){result.textContent=e.message;result.classList.add('error');}}
      function variant(){const o=select.selectedOptions[0];if(!o)return;if(price){price.textContent=new Intl.NumberFormat('es-PE',{style:'currency',currency:form.dataset.currency}).format(Number(o.dataset.price)/100);price.dataset.cents=o.dataset.price;}if(sku)sku.textContent=o.dataset.sku||'Pendiente';calculation();page.dispatchEvent(new CustomEvent('decokasa:quantity',{bubbles:true}));}
      if(calc){calc.querySelectorAll('input').forEach(i=>i.addEventListener('input',calculation));calculation();}
      select.addEventListener('change',variant);
      form.addEventListener('submit',event=>{
        event.preventDefault();if(!form.reportValidity())return;
        if(calc && result.classList.contains('error')){result.setAttribute('tabindex','-1');result.focus();return;}
        const o=select.selectedOptions[0];
        const items = form.decokasaRequestItems?.();
        const receipt=form.querySelector('[data-request-status]');
        if(items && !items.length){receipt.textContent='Agrega al menos una presentación a tu solicitud.';receipt.hidden=false;receipt.focus();return;}
        // Contact values exist only in memory; retries of an unchanged form reuse its reference.
        const values=Array.from(new FormData(form).entries()).filter(([key])=>!items || (key!=='variant_id' && key!=='quantity'));
        form.decokasaDraft=requestDraft(form.decokasaDraft,JSON.stringify({values,items}));
        const requestId=form.decokasaDraft.id;
        const detail=items ? items.map(item=>`${item.title}: ${item.quantity} unidad(es) · ${item.sku||'SKU pendiente'} · S/. ${(item.quantity*item.price_cents/100).toFixed(2)} PEN`).join('\n')+`\nTotal estimado: S/. ${(items.reduce((sum,item)=>sum+item.quantity*item.price_cents,0)/100).toFixed(2)} PEN` : `${qty.value} unidad(es) · ${o.dataset.sku||'SKU pendiente'}`;
        // Demo only: never store/log contact fields, send a request, emit GA4 or alter inventory.
        receipt.textContent=`Simulación completada. Esta solicitud no fue enviada.\nReferencia: ${requestId}\n${detail}\nEl asesor confirmará disponibilidad e importe cuando la tienda esté conectada.`;
        receipt.hidden=false;receipt.focus();
      });
    });
  }
  document.addEventListener('shopify:section:load',event=>initForms(event.target));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})(typeof window!=='undefined'?window:globalThis);
