/* Programme Padel — données, calculs, sauvegarde, synchronisation, calendrier */
"use strict";
const COLLS=["logs","weights","tests","tournois","settings","mobilite","weeks","checkins","pains","ranking","adj","swaps","tech","nutri","bag","goals","meta","events","rehab","resume","gear","opps","videos","mental","sweat","meals","pushSub","notif","share","follows","mstats"];
const data={};COLLS.forEach(c=>data[c]={});
const LSK="padel-plan-v1";
function nextMonday(){const d=new Date();const k=(8-d.getDay())%7||7;d.setDate(d.getDate()+(d.getDay()===1?0:k));return iso(d);}
const DEFAULT_SETTINGS={start:null,name:"",side:"gauche",theme:"auto",voice:true,height:null,age:null,sex:"H",activity:1.55,deficit:0,tDefault:"sam",lessonDay:"mar",level:"P250",
  times:{lun:"18:30",mar:"19:00",mer:"18:30",jeu:"19:00",ven:"18:30",sam:"09:00",dim:"09:00"},mobTime:"08:00"};
const S_=()=>data.settings.main;

function lsLoad(){
  try{const r=JSON.parse(localStorage.getItem(LSK)||"null");if(r)COLLS.forEach(c=>{if(r[c]&&typeof r[c]==="object")data[c]=r[c];});}catch(e){}
  normalize();
  try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist();}catch(e){}
}
function normalize(){
  COLLS.forEach(c=>{if(!data[c]||typeof data[c]!=="object")data[c]={};});
  const existed=!!data.settings.main;
  if(!existed)data.settings.main={...DEFAULT_SETTINGS,start:nextMonday(),onboarded:false};
  if(existed&&data.settings.main.onboarded===undefined)data.settings.main.onboarded=true; // utilisateurs des versions précédentes
  data.settings.main={...DEFAULT_SETTINGS,...data.settings.main,times:{...DEFAULT_SETTINGS.times,...(data.settings.main.times||{})}};
  if(!data.settings.main.start)data.settings.main.start=nextMonday();
  if(!data.bag.main)data.bag.main={items:BAG_DEFAULT.slice(),checked:{}};
  if(!Object.keys(data.goals).length){data.goals.poids={id:"poids",type:"poids",label:"Poids de forme",target:null,unit:"kg"};data.goals.rang={id:"rang",type:"classement",label:"Classement FFT",target:null,unit:"e"};data.goals.squat={id:"squat",type:"exo:back_squat",label:"Squat (force max estimée)",target:null,unit:"kg"};}
  if(!data.meta.main)data.meta.main={updatedAt:0,lastExport:null,created:Date.now()};
  // Cycles déjà entamés dans une version précédente (séances enregistrées au-delà de la semaine 12)
  {const mw=Math.max(0,...Object.keys(data.logs).map(k=>+(/^s(\d+)-/.exec(k)||[])[1]||0));const st=data.settings.main;
   if(mw>12){st.cycles=st.cycles||{};for(let c=2;c<=Math.ceil(mw/12);c++)if(!st.cycles[c])st.cycles[c]={start:addDays(st.start,(c-1)*84),focus:"equilibre",volume:"normal",auto:true};}}
  lsSave(true);
}
function lsSave(noTouch){
  if(typeof READONLY!=="undefined"&&READONLY)return;
  if(!noTouch)data.meta.main.updatedAt=Date.now();
  try{localStorage.setItem(LSK,JSON.stringify(data));}catch(e){toast("Stockage plein : exporte une sauvegarde",true);}
  if(!noTouch){Sync.schedule();if(typeof scheduleNotifQueue==="function")scheduleNotifQueue();}
}
function save(coll,id,obj,opts={}){if(typeof READONLY!=="undefined"&&READONLY){toast("Lecture seule",true);return;}data[coll][id]=obj;lsSave();if(!opts.silent&&typeof renderApp==="function")renderApp();}
function remove(coll,id,opts={}){delete data[coll][id];lsSave();if(!opts.silent&&typeof renderApp==="function")renderApp();}

