const assert=require('node:assert/strict'),M=require('./model.js'),P=require('./portal.js');
for(const c of M.cases.filter(c=>c.id!=='af')){
 const period=60/c.hr,span=6,scale=35,b=-25,t=0;
 const marks=[period,period*1.5].map(ti=>{const velocity=M.velocity(c,1,ti);return {x:36+ti/span*639,y:P.y(velocity,scale,b),velocity}});
 assert.equal(P.validate(c,marks,t,50,scale,b,M).ok,true,c.id+' correct extrema');
 const bad=marks.map(m=>({...m,y:m.y+25,velocity:m.velocity-8.75}));assert.equal(P.validate(c,bad,t,50,scale,b,M).ok,false,'off envelope');
 const same=[marks[0],{...marks[0],x:marks[0].x+1}];assert.equal(P.validate(c,same,t,50,scale,b,M).ok,false,'two maxima');
 const distant=[marks[0],{...marks[1],x:marks[1].x+639*period/span*2}];assert.equal(P.validate(c,distant,t,50,scale,b,M).ok,false,'different cycles');
}
for(const scale of [15,35,70])for(const b of [-25,0,25])for(const v of [-2,0,10,24])assert.ok(Math.abs(P.velocity(P.y(v,scale,b),scale,b)-v)<1e-10);
assert.equal(P.hit({x:385,y:242}),0);assert.equal(P.hit({x:365,y:303}),1);assert.equal(P.hit({x:100,y:100}),-1);
assert.ok(P.wrap(60,20,0)<60);assert.equal(Math.sign(M.velocity(M.cases[3],1,60/96/2)),-1);
console.log('PASS: portal extrema validation, incorrect calipers, cycles, coordinate invariance, shared vessel geometry, signed flow.');
