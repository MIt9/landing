// Requires playwright-core and axe-core in Node's module path; local server on 4500.
const {chromium}=require('playwright-core');
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try {
  for(const width of [1440,390,360]){
   const context=await browser.newContext({viewport:{width,height:844}});
   await context.addInitScript(()=>{Element.prototype.requestPointerLock=()=>{};Element.prototype.setPointerCapture=()=>{}});
   const page=await context.newPage();await page.goto('http://127.0.0.1:4500');
   await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
   const result=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));
   const violations=result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));
   console.log(JSON.stringify({width,violations}));
   if(violations.length)throw Error('Accessibility violations at '+width);
   await context.close();
  }
 } finally {await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
