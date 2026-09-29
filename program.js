/* Programme Padel — structure du programme (cycles de 12 semaines, 3 blocs) */
"use strict";
const DAYS=[["lun","Lundi"],["mar","Mardi"],["mer","Mercredi"],["jeu","Jeudi"],["ven","Vendredi"],["sam","Samedi"],["dim","Dimanche"]];
const DAY_KEYS=DAYS.map(d=>d[0]);
const BLOCKS=[
 {id:1,name:"Fondations",color:"var(--b1)",
  goal:"Reconstruire une base de force, relancer le cardio et amorcer la perte de poids. Solidifier épaule, coude, chevilles et lombaires avant d'ajouter de l'intensité.",
  keys:["Technique propre, charges modérées (RPE 7)","Cardio zone 2 + intervalles 30/30","Prévention épaule/coude systématique","Pliométrie basse (corde, pogo, box jump)"]},
 {id:2,name:"Force & puissance",color:"var(--b2)",
  goal:"Charges plus lourdes et sauts plus intenses pour gagner en explosivité sur les premiers pas, les smashs et les sorties de vitre.",
  keys:["Force lourde 4×5 (RPE 8)","Sauts maximaux et lancers rotatifs","Déplacements spécifiques de ton côté","Intervalles « points de padel » 15/25"]},
 {id:3,name:"Vitesse spécifique",color:"var(--b3)",
  goal:"Transformer la force en vitesse de jeu : réactivité, répétition d'efforts courts comme en fin de 3e set, puissance au-dessus de la tête.",
  keys:["Contraste charge lourde + saut","Accélérations réactives au signal","Répétitions de sprints 20/20","Force entretenue, volume réduit"]}
];
const wcOf=w=>((w-1)%12)+1;               // semaine dans le cycle (1–12)
const cycleOf=w=>Math.ceil(w/12);
const blockOf=w=>BLOCKS[Math.floor((wcOf(w)-1)/4)];
const isDeload=w=>[4,8,12].includes(wcOf(w));
const isTestWeek=w=>w===1||[4,8,12].includes(wcOf(w));
const WEEK_CUE={1:"Charges modérées, RPE 7 : prends le temps d'apprendre les mouvements et note tes charges.",
 2:"Regarde la charge suggérée : si la semaine passée était à RPE 7 ou moins, ajoute 2,5 à 5 kg.",
 3:"Semaine la plus dure du bloc : vise RPE 8 sur les exercices principaux.",
 4:"Semaine d'allègement : une série de moins, charges −10 à −15 %. Tests à la place de la séance de force."};
