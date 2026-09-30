/* Programme Padel — premier lancement (profil et démarrage) */
"use strict";
const OB={step:0,weight:null,pastAuth:false};
const AUTH={mode:"in",ctx:null};
const OB_STEPS=4;
function friendlyAuthErr(m){m=String(m||"");
  if(/invalid login|invalid_grant|credentials/i.test(m))return "e-mail ou mot de passe incorrect";
  if(/already registered|already exists|already been registered/i.test(m))return "un compte existe déjà avec cet e-mail : connecte-toi";
  if(/signups? not allowed|disabled/i.test(m))return "les inscriptions sont fermées pour le moment";
  if(/invalid.*email|email.*invalid/i.test(m))return "adresse e-mail invalide";
  if(/not confirmed/i.test(m))return "confirme d'abord ton e-mail (regarde tes spams)";
  if(/password/i.test(m)&&/6|short|weak/i.test(m))return "mot de passe trop court (6 caractères minimum)";
  if(/rate|too many/i.test(m))return "trop de tentatives, réessaie dans quelques minutes";
  if(/Failed to fetch|NetworkError|Load failed/i.test(m))return "pas de connexion internet";
  return m;}
function obMondays(){const out=[],m0=nextMonday(),t=todayIso(),d=new Date();const cur=addDays(t,-((d.getDay()+6)%7));
  if(cur!==m0)out.push([cur,"Cette semaine (lundi "+fr(cur)+")"]);
  for(let i=0;i<4;i++){const m=addDays(m0,7*i);out.push([m,(i===0&&cur!==m0?"Lundi prochain":"Lundi")+" "+fr(m)]);}return out;}
