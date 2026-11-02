(() => {
 'use strict';
 const reduce = matchMedia('(prefers-reduced-motion: reduce)');
 if (window.ScrollCraft) window.ScrollCraft.mount(document);
 const hero = document.querySelector('#hero');
 const about = document.querySelector('#about');
 const portrait = about.querySelector('.turn-live');
 let currentFrame = 0;
 let pending = false;
 function paint() {
  pending = false;
  if (reduce.matches) return;
  const p = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / hero.offsetHeight));
  hero.style.setProperty('--portrait-y', `${p * 55}px`);
  hero.style.setProperty('--caption-y', `${p * -35}px`);
  hero.style.setProperty('--word-x', `${p * -80}px`);
  const rect = about.getBoundingClientRect();
  if (rect.top < innerHeight && rect.bottom > 0) {
   const progress = Math.min(1, Math.max(0, (innerHeight * .8 - rect.top) / (rect.height * .8)));
   const frame = 1 + Math.round(progress * 40);
   if (frame !== currentFrame) {
    currentFrame = frame;
    // Remove the static AVIF source so the frame sequence becomes the visible image.
    portrait.parentElement.querySelector('source')?.remove();
    portrait.src = `assets/img/snap-seq/f${String(frame).padStart(2,'0')}.webp`;
   }
  }
  document.querySelectorAll('.exp-item').forEach(item => item.classList.toggle('is-current', Math.abs(item.getBoundingClientRect().top - innerHeight * .45) < 110));
 }
 addEventListener('scroll', () => { if (!pending) { pending = true; requestAnimationFrame(paint); } }, {passive:true});
 reduce.addEventListener('change', () => { if(reduce.matches) hero.removeAttribute('style'); else paint(); });
 paint();
 const desk = document.querySelector('.proof-desk');
 document.querySelectorAll('.plate').forEach((plate, i) => {
  const value = plate.querySelector('.fig').textContent;
  const label = plate.querySelector('.plate-label').textContent;
  const source = plate.querySelector('.plate-src').textContent;
  const button = document.createElement('button');
  button.className = 'proof-pick'; button.type = 'button';
  button.setAttribute('aria-pressed', 'false');
  const number = document.createElement('span'); number.className='fig'; number.textContent=value;
  const text = document.createElement('span'); text.className='plate-label'; text.textContent=label;
  const small = document.createElement('span'); small.className='plate-src'; small.textContent=source; text.append(small);
  button.append(number,text); plate.replaceChildren(button);
  function select() {
   document.querySelectorAll('.proof-pick').forEach(b => b.setAttribute('aria-pressed', String(b===button)));
   const strong=document.createElement('strong'); strong.textContent=value;
   const p=document.createElement('p'); p.textContent=label;
   const note=document.createElement('small'); note.textContent=source;
   desk.replaceChildren(strong,p,note);
  }
  button.addEventListener('click', () => {
   select();
   if (innerWidth <= 760) desk.scrollIntoView({block:'start',behavior:reduce.matches?'instant':'smooth'});
  }); if(i===0)select();
 });
 const contact=document.querySelector('#contact-cta');
 contact.href='mailto:'+['siniidrozd','gmail.com'].join('@');
 document.querySelectorAll('.yt').forEach(button => button.addEventListener('click', () => {
  const frame=document.createElement('iframe'); frame.className='yt-frame';
  frame.src='https://www.youtube-nocookie.com/embed/'+button.dataset.id+'?autoplay=1';
  frame.title=button.getAttribute('aria-label'); frame.allow='autoplay; encrypted-media; picture-in-picture'; frame.allowFullscreen=true; button.replaceWith(frame); frame.focus();
 }));
})();
