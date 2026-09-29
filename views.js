/* Programme Padel — écrans Aujourd'hui, Semaine, séance et mode séance guidé */
"use strict";
const state={tab:"today",sub:null,week:null,day:null,open:new Set(),cat:"",q:"",testKey:"saut",exKey:"squat_goblet",cyc:null,painZone:null,moveFor:null,run:null,bilanDays:30,icsRange:"4"};
try{const r=JSON.parse(localStorage.getItem("padel-ui")||"{}");if(r.tab)state.tab=r.tab;if(r.sub)state.sub=r.sub;}catch(e){}
function saveUi(){try{localStorage.setItem("padel-ui",JSON.stringify({tab:state.tab,sub:state.sub}));}catch(e){}}

const itemName=k=>EX[k]?exName(k):(GEN[k]||k);
const hasTimer=(it,p)=>!!buildTimer(it[0],setsOf(it[1],p.dl),it[2],it[3],p.kind);
function kindChip(k){return `<span class="kchip k-${k}">${KIND_LABEL[k]||""}</span>`;}

/* ---------- Saisie série par série ---------- */
function ensureLog(p){
  const l=data.logs[p.id];if(l)return l;
  const di=DAY_KEYS.indexOf(p.d);
  const n={week:p.w,day:p.d,date:dateOf(p.w,di),duree:p.dur,rpe:null,done:false,note:"",sets:{},created:Date.now()};
  data.logs[p.id]=n;return n;
}
function unitOf(k,r){if(/^\d+\s*s\b/.test(r||""))return "s";return LOADED.has(k)?"kg":"reps";}
function setRows(p,i,it){
  const [k,s,r]=it;if(!EX[k]||s==null||"CMR".includes(p.kind))return "";
  const n=setsOf(s,p.dl),log=data.logs[p.id],cur=(log&&log.sets&&log.sets[i]&&log.sets[i].s)||[],u=unitOf(k,r);
  const last=lastPerf(k,p.id),sug=u==="kg"?suggestLoad(k,r,p.id):null,best=u==="kg"?bestOf(k,p.id):null;
  const target=parseInt(r,10)||"";
  const rows=Array.from({length:n},(_,j)=>{const v=cur[j]||{};
    const pr=u==="kg"&&best&&num(v.kg)&&num(v.kg)>best.kg&&best.kg>0;
    return `<div class="setrow ${pr?"pr":""}"><span class="sn">S${j+1}</span>
      ${u==="kg"?`<input inputmode="decimal" class="si" data-set="${p.id}|${i}|${j}|kg|${k}" value="${esc(v.kg??"")}" placeholder="${sug?fmt(sug.kg):last&&last.top!=null?fmt(last.top):"kg"}" aria-label="Série ${j+1} kilos"><span class="sx">kg ×</span>`:""}
      <input inputmode="numeric" class="si" data-set="${p.id}|${i}|${j}|reps|${k}" value="${esc(v.reps??"")}" placeholder="${u==="s"?parseInt(r,10)||"s":target||"reps"}" aria-label="Série ${j+1} ${u==="s"?"secondes":"répétitions"}"><span class="sx">${u==="s"?"s":"reps"}</span>${pr?`<span class="prtag">Record</span>`:""}</div>`;}).join("");
  const info=u==="kg"&&(last||sug)?`<div class="setinfo">${sug?`<b>Suggestion : ${fmt(sug.kg)} kg</b> <span class="muted">(${esc(sug.why)})</span>`:""}${last?`<span class="muted"> · Dernière fois (${fr(last.date)}) : ${last.sets.map(x=>(x.kg?fmt(num(x.kg))+"×":"")+(x.reps||"–")).join(" / ")}</span>`:""}</div>`:"";
  return `<div class="sets">${rows}${info}</div>`;
}
function onSetInput(el){
  const [id,i,j,field,k]=el.dataset.set.split("|");const [w,d]=[+id.slice(1,id.indexOf("-")),id.slice(id.indexOf("-")+1)];
  const p=planFor(w,d),l=ensureLog(p);l.sets=l.sets||{};
  const e=l.sets[i]=l.sets[i]||{k,s:[]};e.k=k;e.s[+j]=e.s[+j]||{};e.s[+j][field]=el.value.trim();
  l.updated=Date.now();lsSave();
  if(field==="kg"){const b=bestOf(k,id),v=num(el.value);const row=el.closest(".setrow");
    if(v&&b.kg>0&&v>b.kg){if(row&&!row.classList.contains("pr")){row.classList.add("pr");row.insertAdjacentHTML("beforeend",`<span class="prtag">Record</span>`);toast(`Nouveau record sur ${exName(k)} : ${fmt(v)} kg`);buzz(80);}}
    else if(row&&row.classList.contains("pr")){row.classList.remove("pr");row.querySelector(".prtag")?.remove();}}
}
/* Résultat de test saisi directement dans la séance */
function testInput(p,i,it){
  const tk=it[4];if(!tk||p.kind!=="T")return "";const T=TESTS.find(t=>t.k===tk);const ds=dateOf(p.w,DAY_KEYS.indexOf(p.d));
  const row=data.tests["t-"+ds]||{};
  return `<div class="sets"><div class="setrow"><span class="sx">Mon résultat :</span><input inputmode="decimal" class="si wide" data-test="${ds}|${tk}" value="${esc(row[tk]??"")}" placeholder="${esc(T.u)}"><span class="sx">${esc(T.u)}</span></div></div>`;
}
function onTestInput(el){const [ds,tk]=el.dataset.test.split("|");const id="t-"+ds;const row=data.tests[id]||{id,date:ds};const v=num(el.value);if(v==null)delete row[tk];else row[tk]=v;data.tests[id]=row;lsSave();}