/* ---------- Dates du programme ---------- */
const startDate=()=>S_().start||nextMonday();
const daysToStart=()=>daysBetween(todayIso(),startDate());
function cyclesCfg(){return S_().cycles||{};}
function launchedCycles(){let n=1;const cs=cyclesCfg();while(cs[n+1]&&cs[n+1].start)n++;return n;}
function cycleStart(c){if(c<=1)return startDate();const cs=cyclesCfg();if(cs[c]&&cs[c].start)return cs[c].start;return addDays(cycleStart(c-1),84);}
function cycleEnd(c){return addDays(cycleStart(c),83);}
/* Où en est-on à une date donnée : avant le début, dans un cycle, ou entre deux cycles */
function cyclePhase(ds){const st=startDate();if(daysBetween(st,ds)<0)return {state:"before"};
  let c=launchedCycles();while(c>1&&daysBetween(cycleStart(c),ds)<0)c--;
  const d=daysBetween(cycleStart(c),ds),wi=Math.floor(d/7);
  if(wi>=12){const nx=cyclesCfg()[c+1];return {state:"gap",c,next:nx&&nx.start?nx.start:null};}
  return {state:"in",c,w:(c-1)*12+wi+1};}
function weekOfDate(ds){const ph=cyclePhase(ds);return ph.state==="in"?ph.w:0;}
function curWeek(){const ph=cyclePhase(todayIso());return ph.state==="in"?ph.w:ph.state==="gap"?ph.c*12:1;}
function cycleGap(){const ph=cyclePhase(todayIso());return ph.state==="gap"?ph:null;}
function dateOf(w,di){return addDays(cycleStart(cycleOf(w)),(wcOf(w)-1)*7+di);}
function dayKeyOf(ds){const d=daysBetween(startDate(),ds);return DAY_KEYS[((d%7)+7)%7];}
function todayRef(){const t=todayIso(),ph=cyclePhase(t);return ph.state==="in"?{w:ph.w,d:dayKeyOf(t),date:t}:null;}

