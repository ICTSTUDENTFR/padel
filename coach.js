/* Programme Padel — Coach technique : que travailler à ton prochain cours ? */
"use strict";
TECH_THEMES.push("Régularité (fautes directes)");

/* Bibliothèque de thèmes : mots-clés repérés dans tes notes, lien avec la prépa physique, plan de cours */
const COURSE={
 "Bandeja":{kw:/bandeja|perdu le filet|lob.{0,20}(adverse|au-dessus de moi)/i,phys:["press_1arm","push_press","ytw","ext_rot90","landmine"],overhead:true,
  goal:"7 bandejas sur 10 croisées et profondes (au-delà de la ligne de service), puis retour au filet",
  warm:"Échanges volée–volée, puis 10 bandejas lentes au panier pour caler le placement de côté.",
  drills:["Panier : bandeja croisée vers une cible à 2 m de la vitre du fond (3 séries de 10).","Bandeja puis split-step et remontée au filet, le prof relance une volée basse.","Situation : le prof lobe en continu, tu dois garder le filet 5 points de suite."],
  play:"Points à thème : chaque lob adverse doit être joué en bandeja, jamais en smash.",
  ask:"Mon épaule est-elle bien de côté et ma frappe assez en avant ?"},
 "Víbora":{kw:/v[ií]bora/i,phys:["landmine","mb_rot","rot_band","press_1arm"],overhead:true,
  goal:"6 víboras sur 10 qui sortent latéralement après la vitre, sans faute",
  warm:"10 bandejas pour trouver le point d'impact, puis passer progressivement à l'effet latéral.",
  drills:["Panier : víbora vers la vitre latérale adverse (cible au sol à 1 m de la grille).","Alterner bandeja et víbora selon la couleur annoncée par le prof.","Víbora puis montée au filet et volée de finition."],
  play:"Points où la víbora n'est autorisée que sur les lobs courts : apprendre à choisir le bon coup.",
  ask:"Quand choisir la víbora plutôt que la bandeja sur un lob ?"},
 "Smash par 3":{kw:/smash|par 3|x3|fuera|sortie par 3/i,phys:["cmj","push_press","mb_overhead","mb_slam","depth_jump","contrast_squat","box_jump"],overhead:true,
  goal:"5 smashs par 3 sur 10 qui sortent par le côté",
  warm:"Déplacements en pas croisés vers l'arrière + 10 smashs à 70 %.",
  drills:["Panier : lob haut, smash à plat vers le côté (par 3), 3 séries de 8.","Choix du coup : sur lob court smash par 3, sur lob profond bandeja.","Smash puis replacement immédiat au filet (split-step)."],
  play:"Points où un lob court doit être conclu au smash en moins de 2 frappes.",
  ask:"Mon placement sous la balle et mon timing de saut sont-ils bons ?"},
 "Smash par 4":{kw:/par 4|x4|smash.{0,15}(filet|hauteur)/i,phys:["cmj","push_press","mb_overhead","depth_jump","contrast_squat"],overhead:true,
  goal:"4 smashs par 4 sur 10 qui passent au-dessus de la grille du fond",
  warm:"Smashs à plat progressifs, puis travail de l'effet lifté.",
  drills:["Panier : lob court et haut au centre, smash lifté qui rebondit fort sur la vitre du fond.","Choix : par 3 si la balle est sur le côté, par 4 si elle est au centre.","Smash + défense de la contre-attaque adverse."],
  play:"Le prof lobe court : tu dois finir le point, sinon il marque.",
  ask:"Quelle est la bonne hauteur de frappe pour le par 4 ?"},
 "Sortie de vitre":{kw:/vitre|coin|double vitre|rebond.{0,10}(fond|lat)/i,phys:["left_drill","left_drill_full","skater","star_drill","lunge_back","bulgarian"],
  goal:"8 sorties de vitre sur 10 remises en jeu (lob ou balle basse), dont 5 croisées",
  warm:"Laisser la balle rebondir sur la vitre du fond, simple remise en jeu, 20 balles.",
  drills:["Sortie de vitre du fond : lob défensif croisé (3 séries de 10).","Double vitre (fond puis latérale) : attendre et remettre en jeu.","Sortie de vitre puis contre-attaque basse aux pieds du volleyeur."],
  play:"Le prof attaque en permanence, tu défends du fond : gagner des points sans monter trop tôt.",
  ask:"Est-ce que j'attends assez la balle et est-ce que je me place assez tôt ?"},
 "Lob de défense":{kw:/lob|d[ée]fense|coinc[ée]|rest[ée] au fond|pas repris le filet/i,phys:["left_drill","star_drill","rsa","int_points"],
  goal:"7 lobs sur 10 qui retombent dans les 2 derniers mètres, qui permettent de reprendre le filet",
  warm:"Lobs lents en coup droit puis revers, en cherchant la hauteur.",
  drills:["Lobs croisés au panier vers une cible à 2 m de la vitre adverse.","Lob puis course au filet pendant que le prof joue la bandeja.","Défense du fond : choix entre lob et balle basse selon la position des adversaires."],
  play:"Points où tu dois reprendre le filet uniquement grâce au lob.",
  ask:"Quelle hauteur et quelle trajectoire pour mes lobs selon la position adverse ?"},
 "Volée":{kw:/vol[ée]e|au filet|bloc|volleyeur/i,phys:["reactive_acc","pogo","rope","shoulder_tap","pallof"],
  goal:"Volées dans les pieds ou au centre : 8 sur 10 sans faute, au-delà de la ligne de service",
  warm:"Volée–volée au centre, prise continentale, raquette devant.",
  drills:["Volées profondes en coup droit puis revers (le prof alterne).","Volées basses sur balles rapides aux pieds (réactivité).","Volée de placement vers la grille latérale pour finir le point."],
  play:"Duel au filet : 2 contre 1 ou 2 contre 2 sur toutes les balles jouées de volée.",
  ask:"Ma prise et la préparation de ma raquette sont-elles assez courtes ?"},
 "Bajada":{kw:/bajada|balle haute.{0,15}(vitre|rebond)/i,phys:["cmj","mb_rot","landmine"],overhead:true,
  goal:"5 bajadas sur 10 qui descendent vers les pieds des adversaires",
  warm:"Sortie de vitre simple puis attaque montante après la vitre.",
  drills:["Panier : lob qui rebondit haut sur la vitre du fond, attaque en bajada croisée.","Choix entre lob défensif et bajada selon la hauteur du rebond.","Bajada puis montée au filet."],
  play:"Points où chaque balle haute après la vitre doit être attaquée.",
  ask:"À quelle hauteur minimale je peux attaquer après la vitre ?"},
 "Chiquita":{kw:/chiquita|retour bas|balle basse|aux pieds/i,phys:["reactive_acc","star_drill","lunge_back"],
  goal:"7 balles basses sur 10 qui tombent aux pieds des volleyeurs",
  warm:"Échanges au centre du terrain, balles lentes et basses.",
  drills:["Chiquita croisée depuis la ligne de service sur volleyeur au filet.","Chiquita puis montée au filet (transition).","Retour de service bas aux pieds du serveur qui monte."],
  play:"Points où tu dois gagner le filet avec une balle basse plutôt qu'un lob.",
  ask:"Comment varier entre chiquita et lob pour déstabiliser la paire ?"},
 "Service / retour":{kw:/service|retour|double faute|break/i,phys:[],
  goal:"80 % de premiers services dans le coin ou au T, et 8 retours sur 10 sans faute",
  warm:"10 services lents, puis vitesse de match.",
  drills:["Service ciblé : coin (vitre latérale) et T, 20 balles chacun.","Retour croisé bas ou lob selon la position du serveur.","Service + première volée (enchaînement)."],
  play:"Jeux décisifs : le serveur doit gagner le point en moins de 4 frappes.",
  ask:"Quelle routine de service pour les points importants ?"},
 "Placement et transitions":{kw:/placement|transition|mont[ée]e|trop t[ôo]t|trop tard|cuit|fatigu|essouffl/i,phys:["int_points","rsa","star_drill","left_drill"],
  goal:"Replacement après chaque coup : zéro point perdu par mauvais placement dans le jeu à thème",
  warm:"Déplacements en miroir avec le partenaire (avancer, reculer ensemble).",
  drills:["Transition défense → attaque : lob, montée ensemble, première volée.","Recul en duo sur lob : qui prend, qui couvre.","Économie de déplacements : points joués en respectant les zones."],
  play:"Points où le prof sanctionne chaque mauvais placement (point perdu).",
  ask:"Où dois-je me placer par rapport à mon partenaire dans chaque situation ?"},
 "Jeu de filet en duo":{kw:/partenaire|communication|milieu|entre (nous|les deux)|qui prend/i,phys:["reactive_acc","pallof"],
  goal:"Aucune balle perdue au milieu : annonce systématique « à toi / à moi »",
  warm:"Volées à deux contre le prof, en parlant sur chaque balle.",
  drills:["Balles au centre : le joueur en coup droit prend, l'autre couvre.","Couverture sur lob : le partenaire recule en diagonale.","Situation à deux contre le prof qui cherche le milieu."],
  play:"2 contre 2 avec obligation d'annoncer chaque balle.",
  ask:"Quelles règles de couverture adopter avec mon partenaire ?"},
 "Régularité (fautes directes)":{kw:/faute|fautes directes|irr[ée]gulier|rat[ée]/i,phys:[],
  goal:"Séries de 20 balles sans faute en échange croisé, puis 15 à vitesse de match",
  warm:"Échanges croisés lents du fond, sans chercher à gagner le point.",
  drills:["Échanges croisés : compter les séries sans faute (objectif 20).","Marge de sécurité : viser 1 m au-dessus du filet et 1 m à l'intérieur des lignes.","Jeu à thème : le point est perdu si tu tentes un coup gagnant trop tôt."],
  play:"Points où seule l'erreur adverse compte : patience.",
  ask:"Quels coups dois-je sécuriser en priorité ?"}
};
const LESSON_DAYS=[["mar","Mardi"],["jeu","Jeudi"],["mer","Mercredi"],["ven","Vendredi"],["lun","Lundi"],["sam","Samedi"]];
function lessonDay(){return S_().lessonDay||"mar";}
function nextLessonDate(){const t=todayIso();for(let i=0;i<8;i++){const d=addDays(t,i);if(dayKeyOf(d)===lessonDay())return d;}return t;}