function obDots(){return `<div class="ob-dots" aria-label="Étape ${OB.step+1} sur ${OB_STEPS+1}">${Array.from({length:OB_STEPS+1},(_,i)=>`<i class="${i<=OB.step?"on":""}"></i>`).join("")}</div>`;}
function obBody(){const s=S_();
  if(OB.step===0&&cloudOn()&&!OB.pastAuth)return authHtml("start");
  if(OB.step===0)return `<div class="ob-hero"><svg viewBox="0 0 64 64" aria-hidden="true"><rect x="6" y="10" width="52" height="44" rx="4" fill="none" stroke="currentColor" stroke-width="3"/><path d="M6 32h52M32 10v44" stroke="currentColor" stroke-width="2" opacity=".5"/><circle cx="46" cy="20" r="5" fill="var(--ball)"/></svg></div>
   <h2>Bienvenue</h2>
   <p>Ton préparateur physique de poche pour le padel : un programme sur 12 semaines adapté à tes tournois, des séances guidées avec minuteurs, une routine de mobilité quotidienne et un suivi de tes progrès.</p>
   <p class="small muted">Deux minutes pour régler ton profil, et c'est parti.</p>
   <form class="stack" data-onboard="0">
    <label class="check"><input type="checkbox" name="ok" required> <span>J'ai compris que ce programme ne remplace pas un avis médical, et je consulterai un professionnel en cas de douleur ou de problème de santé.</span></label>
    <button class="btn block" type="submit">Commencer</button></form>
   <div class="ob-alt"><label class="linkbtn filebtn">Restaurer une sauvegarde<input type="file" id="file-import" accept="application/json,.json" hidden></label>
    ${cloudOn()?`<button class="linkbtn" type="button" data-ob="tologin">J'ai déjà un compte</button>`:""}</div>`;
  if(OB.step===1)return `<div class="eyebrow">Étape 1 · Profil</div><h2>Parle-moi de toi</h2>
   <p class="small muted">Sert à calculer tes zones cardiaques et tes besoins nutritionnels. Tout reste modifiable dans Réglages.</p>
   <form class="stack" data-onboard="1">
    <label>Prénom<input name="name" value="${esc(s.name||"")}" autocomplete="given-name" maxlength="30" placeholder="Facultatif"></label>
    <div class="ob-seg" role="radiogroup" aria-label="Sexe">${[["H","Homme"],["F","Femme"]].map(([v,l])=>`<label><input type="radio" name="sex" value="${v}" ${s.sex===v?"checked":""}><span>${l}</span></label>`).join("")}</div>
    <div class="form-row"><label>Âge<input type="number" inputmode="numeric" name="age" min="12" max="90" value="${esc(s.age??"")}" required></label>
     <label>Taille (cm)<input type="number" inputmode="numeric" name="height" min="120" max="230" value="${esc(s.height??"")}" required></label>
     <label>Poids (kg)<input type="number" inputmode="decimal" step="0.1" name="kg" min="35" max="200" value="${esc(OB.weight??"")}" required></label></div>
    ${obNav()}</form>`;
  if(OB.step===2)return `<div class="eyebrow">Étape 2 · Padel</div><h2>Ton jeu</h2>
   <form class="stack" data-onboard="2">
    <div class="lbl">Côté de jeu</div><div class="ob-seg" role="radiogroup" aria-label="Côté de jeu">${[["gauche","Gauche"],["droite","Droite"]].map(([v,l])=>`<label><input type="radio" name="side" value="${v}" ${s.side===v?"checked":""}><span>${l}</span></label>`).join("")}</div>
    <div class="ob-fields"><label>Catégorie habituelle<select name="level">${LEVELS.map(l=>`<option ${s.level===l?"selected":""}>${l}</option>`).join("")}</select></label>
     <label>Jour de tournoi habituel<select name="tDefault">${TDAY_OPTS.map(([v,l])=>`<option value="${v}" ${s.tDefault===v?"selected":""}>${l}</option>`).join("")}</select></label>
     <label>Jour habituel de ton cours<select name="lessonDay">${LESSON_DAYS.map(([v,l])=>`<option value="${v}" ${s.lessonDay===v?"selected":""}>${l}</option>`).join("")}</select></label></div>
    <p class="small muted">Ce sont tes habitudes. Chaque début de semaine, tu pourras indiquer tes vrais jours de cours, de partie et de tournoi : les séances physiques se replacent automatiquement.</p>
    ${obNav()}</form>`;
  if(OB.step===3){const ms=obMondays(),cur=s.start||nextMonday();return `<div class="eyebrow">Étape 3 · Démarrage</div><h2>Quand commences-tu ?</h2>
   <p class="small muted">Le programme démarre toujours un lundi. Avant cette date, tu peux déjà faire la mobilité et découvrir les exercices.</p>
   <form class="stack" data-onboard="3"><div class="ob-list">${ms.map(([v,l])=>`<label><input type="radio" name="start" value="${v}" ${cur===v?"checked":""}><span>${esc(l)}</span></label>`).join("")}</div>
    ${obNav()}</form>`;}
  const bmi=OB.weight&&s.height?OB.weight/((s.height/100)**2):null;
  return `<div class="eyebrow">Récapitulatif</div><h2>${s.name?"C'est prêt, "+esc(s.name)+" !":"C'est prêt !"}</h2>
   <ul class="ob-recap"><li><b>Début</b><span>${esc(frLong(s.start||nextMonday()))}</span></li><li><b>Profil</b><span>${s.sex==="F"?"Femme":"Homme"} · ${esc(s.age)} ans · ${esc(s.height)} cm${OB.weight?" · "+String(OB.weight).replace(".",",")+" kg":""}</span></li>
    <li><b>Padel</b><span>Joueur${s.sex==="F"?"se":""} de ${s.side} · ${esc(s.level)}</span></li><li><b>Tournois</b><span>${esc((TDAY_OPTS.find(x=>x[0]===s.tDefault)||[,"Samedi"])[1])}</span></li>
    <li><b>Zone 2 cardio</b><span>${zone2Range()} bpm</span></li></ul>
   ${bmi&&bmi>=25?`<p class="small muted">Objectif poids : tu peux choisir une perte douce dans Réglages, les apports seront calculés pour toi.</p>`:""}
   ${cloudOn()?`<form class="stack" data-onboard="4" novalidate>
    <section class="ob-acc stack"><div><div class="eyebrow">Gratuit · recommandé</div><h3>Crée ton compte</h3></div>
     <p class="small muted">Tes séances et tes progrès sont sauvegardés en ligne et tu retrouves tout sur ton ordinateur ou un nouveau téléphone.</p>
     <label>E-mail<input type="email" name="email" autocomplete="username" autocapitalize="off" autocorrect="off"></label>
     <label>Mot de passe (6 caractères minimum)<input type="password" name="pw" autocomplete="new-password" minlength="6"></label>
     <label>Confirme le mot de passe<input type="password" name="pw2" autocomplete="new-password" minlength="6"></label>
     <p class="small" id="ob-acc-status" role="status"></p>
     <button class="btn block" type="submit" name="go" value="acc">Créer mon compte et commencer</button></section>
    <div class="ob-nav"><button class="btn ghost" type="button" data-ob="back">Retour</button><button class="btn ghost" type="submit" name="go" value="skip">Continuer sans compte</button></div></form>`
   :`<form class="stack" data-onboard="4"><div class="ob-nav"><button class="btn ghost" type="button" data-ob="back">Retour</button><button class="btn" type="submit">C'est parti</button></div></form>`}`;}
function obNav(){return `<div class="ob-nav"><button class="btn ghost" type="button" data-ob="back">Retour</button><button class="btn" type="submit">Continuer</button></div>`;}
function renderOnboard(){let el=$("#onboard");
  if(READONLY||S_().onboarded){if(el){el.remove();document.body.classList.remove("ob-open");}return;}
  if(!el){el=document.createElement("div");el.id="onboard";el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-label","Configuration");document.body.appendChild(el);document.body.classList.add("ob-open");}
  const auth=OB.step===0&&cloudOn()&&!OB.pastAuth;
  el.innerHTML=`<div class="ob-card">${auth?"":obDots()}${obBody()}</div>`;el.scrollTop=0;
  const first=el.querySelector("input:not([type=hidden]):not([type=file]):not([type=checkbox]):not([type=radio])");if(first&&OB.step===1&&!first.value)setTimeout(()=>{try{first.focus({preventScroll:true});}catch(e){}},50);}
function onboardClick(t){const a=t.dataset.ob;
  if(a==="back"){OB.step=Math.max(0,OB.step-1);}
  else if(a==="signup"||a==="noacc"){OB.pastAuth=true;OB.step=0;Sync.status="";}
  else if(a==="tologin"){OB.pastAuth=false;AUTH.mode="in";Sync.status="";}
  renderOnboard();}
async function onboardSubmit(f,sb){const s=S_(),n=+f.dataset.onboard,v=k=>f.elements[k]?f.elements[k].value:"";
  if(n===1){s.name=v("name").trim().slice(0,30);s.sex=v("sex")||"H";s.age=num(v("age"));s.height=num(v("height"));OB.weight=num(v("kg"));}
  if(n===2){s.side=v("side")||"gauche";s.level=v("level");s.tDefault=v("tDefault");s.lessonDay=v("lessonDay");}
  if(n===3){s.start=v("start")||nextMonday();}
  if(n===4&&sb&&sb.value==="acc"){const st=$("#ob-acc-status"),em=v("email").trim(),pw=v("pw");
    const err=accCheck(em,pw,v("pw2"),"up");if(err){st.textContent=err;st.className="small bad-txt";return;}
    st.className="small muted";st.textContent="Création du compte…";sb.disabled=true;
    try{const r=await Sync.signUp(em,pw);obFinish(r==="confirm"?"Compte créé : clique sur le lien reçu par e-mail pour l'activer":"Compte créé, tes données sont sauvegardées");}
    catch(e){sb.disabled=false;st.className="small bad-txt";st.textContent=friendlyAuthErr(e.message);}
    return;}
  if(n===4){obFinish();return;}
  lsSave();OB.step=n+1;renderOnboard();}

/* Liens reçus par e-mail (confirmation de compte, mot de passe oublié) */
function handleAuthHash(){
  const h=(location.hash||"").slice(1);if(!/access_token=|error_description=/.test(h)||!cloudOn())return false;
  const q=new URLSearchParams(h);history.replaceState(null,"",location.pathname+location.search);
  if(q.get("error_description")){toast("Lien expiré ou déjà utilisé : recommence depuis Réglages",true);return true;}
  let sub=null,email="";try{const pl=JSON.parse(atob(q.get("access_token").split(".")[1].replace(/-/g,"+").replace(/_/g,"/")));sub=pl.sub;email=pl.email||"";}catch(e){}
  Sync.keep({access_token:q.get("access_token"),refresh_token:q.get("refresh_token"),expires_in:+q.get("expires_in")||3600,user:{id:sub}},email);
  {const cc=Sync.cfg();delete cc.pending;Sync.set(cc);}
  if(q.get("type")==="recovery"){showPwReset();}
  else{Sync.pull(true).then(()=>{renderApp({force:true});renderOnboard();if(S_().onboarded)toast("Compte activé : tu es connecté");else showActivated();}).catch(()=>{});}
  return true;}
function showPwReset(){let el=$("#pwreset");if(!el){el=document.createElement("div");el.id="pwreset";el.className="ob-modal";document.body.appendChild(el);}
  el.innerHTML=`<form class="card stack" data-pwreset="1"><h2>Nouveau mot de passe</h2><label>Mot de passe (6 caractères minimum)<input type="password" name="pw" minlength="6" autocomplete="new-password" required></label>
   <div class="actions"><button class="btn" type="submit">Enregistrer</button><button class="btn ghost" type="button" data-pwclose="1">Annuler</button></div><p class="muted small" id="pw-status"></p></form>`;}
document.addEventListener("click",e=>{if(e.target.closest("[data-pwclose]")){const el=$("#pwreset");if(el)el.remove();}});
document.addEventListener("submit",async e=>{const f=e.target;if(!f.dataset||!f.dataset.pwreset)return;e.preventDefault();e.stopImmediatePropagation();
  const st=$("#pw-status"),pw=f.elements.pw.value;if(pw.length<6){st.textContent="6 caractères minimum";return;}
  try{const c=Sync.cfg(),tk=await Sync.token();const r=await fetch(Sync.base()+"/auth/v1/user",{method:"PUT",headers:{apikey:c.key,Authorization:"Bearer "+tk,"Content-Type":"application/json"},body:JSON.stringify({password:pw})});
   if(!r.ok)throw new Error("Erreur "+r.status);$("#pwreset").remove();toast("Mot de passe modifié");await Sync.pull(true);renderApp({force:true});renderOnboard();}
  catch(err){st.textContent="Échec : "+friendlyAuthErr(err.message);}},true);

function obFinish(msg){const s=S_();
  if(OB.weight){const id=uid();save("weights",id,{id,date:todayIso(),kg:OB.weight},{silent:true});OB.weight=null;}
  s.onboarded=true;lsSave();state.week=null;renderOnboard();renderApp({force:true});window.scrollTo(0,0);
  toast(msg||(s.name?"Bienvenue "+s.name+" !":"Bienvenue !"));}
function accCheck(email,pw,pw2,mode){
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))return "Indique une adresse e-mail valide";
  if(mode==="recover")return "";
  if(!pw)return "Indique ton mot de passe";
  if(mode==="up"&&pw.length<6)return "Mot de passe : 6 caractères minimum";
  if(mode==="up"&&pw!==pw2)return "Les deux mots de passe ne sont pas identiques";
  return "";}
