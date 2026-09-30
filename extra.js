/* Programme Padel — v3 : programme adaptatif, padel, récupération, mental, nutrition, connecté */
"use strict";

/* =====================================================================
   1. Nouveaux exercices (renforcement ciblé)
   ===================================================================== */
Object.assign(EX,{
wrist_ecc:{n:"Flexions de poignet excentriques",c:"Prévention",m:["Avant-bras","Coude"],
 w:"Renforce les tendons de l'avant-bras : c'est l'exercice de référence contre la douleur au coude (épicondylite) fréquente au padel.",
 s:["Assis, avant-bras posé sur la cuisse, poignet dans le vide, petit haltère (2–5 kg) paume vers le bas.","Avec l'autre main, aide à remonter le poignet en haut.","Lâche l'aide et redescends lentement en 4 secondes.","Recommence. Fais aussi la version paume vers le haut."],
 k:["Descente très lente","Douleur tolérée jusqu'à 3/10"],e:["Remonter sans aide","Charge trop lourde"],ez:"Bouteille d'eau.",hd:"Haltère plus lourd.",vq:"eccentric wrist extension tennis elbow",
 fig:[{p:P({ln:[90,0],lf:[86,2],an:[18,90],hn:150,af:[10,0]}),pr:[{t:"db",at:"xN"},{t:"block",at:"hip",dx:-20,w:36,dy:6}],l:"Poignet en haut (avec aide)"},{p:P({ln:[90,0],lf:[86,2],an:[18,90],hn:30,af:[10,0]}),pr:[{t:"db",at:"xN"},{t:"block",at:"hip",dx:-20,w:36,dy:6}],ar:[{at:"xN",o:[10,-14],d:[0,16]}],l:"Descente lente en 4 s"}]},
forearm_rot:{n:"Rotations au marteau",c:"Prévention",m:["Avant-bras","Coude"],
 w:"Travaille la pronation et la supination, très sollicitées sur les volées et la víbora.",
 s:["Assis, avant-bras sur la cuisse, tiens un marteau (ou un haltère lesté d'un seul côté) par le manche.","Pars marteau vertical.","Tourne lentement le poignet pour incliner le marteau d'un côté, reviens, puis de l'autre côté.","Plus tu tiens loin de la tête, plus c'est dur."],
 k:["Mouvement lent et contrôlé"],e:["Bouger le coude"],ez:"Tiens le manche près de la tête.",hd:"Tiens le manche au bout.",vq:"hammer pronation supination exercise",
 fig:[{p:P({ln:[90,0],lf:[86,2],an:[18,90],hn:180,af:[10,0]}),pr:[{t:"block",at:"hip",dx:-20,w:36,dy:6}],l:"Marteau vertical"},{p:P({ln:[90,0],lf:[86,2],an:[18,90],hn:120,af:[10,0]}),pr:[{t:"block",at:"hip",dx:-20,w:36,dy:6}],ar:[{at:"xN",o:[-4,-18],d:[18,8],c:[12,-12]}],l:"Rotation lente"}]},
bird_dog:{n:"Bird dog",c:"Gainage",m:["Lombaires","Fessiers","Abdominaux"],
 w:"Stabilise le bas du dos en coordonnant bras et jambe opposés, sans cambrer.",
 s:["À quatre pattes, mains sous les épaules, genoux sous les hanches, dos plat.","Tends en même temps un bras devant et la jambe opposée derrière.","Tiens 2 s sans que le bassin tourne ni que le dos se creuse.","Reviens et change de côté."],
 k:["Bassin immobile","Dos plat comme une table"],e:["Lever la jambe trop haut et cambrer"],ez:"Seulement la jambe.",hd:"Tiens 5 s.",vq:"bird dog exercise",
 fig:[{p:P({t:70,ln:[0,-90],lf:[4,-90],fn:-90,ff:-90,an:[0,0],af:[3,0]}),l:"À quatre pattes"},{p:P({t:70,ln:[0,-90],fn:-90,lf:[-100,-100],ff:-100,an:[0,0],af:[110,110]}),l:"Bras et jambe opposés tendus"}]},
glute_bridge:{n:"Pont fessier",c:"Force",m:["Fessiers","Ischios","Lombaires"],
 w:"Réveille les fessiers qui protègent le bas du dos, les genoux et l'aine.",
 s:["Allongé sur le dos, genoux pliés, pieds à plat largeur de hanches.","Serre les fessiers et monte le bassin jusqu'à aligner genoux, hanches et épaules.","Tiens 2 s en haut.","Redescends lentement."],
 k:["Pousse dans les talons","Côtes rentrées"],e:["Cambrer le bas du dos en haut"],ez:"Amplitude réduite.",hd:"Sur une jambe.",vq:"glute bridge technique",
 fig:[{p:P({t:-90,ln:[140,20],lf:[136,22],an:[10,10],af:[8,8]}),l:"Bassin au sol"},{p:P({t:-108,ln:[103,13],lf:[99,15],an:[10,10],af:[8,8]}),ar:[{at:"hip",o:[0,14],d:[0,-16]}],l:"Bassin en haut, fessiers serrés"}]},
adductor_squeeze:{n:"Serrage des adducteurs",c:"Prévention",m:["Adducteurs"],
 w:"Renforcement doux de l'aine, idéal quand les grands écarts en défense deviennent douloureux.",
 s:["Allongé sur le dos, genoux pliés, un ballon ou un coussin plié entre les genoux.","Serre fort (7/10) pendant le temps indiqué.","Relâche 30 s.","Augmente progressivement la force du serrage au fil des séances."],
 k:["Respire normalement"],e:["Serrer jusqu'à la douleur"],ez:"Serrage à 5/10.",hd:"En position de pont fessier.",vq:"adductor squeeze test exercise",
 fig:[{p:P({t:-90,ln:[140,20],lf:[136,22],an:[10,10],af:[8,8]}),pr:[{t:"ball",at:"kN",dx:0,dy:4}],l:"Serre le ballon entre les genoux"}]},
wall_sit:{n:"Chaise contre le mur",c:"Prévention",m:["Quadriceps","Tendon rotulien"],
 w:"Contraction statique qui soulage souvent le tendon sous la rotule et renforce les quadriceps sans impact.",
 s:["Dos contre un mur, pieds à environ 50 cm du mur.","Descends jusqu'à ce que les genoux soient à 60–90° (moins bas si douleur).","Tiens le temps indiqué en respirant.","Remonte en glissant le long du mur."],
 k:["Genoux au-dessus des chevilles","Douleur tolérée jusqu'à 3/10"],e:["Descendre trop bas si le genou fait mal"],ez:"Moins bas, 20 s.",hd:"Sur une jambe.",vq:"wall sit isometric patellar tendon",
 fig:[{p:P({t:0,ln:[90,0],lf:[86,2],an:[5,5],af:[3,3]}),pr:[{t:"wall",at:"hip",dx:-16}],l:"Cuisses parallèles, dos au mur"}]},
step_down:{n:"Descente contrôlée d'une marche",c:"Prévention",m:["Quadriceps","Fessiers","Genou"],
 w:"Apprend au genou à rester dans l'axe en freinant, comme dans une réception ou un freinage.",
 s:["Debout sur une marche sur une jambe, l'autre dans le vide devant.","Plie lentement la jambe d'appui pour aller toucher le sol du talon opposé.","Garde le genou d'appui dans l'axe du 2e orteil.","Remonte sans pousser avec le pied au sol."],
 k:["Descente en 3 s","Bassin horizontal"],e:["Genou qui rentre","S'asseoir sur la jambe du bas"],ez:"Marche plus basse.",hd:"Marche plus haute.",vq:"eccentric step down knee",
 fig:[{p:P({ln:[0,0],lf:[25,5],base:30}),pr:[{t:"block",at:"aN",dx:-18,w:36,dy:0}],l:"Sur une jambe"},{p:P({t:10,ln:[62,-22],lf:[28,30],ff:40}),pr:[{t:"block",at:"aN",dx:-18,w:36,dy:0}],ar:[{at:"hip",o:[-16,-10],d:[0,18]}],l:"Descente lente, genou dans l'axe"}]},
balance_1leg:{n:"Équilibre sur une jambe",c:"Prévention",m:["Chevilles","Proprioception"],
 w:"Réapprend à la cheville à se stabiliser : la meilleure prévention des entorses à répétition.",
 s:["Debout sur une jambe, genou légèrement fléchi.","Tiens le temps indiqué sans poser l'autre pied.","Progresse : yeux fermés, puis sur un coussin.","Change de jambe."],
 k:["Regard fixe devant toi"],e:["Verrouiller le genou"],ez:"Une main sur un mur.",hd:"Yeux fermés ou sur un coussin.",vq:"single leg balance ankle",
 fig:[{p:P({ln:[4,-2],lf:[40,-60],an:[-20,-10],af:[30,40]}),l:"30 s sur une jambe"}]}
});
LOADED.add("wrist_ecc");LOADED.add("forearm_rot");

