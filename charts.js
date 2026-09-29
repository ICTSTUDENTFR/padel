/* Programme Padel — graphiques SVG */
"use strict";
const chartW=()=>Math.round(Math.max(320,Math.min(640,(window.innerWidth||640)-56)));
function niceTicks(min,max,n=4){if(min===max){min-=1;max+=1;}const span=max-min,step0=span/n,mag=Math.pow(10,Math.floor(Math.log10(step0))),err=step0/mag;const step=(err>=5?10:err>=2?5:err>=1.5?2:1)*mag;const lo=Math.floor(min/step)*step,hi=Math.ceil(max/step)*step;const t=[];for(let v=lo;v<=hi+1e-9;v+=step)t.push(+v.toFixed(6));return t;}
/* series: [{pts:[{x:date,y}], color, dashed, dots, label, area}] */
function lineChart(series,{unit="",target=null,targetLabel="objectif",invert=false,empty="Pas encore de données.",h=240,dec=1}={}){
  series=series.filter(s=>s.pts&&s.pts.length);
  if(!series.length)return `<div class="empty">${esc(empty)}</div>`;
  const W=chartW(),H=Math.round(h*W/640*0.75+h*0.25),L=44,R=14,T=18,B=28;
  const all=series.flatMap(s=>s.pts);
  const xs=all.map(p=>parse(p.x).getTime()),ys=all.map(p=>p.y);
  let yMin=Math.min(...ys,target??Infinity),yMax=Math.max(...ys,target??-Infinity);
  const ticks=niceTicks(yMin,yMax);yMin=ticks[0];yMax=ticks[ticks.length-1];
  let xMin=Math.min(...xs),xMax=Math.max(...xs);if(xMin===xMax){xMin-=3*864e5;xMax+=3*864e5;}
  const X=v=>L+(v-xMin)/(xMax-xMin)*(W-L-R);
  const Y=v=>{const f=(v-yMin)/(yMax-yMin);return T+(invert?f:1-f)*(H-T-B);};
  const main=series[0],mx=main.pts.map(p=>parse(p.x).getTime());
  const out=[];
  ticks.forEach(t=>out.push(`<line class="grid" x1="${L}" x2="${W-R}" y1="${Y(t)}" y2="${Y(t)}"/><text class="axis" x="${L-8}" y="${Y(t)+4}" text-anchor="end">${fmt(t,dec)}</text>`));
  if(target!=null)out.push(`<line x1="${L}" x2="${W-R}" y1="${Y(target)}" y2="${Y(target)}" stroke="var(--ok)" stroke-dasharray="5 5" stroke-width="1.5"/><text class="axis" x="${W-R}" y="${Y(target)-6}" text-anchor="end" style="fill:var(--ok)">${esc(targetLabel)} ${fmt(target,dec)} ${esc(unit)}</text>`);
  series.forEach((s,si)=>{
    const px=s.pts.map(p=>[X(parse(p.x).getTime()),Y(p.y)]);
    const d=px.map((p,i)=>`${i?"L":"M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join("");
    if(s.area&&px.length>1)out.push(`<path d="${d}L${px[px.length-1][0].toFixed(1)},${H-B}L${px[0][0].toFixed(1)},${H-B}Z" fill="${s.color}" opacity=".10"/>`);
    out.push(`<path d="${d}" fill="none" stroke="${s.color}" stroke-width="${s.width||2.5}" ${s.dashed?'stroke-dasharray="6 5"':""} stroke-linejoin="round" stroke-linecap="round" ${s.opacity?`opacity="${s.opacity}"`:""}/>`);
    if(s.dots!==false)s.pts.forEach((p,i)=>{const last=i===s.pts.length-1&&si===0;out.push(`<circle cx="${px[i][0]}" cy="${px[i][1]}" r="${last?5:3}" fill="${last?s.color:"var(--surface)"}" stroke="${s.color}" stroke-width="2"><title>${fr(p.x)} : ${fmt(p.y,dec)} ${unit}</title></circle>`);});
  });
  const last=main.pts[main.pts.length-1];
  out.push(`<text class="axis" x="${X(parse(last.x).getTime())}" y="${Y(last.y)-10}" text-anchor="end" style="fill:var(--ink);font-weight:500">${fmt(last.y,dec)} ${esc(unit)}</text>`);
  const xl=[...new Set([0,Math.floor((main.pts.length-1)/2),main.pts.length-1])];
  xl.forEach(i=>out.push(`<text class="axis" x="${X(mx[i])}" y="${H-8}" text-anchor="${i===0?"start":i===main.pts.length-1?"end":"middle"}">${fr(main.pts[i].x)}</text>`));
  const legend=series.filter(s=>s.label).map(s=>`<span><i style="background:${s.color}${s.dashed?";opacity:.6":""}"></i>${esc(s.label)}</span>`).join("");
  return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Graphique">${out.join("")}</svg>${legend&&series.length>1?`<div class="clegend">${legend}</div>`:""}</div>`;
}
function barChart(vals,{labels,cur,colorFn,ref=null,refLabel=""}){
  const W=chartW(),H=Math.round(220*W/640*0.7+66),L=40,R=8,T=16,B=26,n=vals.length;
  const mx=Math.max(...vals,ref||0,1);const ticks=niceTicks(0,mx);const yMax=ticks[ticks.length-1];
  const bw=(W-L-R)/n,Y=v=>T+(1-v/yMax)*(H-T-B);
  return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Barres">
   ${ticks.map(t=>`<line class="grid" x1="${L}" x2="${W-R}" y1="${Y(t)}" y2="${Y(t)}"/><text class="axis" x="${L-8}" y="${Y(t)+4}" text-anchor="end">${fmt(t,0)}</text>`).join("")}
   ${vals.map((v,i)=>`<rect x="${L+i*bw+bw*.18}" y="${Y(v)}" width="${bw*.64}" height="${Math.max(0,H-B-Y(v))}" rx="3" fill="${colorFn(i)}" opacity="${i===cur?1:.72}"><title>${labels[i]} : ${fmt(v,0)}</title></rect>${v>0&&n<=16?`<text class="axis" x="${L+i*bw+bw/2}" y="${Y(v)-5}" text-anchor="middle">${fmt(v,0)}</text>`:""}<text class="axis" x="${L+i*bw+bw/2}" y="${H-8}" text-anchor="middle" style="${i===cur?"fill:var(--ink);font-weight:600":""}">${labels[i]}</text>`).join("")}
   ${ref?`<line x1="${L}" x2="${W-R}" y1="${Y(ref)}" y2="${Y(ref)}" stroke="var(--ink-2)" stroke-dasharray="4 4"/><text class="axis" x="${W-R}" y="${Y(ref)-5}" text-anchor="end">${esc(refLabel)}</text>`:""}
  </svg></div>`;
}
function movingAvg(pts,days){
  return pts.map(p=>{const from=addDays(p.x,-(days-1));const w=pts.filter(q=>q.x>=from&&q.x<=p.x);return {x:p.x,y:avg(w.map(q=>q.y))};});
}
function linReg(pts){ // renvoie pente (par jour) et ordonnée
  if(pts.length<2)return null;const x0=parse(pts[0].x).getTime();
  const X=pts.map(p=>(parse(p.x).getTime()-x0)/864e5),Y=pts.map(p=>p.y),mx=avg(X),my=avg(Y);
  const den=X.reduce((a,x)=>a+(x-mx)**2,0);if(!den)return null;
  const slope=X.reduce((a,x,i)=>a+(x-mx)*(Y[i]-my),0)/den;return {slope,icpt:my-slope*mx,x0};
}
