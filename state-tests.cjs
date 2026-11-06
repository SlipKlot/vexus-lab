// Exercise the actual application handlers with a minimal DOM/Canvas adapter.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const elements=new Map();
const ctx=new Proxy({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),createLinearGradient:()=>({addColorStop(){}}),createRadialGradient:()=>({addColorStop(){}})}, {get:(o,k)=>o[k]||(()=>{})});
function element(){return {value:'50',hidden:false,children:[],handlers:{},width:720,height:340,
 getContext:()=>ctx,add(){},setAttribute(){},replaceChildren(...items){this.children=items},
 addEventListener(type,fn){this.handlers[type]=fn},setPointerCapture(){},
 getBoundingClientRect:()=>({left:0,top:0,width:720,height:340})}}
const document={getElementById(id){if(!elements.has(id))elements.set(id,element());return elements.get(id)},createElement:element};
const box={document,Option:function(){},requestAnimationFrame(){},console};
vm.createContext(box);
for(const file of ['model.js','portal.js','anatomy.js','app.js']){if(file==='app.js')vm.runInContext('Portal.draw=()=>{};Anatomy.draw=()=>{}',box);vm.runInContext(fs.readFileSync(__dirname+'/'+file,'utf8'),box)}
const run=code=>vm.runInContext(code,box);
assert.equal(run('v'),1,'start in portal module');
run("color=true;pw=true;frozen=true;time=2.75;current().gate={x:385,y:242};$('ps').value=70;current().measures=[{x:100,y:100,velocity:20},{x:140,y:115,velocity:16}];current().correct=true;current().feedback='saved';switchVessel(0)");
assert.equal(run('current().measures.length'),0);
assert.equal(run('pw'),false,'new vessel starts independently');
run('switchVessel(1)');
assert.equal(run('time'),2.75,'frozen time restored');
assert.equal(run('frozen'),true);
assert.equal(run("val('ps')"),70);
assert.equal(run('current().measures.length'),2);
assert.equal(run('current().correct'),true);
run("done=true;$('next').hidden=false;$('gradeFeedback').textContent='old result';caliperDrag=0;placeCaliper({clientX:110,clientY:100})");
assert.equal(run('done'),false);
assert.equal(run("$('next').hidden"),true,'caliper change hides stale completion');
assert.notEqual(run("$('gradeFeedback').textContent"),'old result');
assert.equal(run('current().correct'),false);
run("current().correct=true;$('dragMode').value='box';move({x:300,y:230})");
assert.equal(run('current().correct'),true,'Color box does not erase PW acquisition');
assert.equal(run('frozen'),true);
run("$('dragMode').value='gate';move({x:100,y:100})");
assert.equal(run('current().correct'),false);
assert.equal(run('current().measures.length'),0,'moving PW requires new acquisition');
run("current().measures=[{x:100,y:100,velocity:20}];current().correct=true;$('ps').oninput()");
assert.equal(run('current().measures.length'),0,'scale invalidates coordinates');
run("load('grade1');switchVessel(0);switchVessel(1)");
assert.equal(run('current().measures.length'),0);
assert.equal(run('states.some(x=>x.correct)'),false,'new case clears all results');
assert.equal(run("val('ps')"),35);
console.log('PASS: vessel isolation, frozen acquisition restoration, caliper invalidation, Color box preservation, gate/scale invalidation and patient reset.');
