/* Programme Padel — schémas dessinés (silhouettes, vues de dessus, terrain, intervalles) */
"use strict";
const GY=150, FR=190/176;
const rad=a=>a*Math.PI/180, D=a=>[Math.sin(rad(a)),Math.cos(rad(a))];
const add=(a,v,l)=>[a[0]+v[0]*l,a[1]+v[1]*l];
function P(o){return Object.assign({t:0,ln:[0,0],lf:[0,0],an:[0,0],af:[0,0],fn:90,ff:90,view:"side"},o);}
function solve(p){
  const J={},td=[Math.sin(rad(p.t)),-Math.cos(rad(p.t))],front=p.view==="front";
  J.hip=[0,0];J.neck=add(J.hip,td,46);
  const ha=p.t+(p.hd||0);J.head=add(J.neck,[Math.sin(rad(ha)),-Math.cos(rad(ha))],12);
  const perp=[Math.cos(rad(p.t)),Math.sin(rad(p.t))],sh=add(J.hip,td,41);
  J.shN=front?add(sh,perp,-11):sh;J.shF=front?add(sh,perp,11):sh;
  J.hipN=front?add(J.hip,perp,-7):J.hip;J.hipF=front?add(J.hip,perp,7):J.hip;
  const leg=(h,ang,f,s)=>{J["k"+s]=add(h,D(ang[0]),36);J["a"+s]=add(J["k"+s],D(ang[1]),36);J["t"+s]=front?[J["a"+s][0]+(s==="N"?-7:7),J["a"+s][1]]:add(J["a"+s],D(f),10);};
  leg(J.hipN,p.ln,p.fn,"N");leg(J.hipF,p.lf,p.ff,"F");
  const arm=(o,ang,sc,s,hx)=>{sc=sc||[1,1];J["e"+s]=add(o,D(ang[0]),26*sc[0]);J["h"+s]=add(J["e"+s],D(ang[1]),24*sc[1]);if(hx!=null)J["x"+s]=add(J["h"+s],D(hx),9);};
  arm(J.shN,p.an,p.anS,"N",p.hn);arm(J.shF,p.af,p.afS,"F",p.hf);
  let my=-1e9;for(const k in J){const y=k==="head"?J[k][1]+9:J[k][1];if(y>my)my=y;}
  const dy=GY-(p.base||0)-(p.air||0)-my;
  for(const k in J)J[k]=[J[k][0],J[k][1]+dy];
  return J;
}
const f1=n=>Math.round(n*10)/10;
const pl=pts=>pts.map(p=>f1(p[0])+","+f1(p[1])).join(" ");
function arrowSvg(a,b,c){
  // straight (a→b) or quadratic (a→c→b)
  const end=b,from=c||a,ang=Math.atan2(end[1]-from[1],end[0]-from[0]),L=8;
  const h1=[end[0]-L*Math.cos(ang-0.45),end[1]-L*Math.sin(ang-0.45)],h2=[end[0]-L*Math.cos(ang+0.45),end[1]-L*Math.sin(ang+0.45)];
  const d=c?`M${f1(a[0])},${f1(a[1])} Q${f1(c[0])},${f1(c[1])} ${f1(b[0])},${f1(b[1])}`:`M${f1(a[0])},${f1(a[1])} L${f1(b[0])},${f1(b[1])}`;
  return `<path d="${d}" fill="none" stroke="var(--arrow)" stroke-width="2.4" stroke-linecap="round"/><polygon points="${pl([end,h1,h2])}" fill="var(--arrow)"/>`;
}
function fitBox(pts,minW,groundY){
  let x0=Math.min(...pts.map(p=>p[0])),x1=Math.max(...pts.map(p=>p[0])),y0=Math.min(...pts.map(p=>p[1])),y1=groundY!=null?groundY+12:Math.max(...pts.map(p=>p[1]));
  x0-=14;x1+=14;y0-=12;if(groundY==null)y1+=12;
  let w=x1-x0,h=y1-y0;
  if(w<minW){const c=(x0+x1)/2;w=minW;x0=c-w/2;}
  if(w/h<FR){const nw=h*FR;x0-=(nw-w)/2;w=nw;}else{const nh=w/FR;if(groundY!=null)y0-=nh-h;else y0-=(nh-h)/2;h=nh;}
  return [x0,y0,w,h];
}
function drawPose(fr){
  const p=fr.p,J=solve(p),front=p.view==="front";
  const pts=Object.values(J).slice(),back=[],fore=[],ar=[];
  const eq="var(--equip)";
  const pt=k=>typeof k==="string"?J[k]:k;
  (fr.pr||[]).forEach(o=>{
    if(o.t==="db"){[].concat(o.at).forEach(k=>{const[x,y]=J[k];fore.push(`<g><line x1="${f1(x-7)}" y1="${f1(y)}" x2="${f1(x+7)}" y2="${f1(y)}" stroke="${eq}" stroke-width="3"/><rect x="${f1(x-11)}" y="${f1(y-6)}" width="5" height="12" rx="1.5" fill="${eq}"/><rect x="${f1(x+6)}" y="${f1(y-6)}" width="5" height="12" rx="1.5" fill="${eq}"/></g>`);});}
    if(o.t==="kb"){const a=J.hN,b=J.hF,x=(a[0]+b[0])/2+2,y=(a[1]+b[1])/2+6;fore.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="8" fill="${eq}"/><path d="M${f1(x-5)},${f1(y-6)} Q${f1(x)},${f1(y-15)} ${f1(x+5)},${f1(y-6)}" fill="none" stroke="${eq}" stroke-width="3"/>`);pts.push([x,y+8]);}
    if(o.t==="plate"){const[x,y]=add(J[o.at],[o.dx||0,o.dy||0],1);back.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${o.r||14}" fill="var(--equip-soft)" stroke="${eq}" stroke-width="3"/><circle cx="${f1(x)}" cy="${f1(y)}" r="2.5" fill="${eq}"/>`);pts.push([x-15,y-15],[x+15,y+15]);}
    if(o.t==="block"){let x,y,w;if(o.from){const a=J[o.from],b=J[o.to];x=Math.min(a[0],b[0])-(o.pad||6);w=Math.abs(a[0]-b[0])+2*(o.pad||6);y=Math.max(a[1],b[1])+(o.dy||5);}else{const a=J[o.at];x=a[0]+(o.dx||0);w=o.w||30;y=a[1]+(o.dy||0);}
      back.push(`<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(Math.max(2,GY-y))}" rx="2" fill="var(--equip-soft)" stroke="${eq}" stroke-width="2"/>`);pts.push([x,y],[x+w,GY]);}
    if(o.t==="box"){const a=J[o.at],x=a[0]+(o.dx||0),w=o.w||36,y=GY-o.h;back.push(`<rect x="${f1(x)}" y="${f1(y)}" width="${w}" height="${o.h}" rx="2" fill="var(--equip-soft)" stroke="${eq}" stroke-width="2"/>`);pts.push([x,y],[x+w,GY]);}
    if(o.t==="band"){const a=pt(o.from),b=[a[0]+o.d[0],a[1]+o.d[1]];back.push(`<line x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}" stroke="var(--band)" stroke-width="2.5" stroke-dasharray="1 0"/><rect x="${f1(b[0]-3)}" y="${f1(b[1]-8)}" width="6" height="16" fill="var(--fig-2)"/>`);pts.push(b);}
    if(o.t==="line"){const a=J[o.a],b=J[o.b];fore.push(`<line x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}" stroke="${o.c||"var(--band)"}" stroke-width="${o.w||2.5}"/>`);}
    if(o.t==="ball"){const a=J[o.at];let x=a[0]+(o.dx||0),y=a[1]+(o.dy||0);if(o.ground)y=GY-9;fore.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="9" fill="var(--ball)" stroke="var(--ball-ink)" stroke-width="1.5"/>`);pts.push([x-9,y-9],[x+9,y+9]);}
    if(o.t==="hbar"){const a=J[o.at],y=a[1]+(o.dy||-2);back.push(`<line x1="${f1(a[0]-40)}" y1="${f1(y)}" x2="${f1(a[0]+40)}" y2="${f1(y)}" stroke="${eq}" stroke-width="4" stroke-linecap="round"/>`);pts.push([a[0]-40,y-6],[a[0]+40,y]);}
    if(o.t==="wall"){const a=J[o.at],x=a[0]+o.dx;back.push(`<rect x="${f1(x)}" y="${GY-120}" width="7" height="120" fill="var(--equip-soft)" stroke="${eq}" stroke-width="2"/>`);pts.push([x+8,GY-120]);}
    if(o.t==="rope"){const c=[(J.hip[0]+J.neck[0])/2+3,(J.head[1]+J.tN[1])/2];const ry=(J.tN[1]-J.head[1])/2+16;back.push(`<ellipse cx="${f1(c[0])}" cy="${f1(c[1]+2)}" rx="30" ry="${f1(ry)}" fill="none" stroke="var(--band)" stroke-width="2" stroke-dasharray="5 4"/>`);pts.push([c[0]-32,c[1]-ry],[c[0]+32,c[1]+ry]);}
    if(o.t==="roller"){const a=J[o.a],b=J[o.b],x=(a[0]+b[0])/2,y=(a[1]+b[1])/2+10;back.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="9.5" fill="var(--equip-soft)" stroke="${eq}" stroke-width="2.5"/>`);}
    if(o.t==="bike"){const a=J.aN,b=J.aF,c=[(a[0]+b[0])/2,(a[1]+b[1])/2],s=[J.hip[0]-2,J.hip[1]+7],h=[J.hN[0]+2,J.hN[1]+3];
      back.push(`<g stroke="var(--fig-2)" stroke-width="3.5" stroke-linecap="round" fill="none"><line x1="${f1(s[0]-9)}" y1="${f1(s[1])}" x2="${f1(s[0]+9)}" y2="${f1(s[1])}"/><line x1="${f1(s[0])}" y1="${f1(s[1])}" x2="${f1(c[0])}" y2="${f1(c[1])}"/><line x1="${f1(c[0])}" y1="${f1(c[1])}" x2="${f1(h[0]-4)}" y2="${f1(h[1]+6)}"/><line x1="${f1(h[0]-10)}" y1="${f1(h[1])}" x2="${f1(h[0]+2)}" y2="${f1(h[1])}"/><circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="13"/><line x1="${f1(c[0]-26)}" y1="${GY}" x2="${f1(c[0]+34)}" y2="${GY}"/><line x1="${f1(c[0])}" y1="${f1(c[1]+13)}" x2="${f1(c[0])}" y2="${GY}"/></g>`);pts.push([c[0]-28,GY],[c[0]+36,GY]);}
  });
  (fr.ar||[]).forEach(o=>{const b0=J[o.at]||[0,0],a=add(b0,o.o||[0,0],1),b=add(a,o.d,1),c=o.c?add(a,o.c,1):null;ar.push(arrowSvg(a,b,c));pts.push(a,b);});
  const seg=(k,c,w)=>`<polyline points="${pl(k.map(x=>J[x]))}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const farC=front?"var(--fig)":"var(--fig-2)";
  const farLeg=seg(["hipF","kF","aF","tF"],farC,5.5),farArm=seg(["shF","eF","hF"].concat(J.xF?["xF"]:[]),farC,5);
  const nearLeg=seg(["hipN","kN","aN","tN"],"var(--fig)",6),nearArm=seg(["shN","eN","hN"].concat(J.xN?["xN"]:[]),"var(--fig)",5.5);
  const td=[J.neck[0]-J.hip[0],J.neck[1]-J.hip[1]],mid=[(J.hip[0]+J.neck[0])/2,(J.hip[1]+J.neck[1])/2],len=Math.hypot(...td),pp=[td[1]/len,-td[0]/len];
  const cp=add(mid,pp,-(p.arch||0)*1.8);
  let trunk=`<path d="M${f1(J.hip[0])},${f1(J.hip[1])} Q${f1(cp[0])},${f1(cp[1])} ${f1(J.neck[0])},${f1(J.neck[1])}" fill="none" stroke="var(--fig)" stroke-width="7" stroke-linecap="round"/>`;
  if(front)trunk+=seg(["shN","shF"],"var(--fig)",6)+seg(["hipN","hipF"],"var(--fig)",6);
  const head=`<circle cx="${f1(J.head[0])}" cy="${f1(J.head[1])}" r="8.5" fill="var(--fig)"/>`;
  pts.push([J.head[0]-9,J.head[1]-9]);
  const [x0,y0,w,h]=fitBox(pts,176,GY);
  return `<svg viewBox="${f1(x0)} ${f1(y0)} ${f1(w)} ${f1(h)}" role="img" aria-label="${esc(fr.l||"schéma")}"><line x1="${f1(x0)}" y1="${GY+1.5}" x2="${f1(x0+w)}" y2="${GY+1.5}" stroke="var(--ground)" stroke-width="3"/>${back.join("")}${front?"":farLeg+farArm}${trunk}${head}${front?farLeg+farArm:""}${nearLeg}${nearArm}${fore.join("")}${ar.join("")}</svg>`;
}
function drawTop(fr){
  const T=fr.top,th=rad(T.rot||0),R=q=>[q[0]*Math.cos(th)-q[1]*Math.sin(th),q[0]*Math.sin(th)+q[1]*Math.cos(th)];
  const shL=R([-18,0]),shR=R([18,0]),out=[],pts=[shL,shR,[0,-14]],eq="var(--equip)";
  if(T.wall!=null){out.push(`<rect x="${T.wall}" y="-60" width="7" height="120" fill="var(--equip-soft)" stroke="${eq}" stroke-width="2"/>`);pts.push([T.wall+8,-60],[T.wall,60]);}
  if(T.body){out.push(`<g stroke="var(--fig)" stroke-width="6" stroke-linecap="round" fill="none"><line x1="0" y1="0" x2="0" y2="46"/><line x1="-8" y1="46" x2="8" y2="46"/><polyline points="-7,46 -9,100"/><polyline points="7,46 9,100"/></g>`);pts.push([0,102]);}
  (T.legs||[]).forEach(l=>{out.push(`<polyline points="${pl(l)}" fill="none" stroke="var(--fig)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`);pts.push(...l);});
  if(T.legs)out.push(`<line x1="-9" y1="8" x2="9" y2="8" stroke="var(--fig)" stroke-width="6" stroke-linecap="round"/>`);
  let hands=[];
  if(T.to){hands=[T.to];[shL,shR].forEach(s=>out.push(`<line x1="${f1(s[0])}" y1="${f1(s[1])}" x2="${T.to[0]}" y2="${T.to[1]}" stroke="var(--fig)" stroke-width="5.5" stroke-linecap="round"/>`));pts.push(T.to);}
  (T.arms||[]).forEach(a=>{const s=a.s>0?shR:shL,ptsA=[s,...a.pts];hands.push(a.pts[a.pts.length-1]);out.push(`<polyline points="${pl(ptsA)}" fill="none" stroke="var(--fig)" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>`);pts.push(...a.pts);});
  if(T.band){const h=hands[0];out.unshift(`<line x1="${h[0]}" y1="${h[1]}" x2="${T.band[0]}" y2="${T.band[1]}" stroke="var(--band)" stroke-width="2.5"/><rect x="${T.band[0]-4}" y="${T.band[1]-8}" width="8" height="16" fill="var(--fig-2)"/>`);pts.push(T.band);}
  if(T.bar){const h=hands[0];out.unshift(`<line x1="${h[0]}" y1="${h[1]}" x2="${T.bar[0]}" y2="${T.bar[1]}" stroke="${eq}" stroke-width="5" stroke-linecap="round"/><circle cx="${T.bar[0]}" cy="${T.bar[1]}" r="5" fill="var(--fig-2)"/>`);pts.push(T.bar);}
  out.push(`<line x1="${f1(shL[0])}" y1="${f1(shL[1])}" x2="${f1(shR[0])}" y2="${f1(shR[1])}" stroke="var(--fig)" stroke-width="8" stroke-linecap="round"/>`);
  const hc=R([0,T.body?-11:-3]);out.push(`<circle cx="${f1(hc[0])}" cy="${f1(hc[1])}" r="9.5" fill="var(--fig)"/>`);
  const nose=R([0,T.body?-22:-14]);if(!T.body)out.push(`<circle cx="${f1(nose[0])}" cy="${f1(nose[1])}" r="2.5" fill="var(--fig)"/>`);
  if(T.ball){out.push(`<circle cx="${T.ball[0]}" cy="${T.ball[1]}" r="8" fill="var(--ball)" stroke="var(--ball-ink)" stroke-width="1.5"/>`);pts.push(T.ball);}
  (T.ar||[]).forEach(a=>{out.push(arrowSvg(a[0],a[1],a[2]));pts.push(a[0],a[1]);});
  (T.txt||[]).forEach(t=>{out.push(`<text x="${t[0]}" y="${t[1]}" class="ftxt" text-anchor="middle">${esc(t[2])}</text>`);pts.push([t[0]-30,t[1]-8],[t[0]+30,t[1]]);});
  const [x0,y0,w,h]=fitBox(pts,176,null);
  return `<svg viewBox="${f1(x0)} ${f1(y0)} ${f1(w)} ${f1(h)}" role="img" aria-label="${esc(fr.l||"vue de dessus")}"><text x="${f1(x0+6)}" y="${f1(y0+13)}" class="ftxt">vue de dessus</text>${out.join("")}</svg>`;
}
function mirrorCourt(C){
  const mx=p=>[10-p[0],p[1]];
  return {...C,player:C.player&&mx(C.player),cones:(C.cones||[]).map(mx),segs:(C.segs||[]).map(s=>({...s,a:mx(s.a),b:mx(s.b)})),marks:(C.marks||[]).map(k=>({...k,p:mx(k.p),dx:k.anc==="middle"?k.dx:-(k.dx||8),anc:k.anc==="middle"?"middle":"end"}))};
}
function drawCourt(fr){
  let C=fr.court;if(C.side&&typeof isRight==="function"&&isRight())C=mirrorCourt(C);
  const m=15,X=v=>f1(v*m),o=[];
  o.push(`<rect x="0" y="0" width="${10*m}" height="${10*m}" fill="var(--court-floor)"/>`);
  if(!C.plain){
    o.push(`<g stroke="var(--court-line)" stroke-width="1.6" fill="none"><line x1="0" y1="${X(6.95)}" x2="${X(10)}" y2="${X(6.95)}"/><line x1="${X(5)}" y1="0" x2="${X(5)}" y2="${X(6.95)}"/></g>`);
    o.push(`<line x1="-3" y1="0" x2="${X(10)+3}" y2="0" stroke="var(--fig)" stroke-width="3" stroke-dasharray="4 3"/><text x="${X(5)}" y="-7" class="ftxt" text-anchor="middle">FILET</text>`);
    o.push(`<g stroke="var(--glass)" stroke-width="5"><line x1="0" y1="${X(10)}" x2="${X(10)}" y2="${X(10)}"/><line x1="0" y1="${X(6)}" x2="0" y2="${X(10)}"/><line x1="${X(10)}" y1="${X(6)}" x2="${X(10)}" y2="${X(10)}"/></g><g stroke="var(--fig-2)" stroke-width="1.5" stroke-dasharray="2 3"><line x1="0" y1="0" x2="0" y2="${X(6)}"/><line x1="${X(10)}" y1="0" x2="${X(10)}" y2="${X(6)}"/></g>`);
    o.push(`<text x="${X(5)}" y="${X(10)+16}" class="ftxt" text-anchor="middle">VITRE DU FOND</text>`);
  } else o.push(`<text x="${X(5)}" y="${X(10)+16}" class="ftxt" text-anchor="middle">${esc(C.lab||"")}</text>`);
  (C.cones||[]).forEach((c,i)=>{const x=c[0]*m,y=c[1]*m;o.push(`<polygon points="${pl([[x,y-7],[x-6,y+5],[x+6,y+5]])}" fill="var(--arrow)"/>`);});
  if(C.spokes)(C.cones||[]).forEach((c,i)=>{const a=[C.player[0]*m,C.player[1]*m],b=[c[0]*m,c[1]*m],d=Math.hypot(b[0]-a[0],b[1]-a[1]),u=[(b[0]-a[0])/d,(b[1]-a[1])/d];o.push(arrowSvg(add(a,u,12),add(b,u,-10)));const mm=add(a,u,d*0.55);o.push(`<circle cx="${f1(mm[0]+u[1]*9)}" cy="${f1(mm[1]-u[0]*9)}" r="7" fill="var(--surface)" stroke="var(--arrow)" stroke-width="1.5"/><text x="${f1(mm[0]+u[1]*9)}" y="${f1(mm[1]-u[0]*9+3.5)}" class="fnum" text-anchor="middle">${i+1}</text>`);});
  (C.segs||[]).forEach(s=>{const a=[s.a[0]*m,s.a[1]*m],b=[s.b[0]*m,s.b[1]*m],d=Math.hypot(b[0]-a[0],b[1]-a[1]),u=[(b[0]-a[0])/d,(b[1]-a[1])/d];o.push(arrowSvg(add(a,u,9),add(b,u,-9)));const mm=add(a,u,d/2);o.push(`<circle cx="${f1(mm[0]-u[1]*10)}" cy="${f1(mm[1]+u[0]*10)}" r="7" fill="var(--surface)" stroke="var(--arrow)" stroke-width="1.5"/><text x="${f1(mm[0]-u[1]*10)}" y="${f1(mm[1]+u[0]*10+3.5)}" class="fnum" text-anchor="middle">${s.n}</text>`);});
  (C.marks||[]).forEach(k=>{o.push(`<circle cx="${X(k.p[0])}" cy="${X(k.p[1])}" r="4" fill="var(--fig)"/><text x="${X(k.p[0])+(k.dx||8)}" y="${X(k.p[1])+(k.dy||4)}" class="ftxt" text-anchor="${k.anc||"start"}">${esc(k.t)}</text>`);});
  if(C.player)o.push(`<circle cx="${X(C.player[0])}" cy="${X(C.player[1])}" r="7" fill="var(--fig)" stroke="var(--surface)" stroke-width="2"/>`);
  return `<svg viewBox="-16 -20 ${10*m+32} ${10*m+42}" role="img" aria-label="${esc(fr.l||"terrain")}">${o.join("")}</svg>`;
}
function drawTl(fr){
  const T=fr.tl,n=Math.min(T.n,8),tot=n*(T.w+T.r),W=300,sc=(W-10)/tot,o=[];let x=0;
  for(let i=0;i<n;i++){const ww=T.w*sc,rw=T.r*sc;o.push(`<rect x="${f1(x)}" y="22" width="${f1(ww-1.5)}" height="46" rx="3" fill="var(--arrow)"/>`);if(i===0)o.push(`<text x="${f1(ww/2)}" y="15" class="ftxt" text-anchor="middle" style="fill:var(--arrow)">${T.w} s</text>`);x+=ww;o.push(`<rect x="${f1(x)}" y="50" width="${f1(rw-1.5)}" height="18" rx="3" fill="var(--rest)"/>`);if(i===0)o.push(`<text x="${f1(x+rw/2)}" y="82" class="ftxt" text-anchor="middle">${T.r} s</text>`);x+=rw;}
  o.push(`<text x="0" y="100" class="ftxt"><tspan style="fill:var(--arrow)">■</tspan> ${esc(T.lab1||"effort intense")}   ■ récupération</text><text x="0" y="116" class="ftxt">× ${T.n} répétitions, puis ${esc(T.sr)} de repos · ${T.sets} séries</text>`);
  return `<svg viewBox="-8 0 ${W+16} 124" role="img" aria-label="${esc(fr.l||"intervalles")}">${o.join("")}</svg>`;
}
function drawFrame(fr){return fr.court?drawCourt(fr):fr.top?drawTop(fr):fr.tl?drawTl(fr):drawPose(fr);}