/* ---------- Moteur de suggestions ---------- */
function coachSuggest(ref){
  const T=todayIso(),since=addDays(T,-45),S={};Object.keys(COURSE).forEach(k=>S[k]={score:0,why:[]});
  const add=(k,v,why)=>{if(!S[k])return;S[k].score+=v;if(why&&!S[k].why.includes(why))S[k].why.push(why);};
  const lesson=ref||nextLessonDate(),w=Math.max(1,weekOfDate(lesson)),b=blockOf(w).id;
  // 1. Axe du bloc
  // 2. Préparation physique de la semaine
  const wk=DAY_KEYS.map(d=>planFor(w,d)).filter(p=>"AP".includes(p.kind)).flatMap(p=>p.items.map(i=>i[0]));
  Object.entries(COURSE).forEach(([k,c])=>{const hit=c.phys.filter(x=>wk.includes(x));if(hit.length)add(k,Math.min(3,1+hit.length),`en salle cette semaine : ${hit.slice(0,2).map(exName).join(", ")}`);});
  // 3. Tes notes (tournois, matchs, journal mental, carnet, vidéos)
  const notes=[];
  Object.values(data.tournois).filter(t=>t.date>=since).forEach(t=>{if(t.note)notes.push([t.date,t.note]);(t.matches||[]).forEach(m=>{if(m.note)notes.push([t.date,m.note]);});});
  Object.values(data.mental).filter(x=>x&&x.kind==="journal"&&x.date>=since).forEach(x=>{if(x.next)notes.push([x.date,x.next]);});
  Object.values(data.tech).filter(x=>x&&x.date>=since&&x.notes).forEach(x=>notes.push([x.date,x.notes]));
  Object.values(data.videos).filter(v=>v.date>=since).forEach(v=>(v.notes||[]).forEach(n=>notes.push([v.date,n.txt])));
  Object.values(data.opps).forEach(o=>{if(o.plan)notes.push([T,o.plan]);});
  notes.sort((a,b)=>b[0].localeCompare(a[0])).forEach(([d,txt])=>Object.entries(COURSE).forEach(([k,c])=>{const m=String(txt).match(c.kw);if(m&&S[k].score<40){const ex=String(txt).length>70?String(txt).slice(0,67)+"…":txt;add(k,3,`tu as noté « ${ex} » (${fr(d)})`);}}));
  // 4. Statistiques de match
  const ms=[];Object.values(data.tournois).sort((a,b)=>a.date.localeCompare(b.date)).forEach(t=>(t.matches||[]).forEach(m=>{if([m.w,m.ue,m.sm,m.df].some(x=>num(x)!=null))ms.push(m);}));
  const last=ms.slice(-8),A=k=>{const v=last.map(m=>num(m[k])).filter(x=>x!=null);return v.length?avg(v):null;};
  if(last.length){const w_=A("w"),ue=A("ue"),df=A("df"),sm=A("sm");
    if(w_!=null&&ue&&w_/ue<1)add("Régularité (fautes directes)",5,`tu fais plus de fautes directes (${fmt(ue)}) que de points gagnants (${fmt(w_)}) par match`);
    if(ue!=null&&ue>=15)add("Volée",1,"beaucoup de fautes directes : sécuriser les volées");
    if(df!=null&&df>=2)add("Service / retour",4,`${fmt(df)} doubles fautes par match en moyenne`);
    if(sm!=null&&sm<2)add("Smash par 3",2,`seulement ${fmt(sm)} smash gagnant par match`);}
  // 5. Résultats et fin de match
  const tr=Object.values(data.tournois).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,4);
  const cuit=tr.filter(t=>/Cuit|Crampes/.test(t.fin||"")).length;
  if(cuit>=2){add("Placement et transitions",3,`${cuit} tournois terminés « cuit » : économiser tes déplacements`);add("Lob de défense",2,"le lob permet de souffler et de reprendre le filet");}
  const early=tr.filter(t=>["Poules","1/16"].includes(t.res)).length;
  if(tr.length>=2&&early>=2){add("Régularité (fautes directes)",2,"sorties rapides en tournoi : d'abord ne plus donner de points");add("Service / retour",1,"sorties rapides : sécuriser les jeux de service");}
  const lost=tr.flatMap(t=>(t.matches||[]).filter(m=>m.r==="D"&&m.o)).map(m=>data.opps&&Object.values(data.opps).find(o=>o.name.toLowerCase()===m.o.trim().toLowerCase())).filter(Boolean);
  const COUNTER=[[/lob/i,["Bandeja","Smash par 3"]],[/smash|bandeja|v[ií]bora/i,["Lob de défense","Sortie de vitre"]],[/vol[ée]e|filet/i,["Lob de défense","Chiquita"]],[/vitre|d[ée]fen/i,["Smash par 4","Placement et transitions"]],[/service|retour/i,["Service / retour"]],[/r[ée]gulier|patient/i,["Régularité (fautes directes)"]]];
  lost.forEach(o=>{if(!o.forts)return;COUNTER.forEach(([re,ks])=>{if(re.test(o.forts))ks.forEach(k=>add(k,2,`pour contrer ${o.name} (forts : ${o.forts})`));});});
  // 6. Carnet technique : consolider ou varier
  Object.keys(COURSE).forEach(k=>{const h=Object.values(data.tech).filter(x=>x&&x.theme===k&&x.date<T).sort((a,b)=>b.date.localeCompare(a.date));
    const r=h.filter(x=>x.rating&&x.date>=addDays(T,-30)).map(x=>+x.rating);
    if(r.length&&avg(r)<=2.5)add(k,3,`réussite moyenne de ${fmt(avg(r))}/5 à consolider`);
    if(h[0]&&daysBetween(h[0].date,T)<=7&&(+h[0].rating||0)>=4)add(k,-4,null);
    else if(h[0]&&daysBetween(h[0].date,T)<=7)add(k,-1,null);
    if(h[0]&&daysBetween(h[0].date,T)>35)add(k,1,`pas retravaillé depuis le ${fr(h[0].date)}`);});
  // 7. Douleurs et fatigue
  const pains=Object.values(data.pains).filter(p=>p.date>=addDays(T,-14));
  if(pains.some(p=>/Épaule|Coude/.test(p.zone)&&p.level>=3))Object.entries(COURSE).forEach(([k,c])=>{if(c.overhead)add(k,-5,null);});
  if(pains.some(p=>/Genou|Cheville|Mollet/.test(p.zone)&&p.level>=3)){add("Sortie de vitre",-2,null);add("Placement et transitions",-1,null);add("Volée",1,"douleur au bas du corps : thème peu intense en déplacements");}
  const ck=checkinScore(data.checkins[T]);if(ck!=null&&ck<50){add("Volée",1,"forme basse aujourd'hui : thème technique peu intense");add("Smash par 3",-1,null);add("Smash par 4",-1,null);}
  // 8. Tournoi proche
  const ev=upcomingEvents().find(e=>{const n=daysBetween(lesson,e.date);return n>=0&&n<=8;});
  if(ev){const n=daysBetween(lesson,ev.date);add("Service / retour",2,`tournoi ${ev.cat} dans ${plural(n,"jour")} : sécuriser les points de match`);add("Jeu de filet en duo",1,`tournoi dans ${plural(n,"jour")} : automatismes avec ton partenaire`);add("Régularité (fautes directes)",1,null);["Víbora","Bajada","Chiquita","Smash par 4"].forEach(k=>add(k,-1,null));}
  // Axe du bloc (raison listée en dernier)
  ({1:["Sortie de vitre","Lob de défense","Régularité (fautes directes)"],2:["Bandeja","Placement et transitions","Volée"],3:["Smash par 3","Smash par 4","Víbora"]}[b]).forEach(k=>add(k,2,`axe du bloc « ${blockOf(w).name} »`));
  const res=Object.entries(S).map(([k,v])=>({theme:k,...v,why:v.why.slice(0,4)})).sort((a,b)=>b.score-a.score);
  const pains2=pains.some(p=>/Épaule|Coude/.test(p.zone)&&p.level>=3);
  return {lesson,list:res.slice(0,3),painNote:pains2?"Douleur récente à l'épaule ou au coude : j'ai écarté les coups au-dessus de la tête cette semaine.":""};
}
function lessonText(k,date){const c=COURSE[k];return [`Cours de padel du ${frLong(date)} — thème : ${k}`,`Objectif : ${c.goal}`,`Échauffement : ${c.warm}`,...c.drills.map((d,i)=>`Exercice ${i+1} : ${d}`),`Mise en situation : ${c.play}`,`Question pour le prof : ${c.ask}`].join("\n");}
function chooseTheme(k,date){const t=data.tech[date]||{id:date,date};t.theme=k;t.goal=COURSE[k].goal;t.lesson=true;save("tech",date,t);toast(`« ${k} » choisi pour le cours du ${fr(date)}`);}