/* =====================================================================
   2. Programme adaptatif
   ===================================================================== */
const REHAB={
 epaule:{name:"Épaule",items:[["ext_rot",3,"15/bras"],["ytw",2,"8 chaque lettre"],["ext_rot90",2,"12/bras"],["m_sleeper",2,"30 s/côté"]]},
 coude:{name:"Coude et avant-bras",items:[["wrist_ecc",3,"15"],["forearm_rot",3,"12"],["m_wrist",2,"30 s chaque sens"]]},
 dos:{name:"Bas du dos",items:[["dead_bug",3,"10/côté"],["bird_dog",3,"8/côté"],["side_plank",3,"20 s/côté"],["glute_bridge",3,"12"]]},
 aine:{name:"Aine et adducteurs",items:[["adductor_squeeze",3,"30 s","30 s de récup"],["copenhagen",3,"15 s/côté","Genou posé sur le banc (version facile)"],["glute_bridge",3,"12"]]},
 genou:{name:"Genou",items:[["wall_sit",4,"30 s","30 s de récup"],["step_down",3,"8/jambe"],["glute_bridge",3,"12"]]},
 cheville:{name:"Cheville et tendon d'Achille",items:[["calf_ecc",3,"15"],["balance_1leg",3,"30 s/côté"],["m_ankle",2,"10/côté"]]}
};
function zoneToRehab(z){z=z||"";if(/Épaule|Cou/.test(z))return "epaule";if(/Coude|Poignet/.test(z))return "coude";if(/dos/.test(z))return "dos";if(/Hanche|aine|Cuisse/.test(z))return "aine";if(/Genou/.test(z))return "genou";if(/Mollet|Cheville|Achille/.test(z))return "cheville";return null;}
function activeRehab(){return Object.entries(data.rehab).filter(([,r])=>r&&r.active).map(([k])=>k);}
/* Tournois à venir */
function upcomingEvents(){const t=todayIso();return Object.values(data.events).filter(e=>e&&e.date&&(e.end||e.date)>=t).sort((a,b)=>a.date.localeCompare(b.date));}
function eventInWeek(w){const a=dateOf(w,0),b=dateOf(w,6);return Object.values(data.events).filter(e=>e&&e.date>=a&&e.date<=b).sort((x,y)=>x.date.localeCompare(y.date))[0]||null;}
function taperFor(ds){return Object.values(data.events).filter(e=>e&&e.goal).find(e=>{const n=daysBetween(ds,e.date);return n>0&&n<=10;})||null;}
function resumeFor(ds){const r=data.resume.main;return r&&r.from&&ds>=r.from&&ds<r.until?r:null;}
function multiDay(w){const e=eventInWeek(w);return !!(e&&e.end&&e.end>e.date);}
/* Échauffement adapté à la séance */
function warmupFor(p){
  const keys=p.items.map(i=>i[0]);
  const jumps=keys.some(k=>["box_jump","cmj","depth_jump","skater","pogo","jump_lunge","contrast_squat","reactive_acc","mb_overhead"].includes(k));
  const upper=keys.some(k=>["bench_db","row_db","pullup","press_1arm","push_press","landmine","mb_slam","mb_overhead","ytw","row_band","rot_band","pushup","mb_rot"].includes(k));
  const lower=keys.some(k=>["squat_goblet","back_squat","rdl","trapbar","bulgarian","lunge_back","contrast_squat","step_down","wall_sit"].includes(k));
  const first=keys.find(k=>EX[k]&&LOADED.has(k));
  const ph=[{d:180,l:"Cardio léger",sub:"Rameur, vélo ou corde, en montant progressivement"},{d:90,l:"Mobilité hanches et dos",sub:"90/90, rotations thoraciques, fente avec rotation"}];
  if(upper)ph.push({d:90,l:"Épaules à l'élastique",sub:"Rotations externes × 12, tirage × 12, passages d'épaules × 10"});
  if(lower)ph.push({d:90,l:"Activation des jambes",sub:"10 squats au poids du corps, 8 fentes arrière, 10 ponts fessiers"});
  if(jumps)ph.push({d:90,l:"Chevilles et sauts",sub:"20 pogos, 5 sauts progressifs, 2 accélérations"});
  if(first)ph.push({d:120,l:"Séries de montée",sub:`2 séries légères de ${exName(first)} (50 % puis 75 %)`});
  return ph;
}
/* Signaux de fatigue */
function fatigueSignal(){
  const t=todayIso(),ref=todayRef();if(!ref||isDeload(ref.w))return null;
  const sc=[0,1,2].map(k=>checkinScore(data.checkins[addDays(t,-k)]));
  if(sc.every(x=>x!=null&&x<50))return "3 matins d'affilée avec une forme basse";
  const done=Object.values(data.logs).filter(l=>l&&l.done&&l.date<=t&&l.date>=addDays(t,-7)).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,2);
  if(done.length===2&&done.every(l=>+l.rpe>=9))return "2 séances d'affilée ressenties à 9/10 ou plus";
  return null;
}
function lightenRestOfWeek(){const ref=todayRef();if(!ref)return;const di=DAY_KEYS.indexOf(ref.d);DAY_KEYS.slice(di).forEach(d=>{const id=`s${ref.w}-${d}`,p=planFor(ref.w,d);if("AP".includes(p.kind)){data.adj[id]={...(data.adj[id]||{}),short:true};}});lsSave();renderApp({force:true});toast("Reste de la semaine allégé");}
/* Application des adaptations au plan (appelé par planFor) */
function applyAdaptive(p){
  const ds=dateOf(p.w,DAY_KEYS.indexOf(p.d)),adj=data.adj[p.id]||{},cues=[];
  const tp=taperFor(ds);
  if(tp&&(p.kind==="A"||p.kind==="P")){p.taper=tp;if(p.kind==="A"&&!p.short){p.items=p.items.slice(0,8);p.dur=Math.round(p.dur*0.75);}p.short=true;cues.push(`Affûtage avant ${tp.cat} ${tp.lieu||""} (J-${daysBetween(ds,tp.date)}) : garde tes charges habituelles mais une série de moins, sauts et sprints à fond mais peu nombreux.`);}
  const rs=resumeFor(ds);
  if(rs&&"AP".includes(p.kind)){p.resume=rs;if(p.kind==="A"){p.items=p.items.filter(it=>!["depth_jump","contrast_squat","reactive_acc"].includes(it[0]));}p.short=true;cues.push(`Reprise après ${rs.days} jours d'arrêt : charges −20 %, effort 6–7/10 maximum, aucun saut maximal.`);}
  if(adj.express&&"AP".includes(p.kind)){p.express=true;
    if(p.kind==="A"){const w=p.items.find(i=>i[0]==="warmup"),rest=p.items.filter(i=>i[0]!=="warmup");const expl=rest.filter(i=>EX[i[0]]&&EX[i[0]].c==="Explosivité").slice(0,2),str=rest.filter(i=>EX[i[0]]&&EX[i[0]].c!=="Explosivité").slice(0,3);p.items=[w?["warmup",null,"6 min",w[3]]:null,...expl,...str].filter(Boolean);p.dur=28;}
    else{p.items=p.items.slice(0,3);p.dur=Math.min(p.dur,100);}
    p.short=true;p.title+=" · express";cues.push("Version express : l'essentiel en 25–30 minutes.");}
  if(["lun","mer","ven"].includes(p.d)&&!["M","R"].includes(p.kind)){const rh=activeRehab();rh.forEach(z=>{REHAB[z].items.forEach(it=>p.items.push([it[0],it[1],it[2],"Renforcement "+REHAB[z].name.toLowerCase()+(it[3]?" · "+it[3]:""),null,"rehab"]));p.dur+=12;});if(rh.length)p.rehab=rh;}
  if(p.kind==="M"&&(weekLayout(p.w)[p.d]||{}).next)p.items.push(["overnight",null,"25 min","Le soir, si tu rejoues demain"]);
  if(p.items.some(i=>i[0]==="warmup"))p.warm=warmupFor(p);
  if(cues.length)p.cue=cues.join(" ")+(p.cue?" "+p.cue:"");
  return p;
}

/* =====================================================================
   3. Routines supplémentaires (minuteurs)
   ===================================================================== */
