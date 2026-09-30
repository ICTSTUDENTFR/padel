/* Programme Padel — espace coach, partenaire, statistiques de match en direct */
"use strict";

/* =====================================================================
   1. Liens suivis (joueurs d'un coach, partenaire)
   ===================================================================== */
const FOLLOW={cache:{}};
function parseShareLink(u){try{const h=String(u).split("#")[1]||"";const q=new URLSearchParams(h);const token=q.get("partage"),s=q.get("s"),k=q.get("k");
  if(!token||!s||!k)return null;return {token,s,k,url:String(u).trim()};}catch(e){return null;}}
async function fetchFollow(f){const L=parseShareLink(f.url);if(!L){FOLLOW.cache[f.id]={err:"Lien invalide"};return;}
  FOLLOW.cache[f.id]={loading:true};
  try{const r=await fetch(L.s.replace(/\/+$/,"")+"/rest/v1/rpc/padel_shared",{method:"POST",headers:{apikey:L.k,Authorization:"Bearer "+L.k,"Content-Type":"application/json"},body:JSON.stringify({p_token:L.token})});
    const d=await r.json();if(!r.ok||!d)throw new Error("lien désactivé");FOLLOW.cache[f.id]={data:d,at:Date.now()};}
  catch(e){FOLLOW.cache[f.id]={err:"Lien désactivé ou introuvable"};}
  renderApp();}
/* Calcule avec les données d'un autre joueur, sans toucher aux tiennes */
function withForeign(d,fn){const saved={};COLLS.forEach(c=>{saved[c]=data[c];data[c]=d&&d[c]&&typeof d[c]==="object"?d[c]:{};});
  if(!data.settings.main)data.settings.main={...DEFAULT_SETTINGS};else data.settings.main={...DEFAULT_SETTINGS,...data.settings.main};
  if(!data.meta.main)data.meta.main={updatedAt:0};
  try{return fn();}catch(e){return null;}finally{COLLS.forEach(c=>{data[c]=saved[c];});}}
function playerSummary(d){return withForeign(d,()=>{const t=todayIso(),ref=todayRef(),s=S_();
  const w=ref?ref.w:curWeek(),st=weekStats(w);
  const ck=[0,1,2,3,4,5,6].map(k=>checkinScore(data.checkins[addDays(t,-k)],addDays(t,-k))).filter(x=>x!=null);
  const four=[0,1,2,3].map(k=>w-k).filter(x=>x>=1).map(x=>weekStats(x));
  const done4=four.reduce((a,x)=>a+x.done,0),pl4=four.reduce((a,x)=>a+x.planned,0);
  const lastLog=Object.values(data.logs).filter(l=>l&&l.done&&l.date).sort((a,b)=>b.date.localeCompare(a.date))[0];
  const ws=sortedWeights(),wl=ws.length?ws[ws.length-1]:null,w30=ws.filter(x=>x.date>=addDays(t,-30));
  const ev=upcomingEvents()[0]||null;
  return {name:s.name,level:s.level,side:s.side,started:!!ref,w,block:blockOf(w).name,done:st.done,planned:st.planned,form:avg(ck),adh4:pl4?done4/pl4:null,
    last:lastLog?lastLog.date:null,pains:painAlerts(),weight:wl?+wl.kg:null,wDelta:w30.length>1?+w30[w30.length-1].kg-+w30[0].kg:null,ev,
    today:ref?planFor(ref.w,ref.d).title:null,
    events:upcomingEvents().slice(0,6),notes:Object.values(data.tournois).filter(x=>x&&x.date>=addDays(t,-60)).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,3)};});}
function followForm(kind){return `<form class="stack" data-followadd="${kind}"><div class="form-row"><label>${kind==="joueur"?"Nom du joueur":"Nom de ton partenaire"}<input name="name" maxlength="40" required></label>
   <label>Lien de partage reçu<input name="url" type="url" required placeholder="https://…#partage=…" autocapitalize="off"></label></div><div><button class="btn" type="submit">Ajouter</button></div></form>`;}
