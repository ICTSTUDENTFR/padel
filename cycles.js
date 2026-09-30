/* Programme Padel — ta semaine (jours de padel / tournoi) et fin de cycle (bilan + cycle suivant) */
"use strict";

/* =====================================================================
   1. Planificateur de la semaine
   ===================================================================== */
function setWeekDay(w,d,val){const m=data.weeks["w"+w]||{week:w};const plan=m.plan?{...m.plan}:weekInput(w);
  if(val)plan[d]=val;else delete plan[d];
  data.weeks["w"+w]={...m,week:w,plan,confirmed:false};delete data.weeks["w"+w].tournoi;lsSave();}
function weekSummary(w){const inp=weekInput(w),parts=[];
  DAYS.forEach(([d,l])=>{if(inp[d])parts.push(`${l.slice(0,3)}. ${inp[d]==="tournoi"?"tournoi":inp[d]==="cours"?"cours":"partie"}`);});
  return parts.length?parts.join(" · "):"aucun padel ni tournoi";}
function weekPlannerHtml(w,{title,eyebrow,compact}={}){const inp=weekInput(w),tdy=todayIso(),ok=weekConfirmed(w);
  const L=weekLayout(w);
  return `<div class="wplan" data-wplan="${w}">
   ${title?`<div class="sess-head"><div><div class="eyebrow">${esc(eyebrow||"")}</div><h3>${esc(title)}</h3></div>${ok?`<span class="tag okc">Validée</span>`:""}</div>`:""}
   <p class="small muted">Indique tes jours de <b>cours</b>, de <b>partie</b> (match, entraînement libre) et de <b>tournoi</b> : les séances physiques se placent autour.</p>
   <div class="wp-grid">${DAYS.map(([d,l],i)=>{const dt=dateOf(w,i),past=dt<tdy,x=L[d]||{};
     return `<div class="wp-row ${dt===tdy?"today":""} ${past?"past":""}"><div class="wp-day"><b>${l.slice(0,3)}</b><span>${fr(dt)}</span></div>
      <div class="wp-opts" role="radiogroup" aria-label="${l}">${WP_TYPES.map(([v,lab])=>`<button type="button" class="wp-o wp-${v||"none"}" data-wp="${w}|${d}|${v}" aria-pressed="${(inp[d]||"")===v}">${lab}</button>`).join("")}</div>
      ${compact?"":`<div class="wp-res">${esc(planFor(w,d).title)}</div>`}</div>`;}).join("")}</div>
   <div class="actions">${ok?`<button class="btn ghost small" type="button" data-wpreset="${w}">Revenir aux jours habituels</button>`:`<button class="btn" type="button" data-wpok="${w}">Valider ma semaine</button><button class="linkbtn" type="button" data-wpreset="${w}">Jours habituels</button>`}</div>
  </div>`;}
/* Carte de la page Aujourd'hui : la semaine à renseigner */
function weekPlanTarget(){const ref=todayRef();if(!ref)return null;
  const last=launchedCycles()*12;
  if(!weekConfirmed(ref.w)&&!state.wpSkip)return {w:ref.w,label:"Ta semaine",eb:`Semaine ${ref.w} · du ${fr(dateOf(ref.w,0))} au ${fr(dateOf(ref.w,6))}`};
  const dk=DAY_KEYS.indexOf(ref.d);
  if(dk>=5&&ref.w<last&&!weekConfirmed(ref.w+1)&&!state.wpSkip)return {w:ref.w+1,label:"Prépare ta semaine prochaine",eb:`Semaine ${ref.w+1} · du ${fr(dateOf(ref.w+1,0))} au ${fr(dateOf(ref.w+1,6))}`};
  return null;}
function weekPlanCard(){if(READONLY)return "";const tg=weekPlanTarget();
  if(tg)return `<section class="card stack wp-card">${weekPlannerHtml(tg.w,{title:tg.label,eyebrow:tg.eb,compact:true})}<button class="linkbtn" type="button" data-wpskip="1">Plus tard</button></section>`;
  const ref=todayRef();if(!ref)return "";
  return `<section class="card wp-mini"><div class="sess-head"><div><div class="eyebrow">Ta semaine</div><p class="small" style="margin:4px 0 0">${esc(weekSummary(ref.w))}</p></div><button class="chip-btn" type="button" data-goto="week">Modifier</button></div></section>`;}