async function accountSubmit(f,act){const v=k=>f.elements[k]?f.elements[k].value:"",c=Sync.cfg(),em=v("email").trim();
  const say=m=>{Sync.status=m;paintSyncStatus();};
  if(!cloudOn()){say("Les comptes ne sont pas disponibles pour le moment");return;}
  const err=accCheck(em,v("pw"),v("pw2"),act);if(err){say(err);return;}
  c.email=em;Sync.set(c);
  if(act==="recover"){say("Envoi…");try{await Sync.recover(em);say("E-mail envoyé : suis le lien pour choisir un nouveau mot de passe (pense aux spams).");}catch(e){say("Échec : "+friendlyAuthErr(e.message));}return;}
  say(act==="up"?"Création du compte…":"Connexion…");
  try{if(act==="up"){const r=await Sync.signUp(em,v("pw"));
      if(r==="confirm"){Sync.status="Compte créé ! Clique sur le lien reçu par e-mail pour l'activer.";closeAuth();renderApp({force:true});renderOnboard();toast("Compte créé : active-le avec le lien reçu par e-mail");return;}
      Sync.status="Compte créé";toast("Compte créé : tes données sont sauvegardées");}
    else{await Sync.signIn(em,v("pw"));Sync.status="Connecté";toast("Connecté");}
    OB.pastAuth=true;closeAuth();renderApp({force:true});renderOnboard();}
  catch(e){say("Échec : "+friendlyAuthErr(e.message));}}
