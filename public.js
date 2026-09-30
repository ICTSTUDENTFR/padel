/* Programme Padel — app publique : confidentialité, mentions légales, suppression de compte,
   avis et signalement des bugs, administration, installation sur l'écran d'accueil */
"use strict";
const APPN=()=>esc(APP_CONFIG.name||"Programme Padel");
const OWNER=()=>APP_CONFIG.owner?esc(APP_CONFIG.owner):"l'éditeur de l'application";
const CONTACT=()=>APP_CONFIG.contactEmail?`<a href="mailto:${esc(APP_CONFIG.contactEmail)}">${esc(APP_CONFIG.contactEmail)}</a>`:"l'adresse indiquée dans « À propos »";

/* =====================================================================
   1. Politique de confidentialité et mentions légales
   ===================================================================== */
SUBS.confidentialite=()=>`<section class="card stack legal">
  <div><div class="eyebrow">Mise à jour : ${esc(APP_CONFIG.legalDate||"30 septembre 2026")}</div><h2>Politique de confidentialité</h2></div>
  <p>${APPN()} est une application d'entraînement physique pour le padel. Cette page explique quelles données sont utilisées, pourquoi, où elles sont stockées et comment les supprimer.</p>
  <h3>Responsable du traitement</h3><p>${OWNER()}. Contact : ${CONTACT()}.</p>
  <h3>Données utilisées</h3><ul class="clean">
   <li><b>Profil :</b> prénom (facultatif), sexe, âge, taille, niveau, côté de jeu, objectif, matériel.</li>
   <li><b>Entraînement :</b> séances, charges, ressenti, tests physiques, mobilité, jours de padel et de tournoi.</li>
   <li><b>Suivi personnel :</b> poids, tour de taille, forme du matin (sommeil, fatigue, fréquence cardiaque), douleurs signalées, nutrition, tournois, notes.</li>
   <li><b>Compte (facultatif) :</b> adresse e-mail et mot de passe (chiffré, jamais visible, y compris par l'éditeur).</li>
   <li><b>Rapports techniques :</b> en cas de bug, un message d'erreur anonyme (texte de l'erreur, version de l'app, type de navigateur), sans aucune donnée personnelle.</li></ul>
  <p>Le poids, la forme et les douleurs sont des données de santé : elles ne sont utilisées que pour adapter ton programme, à ta demande, et ne sont jamais vendues, partagées ni utilisées pour de la publicité. Il n'y a ni publicité, ni cookie de suivi, ni outil de mesure d'audience.</p>
  <h3>Où sont stockées les données</h3><ul class="clean">
   <li><b>Sans compte :</b> uniquement sur ton appareil (stockage du navigateur). Rien n'est envoyé en ligne.</li>
   <li><b>Avec un compte :</b> aussi sur les serveurs de Supabase Inc. (${esc(APP_CONFIG.dataRegion||"Union européenne")}), protégés de façon à ce que seul ton compte puisse lire tes données.</li>
   <li>L'application elle-même est hébergée par GitHub Pages (GitHub Inc.), qui ne reçoit pas tes données d'entraînement.</li></ul>
  <h3>Base légale et durée</h3><p>Les données sont traitées avec ton consentement, donné en utilisant l'application et en créant un compte. Elles sont conservées tant que ton compte existe. Un compte inactif pendant 3 ans peut être supprimé après un e-mail de prévenance.</p>
  <h3>Tes droits</h3><p>Tu peux à tout moment consulter, exporter (Réglages &gt; Exporter une sauvegarde), corriger ou supprimer tes données. La suppression du compte (Réglages &gt; Mon compte &gt; Supprimer mon compte) efface définitivement tes données en ligne. Pour toute question : ${CONTACT()}. Tu peux aussi saisir la CNIL (cnil.fr).</p>
  <h3>Partage volontaire</h3><p>Si tu crées un lien de partage pour ton coach ou ton partenaire, les personnes qui ont ce lien peuvent consulter ton programme et ton suivi en lecture seule. Tu peux désactiver le lien à tout moment.</p>
  <h3>Avertissement santé</h3><p>Ce programme est un entraînement général. Il ne remplace pas l'avis d'un médecin ou d'un kinésithérapeute. Consulte un professionnel avant de commencer si tu as un problème de santé, et en cas de douleur persistante.</p>
 </section>`;
