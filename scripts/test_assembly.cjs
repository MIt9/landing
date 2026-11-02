const {chromium}=require('playwright-core');const fs=require('fs');
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 const out=require('path').resolve(__dirname,'../scrollcraft/lab/assembly');fs.mkdirSync(out,{recursive:true});const report=[];
 for(const [name,width,height,reducedMotion] of [['desktop',1440,1000,'no-preference'],['mobile',390,844,'no-preference'],['compact',360,640,'no-preference'],['reduced',1440,1000,'reduce']]){
  const context=await browser.newContext({viewport:{width,height},reducedMotion});await context.addInitScript(()=>{Element.prototype.requestPointerLock=()=>{};Element.prototype.setPointerCapture=()=>{}});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
  await page.goto('http://127.0.0.1:4500');await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(250);
  await page.screenshot({path:`${out}/${name}-opening.png`});
  const alpha=await page.locator('.sculpture img').evaluate(img=>{const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const x=c.getContext('2d');x.drawImage(img,0,0);const d=x.getImageData(0,0,c.width,c.height).data;let clear=0,solid=0;for(let i=3;i<d.length;i+=4){if(d[i]===0)clear++;if(d[i]===255)solid++}return {clear,solid}});
  if(!alpha.clear||!alpha.solid)throw Error('Hero alpha missing');
  await page.keyboard.press('Tab');if(!await page.locator('.skip').isVisible())throw Error('Skip link missing');
  if((await page.locator('.skip').boundingBox()).y<0)throw Error('Focused skip link is off screen');
  await page.keyboard.press('Enter');
  if(await page.evaluate(()=>document.activeElement.id)!=='main')throw Error('Skip link did not move keyboard focus');
  if(name==='desktop'){
   await page.mouse.move(300,400);await page.waitForTimeout(50);const before=await page.screenshot();
   await page.mouse.move(1300,400);await page.waitForTimeout(50);const after=await page.screenshot({path:`${out}/desktop-pointer.png`});
   if(before.equals(after))throw Error('Pointer depth did not change pixels');
  }
  const shots=['opening'];
  for(const [label,y] of [['hero-mid',350],['hero-exit',650]]){await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),y);await page.waitForTimeout(150);await page.screenshot({path:`${out}/${name}-${label}.png`});shots.push(label)}
  for(const id of ['intro','projects','person','tools','contact']){await page.locator('#'+id).evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));await page.waitForTimeout(250);await page.screenshot({path:`${out}/${name}-${id}.png`});shots.push(id)}
  await page.getByRole('button',{name:'+ Add to shortlist',exact:true}).first().click();
  if(await page.locator('[data-count]').innerText()!=='1')throw Error('Count not updated');
  let href=await page.locator('#contact-cta').getAttribute('href');if(!decodeURIComponent(href).includes('Accessible commerce'))throw Error('Email did not include selection');
  await page.locator('#tools details').nth(1).locator('summary').click();await page.locator('[data-save="mcp-comfy-ui-builder"]').click();
  if(await page.locator('#shortlist li').count()!==2)throw Error('Second selection missing');
  await page.getByRole('button',{name:'Remove Accessible commerce',exact:true}).click();
  if(await page.locator('[data-count]').innerText()!=='1')throw Error('Removal failed');
  await page.reload();
  if(await page.locator('[data-count]').innerText()!=='1')throw Error('Shortlist lost on reload');
  if(!decodeURIComponent(await page.locator('#contact-cta').getAttribute('href')).includes('mcp-comfy-ui-builder'))throw Error('Restored email shortlist missing');
  await page.locator('.more-projects summary').click();
  await page.locator('[data-save="hyperframes-avatar"]').click();
  if(await page.locator('[data-count]').innerText()!=='2')throw Error('Additional GitHub project not selected');
  if(!decodeURIComponent(await page.locator('#contact-cta').getAttribute('href')).includes('hyperframes-avatar'))throw Error('Additional GitHub project missing from email');
  await page.locator('[data-save="hyperframes-avatar"]').click();
  await page.evaluate(async()=>{await Promise.all([...document.images].map(async image=>{image.loading='eager';try{await image.decode()}catch{}}))});
  await page.locator('#contact').evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));await page.screenshot({path:`${out}/${name}-selected.png`});shots.push('selected');
  for(const href of ['cv/dmytro-bilukha-cv.pdf','cv/dmytro-bilukha-cv-uk.pdf'])if(!(await page.request.get('http://127.0.0.1:4500/'+href)).ok())throw Error('CV missing');
  const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,brokenImages:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),deadAnchors:[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.querySelector(a.hash)).map(a=>a.hash)}));
  if(state.overflow||state.brokenImages.length||state.deadAnchors.length||errors.length)throw Error(JSON.stringify({name,...state,errors}));
  const board=await context.newPage();await board.setContent('<body style="margin:0;background:#ccc;display:grid;grid-template-columns:repeat(3,300px);gap:8px">'+shots.map(s=>`<figure style="margin:0"><figcaption>${name}-${s}</figcaption><img style="width:300px;height:220px;object-fit:contain;object-position:top" src="data:image/png;base64,${fs.readFileSync(`${out}/${name}-${s}.png`).toString('base64')}"></figure>`).join('')+'</body>');await board.setViewportSize({width:924,height:780});await board.screenshot({path:`${out}/${name}-sheet.png`,fullPage:true});
  report.push({name,...state,errors});await context.close();
 }
 // Verify static reading and links when scripting is unavailable.
 const fallback=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});await fallback.goto('http://127.0.0.1:4500');if(!await fallback.locator('#hero-h').isVisible())throw Error('No-script title missing');if(await fallback.locator('.save').first().isVisible())throw Error('Inactive save button shown without JS');await fallback.close();
 for(const storage of ['blocked','invalid']){
  const context=await browser.newContext();await context.addInitScript(mode=>{
   Element.prototype.requestPointerLock=()=>{};Element.prototype.setPointerCapture=()=>{};
   if(mode==='blocked')Object.defineProperty(window,'sessionStorage',{get(){throw new Error('Storage disabled')}});
   else sessionStorage.setItem('bilukha-conversation-shortlist','{"invalid":true}');
  },storage);
  const page=await context.newPage();await page.goto('http://127.0.0.1:4500');await page.locator('[data-save]').first().click();if(await page.locator('[data-count]').innerText()!=='1')throw Error('Shortlist failed with '+storage+' storage');await context.close();
 }
 fs.writeFileSync(out+'/results.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();
})();