function accountNudge(){if(!cloudOn()||READONLY||Sync.connected()||Sync.cfg().pending||data.meta.main.accNudgeOff||totalDone()<1)return "";
  return `<section class="card stack acc-nudge"><div><div class="eyebrow">Ne perds rien</div><h3>Crée ton compte gratuit</h3></div>
   <p class="small">Tes séances sont pour l'instant enregistrées uniquement sur cet appareil. Avec un compte, elles sont sauvegardées et synchronisées partout.</p>
   <div class="actions"><button class="btn" type="button" data-auth="up">Créer mon compte</button><button class="btn ghost" type="button" data-auth="in">Se connecter</button><button class="linkbtn" type="button" data-accnudge="1">Plus tard</button></div></section>`;}
function showActivated(){let el=$("#pwreset");if(!el){el=document.createElement("div");el.id="pwreset";el.className="ob-modal";document.body.appendChild(el);}
  el.innerHTML=`<div class="card stack"><h2>Compte activé</h2><p>Ton adresse est confirmée.</p><p class="small muted">Si tu as installé l'app sur ton écran d'accueil, ouvre-la et touche « Se connecter » (Plus > Réglages > Mon compte) : tes données s'y synchroniseront. Sinon, tu peux continuer ici.</p><div class="actions"><button class="btn" type="button" data-pwclose="1">Continuer ici</button></div></div>`;}