/* Cours de padel : suit la semaine renseignée */
function isLessonDate(ds){const w=weekOfDate(ds);if(w>=1)return weekInput(w)[dayKeyOf(ds)]==="cours";return dayKeyOf(ds)===lessonDay();}
function nextLessonDate(){const t=todayIso();for(let i=0;i<14;i++){const d=addDays(t,i);if(isLessonDate(d))return d;}for(let i=0;i<8;i++){const d=addDays(t,i);if(dayKeyOf(d)===lessonDay())return d;}return t;}
/* Un tournoi ajouté dans « Tournois à venir » se reporte dans la semaine déjà renseignée */
function syncEventToWeeks(e){if(!e||!e.date)return;const end=e.end&&e.end>e.date?e.end:e.date;
  for(let d=e.date;d<=end;d=addDays(d,1)){const w=weekOfDate(d);if(w<1)continue;const m=data.weeks["w"+w];if(m&&m.plan){m.plan[dayKeyOf(d)]="tournoi";}}}

document.addEventListener("click",e=>{const t=e.target.closest("button");if(!t)return;const D=t.dataset;
  if(D.wp){const [w,d,v]=D.wp.split("|");setWeekDay(+w,d,v);renderApp({force:true});return;}
  if(D.wpok){const w=+D.wpok,m=data.weeks["w"+w]||{week:w};data.weeks["w"+w]={...m,week:w,plan:m.plan||weekInput(w),confirmed:true};lsSave();renderApp({force:true});toast("Semaine validée : tes séances sont placées");return;}
  if(D.wpreset){delete data.weeks["w"+D.wpreset];lsSave();renderApp({force:true});toast("Jours habituels rétablis");return;}
  if(D.wpskip){state.wpSkip=true;renderApp({force:true});return;}
});

/* =====================================================================
   2. Bilan de cycle
   ===================================================================== */