/* ---------- Affichage ---------- */
function coachCards(sug,compact){
  const chosen=(data.tech[sug.lesson]||{}).theme;
  return sug.list.map((s,i)=>{const c=COURSE[s.theme],on=chosen===s.theme;
    return `<div class="coachcard ${i===0?"top":""} ${on?"on":""}"><div class="sess-head"><div><div class="eyebrow">${i===0?"Suggestion n°1":"Suggestion n°"+(i+1)}</div><h3>${esc(sideTxt(s.theme))}</h3></div>${on?`<span class="okline">✓ Choisi</span>`:`<button class="btn small" type="button" data-choose="${esc(s.theme)}|${sug.lesson}">Choisir</button>`}</div>
     <ul class="why-list">${s.why.map(w=>`<li>${esc(w)}</li>`).join("")||"<li>Axe général du moment</li>"}</ul>
     ${compact&&i>0?"":`<details ${on||(!chosen&&i===0&&!compact)?"open":""} data-k="plan-${i}"><summary>Plan de cours à proposer</summary><div class="plan">
      <p><b>Objectif mesurable :</b> ${esc(c.goal)}</p><p><b>Échauffement :</b> ${esc(c.warm)}</p>
      <ol class="steps">${c.drills.map(d=>`<li><span>${esc(sideTxt(d))}</span></li>`).join("")}</ol>
      <p><b>Mise en situation :</b> ${esc(c.play)}</p><p><b>Question à poser :</b> ${esc(c.ask)}</p>
      <button class="chip-btn" type="button" data-lessoncopy="${esc(s.theme)}|${sug.lesson}">Copier / envoyer à mon prof</button></div></details>`}
    </div>`;}).join("");
}
function lessonCardToday(){
  const t=todayIso(),nl=nextLessonDate(),n=daysBetween(t,nl);if(n>1||weekOfDate(nl)<1)return "";
  const sug=coachSuggest(nl),ch=(data.tech[nl]||{}).theme;
  return `<section class="card stack coachwrap"><div class="sess-head"><div><div class="eyebrow">${n===0?"Cours de padel aujourd'hui":"Cours de padel demain"}</div><h3>${ch?`Thème : ${esc(ch)}`:"Que proposer à ton prof ?"}</h3></div><button class="linkbtn" data-sub="cours">Détails</button></div>
   ${sug.painNote?`<p class="small muted">${esc(sug.painNote)}</p>`:""}${coachCards(sug,true)}</section>`;
}
SUBS.cours=()=>{
  const nl=nextLessonDate(),sug=coachSuggest(nl),hist=Object.values(data.tech).filter(x=>x&&x.lesson&&x.theme).sort((a,b)=>b.date.localeCompare(a.date));
  return `<section class="card stack"><div><div class="eyebrow">Prochain cours : ${esc(frLong(nl))}</div><h2>Mon cours de padel</h2></div>
   <p class="small">Les suggestions tiennent compte de tes notes de match et de tournoi, de tes statistiques, de tes défaites contre des paires du carnet, de ce que tu travailles en salle cette semaine, de tes douleurs, de ta forme et de ton prochain tournoi. Après le cours, note ta réussite : la suggestion suivante en tiendra compte.</p>
   <div class="form-row"><label>Jour de mon cours<select id="lessonday">${LESSON_DAYS.map(([k,l])=>`<option value="${k}" ${lessonDay()===k?"selected":""}>${l}</option>`).join("")}</select></label></div>
   ${sug.painNote?`<div class="alert small">${esc(sug.painNote)}</div>`:""}</section>
  <section class="card stack">${coachCards(sug,false)}</section>
  <section class="card stack"><div><div class="eyebrow">Après le cours</div><h3>Bilan du cours du ${fr(nl)}</h3></div>
   <div class="form-row"><label>Réussite de l'objectif (1–5)<select data-tech="${nl}|rating"><option value="">–</option>${[1,2,3,4,5].map(v=>`<option ${+((data.tech[nl]||{}).rating)===v?"selected":""}>${v}</option>`).join("")}</select></label></div>
   <label>Ce que le prof m'a dit / à retravailler<textarea data-tech="${nl}|notes" rows="3">${esc((data.tech[nl]||{}).notes||"")}</textarea></label></section>
  ${hist.length?`<section class="card stack"><h3>Mes cours</h3>${hist.slice(0,12).map(x=>`<div class="techitem"><div class="sess-head"><b>${fr(x.date)} · ${esc(x.theme)}</b><span>${x.rating?x.rating+"/5":""}</span></div>${x.notes?`<div class="small muted">${esc(x.notes)}</div>`:""}</div>`).join("")}</section>`:""}`;
};
MORE.splice(1,0,["cours","Mon cours de padel","Quoi travailler avec ton prof"]);