/* ---------- Ligne d'exercice ---------- */
function itemLi(p,it,i){
  const [k,s,r,note]=it,e=EX[k],id=`${p.id}-${i}`,open=state.open.has(id);
  let btns="";
  if(e)btns+=`<button class="howto" type="button" data-how="${id}" aria-expanded="${open}">${open?"Masquer":"Comment faire"}</button>`;
  if(/^warmup/.test(k))btns+=`<button class="howto" type="button" data-goto="more:guide">Voir l'échauffement</button>`;
  const tdef=buildTimer(k,setsOf(s,p.dl),r,note,p.kind);
  if(tdef)btns+=timerBtn(id,tdef);
  return `<li><span class="n">${i+1}</span><div class="li-main"><div class="nm">${esc(itemName(k))}</div>${r&&!(p.kind==="T"&&it[4])?`<div class="rx">${esc(rx(s,r,p.dl))}</div>`:""}${note?`<div class="nt">${esc(sideTxt(note))}</div>`:""}${btns?`<div class="btnrow">${btns}</div>`:""}
    ${setRows(p,i,it)}${testInput(p,i,it)}</div>
    ${tdef?timerSlot(id):""}${e?`<div class="exd-wrap" id="d-${id}" ${open?"":"hidden"}>${open?exDetail(k):""}</div>`:""}</li>`;
}
/* ---------- Carnet technique (jours de padel) ---------- */
function techBlock(p){
  if(!p.tech)return "";const ds=dateOf(p.w,DAY_KEYS.indexOf(p.d)),t=data.tech[ds]||{};
  return `<div class="techbox"><div class="eyebrow">Objectif technique du jour</div>
   <div class="form-row"><label>Thème<select data-tech="${ds}|theme"><option value="">Choisir…</option>${TECH_THEMES.map(x=>`<option ${t.theme===x?"selected":""}>${esc(x)}</option>`).join("")}</select></label>
   <label>Objectif précis<input data-tech="${ds}|goal" value="${esc(t.goal||"")}" placeholder="ex. bandeja croisée profonde, 7/10"></label>
   <label>Réussite (1–5)<select data-tech="${ds}|rating"><option value="">–</option>${[1,2,3,4,5].map(v=>`<option ${+t.rating===v?"selected":""}>${v}</option>`).join("")}</select></label></div>
   <label>Ce que j'ai appris / à retravailler<textarea data-tech="${ds}|notes" rows="2">${esc(t.notes||"")}</textarea></label></div>`;
}
function onTechInput(el){const [ds,f]=el.dataset.tech.split("|");const t=data.tech[ds]||{id:ds,date:ds};t[f]=el.value;data.tech[ds]=t;lsSave();}

