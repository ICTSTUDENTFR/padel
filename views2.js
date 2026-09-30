/* Programme Padel — Exercices, Suivi, et pages de « Plus » */
"use strict";
const CATS=["Force","Explosivité","Gainage","Prévention","Déplacements","Cardio","Mobilité"];

/* ---------- Historique d'un exercice (dans les fiches) ---------- */
function exHistoryHtml(key){
  if(!LOADED.has(key))return "";
  const h=exHistory(key).filter(x=>x.top!=null);
  if(!h.length)return `<div class="hist"><h4>Mon historique</h4><p class="muted small">Pas encore de charge enregistrée sur cet exercice.</p></div>`;
  const b=bestOf(key);
  return `<div class="hist"><h4>Mon historique</h4>
   <div class="kpis sm"><div class="kpi"><div class="v num">${fmt(b.kg)} kg</div><div class="k">record de charge</div></div><div class="kpi"><div class="v num">${fmt(b.e1,0)} kg</div><div class="k">force max estimée (1RM)</div></div><div class="kpi"><div class="v num">${h.length}</div><div class="k">séances</div></div></div>
   ${lineChart([{pts:h.map(x=>({x:x.date,y:x.top})),color:"var(--court)",label:"Charge max",area:true},{pts:h.filter(x=>x.e1).map(x=>({x:x.date,y:Math.round(x.e1)})),color:"var(--b3)",dashed:true,label:"1RM estimé",dots:false}],{unit:"kg",h:200})}
  </div>`;
}

/* ---------- Bibliothèque ---------- */
function renderLib(){
  const q=(state.q||"").toLowerCase();
  const keys=Object.keys(EX).filter(k=>(!state.cat||EX[k].c===state.cat)&&(!q||(exName(k)+" "+(EX[k].m||[]).join(" ")).toLowerCase().includes(q)));
  return `<section class="card" style="display:flex;flex-direction:column;gap:12px">
   <input type="search" id="libq" placeholder="Rechercher un exercice ou un muscle" value="${esc(state.q||"")}" aria-label="Rechercher">
   <div class="filters" role="group" aria-label="Catégorie"><button data-cat="" aria-pressed="${!state.cat}">Tout</button>${CATS.map(c=>`<button data-cat="${c}" aria-pressed="${state.cat===c}">${c}</button>`).join("")}</div>
   <p class="muted small">Figure foncée = côté visible, figure claire = côté opposé. Les flèches orange montrent le mouvement. « Voir le mouvement » anime la silhouette.</p>
  </section>
  <div class="lib">${keys.map(k=>{const e=EX[k];return `<section class="card"><div class="sess-head"><h3>${esc(exName(k))}</h3><span class="tag" style="color:var(--ink-2)">${esc(e.c)}</span></div>${figHtml(k)}<details data-k="${k}"><summary>Explications détaillées</summary>${exDetail(k,{noFig:true})}</details></section>`;}).join("")||`<div class="empty">Aucun exercice ne correspond.</div>`}</div>`;
}

/* ---------- Suivi ---------- */
function heatmap(){
  const cw=curWeek(),c=cycleOf(Math.max(cw,1)),from=(c-1)*12+1,tdy=todayIso();
  const rows=[];
  for(let w=from;w<from+12;w++){
    rows.push(`<div class="hm-row"><span class="hm-l">S${w}</span>${DAYS.map(([d],i)=>{const ds=dateOf(w,i),p=planFor(w,d),l=data.logs[`s${w}-${d}`];let cls="hm-future";
      if(ds<=tdy){if(l&&l.done)cls=p.kind==="M"?"hm-tourn":"hm-done";else if(p.kind==="M")cls="hm-tourn-empty";else if(data.mobilite[ds])cls="hm-mob";else if(PLANNED_KINDS.includes(p.kind)&&ds<tdy)cls="hm-miss";else cls="hm-rest";}
      return `<span class="hm ${cls}" title="${fr(ds)} · ${esc(p.title)}"></span>`;}).join("")}</div>`);
  }
  return `<div class="hm-wrap"><div class="hm-row hm-head"><span class="hm-l"></span>${DAYS.map(([,l])=>`<span class="hm-d">${l[0]}</span>`).join("")}</div>${rows.join("")}</div>
   <div class="clegend"><span><i class="hm-done"></i>séance faite</span><span><i class="hm-mob"></i>mobilité seule</span><span><i class="hm-miss"></i>séance manquée</span><span><i class="hm-tourn"></i>tournoi</span></div>`;
}
function renderStats(){
  const ws=sortedWeights(),pts=ws.map(x=>({x:x.date,y:+x.kg})),goalW=data.goals.poids&&data.goals.poids.target;
  const ma=movingAvg(pts,7);
  let proj="";
  const recent=pts.filter(p=>p.x>=addDays(todayIso(),-28));
  const lr=linReg(recent.length>=3?recent:pts.slice(-6));
  if(lr&&goalW&&pts.length>=3){const perWeek=lr.slope*7,cur=ma[ma.length-1].y;
    if(perWeek<-0.05&&cur>goalW){const days=Math.ceil((goalW-cur)/lr.slope);proj=`Rythme actuel : ${fmt(perWeek,2)} kg/semaine. Objectif de ${fmt(goalW)} kg atteint vers le <b>${esc(fr(addDays(todayIso(),days)))}</b>${perWeek<-0.8?" (rythme rapide : attention à ne pas perdre de puissance)":""}.`;}
    else if(cur<=goalW)proj=`Objectif de ${fmt(goalW)} kg atteint. Bravo !`;
    else proj=`Rythme actuel : ${fmt(perWeek,2)} kg/semaine. Pour avancer vers ${fmt(goalW)} kg, vise −0,3 à −0,5 kg par semaine.`;}
  const waist=[...ws.filter(x=>x.taille).map(x=>({x:x.date,y:+x.taille})),...Object.values(data.tests).filter(t=>t.taille).map(t=>({x:t.date,y:+t.taille}))].sort((a,b)=>a.x.localeCompare(b.x));
  const cw=curWeek(),c=cycleOf(cw),weeks=Array.from({length:12},(_,i)=>(c-1)*12+i+1),loads=weeks.map(w=>weekStats(w).load);
  const a=acwr(cw),a1=cw>1?acwr(cw-1):null;
  const ck=Object.entries(data.checkins).sort().map(([d,x])=>({x:d,y:checkinScore(x)}));
  const exKeys=[...LOADED].filter(k=>exHistory(k).some(x=>x.top!=null));
  if(!exKeys.includes(state.exKey)&&exKeys.length)state.exKey=exKeys[0];
  const prs=[...LOADED].map(k=>({k,b:bestOf(k)})).filter(x=>x.b.kg>0).sort((x,y)=>y.b.e1-x.b.e1);
  const recapWeeks=[];for(let w=Math.min(cw,weeks[11]);w>=Math.max(1,cw-5);w--)recapWeeks.push(w);
  return `
  <div class="kpis">
   <div class="kpi"><div class="v num">${ws.length?fmt(ws[ws.length-1].kg)+" kg":"–"}</div><div class="k">dernière pesée</div></div>
   <div class="kpi"><div class="v num ${ws.length>1&&ws[ws.length-1].kg<ws[0].kg?"delta-good":""}">${ws.length>1?(ws[ws.length-1].kg-ws[0].kg>0?"+":"")+fmt(ws[ws.length-1].kg-ws[0].kg)+" kg":"–"}</div><div class="k">depuis le départ</div></div>
   <div class="kpi"><div class="v num">${totalDone()}</div><div class="k">séances faites</div></div>
   <div class="kpi"><div class="v num">${plural(mobStreak(),"jour")}</div><div class="k">série mobilité</div></div>
  </div>
  <section class="card stack"><div class="sess-head"><div><div class="eyebrow">Perte de poids</div><h2>Poids</h2></div><span class="muted small">Repère : −0,3 à −0,5 kg/semaine</span></div>
   <form class="form-row" data-weight="1"><label>Date<input type="date" name="date" value="${todayIso()}"></label><label>Poids (kg)<input type="number" step="0.1" inputmode="decimal" name="kg" required></label><label>Tour de taille (cm, facultatif)<input type="number" step="0.5" inputmode="decimal" name="taille"></label><button class="btn" type="submit">Ajouter</button></form>
   ${lineChart([{pts,color:"var(--court)",label:"Pesées",opacity:.55},{pts:ma,color:"var(--court)",label:"Moyenne 7 jours",width:3.5,dots:false}],{unit:"kg",target:goalW,empty:"Ajoute ta première pesée."})}
   ${proj?`<p class="small">${proj}</p>`:""}
   ${ws.length?`<details><summary>Toutes les pesées</summary><div class="tbl-wrap"><table><thead><tr><th>Date</th><th class="num">Poids</th><th class="num">Taille</th><th></th></tr></thead><tbody>${ws.slice().reverse().map(x=>`<tr><td>${fr(x.date)}</td><td class="num">${fmt(x.kg)} kg</td><td class="num">${x.taille?fmt(x.taille)+" cm":"–"}</td><td><button class="del" data-del="weights:${esc(x.id)}">supprimer</button></td></tr>`).join("")}</tbody></table></div></details>`:""}
  </section>
  ${waist.length?`<section class="card stack"><div class="eyebrow">Tour de taille</div>${lineChart([{pts:waist,color:"var(--b2)",area:true}],{unit:"cm",h:190})}</section>`:""}
  <section class="card stack"><div><div class="eyebrow">Durée × effort ressenti de chaque séance faite</div><h2>Charge d'entraînement</h2></div>
   ${barChart(loads,{labels:weeks.map(w=>"S"+w),cur:weeks.indexOf(cw),colorFn:i=>blockOf(weeks[i]).color,ref:a?a.chronic:null,refLabel:"moyenne 4 sem."})}
   <div class="acwr ${a&&a.ratio>1.3?"bad":a&&a.ratio<0.8?"low":"ok"}"><b>Ratio de charge ${a?fmt(a.ratio,2):"–"}</b> <span class="small">${a?(a.ratio>1.3?"Hausse trop rapide : risque de blessure, allège.":a.ratio<0.8?"Semaine légère : normal en allègement ou en début de semaine.":"Zone idéale (0,8–1,3)."):"Il faut au moins 3 semaines d'historique."}${a1?` · semaine dernière : ${fmt(a1.ratio,2)}`:""}</span></div>
  </section>
  <section class="card stack"><div><div class="eyebrow">Cycle ${c}</div><h2>Régularité</h2></div>${heatmap()}</section>
  <section class="card stack"><div><div class="eyebrow">Semaine par semaine</div><h2>Bilans</h2></div>
   <div class="tbl-wrap"><table><thead><tr><th>Semaine</th><th class="num">Séances</th><th class="num">Charge</th><th class="num">Mobilité</th><th class="num">Poids</th><th class="num">Forme</th><th class="num">Records</th><th></th></tr></thead><tbody>
   ${recapWeeks.map(w=>{const r=weekRecap(w);return `<tr><td>S${w}</td><td class="num">${r.done}/${r.planned}</td><td class="num">${fmt(r.load,0)}</td><td class="num">${r.mob}/7</td><td class="num">${r.weight?fmt(r.weight):"–"}</td><td class="num">${r.checkin!=null?Math.round(r.checkin):"–"}</td><td class="num">${r.prs.length}</td><td><button class="del" data-shareweek="${w}">partager</button></td></tr>`;}).join("")}
   </tbody></table></div></section>
  <section class="card stack"><div class="sess-head"><div><div class="eyebrow">Progression des charges</div><h2>Par exercice</h2></div>
   ${exKeys.length?`<label style="min-width:220px">Exercice<select id="exsel">${exKeys.map(k=>`<option value="${k}" ${k===state.exKey?"selected":""}>${esc(exName(k))}</option>`).join("")}</select></label>`:""}</div>
   ${exKeys.length?exHistoryHtml(state.exKey):`<div class="empty">Tes courbes apparaîtront dès que tu saisiras des charges série par série.</div>`}
  </section>
  ${prs.length?`<section class="card stack"><div><div class="eyebrow">Tes meilleures marques</div><h2>Records</h2></div><div class="tbl-wrap"><table><thead><tr><th>Exercice</th><th class="num">Charge max</th><th class="num">1RM estimé</th></tr></thead><tbody>${prs.map(x=>`<tr><td>${esc(exName(x.k))}</td><td class="num">${fmt(x.b.kg)} kg</td><td class="num">${fmt(x.b.e1,0)} kg</td></tr>`).join("")}</tbody></table></div></section>`:""}
  ${recoveryCharts()}
  <section class="card stack"><div><div class="eyebrow">Sommeil, courbatures, fatigue, motivation</div><h2>Forme du matin</h2></div>${lineChart([{pts:ck,color:"var(--b2)",area:true}],{unit:"/100",empty:"Remplis la forme du matin sur l'écran Aujourd'hui.",dec:0})}</section>`;
}

