/* Shared portal geometry, Doppler coordinates and measurement validation. */
(function(root){
const curves=[[[225,365,26],[270,315,25],[325,275,23],[385,242,22],[440,198,19],[495,145,16]],[[285,373,7],[325,335,7],[365,303,6],[410,278,6],[453,244,5]]];
// Interpolate each centreline with Catmull-Rom; use identical samples for rendering and hit testing.
curves.forEach((points,index)=>{const smooth=[];for(let i=0;i<points.length-1;i++){const p0=points[Math.max(0,i-1)],p1=points[i],p2=points[i+1],p3=points[Math.min(points.length-1,i+2)];for(let j=0;j<8;j++){const t=j/8;smooth.push([0,1,2].map(k=>.5*((2*p1[k])+(-p0[k]+p2[k])*t+(2*p0[k]-5*p1[k]+4*p2[k]-p3[k])*t*t+(-p0[k]+3*p1[k]-3*p2[k]+p3[k])*t*t*t)))}}smooth.push(points.at(-1));curves[index]=smooth});
function sample(x,y){let best={kind:-1,d:Infinity,r:1};curves.forEach((pts,kind)=>{for(let i=1;i<pts.length;i++){const [ax,ay,ar]=pts[i-1],[bx,by,br]=pts[i],dx=bx-ax,dy=by-ay,u=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy))),d=Math.hypot(x-ax-u*dx,y-ay-u*dy),r=ar+(br-ar)*u;if(d/r<best.d/best.r)best={kind,d,r}}});return best}
function hit(p){const k=sample(p.x,p.y);return k.d<k.r?k.kind:-1}
function quality(p){const k=sample(p.x,p.y);return k.d<k.r?Math.max(.15,Math.min(1,(1-k.d/k.r)*3)):0}
const top=25,bottom=260,left=36,right=675;
function zero(b){return 145-b*1.6}
function y(velocity,scale,b){return zero(b)-velocity/scale*100}
function velocity(yValue,scale,b){return (zero(b)-yValue)/100*scale}
function wrap(velocityValue,scale,b){const low=velocity(bottom,scale,b),high=velocity(top,scale,b),range=high-low;return ((velocityValue-low)%range+range)%range+low}
function timeAt(x,t,sweep){return t+(x-left)/(right-left)*6*50/sweep}
function validate(c,marks,t,sweep,scale,b,M){
 if(marks.length!==2)return {ok:false,message:'Поставьте максимум и минимум на огибающей одного цикла.'};
 const times=marks.map(m=>timeAt(m.x,t,sweep)),values=marks.map(m=>M.velocity(c,1,timeAt(m.x,t,sweep)));
 const period=60/c.hr;
 if(Math.abs(times[1]-times[0])>period*.8)return {ok:false,message:'Выберите соседние максимум и минимум одного цикла.'};
 if(marks.some((m,i)=>Math.abs(y(values[i],scale,b)-m.y)>5))return {ok:false,message:'Маркер вне огибающей. Перетащите его на внешний край спектра.'};
 const high=Math.max(...marks.map(m=>m.velocity)),low=Math.min(...marks.map(m=>m.velocity)),pf=M.pf(high,low);
 if(Math.abs(Math.max(...values)-24)>1.3||Math.abs(Math.min(...values)-24*(1-c.p))>1.3)return {ok:false,message:'Выбраны не экстремумы. Найдите вершину и нижнюю точку огибающей.'};
 if(pf===null||Math.abs(pf-c.p*100)>5||M.category(pf/100)!==M.category(c.p))return {ok:false,message:'Измерение недостаточно точное. Уточните оба маркера (допуск PF ±5 п.п.).'};
 // Reject wrapped portions: do not infer true velocity from an aliased trace.
 if(y(24,scale,b)<top||y(24*(1-c.p),scale,b)>bottom)return {ok:false,message:'Спектр выходит за шкалу. Увеличьте PW scale или сместите baseline и повторите измерение.'};
 return {ok:true,message:'Измерение принято: обе точки на экстремумах огибающей.',pf};
}
function hash(x,y){let n=Math.imul(x|0,374761393)+Math.imul(y|0,668265263);n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967295}
function noise(x,y,size){const ix=Math.floor(x/size),iy=Math.floor(y/size),u=x/size-ix,v=y/size-iy;return (hash(ix,iy)*(1-u)+hash(ix+1,iy)*u)*(1-v)+(hash(ix,iy+1)*(1-u)+hash(ix+1,iy+1)*u)*v}
let background;
function makeBackground(){const canvas=document.createElement('canvas');canvas.width=720;canvas.height=430;const ctx=canvas.getContext('2d'),im=ctx.createImageData(720,430);for(let y0=0;y0<430;y0++)for(let x=0;x<720;x++){const k=sample(x,y0),depth=Math.hypot(x-360,y0+105),grain=noise(x,y0,2),structure=noise(x,y0,28);let b=(30+70*grain+27*structure)*(1-.35*y0/430);b+=15*Math.exp(-(((depth-186)/5)**2))+10*Math.exp(-(((depth-202)/4)**2));if(k.d<k.r)b=4+9*grain;else if(k.d<k.r+5)b+=60*(1-(k.d-k.r)/5);const idx=(y0*720+x)*4;im.data[idx]=im.data[idx+1]=im.data[idx+2]=Math.min(190,b);im.data[idx+3]=255}ctx.putImageData(im,0,0);return canvas}
function sector(ctx){ctx.beginPath();ctx.moveTo(300,24);ctx.quadraticCurveTo(360,41,420,24);ctx.lineTo(672,366);ctx.quadraticCurveTo(360,491,48,366);ctx.closePath()}
let field;function cachedSample(x,y){if(!field){field=Array.from({length:144*86},(_,i)=>sample((i%144)*5,Math.floor(i/144)*5))}return field[Math.max(0,Math.min(85,Math.round(y/5)))*144+Math.max(0,Math.min(143,Math.round(x/5)))]}
function draw(ctx,state,settings,c,t,M){if(!background)background=makeBackground();ctx.fillStyle='#03090c';ctx.fillRect(0,0,720,430);ctx.save();sector(ctx);ctx.clip();ctx.drawImage(background,0,0);if(settings.color){ctx.save();ctx.beginPath();ctx.rect(state.box.x-125,state.box.y-110,250,220);ctx.clip();for(let y0=Math.max(40,state.box.y-110);y0<Math.min(420,state.box.y+110);y0+=3)for(let x=Math.max(45,state.box.x-125);x<Math.min(675,state.box.x+125);x+=3){const k=cachedSample(x,y0),n=hash(x+Math.floor(t*12),y0);if(k.d<k.r*.94){let vel=k.kind===0?M.velocity(c,1,t):artery(c,t,M);vel*=.5+.5*Math.sqrt(Math.max(0,1-(k.d/k.r)**2));const folded=((vel+settings.cs)%(2*settings.cs)+2*settings.cs)%(2*settings.cs)-settings.cs;const strength=Math.min(1,Math.abs(vel)/settings.cs*1.8)*settings.gain/65;if(n>strength+.12)continue;const light=Math.round(70+120*n);ctx.fillStyle=folded>=0?`rgba(235,${light*.5},28,${Math.min(.9,strength)})`:`rgba(25,${light*.65},235,${Math.min(.9,strength)})`;ctx.fillRect(x+(n-.5)*2,y0+(n-.5),3.4,3.3)}else if(settings.gain>80&&n>.985){ctx.fillStyle='#d85b4555';ctx.fillRect(x,y0,2,2)}}ctx.restore()}ctx.restore();ctx.fillStyle='#abbabd';ctx.font='10px Segoe UI';ctx.fillText('B · C5–1 / ПЕЧЕНЬ · УЧЕБНАЯ СИМУЛЯЦИЯ',20,20);ctx.fillText('PV / HA · 12 cm',20,414);for(let i=2;i<=10;i+=2)ctx.fillText(String(i),687,40+i*33);ctx.fillText('см',683,415);if(settings.color){ctx.strokeStyle='#acc8cfaa';ctx.lineWidth=1;ctx.strokeRect(state.box.x-125,state.box.y-110,250,220);const grd=ctx.createLinearGradient(0,70,0,150);grd.addColorStop(0,'#ffc672');grd.addColorStop(.47,'#9e211b');grd.addColorStop(.5,'#081018');grd.addColorStop(.53,'#132b92');grd.addColorStop(1,'#7fbcff');ctx.fillStyle=grd;ctx.fillRect(683,70,10,80);ctx.fillStyle='#a7bac1';ctx.fillText('+'+settings.cs,678,64);ctx.fillText('−'+settings.cs,678,163)}if(settings.pw){const p=state.gate;ctx.strokeStyle='#c5edb6';ctx.lineWidth=1;ctx.setLineDash([3,5]);ctx.beginPath();ctx.moveTo(360,25);ctx.lineTo(p.x,p.y);ctx.stroke();ctx.setLineDash([]);ctx.beginPath();ctx.arc(p.x,p.y,17,0,7);ctx.stroke();ctx.lineWidth=2;for(const dy of [-6,6]){ctx.beginPath();ctx.moveTo(p.x-10,p.y+dy);ctx.lineTo(p.x+10,p.y+dy);ctx.stroke()}ctx.fillStyle='#c5edb6';ctx.fillText('PW',p.x+23,p.y+4)}}
function artery(c,t,M){return 13+45*Math.exp(-(((M.phase(c,t)-.23)/.065)**2))}
const api={sample,hit,quality,y,velocity,zero,wrap,timeAt,validate,hash,draw,artery};if(typeof module!=='undefined')module.exports=api;root.Portal=api;
})(typeof window==='undefined'?globalThis:window);
