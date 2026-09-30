/* Programme Padel — organisation des écrans : onglets, pages regroupées, mode simple, écran Aujourd'hui */
"use strict";

/* =====================================================================
   1. Pages regroupées (onglets internes)
   ===================================================================== */
const OLD=Object.assign({},SUBS);
const GROUPS={
  tournois:[["avenir","À venir",()=>OLD["calendrier-tournois"]()],["resultats","Résultats",()=>OLD.tournois()],["jour","Jour J",()=>OLD.tournoi()]],
  cours:[["prof","Mon cours",()=>OLD.cours()],["carnet","Carnet technique",()=>OLD.technique()]],
  nutrition:[["jour","Au quotidien",()=>OLD.nutrition()],["repas","Repas de la semaine",()=>OLD.repas()]],
  outils:[["outils","Outils",()=>OLD.outils()],["mental","Mental",()=>OLD.mental()]],
  programme:[["logique","Le programme",()=>OLD.programme()],["guide","Échauffement",()=>OLD.guide()]],
  douleurs:[["suivi","Mes douleurs",()=>OLD.douleurs()],["renfo","Renforcement",()=>OLD.renfo()],["reprise","Reprise",()=>OLD.reprise()]],
  partage:[["coach","Lien de partage",()=>(cloudOn()?shareCard():`<section class="card"><p class="small">Le partage nécessite un compte.</p></section>`)+csvCard()],["calendrier","Calendrier",()=>OLD.calendrier()],["bilan","Bilan",()=>OLD.bilan()],["raccourcis","Raccourcis",()=>OLD.raccourcis(),true],["sauvegarde","Sauvegarde",()=>backupCard()]],
  legal:[["confidentialite","Confidentialité",()=>OLD.confidentialite()],["mentions","Mentions légales",()=>OLD.mentions()]],
  progres:[["vue","Charges et régularité",()=>renderStatsFull()]]
};
const ALIAS={"calendrier-tournois":["tournois","avenir"],tournoi:["tournois","jour"],technique:["cours","carnet"],repas:["nutrition","repas"],mental:["outils","mental"],guide:["programme","guide"],
  renfo:["douleurs","renfo"],reprise:["douleurs","reprise"],calendrier:["partage","calendrier"],bilan:["partage","bilan"],raccourcis:["partage","raccourcis"],confidentialite:["legal","confidentialite"],mentions:["legal","mentions"]};