SUBS.mentions=()=>`<section class="card stack legal">
  <div><div class="eyebrow">Informations légales</div><h2>Mentions légales</h2></div>
  <h3>Éditeur</h3><p>${APP_CONFIG.owner?esc(APP_CONFIG.owner):"Éditeur non renseigné"}${APP_CONFIG.ownerAddress?"<br>"+esc(APP_CONFIG.ownerAddress):""}${APP_CONFIG.ownerId?"<br>"+esc(APP_CONFIG.ownerId):""}<br>Contact : ${CONTACT()}</p>
  <h3>Hébergement de l'application</h3><p>GitHub Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis (GitHub Pages).</p>
  <h3>Hébergement des données des comptes</h3><p>Supabase Inc. (supabase.com), serveurs : ${esc(APP_CONFIG.dataRegion||"Union européenne")}.</p>
  <h3>Conditions d'utilisation</h3><ul class="clean">
   <li>L'application est gratuite et fournie « en l'état », sans garantie de disponibilité.</li>
   <li>Les programmes proposés sont des conseils d'entraînement généraux. Tu restes seul juge de ta pratique : adapte les charges à tes sensations et arrête en cas de douleur.</li>
   <li>Ton compte est personnel : garde ton mot de passe secret.</li>
   <li>L'éditeur peut faire évoluer l'application et ces conditions ; les changements importants sont signalés dans l'app.</li></ul>
  <p class="small"><button class="linkbtn" type="button" data-goto="more:confidentialite">Politique de confidentialité</button></p>
 </section>`;