/* ---------- Statistiques ---------- */
function sortedWeights(){return Object.values(data.weights).filter(x=>x&&x.date&&x.kg).sort((a,b)=>a.date.localeCompare(b.date));}
function latestWeight(){const w=sortedWeights();return w.length?+w[w.length-1].kg:null;}
function weekStats(w){
  let done=0,load=0,planned=0,mob=0;
  DAYS.forEach(([d],i)=>{const l=data.logs[`s${w}-${d}`];if(l&&l.done){done++;load+=(+l.duree||0)*(+l.rpe||0);}
    const p=planFor(w,d);if(PLANNED_KINDS.includes(p.kind))planned++;if(data.mobilite[dateOf(w,i)])mob++;});
  return {done,load,planned,mob};
}
function acwr(w){
  const acute=weekStats(w).load,prev=[1,2,3,4].map(k=>w-k).filter(x=>x>=1).map(x=>weekStats(x).load).filter(x=>x>0);
  if(prev.length<2||!acute)return null;
  const chronic=avg(prev);return {acute,chronic,ratio:acute/chronic};
}
function checkinScore(c,ds){
  if(!c||!c.sleep||!c.sore||!c.fatigue||!c.motiv)return null;
  let s=((c.sleep-1)+(5-c.sore)+(5-c.fatigue)+(c.motiv-1))/16*100;
  const sh=num(c.sleepH);if(sh!=null){if(sh<6)s-=10;else if(sh<7)s-=5;}
  const hr=num(c.hr),d=ds||c.date;if(hr&&d&&typeof hrBaseline==="function"){const b=hrBaseline(d);if(b){if(hr>=b+8)s-=15;else if(hr>=b+5)s-=8;}}
  return Math.round(clamp(s,0,100));
}
/* Historique des charges par exercice */
function exHistory(key){
  const out=[];
  Object.entries(data.logs).forEach(([id,l])=>{
    if(!l||!l.sets)return;
    Object.values(l.sets).forEach(e=>{
      if(!e||e.k!==key)return;
      const sets=(e.s||[]).filter(x=>x&&(num(x.reps)||num(x.kg)));
      if(!sets.length)return;
      const kgs=sets.map(x=>num(x.kg)).filter(x=>x!=null);
      const e1=sets.filter(x=>num(x.kg)!=null&&num(x.reps)).map(x=>num(x.kg)*(1+Math.min(12,num(x.reps))/30));
      out.push({id,date:l.date||"",top:kgs.length?Math.max(...kgs):null,e1:e1.length?Math.max(...e1):null,reps:sets.map(x=>num(x.reps)||0),sets,rpe:l.rpe,done:l.done});
    });
  });
  return out.sort((a,b)=>a.date.localeCompare(b.date));
}
function bestOf(key,excludeId){const h=exHistory(key).filter(x=>x.id!==excludeId);return {kg:Math.max(0,...h.map(x=>x.top||0)),e1:Math.max(0,...h.map(x=>x.e1||0)),reps:Math.max(0,...h.map(x=>Math.max(0,...x.reps)))};}
function lastPerf(key,excludeId){const h=exHistory(key).filter(x=>x.id!==excludeId);return h.length?h[h.length-1]:null;}
function suggestLoad(key,r,excludeId){
  if(!LOADED.has(key))return null;
  const last=lastPerf(key,excludeId);if(!last||last.top==null)return null;
  const target=parseInt(String(r||""),10)||null;
  const allOk=target?last.reps.every(x=>x>=target):true;
  const easy=last.rpe==null||+last.rpe<=7;
  if(allOk&&easy)return {kg:last.top+(BIG_LIFTS.has(key)?5:2.5),why:"toutes les répétitions faites facilement la dernière fois"};
  if(target&&last.reps.some(x=>x<target-1))return {kg:last.top,why:"garde la même charge et vise toutes les répétitions"};
  return {kg:last.top,why:"même charge, vise un effort plus facile"};
}
/* Records sur la semaine */
function weekPRs(w){
  const from=dateOf(w,0),to=dateOf(w,6),seen=new Set();
  Object.keys(EX).forEach(k=>{const h=exHistory(k);let best=0;h.forEach(x=>{if(x.e1&&x.e1>best){if(best>0&&x.date>=from&&x.date<=to)seen.add(k);best=x.e1;}});});
  return [...seen];
}
function weekRecap(w){
  const st=weekStats(w),from=dateOf(w,0),to=dateOf(w,6);
  const ws=sortedWeights().filter(x=>x.date>=from&&x.date<=to).map(x=>+x.kg);
  const ck=Object.entries(data.checkins).filter(([d])=>d>=from&&d<=to).map(([,c])=>checkinScore(c)).filter(x=>x!=null);
  const tr=Object.values(data.tournois).filter(t=>t.date>=from&&t.date<=to);
  return {w,...st,weight:avg(ws),checkin:avg(ck),tournois:tr,prs:weekPRs(w),acwr:acwr(w)};
}
function painAlerts(){
  const since=addDays(todayIso(),-14),by={};
  Object.values(data.pains).filter(p=>p.date>=since).forEach(p=>{(by[p.zone]=by[p.zone]||[]).push(p);});
  return Object.entries(by).filter(([,a])=>a.length>=3||a.some(p=>p.level>=6)).map(([z,a])=>({zone:z,n:a.length,max:Math.max(...a.map(p=>p.level))}));
}
function mobStreak(){const d=parse(todayIso());if(!data.mobilite[iso(d)])d.setDate(d.getDate()-1);let n=0;while(data.mobilite[iso(d)]){n++;d.setDate(d.getDate()-1);}return n;}
function totalDone(){return Object.values(data.logs).filter(l=>l&&l.done).length;}
function latestRank(){const r=Object.values(data.ranking).filter(x=>x.rank).sort((a,b)=>a.date.localeCompare(b.date));return r.length?+r[r.length-1].rank:null;}
/* Nutrition */
function nutritionTargets(){
  const s=S_(),w=latestWeight()||(s.sex==="F"?62:75),h=+s.height||(s.sex==="F"?165:178),a=+s.age||30;
  const bmr=10*w+6.25*h-5*a+(s.sex==="F"?-161:5),tdee=bmr*(+s.activity||1.55),kcal=Math.round((tdee-(+s.deficit||0))/10)*10;
  return {w,bmr:Math.round(bmr),tdee:Math.round(tdee),kcal,prot:Math.round(w*1.8),water:w>80?3:2.5};
}