/* ---------- Animation : la silhouette passe de la position de départ à l'arrivée ---------- */
function lerpPose(a,b,t){
  const o={};
  for(const k of new Set([...Object.keys(a),...Object.keys(b)])){
    const x=a[k],y=b[k];
    if(Array.isArray(x)&&Array.isArray(y))o[k]=x.map((v,i)=>v+(y[i]-v)*t);
    else if(typeof x==="number"||typeof y==="number")o[k]=(x||0)+((y||0)-(x||0))*t;
    else o[k]=t<.5?x:y;
  }
  return o;
}
const canAnimate=key=>{const f=EX[key]&&EX[key].fig;return !!(f&&f.length>=2&&f[0].p&&f[1].p&&f[0].p.view===f[1].p.view);};
const ANIMS=new Map();
function startAnim(host,key){
  stopAnim(host);
  const f=EX[key].fig,a=f[0].p,b=f[1].p,t0=performance.now(),period=2600;
  const tick=now=>{
    if(!host.isConnected){ANIMS.delete(host);return;}
    const ph=((now-t0)%period)/period,raw=ph<.5?ph*2:2-ph*2,t=raw<.5?2*raw*raw:1-Math.pow(-2*raw+2,2)/2;
    const pose=lerpPose(a,b,t),fr={p:pose,pr:t<.5?f[0].pr:f[1].pr,l:""};
    host.innerHTML=drawPose(fr);
    ANIMS.set(host,requestAnimationFrame(tick));
  };
  ANIMS.set(host,requestAnimationFrame(tick));
}
function stopAnim(host){const h=ANIMS.get(host);if(h)cancelAnimationFrame(h);ANIMS.delete(host);}