/* ---------- Plus ---------- */
const MORE=[
 ["mobilite","Mobilité","Routine quotidienne guidée"],["tournoi","Jour de tournoi","Sac, échauffement, entre les matchs"],
 ["tournois","Tournois","Résultats, classement, analyse"],["tests","Tests","Mesures de progrès"],
 ["douleurs","Douleurs","Suivi par zone du corps"],["objectifs","Objectifs & badges","Cibles et récompenses"],
 ["technique","Carnet technique","Objectifs de tes entraînements"],["nutrition","Nutrition","Calories, protéines, eau"],
 ["programme","Le programme","Logique, blocs, règles"],["guide","Guide","Échauffement, prévention"],
 ["calendrier","Calendrier","Ajouter les séances"],["bilan","Bilan à partager","Pour ton coach ou une IA"],
 ["reglages","Réglages","Profil, programme, sauvegarde, compte"]];
function renderMore(){
  if(state.sub&&SUBS[state.sub])return `<button class="back" type="button" data-sub="">‹ Plus</button>`+SUBS[state.sub]();
  return `<div class="tiles">${MORE.map(([k,t,d])=>`<button class="tile" type="button" data-sub="${k}"><b>${t}</b><span>${d}</span></button>`).join("")}</div>`;
}
const SUBS={};
SUBS.mobilite=()=>{const tdy=todayIso(),on=!!data.mobilite[tdy],w=curWeek();
  return `<section class="card stack"><div class="sess-head"><div><div class="eyebrow">Tous les jours · 12 min</div><h2>Routine mobilité</h2></div><button class="chip-btn" data-mob="${tdy}" aria-pressed="${on}">${on?"✓ Faite aujourd'hui":"Marquer comme faite"}</button></div>
   <div>${timerBtn("mobroutine",{label:"Lancer la routine guidée",ph:mobilityPhases()},"btn")}</div>${timerSlot("mobroutine")}
   <p>9 mouvements enchaînés qui ciblent ce que le padel raidit : haut du dos et hanches pour la rotation, adducteurs et chevilles pour les appuis, épaules et avant-bras pour les frappes.</p>
   <div class="kpis sm"><div class="kpi"><div class="v num">${plural(mobStreak(),"jour")}</div><div class="k">série en cours</div></div><div class="kpi"><div class="v num">${Object.keys(data.mobilite).length}</div><div class="k">routines au total</div></div></div>
   ${daysToStart()<=0?mobRow(w):""}</section>
  ${M_ROUTINE.map(([k,,r],i)=>`<section class="card move"><div class="move-n">${i+1}</div><div><div class="sess-head"><h3>${esc(EX[k].n)}</h3><span class="rx">${esc(r)}</span></div>${exDetail(k,{history:false})}</div></section>`).join("")}`;};