/* =====================================================================
   Page de connexion (e-mail + mot de passe)
   ===================================================================== */
const AUTH_LOGO=`<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="6" y="10" width="52" height="44" rx="4" fill="none" stroke="currentColor" stroke-width="3"/><path d="M6 32h52M32 10v44" stroke="currentColor" stroke-width="2" opacity=".5"/><circle cx="46" cy="20" r="5" fill="var(--ball)"/></svg>`;
function authHtml(ctx){const m=AUTH.mode,c=Sync.cfg(),start=ctx==="start";
  const T={in:["Connexion","Retrouve ton programme, tes séances et tes progrès sur tous tes appareils."],up:["Créer un compte","Gratuit. Tes données sont sauvegardées en ligne et synchronisées entre ton téléphone et ton ordinateur."],recover:["Mot de passe oublié","Indique ton adresse : tu recevras un lien pour choisir un nouveau mot de passe."]}[m];
  return `<div class="auth">
   ${start?"":`<button class="auth-close" type="button" data-authclose="1" aria-label="Fermer">✕</button>`}
   <div class="auth-brand"><div class="ob-hero">${AUTH_LOGO}</div><div class="auth-app">${esc(APP_CONFIG.name||"Programme Padel")}</div></div>
   <h2>${T[0]}</h2><p class="small muted">${T[1]}</p>
   <form class="stack auth-form" data-syncform="1" novalidate>
    <label>Adresse e-mail<input type="email" name="email" value="${esc(c.email||"")}" autocomplete="${m==="up"?"email":"username"}" autocapitalize="off" autocorrect="off" spellcheck="false" inputmode="email" placeholder="toi@exemple.fr" required></label>
    ${m!=="recover"?`<label>Mot de passe<span class="pw-wrap"><input type="password" name="pw" autocomplete="${m==="up"?"new-password":"current-password"}" minlength="6" required placeholder="${m==="up"?"6 caractères minimum":""}"><button type="button" class="pw-eye" data-pwshow="1" aria-label="Afficher le mot de passe">Afficher</button></span></label>`:""}
    ${m==="up"?`<label>Confirme le mot de passe<input type="password" name="pw2" autocomplete="new-password" minlength="6" required></label>`:""}
    ${m==="in"?`<button class="linkbtn auth-forgot" type="button" data-authmode="recover">Mot de passe oublié ?</button>`:""}
    <button class="btn block" type="submit" name="act" value="${m}">${m==="in"?"Se connecter":m==="up"?"Créer mon compte":"Recevoir le lien"}</button>
    <p class="small auth-status" id="sync-status" role="status" aria-live="polite">${esc(Sync.status||"")}</p>
   </form>
   <div class="auth-sep"><span>${m==="in"?"Pas encore de compte ?":"Déjà inscrit ?"}</span></div>
   ${m==="in"?(start?`<button class="btn ghost block" type="button" data-ob="signup">Créer un compte</button>`:`<button class="btn ghost block" type="button" data-authmode="up">Créer un compte</button>`)
     :`<button class="btn ghost block" type="button" data-authmode="in">Se connecter</button>`}
   ${start?`<div class="ob-alt"><button class="linkbtn" type="button" data-ob="noacc">Continuer sans compte</button><label class="linkbtn filebtn">Restaurer une sauvegarde<input type="file" id="file-import" accept="application/json,.json" hidden></label></div>
    <p class="muted small auth-note">Sans compte, tes données restent uniquement sur cet appareil.</p>`:""}
  </div>`;}