/* ---------- Sauvegarde fichier ---------- */
async function exportData(){
  const blob=new Blob([JSON.stringify({app:"programme-padel",v:2,exported:new Date().toISOString(),data},null,1)],{type:"application/json"});
  const ok=await shareFile(blob,`padel-sauvegarde-${todayIso()}.json`,"Sauvegarde Programme Padel");
  if(ok){data.meta.main.lastExport=todayIso();lsSave(true);renderApp();}
}
function importData(file){
  const r=new FileReader();
  r.onload=()=>{try{const j=JSON.parse(r.result),d=j.data||j;let n=0;COLLS.forEach(c=>{if(d[c]&&typeof d[c]==="object"){data[c]=d[c];n++;}});if(!n)throw 0;normalize();if(data.settings.main)data.settings.main.onboarded=true;lsSave();renderApp();toast("Sauvegarde restaurée");}catch(e){toast("Ce fichier n'est pas une sauvegarde valide",true);}};
  r.readAsText(file);
}
function backupDue(){if(Sync.connected())return false;const le=data.meta.main.lastExport;return totalDone()>0&&(!le||daysBetween(le,todayIso())>=7);}

/* ---------- Comptes et synchronisation (serveur défini dans config.js) ---------- */
const cloudOn=()=>!!(typeof APP_CONFIG!=="undefined"&&APP_CONFIG.supabaseUrl&&APP_CONFIG.supabaseAnonKey);
const Sync={
  cfg(){let c={};try{c=JSON.parse(localStorage.getItem("padel-sync")||"{}");}catch(e){}if(cloudOn()){c.url=APP_CONFIG.supabaseUrl;c.key=APP_CONFIG.supabaseAnonKey;}return c;},
  set(c){try{localStorage.setItem("padel-sync",JSON.stringify(c));}catch(e){}},
  connected(){const c=this.cfg();return cloudOn()&&!!(c.url&&c.key&&c.access&&c.userId);},
  async recover(email){const c=this.cfg();const r=await fetch(this.base()+"/auth/v1/recover"+this.redirect(),{method:"POST",headers:{apikey:c.key,"Content-Type":"application/json"},body:JSON.stringify({email})});if(!r.ok)throw new Error("Erreur "+r.status);},
  status:"",
  _t:null,
  base(){return (this.cfg().url||"").replace(/\/+$/,"");},
  async auth(path,body){
    const c=this.cfg();
    const r=await fetch(this.base()+"/auth/v1/"+path,{method:"POST",headers:{apikey:c.key,"Content-Type":"application/json"},body:JSON.stringify(body)});
    const j=await r.json().catch(()=>({}));
    if(!r.ok)throw new Error(j.error_description||j.msg||j.message||("Erreur "+r.status));
    return j;
  },
  keep(j,email){const c=this.cfg();Object.assign(c,{access:j.access_token,refresh:j.refresh_token,exp:Date.now()+(j.expires_in||3600)*1000,userId:j.user&&j.user.id,email:email||c.email});this.set(c);},
  redirect(){return "?redirect_to="+encodeURIComponent(location.origin+location.pathname);},
  async signUp(email,pw){const j=await this.auth("signup"+this.redirect(),{email,password:pw});if(j.access_token){this.keep(j,email);const c=this.cfg();delete c.pending;this.set(c);await this.pull(true);return "ok";}const c=this.cfg();c.email=email;c.pending=email;this.set(c);return "confirm";},
  async resend(email){const c=this.cfg();const r=await fetch(this.base()+"/auth/v1/resend"+this.redirect(),{method:"POST",headers:{apikey:c.key,"Content-Type":"application/json"},body:JSON.stringify({type:"signup",email})});if(!r.ok)throw new Error("Erreur "+r.status);},
  async signIn(email,pw){const j=await this.auth("token?grant_type=password",{email,password:pw});this.keep(j,email);const c=this.cfg();delete c.pending;this.set(c);await this.pull(true);},
  signOut(){try{localStorage.removeItem("padel-base");}catch(e){}const c=this.cfg();delete c.access;delete c.refresh;delete c.userId;delete c.exp;this.set(c);this.status="Déconnecté";},
  async token(){
    const c=this.cfg();if(!c.access)throw new Error("Non connecté");
    if(c.exp&&Date.now()>c.exp-60000){const j=await this.auth("token?grant_type=refresh_token",{refresh_token:c.refresh});this.keep(j);}
    return this.cfg().access;
  },
  async rest(method,q,body){
    const c=this.cfg(),tk=await this.token();
    const r=await fetch(this.base()+"/rest/v1/padel_state"+(q||""),{method,headers:{apikey:c.key,Authorization:"Bearer "+tk,"Content-Type":"application/json",Prefer:"resolution=merge-duplicates,return=minimal"},body:body?JSON.stringify(body):undefined});
    if(!r.ok){const t=await r.text();throw new Error("Erreur "+r.status+" "+t.slice(0,120));}
    return method==="GET"?r.json():null;
  },
  // Dernier état synchronisé (sert de référence pour fusionner sans rien perdre)
  getBase(){try{const b=JSON.parse(localStorage.getItem("padel-base")||"null");return b&&b.u===this.cfg().userId?b.d:null;}catch(e){return null;}},
  setBase(d){try{localStorage.setItem("padel-base",JSON.stringify({u:this.cfg().userId,d}));}catch(e){}},
  // Écriture conditionnelle : n'écrit que si le serveur n'a pas changé depuis la lecture (sinon on relit et on refusionne)
  async writeRemote(prevAt){
    const c=this.cfg(),tk=await this.token(),prevMs=prevAt?new Date(prevAt).getTime():0;
    const at=new Date(Math.max(data.meta.main.updatedAt||0,prevMs+1)).toISOString();
    const h={apikey:c.key,Authorization:"Bearer "+tk,"Content-Type":"application/json"};
    if(prevAt){const r=await fetch(this.base()+"/rest/v1/padel_state?user_id=eq."+encodeURIComponent(c.userId)+"&updated_at=eq."+encodeURIComponent(prevAt),{method:"PATCH",headers:{...h,Prefer:"return=representation"},body:JSON.stringify({data,updated_at:at})});
      if(!r.ok){const t=await r.text();throw new Error("Erreur "+r.status+" "+t.slice(0,120));}
      const j=await r.json().catch(()=>[]);return Array.isArray(j)&&j.length>0;}
    const r=await fetch(this.base()+"/rest/v1/padel_state",{method:"POST",headers:{...h,Prefer:"return=minimal"},body:JSON.stringify({user_id:c.userId,data,updated_at:at})});
    if(r.status===409)return false;
    if(!r.ok){const t=await r.text();throw new Error("Erreur "+r.status+" "+t.slice(0,120));}
    return true;},
  async push(){
    if(typeof READONLY!=="undefined"&&READONLY)return;
    if(!this.connected()||!navigator.onLine)return;
    if(this._busy){this._again=true;return;}
    this._busy=true;
    try{let ok=false;
      for(let i=0;i<4&&!ok;i++){
        const rows=await this.rest("GET","?select=data,updated_at");const row=rows&&rows[0];
        if(row&&row.data){const m=mergeData(this.getBase(),data,row.data,{localAt:data.meta.main.updatedAt||0,remoteAt:new Date(row.updated_at).getTime()});
          if(m.changedLocal){applyMerged(m.data);renderApp();}
          if(!m.changedRemote){ok=true;break;}}
        ok=await this.writeRemote(row?row.updated_at:null);
      }
      if(!ok)throw new Error("conflit d'écriture, nouvel essai bientôt");
      this.setBase(JSON.parse(JSON.stringify(data)));
      this.status="Synchronisé à "+new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"});const c=this.cfg();c.last=Date.now();this.set(c);}
    catch(e){this.status="Échec de la synchronisation : "+e.message;this._again=true;}
    finally{this._busy=false;}
    paintSyncStatus();
    if(this._again){this._again=false;clearTimeout(this._t);this._t=setTimeout(()=>this.push(),this.status.startsWith("Échec")?15000:2500);}
  },
  async pull(first){
    if(typeof READONLY!=="undefined"&&READONLY)return;
    if(!this.connected()||!navigator.onLine)return;
    try{
      const rows=await this.rest("GET","?select=data,updated_at");
      const row=rows&&rows[0];
      if(!row||!row.data){await this.push();return;}
      const remoteAt=new Date(row.updated_at).getTime(),localAt=data.meta.main.updatedAt||0;
      const m=mergeData(this.getBase(),data,row.data,{localAt,remoteAt,preferRemote:first&&totalDone()===0});
      // Compte déjà configuré ailleurs : pas besoin de refaire l'accueil sur ce nouvel appareil
      const rs=row.data.settings&&row.data.settings.main;if(rs&&rs.onboarded!==false&&m.data.settings&&m.data.settings.main&&!m.data.settings.main.onboarded){m.data.settings.main.onboarded=true;m.changedLocal=true;m.changedRemote=true;}
      if(m.changedLocal){applyMerged(m.data);this.status="Données récupérées depuis ton compte";if(!first)toast("Données synchronisées");renderApp();}
      if(m.changedRemote){await this.push();return;}
      this.setBase(JSON.parse(JSON.stringify(data)));
      if(!m.changedLocal)this.status="À jour";
    }catch(e){this.status="Échec de la synchronisation : "+e.message;}
    paintSyncStatus();
  },
  schedule(){if(!this.connected())return;clearTimeout(this._t);this._t=setTimeout(()=>this.push(),2500);}
};
/* Fusion à trois voies : référence commune (base), cet appareil (local), le serveur (remote).
   Chaque séance, pesée, tournoi… est fusionné séparément : deux appareils peuvent travailler hors ligne sans s'écraser. */
const FIELD_MERGE=new Set(["settings","meta","bag"]);
const jeq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function merge3(b,l,r,localWins){
  if(jeq(l,r))return l;
  if(b!==undefined&&jeq(l,b))return r;
  if(b!==undefined&&jeq(r,b))return l;
  if(l===undefined)return r;if(r===undefined)return l;
  return localWins?l:r;}
function mergeData(base,local,remote,{localAt=0,remoteAt=0,preferRemote=false}={}){
  const out={},localWins=!preferRemote&&localAt>=remoteAt;
  COLLS.forEach(c=>{const B=base&&base[c]||(base?{}:undefined),L=local[c]||{},R=remote[c]||{};const o={};
    const keys=new Set([...Object.keys(L),...Object.keys(R),...(B?Object.keys(B):[])]);
    keys.forEach(k=>{let v;
      if(FIELD_MERGE.has(c)&&L[k]&&R[k]&&typeof L[k]==="object"&&typeof R[k]==="object"){
        const bb=B&&B[k]||{},f={};new Set([...Object.keys(L[k]),...Object.keys(R[k])]).forEach(fk=>{const fv=merge3(B?bb[fk]:undefined,L[k][fk],R[k][fk],localWins);if(fv!==undefined)f[fk]=fv;});v=f;}
      else v=merge3(B?B[k]:undefined,L[k],R[k],localWins);
      if(v!==undefined)o[k]=v;});
    out[c]=o;});
  if(out.meta&&out.meta.main)out.meta.main.updatedAt=Math.max(localAt,remoteAt);
  const pick=d=>{const x={};COLLS.forEach(c=>x[c]=d[c]||{});return x;};
  const cmp=d=>{const x=pick(d);if(x.meta&&x.meta.main){x.meta={...x.meta,main:{...x.meta.main,updatedAt:0}};}return JSON.stringify(x);};
  return {data:out,changedLocal:cmp(out)!==cmp(local),changedRemote:cmp(out)!==cmp(remote)};}
function applyMerged(m){COLLS.forEach(c=>{data[c]=m[c]||{};});normalize();try{localStorage.setItem(LSK,JSON.stringify(data));}catch(e){}}
function paintSyncStatus(){const el=$("#authpage #sync-status")||$("#onboard #sync-status")||$("#sync-status");if(el){el.textContent=Sync.status||"";el.classList.toggle("bad-txt",/^(Échec|Indique|Les deux|Mot de passe :)/.test(Sync.status||""));}}

/* ---------- Calendrier iPhone (.ics) ---------- */
function icsEsc(s){return String(s).replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\n/g,"\\n");}
function buildIcs(fromW,toW,opts){
  const L=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Programme Padel//FR","CALSCALE:GREGORIAN","METHOD:PUBLISH","X-WR-CALNAME:Programme Padel"];
  const stamp=new Date().toISOString().replace(/[-:]/g,"").slice(0,15)+"Z";
  const t=S_().times;
  for(let w=fromW;w<=toW;w++){
    DAYS.forEach(([d],i)=>{
      const p=planFor(w,d),ds=dateOf(w,i).replace(/-/g,"");
      if(ds<todayIso().replace(/-/g,""))return;
      if(p.kind==="R")return;
      const desc=p.items.map(it=>"• "+(EX[it[0]]?exName(it[0]):(GEN[it[0]]||it[0]))+(it[2]?" — "+rx(it[1],it[2],p.dl):"")).join("\n")+(p.cue?"\n\n"+p.cue:"");
      L.push("BEGIN:VEVENT","UID:padel-"+w+"-"+d+"@programme-padel","DTSTAMP:"+stamp);
      if(p.kind==="M"){L.push("DTSTART;VALUE=DATE:"+ds,"DTEND;VALUE=DATE:"+addDays(dateOf(w,i),1).replace(/-/g,""));}
      else{const [hh,mm]=(t[d]||"18:30").split(":").map(Number);const end=new Date(2000,0,1,hh,mm+(p.dur||60));
        L.push("DTSTART:"+ds+"T"+pad(hh)+pad(mm)+"00","DTEND:"+ds+"T"+pad(end.getHours())+pad(end.getMinutes())+"00");}
      L.push("SUMMARY:"+icsEsc("Padel · "+p.title),"DESCRIPTION:"+icsEsc(desc),"BEGIN:VALARM","ACTION:DISPLAY","DESCRIPTION:"+icsEsc(p.title),"TRIGGER:"+(p.kind==="M"?"-PT15H":"-PT30M"),"END:VALARM","END:VEVENT");
      if(opts.mob){const [h2,m2]=(S_().mobTime||"08:00").split(":").map(Number);
        L.push("BEGIN:VEVENT","UID:padel-mob-"+w+"-"+d+"@programme-padel","DTSTAMP:"+stamp,"DTSTART:"+ds+"T"+pad(h2)+pad(m2)+"00","DTEND:"+ds+"T"+pad(h2)+pad(m2+12>59?59:m2+12)+"00","SUMMARY:Padel · Routine mobilité (12 min)","BEGIN:VALARM","ACTION:DISPLAY","DESCRIPTION:Routine mobilité","TRIGGER:PT0M","END:VALARM","END:VEVENT");}
    });
  }
  if(typeof upcomingEvents==="function")upcomingEvents().forEach(e=>{const s=e.date.replace(/-/g,""),en=addDays(e.end||e.date,1).replace(/-/g,"");L.push("BEGIN:VEVENT","UID:padel-ev-"+e.id+"@programme-padel","DTSTAMP:"+stamp,"DTSTART;VALUE=DATE:"+s,"DTEND;VALUE=DATE:"+en,"SUMMARY:"+icsEsc("Tournoi "+e.cat+" "+(e.lieu||"")),"END:VEVENT");if(e.deadline&&!e.registered){const d=e.deadline.replace(/-/g,"");L.push("BEGIN:VEVENT","UID:padel-dl-"+e.id+"@programme-padel","DTSTAMP:"+stamp,"DTSTART;VALUE=DATE:"+d,"DTEND;VALUE=DATE:"+addDays(e.deadline,1).replace(/-/g,""),"SUMMARY:"+icsEsc("Clôture inscription "+e.cat+" "+(e.lieu||"")),"BEGIN:VALARM","ACTION:DISPLAY","DESCRIPTION:Inscription","TRIGGER:-P2D","END:VALARM","END:VEVENT");}});
  L.push("END:VCALENDAR");
  return L.join("\r\n");
}