/* ---------- Fiche exercice ---------- */
function exName(k){return EX[k]?sideTxt(EX[k].n):(GEN[k]||k);}
function figHtml(key,opts={}){
  const e=EX[key];if(!e||!e.fig)return "";
  const wide=e.fig.some(f=>f.court||f.tl);
  const anim=canAnimate(key)&&!opts.noAnim;
  return `<div class="figwrap" data-figkey="${key}"><div class="figs ${wide?"wide":""}" style="--n:${e.fig.length}">${e.fig.map(f=>`<figure>${drawFrame(f)}${f.l?`<figcaption>${esc(sideTxt(f.l))}</figcaption>`:""}</figure>`).join("")}</div>
   ${anim?`<div class="figanim" hidden><figure><div class="anim-host"></div><figcaption>Mouvement en boucle</figcaption></figure></div><button class="chip-btn" type="button" data-anim="${key}">▶ Voir le mouvement</button>`:""}</div>`;
}
function videoUrl(key){const e=EX[key];const q=(e&&e.vq)||((e?e.n:key)+" exercice technique");return "https://www.youtube.com/results?search_query="+encodeURIComponent(q);}
function exDetail(key,opts={}){
  const e=EX[key];if(!e)return "";
  const S=x=>esc(sideTxt(x));
  return `<div class="exd">${opts.noFig?"":figHtml(key)}
   <p class="why"><b>Pour ton padel :</b> ${S(e.w)}</p>
   <div class="exd-cols">
    <div><h4>Exécution</h4><ol class="steps">${e.s.map(s=>`<li><span>${S(s)}</span></li>`).join("")}</ol></div>
    <div class="exd-side">
     ${e.k?`<div><h4>Points clés</h4><ul class="ok-list">${e.k.map(s=>`<li>${S(s)}</li>`).join("")}</ul></div>`:""}
     ${e.e?`<div><h4>Erreurs à éviter</h4><ul class="no-list">${e.e.map(s=>`<li>${S(s)}</li>`).join("")}</ul></div>`:""}
     ${e.ez||e.hd?`<div class="vars">${e.ez?`<div><span class="tag" style="color:var(--ok)">Plus facile</span> ${S(e.ez)}</div>`:""}${e.hd?`<div><span class="tag" style="color:var(--b3)">Plus dur</span> ${S(e.hd)}</div>`:""}</div>`:""}
    </div>
   </div>
   <div class="exd-foot">${e.m?`<div class="chips">${e.m.map(x=>`<span>${esc(x)}</span>`).join("")}</div>`:""}<a class="vlink" href="${videoUrl(key)}" target="_blank" rel="noopener">Voir des vidéos de démonstration ↗</a></div>
   ${opts.history!==false&&typeof exHistoryHtml==="function"?exHistoryHtml(key):""}
  </div>`;
}