function inRange(ds,a,b){return ds&&ds>=a&&ds<=b;}
function cycleAnalysis(c){
  const a=cycleStart(c),b=cycleEnd(c),t=todayIso(),to=b<t?b:t,W0=(c-1)*12;
  const weeks=Array.from({length:12},(_,i)=>W0+i+1).filter(w=>dateOf(w,0)<=t);
  let done=0,planned=0,load=0,mob=0;const byBlock=[0,0,0].map(()=>({done:0,planned:0}));
  weeks.forEach(w=>{const st=weekStats(w);const bi=Math.floor((wcOf(w)-1)/4);
    let pl=st.planned;if(dateOf(w,6)>t){pl=DAY_KEYS.filter((d,i)=>dateOf(w,i)<=t&&PLANNED_KINDS.includes(planFor(w,d).kind)).length;}
    done+=st.done;planned+=pl;load+=st.load;mob+=st.mob;byBlock[bi].done+=st.done;byBlock[bi].planned+=pl;});
  const days=Math.max(1,daysBetween(a,to)+1);
  const adherence=planned?done/planned:0;
  // Tests : première et dernière mesure du cycle
  const rows=Object.values(data.tests).filter(r=>r&&inRange(r.date,a,b)).sort((x,y)=>x.date.localeCompare(y.date));
  const tests=TESTS.map(T=>{const v=rows.filter(r=>r[T.k]!=null);if(!v.length)return {...T,n:0};
    const f=+v[0][T.k],l=+v[v.length-1][T.k],d=l-f,pct=f?d/f*100:0,good=T.better==="up"?d>0:d<0;
    return {...T,n:v.length,first:f,last:l,delta:d,pct,verdict:v.length<2?"une seule mesure":Math.abs(pct)<2?"stable":good?"progrès":"recul"};});
  // Force : 1RM estimé début / meilleur
  const lifts=[...LOADED].map(k=>{const h=exHistory(k).filter(x=>inRange(x.date,a,b)&&x.e1);if(h.length<2)return null;
    const f=h[0].e1,best=Math.max(...h.map(x=>x.e1));return {k,name:exName(k),first:f,best,pct:(best-f)/f*100,big:BIG_LIFTS.has(k)};}).filter(Boolean).sort((x,y)=>(y.big-x.big)||(y.pct-x.pct)).slice(0,6);
  // Poids
  const ws=sortedWeights().filter(x=>inRange(x.date,addDays(a,-7),b));
  const wFirst=ws.length?+ws[0].kg:null,wLast=ws.length?+ws[ws.length-1].kg:null;
  // Forme du matin
  const cks=Object.entries(data.checkins).filter(([d])=>inRange(d,a,b)).map(([d,x])=>({d,s:checkinScore(x,d)})).filter(x=>x.s!=null).sort((x,y)=>x.d.localeCompare(y.d));
  const half=Math.floor(cks.length/2),ck1=avg(cks.slice(0,half).map(x=>x.s)),ck2=avg(cks.slice(half).map(x=>x.s)),ckAll=avg(cks.map(x=>x.s));
  // Douleurs
  const pz={};Object.values(data.pains).filter(p=>p&&inRange(p.date,a,b)).forEach(p=>{(pz[p.zone]=pz[p.zone]||[]).push(+p.level);});
  const pains=Object.entries(pz).map(([z,l])=>({zone:z,n:l.length,max:Math.max(...l)})).sort((x,y)=>y.n-x.n);
  // Tournois
  const trs=Object.values(data.tournois).filter(x=>x&&inRange(x.date,a,b));
  const mw=trs.reduce((s,x)=>s+(+x.victoires||0),0),mt=trs.reduce((s,x)=>s+(+x.matchs||0),0);
  const phys=avg(trs.map(x=>+x.physique).filter(Boolean));
  const endLow=trs.filter(x=>/dur|cram|lâch|fatig|cuit/i.test(String(x.fin||"")+" "+String(x.note||""))).length;
  const rk=Object.values(data.ranking).filter(x=>x&&x.rank&&inRange(x.date,addDays(a,-30),b)).sort((x,y)=>x.date.localeCompare(y.date));
  // ACWR élevé
  const spikes=weeks.filter(w=>{const r=acwr(w);return r&&r.ratio>1.5;}).length;
  return {c,a,b,weeks:weeks.length,done,planned,adherence,byBlock,load,mob,mobPct:mob/days,days,tests,lifts,wFirst,wLast,ck1,ck2,ckAll,ckN:cks.length,pains,trs:trs.length,mw,mt,phys,endLow,rkFirst:rk.length?+rk[0].rank:null,rkLast:rk.length?+rk[rk.length-1].rank:null,spikes};
}
/* Recommandations pour le cycle suivant */
function cycleReco(A){const R={focus:"equilibre",volume:"normal",why:[],rehab:[]},s=S_();
  const tv=k=>A.tests.find(t=>t.k===k)||{};
  let sc={force:0,explosivite:0,endurance:0};
  if(A.lifts.length){const bp=avg(A.lifts.filter(l=>l.big).map(l=>l.pct));if(bp!=null&&bp<5){sc.force+=2;R.why.push("La force a peu progressé sur les gros exercices ("+fmt(bp,0)+" %).");}}
  else if(A.done>=6){sc.force+=1;}
  ["saut","spider"].forEach(k=>{const t=tv(k);if(t.verdict==="recul"||t.verdict==="stable"){sc.explosivite+=2;R.why.push(`${t.name} : ${t.verdict}.`);}});
  ["sprint"].forEach(k=>{const t=tv(k);if(t.verdict==="recul"||t.verdict==="stable"){sc.endurance+=2;R.why.push(`${t.name} : ${t.verdict}, l'endurance d'efforts répétés est à travailler.`);}});
  if(A.endLow>=1){sc.endurance+=2;R.why.push("Tu as noté de la fatigue en fin de match lors de tes tournois.");}
  if(A.phys!=null&&A.phys<6){sc.endurance+=1;R.why.push("Forme physique moyenne en tournoi : "+fmt(A.phys,1)+"/10.");}
  if(+s.deficit>0&&A.wFirst!=null&&A.wLast!=null&&A.wLast>=A.wFirst-0.5){sc.endurance+=2;R.why.push("Le poids n'a presque pas bougé alors que tu vises une perte.");}
  const best=Object.entries(sc).sort((x,y)=>y[1]-x[1])[0];if(best[1]>=2)R.focus=best[0];
  if(A.adherence<0.6&&A.planned>=6){R.volume="allege";R.why.push(`Régularité de ${fmt(A.adherence*100,0)} % : un volume allégé t'aidera à tenir toutes les séances.`);}
  if(A.ckAll!=null&&A.ckAll<55){R.volume="allege";R.why.push("Forme du matin souvent basse ("+fmt(A.ckAll,0)+"/100) : on réduit le volume.");}
  if(A.spikes>=2)R.why.push("Plusieurs semaines avec un pic de charge : garde une progression plus régulière.");
  A.pains.filter(p=>p.n>=2||p.max>=5).forEach(p=>{const z=zoneToRehab(p.zone);if(z&&!R.rehab.includes(z))R.rehab.push(z);});
  if(R.rehab.length)R.why.push("Douleurs récurrentes : renforcement ciblé conseillé ("+R.rehab.map(z=>REHAB[z].name.toLowerCase()).join(", ")+").");
  if(!R.why.length)R.why.push(A.done?"Cycle régulier et sans signal d'alerte : on continue sur une progression équilibrée.":"Pas assez de données pour aller plus loin : on repart sur une progression équilibrée.");
  return R;}
