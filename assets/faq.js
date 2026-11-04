// Native details remain usable if scripting or animation is unavailable.
export function enhanceFAQ(details, media) {
  const summary=details.querySelector('summary');
  let expanded=details.open, animation=null, generation=0;
  details.dataset.expanded=String(expanded);
  function settle() {
    generation++;
    animation?.cancel();animation=null;
    details.open=expanded;
    details.classList.remove('faq-sliding');
    summary.removeAttribute('aria-expanded');
  }
  summary.addEventListener('click',event=>{
    if(!details.animate) return; // Preserve the native toggle fallback.
    event.preventDefault();
    const from=details.getBoundingClientRect().height;
    animation?.cancel();animation=null;
    expanded=!expanded;details.dataset.expanded=String(expanded);
    const run=++generation;
    if(media.matches){settle();return;}
    // Keep content rendered until closing completes. Measure only at the click,
    // never on animation frames. A bounded height slide moves following questions
    // naturally rather than scaling/distorting text or overlaying other answers.
    details.open=true;
    const border=details.getBoundingClientRect().height-details.clientHeight;
    const to=expanded?details.getBoundingClientRect().height:summary.offsetHeight+border;
    details.classList.add('faq-sliding');
    summary.setAttribute('aria-expanded',String(expanded));
    animation=details.animate([{height:`${from}px`},{height:`${to}px`}],{
      duration:expanded?300:220,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'
    });
    animation.finished.then(()=>{if(run===generation)settle();},()=>{});
  });
  media.addEventListener('change',()=>{if(media.matches)settle();});
  return {settle};
}
if(typeof document!=='undefined') {
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  const controls=[...document.querySelectorAll('.questions details')].map(details=>enhanceFAQ(details,media));
  // Resizing should immediately restore natural height, not clip rewrapped copy.
  window.addEventListener('resize',()=>controls.forEach(control=>control.settle()));
}