SUBS.tests=()=>{
  const list=Object.values(data.tests).filter(t=>t&&t.date&&TESTS.some(x=>t[x.k]!=null&&t[x.k]!=="")).sort((a,b)=>a.date.localeCompare(b.date));
  const t=TESTS.find(x=>x.k===state.testKey)||TESTS[0];
  const pts=list.filter(r=>r[t.k]!=null&&r[t.k]!=="").map(r=>({x:r.date,y:+r[t.k]}));
  const first=list[0],last=list[list.length-1];
  const best=k=>{const T=TESTS.find(x=>x.k===k),v=list.map(r=>r[k]).filter(x=>x!=null&&x!=="").map(Number);return v.length?(T.better==="up"?Math.max(...v):Math.min(...v)):null;};
  return `<section class="card stack"><div><div class="eyebrow">Semaines 1, 4, 8 et 12</div><h2>Saisir des tests</h2></div>
   <p class="muted small">Tu peux aussi saisir les résultats directement pendant la séance de tests.</p>
   <form class="stack" data-tests="1"><div class="form-row"><label>Date<input type="date" name="date" value="${todayIso()}"></label></div>
    <div class="form-row">${TESTS.map(x=>`<label>${esc(x.name)} (${x.u})<input type="number" step="any" inputmode="decimal" name="${x.k}"></label>`).join("")}</div>
    <div><button class="btn" type="submit">Enregistrer les tests</button></div></form></section>
  <section class="card stack"><div class="sess-head"><div><div class="eyebrow">Évolution</div><h2>${esc(t.name)}</h2></div><label style="min-width:220px">Test<select id="tsel">${TESTS.map(x=>`<option value="${x.k}" ${x.k===t.k?"selected":""}>${esc(x.name)}</option>`).join("")}</select></label></div>
   <p class="muted small">${esc(t.how)} ${t.better==="up"?"Plus c'est haut, mieux c'est.":"Plus c'est bas, mieux c'est."}${best(t.k)!=null?` Record : <b>${fmt(best(t.k))} ${t.u}</b>.`:""}</p>
   ${lineChart([{pts,color:"var(--b2)",area:true}],{unit:t.u,empty:"Pas encore de mesure pour ce test."})}</section>
  <section class="card stack"><h2>Tableau des tests</h2>
   ${list.length?`<div class="tbl-wrap"><table><thead><tr><th>Test</th>${list.map(r=>`<th class="num">${fr(r.date)}</th>`).join("")}${list.length>1?`<th class="num">Progrès</th>`:""}</tr></thead><tbody>
    ${TESTS.map(x=>{const a=first[x.k],b=last[x.k];let delta="";if(list.length>1&&a!=null&&a!==""&&b!=null&&b!==""){const d=b-a,good=x.better==="up"?d>0:d<0;delta=`<td class="num ${d===0?"":good?"delta-good":"delta-bad"}">${d>0?"+":""}${fmt(d)} ${x.u}</td>`;}else if(list.length>1)delta="<td class='num'>–</td>";
      return `<tr><td>${esc(x.name)}</td>${list.map(r=>`<td class="num">${r[x.k]!=null&&r[x.k]!==""?fmt(r[x.k]):"–"}</td>`).join("")}${delta}</tr>`;}).join("")}
    <tr><td></td>${list.map(r=>`<td class="num"><button class="del" data-del="tests:${esc(r.id)}">supprimer</button></td>`).join("")}${list.length>1?"<td></td>":""}</tr></tbody></table></div>`:`<div class="empty">Aucun test enregistré.</div>`}</section>
  <section class="card"><h3 style="margin-bottom:10px">Protocoles</h3><div class="grid2">${TESTS.map(x=>`<div><b>${esc(x.name)}</b> <span class="muted">(${x.u})</span><p class="muted small">${esc(x.how)}</p></div>`).join("")}</div></section>`;
};
const ROUNDS=["Poules","1/16","1/8","1/4","1/2","Finale","Vainqueur"];
SUBS.tournois=()=>{
  const list=Object.values(data.tournois).filter(t=>t&&t.date).sort((a,b)=>b.date.localeCompare(a.date));
  const m=list.reduce((a,t)=>a+(+t.matchs||0),0),v=list.reduce((a,t)=>a+(+t.victoires||0),0);
  const rs=list.filter(t=>t.physique),rAvg=rs.length?avg(rs.map(t=>+t.physique)):null;
  const rk=Object.values(data.ranking).filter(x=>x.rank).sort((a,b)=>a.date.localeCompare(b.date)).map(x=>({x:x.date,y:+x.rank}));
  const goalR=data.goals.rang&&data.goals.rang.target;
  const draft=state.trDraft||{matches:[{s:"",r:"V"},{s:"",r:"V"}]};
  // analyse préparation / résultats
  const rows=list.map(t=>{const w=weekOfDate(t.date);const load=w>=1?weekStats(w).load:null;const ck=[1,2,3].map(k=>checkinScore(data.checkins[addDays(t.date,-k)])).filter(x=>x!=null);return {t,load,ck:avg(ck)};});
  let insight="";
  const withLoad=rows.filter(r=>r.load);
  if(withLoad.length>=4){const med=withLoad.map(r=>r.load).sort((a,b)=>a-b)[Math.floor(withLoad.length/2)];
    const hi=withLoad.filter(r=>r.load>=med),lo=withLoad.filter(r=>r.load<med);
    const f=a=>avg(a.map(r=>+r.t.physique||0)),wr=a=>{const mm=a.reduce((x,r)=>x+(+r.t.matchs||0),0);return mm?Math.round(a.reduce((x,r)=>x+(+r.t.victoires||0),0)/mm*100):null;};
    insight=`Semaines chargées (≥ ${fmt(med,0)} UA) : forme ${fmt(f(hi))}/10, ${wr(hi)??"–"} % de victoires. Semaines plus légères : forme ${fmt(f(lo))}/10, ${wr(lo)??"–"} % de victoires.`;}
  return `<div class="kpis">
   <div class="kpi"><div class="v num">${list.length}</div><div class="k">tournois</div></div>
   <div class="kpi"><div class="v num">${m?Math.round(v/m*100)+" %":"–"}</div><div class="k">victoires (${v}/${m})</div></div>
   <div class="kpi"><div class="v num">${rAvg?fmt(rAvg)+"/10":"–"}</div><div class="k">forme moyenne</div></div>
   <div class="kpi"><div class="v num">${latestRank()?latestRank()+"e":"–"}</div><div class="k">classement</div></div></div>
  <section class="card stack"><div><div class="eyebrow">Après chaque tournoi</div><h2>Ajouter un tournoi</h2></div>
   <form class="stack" data-tournoi="1">
    <div class="form-row"><label>Date<input type="date" name="date" value="${todayIso()}"></label>
     <label>Catégorie<select name="cat">${LEVELS.map(c=>`<option ${c===(S_().level||"P250")?"selected":""}>${c}</option>`).join("")}</select></label>
     <label>Club / lieu<input name="lieu" placeholder="ex. Padel Club"></label>
     <label>Partenaire<input name="partner"></label></div>
    <div class="form-row"><label>Tour atteint<select name="res">${ROUNDS.map(r=>`<option>${r}</option>`).join("")}</select></label>
     <label>Points FFT gagnés<input type="number" inputmode="numeric" name="pts"></label>
     <label>Classement après<input type="number" inputmode="numeric" name="rank" placeholder="ex. 3500"></label></div>
    <div><div class="eyebrow">Matchs</div><div class="matches">${draft.matches.map((mm,i)=>`<div class="mblock"><div class="mrow"><span class="num">${i+1}</span><input name="ms${i}" value="${esc(mm.s||"")}" placeholder="Score, ex. 6-4 3-6 7-5"><div class="ckopts"><button type="button" data-mres="${i}|V" aria-pressed="${mm.r==="V"}">V</button><button type="button" data-mres="${i}|D" aria-pressed="${mm.r==="D"}">D</button></div></div>
      <input name="mo${i}" list="opplist" value="${esc(mm.o||"")}" placeholder="Adversaires (ex. Martin / Durand)">
      <input name="mn${i}" value="${esc(mm.note||"")}" placeholder="Ce qui n'a pas marché (ex. bandejas courtes)">
      <details><summary>Statistiques du match (facultatif)</summary><div class="form-row"><label>Points gagnants<input type="number" inputmode="numeric" name="mw${i}" value="${esc(mm.w??"")}"></label><label>Fautes directes<input type="number" inputmode="numeric" name="mue${i}" value="${esc(mm.ue??"")}"></label><label>Smashs gagnants<input type="number" inputmode="numeric" name="msm${i}" value="${esc(mm.sm??"")}"></label><label>Doubles fautes<input type="number" inputmode="numeric" name="mdf${i}" value="${esc(mm.df??"")}"></label></div></details></div>`).join("")}</div>
     <datalist id="opplist">${Object.values(data.opps).map(o=>`<option value="${esc(o.name)}">`).join("")}</datalist>
     <button class="chip-btn" type="button" data-maddmatch="1">+ Ajouter un match</button></div>
    <div class="form-row"><label>Forme physique (1–10)<select name="physique">${Array.from({length:10},(_,k)=>`<option ${k+1===7?"selected":""}>${k+1}</option>`).join("")}</select></label>
     <label>Fin de match<select name="fin"><option>Encore frais</option><option selected>Correct</option><option>Cuit en fin de match</option><option>Crampes / douleur</option></select></label></div>
    <label>Notes (ce qui a lâché physiquement, points clés)<textarea name="note" rows="2"></textarea></label>
    <div><button class="btn" type="submit">Enregistrer le tournoi</button></div></form></section>
  <section class="card stack"><div><div class="eyebrow">Plus c'est bas, mieux c'est</div><h2>Classement FFT</h2></div>
   <form class="inline" data-rank="1"><input type="number" inputmode="numeric" name="rank" placeholder="Classement actuel"><input type="date" name="date" value="${todayIso()}"><button class="btn small" type="submit">Ajouter</button></form>
   ${lineChart([{pts:rk,color:"var(--b3)",area:false}],{unit:"e",invert:true,target:goalR,empty:"Ajoute ton classement actuel.",dec:0})}</section>
  ${tournExtraStats()}
  <section class="card stack"><div><div class="eyebrow">Préparation physique et résultats</div><h2>Analyse</h2></div>
   ${insight?`<p>${insight}</p>`:`<p class="muted small">L'analyse apparaît à partir de 4 tournois enregistrés pendant le programme.</p>`}
   ${rows.length?`<div class="tbl-wrap"><table><thead><tr><th>Date</th><th>Tournoi</th><th>Résultat</th><th class="num">V/M</th><th class="num">Forme</th><th class="num">Charge sem.</th><th class="num">Forme matin</th><th>Partenaire</th><th>Notes</th><th></th></tr></thead><tbody>
    ${rows.map(({t,load,ck})=>`<tr><td>${fr(t.date)}</td><td>${esc(t.cat)} ${esc(t.lieu||"")}</td><td>${esc(t.res||"")}</td><td class="num">${esc(t.victoires??0)}/${esc(t.matchs??0)}</td><td class="num">${esc(t.physique)}/10</td><td class="num">${load!=null?fmt(load,0):"–"}</td><td class="num">${ck!=null?Math.round(ck):"–"}</td><td>${esc(t.partner||"")}</td><td class="wrap">${esc(t.note||"")}${(t.matches||[]).length?`<div class="muted small">${t.matches.map(x=>`${x.r} ${esc(x.s)}`).join(" · ")}</div>`:""}</td><td><button class="del" data-sharetourn="${esc(t.id)}">partager</button> <button class="del" data-del="tournois:${esc(t.id)}">supprimer</button></td></tr>`).join("")}</tbody></table></div>`:""}</section>`;
};
const ZONES=[["Cou / nuque",100,58],["Épaule droite",66,92],["Épaule gauche",134,92],["Coude droit",52,150],["Coude gauche",148,150],["Poignet droit",44,198],["Poignet gauche",156,198],["Bas du dos",100,172],["Hanche / aine droite",84,212],["Hanche / aine gauche",116,212],["Cuisse droite",84,248],["Cuisse gauche",116,248],["Genou droit",84,288],["Genou gauche",116,288],["Mollet / Achille droit",84,330],["Mollet / Achille gauche",116,330],["Cheville droite",84,370],["Cheville gauche",116,370]];
SUBS.douleurs=()=>{
  const since=addDays(todayIso(),-30),recent=Object.values(data.pains).filter(p=>p.date>=since);
  const lvl={};recent.forEach(p=>{lvl[p.zone]=Math.max(lvl[p.zone]||0,p.level);});
  const z=state.painZone,al=painAlerts(),list=Object.values(data.pains).sort((a,b)=>b.date.localeCompare(a.date));
  const body=`<svg viewBox="0 0 200 400" class="body" role="img" aria-label="Silhouette : touche la zone douloureuse">
   <g fill="var(--surface-2)" stroke="var(--line)" stroke-width="2"><circle cx="100" cy="30" r="20"/><path d="M72 70 Q100 60 128 70 L140 90 L136 190 Q100 205 64 190 L60 90 Z"/><path d="M60 88 L44 150 L38 205 L48 207 L56 152 L70 110 Z"/><path d="M140 88 L156 150 L162 205 L152 207 L144 152 L130 110 Z"/><path d="M66 192 Q100 206 134 192 L126 300 L120 385 L106 385 L104 300 L100 220 L96 300 L94 385 L80 385 L74 300 Z"/></g>
   ${ZONES.map(([n,x,y])=>{const l=lvl[n]||0;return `<circle class="zone ${z===n?"sel":""}" cx="${x}" cy="${y}" r="11" fill="${l>=6?"var(--bad)":l>=3?"var(--warn)":l>0?"var(--ball)":"var(--court)"}" fill-opacity="${l?0.85:0.18}" stroke="${z===n?"var(--ink)":"transparent"}" stroke-width="2.5" data-zone="${esc(n)}"><title>${esc(n)}</title></circle>`;}).join("")}
   <text x="10" y="396" class="ftxt">droite</text><text x="190" y="396" class="ftxt" text-anchor="end">gauche</text></svg>`;
  return `<section class="card stack"><div><div class="eyebrow">Touche une zone de la silhouette</div><h2>Douleurs</h2></div>
   <div class="actions"><button class="chip-btn" type="button" data-sub="renfo">Programmes de renforcement ciblé →</button></div>
   ${al.map(a=>`<div class="alert bad"><b>${esc(a.zone)}</b> : ${a.n} fois en 14 jours, jusqu'à ${a.max}/10. Retire ou allège les exercices qui la sollicitent. Si ça persiste ou s'aggrave, consulte un médecin ou un kiné.</div>`).join("")}
   <div class="painlayout">${body}<div class="stack">
    ${z?`<form class="stack" data-pain="1"><h3>${esc(z)}</h3><div><div class="eyebrow">Intensité</div><div class="ckopts wide">${Array.from({length:10},(_,i)=>i+1).map(v=>`<button type="button" data-plvl="${v}" aria-pressed="${state.painLvl===v}">${v}</button>`).join("")}</div><p class="muted small">1 gêne légère · 5 gêne pendant l'effort · 8 et plus : arrête l'activité</p></div>
      <label>Date<input type="date" name="date" value="${todayIso()}"></label><label>Contexte (quand, quel geste)<textarea name="note" rows="2" placeholder="ex. après les smashs, au réveil…"></textarea></label><div class="actions"><button class="btn" type="submit" ${state.painLvl?"":"disabled"}>Enregistrer</button><button class="chip-btn" type="button" data-zone="">Annuler</button></div></form>`
     :`<p class="muted">Couleur des zones sur 30 jours : jaune = léger, orange = modéré (3 à 5), rouge = fort (6 et plus).</p><p class="muted small">Ce suivi t'aide à repérer ce qui revient. Il ne remplace pas un avis médical.</p>`}
   </div></div></section>
  ${list.length?`<section class="card stack"><h3>Historique</h3><div class="tbl-wrap"><table><thead><tr><th>Date</th><th>Zone</th><th class="num">Intensité</th><th>Contexte</th><th></th></tr></thead><tbody>${list.map(p=>`<tr><td>${fr(p.date)}</td><td>${esc(p.zone)}</td><td class="num">${p.level}/10</td><td class="wrap">${esc(p.note||"")}</td><td><button class="del" data-del="pains:${esc(p.id)}">supprimer</button></td></tr>`).join("")}</tbody></table></div></section>`:""}`;
};
/* Objectifs & badges */
function goalCurrent(g){
  if(g.type==="poids")return latestWeight();
  if(g.type==="classement")return latestRank();
  if(g.type.startsWith("exo:")){const b=bestOf(g.type.slice(4));return b.e1?Math.round(b.e1):null;}
  if(g.type.startsWith("test:")){const k=g.type.slice(5),v=Object.values(data.tests).filter(t=>t[k]!=null&&t[k]!=="").sort((a,b)=>a.date.localeCompare(b.date));return v.length?+v[v.length-1][k]:null;}
  return null;
}
function goalStart(g){
  if(g.type==="poids"){const w=sortedWeights();return w.length?+w[0].kg:null;}
  if(g.type==="classement"){const r=Object.values(data.ranking).sort((a,b)=>a.date.localeCompare(b.date));return r.length?+r[0].rank:null;}
  if(g.type.startsWith("exo:")){const h=exHistory(g.type.slice(4)).filter(x=>x.e1);return h.length?Math.round(h[0].e1):null;}
  if(g.type.startsWith("test:")){const k=g.type.slice(5),v=Object.values(data.tests).filter(t=>t[k]!=null&&t[k]!=="").sort((a,b)=>a.date.localeCompare(b.date));return v.length?+v[0][k]:null;}
  return null;
}
function maxMobStreak(){const ds=Object.keys(data.mobilite).sort();let best=0,cur=0,prev=null;ds.forEach(d=>{cur=prev&&daysBetween(prev,d)===1?cur+1:1;best=Math.max(best,cur);prev=d;});return best;}
function prCount(){let n=0;Object.keys(EX).forEach(k=>{let best=0;exHistory(k).forEach(x=>{if(x.e1&&x.e1>best){if(best>0)n++;best=x.e1;}});});return n;}
function badges(){
  const td=totalDone(),ws=sortedWeights(),lost=ws.length>1?ws[0].kg-ws[ws.length-1].kg:0,ms=maxMobStreak(),pr=prCount(),nt=Object.keys(data.tournois).length,cw=curWeek();
  let perfect=0;for(let w=1;w<=Math.min(cw,60);w++){const s=weekStats(w);if(s.planned&&s.done>=s.planned)perfect++;}
  const testsN=Object.values(data.tests).filter(t=>TESTS.some(x=>t[x.k]!=null&&t[x.k]!=="")).length;
  let c1=false;if(cw>12){let d=0,p=0;for(let w=1;w<=12;w++){const s=weekStats(w);d+=s.done;p+=s.planned;}c1=p>0&&d/p>=0.7;}
  return [
   ["Première séance","Enregistre ta première séance",td>=1],["10 séances","",td>=10],["25 séances","",td>=25],["50 séances","",td>=50],
   ["Semaine parfaite","Toutes les séances prévues d'une semaine",perfect>=1],["4 semaines parfaites","",perfect>=4],
   ["7 jours de mobilité","7 jours d'affilée",ms>=7],["30 jours de mobilité","30 jours d'affilée",ms>=30],
   ["Premier record","Bats une de tes charges",pr>=1],["10 records","",pr>=10],
   ["Premier tournoi noté","",nt>=1],["10 tournois","",nt>=10],
   ["−3 kg","Depuis le départ",lost>=3],["−5 kg","Depuis le départ",lost>=5],
   ["Progrès mesuré","2 sessions de tests",testsN>=2],["7 bilans du matin","",Object.keys(data.checkins).length>=7],
   ["Cycle 1 terminé","12 semaines à plus de 70 %",c1]];
}
SUBS.objectifs=()=>{
  const gs=Object.values(data.goals),bs=badges(),got=bs.filter(b=>b[2]).length;
  const typeOpts=[["poids","Poids"],["classement","Classement FFT"],...[...LOADED].map(k=>["exo:"+k,exName(k)+" (1RM estimé)"]),...TESTS.map(t=>["test:"+t.k,"Test : "+t.name])];
  return `<section class="card stack"><div><div class="eyebrow">Tes cibles</div><h2>Objectifs</h2></div>
   ${gs.map(g=>{const cur=goalCurrent(g),st=goalStart(g),tg=num(g.target);const down=g.type==="poids"||g.type==="classement"||(g.type.startsWith("test:")&&(TESTS.find(t=>"test:"+t.k===g.type)||{}).better==="down");
     let pct=null;if(cur!=null&&st!=null&&tg!=null&&st!==tg)pct=clamp(Math.round((down?(st-cur)/(st-tg):(cur-st)/(tg-st))*100),0,100);
     return `<div class="goal"><div class="sess-head"><div><b>${esc(g.label)}</b><div class="muted small">Actuel : ${cur!=null?fmt(cur)+" "+esc(g.unit||""):"pas de donnée"}${st!=null?` · départ : ${fmt(st)}`:""}</div></div>
      <form class="inline" data-goal="${esc(g.id)}"><input type="number" step="any" inputmode="decimal" name="target" value="${esc(g.target??"")}" placeholder="Cible" aria-label="Cible"><button class="btn small" type="submit">OK</button>${["poids","rang","squat"].includes(g.id)?"":`<button class="del" type="button" data-del="goals:${esc(g.id)}">supprimer</button>`}</form></div>
      <div class="gbar"><span style="width:${pct??0}%"></span></div><div class="muted small">${pct!=null?pct+" % du chemin":"Fixe une cible pour suivre ta progression"}</div></div>`;}).join("")}
   <form class="form-row" data-goaladd="1"><label>Nouvel objectif<select name="type">${typeOpts.map(([v,l])=>`<option value="${v}">${esc(l)}</option>`).join("")}</select></label><label>Cible<input type="number" step="any" inputmode="decimal" name="target" required></label><button class="btn" type="submit">Ajouter</button></form></section>
  <section class="card stack"><div><div class="eyebrow">${got} sur ${bs.length}</div><h2>Badges</h2></div>
   <div class="badges">${bs.map(([n,d,ok])=>`<div class="badge ${ok?"on":""}"><span class="bi">${ok?"★":"☆"}</span><b>${esc(n)}</b>${d?`<span>${esc(d)}</span>`:""}</div>`).join("")}</div></section>`;
};
SUBS.technique=()=>{
  const list=Object.values(data.tech).filter(t=>t.theme||t.notes).sort((a,b)=>b.date.localeCompare(a.date));
  const cnt={};list.forEach(t=>{if(t.theme)cnt[t.theme]=(cnt[t.theme]||0)+1;});
  const rated=TECH_THEMES.map(th=>{const r=list.filter(t=>t.theme===th&&t.rating).map(t=>+t.rating);return [th,cnt[th]||0,r.length?avg(r):null];}).filter(x=>x[1]);
  return `<section class="card stack"><div><div class="eyebrow">Mardi, jeudi et matchs d'entraînement</div><h2>Carnet technique</h2></div>
   <p class="small">Avant chaque entraînement padel, choisis un thème et un objectif précis dans la séance du jour. Après, note ta réussite et ce que tu as appris. Tu peux aussi ajouter une note ici.</p>
   <form class="stack" data-techadd="1"><div class="form-row"><label>Date<input type="date" name="date" value="${todayIso()}"></label><label>Thème<select name="theme">${TECH_THEMES.map(x=>`<option>${esc(x)}</option>`).join("")}</select></label><label>Réussite (1–5)<select name="rating"><option value="">–</option>${[1,2,3,4,5].map(v=>`<option>${v}</option>`).join("")}</select></label></div>
    <label>Objectif<input name="goal"></label><label>Notes<textarea name="notes" rows="2"></textarea></label><div><button class="btn" type="submit">Ajouter</button></div></form></section>
  ${rated.length?`<section class="card stack"><h3>Par thème</h3><div class="tbl-wrap"><table><thead><tr><th>Thème</th><th class="num">Séances</th><th class="num">Réussite moy.</th></tr></thead><tbody>${rated.map(([th,n,r])=>`<tr><td>${esc(th)}</td><td class="num">${n}</td><td class="num">${r!=null?fmt(r)+"/5":"–"}</td></tr>`).join("")}</tbody></table></div></section>`:""}
  <section class="card stack"><h3>Historique</h3>${list.length?list.map(t=>`<div class="techitem"><div class="sess-head"><b>${fr(t.date)} · ${esc(t.theme||"—")}</b><span>${t.rating?t.rating+"/5":""} <button class="del" data-del="tech:${esc(t.id||t.date)}">supprimer</button></span></div>${t.goal?`<div class="small">Objectif : ${esc(t.goal)}</div>`:""}${t.notes?`<div class="small muted">${esc(t.notes)}</div>`:""}</div>`).join(""):`<div class="empty">Aucune note pour l'instant.</div>`}</section>`;
};
SUBS.nutrition=()=>{
  const T=nutritionTargets(),s=S_(),t=todayIso(),n=data.nutri[t]||{},glasses=Math.round(T.water*4);
  const last14=Array.from({length:14},(_,i)=>addDays(t,-i)),protDays=last14.filter(d=>(data.nutri[d]||{}).prot).length;
  return `<section class="card stack"><div><div class="eyebrow">Calculé pour ${fmt(T.w)} kg, ${s.height} cm, ${s.age} ans</div><h2>Tes repères</h2></div>
   <div class="kpis"><div class="kpi"><div class="v num">${T.kcal}</div><div class="k">kcal / jour (${+s.deficit?"objectif perte de poids":"maintien"})</div></div><div class="kpi"><div class="v num">${T.prot} g</div><div class="k">protéines / jour (1,8 g/kg)</div></div><div class="kpi"><div class="v num">${fmt(T.water)} L</div><div class="k">eau / jour, plus les jours de match</div></div><div class="kpi"><div class="v num">${T.tdee}</div><div class="k">dépense estimée (kcal)</div></div></div>
   <p class="muted small">Estimation (formule de Mifflin-St Jeor × niveau d'activité${+s.deficit?`, moins ${s.deficit} kcal`:""}). Ajuste dans Réglages. Ce sont des repères généraux, pas un suivi diététique. Si ton poids baisse de plus de 0,8 kg par semaine ou que tes tests chutent, mange un peu plus.</p></section>
  <section class="card stack"><div><div class="eyebrow">Aujourd'hui</div><h2>Suivi du jour</h2></div>
   <div class="nq"><button class="chip-btn" type="button" data-nutri="prot" aria-pressed="${!!n.prot}">${n.prot?"✓ ":""}Protéines atteintes</button><button class="chip-btn" type="button" data-nutri="veg" aria-pressed="${!!n.veg}">${n.veg?"✓ ":""}5 fruits et légumes</button><button class="chip-btn" type="button" data-nutri="noalc" aria-pressed="${!!n.noalc}">${n.noalc?"✓ ":""}Sans alcool</button></div>
   <div class="water"><span>Eau</span><button class="rbtn" type="button" data-water="-1" aria-label="Retirer un verre">−</button><b class="num">${n.water||0}/${glasses}</b><button class="rbtn" type="button" data-water="1" aria-label="Ajouter un verre">+</button><span class="muted small">verres de 25 cl</span></div>
   <div class="water"><span>Café</span><button class="rbtn" type="button" data-cnt="cafe|-1">−</button><b class="num">${n.cafe||0}</b><button class="rbtn" type="button" data-cnt="cafe|1">+</button></div>
   <div class="water"><span>Alcool</span><button class="rbtn" type="button" data-cnt="alcool|-1">−</button><b class="num">${n.alcool||0}</b><button class="rbtn" type="button" data-cnt="alcool|1">+</button></div>
   <p class="muted small">Protéines atteintes ${protDays} jours sur les 14 derniers.</p>${habitsInsight()}</section>
  <section class="card"><div class="sess-head"><div><div class="eyebrow">Menus et liste de courses</div><h3>Repas de la semaine</h3></div><button class="btn small" data-sub="repas">Ouvrir</button></div></section>
  <section class="card stack"><h3>Répartir les protéines (${T.prot} g)</h3><ul class="clean"><li>Petit-déjeuner : 3 œufs ou fromage blanc 250 g (≈ 25–30 g)</li><li>Déjeuner : 150–180 g de viande, poisson ou volaille (≈ 40 g)</li><li>Collation : skyr ou shaker de whey (≈ 20–25 g)</li><li>Dîner : 150–180 g de protéine maigre ou légumineuses + œufs (≈ 40 g)</li></ul></section>
  <section class="card stack"><h3>Jours de tournoi</h3><ul class="clean"><li><b>3 h avant le 1er match :</b> riz ou pâtes + poulet ou jambon + fruit. Peu de gras, peu de fibres.</li><li><b>1 h avant :</b> banane ou compote, 500 ml d'eau.</li><li><b>Entre les matchs :</b> eau + électrolytes, banane, barre de céréales, pain d'épices, compote. Sandwich simple si plus de 2 h de pause.</li><li><b>Après :</b> dans les 2 h, repas protéines + glucides (ex. pâtes bolognaise, riz saumon). Réhydrate-toi.</li><li><b>La veille :</b> repas normal riche en glucides, pas d'alcool.</li></ul></section>
  <section class="card stack"><h3>Perdre du poids sans perdre de puissance</h3><ul class="clean"><li>Vise −0,3 à −0,5 kg par semaine, pas plus.</li><li>Garde les glucides autour des séances et des tournois, réduis-les plutôt les jours de repos.</li><li>Pèse-toi 1 à 2 fois par semaine, le matin à jeun, et regarde la moyenne sur 7 jours.</li><li>Dors 7 à 9 h : le manque de sommeil augmente la faim et freine la récupération.</li></ul></section>`;
};
SUBS.tournoi=()=>{
  const b=data.bag.main,done=b.items.filter(x=>b.checked[x]).length;
  return `<section class="card stack"><div><div class="eyebrow">Routines guidées avec minuteur</div><h2>Jour de tournoi</h2></div>
   <div class="actions">${timerBtn("rt-warm2",{label:"Échauffement d'avant-match · 12 min",ph:ROUTINES.match_warmup.ph()},"btn")}</div>${timerSlot("rt-warm2")}
   <div class="actions">${timerBtn("rt-between2",{label:"Entre deux matchs · 12 min",ph:ROUTINES.between.ph()},"btn ghost")}</div>${timerSlot("rt-between2")}
   <div class="actions">${timerBtn("rt-post2",{label:"Récupération d'après-tournoi · 23 min",ph:ROUTINES.post_tournament.ph()},"btn ghost")}</div>${timerSlot("rt-post2")}</section>
  <section class="card stack"><div class="sess-head"><div><div class="eyebrow">${done}/${b.items.length} prêts</div><h2>Mon sac</h2></div><button class="chip-btn" type="button" data-bagreset="1">Tout décocher</button></div>
   <div class="bag">${b.items.map((x,i)=>`<div class="bagrow"><label class="check"><input type="checkbox" data-bag="${i}" ${b.checked[x]?"checked":""}> ${esc(x)}</label><button class="del" type="button" data-bagdel="${i}" aria-label="Retirer">retirer</button></div>`).join("")}</div>
   <form class="inline" data-bagadd="1"><input name="item" placeholder="Ajouter un élément"><button class="btn small" type="submit">Ajouter</button></form></section>
  <section class="card stack"><h3>Le déroulé</h3><ul class="clean"><li>Mobilité le matin (12 min), repas 3 h avant le premier match.</li><li>Échauffement guidé 20 min avant d'entrer sur le terrain.</li><li>Pendant le match : quelques gorgées à chaque changement de côté.</li><li>Entre deux matchs : routine guidée, pas d'étirements longs.</li><li>Le soir : routine de récupération, puis note ton tournoi dans l'app.</li></ul></section>`;
};
SUBS.programme=()=>`
  <section class="card stack"><div class="eyebrow">La logique</div><h2>Des cycles de 12 semaines</h2>
   <p>Le programme est pensé pour un joueur de compétition. Chaque début de semaine, tu indiques tes jours de cours, de partie et de tournoi : l'app place autour la grosse séance de force (le plus loin possible du tournoi), deux compléments courts après le padel, la récupération le lendemain du tournoi et l'activation la veille. Chaque bloc de 4 semaines finit par une semaine allégée avec des tests. À la fin des 12 semaines, l'app analyse ton cycle et te propose le suivant, orienté selon tes résultats.</p></section>
  <div class="grid3">${BLOCKS.map((b,i)=>`<section class="card block" style="--bc:${b.color}"><div class="wks">Semaines ${i*4+1}–${i*4+4} du cycle</div><h3>${esc(b.name)}</h3><p class="muted small">${esc(b.goal)}</p><ul class="clean small">${b.keys.map(k=>`<li>${esc(k)}</li>`).join("")}</ul></section>`).join("")}</div>
  <section class="card"><h3 style="margin-bottom:10px">Exemple de semaine (cours mardi, partie jeudi, tournoi samedi)</h3><div class="tbl-wrap"><table class="tmpl"><tbody>
   <tr><td>Lundi</td><td>Repos (ou récup si tu as joué dimanche)</td></tr><tr><td>Mardi</td><td>Padel, puis 20 min prévention & gainage</td></tr><tr><td>Mercredi</td><td>Séance principale : sauts, lancers puis force</td></tr><tr><td>Jeudi</td><td>Padel, puis 15 min finisher cardio / déplacements</td></tr><tr><td>Vendredi</td><td>Veille de tournoi : mobilité + activation 8 min</td></tr><tr><td>Samedi</td><td>Tournoi</td></tr><tr><td>Dimanche</td><td>Récup active + cardio zone 2 + mobilité</td></tr></tbody></table></div></section>
  <section class="card"><h3 style="margin-bottom:10px">Règles d'ajustement</h3><ul class="clean">
   <li><b>Ta semaine :</b> renseigne tes jours de cours, de partie et de tournoi (Aujourd'hui ou Semaine), le programme s'adapte tout seul. Un tournoi ajouté dans « Tournois à venir » s'y reporte automatiquement.</li>
   <li><b>Forme basse le matin :</b> passe la séance en version courte (un bouton te le propose).</li>
   <li><b>Pas de salle :</b> « Pas de salle » remplace chaque exercice par une version maison.</li>
   <li><b>Séance impossible ce jour-là :</b> « Déplacer » l'échange avec un autre jour. Évite la force à moins de 3 jours du tournoi.</li>
   <li><b>Fatigue qui s'accumule :</b> saute d'abord le finisher du jeudi, puis le cardio du lundi (garde la mobilité).</li>
   <li><b>Progression :</b> suis la charge suggérée. Toutes les séries faites à RPE 7 ou moins = +2,5 à 5 kg.</li>
   <li><b>Douleur au-dessus de 3/10 :</b> retire l'exercice, note-la dans Douleurs.</li>
   <li><b>RPE :</b> 6 = facile, 8 = encore 2 répétitions en réserve, 10 = impossible d'en faire plus.</li></ul></section>`;
SUBS.guide=()=>`<div class="grid2 guide">
   <section class="card"><h3>Échauffement padel · 12 min</h3><ol class="steps"><li><span><b>3 min</b> trot léger, pas chassés, pas croisés, course arrière.</span></li><li><span><b>3 min</b> mobilité : cercles de bras, rotations du tronc, balancements de jambes, fentes avec rotation.</span></li><li><span><b>Élastique</b> : rotations externes et internes ×10, tirage ×10.</span></li><li><span><b>Activation</b> : 5 squats sautés légers, 5 skaters par côté, skips.</span></li><li><span><b>Réactivité</b> : 3 accélérations de 5 m, 6 split-steps au signal.</span></li><li><span><b>Shadow</b> : coup droit, revers, bandeja, smash à vide ×5 chacun.</span></li></ol>
    <div style="margin-top:10px">${timerBtn("rt-warm3",{label:"Lancer l'échauffement guidé",ph:ROUTINES.match_warmup.ph()},"btn small")}</div>${timerSlot("rt-warm3")}</section>
   <section class="card"><h3>${esc(sideTxt("Prévention · spécial joueur de gauche"))}</h3><ul class="clean"><li><b>Épaule :</b> bandeja, víbora et smash la sollicitent beaucoup. Les rotations externes à l'élastique ne se sautent jamais.</li><li><b>Coude :</b> 2 × 15 flexions de poignet excentriques avec un haltère léger, 2 fois par semaine, si tu sens le coude après les tournois.</li><li><b>Adducteurs :</b> les grands écarts en défense sont leur point faible, d'où le Copenhagen plank.</li><li><b>Chevilles et mollets :</b> changements de direction permanents. Les mollets excentriques protègent le tendon d'Achille.</li><li><b>Récupération :</b> 7 à 9 h de sommeil, c'est là que la force et la perte de poids se font.</li></ul></section>
   <section class="card"><h3>Lire ton effort (RPE)</h3><ul class="clean"><li><b>5–6</b> : facile, tu pourrais en faire beaucoup plus.</li><li><b>7</b> : 3 répétitions en réserve.</li><li><b>8</b> : 2 répétitions en réserve.</li><li><b>9</b> : 1 répétition en réserve.</li><li><b>10</b> : impossible d'en faire une de plus.</li></ul></section>
   <section class="card"><h3>Charge d'entraînement</h3><p class="small">Chaque séance vaut « durée × RPE » (unités arbitraires). Le ratio compare ta semaine à la moyenne des 4 précédentes : entre 0,8 et 1,3, c'est la zone idéale. Au-dessus de 1,3, le risque de blessure augmente.</p></section></div>`;
SUBS.calendrier=()=>{
  const s=S_(),cw=curWeek(),endCycle=cycleOf(cw)*12;
  return `<section class="card stack"><div><div class="eyebrow">Rappels dans ton calendrier</div><h2>Calendrier</h2></div>
   <p class="small">Ajoute tes séances dans l'app Calendrier avec une alerte 30 minutes avant (la veille au soir pour les tournois). Choisis d'abord le jour de tes tournois dans chaque semaine : l'export en tient compte. Si tu changes quelque chose, refais un export.</p>
   <div><div class="eyebrow">Période</div><div class="filters">${[["1","Semaine en cours"],["4","4 prochaines semaines"],["cycle",`Jusqu'à la fin du cycle (S${endCycle})`]].map(([v,l])=>`<button data-icsr="${v}" aria-pressed="${state.icsRange===v}">${l}</button>`).join("")}</div></div>
   <div><div class="eyebrow">Heure habituelle par jour</div><div class="form-row">${DAYS.slice(0,5).map(([d,l])=>`<label>${l}<input type="time" data-time="${d}" value="${esc(s.times[d])}"></label>`).join("")}</div></div>
   <label class="check"><input type="checkbox" id="icsmob" ${state.icsMob?"checked":""}> Ajouter aussi un rappel quotidien pour la mobilité à <input type="time" data-mobtime="1" value="${esc(s.mobTime)}" style="width:auto"></label>
   <div class="actions"><button class="btn" type="button" data-ics="open">Ajouter au calendrier</button><button class="btn ghost" type="button" data-ics="share">Partager le fichier .ics</button></div>
   <p class="muted small">Sur iPhone, « Ajouter au calendrier » ouvre la fenêtre d'import : touche « Tout ajouter ». Si rien ne s'ouvre, utilise « Partager le fichier » puis choisis Calendrier.</p></section>`;
};
SUBS.bilan=()=>{const txt=bilanText(state.bilanDays);
  return `<section class="card stack"><div><div class="eyebrow">Pour ajuster ton programme</div><h2>Bilan à partager</h2></div>
   <p class="small">Copie ce résumé et envoie-le à ton coach, ou colle-le dans un assistant IA : il pourra analyser tes charges, ta forme, tes tournois et tes douleurs, et te proposer des ajustements.</p>
   <div class="filters">${[7,30,90].map(d=>`<button data-bilan="${d}" aria-pressed="${state.bilanDays===d}">${d} jours</button>`).join("")}</div>
   <textarea id="bilantxt" rows="14" readonly>${esc(txt)}</textarea>
   <div class="actions"><button class="btn" type="button" data-copybilan="1">Copier le bilan</button></div></section>`;};
const LEVELS=["P25","P100","P250","P500","P1000","P1500","P2000"];
const TDAY_OPTS=[["ven","Vendredi"],["sam","Samedi"],["dim","Dimanche"],["none","Pas de tournoi habituel"]];
const opt=(arr,cur)=>arr.map(([v,l])=>`<option value="${esc(v)}" ${String(cur)===String(v)?"selected":""}>${esc(l)}</option>`).join("");
function accountForm(ctx){const c=Sync.cfg(),up=(state.accMode||(c.pending?"in":"up"))==="up";
  return `<form class="stack acc-form" data-syncform="1" data-ctx="${ctx}">
   <div class="seg2" role="tablist"><button type="button" role="tab" data-accmode="up" aria-selected="${up}">Créer un compte</button><button type="button" role="tab" data-accmode="in" aria-selected="${!up}">J'ai déjà un compte</button></div>
   <label>E-mail<input type="email" name="email" value="${esc(c.email||"")}" autocomplete="username" autocapitalize="off" autocorrect="off" required></label>
   <label>Mot de passe${up?" (6 caractères minimum)":""}<input type="password" name="pw" autocomplete="${up?"new-password":"current-password"}" minlength="6" required></label>
   ${up?`<label>Confirme le mot de passe<input type="password" name="pw2" autocomplete="new-password" minlength="6" required></label>`:""}
   <div class="actions"><button class="btn" type="submit" name="act" value="${up?"up":"in"}">${up?"Créer mon compte":"Se connecter"}</button>${up?"":`<button class="linkbtn" type="submit" name="act" value="recover" formnovalidate>Mot de passe oublié ?</button>`}</div>
   <p class="muted small" id="sync-status" role="status">${esc(Sync.status||"")}</p></form>`;}
function pendingBox(){const c=Sync.cfg();if(!c.pending||Sync.connected())return "";
  return `<div class="alert small"><b>Dernière étape :</b> clique sur le lien envoyé à ${esc(c.pending)} pour activer ton compte (pense aux spams), puis connecte-toi ci-dessous. <button class="linkbtn" type="button" data-resend="1">Renvoyer l'e-mail</button></div>`;}
function accountCard(){if(!cloudOn())return "";const c=Sync.cfg(),con=Sync.connected();
  return `<section class="card stack" id="compte"><div><div class="eyebrow">Gratuit · facultatif</div><h2>Mon compte</h2></div>
   ${con?`<p>Connecté avec <b>${esc(c.email||"")}</b>. Tes données sont sauvegardées en ligne et synchronisées sur tous tes appareils.</p><p class="muted small" id="sync-status">${esc(Sync.status||"")}</p><div class="actions"><button class="btn" type="button" data-sync="now">Synchroniser maintenant</button><button class="btn ghost" type="button" data-sync="out">Se déconnecter</button></div>`
    :`<ul class="clean small acc-why"><li>Tes séances, pesées et tournois sauvegardés automatiquement</li><li>Le même programme sur ton téléphone et ton ordinateur</li><li>Rien de perdu si tu changes de téléphone</li></ul>${pendingBox()}${accountForm("settings")}`}
  </section>`;}
SUBS.reglages=()=>{const s=S_(),con=Sync.connected();
  return `<form class="stack" data-settings="1">
   <section class="card stack"><div><div class="eyebrow">Toi</div><h2>Profil</h2></div>
    <div class="form-row"><label>Prénom<input name="name" value="${esc(s.name||"")}" autocomplete="given-name" maxlength="30"></label>
     <label>Sexe<select name="sex">${opt([["H","Homme"],["F","Femme"]],s.sex)}</select></label>
     <label>Âge<input type="number" inputmode="numeric" name="age" min="12" max="90" value="${esc(s.age??"")}"></label>
     <label>Taille (cm)<input type="number" inputmode="numeric" name="height" min="120" max="230" value="${esc(s.height??"")}"></label></div>
    <div class="form-row"><label>Activité<select name="activity">${opt([[1.4,"Modérée"],[1.55,"Sportive (3–5 / sem.)"],[1.7,"Très sportive"]],s.activity)}</select></label>
     <label>Objectif nutrition<select name="deficit">${opt([[0,"Maintien"],[250,"Perte douce (−250 kcal)"],[400,"Perte (−400 kcal)"],[500,"Perte marquée (−500 kcal)"]],s.deficit)}</select></label></div></section>
   <section class="card stack"><div><div class="eyebrow">Padel</div><h2>Programme</h2></div>
    <div class="form-row"><label>Début du programme (un lundi)<input type="date" name="start" value="${esc(s.start||"")}"></label>
     <label>Côté de jeu<select name="side">${opt([["gauche","Gauche"],["droite","Droite"]],s.side)}</select></label>
     <label>Catégorie habituelle<select name="level">${opt(LEVELS.map(l=>[l,l]),s.level)}</select></label></div>
    <div class="form-row"><label>Jour de tournoi habituel<select name="tDefault">${opt(TDAY_OPTS,s.tDefault||"sam")}</select></label>
     <label>Jour de cours habituel<select name="lessonDay">${opt(LESSON_DAYS,s.lessonDay||"mar")}</select></label></div></section>
   <section class="card stack"><div><div class="eyebrow">Affichage</div><h2>Préférences</h2></div>
    <div class="form-row"><label>Thème<select name="theme">${opt([["auto","Automatique"],["light","Clair"],["dark","Sombre"]],s.theme)}</select></label>
     <label>Annonces vocales<select name="voice">${opt([["1","Activées"],["0","Désactivées"]],s.voice?"1":"0")}</select></label></div>
    <div><button class="btn" type="submit">Enregistrer les réglages</button></div></section></form>
  ${accountCard()}
  <section class="card stack"><div><div class="eyebrow">Sur cet appareil</div><h2>Sauvegarde</h2></div>
   <p class="small">Dernière sauvegarde : ${data.meta.main.lastExport?fr(data.meta.main.lastExport):"jamais"}. Enregistre le fichier dans Fichiers, iCloud Drive ou Google Drive.</p>
   <div class="actions"><button class="btn" type="button" data-export="1">Exporter une sauvegarde</button><label class="btn ghost filebtn">Restaurer<input type="file" id="file-import" accept="application/json,.json" hidden></label></div></section>
  ${settingsExtra()}
  <section class="card stack"><div><div class="eyebrow">Confidentialité</div><h2>Tes données</h2></div>
   <p class="small">${con?"Tes données sont enregistrées sur cet appareil et dans ton compte en ligne, accessible uniquement avec ton identifiant.":"Tes données restent uniquement sur cet appareil : rien n'est envoyé en ligne."} Tu peux les exporter ou les effacer à tout moment.</p>
   <p class="small muted">Cette application propose un entraînement général et ne remplace pas l'avis d'un médecin ou d'un kinésithérapeute. En cas de douleur persistante, consulte un professionnel de santé.</p>
   <div class="actions"><button class="btn ghost danger" type="button" data-wipe="1">Effacer toutes mes données</button></div></section>
  <section class="card stack"><h3>À propos</h3><p class="muted small">${esc(APP_CONFIG.name||"Programme Padel")} · version ${APP_VERSION}${APP_CONFIG.contactEmail?` · <a href="mailto:${esc(APP_CONFIG.contactEmail)}">Contact</a>`:""}</p></section>`;};

/* ---------- Images à partager ---------- */
function canvasCard(title,sub,stats,foot){
  const W=1080,H=1350,c=document.createElement("canvas");c.width=W;c.height=H;const g=c.getContext("2d");
  g.fillStyle="#1D5AA6";g.fillRect(0,0,W,H);
  g.strokeStyle="rgba(255,255,255,.18)";g.lineWidth=10;g.strokeRect(90,120,W-180,H-240);g.beginPath();g.moveTo(90,520);g.lineTo(W-90,520);g.moveTo(W/2,120);g.lineTo(W/2,520);g.stroke();
  g.fillStyle="#D7E84A";g.beginPath();g.arc(W-170,200,58,0,Math.PI*2);g.fill();
  g.fillStyle="#fff";g.font="600 36px 'IBM Plex Mono', monospace";g.fillText(sub.toUpperCase(),130,220);
  g.font="700 110px 'Barlow Condensed', sans-serif";
  const words=title.toUpperCase().split(" ");let line="",y=350;words.forEach(wd=>{const t=line?line+" "+wd:wd;if(g.measureText(t).width>W-280){g.fillText(line,130,y);y+=110;line=wd;}else line=t;});g.fillText(line,130,y);
  stats.forEach(([v,k],i)=>{const col=i%2,row=Math.floor(i/2),x=130+col*430,yy=660+row*230;g.fillStyle="#fff";g.font="700 120px 'Barlow Condensed', sans-serif";g.fillText(String(v),x,yy);g.fillStyle="rgba(255,255,255,.75)";g.font="500 34px 'IBM Plex Sans', sans-serif";g.fillText(k,x,yy+50);});
  g.fillStyle="rgba(255,255,255,.8)";g.font="500 32px 'IBM Plex Sans', sans-serif";g.fillText(foot,130,H-150);
  return new Promise(r=>c.toBlob(r,"image/png"));
}
async function shareWeek(w){
  const r=weekRecap(w);
  const blob=await canvasCard(`Semaine ${w} · ${blockOf(w).name}`,`Programme padel · cycle ${cycleOf(w)}`,[[`${r.done}/${r.planned}`,"séances faites"],[fmt(r.load,0),"charge d'entraînement"],[`${r.mob}/7`,"jours de mobilité"],[r.prs.length,"records battus"],[r.weight?fmt(r.weight)+" kg":"–","poids moyen"],[r.checkin!=null?Math.round(r.checkin):"–","forme du matin /100"]],r.tournois.length?`Tournoi : ${r.tournois.map(t=>t.cat+" · "+(t.res||"")).join(", ")}`:`Du ${fr(dateOf(w,0))} au ${fr(dateOf(w,6))}`);
  shareFile(blob,`padel-semaine-${w}.png`,"Ma semaine de padel");
}
async function shareTournament(id){
  const t=data.tournois[id];if(!t)return;
  const blob=await canvasCard(`${t.cat} ${t.lieu||""}`,`Tournoi · ${fr(t.date)}`,[[t.res||"–","tour atteint"],[`${t.victoires||0}/${t.matchs||0}`,"victoires"],[`${t.physique}/10`,"forme physique"],[t.pts?"+"+t.pts:"–","points FFT"]],t.partner?`Avec ${t.partner}`:"Programme padel");
  shareFile(blob,`padel-tournoi-${t.date}.png`,"Mon tournoi");
}

/* ---------- v3 : statistiques de match, partenaires, récupération, habitudes ---------- */
function tournExtraStats(){
  const T=Object.values(data.tournois).filter(t=>t&&t.date);
  const parts={};T.forEach(t=>{const p=(t.partner||"").trim();if(!p)return;const x=parts[p]=parts[p]||{n:0,m:0,v:0,best:-1,f:[]};x.n++;x.m+=+t.matchs||0;x.v+=+t.victoires||0;x.best=Math.max(x.best,ROUNDS.indexOf(t.res));if(t.physique)x.f.push(+t.physique);});
  const ms=[];T.sort((a,b)=>a.date.localeCompare(b.date)).forEach(t=>(t.matches||[]).forEach(m=>{if([m.w,m.ue,m.sm,m.df].some(x=>num(x)!=null))ms.push({date:t.date,...m});}));
  const last=ms.slice(-10),A=k=>{const v=last.map(m=>num(m[k])).filter(x=>x!=null);return v.length?avg(v):null;};
  const perT=T.map(t=>{const mm=(t.matches||[]).filter(m=>num(m.w)!=null&&num(m.ue)!=null);if(!mm.length)return null;const w=mm.reduce((a,m)=>a+num(m.w),0),u=mm.reduce((a,m)=>a+num(m.ue),0);return u?{x:t.date,y:Math.round(w/u*100)/100}:null;}).filter(Boolean);
  const pk=Object.entries(parts).sort((a,b)=>b[1].n-a[1].n);
  return `${pk.length?`<section class="card stack"><div><div class="eyebrow">Avec qui tu gagnes</div><h2>Par partenaire</h2></div><div class="tbl-wrap"><table><thead><tr><th>Partenaire</th><th class="num">Tournois</th><th class="num">Victoires</th><th>Meilleur tour</th><th class="num">Forme moy.</th></tr></thead><tbody>${pk.map(([p,x])=>`<tr><td>${esc(p)}</td><td class="num">${x.n}</td><td class="num">${x.m?Math.round(x.v/x.m*100)+" % ("+x.v+"/"+x.m+")":"–"}</td><td>${x.best>=0?ROUNDS[x.best]:"–"}</td><td class="num">${x.f.length?fmt(avg(x.f))+"/10":"–"}</td></tr>`).join("")}</tbody></table></div></section>`:""}
  <section class="card stack"><div><div class="eyebrow">Tes 10 derniers matchs avec statistiques</div><h2>Statistiques de match</h2></div>
   ${last.length?`<div class="kpis sm"><div class="kpi"><div class="v num">${fmt(A("w"))}</div><div class="k">points gagnants</div></div><div class="kpi"><div class="v num">${fmt(A("ue"))}</div><div class="k">fautes directes</div></div><div class="kpi"><div class="v num">${A("w")!=null&&A("ue")?fmt(A("w")/A("ue"),2):"–"}</div><div class="k">ratio gagnants / fautes</div></div><div class="kpi"><div class="v num">${fmt(A("sm"))}</div><div class="k">smashs gagnants</div></div><div class="kpi"><div class="v num">${fmt(A("df"))}</div><div class="k">doubles fautes</div></div></div>
    ${lineChart([{pts:perT,color:"var(--b2)",area:true}],{unit:"",target:1,targetLabel:"équilibre",dec:2,h:190,empty:""})}<p class="muted small">Ratio au-dessus de 1 : tu gagnes plus de points que tu n'en donnes.</p>`:`<p class="muted small">Ouvre « Statistiques du match » sous chaque match quand tu enregistres un tournoi (points gagnants, fautes directes, smashs, doubles fautes).</p>`}</section>`;
}
function recoveryCharts(){
  const E=Object.entries(data.checkins).sort();const sl=E.filter(([,c])=>num(c.sleepH)).map(([d,c])=>({x:d,y:num(c.sleepH)})),hr=E.filter(([,c])=>num(c.hr)).map(([d,c])=>({x:d,y:num(c.hr)}));
  if(!sl.length&&!hr.length)return "";
  return `<section class="card stack"><div><div class="eyebrow">Sommeil et fréquence cardiaque au réveil</div><h2>Récupération</h2></div>
   ${sl.length?lineChart([{pts:sl,color:"var(--b1)",area:true}],{unit:"h",target:7.5,targetLabel:"repère",h:180}):""}
   ${hr.length?lineChart([{pts:hr,color:"var(--b3)"},{pts:movingAvg(hr,7),color:"var(--b3)",dashed:true,dots:false,label:"moyenne 7 j"}],{unit:"bpm",h:180,dec:0}):""}
   <p class="muted small">Une FC au réveil supérieure de 5 à 8 bpm à ta moyenne signale une récupération incomplète (fatigue, maladie, mauvais sommeil, alcool).</p></section>`;
}
function habitsInsight(){
  const days=Object.entries(data.nutri);if(days.length<7)return "";
  const next=d=>checkinScore(data.checkins[addDays(d,1)]);
  const grp=f=>days.filter(([d,n])=>f(n)).map(([d])=>next(d)).filter(x=>x!=null);
  const a1=grp(n=>(n.alcool||0)>0),a0=grp(n=>!(n.alcool||0)),c1=grp(n=>(n.cafe||0)>=4),c0=grp(n=>(n.cafe||0)<4);
  const L=[];if(a1.length>=2&&a0.length>=2)L.push(`Forme du lendemain après alcool : <b>${Math.round(avg(a1))}</b>/100, sans alcool : <b>${Math.round(avg(a0))}</b>/100.`);
  if(c1.length>=2&&c0.length>=2)L.push(`Après 4 cafés ou plus : <b>${Math.round(avg(c1))}</b>/100, sinon : <b>${Math.round(avg(c0))}</b>/100.`);
  return L.length?`<div class="alert small">${L.join("<br>")} <span class="muted">Évite la caféine après 16 h les veilles de tournoi.</span></div>`:"";
}
