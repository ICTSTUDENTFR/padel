/* Programme Padel — minuteurs (effort/récup, repos entre séries, chrono, routines guidées) + voix */
"use strict";
const fmtT=(sec,tenths)=>{sec=Math.max(0,sec);const m=Math.floor(sec/60),s=Math.floor(sec%60);return `${m}:${String(s).padStart(2,"0")}${tenths?"."+Math.floor((sec*10)%10):""}`;};
const parseSec=t=>{if(!t)return null;let m=t.match(/(\d+)\s*min\s*(\d+)?/);if(m)return +m[1]*60+(+m[2]||0);m=t.match(/(\d+)\s*s\b/);return m?+m[1]:null;};
const REST_BY_CAT={Force:90,"Explosivité":120,"Prévention":45,Gainage:45,"Déplacements":40,"Mobilité":20,Cardio:60};
const ROUTINE_T=[["m_catcow",60,1],["m_thoracic",45,2],["m_wgs",45,2],["m_9090",60,1],["m_hipflexor",30,2],["m_frog",60,1],["m_ankle",30,2],["m_dislocate",45,1],["m_wrist",30,4]];
function withPrep(list,prep=5){const ph=[];list.forEach((x,i)=>{ph.push({k:"rest",d:i?prep:4,l:"Prépare-toi",sub:`${i+1}/${list.length} · ${x.l}`});ph.push({k:"work",...x});});return ph;}
function mobilityPhases(){const ph=[];ROUTINE_T.forEach(([k,d,n],i)=>{ph.push({k:"rest",d:i?6:4,l:"Mets-toi en place",sub:`${i+1}/9 · ${EX[k].n}`});for(let j=0;j<n;j++){if(j)ph.push({k:"rest",d:5,l:n===4?"Change":"Change de côté",sub:EX[k].n});ph.push({k:"work",d,l:EX[k].n,sub:n===2?`Côté ${j+1}/2`:n===4?["Bras 1 · doigts vers le haut","Bras 1 · doigts vers le bas","Bras 2 · doigts vers le haut","Bras 2 · doigts vers le bas"][j]:"À ton rythme, sans forcer"});}});return ph;}
const ROUTINES={
 match_warmup:{label:"Échauffement d'avant-match",ph:()=>withPrep([
  {d:180,l:"Trot léger",sub:"Pas chassés, pas croisés, course arrière"},
  {d:180,l:"Mobilité",sub:"Cercles de bras, rotations du tronc, balancements de jambes, fentes avec rotation"},
  {d:90,l:"Élastique épaules",sub:"Rotations externes et internes × 10, tirage × 10"},
  {d:90,l:"Activation",sub:"5 squats sautés légers, 5 skaters par côté, skips"},
  {d:60,l:"Réactivité",sub:"3 accélérations de 5 m, 6 split-steps au signal"},
  {d:120,l:"Shadow",sub:"Coup droit, revers, bandeja, smash à vide × 5 chacun"}])},
 between:{label:"Entre deux matchs",ph:()=>withPrep([
  {d:120,l:"Boire et manger",sub:"500 ml d'eau + électrolytes, banane, compote ou barre"},
  {d:300,l:"Marche",sub:"Reste couvert, marche tranquillement, respire"},
  {d:180,l:"Mobilité légère",sub:"Hanches, épaules, mollets. Pas d'étirements longs"},
  {d:120,l:"Réactivation",sub:"Skips, 3 accélérations, split-steps, shadow des coups (juste avant le match)"}])},
 post_tournament:{label:"Récupération d'après-tournoi",ph:()=>withPrep([
  {d:600,l:"Retour au calme",sub:"Marche ou vélo très léger"},
  {d:45,l:"Quadriceps · côté 1",sub:"Debout, talon vers la fesse"},{d:45,l:"Quadriceps · côté 2",sub:"Debout, talon vers la fesse"},
  {d:45,l:"Ischios · côté 1",sub:"Jambe tendue sur un support, dos droit"},{d:45,l:"Ischios · côté 2",sub:"Jambe tendue sur un support, dos droit"},
  {d:45,l:"Mollets · côté 1",sub:"Contre un mur, talon au sol"},{d:45,l:"Mollets · côté 2",sub:"Contre un mur, talon au sol"},
  {d:45,l:"Fessiers · côté 1",sub:"Allongé, cheville sur le genou opposé"},{d:45,l:"Fessiers · côté 2",sub:"Allongé, cheville sur le genou opposé"},
  {d:60,l:"Adducteurs",sub:"Assis, plantes de pieds jointes, genoux vers le sol"},
  {d:40,l:"Épaule de frappe",sub:"Bras tiré devant la poitrine, puis sleeper stretch doux"},
  {d:300,l:"Rouleau de massage",sub:"Mollets, quadriceps, haut du dos"}])},
 mobility:{label:"Routine mobilité guidée",ph:mobilityPhases}
};
function buildTimer(k,s,r,note,kind,p){
  const e=EX[k];r=r||"";note=note||"";
  if(k==="warmup"&&p&&p.warm)return {label:"Échauffement guidé",ph:withPrep(p.warm)};
  if(ROUTINES[k])return {label:ROUTINES[k].label,ph:ROUTINES[k].ph()};
  if(kind==="T"&&r==="s")return {label:"Chronomètre",ph:[{k:"up",l:"Chrono",sub:e?e.n:""}]};
  if(e&&e.fig&&e.fig[0].tl){const T=e.fig[0].tl,SS=s||T.sets,sr=parseSec(T.sr)||180,ph=[{k:"rest",d:10,l:"Prépare-toi",sub:e.n}];
    for(let a=0;a<SS;a++){for(let b=0;b<T.n;b++){ph.push({k:"work",d:T.w,l:"Effort",sub:`Série ${a+1}/${SS} · répétition ${b+1}/${T.n}`});if(b<T.n-1)ph.push({k:"rest",d:T.r,l:"Récup",sub:`Série ${a+1}/${SS}`});}if(a<SS-1)ph.push({k:"rest",d:sr,l:"Repos entre séries",sub:`Prochaine : série ${a+2}/${SS}`});}
    return {label:"Minuteur d'intervalles",ph};}
  let m=r.match(/^(\d+)\s*s(\/côté| chaque sens)?/);
  if(m){const d=+m[1],sides=m[2]?2:1,SS=s||1,rec=parseSec((note.match(/(\d+\s*s) de récup/)||[])[1])||(e&&e.c==="Déplacements"?40:30),ph=[{k:"rest",d:5,l:"Prépare-toi",sub:e?e.n:""}];
    for(let a=0;a<SS;a++){for(let b=0;b<sides;b++){if(b)ph.push({k:"rest",d:5,l:"Change de côté",sub:`Série ${a+1}/${SS}`});ph.push({k:"work",d,l:sides>1?`Côté ${b+1}`:"Effort",sub:`Série ${a+1}/${SS}`,set:a});}if(a<SS-1)ph.push({k:"rest",d:rec,l:"Récup",sub:`Prochaine : série ${a+2}/${SS}`});}
    return {label:"Minuteur",ph};}
  m=r.match(/(\d+)(?:–(\d+))?\s*min/);
  if(m&&(e||/^warmup/.test(k))){const d=m[2]?Math.round((+m[1]+ +m[2])/2):+m[1];return {label:"Minuteur",ph:[{k:"work",d:d*60,l:e?e.n:GEN[k],sub:`${d} min`}]};}
  if(e&&s&&s>1&&kind!=="T"){const rest=parseSec((note.match(/(\d+\s*min(?:\s*\d+)?|\d+\s*s) de récup/)||[])[1])||(e.c==="Force"&&/^\d+$/.test(r)&&+r<=5?150:REST_BY_CAT[e.c]||60),ph=[];
    for(let a=0;a<s;a++){ph.push({k:"manual",l:`Série ${a+1}/${s}`,sub:`${r} · appuie sur « Série terminée » quand tu as fini`,set:a});if(a<s-1)ph.push({k:"rest",d:rest,l:"Repos",sub:`Prochaine : série ${a+2}/${s}`});}
    return {label:`Repos ${fmtT(rest)}`,ph};}
  return null;
}
/* ---------- Voix ---------- */
let voiceFr=null;
function pickVoice(){try{const v=speechSynthesis.getVoices();voiceFr=v.find(x=>/^fr(-|_)FR/i.test(x.lang))||v.find(x=>/^fr/i.test(x.lang))||null;}catch(e){}}
try{if("speechSynthesis" in window){pickVoice();speechSynthesis.onvoiceschanged=pickVoice;}}catch(e){}
function speak(t){
  if(!t||!(data.settings.main&&data.settings.main.voice)||!("speechSynthesis" in window))return;
  try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang="fr-FR";if(voiceFr)u.voice=voiceFr;u.rate=1.05;speechSynthesis.speak(u);}catch(e){}
}
/* ---------- Moteur ---------- */
const TMREG={},TM={id:null,label:"",ph:[],i:0,rem:0,run:false,end:0,up0:0,upAcc:0,done:false,onManual:null};
let tmLoop=null,actx=null,wakeLock=null;
function beep(f,d,v){try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();if(actx.state==="suspended")actx.resume();const o=actx.createOscillator(),g=actx.createGain();o.frequency.value=f;g.gain.setValueAtTime(v||0.25,actx.currentTime);o.connect(g);g.connect(actx.destination);o.start();g.gain.exponentialRampToValueAtTime(0.0001,actx.currentTime+d);o.stop(actx.currentTime+d+0.03);}catch(e){}}
function buzz(p){try{navigator.vibrate&&navigator.vibrate(p);}catch(e){}}
async function keepAwake(on){try{if(on&&!wakeLock&&navigator.wakeLock){wakeLock=await navigator.wakeLock.request("screen");wakeLock.addEventListener("release",()=>{wakeLock=null;});}else if(!on&&wakeLock){await wakeLock.release();wakeLock=null;}}catch(e){}}
function tmOpen(id){const def=TMREG[id];if(!def)return;TM.id=id;TM.label=def.label;TM.ph=def.ph;TM.onManual=def.onManual||null;tmReset(true);}
function tmReset(silent){TM.i=0;TM.rem=TM.ph[0].d||0;TM.run=false;TM.done=false;TM.upAcc=0;if(!silent)tmPaint();}
function phaseSpeech(p){if(p.k==="work")return p.l==="Effort"||/^Côté/.test(p.l)?p.l:p.l;if(p.k==="rest")return p.l+(p.d>=20?", "+Math.round(p.d)+" secondes":"");if(p.k==="manual")return p.l;return "";}
function tmGo(){
  if(TM.done){tmReset(true);}
  const p=TM.ph[TM.i];
  if(p.k==="manual"){if(TM.onManual)TM.onManual(p.set);tmNext();return;}
  TM.run=!TM.run;
  if(TM.run){if(p.k==="up")TM.up0=Date.now();else TM.end=Date.now()+TM.rem*1000;beep(660,.06,.15);keepAwake(true);if(TM.i===0){if(p.say)speak(p.l+". "+p.sub);else speak(phaseSpeech(p));}}
  else if(p.k==="up")TM.upAcc+=Date.now()-TM.up0;
  tmPaint();ensureLoop();
}
function tmNext(){
  TM.i++;
  if(TM.i>=TM.ph.length){TM.i=TM.ph.length-1;TM.run=false;TM.done=true;TM.rem=0;beep(880,.6,.3);buzz([200,100,200]);speak("Terminé, bravo");tmPaint();return;}
  const p=TM.ph[TM.i];TM.rem=p.d||0;
  if(p.k==="manual"){TM.run=false;beep(990,.3);buzz(200);}
  else{TM.run=true;TM.end=Date.now()+TM.rem*1000;if(p.quiet)beep(p.tone||600,.35,.12);else{beep(p.k==="work"?990:520,.3);buzz(p.k==="work"?[120,60,120]:150);}}
  if(p.say)speak(p.l+". "+p.sub);else if(!p.quiet)speak(phaseSpeech(p));
  tmPaint();ensureLoop();
}
function ensureLoop(){if(tmLoop)return;tmLoop=setInterval(()=>{if(!TM.run||!TM.id)return;const p=TM.ph[TM.i];if(p.k==="up"){tmPaintTime();return;}const r=Math.max(0,Math.ceil((TM.end-Date.now())/1000));if(r!==TM.rem){TM.rem=r;if(r>0&&r<=3&&!p.quiet)beep(740,.08,.2);if(r===0){tmNext();return;}tmPaintTime();}},100);}
function tmUpSec(){return (TM.upAcc+(TM.run?Date.now()-TM.up0:0))/1000;}
function tmPanel(){
  const p=TM.ph[TM.i],nx=TM.ph[TM.i+1],up=p.k==="up";
  const cls=TM.done?"done":p.k,phase=TM.done?"Terminé":p.l;
  const time=p.k==="manual"&&!TM.done?"À toi":up?fmtT(tmUpSec(),true):fmtT(TM.rem);
  const pct=p.d?Math.min(100,(1-TM.rem/p.d)*100):0,total=TM.ph.reduce((a,x)=>a+(x.d||0),0);
  const go=TM.done?"Recommencer":p.k==="manual"?"Série terminée":TM.run?"Pause":(TM.i===0&&TM.rem===(p.d||0)&&!TM.upAcc?"Démarrer":"Reprendre");
  return `<div class="tm tm-${cls}">
   <div class="tm-top"><span class="eyebrow">${esc(TM.label)}${total?` · ${Math.round(total/60)||"<1"} min au total`:""}</span><span class="tm-step num">${TM.i+1}/${TM.ph.length}</span></div>
   <div class="tm-main"><div class="tm-phase">${esc(phase)}</div><div class="tm-time num" id="tm-time">${time}</div></div>
   <div class="tm-sub">${TM.done?"Bien joué.":esc(p.sub||"")}${!TM.done&&nx?` <span class="muted">· ensuite : ${esc(nx.l)}${nx.d?` ${fmtT(nx.d)}`:""}</span>`:""}</div>
   ${up?"":`<div class="tm-bar"><span id="tm-bar" style="width:${pct}%"></span></div>`}
   <div class="tm-ctl"><button class="btn small" type="button" data-tm="go">${go}</button>${TM.done||up?"":`<button class="btn ghost small" type="button" data-tm="skip">Passer</button>`}<button class="btn ghost small" type="button" data-tm="reset">Réinitialiser</button><button class="btn ghost small" type="button" data-tm="close">Fermer</button></div>
  </div>`;
}
function tmPaint(){const el=document.getElementById("tm-slot-"+TM.id);if(el)el.innerHTML=tmPanel();}
function tmPaintTime(){const t=document.getElementById("tm-time"),b=document.getElementById("tm-bar"),p=TM.ph[TM.i];if(!t)return;if(p.k==="up")t.textContent=fmtT(tmUpSec(),true);else{t.textContent=fmtT(TM.rem);if(b&&p.d)b.style.width=Math.min(100,(1-TM.rem/p.d)*100)+"%";}}
function tmClose(){TM.run=false;const id=TM.id;TM.id=null;keepAwake(false);const el=document.getElementById("tm-slot-"+id);if(el)el.innerHTML="";$$(`[data-timer="${id}"]`).forEach(b=>b.setAttribute("aria-expanded","false"));try{speechSynthesis.cancel();}catch(e){}}
const CLOCK=`<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true" style="vertical-align:-2px;margin-right:4px"><circle cx="8" cy="9" r="6" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 5.5V9l2.2 1.4M6 1.5h4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;
function timerBtn(id,def,cls){TMREG[id]=def;return `<button class="${cls||"howto"}" type="button" data-timer="${id}" aria-expanded="${TM.id===id}">${CLOCK}${esc(def.label)}</button>`;}
function timerSlot(id){return `<div class="tm-slot" id="tm-slot-${id}">${TM.id===id?tmPanel():""}</div>`;}