const FOCUS_OPTS={equilibre:["Équilibré","Même répartition, charges de départ plus élevées"],force:["Priorité force","Une série de plus sur les gros exercices"],explosivite:["Priorité explosivité","Sauts en plus au début de chaque séance"],endurance:["Priorité endurance","Plus de cardio et de finishers"]};
const VOL_OPTS={normal:["Volume normal",""],allege:["Volume allégé","Séances raccourcies (≈ −20 %)"]};
function nextCycleStarts(c){const v=cycleStart(c+1),t=todayIso();let first=v;while(first<t)first=addDays(first,7);
  return [[first,first===v?"Juste après le cycle "+c:"Dès que possible"],[addDays(first,7),"Après une semaine de repos"],[addDays(first,14),"Après deux semaines"]];}
function pctTxt(x,dec=0){return (x>0?"+":"")+fmt(x,dec);}
function cycleReportHtml(A){
  const pct=v=>fmt(v*100,0)+" %",tag=v=>v==="progrès"?"ok":v==="recul"?"bad":"mid";
  return `<section class="card stack"><div><div class="eyebrow">Du ${fr(A.a)} au ${fr(A.b)}</div><h2>Bilan du cycle ${A.c}</h2></div>
   <div class="kpis"><div class="kpi"><div class="v num">${A.done}/${A.planned}</div><div class="k">séances faites (${pct(A.adherence)})</div></div>
    <div class="kpi"><div class="v num">${fmt(A.mobPct*100,0)} %</div><div class="k">jours avec mobilité</div></div>
    <div class="kpi"><div class="v num">${A.wFirst!=null&&A.wLast!=null?pctTxt(A.wLast-A.wFirst,1)+" kg":"–"}</div><div class="k">poids${A.wLast!=null?" (" +fmt(A.wLast,1)+" kg)":""}</div></div>
    <div class="kpi"><div class="v num">${A.ckAll!=null?fmt(A.ckAll,0):"–"}</div><div class="k">forme du matin moyenne${A.ck1!=null&&A.ck2!=null?` (${fmt(A.ck1,0)} → ${fmt(A.ck2,0)})`:""}</div></div></div>
   <div><h3>Régularité par bloc</h3><div class="blk-bars">${A.byBlock.map((x,i)=>`<div class="blk"><span>${esc(BLOCKS[i].name)}</span><div class="bar"><i style="width:${x.planned?Math.round(x.done/x.planned*100):0}%;background:${BLOCKS[i].color}"></i></div><b class="num">${x.done}/${x.planned}</b></div>`).join("")}</div></div>
  </section>
  <section class="card stack"><h3>Tests physiques</h3>
   ${A.tests.some(t=>t.n)?`<ul class="cy-tests">${A.tests.filter(t=>t.n).map(t=>`<li><div><b>${esc(t.name)}</b><span class="muted small">${fmt(t.first,1)}${t.n>1?` → ${fmt(t.last,1)} ${esc(t.u)} (${pctTxt(t.delta,1)})`:" "+esc(t.u)}</span></div><span class="vtag ${tag(t.verdict)}">${esc(t.verdict)}</span></li>`).join("")}</ul>`:`<div class="empty">Aucun test saisi pendant ce cycle.</div>`}</section>
  ${A.lifts.length?`<section class="card stack"><h3>Force (1RM estimé)</h3><ul class="clean">${A.lifts.map(l=>`<li><b>${esc(l.name)}</b> : ${fmt(l.first,0)} → ${fmt(l.best,0)} kg <span class="muted">(${pctTxt(l.pct,0)} %)</span></li>`).join("")}</ul></section>`:""}
  <section class="card stack"><h3>Tournois et douleurs</h3><ul class="clean">
   <li><b>Tournois :</b> ${A.trs?`${A.trs} joué${A.trs>1?"s":""}, ${A.mw}/${A.mt} matchs gagnés${A.phys!=null?", forme physique moyenne "+fmt(A.phys,1)+"/10":""}`:"aucun enregistré"}</li>
   ${A.rkFirst!=null?`<li><b>Classement :</b> ${A.rkFirst}e → ${A.rkLast}e</li>`:""}
   <li><b>Douleurs :</b> ${A.pains.length?A.pains.slice(0,4).map(p=>`${esc(p.zone)} (${p.n} fois, max ${p.max}/10)`).join(", "):"aucune notée"}</li></ul></section>`;}
