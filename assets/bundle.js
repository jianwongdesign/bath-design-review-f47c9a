import {bundles,products,createState,count,complete,changeQuantity,changeBundle} from './model.js?v=20261127-default';
window.TBB_BUNDLE_CART={"assets": "assets/", "fx": {"currency": "SGD", "rate": 1}, "singlePrices": {"90": 35, "91": 35, "92": 35, "93": 35, "3601": 27, "3594": 27, "3593": 27, "3592": 27}};
window.TBB_BUNDLE_CART.key=new URLSearchParams(location.search).get("bundle");
const state=createState(window.TBB_BUNDLE_CART.key);
document.querySelector(`[name="bundle"][value="${state.key}"]`).checked=true;
const $=id=>document.getElementById(id);
const fx=window.TBB_BUNDLE_CART.fx || {currency:'SGD',rate:1};
const singlePrices=window.TBB_BUNDLE_CART.singlePrices || {};
const singleRange=()=>{const prices=Object.values(singlePrices).filter(p=>p>0);return prices.length?`${offerMoney(Math.min(...prices))} – ${offerMoney(Math.max(...prices))}`:'Choose a bottle';};
const unitCents=base=>Math.round((base*fx.rate+Number.EPSILON)*100);
const formatCents=cents=>`${fx.currency} ${(cents/100).toFixed(2)}`;
const money=base=>formatCents(unitCents(base));
const offerCents=cents=>formatCents(cents).replace(/\.00$/, '');
const offerMoney=base=>offerCents(unitCents(base));
for(const key of ['essential','stockup']){
  $(key+'-option-price').textContent=offerMoney(bundles[key].price);
}
const minus='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>';
const plus='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M12 5v14"/></svg>';
const arrow='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>';
let viewed=null,photoAnimation=null;
const photoMotion=matchMedia('(prefers-reduced-motion: reduce)');
$('hero-photo').addEventListener('load',()=>{
  photoAnimation?.cancel();
  if(!photoMotion.matches && $('hero-photo').animate) photoAnimation=$('hero-photo').animate([{opacity:.72},{opacity:1}],{duration:160,easing:'ease-out'});
});
photoMotion.addEventListener('change',()=>{if(photoMotion.matches)photoAnimation?.cancel();});
// Compact selector copy; the gallery keeps each product's full fragrance notes.
const choiceCopy={
  90:['Soothing',['Fig · Peony','Musk']],
  91:['Nourishing',['Bergamot · Lychee','Vanilla']],
  92:['Brightening',['Orange · Peony','Cedarwood']],
  93:['Hydrating',['Citrus · Florals','Musk']],
  3601:['Daily Hydration',['Citrus · Jasmine','Powdery']],
  3594:['Daily Hydration',['Lemon · Sunflower','Tonka bean']],
  3593:['Daily Hydration',['Mandarin · Vetiver','Musk']],
  3592:['Daily Hydration',['Orange · Muguet','Vanilla']]
};
for(const p of products){
  const [benefit,noteLines]=choiceCopy[p.id];
  const thumb=document.createElement('button');
  thumb.type='button';thumb.className='thumbnail';thumb.dataset.id=p.id;
  thumb.setAttribute('aria-label',`View ${p.name} photograph`);
  thumb.innerHTML=`<img src="${window.TBB_BUNDLE_CART.assets}${p.image}" alt="" width="60" height="80">`;
  thumb.addEventListener('click',()=>showPhoto(p));$('thumbnails').append(thumb);
  const card=document.createElement('article');card.className='scent';card.id=`scent-${p.id}`;
  card.innerHTML=`<button type="button" class="scent-photo" aria-label="Explore ${p.name}"><img src="${window.TBB_BUNDLE_CART.assets}${p.image}" alt="${p.name} ${p.ml}ml" width="150" height="150" loading="lazy"></button><strong class="scent-name">${p.name}</strong><p class="scent-benefit">${benefit}</p><p class="scent-notes">${noteLines.map(line=>`<span>${line}</span>`).join('')}</p><div class="quantity"><button type="button" data-delta="-1" aria-label="Remove one ${p.name}">${minus}</button><output aria-label="${p.name} quantity">0</output><button type="button" data-delta="1" aria-label="Add one ${p.name}">${plus}</button></div>`;
  card.querySelector('.scent-photo').addEventListener('click',()=>showPhoto(p));
  card.querySelectorAll('[data-delta]').forEach(button=>button.addEventListener('click',()=>{
    if(changeQuantity(state,p.id,Number(button.dataset.delta))){showPhoto(p);$('review-result').hidden=true;render();}
  }));
  $(`${p.series}-options`).append(card);
}
function showPhoto(p){
  if(viewed===p.id) return; // Quantity changes for this scent must not reload its image.
  viewed=p.id;$('hero-photo').src=`${window.TBB_BUNDLE_CART.assets}${p.image}`;
  $('hero-photo').alt=`${p.name} ${p.series==='premium'?'Premium':'Pop'} body wash, ${p.ml}ml`;
  $('photo-name').textContent=p.name;$('photo-notes').textContent=p.notes;
  $('photo-series').textContent=`${p.series==='premium'?'Premium':'Pop'} · ${p.ml}ml`;
  document.querySelectorAll('.thumbnail').forEach(t=>t.setAttribute('aria-pressed',String(Number(t.dataset.id)===viewed)));
}
function render(message){
  const bundle=bundles[state.key],ready=complete(state),single=state.key==='single';
  document.querySelector('.tbb-bundle-page').classList.toggle('is-single',single);
  $('summary-title').textContent=single?'Your bottles':'Your bundle, your way.';
  const selected=products.filter(p=>state.quantities[p.id]);
  const total=count(state,'premium')+count(state,'pop');
  const lineCents=p=>unitCents(singlePrices[p.id])*state.quantities[p.id];
  const subtotal=selected.reduce((sum,p)=>sum+lineCents(p),0);
  const priceLabel=single?offerCents(subtotal):offerMoney(bundle.price);
  $('single-option-price').textContent=singleRange();
  $('pop-hint').textContent=single?'350ml each. Repeat a favourite or mix scents.':'350ml each. Your complimentary bottles are included.';
  $('review').textContent='Preview your selection';
  $('offer-price').textContent=single?singleRange():priceLabel;
  $('subtotal').textContent=priceLabel;
  $('sticky-price').textContent=single && !total?singleRange():priceLabel;
  $('bundle-inclusions').textContent=single?'Premium or Pop Series':`${bundle.premium} Premium Series + ${bundle.pop} complimentary Pop Series`;
  $('sticky-name').textContent=bundle.name;
  const freeDelivery=state.key==='stockup';
  $('delivery-copy').textContent=freeDelivery?`Free Singapore delivery included. Overseas Shipment ${money(16)}.`:`Local Delivery ${money(10)} · Overseas Shipment ${money(16)}`;
  $('summary-delivery').textContent=freeDelivery?`Free Singapore delivery · Overseas Shipment ${money(16)}`:`Local Delivery ${money(10)} · Overseas Shipment ${money(16)}`;
  if(single){
    const singapore='Singapore delivery '+money(10)+', free on orders over '+money(100)+' after discounts.';
    $('delivery-copy').textContent=$('summary-delivery').textContent=singapore+' Overseas Shipment '+money(16)+'.';
  }
  $('sticky-delivery').textContent=freeDelivery?'Free Singapore delivery':'+ delivery at checkout';
  $('sticky-progress').textContent=single ? `${total} bottle${total===1?'':'s'} selected` : `${total} / ${bundle.premium+bundle.pop} bottles selected`;
  $('sticky-review').innerHTML=(ready?'Preview your selection':'Choose your scents')+' '+arrow;
  for(const series of ['premium','pop']){
    const n=count(state,series),label=$(`${series}-count`);
    label.textContent=single?`${n} selected`:`${n} of ${bundle[series]} selected`;label.classList.toggle('complete',single?ready:n===bundle[series]);
    for(const p of products.filter(p=>p.series===series)){
      const card=$(`scent-${p.id}`),qty=state.quantities[p.id]||0;
      card.classList.toggle('selected',qty>0);card.querySelector('output').value=String(qty);
      card.querySelector('[data-delta="-1"]').disabled=qty===0;
      card.querySelector('[data-delta="1"]').disabled=!single && n>=bundle[series];
    }
  }
  $('selected-items').innerHTML=selected.length?selected.map(p=>`<div class="selected-row"><img src="${window.TBB_BUNDLE_CART.assets}${p.image}" width="38" height="48" alt=""><div><strong>${state.quantities[p.id]} × ${p.name}</strong><span>${p.series==='premium'?'Premium':'Pop'} · ${p.ml}ml</span></div><b>${single?offerCents(lineCents(p)):(p.series==='pop'?'Complimentary':'Included')}</b></div>`).join(''):'<p class="empty">Your chosen fragrances will appear here.</p>';
  const missing=['premium','pop'].filter(s=>count(state,s)<bundle[s]).map(s=>`${bundle[s]-count(state,s)} ${s==='premium'?'Premium':'Pop'}`);
  $('feedback').textContent=message || (single?(ready?'Your selection is ready.':'Choose at least one Pop or Premium bottle.'):(ready?'All bottles selected. Preview your bundle below.':`Still to choose: ${missing.join(' and ')}. Pick your fragrances to complete the bundle.`));
}
document.querySelectorAll('[name="bundle"]').forEach(radio=>radio.addEventListener('change',()=>{
  const before=count(state,'premium')+count(state,'pop');
  changeBundle(state,radio.value);$('review-result').hidden=true;
  render(before>count(state,'premium')+count(state,'pop')?'Your quantities were reduced to fit this smaller bundle. Please review your choices.':undefined);
}));
$('reset').addEventListener('click',()=>{state.quantities={};$('review-result').hidden=true;render('Your choices have been reset.');});
function review(){
  if(!complete(state)){
    const missing=state.key==='single'?'premium':['premium','pop'].find(s=>count(state,s)<bundles[state.key][s]);
    render();const target=$(`${missing}-options`);target.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    target.querySelector('[data-delta="1"]:not(:disabled)').focus({preventScroll:true});return;
  }
  const result=$('review-result');result.hidden=false;result.setAttribute('role','status');
  result.textContent=`${bundles[state.key].name}: ${products.filter(p=>state.quantities[p.id]).map(p=>`${state.quantities[p.id]} × ${p.name}`).join(', ')}. Design preview only — no order has been created.`;
  result.scrollIntoView({block:'nearest',behavior:photoMotion.matches?'instant':'smooth'});
}
$('review').addEventListener('click',review);$('sticky-review').addEventListener('click',review);
showPhoto(products[0]);render();