function legalLinks(){return `<div class="legal-links"><button class="linkbtn" type="button" data-legal="confidentialite">Confidentialité</button><button class="linkbtn" type="button" data-legal="mentions">Mentions légales</button></div>`;}
/* Pages légales ouvertes depuis la page de connexion ou l'accueil (par-dessus) */
function openLegal(k){let el=$("#legalpage");if(!el){el=document.createElement("div");el.id="legalpage";el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");document.body.appendChild(el);}
  el.innerHTML=`<div class="ob-card"><button class="auth-close" type="button" data-legalclose="1" aria-label="Fermer">✕</button>${SUBS[k]()}</div>`;el.scrollTop=0;}

/* =====================================================================
   2. Données et compte (carte des Réglages)
   ===================================================================== */
function dataCard(){const con=Sync.connected();
  return `<section class="card stack"><div><div class="eyebrow">Confidentialité</div><h2>Tes données</h2></div>
   <p class="small">${con?"Tes données sont enregistrées sur cet appareil et dans ton compte en ligne, accessible uniquement avec ton identifiant.":"Tes données restent uniquement sur cet appareil : rien n'est envoyé en ligne."} Tu peux les exporter ou les effacer à tout moment.</p>
   <p class="small muted">Cette application propose un entraînement général et ne remplace pas l'avis d'un médecin ou d'un kinésithérapeute. En cas de douleur persistante, consulte un professionnel de santé.</p>
   ${legalLinks()}
   <div class="actions"><button class="btn ghost danger" type="button" data-wipe="1">Effacer les données de cet appareil</button>${con?`<button class="btn ghost danger" type="button" data-delacc="1">Supprimer mon compte</button>`:""}</div></section>`;}
function openDeleteAccount(){let el=$("#pwreset");if(!el){el=document.createElement("div");el.id="pwreset";el.className="ob-modal";document.body.appendChild(el);}
  el.innerHTML=`<form class="card stack" data-delaccform="1"><h2>Supprimer mon compte</h2>
   <p class="small">Ton compte <b>${esc(Sync.cfg().email||"")}</b> et toutes tes données en ligne (séances, suivi, tournois…) seront effacés définitivement. Les données de cet appareil seront aussi effacées.</p>
   <p class="small muted">Conseil : exporte d'abord une sauvegarde si tu veux les garder.</p>
   <label>Pour confirmer, écris SUPPRIMER<input name="c" autocomplete="off" autocapitalize="characters"></label>
   <div class="actions"><button class="btn danger" type="submit">Supprimer définitivement</button><button class="btn ghost" type="button" data-pwclose="1">Annuler</button></div>
   <p class="small bad-txt" id="del-status"></p></form>`;}
async function deleteAccount(f){const st=$("#del-status");if(f.elements.c.value.trim().toUpperCase()!=="SUPPRIMER"){st.textContent="Écris SUPPRIMER pour confirmer";return;}
  st.textContent="Suppression…";
  try{const c=Sync.cfg(),tk=await Sync.token();const r=await fetch(Sync.base()+"/rest/v1/rpc/padel_delete_account",{method:"POST",headers:{apikey:c.key,Authorization:"Bearer "+tk,"Content-Type":"application/json"},body:"{}"});
    if(!r.ok){const t=await r.text();throw new Error("Erreur "+r.status+" "+t.slice(0,80));}
    try{Object.keys(localStorage).filter(k=>k.startsWith("padel")).forEach(k=>localStorage.removeItem(k));}catch(e){}
    location.hash="";location.reload();}
  catch(e){st.textContent="Échec : "+friendlyAuthErr(e.message)+". Réessaie ou écris à l'éditeur.";}}

/* =====================================================================
   3. Avis et signalement des bugs
   ===================================================================== */
async function sendReport(kind,message,detail,contact){if(!cloudOn())return false;
  try{const r=await fetch(APP_CONFIG.supabaseUrl.replace(/\/+$/,"")+"/rest/v1/padel_errors",{method:"POST",headers:{apikey:APP_CONFIG.supabaseAnonKey,Authorization:"Bearer "+APP_CONFIG.supabaseAnonKey,"Content-Type":"application/json",Prefer:"return=minimal"},
    body:JSON.stringify({kind,message:String(message).slice(0,2000),detail:detail?String(detail).slice(0,4000):null,version:(typeof APP_VERSION!=="undefined"?APP_VERSION:"").slice(0,20),ua:navigator.userAgent.slice(0,300),path:((state&&state.tab)||"")+(state&&state.sub?"/"+state.sub:""),contact:contact?String(contact).slice(0,200):null})});
    return r.ok;}catch(e){return false;}}
const _errSeen=new Set();let _errN=0;
function reportError(msg,stack){if(!cloudOn()||_errN>=5||/localhost|127\.0\.0\.1/.test(location.hostname))return;const k=String(msg).slice(0,200);if(_errSeen.has(k))return;_errSeen.add(k);_errN++;
  sendReport("error",k,String(stack||"").replace(/https?:\/\/[^\s)]+\//g,"").slice(0,1500));}
window.addEventListener("error",e=>{if(e&&e.message)reportError(e.message,e.error&&e.error.stack);});
window.addEventListener("unhandledrejection",e=>{const r=e&&e.reason;if(!r)return;const m=r.message||String(r);if(/Failed to fetch|NetworkError|Load failed|AbortError/i.test(m))return;reportError("Promesse : "+m,r.stack);});
function feedbackCard(){if(!cloudOn())return "";
  return `<section class="card stack"><div><div class="eyebrow">Aide-nous à améliorer l'app</div><h2>Un avis, un problème ?</h2></div>
   <form class="stack" data-feedback="1"><label>Ton message<textarea name="m" rows="3" maxlength="2000" placeholder="Ce qui te plaît, ce qui manque, un bug rencontré…"></textarea></label>
    <label>Ton e-mail pour te répondre <span class="muted">(facultatif)</span><input type="email" name="c" value="${esc(Sync.connected()?Sync.cfg().email||"":"")}" autocapitalize="off"></label>
    <div><button class="btn" type="submit">Envoyer</button></div></form></section>`;}

/* =====================================================================
   4. Administration (statistiques anonymes, réservé aux adresses admin)
   ===================================================================== */
const ADMIN={checked:false,ok:false,stats:null,errors:null,feedback:null,err:""};
async function adminRpc(fn,body){const c=Sync.cfg(),tk=await Sync.token();const r=await fetch(Sync.base()+"/rest/v1/rpc/"+fn,{method:"POST",headers:{apikey:c.key,Authorization:"Bearer "+tk,"Content-Type":"application/json"},body:JSON.stringify(body||{})});
  if(!r.ok)throw new Error("Erreur "+r.status);return r.json();}
async function checkAdmin(){const uid=Sync.connected()?Sync.cfg().userId:null;if(ADMIN.uid===uid)return;ADMIN.uid=uid;ADMIN.ok=false;ADMIN.stats=null;const i=MORE.findIndex(m=>m[0]==="admin");if(i>=0)MORE.splice(i,1);if(!uid)return;
  try{ADMIN.ok=!!(await adminRpc("padel_is_admin"));}catch(e){ADMIN.ok=false;}
  if(ADMIN.ok){if(!MORE.find(m=>m[0]==="admin"))MORE.push(["admin","Administration","Statistiques de l'app"]);if(state.tab==="more")renderApp();}}
async function loadAdmin(){ADMIN.err="";try{const [s,e,f]=await Promise.all([adminRpc("padel_admin_stats"),adminRpc("padel_admin_reports",{p_kind:"error",p_limit:30}),adminRpc("padel_admin_reports",{p_kind:"feedback",p_limit:30})]);ADMIN.stats=s;ADMIN.errors=e;ADMIN.feedback=f;}
  catch(err){ADMIN.err=err.message;}renderApp();}
SUBS.admin=()=>{if(!ADMIN.ok)return `<section class="card"><p>Accès réservé.</p></section>`;
  if(!ADMIN.stats&&!ADMIN.err){loadAdmin();return `<section class="card"><p class="muted">Chargement des statistiques…</p></section>`;}
  if(ADMIN.err)return `<section class="card stack"><p class="bad-txt">Impossible de charger : ${esc(ADMIN.err)}</p><button class="btn ghost" type="button" data-adminreload="1">Réessayer</button></section>`;
  const S=ADMIN.stats,pct=(a,b)=>b?Math.round(a/b*100)+" %":"–";
  const sg=S.signups||[],dist=o=>Object.entries(o||{}).sort((a,b)=>b[1]-a[1]).map(([k,n])=>`<li><b>${esc(k==="?"?"non renseigné":k)}</b> : ${n}</li>`).join("")||"<li>–</li>";
  return `<section class="card stack"><div class="sess-head"><div><div class="eyebrow">Données anonymes · aucune donnée personnelle</div><h2>Tableau de bord</h2></div><button class="chip-btn" type="button" data-adminreload="1">Actualiser</button></div>
   <div class="kpis"><div class="kpi"><div class="v num">${S.users}</div><div class="k">comptes (${S.confirmed} confirmés)</div></div>
    <div class="kpi"><div class="v num">+${S.new7}</div><div class="k">inscrits sur 7 jours (+${S.new30} sur 30)</div></div>
    <div class="kpi"><div class="v num">${S.active7}</div><div class="k">actifs sur 7 jours (${S.active30} sur 30)</div></div>
    <div class="kpi"><div class="v num">${pct(S.oldActive,S.old)}</div><div class="k">rétention à 30 jours</div></div>
    <div class="kpi"><div class="v num">${S.sessions7}</div><div class="k">séances faites cette semaine</div></div>
    <div class="kpi"><div class="v num">${S.errors7}</div><div class="k">erreurs sur 7 jours</div></div></div>
   <div><h3>Inscriptions par semaine</h3>${sg.length?barChart(sg.map(x=>x.n),{labels:sg.map(x=>x.w.slice(8,10)+"/"+x.w.slice(5,7)),cur:sg.length-1,colorFn:()=>"var(--court)"}):`<div class="empty">Pas encore d'inscription.</div>`}</div>
   <div class="grid2"><div><h3>Niveaux</h3><ul class="clean small">${dist(S.levels)}</ul></div><div><h3>Objectifs</h3><ul class="clean small">${dist(S.goals)}</ul></div></div></section>
  <section class="card stack"><h3>Avis reçus (${(ADMIN.feedback||[]).length})</h3>${(ADMIN.feedback||[]).length?`<ul class="adm-list">${ADMIN.feedback.map(f=>`<li><div class="muted small">${esc(fr(f.created_at.slice(0,10)))} · v${esc(f.version||"?")}${f.contact?` · <a href="mailto:${esc(f.contact)}">${esc(f.contact)}</a>`:""}</div><div>${esc(f.message)}</div></li>`).join("")}</ul>`:`<div class="empty">Aucun avis pour l'instant.</div>`}</section>
  <section class="card stack"><h3>Erreurs des 30 derniers jours</h3>${(ADMIN.errors||[]).length?`<ul class="adm-list">${ADMIN.errors.map(e=>`<li><div class="muted small">${e.n}× · dernière le ${esc(fr(e.created_at.slice(0,10)))} · v${esc(e.version||"?")} · ${esc(e.path||"")}</div><div class="mono small">${esc(e.message)}</div>${e.detail?`<details><summary class="small">Détail</summary><pre class="small">${esc(e.detail)}</pre></details>`:""}</li>`).join("")}</ul>`:`<div class="empty">Aucune erreur signalée.</div>`}</section>`;};

/* =====================================================================
   5. Installation sur l'écran d'accueil
   ===================================================================== */
let _bip=null;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();_bip=e;if(state.tab==="today")renderApp();});
const isStandalone=()=>window.matchMedia("(display-mode: standalone)").matches||navigator.standalone===true;
const isIOS=()=>/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
function installCard(){if(isStandalone()||READONLY||data.meta.main.installOff)return "";
  if(_bip)return `<section class="card stack install"><div><div class="eyebrow">Plus pratique</div><h3>Installe l'app sur ton téléphone</h3></div><p class="small">Elle s'ouvrira en plein écran depuis ton écran d'accueil, même sans réseau.</p><div class="actions"><button class="btn" type="button" data-install="1">Installer</button><button class="linkbtn" type="button" data-installoff="1">Plus tard</button></div></section>`;
  if(isIOS())return `<section class="card stack install"><div><div class="eyebrow">Plus pratique</div><h3>Ajoute l'app à ton écran d'accueil</h3></div>
    <ol class="steps"><li><span>Dans Safari, touche le bouton <b>Partager</b> <span class="ios-share" aria-hidden="true">⬆︎</span> en bas de l'écran.</span></li><li><span>Fais défiler et choisis <b>Sur l'écran d'accueil</b>.</span></li><li><span>Touche <b>Ajouter</b> : l'icône apparaît avec tes autres apps.</span></li></ol>
    <p class="small muted">Depuis l'icône, l'app s'ouvre en plein écran et peut t'envoyer des rappels (iOS 16.4 ou plus).</p><button class="linkbtn" type="button" data-installoff="1">Masquer</button></section>`;
  return "";}

/* =====================================================================
   6. Clics et formulaires
   ===================================================================== */
document.addEventListener("click",async e=>{const t=e.target.closest("button");if(!t)return;const D=t.dataset;
  if(D.legal){openLegal(D.legal);return;}
  if(D.legalclose){const el=$("#legalpage");if(el)el.remove();return;}
  if(D.delacc){openDeleteAccount();return;}
  if(D.adminreload){ADMIN.stats=null;ADMIN.err="";renderApp({force:true});return;}
  if(D.install&&_bip){_bip.prompt();try{await _bip.userChoice;}catch(err){}_bip=null;renderApp({force:true});return;}
  if(D.installoff){data.meta.main.installOff=true;lsSave();renderApp({force:true});return;}
});
document.addEventListener("submit",async e=>{const f=e.target;if(!f.dataset)return;
  if(f.dataset.delaccform){e.preventDefault();e.stopImmediatePropagation();deleteAccount(f);return;}
  if(f.dataset.feedback){e.preventDefault();e.stopImmediatePropagation();const m=f.elements.m.value.trim();if(m.length<3){toast("Écris ton message",true);return;}
    const b=f.querySelector("button[type=submit]");b.disabled=true;const ok=await sendReport("feedback",m,null,f.elements.c.value.trim());b.disabled=false;
    if(ok){f.reset();toast("Merci ! Ton message a bien été envoyé");}else toast("Envoi impossible pour le moment, réessaie plus tard",true);return;}
},true);
document.addEventListener("keydown",e=>{if(e.key==="Escape"){const el=$("#legalpage");if(el)el.remove();}});
MORE.push(["confidentialite","Confidentialité","Tes données et tes droits"],["mentions","Mentions légales","Éditeur, hébergement, conditions"]);