Object.assign(ROUTINES,{
 overnight:{label:"Soir entre deux journées",ph:()=>withPrep([
  {d:600,l:"Marche légère",sub:"Dans les 30 min après ton dernier match"},
  {d:45,l:"Quadriceps",sub:"Côté 1 puis côté 2"},{d:45,l:"Quadriceps",sub:"Côté 2"},{d:45,l:"Mollets",sub:"Côté 1"},{d:45,l:"Mollets",sub:"Côté 2"},{d:60,l:"Fessiers et hanches",sub:"Allongé, cheville sur le genou opposé"},
  {d:600,l:"Jambes surélevées",sub:"Allongé, jambes contre un mur, respire calmement"},
  {d:180,l:"Respiration lente",sub:"Inspire 5 s, expire 5 s. Puis repas glucides + protéines, 1,5 L d'eau avec électrolytes, coucher tôt"}])},
 breath:{label:"Respiration guidée · 5 min",ph:()=>{const ph=[{k:"rest",d:4,l:"Installe-toi",sub:"Assis, épaules relâchées"}];for(let i=0;i<30;i++){ph.push({k:"work",d:5,l:"Inspire",sub:"Par le nez, le ventre se gonfle",quiet:true,tone:520});ph.push({k:"rest",d:5,l:"Expire",sub:"Lentement, par la bouche",quiet:true,tone:392});}return ph;}},
 visu:{label:"Visualisation d'avant-match · 7 min",ph:()=>[
  {k:"rest",d:5,l:"Installe-toi",sub:"Assis ou allongé, yeux fermés"},
  {k:"work",d:60,l:"Respire",sub:"Cinq respirations lentes. Relâche les épaules et la mâchoire.",say:true},
  {k:"work",d:75,l:"Le lieu",sub:"Imagine le club, le bruit des balles, la vitre derrière toi, ton partenaire à côté.",say:true},
  {k:"work",d:90,l:"Tes coups",sub:"Vois-toi réussir 3 bandejas profondes, une sortie de vitre, une volée gagnante. Sens le geste.",say:true},
  {k:"work",d:75,l:"Un point difficile",sub:"Tu perds un point important. Tu fais ta routine : tu respires, tu relâches, tu te recentres.",say:true},
  {k:"work",d:60,l:"Ton plan de jeu",sub:"Rappelle-toi ton objectif du jour et ton plan contre cette paire.",say:true},
  {k:"work",d:45,l:"Ton mot-clé",sub:"Répète ton mot-clé de confiance trois fois. Ouvre les yeux quand tu es prêt.",say:true}]}
});

/* =====================================================================
   4. Métronome
   ===================================================================== */
const Metro={on:false,bpm:60,t:null,n:0,label:""};
function metroToggle(bpm,label){
  if(Metro.on&&Metro.bpm===bpm){metroStop();return;}
  metroStop();Metro.on=true;Metro.bpm=bpm;Metro.label=label||"";Metro.n=0;
  Metro.t=setInterval(()=>{Metro.n++;beep(Metro.n%4===1?1200:900,.04,.22);const el=$("#metro-dot");if(el){el.classList.remove("pulse");void el.offsetWidth;el.classList.add("pulse");}},60000/bpm);
  keepAwake(true);paintMetro();
}
function metroStop(){clearInterval(Metro.t);Metro.on=false;paintMetro();}
function paintMetro(){$$("[data-metro]").forEach(b=>{const on=Metro.on&&+b.dataset.metro===Metro.bpm;b.setAttribute("aria-pressed",on);});const bar=$("#metrobar");if(bar){bar.hidden=!Metro.on;bar.querySelector("b").textContent=`${Metro.bpm} bpm${Metro.label?" · "+Metro.label:""}`;}}
function metroFor(k){if(k==="rope")return [140,"corde"];if(["squat_goblet","back_squat","rdl","bulgarian","calf_ecc","wrist_ecc","step_down","lunge_back"].includes(k))return [60,"tempo : 1 bip par seconde"];return null;}

/* =====================================================================
   5. Santé : sommeil et FC du matin, hydratation
   ===================================================================== */
function hrBaseline(before){const v=Object.entries(data.checkins).filter(([d,c])=>d<before&&d>=addDays(before,-14)&&num(c.hr)).map(([,c])=>num(c.hr));return v.length>=3?avg(v):null;}
function sweatRate(){const s=Object.values(data.sweat).filter(x=>x.rate);return s.length?avg(s.map(x=>x.rate)):null;}

/* =====================================================================
   6. Repas de la semaine
   ===================================================================== */
const ING={avoine:["Flocons d'avoine","g"],skyr:["Skyr / fromage blanc 0 %","g"],banane:["Bananes","pc"],pain:["Pain complet","g"],oeuf:["Œufs","pc"],fruit:["Fruits de saison","pc"],poulet:["Blanc de poulet","g"],riz:["Riz basmati (cru)","g"],brocoli:["Brocolis","g"],huile:["Huile d'olive","g"],saumon:["Pavé de saumon","g"],pates:["Pâtes complètes (crues)","g"],epinard:["Épinards","g"],boeuf:["Bœuf haché 5 %","g"],patate:["Patates douces","g"],haricot:["Haricots verts","g"],dinde:["Escalope de dinde","g"],quinoa:["Quinoa (cru)","g"],courgette:["Courgettes","g"],pdt:["Pommes de terre","g"],salade:["Salade verte","g"],cabillaud:["Dos de cabillaud","g"],ratatouille:["Ratatouille","g"],lentille:["Lentilles corail (crues)","g"],tomate:["Tomates concassées","g"],whey:["Whey (protéine en poudre)","g"],amande:["Amandes","g"],lait:["Lait demi-écrémé","ml"],fromage:["Fromage râpé","g"]};
const MEALS={
 b1:{n:"Porridge skyr banane",i:{avoine:80,skyr:200,banane:1,lait:150}},
 b2:{n:"Tartines et œufs brouillés",i:{pain:100,oeuf:3,fruit:1}},
 s1:{n:"Skyr + fruit",i:{skyr:150,fruit:1}},
 s2:{n:"Shaker + amandes",i:{whey:30,amande:20,lait:250}},
 r1:{n:"Poulet, riz, brocolis",i:{poulet:180,riz:90,brocoli:200,huile:10}},
 r2:{n:"Saumon, pâtes complètes, épinards",i:{saumon:150,pates:90,epinard:150}},
 r3:{n:"Bœuf, patate douce, haricots verts",i:{boeuf:180,patate:250,haricot:200}},
 r4:{n:"Dinde, quinoa, courgettes",i:{dinde:180,quinoa:80,courgette:200,huile:10}},
 r5:{n:"Omelette 4 œufs, pommes de terre, salade",i:{oeuf:4,pdt:250,salade:100,fromage:20}},
 r6:{n:"Cabillaud, riz, ratatouille",i:{cabillaud:200,riz:90,ratatouille:250,huile:10}},
 r7:{n:"Chili lentilles et dinde, riz",i:{lentille:80,dinde:120,tomate:200,riz:60}}
};
const WEEK_MEALS=[["b1","r1","s1","r5"],["b2","r2","s2","r4"],["b1","r3","s1","r6"],["b2","r4","s2","r1"],["b1","r6","s1","r7"],["b2","r7","s2","r2"],["b1","r5","s1","r3"]];
function mealFactor(){return clamp(nutritionTargets().kcal/2600,0.75,1.3);}
function scaleQty(k,q,f){const u=ING[k][1];if(u==="pc")return Math.max(1,Math.round(q*(k==="oeuf"?1:1)));const protein=["poulet","saumon","boeuf","dinde","cabillaud","skyr","whey"].includes(k);return Math.round(q*(protein?Math.max(1,f*0.9+0.1):f)/5)*5;}
function shoppingList(){const f=mealFactor(),tot={};WEEK_MEALS.flat().forEach(m=>Object.entries(MEALS[m].i).forEach(([k,q])=>{tot[k]=(tot[k]||0)+scaleQty(k,q,f);}));return Object.entries(tot).map(([k,q])=>{const [n,u]=ING[k];return {k,n,txt:u==="pc"?`${q}`:u==="ml"?(q>=1000?fmt(q/1000,1)+" L":q+" ml"):(q>=1000?fmt(q/1000,2)+" kg":q+" g")};}).sort((a,b)=>a.n.localeCompare(b.n));}

/* =====================================================================
   7. Liens profonds (Siri, raccourcis, import Apple Santé)
   ===================================================================== */