const GEN={warmup:"Échauffement",warmup_dyn:"Échauffement dynamique",mobility:"Routine mobilité quotidienne"};
const isRight=()=>(data.settings.main&&data.settings.main.side)==="droite";
function sideTxt(s){
  if(!isRight()||!s)return s;
  return String(s).replace(/Drill gauche/g,"Drill droite").replace(/côté gauche/g,"côté droit").replace(/Côté gauche/g,"Côté droit").replace(/joueur de gauche/g,"joueur de droite").replace(/Joueur de gauche/g,"Joueur de droite");
}
// [clé exercice, séries, reps/durée, note]
const S={
 A:{
  1:{title:"Force & explosivité",dur:70,place:"Salle",items:[
   ["warmup",null,"10 min","5 min rameur + routine mobilité (version courte) + 2 séries légères du 1er exercice de force"],
   ["box_jump",3,"4"],["skater",3,"5/côté","Tiens la réception 1 s"],["mb_rot",3,"6/côté","3–4 kg"],
   ["squat_goblet",3,"10","RPE 7, descente en 3 s"],["rdl",3,"10"],["lunge_back",3,"8/jambe"],
   ["row_db",3,"10/bras"],["bench_db",3,"10"],["pallof",3,"10/côté"]]},
  2:{title:"Force lourde & puissance",dur:75,place:"Salle",items:[
   ["warmup",null,"10 min","Rameur + mobilité + montée progressive au squat"],
   ["cmj",4,"4","Récup complète, qualité maximale"],["mb_slam",3,"6"],["mb_rot",3,"5/côté","Explosif"],
   ["back_squat",4,"5","RPE 8, 2 min 30 de récup"],["trapbar",3,"5","Sans trap bar : soulevé de terre roumain à la barre"],
   ["bulgarian",3,"6/jambe"],["pullup",4,"6","Avec élastique si besoin"],["press_1arm",3,"8/bras"],["landmine",3,"8/côté"]]},
  3:{title:"Vitesse & contraste",dur:70,place:"Salle",items:[
   ["warmup",null,"10 min","Rameur + mobilité + 3 sauts"],
   ["depth_jump",3,"4"],["reactive_acc",6,"1 sprint","Un partenaire annonce la direction"],["mb_overhead",3,"5","2 kg"],
   ["contrast_squat",3,"3 + 3 sauts"],["trapbar",3,"4","Intention explosive à la montée"],["jump_lunge",3,"6"],
   ["pullup",3,"5","Lestées si tu en fais 8 propres"],["push_press",3,"5"],["landmine",3,"5/côté","Version explosive"]]}
 },
 PREV:{
  1:{title:"Prévention & gainage",dur:20,items:[["ext_rot",2,"15/bras"],["calf_ecc",2,"15","Montée à deux pieds, descente sur un pied en 3 s"],["plank",3,"30 s"],["side_plank",2,"30 s/côté"],["dead_bug",2,"10/côté"]]},
  2:{title:"Prévention & gainage",dur:20,items:[["ytw",2,"8 chaque lettre"],["copenhagen",3,"20 s/côté"],["calf_ecc",2,"12","Tout sur un pied"],["pallof",3,"20 s/côté","Version isométrique : bras tendus, tiens"],["shoulder_tap",3,"12"]]},
  3:{title:"Prévention & gainage",dur:20,items:[["ext_rot90",2,"12/bras"],["copenhagen",2,"25 s/côté"],["calf_ecc",2,"12","Tout sur un pied"],["pallof",3,"8 pas/côté","Version en marchant : pas chassés, bras tendus"],["side_plank_rot",2,"8/côté"]]}
 },
 FIN:{
  1:{title:"Finisher cardio",dur:15,items:[["rope",3,"45 s","15 s de récup"],["int_3030",2,"6 × 30 s","3 min entre les séries"]]},
  2:{title:"Finisher cardio padel",dur:15,items:[["left_drill",6,"15 s","45 s de récup, intensité match"],["int_points",2,"8 reps","3 min entre les séries"]]},
  3:{title:"Finisher vitesse",dur:15,items:[["left_drill_full",4,"20 s","40 s de récup"],["rsa",2,"8 reps","4 min entre les séries. Une seule série si tu joues dès vendredi soir"]]}
 },
 C:{title:"Récup active & cardio zone 2",place:"Maison / extérieur",items:[
   ["zone2",null,"30–40 min"],["mobility",null,"12 min","La routine guidée (compte pour aujourd'hui)"],["m_sleeper",2,"30 s/côté"],["m_roller",null,"5 min"]]}
};
// Cycle 2 et suivants : même structure, bloc 1 plus exigeant (on part d'une base déjà construite)
function sessionA(w){
  const b=blockOf(w).id,A=S.A[b];
  if(cycleOf(w)>=2&&b===1){
    return {...A,title:"Force & explosivité (cycle "+cycleOf(w)+")",items:A.items.map(it=>it[0]==="squat_goblet"?["back_squat",4,"6","RPE 7–8, 2 min de récup"]:it[0]==="bench_db"?["bench_db",4,"8"]:it)};
  }
  return A;
}
const M_ROUTINE=[["m_catcow",null,"8 reps"],["m_thoracic",null,"6/côté"],["m_wgs",null,"4/côté"],["m_9090",null,"6/côté"],["m_hipflexor",null,"30 s/côté"],["m_frog",null,"8 reps"],["m_ankle",null,"10/côté"],["m_dislocate",null,"10 reps"],["m_wrist",null,"30 s chaque sens"]];
const TESTS=[
 {k:"saut",name:"Saut en longueur sans élan",u:"cm",better:"up",how:"Pieds joints, 3 essais, garde le meilleur. Mesure au talon le plus proche."},
 {k:"spider",name:"Spider drill 5 cônes",u:"s",better:"down",ex:"star_drill",how:"Cônes à 3 m du centre en demi-étoile (schéma du drill étoile). Aller toucher chaque cône et revenir au centre, chrono total. 2 essais."},
 {k:"sprint",name:"Répétitions de sprints 6 × 20 m",u:"s",better:"down",how:"6 sprints de 20 m, départ toutes les 30 s. Note le temps moyen (ou le total ÷ 6)."},
 {k:"planche",name:"Planche max",u:"s",better:"up",ex:"plank",how:"Sur les avant-bras, corps aligné. Arrêt dès que le bassin tombe."},
 {k:"pompes",name:"Pompes max",u:"reps",better:"up",ex:"pushup",how:"Poitrine à un poing du sol, sans pause au-dessus de 2 s."},
 {k:"squat",name:"Squat 5 RM estimé",u:"kg",better:"up",ex:"squat_goblet",how:"Charge que tu peux soulever 5 fois proprement (RPE 9). En bloc 1, fais-le au goblet."},
 {k:"fc",name:"FC de repos",u:"bpm",better:"down",how:"Le matin au réveil, allongé, 1 minute."},
 {k:"taille",name:"Tour de taille",u:"cm",better:"down",how:"Au niveau du nombril, le matin, expiration normale."}
];
const PADEL_FOCUS={1:"Régularité et placement : lobs de défense, sorties de vitre de ton côté.",2:"Transitions défense → attaque : bandeja et montée au filet.",3:"Finition au filet : smash par 3 / par 4, víbora, volées décisives."};
const TDAYS=[["ven","Vendredi"],["sam","Samedi"],["dim","Dimanche"],["none","Pas de tournoi"]];
function tDay(w){return (data.weeks["w"+w]&&data.weeks["w"+w].tournoi)||"sam";}
const ACTIVATION=[["mobility",null,"12 min","La routine guidée"],["Activation",null,"8 min","3 accélérations de 5 m, 6 split-steps, shadow des coups. Rien de lourd la veille du tournoi"]];
const TOURNOI=(suite)=>({kind:"M",title:suite?"Tournoi (suite) / repos":"Tournoi",dur:180,place:"Tournoi",items:[["mobility",null,"12 min","Le matin, avant l'échauffement"],["match_warmup",null,"12 min","Échauffement guidé d'avant-match"],["between",null,"12 min","Entre deux matchs : routine guidée"],["post_tournament",null,"20 min","Le soir : récupération guidée"]],cue:suite?"Si tu es encore en lice, suis le protocole tournoi. Sinon repos ou 20 min de marche + mobilité.":"Coche ton sac, suis les routines guidées, puis enregistre ton tournoi et la journée (durée de jeu et RPE)."});
function dayPlan(w,d){
  const b=blockOf(w).id,wc=wcOf(w),T=tDay(w),focus=sideTxt(PADEL_FOCUS[b]);
  if(d==="lun") return {kind:"C",title:S.C.title,dur:50,place:S.C.place,items:S.C.items,cue:"Après le tournoi du week-end : on relance la circulation sans fatiguer. Si tu es très entamé, fais seulement la mobilité."};
  if(d==="mar"){const F=S.PREV[b];return {kind:"P",title:"Padel + "+F.title.toLowerCase(),dur:90+F.dur,place:"Club",tech:true,items:[["Entraînement padel",null,"60–90 min","Axe du bloc : "+focus],...F.items],cue:"Juste après ton entraînement padel, encore chaud : 20 min de prévention épaule, mollets, adducteurs et gainage."};}
  if(d==="jeu"){
    if(T==="ven") return {kind:"P",title:"Padel léger (veille de tournoi)",dur:60,place:"Club",tech:true,items:[["Entraînement padel",null,"45–60 min","Technique et sensations : pas de match intense, pas de finisher"],ACTIVATION[0]],cue:"Tournoi demain : l'entraînement sert à caler tes sensations. Écourte-le si tu te sens lourd."};
    const F=S.FIN[b];
    return {kind:"P",title:"Padel + "+F.title.toLowerCase(),dur:90+F.dur,place:"Club",tech:true,items:[["Entraînement padel",null,"60–90 min","Axe du bloc : "+focus],...F.items],cue:T==="dim"?"Tournoi dimanche (J-3) : finisher complet.":T==="none"?"Pas de tournoi cette semaine : finisher complet, tu peux même ajouter une série.":"Juste après ton entraînement padel : 15 min courts et intenses. C'est J-2 avant le tournoi, donc on s'arrête là."};
  }
  if(d==="mer"){
    if(isTestWeek(w)){const first=w===1;return {kind:"T",title:first?"Tests de départ":"Tests de fin de bloc",dur:60,place:"Salle ou terrain",items:[["warmup_dyn",null,"12 min","Protocole Guide"],...TESTS.filter(t=>!["fc","taille"].includes(t.k)).map(t=>[t.ex||t.name,null,t.u,t.name+" : "+t.how,t.k]),...(first?[["squat_goblet",2,"10","Découverte, charge légère"],["row_db",2,"10/bras","Découverte, charge légère"],["pallof",2,"10/côté"]]:[])],cue:(first?"Fais les tests dans cet ordre, reposé, puis 3 exercices légers pour découvrir la séance de force.":"Semaine d'allègement : les tests remplacent la séance de force.")+" FC de repos et tour de taille se mesurent le matin."+(T==="ven"?" Tournoi vendredi : si tu préfères, fais les tests lundi à la place.":"")};}
    const A=sessionA(w);
    if(T==="ven")return {kind:"A",short:true,title:A.title+" · version courte",dur:50,place:A.place,items:A.items.slice(0,8),cue:"Tournoi vendredi, on est à J-2 : une série de moins partout, les 2 derniers exercices sautent, RPE 7 maximum et aucune série jusqu'à l'échec."};
    return {kind:"A",...A,cue:WEEK_CUE[((wc-1)%4)+1]+(cycleOf(w)>=2&&wc<=2?" Nouveau cycle : repars de tes charges de fin de cycle précédent −5 %, puis progresse.":"")+(T==="none"?" Pas de tournoi cette semaine : tu peux pousser un peu plus.":" Les sauts et lancers se font en premier, quand tu es frais.")};
  }
  if(d==="ven"){
    if(T==="ven") return TOURNOI(false);
    if(T==="sam") return {kind:"V",title:"Activation ou repos",dur:20,place:"Maison / club",items:ACTIVATION,cue:"Veille de tournoi : prépare ton sac (checklist) et garde de la fraîcheur."};
    if(T==="dim") return {kind:"C",title:"Récup légère",dur:35,place:"Maison / extérieur",items:[["zone2",null,"20–25 min","Très facile, pour la circulation"],["mobility",null,"12 min","La routine guidée"]],cue:"Tournoi dimanche : un peu de cardio très facile aujourd'hui, activation demain."};
    return {kind:"C",title:"Cardio zone 2 (perte de poids)",dur:50,place:"Maison / extérieur",items:[["zone2",null,"35–45 min"],["mobility",null,"12 min"]],cue:"Pas de tournoi : séance bonus pour la perte de poids."};
  }
  if(d==="sam"){
    if(T==="ven"||T==="sam") return TOURNOI(T==="ven");
    if(T==="dim") return {kind:"V",title:"Activation ou repos",dur:20,place:"Maison / club",items:ACTIVATION,cue:"Veille de tournoi : prépare ton sac (checklist) et garde de la fraîcheur."};
    return {kind:"P",title:"Match d'entraînement ou repos",dur:90,place:"Club",tech:true,items:[["Match d'entraînement",null,"60–90 min","Ou repos si la semaine a été chargée"],["mobility",null,"12 min"]],cue:"Semaine sans tournoi : garde le rythme du jeu avec un match."};
  }
  if(T==="none") return {kind:"R",title:"Repos",dur:15,place:"Maison",items:[["mobility",null,"12 min","La routine guidée"]],cue:"Repos complet, seulement la mobilité."};
  return TOURNOI(T!=="dim");
}
const KIND_LABEL={A:"Force",C:"Récup",P:"Padel",T:"Tests",V:"Activation",R:"Repos",M:"Tournoi"};
const PLANNED_KINDS="ACPTV";   // jours qui comptent comme séance prévue