SUBS.cycle=()=>{
  const gap=cycleGap(),ref=todayRef(),c=gap?gap.c:ref?cycleOf(ref.w):1,A=cycleAnalysis(c),R=cycleReco(A),nx=cyclesCfg()[c+1];
  const ended=!!gap,lastWeek=ref&&wcOf(ref.w)===12,canLaunch=(ended||lastWeek||(ref&&wcOf(ref.w)>=11))&&!(nx&&nx.start);
  const f=state.cyForm||{focus:R.focus,volume:R.volume,start:nextCycleStarts(c)[0][0]};state.cyForm=f;
  const launch=canLaunch?`<section class="card stack cy-launch"><div><div class="eyebrow">Continuer</div><h2>Cycle ${c+1}</h2></div>
    <div class="alert small"><b>Ce que montre ton cycle ${c} :</b><ul class="clean">${R.why.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>
    <div><div class="lbl">Orientation du cycle ${c+1}</div><div class="cy-opts">${Object.entries(FOCUS_OPTS).map(([k,[l,d]])=>`<button type="button" data-cyf="focus|${k}" aria-pressed="${f.focus===k}"><b>${l}${R.focus===k?" · conseillé":""}</b><span>${d}</span></button>`).join("")}</div></div>
    <div><div class="lbl">Volume</div><div class="cy-opts two">${Object.entries(VOL_OPTS).map(([k,[l,d]])=>`<button type="button" data-cyf="volume|${k}" aria-pressed="${f.volume===k}"><b>${l}${R.volume===k?" · conseillé":""}</b>${d?`<span>${d}</span>`:""}</button>`).join("")}</div></div>
    <div><div class="lbl">Début</div><div class="cy-opts">${nextCycleStarts(c).map(([d,l])=>`<button type="button" data-cyf="start|${d}" aria-pressed="${f.start===d}"><b>${esc(frLong(d))}</b><span>${esc(l)}</span></button>`).join("")}</div></div>
    ${R.rehab.length?`<label class="check"><input type="checkbox" id="cy-rehab" checked> <span>Activer le renforcement ciblé : ${esc(R.rehab.map(z=>REHAB[z].name.toLowerCase()).join(", "))}</span></label>`:""}
    <button class="btn big" type="button" data-cylaunch="${c+1}">Lancer le cycle ${c+1}</button>
    <p class="muted small">Même structure en 3 blocs de 4 semaines. Tes charges repartent de celles de fin de cycle −5 %, puis progressent. Tu repasses les tests en semaine 1.</p></section>`
   :nx&&nx.start?`<section class="card"><div class="eyebrow">Cycle ${c+1}</div><h3>Programmé à partir du ${esc(frLong(nx.start))}</h3><p class="small">${esc(FOCUS_OPTS[nx.focus||"equilibre"][0])} · ${esc(VOL_OPTS[nx.volume||"normal"][0].toLowerCase())}</p><button class="linkbtn" type="button" data-cycancel="${c+1}">Annuler et revoir mes choix</button></section>`
   :`<section class="card soft"><p class="small">Bilan provisoire : le cycle ${c} se termine le ${esc(frLong(cycleEnd(c)))}. Le lancement du cycle ${c+1} te sera proposé à partir de la semaine ${(c-1)*12+11}.</p></section>`;
  return launch+cycleReportHtml(A);};
