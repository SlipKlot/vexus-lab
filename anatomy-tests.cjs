const assert=require('node:assert/strict'),A=require('./anatomy.js'),M=require('./model.js');
const base={color:true,pw:true,cs:16,gain:65,ps:50,baseline:15,sweep:50,gateSize:2};
const state=(x,y)=>({gate:{x,y},box:{x:350,y:245}});
assert.equal(A.check(0,state(320,274),base,true,M.cases[0],M).ok,true);
assert.match(A.check(0,state(457,191),base,true,M.cases[0],M).message,/слиянию/);
assert.equal(A.check(2,state(352,235),base,true,M.cases[0],M).ok,true);
assert.match(A.check(2,state(350,276),base,true,M.cases[0],M).message,/ворот/);
assert.match(A.check(2,state(352,235),{...base,cs:40},true,M.cases[0],M).message,/20/);
assert.match(A.check(2,state(352,235),{...base,gain:95},true,M.cases[0],M).message,/gain/);
assert.equal(A.check(2,state(352,235),base,false,M.cases[0],M).ok,false);
assert.equal(A.check(2,state(100,100),base,true,M.cases[0],M).ok,false);
assert.ok(A.acquisition(2,{x:352,y:235},2).vein>A.acquisition(2,{x:352,y:235},8).vein);
assert.ok(A.acquisition(2,{x:362,y:234},2).artery>.5);
assert.equal(Math.abs(M.velocity(M.cases[1],2,.46*60/M.cases[1].hr)),0,'renal true no-flow interval');
assert.ok(M.velocity(M.cases[3],0,.27*60/M.cases[3].hr)>0,'hepatic S reversal');
for(const c of M.cases){assert.equal(A.check(0,state(320,274),base,true,c,M).ok,true,c.id);assert.equal(A.check(2,state(352,235),base,true,c,M).ok,true,c.id)}
console.log('PASS: vein/artery/tissue, confluence and hilar exclusion, sample-volume coverage, renal settings, freeze, seven cases, S reversal and renal no-flow gaps.');
