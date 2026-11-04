document.querySelectorAll('[data-tbb-product-tabs]').forEach(group=>{
  const tabs=[...group.querySelectorAll('[role=tab]')];
  function select(tab){
    tabs.forEach(t=>{const on=t===tab;t.classList.toggle('is-active',on);t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1;const panel=document.getElementById(t.getAttribute('aria-controls'));panel.classList.toggle('is-active',on);panel.hidden=!on;});
  }
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>select(tab));
    tab.addEventListener('keydown',event=>{
      let next;if(event.key==='ArrowRight')next=(index+1)%tabs.length;if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=tabs.length-1;
      if(next!==undefined){event.preventDefault();select(tabs[next]);tabs[next].focus();}
    });
  });
  if(tabs.length)select(tabs[0]);
});
document.querySelectorAll('.tbbg2__filter').forEach(button=>button.addEventListener('click',()=>{
  const filter=button.dataset.filter;
  document.querySelectorAll('.tbbg2__filter').forEach(b=>{b.classList.toggle('is-active',b===button);b.setAttribute('aria-pressed',String(b===button));});
  document.querySelectorAll('.tbbg2__card').forEach(card=>{card.hidden=filter!=='all'&&!((card.dataset.series||'')+' '+(card.dataset.tags||'')+' '+(card.dataset.category||'')).split(' ').includes(filter);});
}));
document.querySelectorAll('.review-header nav a').forEach(a=>{if(new URL(a.href).pathname===location.pathname)a.setAttribute('aria-current','page');});