/* ---------- Carte de séance complète ---------- */
function sessionFull(p){
  const log=data.logs[p.id]||{},di=DAY_KEYS.indexOf(p.d),adj=data.adj[p.id]||{};
  const canAdj="AP".includes(p.kind);
  return `<section class="card sess" style="display:flex;flex-direction:column;gap:14px">
   <div class="sess-head">
    <div><div class="eyebrow">${DAYS[di][1]} ${fr(dateOf(p.w,di))} · Semaine ${p.w}</div><h2>${esc(p.title)}</h2></div>
    <div class="meta"><span>≈ ${p.dur} min</span><span>${esc(p.place)}</span>${kindChip(p.kind)}${p.dl&&!p.short?`<span class="tag" style="color:var(--warn)">Allègement</span>`:""}${p.short?`<span class="tag" style="color:var(--warn)">Version courte</span>`:""}${p.home?`<span class="tag" style="color:var(--b2)">Version maison</span>`:""}${p.moved?`<span class="tag" style="color:var(--b3)">Déplacée</span>`:""}</div>
   </div>
   ${p.cue?`<div class="cue">${esc(sideTxt(p.cue))}</div>`:""}
   <div class="actions">
    ${p.kind!=="R"?`<button class="btn" type="button" data-run="${p.id}">${log.done?"Refaire en mode guidé":"Démarrer la séance"}</button>`:""}
    ${canAdj?`<button class="chip-btn" type="button" data-adj="${p.id}|short" aria-pressed="${!!adj.short}">Version courte</button><button class="chip-btn" type="button" data-adj="${p.id}|home" aria-pressed="${!!adj.home}">Pas de salle</button>`:""}
    <button class="chip-btn" type="button" data-move="${p.w}|${p.d}">Déplacer</button>
   </div>
   ${state.moveFor===`${p.w}|${p.d}`?moveBox(p):""}
   ${techBlock(p)}
   <ol class="ex">${p.items.map((it,i)=>itemLi(p,it,i)).join("")}</ol>
   ${logForm(p)}
  </section>`;
}
function logForm(p){
  const log=data.logs[p.id]||{},di=DAY_KEYS.indexOf(p.d);
  return `<form class="logform" data-log="${p.id}">
    <div class="form-row">
     <label>Date<input type="date" name="date" value="${esc(log.date||dateOf(p.w,di))}"></label>
     <label>Durée (min)<input type="number" inputmode="numeric" name="duree" min="0" step="5" value="${esc(log.duree??p.dur)}"></label>
     <label>Effort ressenti (RPE)<select name="rpe">${Array.from({length:10},(_,k)=>k+1).map(v=>`<option ${+(log.rpe??6)===v?"selected":""}>${v}</option>`).join("")}</select></label>
    </div>
    <label>Notes (sensations, douleurs, ce qui a coincé)<textarea name="note" rows="2">${esc(log.note||"")}</textarea></label>
    <div class="actions"><button class="btn" type="submit">${log.done?"Mettre à jour":"Séance faite ✓"}</button>${log.done?`<span class="okline">Enregistrée le ${fr(log.date)}</span>`:""}${data.logs[p.id]?`<button class="btn ghost small" type="button" data-dellog="${p.id}">Effacer</button>`:""}</div>
  </form>`;
}
/* ---------- Déplacer une séance ---------- */
function moveBox(p){
  const w=p.w,T=tDay(w),tIdx={ven:4,sam:5,dim:6}[T];
  return `<div class="movebox"><div class="eyebrow">Échanger ${DAYS[DAY_KEYS.indexOf(p.d)][1].toLowerCase()} avec…</div><div class="filters">${DAYS.filter(([d])=>d!==p.d).map(([d,l],i)=>{
    const di=DAY_KEYS.indexOf(d),src=planFor(w,p.d);let warn="";
    if(src.kind==="A"&&tIdx!=null&&tIdx-di<3&&tIdx-di>=0)warn=" ⚠";
    return `<button type="button" data-swap="${w}|${p.d}|${d}" title="${warn?"Moins de 3 jours avant le tournoi":""}">${l.slice(0,3)}${warn}</button>`;}).join("")}
   ${data.swaps["w"+w]&&Object.keys(data.swaps["w"+w]).length?`<button type="button" data-swapreset="${w}">Annuler les déplacements</button>`:""}</div>
   <p class="muted small">⚠ = la séance de force tomberait à moins de 3 jours du tournoi. Possible, mais passe-la en version courte.</p></div>`;
}
function doSwap(w,a,b){
  const sw={...(data.swaps["w"+w]||{})},srcA=sw[a]||a,srcB=sw[b]||b;
  sw[a]=srcB;sw[b]=srcA;Object.keys(sw).forEach(k=>{if(sw[k]===k)delete sw[k];});
  // les séances déjà enregistrées suivent leur jour
  const la=data.logs[`s${w}-${a}`],lb=data.logs[`s${w}-${b}`];
  if(la||lb){if(la)data.logs[`s${w}-${b}`]=la;else delete data.logs[`s${w}-${b}`];if(lb)data.logs[`s${w}-${a}`]=lb;else delete data.logs[`s${w}-${a}`];}
  data.swaps["w"+w]=sw;state.moveFor=null;state.day=b;lsSave();renderApp();toast("Séances échangées");
}