function appBaseUrl(){return location.origin+location.pathname;}
function handleHash(){
  const h=decodeURIComponent((location.hash||"").slice(1));if(!h)return false;
  if(h.startsWith("partage="))return false;
  const [route,qs]=h.split("?"),q=new URLSearchParams(qs||"");
  let handled=true;
  if(route==="aujourdhui"){go("today");}
  else if(route==="confidentialite"||route==="mentions"){openLegal(route);}
  else if(route==="seance"){const ref=todayRef();if(ref){const p=planFor(ref.w,ref.d);if(p.kind!=="R")setTimeout(()=>openRunner(p.id),50);}else toast("Le programme n'a pas encore commencé");}
  else if(route==="mobilite"){go("more","mobilite");setTimeout(()=>{const b=$('[data-timer="mobroutine"]');b&&b.click();},80);}
  else if(route==="respiration"){go("more","outils");setTimeout(()=>{const b=$('[data-timer="rt-breath"]');b&&b.click();},80);}
  else if(route==="import"||route==="poids"){
    const d=q.get("date")||todayIso(),out=[];
    const kg=num(q.get("poids")||(route==="poids"?qs:null));if(kg&&kg>30&&kg<250){const id=uid();data.weights[id]={id,date:d,kg:Math.round(kg*10)/10};out.push(fmt(kg)+" kg");}
    const hr=num(q.get("fc")),sl=num(q.get("sommeil"));
    if(hr||sl){const c=data.checkins[d]||{date:d};if(hr&&hr>25&&hr<130){c.hr=Math.round(hr);out.push(Math.round(hr)+" bpm");}if(sl&&sl>0&&sl<16){c.sleepH=Math.round(sl*10)/10;out.push(fmt(sl)+" h de sommeil");}data.checkins[d]=c;}
    lsSave();toast(out.length?"Importé : "+out.join(", "):"Rien à importer",!out.length);go("today");
  }else handled=false;
  try{history.replaceState(null,"",location.pathname);}catch(e){}
  return handled;
}

/* =====================================================================
   8. Notifications (push via le serveur du compte)
   ===================================================================== */
function notifPrefs(){return {...{session:true,mobility:true,eve:true,deadline:true,weekly:true},...(S_().notif||{})};}
function buildNotifQueue(){
  const Q=[],pr=notifPrefs(),t=todayIso(),times=S_().times,now=Date.now();
  const at=(ds,hm)=>{const [h,m]=(hm||"08:00").split(":").map(Number);const d=parse(ds);d.setHours(h,m,0,0);return d;};
  for(let i=0;i<14;i++){const ds=addDays(t,i),w=weekOfDate(ds);if(w<1)continue;const d=dayKeyOf(ds),p=planFor(w,d),tm=at(ds,times[d]);
    if(pr.session&&PLANNED_KINDS.includes(p.kind)&&!(data.logs[p.id]||{}).done){const a=new Date(tm.getTime()-30*60000);if(a.getTime()>now)Q.push({id:`s-${ds}`,at:a.toISOString(),title:"Séance dans 30 min",body:p.title+" · ≈ "+p.dur+" min"});}
    if(pr.mobility&&!data.mobilite[ds]){const a=at(ds,S_().mobTime);if(a.getTime()>now)Q.push({id:`m-${ds}`,at:a.toISOString(),title:"Mobilité du jour",body:"12 minutes de routine guidée"});}
    const nx=planFor(...(()=>{const n=addDays(ds,1),ww=weekOfDate(n);return [Math.max(1,ww),dayKeyOf(n)];})());
    if(pr.eve&&nx.kind==="M"&&!nx.title.includes("suite")&&p.kind!=="M"){const a=at(ds,"19:30");if(a.getTime()>now)Q.push({id:`e-${ds}`,at:a.toISOString(),title:"Tournoi demain",body:"Prépare ton sac et couche-toi tôt"});}
    if(pr.weekly&&d==="dim"){const a=at(ds,"19:00");if(a.getTime()>now)Q.push({id:`w-${ds}`,at:a.toISOString(),title:"Ta semaine "+w+" est terminée",body:"Fais le point sur tes séances et indique tes jours de padel pour la semaine prochaine."});}
  }
  if(pr.deadline)upcomingEvents().forEach(e=>{if(e.deadline&&!e.registered){[3,1].forEach(k=>{const a=at(addDays(e.deadline,-k),"10:00");if(a.getTime()>now)Q.push({id:`d-${e.id}-${k}`,at:a.toISOString(),title:"Inscription à faire",body:`${e.cat} ${e.lieu||""} : clôture le ${fr(e.deadline)}`});});}});
  return Q.sort((a,b)=>a.at.localeCompare(b.at));
}
async function enablePush(){
  const c=Sync.cfg();
  if(!Sync.connected()){toast("Connecte-toi d'abord à ton compte",true);return;}
  if(!("serviceWorker" in navigator)||!("PushManager" in window)){toast("Sur iPhone : ouvre l'app depuis l'icône de l'écran d'accueil (iOS 16.4 ou plus)",true);return;}
  try{
    const perm=await Notification.requestPermission();if(perm!=="granted"){toast("Notifications refusées",true);return;}
    const r=await fetch(Sync.base()+"/functions/v1/padel-push?action=key",{headers:{apikey:c.key,Authorization:"Bearer "+c.key}});
    const j=await r.json().catch(()=>({}));
    if(!j.publicKey){const m=j.error||j.message||j.msg||"";
      if(r.status===404)throw new Error("la fonction padel-push n'est pas installée sur le serveur (erreur 404)");
      if(r.status===401||r.status===403)throw new Error("accès refusé à la fonction padel-push (erreur "+r.status+(m?" : "+m:"")+")");
      throw new Error("fonction padel-push : erreur "+r.status+(m?" : "+m:""));}
    const reg=await navigator.serviceWorker.ready;
    const pad="=".repeat((4-j.publicKey.length%4)%4),raw=atob((j.publicKey+pad).replace(/-/g,"+").replace(/_/g,"/")),key=new Uint8Array([...raw].map(ch=>ch.charCodeAt(0)));
    const sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:key});
    data.pushSub.main=sub.toJSON();data.notif.main={queue:buildNotifQueue(),updated:Date.now()};lsSave();renderApp({force:true});toast("Notifications activées");
  }catch(e){toast("Échec : "+e.message,true);}
}
async function disablePush(){try{const reg=await navigator.serviceWorker.ready,s=await reg.pushManager.getSubscription();if(s)await s.unsubscribe();}catch(e){}delete data.pushSub.main;lsSave();renderApp({force:true});toast("Notifications désactivées");}
let _nq=null;function scheduleNotifQueue(){if(!data.pushSub.main)return;clearTimeout(_nq);_nq=setTimeout(()=>{const q=buildNotifQueue(),old=JSON.stringify((data.notif.main||{}).queue||[]);if(JSON.stringify(q)!==old){data.notif.main={queue:q,updated:Date.now()};lsSave();}},1500);}

/* =====================================================================
   9. Partage avec un coach (lecture seule)
   ===================================================================== */
