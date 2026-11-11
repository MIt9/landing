(() => {
 'use strict';
 if (window.ScrollCraft) ScrollCraft.mount(document);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const arrival=document.querySelector('#arrival'), person=document.querySelector('#person'), portrait=document.querySelector('#portrait');
 let queued=false, lastFrame=0;
 if(!reduced.matches)portrait.src='assets/img/snap-seq/f01.webp';
 function paint(){
  queued=false;
  if(reduced.matches)return;
  const rect=arrival.getBoundingClientRect();
  if(rect.bottom>0){
   const p=Math.max(0,Math.min(1,-rect.top/rect.height));
   arrival.style.setProperty('--object-y',`${p*95}px`);
   arrival.style.setProperty('--object-rotate',`${-8+p*16}deg`);
   arrival.style.setProperty('--type-y',`${p*-40}px`);
   arrival.style.setProperty('--label-y',`${p*-70}px`);
  }
  const r=person.getBoundingClientRect();
  if(r.top<innerHeight&&r.bottom>0){
   const p=Math.max(0,Math.min(1,(innerHeight*.4-r.top)/(innerHeight*.8)));
   const frame=1+Math.round(p*40);
   if(frame!==lastFrame){lastFrame=frame;portrait.src=`assets/img/snap-seq/f${String(frame).padStart(2,'0')}.webp`;}
  }
 }
 addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(paint)}},{passive:true});
 arrival.addEventListener('pointermove',event=>{
  if(reduced.matches||event.pointerType!=='mouse'||innerWidth<761)return;
  const r=arrival.getBoundingClientRect();arrival.style.setProperty('--pointer-x',`${((event.clientX-r.left)/r.width-.5)*18}px`);
 },{passive:true});
 arrival.addEventListener('pointerleave',()=>arrival.style.setProperty('--pointer-x','0px'));
 reduced.addEventListener('change',()=>{arrival.removeAttribute('style');lastFrame=0;if(reduced.matches)portrait.src='assets/video/snap-poster.jpg';else{portrait.src='assets/img/snap-seq/f01.webp';paint()}});paint();
 const selected=new Set(), saves=[...document.querySelectorAll('[data-save]')], list=document.querySelector('#shortlist'), status=document.querySelector('#shortlist-status');
 const storageKey='bilukha-conversation-shortlist';
 const validNames=new Set(saves.map(button=>button.dataset.save));
 try {
  const stored=JSON.parse(sessionStorage.getItem(storageKey)||'[]');
  if(Array.isArray(stored))stored.forEach(name=>{if(validNames.has(name))selected.add(name)});
 } catch { /* The shortlist remains usable when browser storage is unavailable. */ }
 function update(announce){
  try { sessionStorage.setItem(storageKey,JSON.stringify([...selected])); } catch { /* Memory-only selection is sufficient. */ }
  document.querySelectorAll('[data-count]').forEach(e=>e.textContent=selected.size);
  saves.forEach(button=>{const active=selected.has(button.dataset.save);button.setAttribute('aria-pressed',String(active));button.textContent=active?'✓ Added to shortlist':'+ Add to shortlist'});
  list.replaceChildren();
  selected.forEach(name=>{const li=document.createElement('li'),text=document.createElement('span'),remove=document.createElement('button');text.textContent=name;remove.textContent='×';remove.type='button';remove.setAttribute('aria-label',`Remove ${name}`);remove.addEventListener('click',()=>{selected.delete(name);update(true);(list.querySelector('button')||document.querySelector('#contact-cta')).focus()});li.append(text,remove);list.append(li)});
  document.querySelector('#empty-shortlist').hidden=selected.size>0;
  const subject=selected.size?`Let's talk: ${[...selected].join(', ')}`:'Let’s build what’s next';
  const body=selected.size?`Hi Dmytro,\n\nI’d like to talk about:\n${[...selected].map(n=>'- '+n).join('\n')}\n\nHere’s what I have in mind:\n`:'Hi Dmytro,\n\nHere’s what I have in mind:\n';
  document.querySelector('#contact-cta').href=`mailto:siniidrozd@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  if(announce)status.textContent=`${selected.size} ${selected.size===1?'item':'items'} in your conversation shortlist.`;
 }
 saves.forEach(button=>button.addEventListener('click',()=>{const n=button.dataset.save;selected.has(n)?selected.delete(n):selected.add(n);update(true)}));update(false);
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)document.querySelectorAll('.dock a').forEach(a=>a.setAttribute('aria-current',String(a.hash==='#'+entry.target.id)))}),{rootMargin:'-20% 0px -45% 0px'});
 document.querySelectorAll('#projects,#person,#tools,#contact').forEach(e=>observer.observe(e));
 const entrances=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('entered');entrances.unobserve(entry.target)}}),{threshold:.05});
 document.querySelectorAll('[data-entrance]').forEach(e=>entrances.observe(e));
 document.documentElement.classList.add('enhanced');
})();