/* ---------- Écran Aujourd'hui ---------- */
function checkinCard(){
  const t=todayIso(),c=data.checkins[t];
  const Q=[["sleep","Sommeil","1 très mauvais · 5 excellent"],["sore","Courbatures","1 aucune · 5 fortes"],["fatigue","Fatigue","1 frais · 5 épuisé"],["motiv","Motivation","1 aucune · 5 à fond"]];
  const draft=state.ck||c||{};
  if(c&&!state.ckEdit){const sc=checkinScore(c),lvl=sc>=70?"ok":sc>=50?"mid":"low";
    const ref=todayRef(),p=ref?planFor(ref.w,ref.d):null,adj=p?data.adj[p.id]||{}:{};
    return `<section class="card ck ck-${lvl}"><div class="sess-head"><div><div class="eyebrow">Forme du matin</div><h3>${sc}/100 · ${lvl==="ok"?"En forme":lvl==="mid"?"Correct":"Forme basse"}</h3></div><button class="chip-btn" type="button" data-ckedit="1">Modifier</button></div>
     <p class="small">${lvl==="ok"?"Séance normale : vas-y.":lvl==="mid"?"Séance normale, mais écoute tes sensations sur les dernières séries.":"Journée à alléger : version courte, pas de série jusqu'à l'échec, et priorité au sommeil ce soir."}</p>
     ${lvl==="low"&&p&&"AP".includes(p.kind)&&!adj.short?`<button class="btn small" type="button" data-adj="${p.id}|short">Passer la séance du jour en version courte</button>`:""}</section>`;}
  return `<section class="card ck"><div class="eyebrow">Forme du matin · 30 secondes</div>
   ${Q.map(([k,l,h])=>`<div class="ckrow"><div><b>${l}</b><div class="muted small">${h}</div></div><div class="ckopts">${[1,2,3,4,5].map(v=>`<button type="button" data-ck="${k}|${v}" aria-pressed="${+draft[k]===v}">${v}</button>`).join("")}</div></div>`).join("")}
   <button class="btn" type="button" data-cksave="1" ${Q.every(([k])=>draft[k])?"":"disabled"}>Enregistrer</button></section>`;
}
function alertsHtml(){
  const out=[],ref=todayRef();
  painAlerts().forEach(a=>out.push(`<div class="alert bad"><b>Douleur récurrente : ${esc(a.zone)}</b> (${a.n} fois en 14 jours, jusqu'à ${a.max}/10). Allège les exercices qui la sollicitent. Si ça persiste, consulte un kiné. <button class="linkbtn" data-goto="more:douleurs">Voir</button></div>`));
  if(ref&&ref.w>1){const a=acwr(ref.w-1);if(a&&a.ratio>1.3)out.push(`<div class="alert warn"><b>Charge en forte hausse</b> : la semaine dernière était ${Math.round((a.ratio-1)*100)} % au-dessus de ta moyenne. Cette semaine, passe les séances en version courte si tu te sens lourd.</div>`);}
  if(backupDue())out.push(`<div class="alert"><b>Pense à sauvegarder</b> : ${data.meta.main.lastExport?"ta dernière sauvegarde date du "+fr(data.meta.main.lastExport)+".":"tu n'as encore jamais exporté tes données."} <button class="linkbtn" data-export="1">Exporter maintenant</button></div>`);
  return out.join("");
}
function recapCard(w,title){
  const r=weekRecap(w);
  return `<section class="card recap"><div class="sess-head"><div><div class="eyebrow">${esc(title)}</div><h3>Semaine ${w} · ${esc(blockOf(w).name)}</h3></div><button class="chip-btn" type="button" data-shareweek="${w}">Partager</button></div>
   <div class="kpis sm">
    <div class="kpi"><div class="v num">${r.done}/${r.planned}</div><div class="k">séances</div></div>
    <div class="kpi"><div class="v num">${fmt(r.load,0)}</div><div class="k">charge (UA)</div></div>
    <div class="kpi"><div class="v num">${r.mob}/7</div><div class="k">mobilité</div></div>
    <div class="kpi"><div class="v num">${r.weight?fmt(r.weight):"–"}</div><div class="k">poids moyen</div></div>
    <div class="kpi"><div class="v num">${r.checkin!=null?Math.round(r.checkin):"–"}</div><div class="k">forme matin</div></div>
    <div class="kpi"><div class="v num">${r.prs.length}</div><div class="k">records</div></div>
   </div>
   ${r.tournois.length?`<p class="small">Tournoi : ${r.tournois.map(t=>`${esc(t.cat)} ${esc(t.lieu||"")} — ${esc(t.res||"?")}, forme ${t.physique}/10`).join(" · ")}</p>`:""}
   ${r.acwr?`<p class="small muted">Charge vs moyenne des 4 semaines précédentes : ${fmt(r.acwr.ratio,2)} ${r.acwr.ratio>1.3?"(forte hausse)":r.acwr.ratio<0.8?"(semaine légère)":"(zone idéale 0,8–1,3)"}</p>`:""}
  </section>`;
}
function nutriQuick(){
  const t=todayIso(),n=data.nutri[t]||{},T=nutritionTargets(),glasses=Math.round(T.water*4);
  return `<section class="card"><div class="sess-head"><div><div class="eyebrow">Nutrition du jour</div><h3>${T.kcal} kcal · ${T.prot} g de protéines</h3></div><button class="linkbtn" data-goto="more:nutrition">Détails</button></div>
   <div class="nq"><button class="chip-btn" type="button" data-nutri="prot" aria-pressed="${!!n.prot}">${n.prot?"✓ ":""}Protéines atteintes</button>
   <div class="water"><span>Eau</span><button class="rbtn" type="button" data-water="-1" aria-label="Retirer un verre">−</button><b class="num">${n.water||0}/${glasses}</b><button class="rbtn" type="button" data-water="1" aria-label="Ajouter un verre">+</button><span class="muted small">verres de 25 cl</span></div></div></section>`;
}
function renderToday(){
  const t=todayIso(),dts=daysToStart(),ref=todayRef(),out=[];
  out.push(`<div class="hello"><div class="eyebrow">${esc(frLong(t))}</div><h1>${ref?`Semaine ${ref.w}`:`Début dans ${plural(dts,"jour")}`}</h1><p class="muted">${ref?`${esc(blockOf(ref.w).name)} · cycle ${cycleOf(ref.w)}${isDeload(ref.w)?" · semaine d'allègement":""}`:`Ton programme commence le ${esc(frLong(startDate()))}.`}</p></div>`);
  out.push(alertsHtml());
  out.push(checkinCard());
  if(ref){
    const p=planFor(ref.w,ref.d),log=data.logs[p.id];
    out.push(`<section class="card today-sess"><div class="sess-head"><div><div class="eyebrow">Au programme aujourd'hui</div><h2>${esc(p.title)}</h2></div>${kindChip(p.kind)}</div>
      <div class="meta"><span>≈ ${p.dur} min</span><span>${esc(p.place)}</span>${p.short?`<span class="tag" style="color:var(--warn)">Version courte</span>`:""}${p.home?`<span class="tag" style="color:var(--b2)">Version maison</span>`:""}</div>
      ${p.cue?`<p class="small">${esc(sideTxt(p.cue))}</p>`:""}
      <ol class="mini">${p.items.map(it=>`<li><span>${esc(itemName(it[0]))}</span><span class="rx">${esc(it[2]?rx(it[1],it[2],p.dl):"")}</span></li>`).join("")}</ol>
      ${log&&log.done?`<div class="okline big">✓ Séance faite · ${log.duree||"?"} min · RPE ${log.rpe||"?"}</div>`:""}
      <div class="actions">${p.kind!=="R"?`<button class="btn big" type="button" data-run="${p.id}">${log&&log.done?"Refaire":"Démarrer la séance"}</button>`:""}
       <button class="chip-btn" type="button" data-openday="${ref.w}|${ref.d}">Détail et saisie</button>
       ${"AP".includes(p.kind)?`<button class="chip-btn" type="button" data-adj="${p.id}|short" aria-pressed="${!!(data.adj[p.id]||{}).short}">Version courte</button><button class="chip-btn" type="button" data-adj="${p.id}|home" aria-pressed="${!!(data.adj[p.id]||{}).home}">Pas de salle</button>`:""}</div>
    </section>`);
    if(p.kind==="M")out.push(`<section class="card"><div class="eyebrow">Jour de tournoi</div><h3>Ta journée</h3><div class="actions"><button class="chip-btn" data-goto="more:tournoi">Checklist du sac</button>${timerBtn("rt-warm",{label:"Échauffement d'avant-match",ph:ROUTINES.match_warmup.ph()},"chip-btn")}${timerBtn("rt-between",{label:"Entre deux matchs",ph:ROUTINES.between.ph()},"chip-btn")}<button class="chip-btn" data-goto="more:tournois">Noter mon tournoi</button></div>${timerSlot("rt-warm")}${timerSlot("rt-between")}</section>`);
  }else{
    out.push(`<section class="card"><div class="eyebrow">En attendant le début</div><h3>Prends déjà les bonnes habitudes</h3><ul class="clean"><li>Fais la routine de mobilité chaque jour (ci-dessous).</li><li>Pèse-toi le matin du ${esc(fr(startDate()))} pour avoir un point de départ exact.</li><li>Parcours les fiches d'exercices et regarde les mouvements animés.</li><li>Règle ton côté de jeu, ton thème et la voix dans Plus → Réglages.</li></ul></section>`);
  }
  const mdone=!!data.mobilite[t];
  out.push(`<section class="card"><div class="sess-head"><div><div class="eyebrow">Mobilité quotidienne · 12 min</div><h3>${mdone?"✓ Faite aujourd'hui":"À faire aujourd'hui"}</h3></div><span class="muted small">Série : ${plural(mobStreak(),"jour")}</span></div>
    <div class="actions">${timerBtn("mob-today",{label:"Lancer la routine guidée",ph:mobilityPhases(),onDone:()=>{}},"btn ghost")}<button class="chip-btn" type="button" data-mob="${t}" aria-pressed="${mdone}">${mdone?"Annuler":"Marquer comme faite"}</button></div>${timerSlot("mob-today")}</section>`);
  if(ref){const w=ref.w;out.push(`<section class="card"><div class="eyebrow">Mon tournoi cette semaine commence</div><div class="filters">${TDAYS.map(([k,l])=>`<button data-tday="${w}|${k}" aria-pressed="${tDay(w)===k}">${l}</button>`).join("")}</div><p class="muted small">Le programme de la semaine s'adapte automatiquement.</p></section>`);}
  const ws=sortedWeights(),lw=ws[ws.length-1];
  out.push(`<section class="card"><div class="sess-head"><div><div class="eyebrow">Poids</div><h3>${lw?fmt(lw.kg)+" kg":"–"} <span class="muted small">${lw?"le "+fr(lw.date):""}</span></h3></div><button class="linkbtn" data-goto="stats">Courbe</button></div>
    <form class="inline" data-quickweight="1"><input type="number" step="0.1" inputmode="decimal" name="kg" placeholder="Pesée du jour (kg)" aria-label="Poids du jour"><button class="btn small" type="submit">Ajouter</button></form></section>`);
  out.push(nutriQuick());
  if(ref){const dnum=DAY_KEYS.indexOf(ref.d);
    if(ref.w>1&&dnum<=1)out.push(recapCard(ref.w-1,"Bilan de la semaine dernière"));
    else out.push(recapCard(ref.w,"Semaine en cours"));
    const tm=addDays(t,1),tw=weekOfDate(tm);if(tw>=1){const tp=planFor(tw,dayKeyOf(tm));out.push(`<section class="card soft"><div class="eyebrow">Demain</div><h3>${esc(tp.title)}</h3><p class="muted small">≈ ${tp.dur} min · ${esc(tp.place)}</p></section>`);}
  }
  return out.join("");
}

