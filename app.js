/* Programme Padel — navigation, évènements, démarrage */
"use strict";
const APP_VERSION="3.6.1";
const TABS=[["today","Aujourd'hui",'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>'],
 ["week","Semaine",'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'],
 ["lib","Exercices",'<path d="M6 8v8M18 8v8M3 10v4M21 10v4M6 12h12"/>'],
 ["stats","Suivi",'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'],
 ["more","Plus",'<circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/>']];
const TITLES={today:"Aujourd'hui",week:"Semaine",lib:"Exercices",stats:"Suivi",more:"Plus"};

function applyTheme(){
  const t=S_().theme,root=document.documentElement;
  if(t==="light"||t==="dark")root.dataset.theme=t;else delete root.dataset.theme;
  const dark=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);
  $$('meta[name="theme-color"]').forEach(m=>m.setAttribute("content",dark?"#0D151D":"#EEF2F1"));
}
let pendingRender=false;
function renderApp(opts={}){
  const ae=document.activeElement,main=$("#main");
  if(!opts.force&&ae&&main&&main.contains(ae)&&/^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName)&&ae.type!=="checkbox"){pendingRender=true;return;}
  pendingRender=false;
  const openD=$$("#main details[open]").map(d=>d.dataset.k).filter(Boolean);
  const subTitle=state.tab==="more"&&state.sub?(MORE.find(m=>m[0]===state.sub)||[])[1]:null;
  $("#apptitle").textContent=subTitle||TITLES[state.tab];
  $("#appsub").textContent=state.tab==="today"?"":(todayRef()?`Semaine ${curWeek()} · ${blockOf(curWeek()).name}`:`Début le ${fr(startDate())}`);
  const view={today:renderToday,week:renderWeek,lib:renderLib,stats:renderStats,more:renderMore}[state.tab]||renderToday;
  document.body.dataset.tab=state.tab;
  if(state.tab==="more"&&state.sub)document.body.dataset.sub=state.sub;else delete document.body.dataset.sub;
  main.innerHTML=`<div class="panel">${view()}</div>`;
  openD.forEach(k=>{const d=$(`#main details[data-k="${k}"]`);if(d)d.open=true;});
  $$("#tabbar button").forEach(b=>b.setAttribute("aria-current",b.dataset.tab===state.tab?"page":"false"));
  paintSyncStatus();
  if(typeof checkAdmin==="function")checkAdmin();
  if(typeof renderOnboard==="function"&&$("#onboard")&&S_().onboarded)renderOnboard();
}
function go(tab,sub){state.tab=tab;state.sub=sub??null;state.moveFor=null;saveUi();renderApp({force:true});window.scrollTo(0,0);}
function confirmBtn(el,label,fn){if(el.dataset.confirm==="1"){fn();return;}const old=el.textContent;el.dataset.confirm="1";el.textContent=label;setTimeout(()=>{if(el.isConnected){el.dataset.confirm="";el.textContent=old;}},3000);}