/* Répertoire des pages : titre, description, onglet d'accueil, fonction avancée (masquée en mode simple) */
const PAGES={
  cours:["Mon cours de padel","Quoi travailler avec ton prof","padel"],
  tournois:["Tournois","À venir, résultats, jour J","padel"],
  match:["Stats de match","Compteur de points en direct","padel"],
  adversaires:["Adversaires","Carnet des paires rencontrées","padel",true],
  partenaire:["Mon partenaire","Ses tournois, sa forme, ses notes","padel",true],
  videos:["Vidéos de match","Liens et notes minutées","padel",true],
  progres:["Charges et régularité","Charge, régularité, records, forme","stats"],
  cycle:["Bilan du cycle","Analyse et cycle suivant","stats"],
  tests:["Tests physiques","Mesures de progrès","stats"],
  douleurs:["Douleurs","Suivi, renforcement, reprise","stats"],
  objectifs:["Objectifs et badges","Cibles et récompenses","stats"],
  programme:["Comment ça marche","Le programme, l'échauffement, la prévention","more"],
  mobilite:["Mobilité","Routine quotidienne guidée","more"],
  nutrition:["Nutrition","Apports du jour, repas de la semaine","more"],
  outils:["Outils","Respiration, métronome, mental","more"],
  materiel:["Matériel","Raquette, chaussures, grips","more",true],
  partage:["Partager et sauvegarder","Coach, calendrier, bilan, tableur, sauvegarde","more"],
  coach:["Espace coach","Suivre plusieurs joueurs","more",true],
  reglages:["Réglages","Profil, programme, compte, notifications","more"],
  avis:["Un avis, un problème ?","Écris-nous, on lit tout","more"],
  admin:["Administration","Statistiques de l'app","more"],
  legal:["Informations légales","Confidentialité, mentions légales","more"]
};
const PAGE_ICON={cours:'<path d="M4 19l6-6 4 4 6-8"/>',tournois:'<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',match:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  adversaires:'<circle cx="9" cy="7" r="4"/><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.9"/>',partenaire:'<circle cx="8" cy="8" r="3.5"/><circle cx="16" cy="8" r="3.5"/><path d="M2 20c0-3 3-5 6-5s6 2 6 5M14 15.3c.6-.2 1.3-.3 2-.3 3 0 6 2 6 5"/>',
  videos:'<rect x="2" y="5" width="15" height="14" rx="2"/><path d="M17 10l5-3v10l-5-3"/>',progres:'<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>',cycle:'<path d="M21 12a9 9 0 1 1-3-6.7M21 4v5h-5"/>',tests:'<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/>',
  douleurs:'<path d="M12 21s-7-4.5-9-9a5 5 0 0 1 9-4 5 5 0 0 1 9 4c-2 4.5-9 9-9 9z"/>',objectifs:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',programme:'<path d="M4 19V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM19 17H6"/>',
  mobilite:'<circle cx="12" cy="4.5" r="2"/><path d="M12 7v6l-4 7M12 13l4 7M6 10l6-2 6 2"/>',nutrition:'<path d="M12 21c-5 0-8-4-8-8 0-3 2-5 4.5-5 1.5 0 2.5.8 3.5.8S14 8 15.5 8C18 8 20 10 20 13c0 4-3 8-8 8zM12 8c0-2 1-4 3-5"/>',outils:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/>',
  materiel:'<ellipse cx="9" cy="9" rx="6" ry="7"/><path d="M13 14l7 7"/>',partage:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>',coach:'<path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M16 11l2 2 4-4"/>',
  reglages:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  admin:'<path d="M3 3v18h18M7 15l4-4 3 3 5-6"/>',legal:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',lib:'<path d="M6 8v8M18 8v8M3 10v4M21 10v4M6 12h12"/>'};
function backupCard(){return `<section class="card stack"><div><div class="eyebrow">Sur cet appareil</div><h2>Sauvegarde</h2></div>
   <p class="small">Dernière sauvegarde : ${data.meta.main.lastExport?fr(data.meta.main.lastExport):"jamais"}. Enregistre le fichier dans Fichiers, iCloud Drive ou Google Drive.</p>
   <div class="actions"><button class="btn" type="button" data-export="1">Exporter une sauvegarde</button><label class="btn ghost filebtn">Restaurer<input type="file" id="file-import" accept="application/json,.json" hidden></label></div></section>`;}
SUBS.avis=()=>feedbackCard()||`<section class="card"><p class="small">Écris-nous : ${CONTACT()}</p></section>`;
PAGE_ICON.avis='<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>';
const isSimple=()=>!!S_().simple;
function pageVisible(k){const P=PAGES[k];if(!P)return true;if(k==="admin")return typeof ADMIN!=="undefined"&&ADMIN.ok;return !(P[3]&&isSimple());}
function resolveSub(sub){if(!sub)return [null,null];if(ALIAS[sub])return ALIAS[sub];return [sub,null];}
function homeOf(sub){return PAGES[sub]?PAGES[sub][2]:"more";}
function subTitleOf(sub){return (PAGES[sub]||(MORE.find(m=>m[0]===sub)||[]).slice(0,1).concat([""]))[0]||"";}
/* Pages à onglets */
Object.entries(GROUPS).forEach(([k,tabs])=>{SUBS[k]=()=>{const vis=tabs.filter(t=>!(t[3]&&isSimple()));let cur=state.subtab&&vis.find(t=>t[0]===state.subtab)?state.subtab:vis[0][0];
  return (vis.length>1?`<div class="subtabs hscroll" role="tablist">${vis.map(([id,l])=>`<button type="button" role="tab" data-subtab="${id}" aria-selected="${id===cur}">${esc(l)}</button>`).join("")}</div>`:"")+vis.find(t=>t[0]===cur)[2]();};});
/* Liste de pages (hubs) */
function pageList(keys){const ks=keys.filter(k=>SUBS[k]&&pageVisible(k));if(!ks.length)return "";
  return `<div class="plist">${ks.map(k=>{const P=PAGES[k]||[k,""];return `<button class="prow" type="button" data-sub="${k}"><span class="pic"><svg viewBox="0 0 24 24" aria-hidden="true">${PAGE_ICON[k]||""}</svg></span><span class="ptx"><b>${esc(P[0])}</b><span>${esc(P[1])}</span></span><span class="pch" aria-hidden="true">›</span></button>`;}).join("")}</div>`;}
function backBtn(){const lab={padel:"Padel",stats:"Suivi",more:"Profil",week:"Semaine"}[state.tab]||"Retour";return `<button class="back" type="button" data-sub="">‹ ${lab}</button>`;}

/* =====================================================================
   2. Onglets Padel, Suivi, Profil
   ===================================================================== */
function renderPadel(){if(state.sub&&SUBS[state.sub])return backBtn()+SUBS[state.sub]();
  const nl=nextLessonDate(),n=daysBetween(todayIso(),nl),ev=upcomingEvents()[0];
  const top=[];
  if(weekOfDate(nl)>=1&&n<=6){const sug=coachSuggest(nl).list[0];top.push(`<button class="hcard" type="button" data-sub="cours"><span class="eyebrow">Prochain cours · ${n===0?"aujourd'hui":n===1?"demain":esc(frLong(nl))}</span><b>${sug?esc(sug.theme):"Choisis un thème"}</b><span class="muted small">${sug&&sug.why[0]?esc(sug.why[0]):"Suggestion à partir de tes notes et de ta semaine"}</span></button>`);}
  if(ev){const d=daysBetween(todayIso(),ev.date);top.push(`<button class="hcard" type="button" data-sub="tournois"><span class="eyebrow">Prochain tournoi · ${d<=0?"en cours":d===1?"demain":"dans "+plural(d,"jour")}</span><b>${esc(ev.cat||"")} ${esc(ev.lieu||"")}</b><span class="muted small">${esc(frLong(ev.date))}${ev.registered?" · inscrit":ev.deadline?" · inscription avant le "+esc(fr(ev.deadline)):""}</span></button>`);}
  else top.push(`<button class="hcard" type="button" data-goto="padel:tournois"><span class="eyebrow">Tournois</span><b>Aucun tournoi prévu</b><span class="muted small">Ajoute tes prochains tournois : ta semaine s'adapte</span></button>`);
  const L=Object.values(data.mstats||{}).filter(m=>m&&m.done).sort((a,b)=>b.date.localeCompare(a.date))[0];
  return `<div class="hgrid">${top.join("")}</div>
   ${data.mstats&&data.mstats.live&&!isSimple()?`<button class="btn big" type="button" data-sub="match">Reprendre le match en cours</button>`:""}
   ${pageList(["cours","tournois","match","adversaires","partenaire","videos"])}
   ${L&&!isSimple()?`<p class="muted small">Dernier match noté le ${esc(fr(L.date))} : ${mTotals(L).win} points gagnants, ${mTotals(L).err} fautes directes.</p>`:""}`;}
function renderStatsFull(){return renderStats();}
function renderSuivi(){if(state.sub&&SUBS[state.sub])return backBtn()+SUBS[state.sub]();
  const ws=sortedWeights(),pts=ws.map(x=>({x:x.date,y:+x.kg})),ma=movingAvg(pts,7),goalW=data.goals.poids&&data.goals.poids.target,ref=todayRef();
  return `<div class="kpis">
    <div class="kpi"><div class="v num">${ws.length?fmt(ws[ws.length-1].kg)+" kg":"–"}</div><div class="k">dernière pesée</div></div>
    <div class="kpi"><div class="v num">${ws.length>1?(ws[ws.length-1].kg-ws[0].kg>0?"+":"")+fmt(ws[ws.length-1].kg-ws[0].kg)+" kg":"–"}</div><div class="k">depuis le départ</div></div>
    <div class="kpi"><div class="v num">${totalDone()}</div><div class="k">séances faites</div></div>
    <div class="kpi"><div class="v num">${plural(mobStreak(),"jour")}</div><div class="k">série mobilité</div></div></div>
   <section class="card stack"><div class="sess-head"><div><div class="eyebrow">Poids</div><h2>Ta courbe</h2></div><button class="chip-btn" type="button" data-sub="progres">Tout voir</button></div>
    ${lineChart([{pts,color:"var(--court)",label:"Pesées",opacity:.55},{pts:ma,color:"var(--court)",label:"Moyenne 7 jours",width:3.5,dots:false}],{unit:"kg",target:goalW,empty:"Ajoute ta première pesée depuis l'écran Aujourd'hui.",h:200})}</section>
   ${ref?recapCard(ref.w,"Semaine en cours"):""}
   ${pageList(["progres","cycle","tests","douleurs","objectifs"])}`;}
function renderProfil(){if(state.sub&&SUBS[state.sub])return backBtn()+SUBS[state.sub]();
  const s=S_(),con=Sync.connected(),c=Sync.cfg(),ini=(s.name||"?").trim().charAt(0).toUpperCase();
  return `<section class="card profile-card"><div class="avatar" aria-hidden="true">${esc(ini)}</div><div class="pinfo"><h2>${esc(s.name||"Mon profil")}</h2>
     <p class="muted small">${[s.level,s.side?"joueur"+(s.sex==="F"?"se":"")+" de "+s.side:"",s.age?s.age+" ans":""].filter(Boolean).map(esc).join(" · ")}</p>
     <p class="small">${cloudOn()?(con?`<span class="okline">✓ Compte : ${esc(c.email||"")}</span>`:`Sans compte · <button class="linkbtn" type="button" data-auth="in">Se connecter</button>`):"Données sur cet appareil"}</p></div>
    <button class="chip-btn" type="button" data-sub="reglages">Modifier</button></section>
   <section class="card simple-row"><div><b>Mode complet</b><div class="muted small">${isSimple()?"Affiche aussi : adversaires, partenaire, vidéos, espace coach, matériel, raccourcis.":"Toutes les fonctions sont affichées."}</div></div>
    <button type="button" class="switch" role="switch" aria-checked="${!isSimple()}" data-simple="1" aria-label="Mode complet"><i></i></button></section>
   <h3 class="tiles-h">Entraînement</h3>${pageList(["programme","mobilite"])}<div class="plist"><button class="prow" type="button" data-goto="lib"><span class="pic"><svg viewBox="0 0 24 24" aria-hidden="true">${PAGE_ICON.lib}</svg></span><span class="ptx"><b>Exercices</b><span>Les 65 fiches avec schémas animés</span></span><span class="pch">›</span></button></div>
   <h3 class="tiles-h">Au quotidien</h3>${pageList(["nutrition","outils","materiel"])}
   <h3 class="tiles-h">Partage</h3>${pageList(["partage","coach"])}
   <h3 class="tiles-h">Application</h3>${pageList(["reglages","avis","admin","legal"])}
   <p class="muted small" style="text-align:center">${esc(APP_CONFIG.name||"Programme Padel")} · version ${APP_VERSION}</p>`;}

/* =====================================================================
   3. Écran Aujourd'hui (l'essentiel)
   ===================================================================== */
function momentCard(){
  const c=[()=>cycleTodayCard(),()=>weekPlanTarget()?weekPlanCard():"",()=>{const ev=upcomingEvents()[0];return ev&&daysBetween(todayIso(),ev.date)<=3?todayExtras():"";},()=>lessonCardToday(),()=>typeof accountNudge==="function"?accountNudge():"",()=>installCard()];
  for(const f of c){let h="";try{h=f()||"";}catch(e){h="";}if(h.trim())return h;}return "";}
function alertsCompact(){const tmp=document.createElement("div");tmp.innerHTML=alertsHtml();const al=[...tmp.querySelectorAll(".alert")];if(!al.length)return "";
  const shown=state.allAlerts?al:al.slice(0,2);return `<div class="alerts">${shown.map(a=>a.outerHTML).join("")}${al.length>2&&!state.allAlerts?`<button class="linkbtn small" type="button" data-allalerts="1">Voir les ${al.length-2} autres alertes</button>`:""}</div>`;}
function checkinCompact(){const t=todayIso(),c=data.checkins[t];
  if((c&&c.sleep)||state.ckOpen||state.ckEdit||state.ck)return checkinCard();
  return `<section class="card ck-mini"><div><b>Forme du matin</b><div class="muted small">4 questions, 30 secondes : la séance s'adapte</div></div><button class="btn small" type="button" data-ckopen="1">Noter</button></section>`;}
function dailyChecklist(){const t=todayIso(),mdone=!!data.mobilite[t],n=data.nutri[t]||{},T=nutritionTargets(),gl=Math.round(T.water*4),ws=sortedWeights(),lw=ws[ws.length-1],wToday=lw&&lw.date===t;
  return `<section class="card stack daily"><div class="sess-head"><div><div class="eyebrow">À cocher aujourd'hui</div></div><span class="muted small">Série mobilité : ${plural(mobStreak(),"jour")}</span></div>
   <div class="drow"><button type="button" class="dcheck ${mdone?"on":""}" data-mob="${t}" aria-pressed="${mdone}" aria-label="Mobilité faite">${mdone?"✓":""}</button><div class="dtx"><b>Mobilité · 12 min</b><span class="muted small">${mdone?"Faite":"La routine guidée du jour"}</span></div>${mdone?"":timerBtn("mob-today",{label:"Lancer",ph:mobilityPhases(),onDone:()=>{}},"chip-btn")}</div>
   ${timerSlot("mob-today")}
   <div class="drow"><span class="dcheck ${wToday?"on":""}" aria-hidden="true">${wToday?"✓":""}</span><div class="dtx"><b>Pesée</b><span class="muted small">${lw?`${fmt(lw.kg)} kg le ${esc(fr(lw.date))}`:"Le matin, à jeun"}</span></div>
    ${wToday?"":`<form class="inline dform" data-quickweight="1"><input type="number" step="0.1" inputmode="decimal" name="kg" placeholder="kg" aria-label="Poids du jour"><button class="chip-btn" type="submit">OK</button></form>`}</div>
   <div class="drow"><span class="dcheck ${(n.water||0)>=gl?"on":""}" aria-hidden="true">${(n.water||0)>=gl?"✓":""}</span><div class="dtx"><b>Eau</b><span class="muted small">${n.water||0}/${gl} verres</span></div><div class="dstep"><button class="rbtn" type="button" data-water="-1" aria-label="Retirer un verre">−</button><button class="rbtn" type="button" data-water="1" aria-label="Ajouter un verre">+</button></div></div>
   <div class="drow"><button type="button" class="dcheck ${n.prot?"on":""}" data-nutri="prot" aria-pressed="${!!n.prot}" aria-label="Protéines atteintes">${n.prot?"✓":""}</button><div class="dtx"><b>Protéines · ${T.prot} g</b><span class="muted small">${T.kcal} kcal visées aujourd'hui</span></div><button class="linkbtn small" type="button" data-goto="more:nutrition">Détails</button></div>
  </section>`;}
function renderToday(){
  const t=todayIso(),dts=daysToStart(),ref=todayRef(),gap=cycleGap(),out=[];
  out.push(`<div class="hello"><div class="eyebrow">${S_().name?"Salut "+esc(S_().name)+" · ":""}${esc(frLong(t))}</div><h1>${ref?`Semaine ${ref.w}`:gap?`Cycle ${gap.c} terminé`:`Début dans ${plural(dts,"jour")}`}</h1>
    <p class="muted">${ref?`${esc(blockOf(ref.w).name)}${isDeload(ref.w)?" · semaine d'allègement":""} · <button class="linkbtn" type="button" data-goto="week">${esc(weekSummary(ref.w))}</button>`:gap?(gap.next?`Prochain cycle le ${esc(frLong(gap.next))}.`:"Ton bilan est prêt."):`Ton programme commence le ${esc(frLong(startDate()))}.`}</p></div>`);
  out.push(momentCard());
  out.push(alertsCompact());
  if(ref){out.push(checkinCompact());
    const p=planFor(ref.w,ref.d),log=data.logs[p.id],tm=addDays(t,1),tw=weekOfDate(tm),tp=tw>=1?planFor(tw,dayKeyOf(tm)):null;
    const adj=data.adj[p.id]||{};
    out.push(`<section class="card today-sess"><div class="sess-head"><div><div class="eyebrow">Au programme aujourd'hui</div><h2>${esc(p.title)}</h2></div>${kindChip(p.kind)}</div>
      <div class="meta"><span>≈ ${p.dur} min</span><span>${esc(p.place)}</span>${p.short?`<span class="tag" style="color:var(--warn)">Version courte</span>`:""}${p.home?`<span class="tag" style="color:var(--b2)">Version maison</span>`:""}</div>
      ${log&&log.done?`<div class="okline big">✓ Séance faite · ${log.duree||"?"} min · effort ${log.rpe||"?"}/10</div>`:""}
      ${p.kind!=="R"?`<button class="btn big" type="button" data-run="${p.id}">${log&&log.done?"Refaire":"Démarrer la séance"}</button>`:""}
      <details class="sess-more" data-k="today-more"><summary>Le détail${p.items.length?` · ${p.items.length} exercice${p.items.length>1?"s":""}`:""}</summary>
       ${p.cue?`<p class="small">${esc(sideTxt(p.cue))}</p>`:""}
       <ol class="mini">${p.items.map(it=>`<li><span>${esc(itemName(it[0]))}</span><span class="rx">${esc(it[2]?rx(it[1],it[2],itDl(p,it)):"")}</span></li>`).join("")}</ol>
       <div class="actions"><button class="chip-btn" type="button" data-openday="${ref.w}|${ref.d}">Saisir mes charges</button>
       ${"AP".includes(p.kind)?`<button class="chip-btn" type="button" data-adj="${p.id}|short" aria-pressed="${!!adj.short}">Version courte</button><button class="chip-btn" type="button" data-adj="${p.id}|home" aria-pressed="${!!p.home}">Pas de salle</button><button class="chip-btn" type="button" data-adj="${p.id}|express" aria-pressed="${!!adj.express}">Express</button>`:""}</div></details>
      ${tp?`<p class="muted small tomorrow">Demain : <b>${esc(tp.title)}</b> · ≈ ${tp.dur} min</p>`:""}
    </section>`);
    if(p.kind==="M")out.push(`<section class="card"><div class="eyebrow">Jour de tournoi</div><div class="actions"><button class="chip-btn" type="button" data-goto="padel:tournois" data-subtabgo="jour">Checklist du sac</button>${timerBtn("rt-warm",{label:"Échauffement d'avant-match",ph:()=>ROUTINES.match_warmup.ph()},"chip-btn")}${timerBtn("rt-between",{label:"Entre deux matchs",ph:()=>ROUTINES.between.ph()},"chip-btn")}</div>${timerSlot("rt-warm")}${timerSlot("rt-between")}</section>`);
  }else if(!gap){
    out.push(`<section class="card"><div class="eyebrow">En attendant le début</div><h3>Prends déjà les bonnes habitudes</h3><ul class="clean small"><li>Fais la mobilité chaque jour (ci-dessous).</li><li>Pèse-toi le matin du ${esc(fr(startDate()))} pour avoir un point de départ.</li><li>Découvre les <button class="linkbtn" type="button" data-goto="lib">fiches d'exercices</button>.</li></ul></section>`);
  }
  out.push(dailyChecklist());
  return out.join("");
}

/* =====================================================================
   4. Clics propres à l'organisation
   ===================================================================== */
document.addEventListener("click",e=>{const t=e.target.closest("button");if(!t)return;const D=t.dataset;
  if(D.subtab){state.subtab=D.subtab;renderApp({force:true});return;}
  if(D.simple){const s=S_();s.simple=!s.simple;lsSave();renderApp({force:true});toast(s.simple?"Mode simple : l'essentiel seulement":"Mode complet : toutes les fonctions");return;}
  if(D.ckopen){state.ckOpen=true;renderApp({force:true});return;}
  if(D.allalerts){state.allAlerts=true;renderApp({force:true});return;}
  if(D.subtabgo){state.subtabNext=D.subtabgo;}
},true);