/* ---------- Écran Semaine ---------- */
function mobRow(w){
  const tdy=todayIso(),done=DAYS.filter((_,i)=>data.mobilite[dateOf(w,i)]).length;
  return `<div class="mob-row"><div><div class="eyebrow">Mobilité quotidienne</div><div class="muted small">${done}/7 cette semaine · série : ${plural(mobStreak(),"jour")}</div></div>
   <div class="mob-days">${DAYS.map(([d,lab],i)=>{const dt=dateOf(w,i),on=!!data.mobilite[dt];return `<button class="mob-day ${on?"on":""} ${dt===tdy?"today":""}" data-mob="${dt}" aria-pressed="${on}">${on?"✓ ":""}${lab.slice(0,3)}</button>`;}).join("")}</div></div>`;
}
function renderWeek(){
  const cw=curWeek();if(state.week==null)state.week=cw;
  const w=state.week,c=cycleOf(w),maxC=Math.max(cycleOf(cw)+1,2),bl=blockOf(w),st=weekStats(w),tdy=todayIso();
  if(!state.day){const idx=DAYS.findIndex((_,i)=>dateOf(w,i)===tdy);state.day=DAY_KEYS[idx>=0?idx:2];}
  const strip=Array.from({length:12},(_,i)=>{const ww=(c-1)*12+i+1,b=blockOf(ww),s2=weekStats(ww);
    return `<button class="wk ${ww===w?"sel":""} ${ww===cw?"now":""}" data-week="${ww}" aria-pressed="${ww===w}" aria-label="Semaine ${ww}">S${ww}<span class="bar" style="background:${b.color};opacity:${isDeload(ww)?.45:1}"></span><span class="dl">${s2.done?s2.done+"✓":isDeload(ww)?"allèg.":"&nbsp;"}</span></button>`;}).join("");
  const p=planFor(w,state.day);
  return `<section class="card" style="display:flex;flex-direction:column;gap:12px">
   <div class="sess-head"><div><div class="eyebrow">Cycle ${c} · du ${fr(dateOf(w,0))} au ${fr(dateOf(w,6))}</div><h2 style="color:${bl.color}">${esc(bl.name)}${isDeload(w)?" · allègement":""}</h2></div>
    <div class="filters">${Array.from({length:maxC},(_,i)=>`<button data-cyc="${i+1}" aria-pressed="${c===i+1}">Cycle ${i+1}</button>`).join("")}</div></div>
   <div class="strip">${strip}</div>
   <div class="meta"><span><b class="num">${st.done}/${st.planned}</b> séances</span><span>Charge <b class="num">${fmt(st.load,0)}</b> UA</span>${weekPRs(w).length?`<span><b>${weekPRs(w).length}</b> record(s)</span>`:""}</div>
   <div class="days">${DAYS.map(([d,lab],i)=>{const pl=planFor(w,d),l=data.logs[`s${w}-${d}`],dt=dateOf(w,i);
     return `<button class="day ${d===state.day?"sel":""} ${l&&l.done?"done":""} ${dt===tdy?"today":""}" data-day="${d}"><span class="d"><span>${lab.slice(0,3)}</span><span>${fr(dt)}</span></span><span class="t">${esc(pl.title)}</span><span class="chip">${l&&l.done?"Fait":KIND_LABEL[pl.kind]}${pl.moved?" ↔":""}</span></button>`;}).join("")}</div>
   <div class="tsel"><span class="eyebrow">Tournoi cette semaine</span><div class="filters">${TDAYS.map(([k,l])=>`<button data-tday="${w}|${k}" aria-pressed="${tDay(w)===k}">${l}</button>`).join("")}</div></div>
   ${mobRow(w)}
  </section>
  ${sessionFull(p)}`;
}

