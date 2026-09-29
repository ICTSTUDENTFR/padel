/* Programme Padel — utilitaires communs */
"use strict";
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const pad=n=>String(n).padStart(2,"0");
const iso=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const parse=s=>{const[y,m,d]=String(s).split("-").map(Number);return new Date(y,(m||1)-1,d||1);};
const todayIso=()=>iso(new Date());
const addDays=(s,n)=>{const d=parse(s);d.setDate(d.getDate()+n);return iso(d);};
const daysBetween=(a,b)=>Math.round((parse(b)-parse(a))/864e5);
const fr=s=>{if(!s)return"";return parse(s).toLocaleDateString("fr-FR",{day:"numeric",month:"short"});};
const frLong=s=>{if(!s)return"";return parse(s).toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"});};
const fmt=(v,dec=1)=>v==null||v===""||isNaN(v)?"–":Number(v).toLocaleString("fr-FR",{maximumFractionDigits:dec});
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const num=v=>{if(v==null||v==="")return null;const n=parseFloat(String(v).replace(",","."));return isNaN(n)?null:n;};
const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:null;
const plural=(n,s,p)=>`${n} ${n>1?(p||s+"s"):s}`;

function toast(msg,bad){
  let t=$("#toast-global");
  if(!t){t=document.createElement("div");t.id="toast-global";t.setAttribute("role","status");document.body.appendChild(t);}
  t.textContent=msg;t.className=bad?"show bad":"show";
  clearTimeout(t._h);t._h=setTimeout(()=>{t.className="";},2600);
}
/* Partager / enregistrer un fichier (feuille de partage iOS, sinon téléchargement) */
async function shareFile(blob,name,title){
  try{
    const file=new File([blob],name,{type:blob.type});
    if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:title||name});return true;}
  }catch(e){if(e&&e.name==="AbortError")return false;}
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},2000);return true;
}
async function copyText(txt){
  try{await navigator.clipboard.writeText(txt);return true;}catch(e){return false;}
}
