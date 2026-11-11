export const bundles = {
  single: { name:'The One', price:0, premium:0, pop:0, total:1 },
  essential: { name:'The Signature Edit', price:70, usual:97, saving:27, percent:'27.8', premium:2, pop:1 },
  stockup: { name:'The Ultimate Stack', price:99, usual:186, saving:87, percent:'46.8', premium:3, pop:3 }
};
export const products = [
  { id:90, benefit:'Soothing & Calming', name:'No. 001', series:'premium', ml:375, notes:'Fig, Peony, Musk', image:'no001.webp' },
  { id:91, benefit:'Nourishing & Conditioning', name:'No. 002', series:'premium', ml:375, notes:'Bergamot, Lychee, Vanilla', image:'no002.webp' },
  { id:92, benefit:'Brightening & Radiance', name:'No. 003', series:'premium', ml:375, notes:'Bitter Orange, Peony, Cedarwood', image:'no003.webp' },
  { id:93, benefit:'Hydrating & Moisturizing', name:'No. 004', series:'premium', ml:375, notes:'Fresh Citrus, White Flowers, Musk', image:'no004.webp' },
  { id:3601, benefit:'Daily Vitamin Cleansing & Moisturizing', name:'Always Mine', series:'pop', ml:350, notes:'Citrus, Jasmine, Powdery', image:'always-mine.jpeg' },
  { id:3594, benefit:'Daily Vitamin Cleansing & Moisturizing', name:'Noir Crystal', series:'pop', ml:350, notes:'Lemon, Sunflower, Tonka Bean', image:'noir-crystal.jpeg' },
  { id:3593, benefit:'Daily Vitamin Cleansing & Moisturizing', name:'Reality', series:'pop', ml:350, notes:'Mandarin, Water Vetiver, Musk', image:'reality.jpeg' },
  { id:3592, benefit:'Daily Vitamin Cleansing & Moisturizing', name:'Malibu Lemonade', series:'pop', ml:350, notes:'Juicy Orange, Sheer Muguet, Creamy Vanilla', image:'malibu-lemonade.jpeg' }
];
export function createState(key='essential'){ return { key:bundles[key]?key:'essential', quantities:{} }; }
export function count(state,series){ return products.filter(p=>p.series===series).reduce((n,p)=>n+(state.quantities[p.id]||0),0); }
export function complete(state){ if(state.key==='single')return count(state,'premium')+count(state,'pop')===1; return ['premium','pop'].every(series=>count(state,series)===bundles[state.key][series]); }
export function changeQuantity(state,id,delta){
  const product=products.find(p=>p.id===id);
  if(!product || ![1,-1].includes(delta)) return false;
  const current=state.quantities[id]||0;
  if(current+delta<0) return false;
  if(state.key==='single'){ if(delta>0 && count(state,'premium')+count(state,'pop')>=1)return false; }
  else if(delta>0 && count(state,product.series)>=bundles[state.key][product.series]) return false;
  state.quantities[id]=current+delta; return true;
}
export function changeBundle(state,key){
  if(!bundles[key])return false;
  state.key=key;
  if(key==='single'){const selected=products.find(p=>state.quantities[p.id]);state.quantities=selected?{[selected.id]:1}:{};return true;}
  for(const series of ['premium','pop']){
    let remaining=bundles[key][series];
    for(const p of products.filter(p=>p.series===series)){
      state.quantities[p.id]=Math.min(state.quantities[p.id]||0,remaining);
      remaining-=state.quantities[p.id];
    }
  }
  return true;
}