function launchCycle(n){const f=state.cyForm||{},s=S_();s.cycles=s.cycles||{};
  const A=cycleAnalysis(n-1);
  s.cycles[n]={start:f.start,focus:f.focus||"equilibre",volume:f.volume||"normal",at:todayIso(),from:{adherence:Math.round(A.adherence*100),done:A.done,planned:A.planned}};
  const rh=$("#cy-rehab");if(rh&&rh.checked)cycleReco(A).rehab.forEach(z=>{data.rehab[z]={active:true,since:todayIso()};});
  state.cyForm=null;state.week=null;lsSave();go("today");toast(`Cycle ${n} programmé à partir du ${fr(f.start)}`);}
document.addEventListener("click",e=>{const t=e.target.closest("button");if(!t)return;const D=t.dataset;
  if(D.cyf){const [k,v]=D.cyf.split("|");state.cyForm={...(state.cyForm||{}),[k]:v};renderApp({force:true});return;}
  if(D.cylaunch){launchCycle(+D.cylaunch);return;}
  if(D.cycancel){const s=S_();if(s.cycles){delete s.cycles[+D.cycancel];}state.week=null;lsSave();renderApp({force:true});toast("Lancement annulé");return;}
});
/* Carte Aujourd'hui en fin de cycle */
function cycleTodayCard(){if(READONLY)return "";const gap=cycleGap(),ref=todayRef();
  if(gap){const nx=gap.next;
    if(nx)return `<section class="card stack cy-card"><div class="eyebrow">Entre deux cycles</div><h2>Cycle ${gap.c+1} le ${esc(frLong(nx))}</h2><p class="small">Profite de ces jours pour récupérer : mobilité chaque jour, padel au plaisir, un peu de cardio facile.</p><div class="actions"><button class="btn ghost" type="button" data-goto="more:cycle">Revoir le bilan</button></div></section>`;
    const A=cycleAnalysis(gap.c);
    return `<section class="card stack cy-card"><div class="eyebrow">Bravo</div><h2>Cycle ${gap.c} terminé</h2>
     <div class="kpis"><div class="kpi"><div class="v num">${A.done}/${A.planned}</div><div class="k">séances faites</div></div><div class="kpi"><div class="v num">${A.tests.filter(t=>t.verdict==="progrès").length}/${A.tests.filter(t=>t.n>1).length||"–"}</div><div class="k">tests en progrès</div></div></div>
     <p class="small">L'app a analysé tes 12 semaines et te propose la suite.</p><button class="btn big" type="button" data-goto="more:cycle">Voir mon bilan et lancer le cycle ${gap.c+1}</button></section>`;}
  if(ref&&wcOf(ref.w)>=11&&!cyclesCfg()[cycleOf(ref.w)+1]){const c=cycleOf(ref.w);
    return `<section class="card cy-card"><div class="sess-head"><div><div class="eyebrow">${wcOf(ref.w)===12?"Dernière semaine":"Fin de cycle en vue"}</div><h3>Le cycle ${c} se termine le ${esc(fr(cycleEnd(c)))}</h3></div><button class="chip-btn" type="button" data-goto="more:cycle">Bilan</button></div><p class="small muted" style="margin-top:6px">Consulte ton bilan et prépare le cycle ${c+1}.</p></section>`;}
  return "";}
MORE.splice(1,0,["cycle","Bilan du cycle","Analyse et cycle suivant"]);