function followList(kind){return Object.values(data.follows).filter(f=>f&&f.kind===kind).sort((a,b)=>String(a.name).localeCompare(String(b.name)));}
function ensureFetched(list){list.forEach(f=>{const c=FOLLOW.cache[f.id];if(!c||(!c.loading&&c.at&&Date.now()-c.at>5*60000))fetchFollow(f);});}
const pctx=x=>x==null?"–":Math.round(x*100)+" %";
SUBS.coach=()=>{const list=followList("joueur");ensureFetched(list);
  const card=f=>{const c=FOLLOW.cache[f.id]||{};const S=c.data?playerSummary(c.data):null;
    return `<section class="card stack pcard"><div class="sess-head"><div><div class="eyebrow">${S?esc([S.level,S.side?"côté "+S.side:""].filter(Boolean).join(" · ")):"Joueur"}</div><h3>${esc(f.name)}</h3></div>
      <div class="actions"><a class="chip-btn" href="${esc(f.url)}" target="_blank" rel="noopener">Ouvrir</a><button class="chip-btn" type="button" data-followdel="${f.id}">Retirer</button></div></div>
     ${c.loading&&!S?`<p class="muted small">Chargement…</p>`:c.err?`<p class="small bad-txt">${esc(c.err)}</p>`:S?`
      <div class="kpis"><div class="kpi"><div class="v num">${S.done}/${S.planned}</div><div class="k">séances cette semaine${S.started?` (S${S.w})`:""}</div></div>
       <div class="kpi"><div class="v num">${S.form!=null?fmt(S.form,0):"–"}</div><div class="k">forme du matin (7 j)</div></div>
       <div class="kpi"><div class="v num">${pctx(S.adh4)}</div><div class="k">régularité sur 4 semaines</div></div>
       <div class="kpi"><div class="v num">${S.weight!=null?fmt(S.weight,1):"–"}</div><div class="k">kg${S.wDelta!=null?` (${S.wDelta>0?"+":""}${fmt(S.wDelta,1)} sur 30 j)`:""}</div></div></div>
      <ul class="clean small">${S.today?`<li><b>Aujourd'hui :</b> ${esc(S.today)}</li>`:""}<li><b>Dernière séance :</b> ${S.last?esc(fr(S.last)):"aucune"}</li>
       ${S.ev?`<li><b>Prochain tournoi :</b> ${esc(fr(S.ev.date))} · ${esc(S.ev.cat||"")} ${esc(S.ev.lieu||"")}${S.ev.goal?" (objectif)":""}</li>`:""}
       ${S.pains.length?`<li class="bad-txt"><b>Douleurs :</b> ${S.pains.map(p=>`${esc(p.zone)} (${p.n}×, max ${p.max}/10)`).join(", ")}</li>`:""}</ul>`:""}</section>`;};
  return `<section class="card stack"><div><div class="eyebrow">Tu entraînes plusieurs joueurs ?</div><h2>Espace coach</h2></div>
    <p class="small">Chaque joueur crée un lien de partage dans <b>Plus &gt; Réglages &gt; Partager avec un coach</b> et te l'envoie. Colle-le ici : tu suis tous tes joueurs sur un seul écran (lecture seule).</p>
    ${followForm("joueur")}${list.length?`<div class="actions"><button class="chip-btn" type="button" data-followreload="joueur">Actualiser</button></div>`:""}</section>
   ${list.length?`<div class="grid2">${list.map(card).join("")}</div>`:`<section class="card"><div class="empty">Aucun joueur suivi pour l'instant.</div></section>`}`;};
SUBS.partenaire=()=>{const list=followList("partenaire");ensureFetched(list);const f=list[0];
  if(!f)return `<section class="card stack"><div><div class="eyebrow">Jouez coordonnés</div><h2>Mon partenaire</h2></div>
    <p class="small">Demande à ton partenaire de créer un lien de partage (Plus &gt; Réglages &gt; Partager avec un coach) et colle-le ici. Tu verras ses tournois à venir, sa forme et ses notes de match. Envoie-lui aussi le tien !</p>${followForm("partenaire")}</section>`;
  const c=FOLLOW.cache[f.id]||{},S=c.data?playerSummary(c.data):null;
  const mine=new Set(upcomingEvents().map(e=>e.date+"|"+(e.lieu||"").toLowerCase()));
  return `<section class="card stack"><div class="sess-head"><div><div class="eyebrow">Mon partenaire</div><h2>${esc(f.name)}</h2></div><div class="actions"><button class="chip-btn" type="button" data-followreload="partenaire">Actualiser</button><button class="chip-btn" type="button" data-followdel="${f.id}">Retirer</button></div></div>
    ${c.loading&&!S?`<p class="muted small">Chargement…</p>`:c.err?`<p class="small bad-txt">${esc(c.err)}</p>`:S?`
     <div class="kpis"><div class="kpi"><div class="v num">${S.form!=null?fmt(S.form,0):"–"}</div><div class="k">sa forme (7 j)</div></div><div class="kpi"><div class="v num">${S.done}/${S.planned}</div><div class="k">ses séances cette semaine</div></div></div>`:""}</section>
   ${S?`<section class="card stack"><h3>Ses tournois à venir</h3>${S.events.length?`<ul class="adm-list">${S.events.map(e=>{const has=mine.has(e.date+"|"+(e.lieu||"").toLowerCase());
      return `<li><div><b>${esc(fr(e.date))}${e.end&&e.end!==e.date?" → "+esc(fr(e.end)):""}</b> · ${esc(e.cat||"")} ${esc(e.lieu||"")}${e.registered?" · inscrit":""}</div>${has?`<span class="okline small">✓ Aussi dans ton calendrier</span>`:`<div><button class="chip-btn" type="button" data-evcopy='${esc(JSON.stringify({date:e.date,end:e.end||null,cat:e.cat,lieu:e.lieu||"",deadline:e.deadline||null}))}'>Ajouter à mes tournois</button></div>`}</li>`;}).join("")}</ul>`:`<div class="empty">Aucun tournoi prévu.</div>`}</section>
    <section class="card stack"><h3>Ses notes de match récentes</h3>${S.notes.length?`<ul class="adm-list">${S.notes.map(t=>`<li><div class="muted small">${esc(fr(t.date))} · ${esc(t.cat||"")} ${esc(t.lieu||"")} · ${esc(t.res||"")}</div>${t.note?`<div>${esc(t.note)}</div>`:""}${(t.matches||[]).filter(m=>m.note).map(m=>`<div class="small">• ${esc(m.note)}</div>`).join("")}</li>`).join("")}</ul>`:`<div class="empty">Pas de note récente.</div>`}</section>`:""}`;};

/* =====================================================================
   2. Statistiques de match en direct
   ===================================================================== */
const MSTAT_KEYS={
  win:[["smash","Smash gagnant"],["volee","Volée gagnante"],["bandeja","Bandeja / víbora"],["lob","Lob gagnant"],["vitre","Sortie de vitre"],["force","Faute provoquée"]],
  err:[["f_fond","Faute du fond"],["f_volee","Faute de volée"],["f_smash","Smash raté"],["f_bandeja","Bandeja ratée"],["f_lob","Lob trop court"],["df","Double faute"]]};
function liveMatch(){return data.mstats.live||null;}
function newLive(){data.mstats.live={id:uid(),date:todayIso(),opp:"",counts:{},sets:[[0,0]],log:[]};lsSave(true);}
function mTotals(m){const c=m.counts||{},sum=ks=>ks.reduce((a,[k])=>a+(c[k]||0),0);return {win:sum(MSTAT_KEYS.win),err:sum(MSTAT_KEYS.err)};}
SUBS.match=()=>{const L=liveMatch();const hist=Object.values(data.mstats).filter(m=>m&&m.id&&m.done).sort((a,b)=>b.date.localeCompare(a.date));
  const histHtml=hist.length?`<section class="card stack"><h3>Matchs enregistrés</h3><ul class="adm-list">${hist.slice(0,10).map(m=>{const T=mTotals(m);return `<li><div class="sess-head"><div><b>${esc(fr(m.date))}${m.opp?" · contre "+esc(m.opp):""}</b><div class="muted small">${(m.sets||[]).map(s=>s.join("-")).join(" ")} · ${T.win} points gagnants · ${T.err} fautes</div></div><button class="chip-btn" type="button" data-mdel="${m.id}">Supprimer</button></div></li>`;}).join("")}</ul></section>`:"";
  if(!L)return `<section class="card stack"><div><div class="eyebrow">Pendant le match, un appui par point</div><h2>Stats de match</h2></div>
    <p class="small">Note tes points gagnants et tes fautes directes pendant un match (entre les points ou aux changements de côté). Le coach de cours s'en sert pour te proposer quoi travailler.</p>
    <div><button class="btn big" type="button" data-mlive="new">Commencer un match</button></div></section>${histHtml}`;
  const c=L.counts||{},T=mTotals(L),set=L.sets[L.sets.length-1];
  const btn=(k,l,cls)=>`<button type="button" class="mbtn ${cls}" data-mhit="${k}"><span>${l}</span><b class="num">${c[k]||0}</b></button>`;
  return `<section class="card stack live"><div class="sess-head"><div><div class="eyebrow">Match en cours · ${esc(fr(L.date))}</div><h2>${T.win} <span class="muted">gagnants</span> · ${T.err} <span class="muted">fautes</span></h2></div><button class="chip-btn" type="button" data-mundo="1" ${L.log.length?"":"disabled"}>Annuler</button></div>
    <label>Adversaires (facultatif)<input id="mopp" value="${esc(L.opp||"")}" placeholder="ex. Martin / Durand"></label>
    <div class="lbl">Points gagnants</div><div class="mgrid">${MSTAT_KEYS.win.map(([k,l])=>btn(k,l,"win")).join("")}</div>
    <div class="lbl">Fautes directes</div><div class="mgrid">${MSTAT_KEYS.err.map(([k,l])=>btn(k,l,"err")).join("")}</div>
    <div class="lbl">Score du set ${L.sets.length}</div>
    <div class="mscore"><div><span>Nous</span><button type="button" class="rbtn" data-mgame="0|-1">−</button><b class="num">${set[0]}</b><button type="button" class="rbtn" data-mgame="0|1">+</button></div>
     <div><span>Eux</span><button type="button" class="rbtn" data-mgame="1|-1">−</button><b class="num">${set[1]}</b><button type="button" class="rbtn" data-mgame="1|1">+</button></div>
     <button class="chip-btn" type="button" data-mset="1">Set suivant</button></div>
    ${L.sets.length>1?`<p class="small muted">Sets : ${L.sets.map(s=>s.join("-")).join(" · ")}</p>`:""}
    <div class="actions"><button class="btn" type="button" data-mlive="end">Terminer le match</button><button class="linkbtn" type="button" data-mlive="cancel">Abandonner</button></div></section>${histHtml}`;};
function endLive(){const L=liveMatch();if(!L)return;const opp=$("#mopp");if(opp)L.opp=opp.value.trim();
  const T=mTotals(L);if(!T.win&&!T.err){delete data.mstats.live;lsSave();renderApp({force:true});return;}
  const m={...L,done:true};delete m.log;data.mstats[m.id]=m;delete data.mstats.live;
  // Rattacher au tournoi du jour s'il existe (statistiques utilisées par l'analyse)
  lsSave();renderApp({force:true});toast(`Match enregistré : ${T.win} points gagnants, ${T.err} fautes directes`);}
/* Suggestions du coach de cours à partir des stats de match */
function liveStatsHints(add){const since=addDays(todayIso(),-45),ms=Object.values(data.mstats).filter(m=>m&&m.done&&m.date>=since);if(!ms.length)return;
  const tot={};ms.forEach(m=>Object.entries(m.counts||{}).forEach(([k,v])=>tot[k]=(tot[k]||0)+v));const n=ms.length,per=k=>(tot[k]||0)/n;
  const T=ms.reduce((a,m)=>{const x=mTotals(m);a.w+=x.win;a.e+=x.err;return a;},{w:0,e:0});
  if(T.e>T.w)add("Régularité (fautes directes)",4,`stats en direct : ${fmt(T.e/n,0)} fautes directes pour ${fmt(T.w/n,0)} points gagnants par match`);
  if(per("f_smash")>=2)add("Smash par 3",4,`${fmt(per("f_smash"),1)} smashs ratés par match`);
  if(per("f_bandeja")>=2)add("Bandeja",4,`${fmt(per("f_bandeja"),1)} bandejas ratées par match`);
  if(per("f_volee")>=3)add("Volée",4,`${fmt(per("f_volee"),1)} fautes de volée par match`);
  if(per("f_lob")>=2)add("Lob de défense",4,`${fmt(per("f_lob"),1)} lobs trop courts par match`);
  if(per("df")>=1.5)add("Service / retour",3,`${fmt(per("df"),1)} doubles fautes par match`);
  if(per("f_fond")>=4)add("Sortie de vitre",2,`${fmt(per("f_fond"),1)} fautes du fond par match`);
  if(per("vitre")<0.5&&n>=2)add("Sortie de vitre",1,"peu de points gagnés en sortie de vitre");}
document.addEventListener("click",e=>{const t=e.target.closest("button");if(!t)return;const D=t.dataset;
  if(D.followdel){delete data.follows[D.followdel];delete FOLLOW.cache[D.followdel];lsSave();renderApp({force:true});toast("Retiré");return;}
  if(D.followreload){followList(D.followreload).forEach(fetchFollow);renderApp({force:true});return;}
  if(D.evcopy){try{const e0=JSON.parse(D.evcopy),id=uid(),ev={id,...e0,note:"Avec mon partenaire",goal:false,registered:false};syncEventToWeeks(ev);save("events",id,ev);toast("Tournoi ajouté à ton calendrier");}catch(err){}return;}
  if(D.mlive==="new"){newLive();renderApp({force:true});return;}
  if(D.mlive==="end"){endLive();return;}
  if(D.mlive==="cancel"){confirmBtn(t,"Confirmer ?",()=>{delete data.mstats.live;lsSave();renderApp({force:true});});return;}
  const L=liveMatch();if(!L)return;
  if(D.mhit){L.counts[D.mhit]=(L.counts[D.mhit]||0)+1;L.log.push(D.mhit);if(navigator.vibrate)try{navigator.vibrate(15);}catch(err){}lsSave();renderApp({force:true});return;}
  if(D.mundo){const k=L.log.pop();if(k&&k.startsWith("g:")){const [,i,d]=k.split(":");L.sets[L.sets.length-1][+i]=Math.max(0,L.sets[L.sets.length-1][+i]-(+d));}else if(k&&L.counts[k])L.counts[k]--;lsSave();renderApp({force:true});return;}
  if(D.mgame){const [i,d]=D.mgame.split("|").map(Number),s=L.sets[L.sets.length-1];const nv=Math.max(0,Math.min(7,s[i]+d));if(nv!==s[i]){s[i]=nv;if(d>0)L.log.push(`g:${i}:${d}`);}lsSave();renderApp({force:true});return;}
  if(D.mset){if(L.sets.length<3)L.sets.push([0,0]);lsSave();renderApp({force:true});return;}
  if(D.mdel){confirmBtn(t,"Supprimer ?",()=>{delete data.mstats[D.mdel];lsSave();renderApp({force:true});});return;}
});
document.addEventListener("input",e=>{if(e.target&&e.target.id==="mopp"){const L=liveMatch();if(L){L.opp=e.target.value;lsSave(true);}}});
document.addEventListener("submit",e=>{const f=e.target;if(!f.dataset||!f.dataset.followadd)return;e.preventDefault();e.stopImmediatePropagation();
  const kind=f.dataset.followadd,name=f.elements.name.value.trim(),url=f.elements.url.value.trim();
  if(!parseShareLink(url)){toast("Ce n'est pas un lien de partage de l'app",true);return;}
  if(kind==="partenaire")followList("partenaire").forEach(x=>delete data.follows[x.id]);
  const id=uid(),fo={id,kind,name,url,added:todayIso()};data.follows[id]=fo;lsSave();fetchFollow(fo);renderApp({force:true});toast(kind==="joueur"?"Joueur ajouté":"Partenaire ajouté");},true);
MORE.splice(4,0,["match","Stats de match","Compteur de points en direct"],["partenaire","Mon partenaire","Ses tournois, sa forme, ses notes"],["coach","Espace coach","Suivre plusieurs joueurs"]);
