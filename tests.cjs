const assert=require('node:assert/strict'),M=require('./model.js');
assert.deepEqual(M.cases.map(M.grade),[0,1,2,3,0,0,0]);
assert.equal(M.category(.3),1);assert.equal(M.category(.5),2);assert.equal(M.grade({...M.cases[0],ivc:2}),1);
assert.equal(M.pf(20,-2),110.00000000000001);assert.equal(M.pf(-2,-4),null);assert.equal(M.pf(12,20),40);
for(const c of M.cases){const arr=Array.from({length:10000},(_,i)=>M.velocity(c,1,i/1000));const measured=M.pf(Math.max(...arr),Math.min(...arr));assert.ok(Math.abs(measured-c.p*100)<.1,c.id+' spectral PF');}
assert.equal(M.hit(1,{x:370,y:245}),0);assert.equal(M.hit(1,{x:100,y:100}),-1);
const one=M.fresh(),two=M.fresh();one.measures.push(1);one.correct=true;assert.equal(two.measures.length,0);assert.equal(two.correct,false);
console.log('PASS: 7 grades, thresholds, signed PF, 7 spectral PF checks, gate hit-testing, isolated/reset state.');