/* Version maison : remplacements quand tu n'as pas accès à la salle */
const ALT={
 back_squat:{k:"bulgarian",n:"Version maison : pied arrière sur une chaise, sac à dos lesté"},
 contrast_squat:{k:"cmj",r:"5",n:"Version maison : 5 fentes bulgares lentes puis 3 sauts max, 3 fois"},
 trapbar:{k:"rdl",n:"Version maison : sac à dos lesté ou bidons d'eau"},
 row_db:{k:"row_band",n:"Version maison : élastique accroché à une porte"},
 bench_db:{k:"pushup",n:"Version maison : pieds surélevés si trop facile"},
 pullup:{k:"row_band",n:"Version maison : élastique, tirage lent"},
 landmine:{k:"rot_band",n:"Version maison : élastique à hauteur de poitrine"},
 mb_rot:{k:"rot_band",n:"Version maison : rotation explosive à l'élastique"},
 mb_slam:{k:"burpee",n:"Version maison"},
 mb_overhead:{k:"cmj",n:"Version maison : saut vertical avec lancer de bras"},
 box_jump:{k:"cmj",n:"Version maison : saut vertical, réception souple sur place"},
 push_press:{k:"press_1arm",n:"Version maison : bidon d'eau ou élastique, avec petite flexion des jambes"},
 press_1arm:{k:"press_1arm",n:"Version maison : bidon d'eau ou élastique sous le pied"},
 squat_goblet:{k:"squat_goblet",n:"Version maison : sac à dos lesté contre la poitrine"},
 rdl:{k:"rdl",n:"Version maison : sac à dos lesté"},
 ytw:{k:"ytw",n:"Version maison : allongé sur le lit ou un banc, bouteilles d'eau"},
 copenhagen:{k:"copenhagen",n:"Version maison : pied sur le canapé"},
 calf_ecc:{k:"calf_ecc",n:"Version maison : une marche d'escalier"}
};
function planFor(w,d){
  const sw=data.swaps["w"+w]||{},src=sw[d]||d;
  let p=dayPlan(w,src);
  p={...p,items:p.items.map(x=>x.slice())};
  if(src!==d)p.moved=src;
  const id=`s${w}-${d}`,adj=data.adj[id]||{};
  if(adj.short&&!p.short&&(p.kind==="A"||p.kind==="P")){p.short=true;p.userShort=true;if(p.kind==="A"){p.items=p.items.slice(0,8);p.dur=Math.round(p.dur*0.7);}}
  if(adj.home&&(p.kind==="A"||p.kind==="P"||p.kind==="T")){p.home=true;p.items=p.items.map(it=>{const a=ALT[it[0]];return a?[a.k,it[1],a.r||it[2],a.n+(it[3]?" · "+it[3]:""),it[4]]:it;});p.place="Maison";}
  p.dl=(isDeload(w)&&"AP".includes(p.kind))||!!p.short;
  p.id=id;p.w=w;p.d=d;
  return p;
}
const rx=(s,r,dl)=>s==null?r:`${dl?Math.max(s>2?2:1,s-1):s} × ${r}`;
const setsOf=(s,dl)=>s==null?null:(dl?Math.max(s>2?2:1,s-1):s);

/* Journée tournoi : checklist du sac par défaut */
const BAG_DEFAULT=["Raquette + raquette de secours","Surgrips de rechange","Balles neuves","Chaussures de padel","Tenue de rechange + chaussettes","Serviette","2 L d'eau","Électrolytes","Bananes / compotes / barres","Repas ou sandwich","Élastique (échauffement et routine)","Crème / pansements / strap","Licence FFT et convocation","Chargeur de téléphone"];
const TECH_THEMES=["Bandeja","Víbora","Smash par 3","Smash par 4","Sortie de vitre","Lob de défense","Volée","Bajada","Chiquita","Service / retour","Placement et transitions","Jeu de filet en duo"];