let READONLY=false;
async function createShare(){
  const c=Sync.cfg();if(!Sync.connected()){toast("Connecte-toi d'abord à ton compte",true);return;}
  const token=Array.from(crypto.getRandomValues(new Uint8Array(18))).map(b=>b.toString(36).padStart(2,"0")).join("").slice(0,28);
  try{await Sync.push();const tk=await Sync.token();
    const r=await fetch(Sync.base()+"/rest/v1/padel_share",{method:"POST",headers:{apikey:c.key,Authorization:"Bearer "+tk,"Content-Type":"application/json",Prefer:"return=minimal"},body:JSON.stringify({token})});
    if(!r.ok)throw new Error("Erreur "+r.status+" ");
    data.share.main={token,created:todayIso()};lsSave();renderApp({force:true});toast("Lien de partage créé");}
  catch(e){toast("Échec : "+e.message,true);}
}
async function revokeShare(){
  const c=Sync.cfg(),s=data.share.main;if(!s)return;
  try{const tk=await Sync.token();await fetch(Sync.base()+"/rest/v1/padel_share?token=eq."+encodeURIComponent(s.token),{method:"DELETE",headers:{apikey:c.key,Authorization:"Bearer "+tk}});}catch(e){}
  delete data.share.main;lsSave();renderApp({force:true});toast("Lien désactivé");
}
function shareLink(){const s=data.share.main,c=Sync.cfg();if(!s)return "";return appBaseUrl()+"#partage="+s.token+"&s="+encodeURIComponent(Sync.base())+"&k="+encodeURIComponent(c.key);}
async function loadSharedView(){
  const h=(location.hash||"").slice(1);if(!h.startsWith("partage="))return false;
  const q=new URLSearchParams(h),token=q.get("partage"),url=q.get("s"),key=q.get("k");
  READONLY=true;document.body.classList.add("readonly");
  try{const r=await fetch(url.replace(/\/+$/,"")+"/rest/v1/rpc/padel_shared",{method:"POST",headers:{apikey:key,Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({p_token:token})});
    const d=await r.json();if(!r.ok||!d)throw new Error("lien invalide ou désactivé");
    COLLS.forEach(c=>{data[c]=d[c]&&typeof d[c]==="object"?d[c]:{};});normalize();
    $("#robar").hidden=false;return true;}
  catch(e){$("#robar").hidden=false;$("#robar").textContent="Ce lien de partage n'est plus valide.";return true;}
}

/* =====================================================================
   10. Export tableur (CSV)
   ===================================================================== */
function csvOf(rows){const esc2=v=>{v=v==null?"":String(v);return /[;"\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v;};return "﻿"+rows.map(r=>r.map(esc2).join(";")).join("\r\n");}
function exportCsv(kind){
  let rows=[];
  if(kind==="seances"){rows=[["Date","Semaine","Jour","Séance","Type","Faite","Durée (min)","RPE","Charge (UA)","Notes"]];Object.values(data.logs).filter(l=>l&&l.date).sort((a,b)=>a.date.localeCompare(b.date)).forEach(l=>{const p=planFor(l.week,l.day);rows.push([l.date,l.week,l.day,p.title,KIND_LABEL[p.kind],l.done?"oui":"non",l.duree,l.rpe,(+l.duree||0)*(+l.rpe||0),l.note]);});}
  if(kind==="series"){rows=[["Date","Exercice","Série","kg","Répétitions / s"]];Object.values(data.logs).filter(l=>l&&l.sets).sort((a,b)=>(a.date||"").localeCompare(b.date||"")).forEach(l=>Object.values(l.sets).forEach(e=>(e.s||[]).forEach((x,j)=>{if(x&&(x.kg||x.reps))rows.push([l.date,exName(e.k),j+1,x.kg,x.reps]);})));}
  if(kind==="poids"){rows=[["Date","Poids (kg)","Tour de taille (cm)"]];sortedWeights().forEach(x=>rows.push([x.date,x.kg,x.taille]));}
  if(kind==="tests"){rows=[["Date",...TESTS.map(t=>t.name+" ("+t.u+")")]];Object.values(data.tests).sort((a,b)=>a.date.localeCompare(b.date)).forEach(r=>rows.push([r.date,...TESTS.map(t=>r[t.k])]));}
  if(kind==="tournois"){rows=[["Date","Catégorie","Lieu","Partenaire","Tour","Victoires","Matchs","Points FFT","Classement","Forme","Fin de match","Notes"]];Object.values(data.tournois).sort((a,b)=>a.date.localeCompare(b.date)).forEach(t=>rows.push([t.date,t.cat,t.lieu,t.partner,t.res,t.victoires,t.matchs,t.pts,t.rank,t.physique,t.fin,t.note]));}
  if(kind==="forme"){rows=[["Date","Score /100","Sommeil (1-5)","Courbatures","Fatigue","Motivation","Heures de sommeil","FC réveil"]];Object.entries(data.checkins).sort().forEach(([d,c])=>rows.push([d,checkinScore(c),c.sleep,c.sore,c.fatigue,c.motiv,c.sleepH,c.hr]));}
  shareFile(new Blob([csvOf(rows)],{type:"text/csv"}),`padel-${kind}-${todayIso()}.csv`,"Export "+kind);
}

/* =====================================================================
   11. Matériel
   ===================================================================== */
const GEAR_TYPES={raquette:["Raquette",300],chaussures:["Chaussures",150],surgrip:["Surgrip",10],grip:["Grip",60],balles:["Balles",6],autre:["Autre",100]};
function playHoursSince(ds){let h=0;Object.values(data.logs).forEach(l=>{if(!l||!l.done||!l.date||l.date<ds)return;const p=planFor(l.week,l.day);if(p.kind==="P"||p.kind==="M")h+=(+l.duree||0)/60;});return h;}
function gearAlerts(){return Object.values(data.gear).filter(g=>g&&g.since).map(g=>({g,h:playHoursSince(g.since),lim:+g.limit||GEAR_TYPES[g.type][1]})).filter(x=>x.h>=x.lim);}

/* =====================================================================
   12. Écrans supplémentaires
   ===================================================================== */
MORE.splice(3,0,["calendrier-tournois","Tournois à venir","Inscriptions, objectifs, affûtage"],["adversaires","Adversaires","Carnet des paires rencontrées"]);
MORE.splice(9,0,["renfo","Renforcement ciblé","Épaule, coude, dos, genou…"],["mental","Mental","Routines, visualisation, confiance"],["repas","Repas de la semaine","Menus et liste de courses"],["materiel","Matériel","Raquette, chaussures, grips"],["videos","Vidéos de match","Liens et notes minutées"],["outils","Outils","Métronome, respiration, hydratation"],["reprise","Reprise après coupure","Vacances, maladie, blessure"],["raccourcis","Raccourcis Siri",cloudOn()?"Commandes vocales, Apple Santé":"Commandes vocales et raccourcis"]);
const ROUNDS_ALL=["Poules","1/16","1/8","1/4","1/2","Finale","Vainqueur"];

SUBS["calendrier-tournois"]=()=>{
  const up=upcomingEvents(),past=Object.values(data.events).filter(e=>(e.end||e.date)<todayIso()).sort((a,b)=>b.date.localeCompare(a.date));
  const row=e=>{const n=daysBetween(todayIso(),e.date),dl=e.deadline?daysBetween(todayIso(),e.deadline):null;
    return `<div class="evrow ${e.goal?"goal":""}"><div><b>${fr(e.date)}${e.end&&e.end!==e.date?" → "+fr(e.end):""} · ${esc(e.cat)} ${esc(e.lieu||"")}</b>${e.goal?` <span class="tag" style="color:var(--b3)">Objectif</span>`:""}
     <div class="muted small">${n>0?`dans ${plural(n,"jour")}`:n===0?"aujourd'hui":"en cours"}${e.deadline?` · inscription avant le ${fr(e.deadline)}${!e.registered&&dl!=null&&dl>=0?` (${plural(dl,"jour")})`:""}`:""}${e.note?" · "+esc(e.note):""}</div></div>
     <div class="actions"><button class="chip-btn" type="button" data-evreg="${e.id}" aria-pressed="${!!e.registered}">${e.registered?"✓ Inscrit":"Inscrit ?"}</button><button class="chip-btn" type="button" data-evgoal="${e.id}" aria-pressed="${!!e.goal}">Objectif</button><button class="del" type="button" data-del="events:${e.id}">supprimer</button></div></div>`;};
  return `<section class="card stack"><div><div class="eyebrow">Ton calendrier de compétition</div><h2>Tournois à venir</h2></div>
   <p class="small">Chaque tournoi ajouté se reporte dans ta semaine et le programme s'adapte autour. Marque tes tournois importants comme <b>objectif</b> : les 10 jours d'avant passent en affûtage pour arriver au top.</p>
   <form class="stack" data-evadd="1"><div class="form-row"><label>Début<input type="date" name="date" required></label><label>Fin (si plusieurs jours)<input type="date" name="end"></label>
     <label>Catégorie<select name="cat">${LEVELS.map(c=>`<option ${c===(S_().level||"P250")?"selected":""}>${c}</option>`).join("")}</select></label><label>Club / lieu<input name="lieu"></label></div>
    <div class="form-row"><label>Clôture des inscriptions<input type="date" name="deadline"></label><label>Note<input name="note" placeholder="partenaire, horaires…"></label><label class="check"><input type="checkbox" name="goal"> Tournoi objectif</label><label class="check"><input type="checkbox" name="registered"> Déjà inscrit</label></div>
    <div><button class="btn" type="submit">Ajouter</button></div></form></section>
  <section class="card stack"><h3>À venir</h3>${up.length?up.map(row).join(""):`<div class="empty">Aucun tournoi prévu.</div>`}</section>
  ${past.length?`<section class="card stack"><h3>Passés</h3>${past.slice(0,10).map(row).join("")}<p class="muted small">Pense à enregistrer tes résultats dans « Tournois ».</p></section>`:""}`;
};
function oppRecord(name){const n=(name||"").trim().toLowerCase();let v=0,d=0;const hist=[];Object.values(data.tournois).forEach(t=>(t.matches||[]).forEach(m=>{if(m.o&&m.o.trim().toLowerCase()===n){m.r==="V"?v++:d++;hist.push({date:t.date,cat:t.cat,s:m.s,r:m.r});}}));return {v,d,hist:hist.sort((a,b)=>b.date.localeCompare(a.date))};}
SUBS.adversaires=()=>{
  const list=Object.values(data.opps).sort((a,b)=>a.name.localeCompare(b.name));
  const unknown=new Set();Object.values(data.tournois).forEach(t=>(t.matches||[]).forEach(m=>{if(m.o&&!list.some(o=>o.name.toLowerCase()===m.o.trim().toLowerCase()))unknown.add(m.o.trim());}));
  return `<section class="card stack"><div><div class="eyebrow">Paires rencontrées</div><h2>Carnet des adversaires</h2></div>
   <p class="small">Note ce que tu remarques sur chaque paire. Si tu écris le même nom dans les matchs de tes tournois, l'historique des confrontations se remplit tout seul.</p>
   <form class="stack" data-oppadd="1"><div class="form-row"><label>Nom de la paire<input name="name" required placeholder="ex. Martin / Durand"></label><label>Club<input name="club"></label></div>
    <label>Points forts<input name="forts" placeholder="ex. gaucher très bon au smash, lobs précis"></label><label>Points faibles<input name="faibles" placeholder="ex. revers du droitier, fragile sur balles basses"></label><label>Plan de jeu<textarea name="plan" rows="2"></textarea></label><div><button class="btn" type="submit">Ajouter</button></div></form></section>
  ${list.map(o=>{const r=oppRecord(o.name);return `<section class="card stack"><div class="sess-head"><div><h3>${esc(o.name)}</h3><div class="muted small">${esc(o.club||"")}</div></div><span class="kchip">${r.v} V · ${r.d} D</span></div>
   ${o.forts?`<p class="small"><b>Forts :</b> ${esc(o.forts)}</p>`:""}${o.faibles?`<p class="small"><b>Faibles :</b> ${esc(o.faibles)}</p>`:""}${o.plan?`<p class="small"><b>Plan :</b> ${esc(o.plan)}</p>`:""}
   ${r.hist.length?`<div class="muted small">${r.hist.map(h=>`${fr(h.date)} ${esc(h.cat)} : ${h.r} ${esc(h.s)}`).join(" · ")}</div>`:""}<div><button class="del" data-del="opps:${o.id}">supprimer</button></div></section>`;}).join("")}
  ${unknown.size?`<section class="card"><p class="muted small">Paires citées dans tes matchs mais pas encore dans le carnet : ${[...unknown].map(esc).join(", ")}.</p></section>`:""}`;
};
SUBS.renfo=()=>{
  const since=addDays(todayIso(),-30),zones={};Object.values(data.pains).filter(p=>p.date>=since).forEach(p=>{const z=zoneToRehab(p.zone);if(z)zones[z]=(zones[z]||0)+1;});
  return `<section class="card stack"><div><div class="eyebrow">Programmes de renforcement</div><h2>Renforcement ciblé</h2></div>
   <p class="small">Active un programme : ses exercices s'ajoutent automatiquement à tes séances du lundi, du mercredi et du vendredi (≈ 12 min). Continue 4 à 6 semaines après la disparition de la douleur. Ce sont des exercices de prévention classiques : si la douleur dépasse 5/10, dure plus de 2 semaines ou te réveille la nuit, consulte un médecin ou un kiné.</p></section>
  ${Object.entries(REHAB).map(([k,r])=>{const on=!!(data.rehab[k]&&data.rehab[k].active);return `<section class="card stack ${on?"on-card":""}"><div class="sess-head"><div><h3>${esc(r.name)}</h3>${zones[k]?`<div class="small" style="color:var(--bad)">Douleur signalée ${zones[k]} fois ces 30 derniers jours</div>`:""}${on?`<div class="muted small">Actif depuis le ${fr(data.rehab[k].since)}</div>`:""}</div><button class="${on?"btn ghost small":"btn small"}" type="button" data-rehab="${k}">${on?"Désactiver":"Activer"}</button></div>
   <ol class="mini">${r.items.map(it=>`<li><span>${esc(exName(it[0]))}</span><span class="rx">${esc(rx(it[1],it[2]))}</span></li>`).join("")}</ol>
   <details data-k="rh-${k}"><summary>Voir les exercices</summary>${r.items.map(it=>`<div class="rhx"><h4>${esc(exName(it[0]))}</h4>${exDetail(it[0],{history:false})}</div>`).join("")}</details></section>`;}).join("")}`;
};
SUBS.mental=()=>{
  const t=todayIso(),cl=data.mental["cl-"+t]||{},CL=["Un seul objectif de jeu choisi","Un plan contre cette paire","Respiration guidée faite","Mot-clé de confiance choisi","Échauffement complet fait","Routine entre les points en tête"];
  const jr=Object.values(data.mental).filter(x=>x&&x.kind==="journal").sort((a,b)=>b.date.localeCompare(a.date));
  return `<section class="card stack"><div><div class="eyebrow">Entre chaque point</div><h2>La routine des 4 R</h2></div>
   <ol class="steps"><li><span><b>Réagir</b> : accepte le point, bon ou mauvais. Un geste neutre, pas de jugement.</span></li><li><span><b>Relâcher</b> : une grande expiration, épaules basses, desserre la main sur le grip.</span></li><li><span><b>Recentrer</b> : regarde ton cordage ou la vitre, dis ton mot-clé.</span></li><li><span><b>Rituel</b> : un échange rapide avec ton partenaire (plan du point suivant), puis split-step.</span></li></ol></section>
  <section class="card stack"><div><div class="eyebrow">Avant le match</div><h2>Préparation</h2></div>
   <div class="actions">${timerBtn("rt-visu",{label:"Visualisation guidée · 7 min",ph:ROUTINES.visu.ph()},"btn")}${timerBtn("rt-breath2",{label:"Respiration · 5 min",ph:ROUTINES.breath.ph()},"btn ghost")}</div>${timerSlot("rt-visu")}${timerSlot("rt-breath2")}
   <div class="eyebrow">Checklist mentale du jour</div><div class="bag">${CL.map((x,i)=>`<div class="bagrow"><label class="check"><input type="checkbox" data-mcl="${i}" ${cl[i]?"checked":""}> ${esc(x)}</label></div>`).join("")}</div></section>
  <section class="card stack"><div><div class="eyebrow">Après un match ou un tournoi</div><h2>Journal de confiance</h2></div>
   <form class="stack" data-mjournal="1"><div class="form-row"><label>Date<input type="date" name="date" value="${t}"></label><label>Confiance (1–10)<select name="conf">${Array.from({length:10},(_,i)=>`<option ${i===6?"selected":""}>${i+1}</option>`).join("")}</select></label></div>
    <label>Ce qui a marché<textarea name="good" rows="2"></textarea></label><label>Ce que je travaille ensuite<textarea name="next" rows="2"></textarea></label><div><button class="btn" type="submit">Enregistrer</button></div></form>
   ${lineChart([{pts:jr.slice().reverse().map(x=>({x:x.date,y:+x.conf})),color:"var(--b2)",area:true}],{unit:"/10",empty:"Ta courbe de confiance apparaîtra ici.",dec:0,h:190})}
   ${jr.slice(0,8).map(x=>`<div class="techitem"><div class="sess-head"><b>${fr(x.date)} · confiance ${x.conf}/10</b><button class="del" data-del="mental:${x.id}">supprimer</button></div>${x.good?`<div class="small">✓ ${esc(x.good)}</div>`:""}${x.next?`<div class="small muted">→ ${esc(x.next)}</div>`:""}</div>`).join("")}</section>`;
};
SUBS.repas=()=>{
  const f=mealFactor(),T=nutritionTargets(),DN=["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"],wk=curWeek(),ck=(data.meals.main&&data.meals.main.week===wk?data.meals.main.checked:{})||{};
  const qty=(k,q)=>{const u=ING[k][1],v=scaleQty(k,q,f);return u==="pc"?(k==="oeuf"?v+(v>1?" œufs":" œuf"):v+" "+(v>1?ING[k][0].toLowerCase():({banane:"banane",fruit:"fruit de saison"}[k]||ING[k][0].toLowerCase()))):u==="ml"?v+" ml de "+ING[k][0].toLowerCase():v+" g de "+ING[k][0].toLowerCase();};
  return `<section class="card stack"><div><div class="eyebrow">Adapté à ${T.kcal} kcal et ${T.prot} g de protéines par jour</div><h2>Repas de la semaine</h2></div>
   <p class="muted small">Menu type indicatif, quantités ajustées à tes besoins. Échange librement les repas entre les jours. Les jours de tournoi, suis plutôt les conseils de l'onglet Nutrition.</p></section>
  ${WEEK_MEALS.map((day,i)=>`<section class="card stack"><h3>${DN[i]}</h3>${day.map((m,j)=>`<div class="meal"><span class="eyebrow">${["Petit-déjeuner","Déjeuner","Collation","Dîner"][j]}</span><b>${esc(MEALS[m].n)}</b><div class="muted small">${Object.entries(MEALS[m].i).map(([k,q])=>esc(qty(k,q))).join(" · ")}</div></div>`).join("")}</section>`).join("")}
  <section class="card stack"><div class="sess-head"><div><div class="eyebrow">Pour 7 jours</div><h2>Liste de courses</h2></div><button class="chip-btn" type="button" data-shopshare="1">Partager la liste</button></div>
   <div class="bag">${shoppingList().map(x=>`<div class="bagrow"><label class="check"><input type="checkbox" data-shop="${x.k}" ${ck[x.k]?"checked":""}> ${esc(x.n)}</label><span class="num small">${esc(x.txt)}</span></div>`).join("")}</div>
   <p class="muted small">+ assaisonnements, épices, citron, herbes, légumes en plus à volonté.</p></section>`;
};
SUBS.materiel=()=>{
  const list=Object.values(data.gear).sort((a,b)=>a.type.localeCompare(b.type));
  return `<section class="card stack"><div><div class="eyebrow">Heures de jeu comptées automatiquement</div><h2>Matériel</h2></div>
   <p class="small">Les heures de padel (entraînements et tournois enregistrés) sont additionnées depuis la date de mise en service. Tu es prévenu quand il est temps de changer.</p>
   <form class="form-row" data-gearadd="1"><label>Type<select name="type">${Object.entries(GEAR_TYPES).map(([k,[n,h]])=>`<option value="${k}">${n} (≈ ${h} h)</option>`).join("")}</select></label><label>Modèle<input name="name" placeholder="ex. Bullpadel Vertex"></label><label>En service depuis<input type="date" name="since" value="${todayIso()}"></label><label>Durée de vie (h, facultatif)<input type="number" inputmode="numeric" name="limit"></label><button class="btn" type="submit">Ajouter</button></form></section>
  ${list.length?`<section class="card stack">${list.map(g=>{const h=playHoursSince(g.since),lim=+g.limit||GEAR_TYPES[g.type][1],pct=clamp(Math.round(h/lim*100),0,100);return `<div class="goal"><div class="sess-head"><div><b>${esc(GEAR_TYPES[g.type][0])}${g.name?" · "+esc(g.name):""}</b><div class="muted small">Depuis le ${fr(g.since)} · ${fmt(h,1)} h sur ≈ ${lim} h</div></div><div class="actions"><button class="chip-btn" type="button" data-gearnew="${g.id}">Remplacé aujourd'hui</button><button class="del" data-del="gear:${g.id}">supprimer</button></div></div><div class="gbar ${pct>=100?"full":""}"><span style="width:${pct}%"></span></div>${pct>=100?`<div class="small" style="color:var(--bad)">À remplacer</div>`:""}</div>`;}).join("")}</section>`:`<section class="card"><div class="empty">Ajoute ta raquette, tes chaussures et ton surgrip.</div></section>`}`;
};
function ytAt(url,t){const m=String(t||"").match(/^(\d+):(\d{2})(?::(\d{2}))?$/);if(!m)return url;const s=m[3]?(+m[1])*3600+(+m[2])*60+(+m[3]):(+m[1])*60+(+m[2]);if(/youtu\.?be/.test(url))return url+(url.includes("?")?"&":"?")+"t="+s+"s";return url+"#t="+s;}
SUBS.videos=()=>{
  const list=Object.values(data.videos).sort((a,b)=>b.date.localeCompare(a.date));
  return `<section class="card stack"><div><div class="eyebrow">YouTube, Google Drive, iCloud…</div><h2>Vidéos de match</h2></div>
   <form class="form-row" data-vidadd="1"><label>Lien de la vidéo<input name="url" type="url" required placeholder="https://…"></label><label>Titre<input name="title" placeholder="ex. 1/4 de finale P250"></label><label>Date<input type="date" name="date" value="${todayIso()}"></label><button class="btn" type="submit">Ajouter</button></form></section>
  ${list.map(v=>`<section class="card stack"><div class="sess-head"><div><h3>${esc(v.title||"Vidéo")}</h3><div class="muted small">${fr(v.date)}</div></div><div class="actions"><a class="chip-btn" href="${esc(v.url)}" target="_blank" rel="noopener">Ouvrir ↗</a><button class="del" data-del="videos:${v.id}">supprimer</button></div></div>
   ${(v.notes||[]).map((n,i)=>`<div class="vnote"><a href="${esc(ytAt(v.url,n.t))}" target="_blank" rel="noopener" class="num">${esc(n.t)}</a><span>${esc(n.txt)}</span><button class="del" type="button" data-vnotedel="${v.id}|${i}">×</button></div>`).join("")}
   <form class="inline" data-vnote="${v.id}"><input name="t" placeholder="12:30" style="max-width:80px"><input name="txt" placeholder="ex. bandeja trop courte, bien vu la sortie de vitre"><button class="btn small" type="submit">Noter</button></form></section>`).join("")||`<section class="card"><div class="empty">Ajoute le lien d'une vidéo de match, puis des notes minutées. Sur YouTube, chaque note ouvre la vidéo au bon moment.</div></section>`}`;
};
SUBS.outils=()=>{
  const sw=Object.values(data.sweat).sort((a,b)=>b.date.localeCompare(a.date)),rate=sweatRate();
  return `<section class="card stack"><div><div class="eyebrow">Tempo et rythme</div><h2>Métronome</h2></div>
   <div class="actions">${[[60,"Tempo 1 s"],[90,"90"],[120,"120"],[140,"Corde 140"],[160,"Corde rapide 160"]].map(([b,l])=>`<button class="chip-btn" type="button" data-metro="${b}" aria-pressed="${Metro.on&&Metro.bpm===b}">${l}</button>`).join("")}</div>
   <p class="muted small">60 bpm = 1 bip par seconde : compte 3 bips pour une descente en 3 secondes. Accent toutes les 4 mesures.</p></section>
  <section class="card stack"><div><div class="eyebrow">Avant un match ou quand le stress monte</div><h2>Respiration guidée</h2></div><div>${timerBtn("rt-breath",{label:"Respiration · 5 min",ph:ROUTINES.breath.ph()},"btn")}</div>${timerSlot("rt-breath")}<p class="muted small">Inspire 5 s, expire 5 s pendant 5 minutes (cohérence cardiaque). Calme le rythme cardiaque et la tension musculaire.</p></section>
  <section class="card stack"><div><div class="eyebrow">Pèse-toi avant et après un match</div><h2>Hydratation</h2></div>
   <form class="stack" data-sweat="1"><div class="form-row"><label>Poids avant (kg)<input type="number" step="0.1" inputmode="decimal" name="before" required></label><label>Poids après (kg)<input type="number" step="0.1" inputmode="decimal" name="after" required></label><label>Eau bue pendant (L)<input type="number" step="0.1" inputmode="decimal" name="drunk" value="0"></label><label>Durée (min)<input type="number" inputmode="numeric" name="dur" value="90"></label></div><div><button class="btn" type="submit">Calculer</button></div></form>
   ${sw.length?`<div class="alert"><b>Dernier match :</b> perte de ${fmt(sw[0].loss,2)} L de sueur (${fmt(sw[0].rate,2)} L/h). À boire après : <b>${fmt(sw[0].toDrink,1)} L</b> dans les 2 à 4 h (avec des électrolytes).</div>`:""}
   ${rate?`<p class="small">Ton taux moyen : <b>${fmt(rate,2)} L/h</b>. Pendant un match de 1 h 30, vise environ <b>${fmt(Math.min(rate*1.5*0.8,1.8),1)} L</b> (quelques gorgées à chaque changement de côté).</p>`:`<p class="muted small">Règle : chaque kilo perdu = environ 1,5 L à reboire.</p>`}
   ${sw.length?`<details><summary>Historique</summary>${sw.map(x=>`<div class="bagrow"><span>${fr(x.date)} · ${fmt(x.loss,2)} L en ${x.dur} min</span><button class="del" data-del="sweat:${x.id}">supprimer</button></div>`).join("")}</details>`:""}</section>`;
};
SUBS.reprise=()=>{
  const r=data.resume.main,active=r&&todayIso()<r.until;
  return `<section class="card stack"><div><div class="eyebrow">Vacances, maladie, blessure</div><h2>Reprise après une coupure</h2></div>
   <p class="small">Après une coupure, reprendre directement au niveau d'avant expose aux blessures. Indique la durée de ton arrêt : les séances de force et les finishers passent automatiquement en version de reprise (charges −20 %, effort 6–7/10, pas de sauts maximaux) pendant 1 semaine, ou 2 semaines si l'arrêt a duré 3 semaines ou plus.</p>
   ${active?`<div class="alert"><b>Reprise en cours</b> jusqu'au ${fr(addDays(r.until,-1))} (après ${r.days} jours d'arrêt). <button class="linkbtn" data-resumeend="1">Terminer la reprise</button></div>`:""}
   <form class="form-row" data-resume="1"><label>Nombre de jours d'arrêt<input type="number" inputmode="numeric" name="days" min="3" required></label><label>Je reprends le<input type="date" name="from" value="${todayIso()}"></label><div style="grid-column:1/-1"><button class="btn" type="submit">Lancer la reprise</button></div></form>
   <p class="muted small">Si l'arrêt vient d'une blessure, attends l'accord d'un professionnel de santé avant de reprendre.</p></section>`;
};
SUBS.raccourcis=()=>{
  const B=appBaseUrl(),L=[["Ouvrir Aujourd'hui","#aujourdhui"],["Démarrer ma séance","#seance"],["Lancer la mobilité","#mobilite"],["Respiration guidée","#respiration"],["Ajouter mon poids (exemple 88,4 kg)","#poids?poids=88.4"]];
  return `<section class="card stack"><div><div class="eyebrow">« Dis Siri, démarre ma séance »</div><h2>Raccourcis Siri</h2></div>
   <ol class="steps"><li><span>Ouvre l'app <b>Raccourcis</b> sur l'iPhone, touche <b>+</b>.</span></li><li><span>Ajoute l'action <b>Ouvrir les URL</b> et colle une des adresses ci-dessous.</span></li><li><span>Nomme le raccourci (ex. « Démarre ma séance ») : Siri le lancera à la voix. Tu peux aussi l'ajouter à l'écran d'accueil ou au bouton Action.</span></li></ol>
   ${L.map(([l,h])=>`<div class="linkrow"><div><b>${esc(l)}</b><div class="muted small mono">${esc(B+h)}</div></div><button class="chip-btn" type="button" data-copy="${esc(B+h)}">Copier</button></div>`).join("")}
   <div class="alert warn small">iOS ouvre ces liens dans Safari et non dans l'app installée, qui a son propre stockage. ${cloudOn()?"Connecte-toi à ton compte (Réglages) dans les deux : ce que tu fais depuis un raccourci se retrouve alors dans l'app.":"Les raccourcis « Démarrer ma séance » et « Mobilité » fonctionnent très bien dans Safari ; pour enregistrer des données, ouvre plutôt l'app."}</div></section>
  ${cloudOn()?`<section class="card stack"><div><div class="eyebrow">Poids, FC au réveil, sommeil</div><h2>Import depuis Apple Santé</h2></div>
   <p class="small">Un raccourci peut lire tes données Santé et les envoyer à l'app, sans ressaisie. Nécessite d'être connecté à ton compte.</p>
   <ol class="steps"><li><span>Nouveau raccourci. Ajoute <b>Rechercher des échantillons de santé</b> : type <b>Poids</b>, trier par date de début (le plus récent d'abord), limite 1.</span></li>
    <li><span>Ajoute à nouveau <b>Rechercher des échantillons de santé</b> : <b>Fréquence cardiaque au repos</b>, le plus récent, limite 1.</span></li>
    <li><span>Encore une fois : <b>Analyse du sommeil</b> des dernières 24 h (valeur « Endormi »), puis <b>Calculer les statistiques</b> → Somme, et convertis en heures.</span></li>
    <li><span>Ajoute <b>Texte</b> avec : <span class="mono small">${esc(B)}#import?poids=[Poids]&fc=[FC]&sommeil=[Sommeil]</span> en insérant les variables des étapes précédentes (valeurs numériques).</span></li>
    <li><span>Ajoute <b>Ouvrir les URL</b> avec ce texte. Dans l'onglet Automatisation, déclenche-le chaque matin à 8 h.</span></li></ol>
   <p class="muted small">La FC au réveil et le sommeil affinent ta note de forme du matin.</p></section>`:""}`;
};

/* Réglages : blocs ajoutés (notifications, partage coach, CSV) */
function settingsExtra(){
  const con=Sync.connected(),sub=data.pushSub.main,pr=notifPrefs(),sh=data.share.main;
  return `${cloudOn()?`<section class="card stack"><div><div class="eyebrow">Nécessite un compte et l'app installée sur l'écran d'accueil</div><h2>Notifications</h2></div>
   <p class="small">Rappels de séance, de mobilité, de tournoi et d'inscription. Sur iPhone : iOS 16.4 ou plus, depuis l'icône de l'écran d'accueil uniquement.</p>
   <div class="actions">${sub?`<span class="okline">✓ Activées sur cet appareil</span><button class="btn ghost small" type="button" data-push="off">Désactiver</button>`:`<button class="btn" type="button" data-push="on" ${con?"":"disabled"}>Activer les notifications</button>`}</div>
   <div class="nq">${[["session","Séance dans 30 min"],["mobility","Mobilité du jour"],["eve","Veille de tournoi"],["deadline","Inscriptions à faire"],["weekly","Bilan du dimanche soir"]].map(([k,l])=>`<button class="chip-btn" type="button" data-npref="${k}" aria-pressed="${!!pr[k]}">${pr[k]?"✓ ":""}${l}</button>`).join("")}</div>
   ${sub?`<p class="muted small">${((data.notif.main||{}).queue||[]).length} rappels programmés sur 14 jours.</p>`:""}</section>`:""}`;
}
function shareCard(){const sh=data.share.main,con=Sync.connected();
  return `<section class="card stack"><div><div class="eyebrow">Lecture seule</div><h2>Partager avec un coach</h2></div>
   <p class="small">Crée un lien que ton coach ou ton partenaire peut ouvrir pour voir tes séances, charges, tests et tournois, sans rien pouvoir modifier. Tu peux le désactiver à tout moment.</p>
   ${sh?`<div class="linkrow"><div class="mono small wrap">${esc(shareLink())}</div><button class="chip-btn" type="button" data-copy="${esc(shareLink())}">Copier</button></div><div><button class="btn ghost small" type="button" data-share="off">Désactiver le lien</button></div>`:`<div><button class="btn" type="button" data-share="on" ${con?"":"disabled"}>Créer un lien de partage</button></div>`}</section>`;
}
function csvCard(){
  return `<section class="card stack"><div><div class="eyebrow">Excel, Numbers, Google Sheets</div><h2>Export tableur</h2></div>
   <div class="actions">${[["seances","Séances"],["series","Séries et charges"],["poids","Poids"],["tests","Tests"],["tournois","Tournois"],["forme","Forme du matin"]].map(([k,l])=>`<button class="chip-btn" type="button" data-csv="${k}">${l}</button>`).join("")}</div></section>`;
}

/* Aujourd'hui : cartes et alertes supplémentaires */
function todayExtras(){
  const out=[],ev=upcomingEvents()[0];
  if(ev){const n=daysBetween(todayIso(),ev.date),tp=ev.goal&&n<=10&&n>0;
    out.push(`<section class="card evcard ${ev.goal?"goal":""}"><div class="sess-head"><div><div class="eyebrow">Prochain tournoi${ev.goal?" · objectif":""}</div><h3>${esc(ev.cat)} ${esc(ev.lieu||"")}</h3><div class="muted small">${esc(frLong(ev.date))}${ev.registered?" · inscrit":ev.deadline?` · inscription avant le ${fr(ev.deadline)}`:""}</div></div><div class="evn"><b class="num">${n>0?"J-"+n:n===0?"Jour J":"En cours"}</b></div></div>${tp?`<p class="small">Affûtage en cours : les séances sont allégées pour que tu arrives frais et explosif.</p>`:""}</section>`);}
  return out.join("");
}
function alertsExtra(){
  const out=[];
  const fs=fatigueSignal();if(fs)out.push(`<div class="alert warn"><b>Fatigue qui s'accumule</b> : ${esc(fs)}. Allège le reste de la semaine pour récupérer. <button class="linkbtn" data-lighten="1">Alléger maintenant</button></div>`);
  upcomingEvents().forEach(e=>{if(e.deadline&&!e.registered){const d=daysBetween(todayIso(),e.deadline);if(d>=0&&d<=3)out.push(`<div class="alert warn"><b>Inscription à faire</b> : ${esc(e.cat)} ${esc(e.lieu||"")}, clôture ${d===0?"aujourd'hui":"dans "+plural(d,"jour")}. <button class="linkbtn" data-evreg="${e.id}">Je suis inscrit</button></div>`);}});
  gearAlerts().forEach(x=>out.push(`<div class="alert"><b>${esc(GEAR_TYPES[x.g.type][0])} à changer</b>${x.g.name?" ("+esc(x.g.name)+")":""} : ${fmt(x.h,0)} h de jeu. <button class="linkbtn" data-goto="more:materiel">Matériel</button></div>`));
  const since=addDays(todayIso(),-14),zc={};Object.values(data.pains).filter(p=>p.date>=since).forEach(p=>{const z=zoneToRehab(p.zone);if(z)zc[z]=(zc[z]||0)+1;});
  Object.entries(zc).filter(([z,n])=>n>=2&&!(data.rehab[z]&&data.rehab[z].active)).forEach(([z])=>out.push(`<div class="alert"><b>Programme ${esc(REHAB[z].name.toLowerCase())} conseillé</b> : 12 min ajoutées à 3 séances par semaine. <button class="linkbtn" data-rehab="${z}">Activer</button></div>`));
  const r=data.resume.main;if(r&&todayIso()>=r.from&&todayIso()<r.until)out.push(`<div class="alert"><b>Reprise en cours</b> jusqu'au ${fr(addDays(r.until,-1))} : charges −20 %, pas de sauts maximaux.</div>`);
  return out.join("");
}