function openAuth(mode){if(!cloudOn()){toast("Les comptes ne sont pas disponibles pour le moment",true);return;}
  AUTH.mode=mode||"in";AUTH.ctx="modal";Sync.status="";let el=$("#authpage");
  if(!el){el=document.createElement("div");el.id="authpage";el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-label","Connexion");document.body.appendChild(el);document.body.classList.add("ob-open");}
  el.innerHTML=`<div class="ob-card">${authHtml("modal")}</div>`;el.scrollTop=0;
  const i=el.querySelector('[name=email]');if(i&&!i.value)setTimeout(()=>{try{i.focus({preventScroll:true});}catch(e){}},60);}
function closeAuth(){const el=$("#authpage");if(el){el.remove();if(!$("#onboard"))document.body.classList.remove("ob-open");}AUTH.ctx=null;}
function rerenderAuth(){if($("#authpage"))openAuth(AUTH.mode);else renderOnboard();}
document.addEventListener("click",e=>{const t=e.target.closest("button");if(!t)return;const D=t.dataset;
  if(D.auth){openAuth(D.auth);return;}
  if(D.authclose){closeAuth();return;}
  if(D.authmode){const email=(t.closest(".auth")||document).querySelector('[name=email]');if(email&&email.value){const c=Sync.cfg();c.email=email.value.trim();Sync.set(c);}
    AUTH.mode=D.authmode;Sync.status="";rerenderAuth();return;}
  if(D.pwshow){const f=t.closest("form");const show=t.textContent==="Afficher";f.querySelectorAll('input[name=pw],input[name=pw2]').forEach(i=>i.type=show?"text":"password");t.textContent=show?"Masquer":"Afficher";t.setAttribute("aria-label",show?"Masquer le mot de passe":"Afficher le mot de passe");return;}
});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&$("#authpage"))closeAuth();});