/* ---------- Bilan à partager (coach ou assistant IA) ---------- */
function bilanText(days){
  const since=addDays(todayIso(),-days),s=S_(),lines=[];
  lines.push(`BILAN PROGRAMME PADEL — ${days} derniers jours (du ${fr(since)} au ${fr(todayIso())})`);
  lines.push(`Profil : ${s.sex==="F"?"joueuse":"joueur"} de ${s.side}${s.age?", "+s.age+" ans":""}${s.height?", "+s.height+" cm":""}. Programme commencé le ${fr(startDate())}, semaine actuelle : ${curWeek()} (cycle ${cycleOf(curWeek())}, bloc « ${blockOf(curWeek()).name} »).`);
  const ws=sortedWeights().filter(x=>x.date>=since);
  if(ws.length)lines.push(`Poids : ${ws.map(x=>fr(x.date)+" "+fmt(x.kg)+" kg").join(", ")}.`);
  const logs=Object.values(data.logs).filter(l=>l.date>=since).sort((a,b)=>a.date.localeCompare(b.date));
  lines.push(`\nSÉANCES (${logs.filter(l=>l.done).length} faites) :`);
  logs.forEach(l=>{const p=planFor(l.week,l.day);const sets=l.sets?Object.values(l.sets).filter(e=>e&&e.s&&e.s.some(x=>x.kg||x.reps)).map(e=>`${exName(e.k)} ${e.s.filter(x=>x.kg||x.reps).map(x=>(x.kg?x.kg+"kg×":"")+(x.reps||"")).join("/")}`).join(" ; "):"";
    lines.push(`- ${fr(l.date)} ${p.title} : ${l.done?"faite":"non faite"}, ${l.duree||"?"} min, RPE ${l.rpe||"?"}${l.short||data.adj[`s${l.week}-${l.day}`]?.short?" (version courte)":""}${sets?" | "+sets:""}${l.note?" | note : "+l.note:""}`);});
  const ck=Object.entries(data.checkins).filter(([d])=>d>=since);
  if(ck.length)lines.push(`\nFORME DU MATIN (score /100) : ${ck.sort().map(([d,c])=>fr(d)+" "+checkinScore(c)).join(", ")}.`);
  lines.push(`Mobilité : ${Object.keys(data.mobilite).filter(d=>d>=since).length} jours sur ${days}.`);
  const tr=Object.values(data.tournois).filter(t=>t.date>=since);
  if(tr.length){lines.push("\nTOURNOIS :");tr.forEach(t=>lines.push(`- ${fr(t.date)} ${t.cat} ${t.lieu||""} : ${t.res||"?"}, ${t.victoires||0}V/${t.matchs||0} matchs, forme ${t.physique}/10, fin de match « ${t.fin||"?"} »${t.pts?", +"+t.pts+" pts":""}${t.note?" | "+t.note:""}`));}
  const rk=latestRank();if(rk)lines.push(`Classement actuel : ${rk}e.`);
  if(typeof upcomingEvents==="function"){const up=upcomingEvents();if(up.length)lines.push("Tournois à venir : "+up.map(e=>`${fr(e.date)} ${e.cat} ${e.lieu||""}${e.goal?" (objectif)":""}`).join(", ")+".");}
  const rh=typeof activeRehab==="function"?activeRehab():[];if(rh.length)lines.push("Renforcement ciblé en cours : "+rh.map(z=>REHAB[z].name).join(", ")+".");
  const tests=Object.values(data.tests).sort((a,b)=>a.date.localeCompare(b.date));
  if(tests.length){lines.push("\nTESTS :");tests.forEach(t=>lines.push(`- ${fr(t.date)} : `+TESTS.filter(x=>t[x.k]!=null&&t[x.k]!=="").map(x=>`${x.name} ${t[x.k]} ${x.u}`).join(", ")));}
  const pn=Object.values(data.pains).filter(p=>p.date>=since);
  if(pn.length){lines.push("\nDOULEURS :");pn.forEach(p=>lines.push(`- ${fr(p.date)} ${p.zone} ${p.level}/10${p.note?" ("+p.note+")":""}`));}
  const a=acwr(curWeek());if(a)lines.push(`\nRatio de charge (semaine / moyenne 4 semaines) : ${fmt(a.ratio,2)}.`);
  lines.push("\nPeux-tu analyser ce bilan et me proposer des ajustements pour les prochaines semaines ?");
  return lines.join("\n");
}