/* ---------- Mode séance guidé (plein écran) ---------- */
function openRunner(pid){
  const w=+pid.slice(1,pid.indexOf("-")),d=pid.slice(pid.indexOf("-")+1),p=planFor(w,d);
  state.run={id:pid,w,d,idx:0,t0:Date.now(),rpe:(data.logs[pid]||{}).rpe||6,note:(data.logs[pid]||{}).note||""};
  if(TM.id)tmClose();
  document.body.classList.add("running");keepAwake(true);renderRunner();
}
function closeRunner(){if(TM.id)tmClose();state.run=null;document.body.classList.remove("running");keepAwake(false);$("#runner").innerHTML="";$("#runner").hidden=true;renderApp();}
function renderRunner(){
  const R=state.run;if(!R)return;const p=planFor(R.w,R.d),n=p.items.length,host=$("#runner");host.hidden=false;
  const last=R.idx>=n;
  let body="";
  if(!last){
    const it=p.items[R.idx],[k,s,r,note]=it,e=EX[k],tid="run";
    const def=buildTimer(k,setsOf(s,p.dl),r,note,p.kind);
    if(def){def.onManual=j=>{if(j==null)return;const inp=host.querySelector(`[data-set$="|${R.idx}|${j}|reps|${k}"]`);if(inp&&!inp.value){inp.value=parseInt(r,10)||"";onSetInput(inp);}};TMREG[tid]=def;if(TM.id!==tid){TM.id=null;tmOpen(tid);}}
    else if(TM.id)tmClose();
    body=`<div class="rstep">
      <div class="eyebrow">Étape ${R.idx+1} sur ${n}</div>
      <h2>${esc(itemName(k))}</h2>
      ${r&&!(p.kind==="T"&&it[4])?`<div class="rx big">${esc(rx(s,r,p.dl))}</div>`:""}
      ${note?`<p class="small">${esc(sideTxt(note))}</p>`:""}
      ${e?figHtml(k):""}
      ${setRows(p,R.idx,it)}${testInput(p,R.idx,it)}
      ${def?`<div class="tm-slot" id="tm-slot-run">${TM.id==="run"?tmPanel():""}</div>`:""}
      ${e?`<details><summary>Comment faire</summary>${exDetail(k,{noFig:true,history:false})}</details>`:""}
      ${R.idx===0&&p.tech?techBlock(p):""}
    </div>`;
  }else{
    if(TM.id)tmClose();
    const mins=Math.max(1,Math.round((Date.now()-R.t0)/60000));
    body=`<div class="rstep"><div class="eyebrow">Fin de séance</div><h2>Bien joué !</h2>
      <p class="muted">${esc(p.title)} · ${n} étapes</p>
      <form class="logform" data-runsave="${p.id}">
       <div class="form-row"><label>Durée (min)<input type="number" inputmode="numeric" name="duree" value="${Math.max(mins,(data.logs[p.id]||{}).duree&&mins<5?data.logs[p.id].duree:mins)}"></label></div>
       <div><div class="eyebrow">Effort ressenti (RPE)</div><div class="ckopts wide">${Array.from({length:10},(_,i)=>i+1).map(v=>`<button type="button" data-rrpe="${v}" aria-pressed="${R.rpe===v}">${v}</button>`).join("")}</div><p class="muted small">6 = facile · 8 = encore 2 répétitions en réserve · 10 = maximum</p></div>
       <label>Notes<textarea name="note" rows="3" placeholder="Sensations, douleurs, ce qui a coincé">${esc(R.note)}</textarea></label>
       <button class="btn big" type="submit">Enregistrer la séance</button>
      </form></div>`;
  }
  host.innerHTML=`<div class="rbar"><button class="rclose" type="button" data-rclose="1" aria-label="Fermer">✕</button><div class="rprog"><span style="width:${Math.min(100,R.idx/n*100)}%"></span></div><span class="num small">${Math.min(R.idx+1,n)}/${n}</span></div>
   <div class="rbody" id="rbody">${body}</div>
   <div class="rnav"><button class="btn ghost" type="button" data-rnav="-1" ${R.idx===0?"disabled":""}>Précédent</button>${last?"":`<button class="btn" type="button" data-rnav="1">${R.idx===n-1?"Terminer":"Suivant"}</button>`}</div>`;
  host.querySelector("#rbody").scrollTop=0;
}
function runnerGo(dir){const R=state.run;if(!R)return;const n=planFor(R.w,R.d).items.length;R.idx=clamp(R.idx+dir,0,n);if(TM.id)tmClose();renderRunner();}