/* ---------- Clics ---------- */
document.addEventListener("click",e=>{
  const t=e.target.closest("button,[data-zone],a");if(!t)return;
  const D=t.dataset;
  if(t.closest("#tabbar")&&D.tab){if(D.tab===state.tab&&state.tab==="more")go("more",null);else go(D.tab,D.tab==="more"?state.sub:null);return;}
  if(D.sub!=null){go("more",D.sub||null);return;}
  if(D.goto){const [a,b]=D.goto.split(":");if(state.run)closeRunner();go(a,b||null);return;}
  if(D.update){const reg=window._swreg;if(reg&&reg.waiting)reg.waiting.postMessage({type:"SKIP_WAITING"});else location.reload();return;}
  // Coach technique
  if(D.choose){const [k,d]=D.choose.split("|");chooseTheme(k,d);return;}
  if(D.lessoncopy){const [k,d]=D.lessoncopy.split("|"),txt=lessonText(k,d);if(navigator.share)navigator.share({title:"Cours de padel : "+k,text:txt}).catch(()=>{});else copyText(txt).then(ok=>toast(ok?"Plan copié : envoie-le à ton prof":"Copie impossible",!ok));return;}
  if(D.accmode){state.accMode=D.accmode;Sync.status="";if(t.closest("#onboard"))renderOnboard();else renderApp({force:true});return;}
  if(D.resend){const c=Sync.cfg();Sync.resend(c.pending||c.email).then(()=>toast("E-mail renvoyé")).catch(err=>toast("Échec : "+friendlyAuthErr(err.message),true));return;}
  if(D.accnudge){data.meta.main.accNudgeOff=true;lsSave();renderApp({force:true});return;}
  if(D.wipe){confirmBtn(t,"Confirmer : tout effacer ?",()=>{try{Object.keys(localStorage).filter(k=>k.startsWith("padel")).forEach(k=>localStorage.removeItem(k));}catch(e){}location.hash="";location.reload();});return;}
  if(D.ob!=null){onboardClick(t);return;}
  // v3
  if(D.evreg){const e=data.events[D.evreg];if(e){e.registered=!e.registered;save("events",e.id,e);}return;}
  if(D.evgoal){const e=data.events[D.evgoal];if(e){e.goal=!e.goal;save("events",e.id,e);toast(e.goal?"Objectif : affûtage les 10 jours d'avant":"Objectif retiré");}return;}
  if(D.rehab){const k=D.rehab,r=data.rehab[k];if(r&&r.active){r.active=false;save("rehab",k,r);toast("Programme désactivé");}else{save("rehab",k,{active:true,since:todayIso()});toast("Programme "+REHAB[k].name.toLowerCase()+" ajouté à tes séances");}return;}
  if(D.gearnew){const g=data.gear[D.gearnew];g.since=todayIso();save("gear",g.id,g);toast("Compteur remis à zéro");return;}
  if(D.vnotedel){const [id,i]=D.vnotedel.split("|"),v=data.videos[id];v.notes.splice(+i,1);save("videos",id,v);return;}
  if(D.metro){metroToggle(+D.metro,D.metrol||"");return;}
  if(D.metrostop){metroStop();return;}
  if(D.resumeend){const r=data.resume.main;r.until=todayIso();save("resume","main",r);return;}
  if(D.copy){copyText(D.copy).then(ok=>toast(ok?"Copié":"Copie impossible : sélectionne le texte",!ok));return;}
  if(D.lighten){lightenRestOfWeek();return;}
  if(D.push){D.push==="on"?enablePush():disablePush();return;}
  if(D.npref){const s=S_();s.notif={...notifPrefs(),[D.npref]:!notifPrefs()[D.npref]};lsSave();renderApp({force:true});return;}
  if(D.share){D.share==="on"?createShare():revokeShare();return;}
  if(D.csv){exportCsv(D.csv);return;}
  if(D.cnt){const [k,dv]=D.cnt.split("|"),d=todayIso(),n={...(data.nutri[d]||{})};n[k]=clamp((n[k]||0)+(+dv),0,20);save("nutri",d,n);return;}
  if(D.shopshare){const txt="Liste de courses (Programme Padel)\n"+shoppingList().map(x=>"- "+x.n+" : "+x.txt).join("\n");if(navigator.share)navigator.share({title:"Liste de courses",text:txt}).catch(()=>{});else copyText(txt).then(()=>toast("Liste copiée"));return;}
  // Semaine
  if(D.week){state.week=+D.week;state.day=null;state.moveFor=null;renderApp({force:true});return;}
  if(D.cyc){const c=+D.cyc,cw=curWeek();state.week=cycleOf(cw)===c?cw:(c-1)*12+1;state.day=null;renderApp({force:true});return;}
  if(D.day){state.day=D.day;state.moveFor=null;renderApp({force:true});return;}
  if(D.openday){const [w,d]=D.openday.split("|");state.week=+w;state.day=d;go("week");return;}
  if(D.tday){const [w,k]=D.tday.split("|");save("weeks","w"+w,{week:+w,tournoi:k});toast("Semaine adaptée à ton tournoi");return;}
  if(D.mob){const dt=D.mob;if(data.mobilite[dt])remove("mobilite",dt);else{save("mobilite",dt,{date:dt,done:true});toast("Mobilité enregistrée");}return;}
  if(D.adj){const [id,k]=D.adj.split("|"),a={...(data.adj[id]||{})};if(k==="home"){const w=+id.slice(1,id.indexOf("-")),d=id.slice(id.indexOf("-")+1);a.home=!planFor(w,d).home;}else a[k]=!a[k];save("adj",id,a);toast(a[k]?(k==="short"?"Version courte activée":"Version maison activée"):"Séance normale");return;}
  if(D.move){state.moveFor=state.moveFor===D.move?null:D.move;renderApp({force:true});return;}
  if(D.swap){const [w,a,b]=D.swap.split("|");doSwap(+w,a,b);return;}
  if(D.swapreset){delete data.swaps["w"+D.swapreset];state.moveFor=null;lsSave();renderApp({force:true});toast("Déplacements annulés");return;}
  if(D.how){const id=D.how,box=document.getElementById("d-"+id);if(!box)return;const parts=id.split("-"),i=+parts.pop(),pid=parts.join("-"),w=+pid.slice(1,pid.indexOf("-")),d=pid.slice(pid.indexOf("-")+1);
    if(state.open.has(id)){state.open.delete(id);box.hidden=true;t.textContent="Comment faire";t.setAttribute("aria-expanded","false");}
    else{state.open.add(id);box.innerHTML=exDetail(planFor(w,d).items[i][0]);box.hidden=false;t.textContent="Masquer";t.setAttribute("aria-expanded","true");}return;}
  if(D.dellog){confirmBtn(t,"Confirmer",()=>{remove("logs",D.dellog);toast("Séance effacée");});return;}
  if(D.del){confirmBtn(t,"confirmer ?",()=>{const [c,id]=D.del.split(":");remove(c,id);});return;}
  // Minuteurs
  if(D.timer){const id=D.timer;if(TM.id===id){tmClose();}else{if(TM.id)tmClose();tmOpen(id);t.setAttribute("aria-expanded","true");tmPaint();const s=document.getElementById("tm-slot-"+id);s&&s.scrollIntoView({block:"nearest",behavior:"smooth"});}return;}
  if(D.tm){const a=D.tm;if(a==="go")tmGo();else if(a==="skip")tmNext();else if(a==="reset")tmReset();else if(a==="close"){tmClose();}return;}
  if(D.anim){const wrap=t.closest(".figwrap"),figs=wrap.querySelector(".figs"),an=wrap.querySelector(".figanim"),host=an.querySelector(".anim-host");
    if(an.hidden){an.hidden=false;figs.hidden=true;t.textContent="■ Voir les étapes";startAnim(host,D.anim);}else{stopAnim(host);an.hidden=true;figs.hidden=false;t.textContent="▶ Voir le mouvement";}return;}
  // Mode séance
  if(D.run){openRunner(D.run);return;}
  if(D.rnav){runnerGo(+D.rnav);return;}
  if(D.rclose){closeRunner();return;}
  if(D.rrpe){state.run.rpe=+D.rrpe;$$("[data-rrpe]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.rrpe===D.rrpe));return;}
  // Forme du matin
  if(D.ck){const [k,v]=D.ck.split("|");const sh=($("#ck-sleepH")||{}).value,hr=($("#ck-hr")||{}).value;state.ck={...(state.ck||data.checkins[todayIso()]||{}),[k]:+v};if(sh)state.ck.sleepH=num(sh);if(hr)state.ck.hr=num(hr);renderApp({force:true});return;}
  if(D.cksave){if(!state.ck)return;const sh=num(($("#ck-sleepH")||{}).value),hr=num(($("#ck-hr")||{}).value),prev=data.checkins[todayIso()]||{};const o={...prev,...state.ck,date:todayIso()};if(sh!=null)o.sleepH=sh;if(hr!=null)o.hr=hr;save("checkins",todayIso(),o);state.ck=null;state.ckEdit=false;renderApp({force:true});return;}
  if(D.ckedit){state.ckEdit=true;state.ck={...data.checkins[todayIso()]};renderApp({force:true});return;}
  // Nutrition
  if(D.nutri){const d=todayIso(),n={...(data.nutri[d]||{})};n[D.nutri]=!n[D.nutri];save("nutri",d,n);return;}
  if(D.water){const d=todayIso(),n={...(data.nutri[d]||{})};n.water=clamp((n.water||0)+(+D.water),0,20);save("nutri",d,n);return;}
  // Bibliothèque / Suivi
  if(D.cat!=null&&t.closest(".filters")){state.cat=D.cat;renderApp({force:true});return;}
  if(D.export){exportData();return;}
  if(D.shareweek){shareWeek(+D.shareweek);return;}
  if(D.sharetourn){shareTournament(D.sharetourn);return;}
  // Douleurs
  if(D.zone!=null){state.painZone=D.zone||null;state.painLvl=null;renderApp({force:true});return;}
  if(D.plvl){state.painLvl=+D.plvl;$$("[data-plvl]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.plvl===D.plvl));const sb=t.closest("form").querySelector('[type="submit"]');if(sb)sb.disabled=false;return;}
  // Tournois : matchs
  if(D.mres||D.maddmatch){const f=t.closest("form");const dr=state.trDraft||{matches:[{s:"",r:"V"},{s:"",r:"V"}]};dr.matches=dr.matches.map((m,i)=>readMatch(f,i,m));
    if(D.mres){const [i,r]=D.mres.split("|");dr.matches[+i].r=r;}else dr.matches.push({s:"",r:"V"});state.trDraft=dr;
    const keep={};[...f.elements].forEach(el=>{if(el.name&&!/^m(s|o|n|w|ue|sm|df)\d/.test(el.name))keep[el.name]=el.value;});renderApp({force:true});const nf=$('form[data-tournoi]');Object.entries(keep).forEach(([k,v])=>{if(nf.elements[k])nf.elements[k].value=v;});return;}
  // Sac
  if(D.bagreset){data.bag.main.checked={};lsSave();renderApp({force:true});return;}
  if(D.bagdel!=null){const b=data.bag.main,x=b.items[+D.bagdel];b.items.splice(+D.bagdel,1);delete b.checked[x];lsSave();renderApp({force:true});return;}
  // Calendrier
  if(D.icsr){state.icsRange=D.icsr;renderApp({force:true});return;}
  if(D.ics){const cw=curWeek(),to=state.icsRange==="1"?cw:state.icsRange==="4"?cw+3:cycleOf(cw)*12;const ics=buildIcs(Math.max(1,cw),Math.max(1,to),{mob:!!state.icsMob});const blob=new Blob([ics],{type:"text/calendar"});
    if(D.ics==="share")shareFile(blob,"programme-padel.ics","Programme padel");
    else{const url=URL.createObjectURL(blob);const w=window.open(url,"_blank");if(!w)shareFile(blob,"programme-padel.ics","Programme padel");}return;}
  // Bilan
  if(D.bilan){state.bilanDays=+D.bilan;renderApp({force:true});return;}
  if(D.copybilan){const ta=$("#bilantxt");copyText(ta.value).then(ok=>{if(ok)toast("Bilan copié");else{ta.focus();ta.select();toast("Sélectionne le texte et copie-le",true);}});return;}
  // Sync
  if(D.sync==="now"){Sync.status="Synchronisation…";paintSyncStatus();Sync.pull();return;}
  if(D.sync==="out"){Sync.signOut();renderApp({force:true});return;}
});
document.addEventListener("focusout",()=>{setTimeout(()=>{if(pendingRender){const ae=document.activeElement;if(!ae||!$("#main").contains(ae)||!/^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName))renderApp();}},50);});

function readMatch(f,i,m){const g=n=>f.elements[n+i]?f.elements[n+i].value.trim():"";return {s:g("ms")||m.s||"",r:m.r||"V",o:g("mo")||m.o||"",note:g("mn")||m.note||"",w:num(g("mw")),ue:num(g("mue")),sm:num(g("msm")),df:num(g("mdf"))};}
/* ---------- Saisies ---------- */
document.addEventListener("input",e=>{
  const el=e.target;
  if(el.dataset.set){onSetInput(el);return;}
  if(el.dataset.test){onTestInput(el);return;}
  if(el.dataset.tech){onTechInput(el);return;}
  if(el.id==="libq"){state.q=el.value;const pos=el.selectionStart;renderApp({force:true});const n=$("#libq");if(n){n.focus();try{n.setSelectionRange(pos,pos);}catch(x){}}return;}
});
document.addEventListener("change",e=>{
  const el=e.target;
  if(el.dataset.tech){onTechInput(el);return;}
  if(el.id==="lessonday"){S_().lessonDay=el.value;lsSave();renderApp({force:true});return;}
  if(el.id==="lessonday"){S_().lessonDay=el.value;lsSave();renderApp({force:true});return;}
  if(el.id==="exsel"){state.exKey=el.value;renderApp({force:true});return;}
  if(el.id==="tsel"){state.testKey=el.value;renderApp({force:true});return;}
  if(el.id==="file-import"&&el.files[0]){importData(el.files[0]);el.value="";return;}
  if(el.dataset.time){S_().times[el.dataset.time]=el.value;lsSave();return;}
  if(el.dataset.mobtime){S_().mobTime=el.value;lsSave();return;}
  if(el.id==="icsmob"){state.icsMob=el.checked;return;}
  if(el.dataset.mcl!=null){const k="cl-"+todayIso(),o={...(data.mental[k]||{})};o[el.dataset.mcl]=el.checked;data.mental[k]=o;lsSave();return;}
  if(el.dataset.shop){const wk=curWeek();let m=data.meals.main;if(!m||m.week!==wk)m=data.meals.main={week:wk,checked:{}};m.checked[el.dataset.shop]=el.checked;lsSave();return;}
  if(el.dataset.bag!=null){const b=data.bag.main,x=b.items[+el.dataset.bag];b.checked[x]=el.checked;lsSave();return;}
});
document.addEventListener("submit",async e=>{
  e.preventDefault();const f=e.target,F=f.dataset,v=n=>f.elements[n]?f.elements[n].value:"";
  if(F.log){const id=F.log,w=+id.slice(1,id.indexOf("-")),d=id.slice(id.indexOf("-")+1),p=planFor(w,d),l=ensureLog(p);
    Object.assign(l,{date:v("date"),duree:num(v("duree"))||0,rpe:+v("rpe"),note:v("note").trim(),done:true,updated:Date.now()});lsSave();$("#main").contains(document.activeElement)&&document.activeElement.blur();renderApp({force:true});toast("Séance enregistrée");return;}
  if(F.runsave){const id=F.runsave,R=state.run,p=planFor(R.w,R.d),l=ensureLog(p);
    Object.assign(l,{duree:num(v("duree"))||0,rpe:R.rpe,note:v("note").trim(),done:true,updated:Date.now(),date:l.date||todayIso()});lsSave();closeRunner();toast("Séance enregistrée. Bravo !");return;}
  if(F.quickweight||F.weight){const kg=num(v("kg"));if(!kg){toast("Indique ton poids",true);return;}const id=uid(),o={id,date:F.weight?v("date"):todayIso(),kg};const ta=num(v("taille"));if(ta)o.taille=ta;save("weights",id,o);toast("Pesée ajoutée");return;}
  if(F.tests){const id=uid(),r={id,date:v("date")};let any=false;TESTS.forEach(x=>{const val=num(v(x.k));if(val!=null){r[x.k]=val;any=true;}});if(!any){toast("Remplis au moins un test",true);return;}save("tests",id,r);toast("Tests enregistrés");return;}
  if(F.tournoi){const dr=state.trDraft||{matches:[{s:"",r:"V"},{s:"",r:"V"}]};const matches=dr.matches.map((m,i)=>readMatch(f,i,m)).filter(m=>m.s||m.o);
    const id=uid(),t={id,date:v("date"),cat:v("cat"),lieu:v("lieu").trim(),partner:v("partner").trim(),res:v("res"),pts:num(v("pts")),rank:num(v("rank")),matches,matchs:matches.length,victoires:matches.filter(m=>m.r==="V").length,physique:+v("physique"),fin:v("fin"),note:v("note").trim()};
    data.tournois[id]=t;if(t.rank){const rid=uid();data.ranking[rid]={id:rid,date:t.date,rank:t.rank};}state.trDraft=null;lsSave();renderApp({force:true});toast("Tournoi enregistré");return;}
  if(F.rank){const r=num(v("rank"));if(!r)return;const id=uid();save("ranking",id,{id,date:v("date"),rank:r});toast("Classement ajouté");return;}
  if(F.pain){if(!state.painZone||!state.painLvl)return;const id=uid();save("pains",id,{id,date:v("date"),zone:state.painZone,level:state.painLvl,note:v("note").trim()},{silent:true});state.painZone=null;state.painLvl=null;renderApp({force:true});toast("Douleur notée");return;}
  if(F.goal){const g=data.goals[F.goal];g.target=num(v("target"));save("goals",g.id,g);toast("Objectif mis à jour");return;}
  if(F.goaladd){const type=v("type"),id=uid();let label=type==="poids"?"Poids":type==="classement"?"Classement FFT":type.startsWith("exo:")?exName(type.slice(4))+" (1RM estimé)":(TESTS.find(t=>"test:"+t.k===type)||{}).name;const unit=type==="poids"?"kg":type==="classement"?"e":type.startsWith("exo:")?"kg":(TESTS.find(t=>"test:"+t.k===type)||{}).u;save("goals",id,{id,type,label,target:num(v("target")),unit});toast("Objectif ajouté");return;}
  if(F.techadd){const id=uid();save("tech",id,{id,date:v("date"),theme:v("theme"),rating:v("rating"),goal:v("goal").trim(),notes:v("notes").trim()});toast("Note ajoutée");return;}
  if(F.bagadd){const x=v("item").trim();if(!x)return;data.bag.main.items.push(x);lsSave();renderApp({force:true});return;}
  if(F.evadd){const id=uid(),e={id,date:v("date"),end:v("end")||null,cat:v("cat"),lieu:v("lieu").trim(),deadline:v("deadline")||null,note:v("note").trim(),goal:f.elements.goal.checked,registered:f.elements.registered.checked};if(!e.date)return;syncEventToWeeks(e);save("events",id,e);toast(e.goal?"Tournoi objectif ajouté : affûtage programmé":"Tournoi ajouté : la semaine s'adapte");return;}
  if(F.oppadd){const id=uid();save("opps",id,{id,name:v("name").trim(),club:v("club").trim(),forts:v("forts").trim(),faibles:v("faibles").trim(),plan:v("plan").trim()});toast("Paire ajoutée");return;}
  if(F.mjournal){const id=uid();save("mental",id,{id,kind:"journal",date:v("date"),conf:+v("conf"),good:v("good").trim(),next:v("next").trim()});toast("Journal enregistré");return;}
  if(F.gearadd){const id=uid();save("gear",id,{id,type:v("type"),name:v("name").trim(),since:v("since")||todayIso(),limit:num(v("limit"))});toast("Matériel ajouté");return;}
  if(F.vidadd){const id=uid();save("videos",id,{id,url:v("url").trim(),title:v("title").trim(),date:v("date"),notes:[]});return;}
  if(F.vnote){const vv=data.videos[F.vnote];const tt=v("t").trim(),tx=v("txt").trim();if(!tx)return;vv.notes=(vv.notes||[]).concat({t:tt,txt:tx}).sort((a,b)=>String(a.t).localeCompare(String(b.t),undefined,{numeric:true}));save("videos",vv.id,vv);return;}
  if(F.sweat){const b=num(v("before")),a=num(v("after")),dr=num(v("drunk"))||0,du=num(v("dur"))||90;if(!b||!a)return;const loss=Math.max(0,b-a+dr),id=uid();save("sweat",id,{id,date:todayIso(),before:b,after:a,drunk:dr,dur:du,loss,rate:loss/(du/60),toDrink:Math.max(0,(b-a)*1.5)});return;}
  if(F.resume){const days=num(v("days")),from=v("from")||todayIso();if(!days)return;save("resume","main",{from,days,until:addDays(from,days>=21?14:7)});toast("Reprise progressive programmée");return;}
  if(F.settings){const s=S_();["start","side","theme","sex","tDefault","lessonDay","level","goal","equip"].forEach(k=>{if(f.elements[k])s[k]=v(k);});s.name=v("name").trim().slice(0,30);s.voice=v("voice")==="1";["height","age","activity","deficit"].forEach(k=>s[k]=num(v(k)));
    if(s.start&&parse(s.start).getDay()!==1)toast("Conseil : choisis un lundi comme date de début",true);else toast("Réglages enregistrés");
    lsSave();applyTheme();state.week=null;renderApp({force:true});return;}
  if(F.onboard){onboardSubmit(f,e.submitter);return;}
  if(F.syncform){accountSubmit(f,(e.submitter&&e.submitter.value)||"in");return;}
});

/* ---------- Glisser pour changer d'étape (mode séance) ---------- */
let sx=null,sy=null;
document.addEventListener("touchstart",e=>{if(!state.run||!e.target.closest("#runner"))return;if(e.target.closest("input,textarea,select,.tm,.figs,.chart"))return;sx=e.touches[0].clientX;sy=e.touches[0].clientY;},{passive:true});
document.addEventListener("touchend",e=>{if(sx==null)return;const dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;sx=null;if(Math.abs(dx)>70&&Math.abs(dy)<60){runnerGo(dx<0?1:-1);}},{passive:true});

/* ---------- Mises à jour de l'app ---------- */
function showUpdate(){const b=$("#updbar");if(b)b.hidden=false;}
if("serviceWorker" in navigator&&location.protocol.startsWith("http")){
  let refreshing=false;
  const hadCtrl=!!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener("controllerchange",()=>{if(refreshing||!hadCtrl)return;refreshing=true;location.reload();});
  window.addEventListener("load",()=>{navigator.serviceWorker.register("./sw.js").then(reg=>{window._swreg=reg;
    if(reg.waiting&&navigator.serviceWorker.controller)showUpdate();
    reg.addEventListener("updatefound",()=>{const nw=reg.installing;nw&&nw.addEventListener("statechange",()=>{if(nw.state==="installed"&&navigator.serviceWorker.controller)showUpdate();});});
    document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")reg.update().catch(()=>{});});
  }).catch(()=>{});});
}

/* ---------- Démarrage ---------- */
lsLoad();
try{matchMedia("(prefers-color-scheme: dark)").addEventListener("change",applyTheme);}catch(e){}
$("#tabbar").innerHTML=TABS.map(([k,l,ic])=>`<button type="button" data-tab="${k}"><svg viewBox="0 0 24 24" aria-hidden="true">${ic}</svg><span>${l}</span></button>`).join("");
(async()=>{
  const shared=await loadSharedView();
  applyTheme();
  renderApp({force:true});
  if(!shared){const au=handleAuthHash();renderOnboard();if(!au){handleHash();Sync.pull();}}
})();
window.addEventListener("hashchange",()=>{if((location.hash||"").startsWith("#partage=")){location.reload();return;}if(!READONLY)handleHash();});
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible"&&!READONLY){Sync.pull();if(!state.run)renderApp();}});
window.addEventListener("online",()=>{if(!READONLY)Sync.pull();});
