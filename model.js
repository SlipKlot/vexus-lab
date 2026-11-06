(function(root){
'use strict';
const cases=[
{id:'normal',name:'Норма',ivc:1.6,hr:72,h:0,p:.18,r:0},
{id:'grade1',name:'VExUS 1 · лёгкие изменения',ivc:2.3,hr:84,h:1,p:.4,r:1},
{id:'grade2',name:'VExUS 2 · один тяжёлый паттерн',ivc:2.5,hr:92,h:2,p:.42,r:1},
{id:'grade3',name:'VExUS 3 · выраженные изменения',ivc:2.7,hr:96,h:2,p:1.1,r:2},
{id:'af',name:'Ловушка · фибрилляция предсердий',ivc:1.8,hr:88,h:1,p:.2,r:0,note:'При ФП нет A-волны, интервалы RR нерегулярны. S < D нельзя трактовать изолированно как повышение давления.'},
{id:'cirrhosis',name:'Ловушка · цирроз',ivc:1.9,hr:80,h:3,p:.15,r:0,note:'При циррозе сглаженный печёночный спектр ненадёжен для градации. Учитывайте ограничения метода и клинический контекст.'},
{id:'athlete',name:'Ловушка · спортсмен',ivc:1.7,hr:52,h:0,p:.4,r:0,note:'Пульсация воротной вены может встречаться у здорового худощавого спортсмена. Оценивайте её вместе с НПВ и другими данными.'}];
const vessels=[{name:'Печёночная вена',short:'Печёночная',choices:['S > D','S < D','Реверсия S','Сглаженный спектр'],lines:[[210,125,420,340,21],[420,340,590,365,38]],target:0},{name:'Воротная вена',short:'Воротная',choices:['PF < 30%','PF 30–49%','PF ≥ 50%'],lines:[[240,365,500,125,23],[286,380,455,220,8]],target:0},{name:'Внутрипочечная вена',short:'Внутрипочечная',choices:['Непрерывный поток','Двухфазный S + D','Прерывистый D-only'],lines:[[365,355,290,190,10],[365,355,435,185,10],[365,355,485,270,10]],target:0}];
function category(p){return p<.3?0:p<.5?1:2}
function expected(c,v){return v===0?c.h:v===1?category(c.p):c.r}
function grade(c){if(c.ivc<2)return 0;const n=+(c.h===2)+ +(c.p>=.5)+ +(c.r===2);return n===0?1:n===1?2:3}
function pf(a,b){const max=Math.max(a,b),min=Math.min(a,b);return max>0?(max-min)/max*100:null}
function distance(p,l){const [x,y,a,b]=l,dx=a-x,dy=b-y,t=Math.max(0,Math.min(1,((p.x-x)*dx+(p.y-y)*dy)/(dx*dx+dy*dy)));return Math.hypot(p.x-x-t*dx,p.y-y-t*dy)}
function hit(v,p){return vessels[v].lines.findIndex(l=>distance(p,l)<l[4])}
function phase(c,t){let z=t*c.hr/60;if(c.id==='af')z+=.09*Math.sin(t*4.1);return ((z%1)+1)%1}
function gaussian(x,m,s){return Math.exp(-.5*((x-m)/s)**2)}
function velocity(c,v,t){const x=phase(c,t);if(v===1)return 24*(1-c.p/2+c.p/2*Math.cos(2*Math.PI*x));if(v===0){if(c.h===3)return -12-1.5*Math.cos(x*6.28);const s=c.h===2?20:c.h===1?-13:-32;return s*gaussian(x,.27,.09)-22*gaussian(x,.64,.09)+5*gaussian(x,.49,.035)+(c.id==='af'?0:8*gaussian(x,.95,.025));}if(c.r===0)return -12-1.5*Math.cos(x*6.28);return -(c.r===1&&x>.16&&x<.4?15*Math.sin(Math.PI*(x-.16)/.24):0)-(x>.53&&x<.83?20*Math.sin(Math.PI*(x-.53)/.3):0)}
function artery(c,t){const x=phase(c,t);return 10+25*gaussian(x,.25,.055)+4*gaussian(x,.4,.1)}
function fresh(){return {gate:{x:180,y:170},box:{x:350,y:245},read:false,measures:[],correct:false,attempt:null,feedback:'',concept:false,conceptFeedback:''}}
const api={artery,cases,vessels,category,expected,grade,pf,distance,hit,phase,velocity,fresh};if(typeof module!=='undefined')module.exports=api;root.Vexus=api;
})(typeof window==='undefined'?globalThis:window);
