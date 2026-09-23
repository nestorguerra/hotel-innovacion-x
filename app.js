/* Hotel Innovación X Edición: lógica de la app. El contenido está en data.js */
(function(){
"use strict";
function toMin(t){var p=t.split(":");return (+p[0])*60+(+p[1]);}
SESSIONS.forEach(function(x){x.sm=toMin(x.s);x.em=toMin(x.e);});
var byId = {}; SESSIONS.forEach(function(x){byId[x.id]=x;});

function gmaps(q){return "https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(q);}
var ICONS = {
  walk:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="13" cy="4.5" r="1.8"/><path d="m9 21 2.5-6 2.5 2.5V21M8 12l2.5-4.5 3.5 1 2 3.5M11.5 15l1-6"/></svg>',
  tram:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="5" width="12" height="13" rx="3"/><path d="M6 12h12M9 21l1.5-3M15 21l-1.5-3M10 2h4"/></svg>',
  plane:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.5 13 3 11l1-2 8 .5L16 4.5c1-1 2.5-1 3 .5s-.5 2-1.5 3L13 12l.5 8-2 1-2-7.5-3 2.5.5 2-1.5.5-1-3-3-1 .5-1.5 2 .5z"/></svg>',
  train:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 15V7a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v8a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3zM5 11h14M8 21l2-3M16 21l-2-3"/></svg>',
  bike:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="16.5" r="3.5"/><circle cx="18.5" cy="16.5" r="3.5"/><path d="M5.5 16.5 9 9h6l3.5 7.5M12 16.5 9 9M14 6h2.5"/></svg>',
  fork:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3v8a2 2 0 0 0 2 2v8M5 3v5M9 3v5M17 21V3c-2 1.5-3 4-3 7v4h3"/></svg>',
  eye:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 21V9l5-5 5 5v12"/><path d="M4 21h16M10 21v-5h4v5"/></svg>',
  cup:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM17 10h1.5a2.5 2.5 0 0 1 0 5H17M8 3v3M12 3v3"/></svg>',
  go:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M20 4l-8 8M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
  star:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="m12 3.5 2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.8l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z"/></svg>'
};
var CAT_ICON = {comer:"fork", ver:"eye", dulce:"cup"};

/* Almacenamiento local, con tolerancia a fallos */
function load(k, d){try{var v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch(e){return d;}}
function save(k, v){try{localStorage.setItem(k, JSON.stringify(v));return true;}catch(e){return false;}}
var favs = load("hi10:favs", []); if(!Array.isArray(favs)) favs=[];
var notes = load("hi10:notes", {}); if(typeof notes!=="object"||!notes) notes={};
function isFav(id){return favs.indexOf(id)>-1;}
function toggleFav(id){
  if(isFav(id)) favs=favs.filter(function(x){return x!==id;}); else favs.push(id);
  save("hi10:favs", favs); renderTimeline(); updateMineCount();
  toast(isFav(id)?"Añadida a Mi agenda":"Quitada de Mi agenda");
}

function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}

/* Hora de Madrid (con ?hora=HH:MM para simular el día del evento) */
function madridNow(){
  var d=new Date(), date, min;
  try{
    var parts={}; new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/Madrid",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:false}).formatToParts(d).forEach(function(p){parts[p.type]=p.value;});
    date=parts.year+"-"+parts.month+"-"+parts.day; min=((+parts.hour)%24)*60+(+parts.minute);
  }catch(e){date=d.toISOString().slice(0,10);min=d.getHours()*60+d.getMinutes();}
  var sim=null; try{sim=new URLSearchParams(location.search).get("hora");}catch(e){}
  if(sim && /^\d{1,2}:\d{2}$/.test(sim)){date=EVENT_DATE;min=toMin(sim);}
  return {date:date,min:min};
}
function dayDiff(a,b){var pa=a.split("-"),pb=b.split("-");return Math.round((Date.UTC(pb[0],pb[1]-1,pb[2])-Date.UTC(pa[0],pa[1]-1,pa[2]))/864e5);}
function dur(m){if(m<60)return m+" min";var h=Math.floor(m/60),r=m%60;return h+" h"+(r?" "+r+" min":"");}
function status(){
  var n=madridNow(), diff=dayDiff(n.date, EVENT_DATE);
  if(diff>0) return {phase:"before", days:diff};
  if(diff<0) return {phase:"over"};
  var cur=null,next=null;
  for(var i=0;i<SESSIONS.length;i++){var x=SESSIONS[i];
    if(n.min>=x.sm && n.min<x.em){cur=x;next=SESSIONS[i+1]||null;break;}
    if(n.min<x.sm){next=x;break;}
  }
  if(cur) return {phase:"live",cur:cur,next:next,now:n.min};
  if(next) return {phase:n.min<SESSIONS[0].sm?"morning":"gap",next:next,now:n.min};
  return {phase:"done"};
}

function speakerLine(x, light){
  if(!x.sp) return "";
  var imgs=x.sp.map(function(k){return '<img src="'+IMG[k]+'" alt="">';}).join("");
  var names=x.sp.map(function(k){return SPEAKERS[k].name;}).join(", ");
  return '<div class="'+(light?'live-who':'who')+'">'+(light?imgs:'<span class="avatars">'+imgs+'</span>')+'<span>'+esc(names)+'</span></div>';
}

function renderLive(){
  var st=status(), el=document.getElementById("live"), h="";
  if(st.phase==="before"){
    h='<div class="live-state">Cuenta atrás</div><div class="live-title">'+(st.days===1?"Mañana abrimos puertas":"Faltan "+st.days+" días")+'</div><div class="live-meta"><span>Apertura a las 9:00</span></div>';
  } else if(st.phase==="over"){
    h='<div class="live-state">Hasta la próxima</div><div class="live-title">La X Edición ya ha terminado</div><div class="live-meta"><span>Gracias por formar parte del espectáculo</span></div>';
  } else if(st.phase==="done"){
    h='<div class="live-state">Telón</div><div class="live-title">Gracias por venir. Ahora, a disfrutar Sevilla.</div><button class="live-cta" data-goto="sevilla" data-cat="comer">Dónde comer cerca</button>';
  } else if(st.phase==="live"){
    var c=st.cur, pct=Math.min(100,Math.max(0,(st.now-c.sm)/(c.em-c.sm)*100)), left=c.em-st.now;
    h='<div class="live-state"><span class="pulse"></span>'+(c.pause?"En pausa":"Ahora en escena")+'</div>'+
      '<button class="live-title" style="text-align:left" data-open="'+c.id+'">'+esc(c.title)+'</button>'+
      speakerLine(c,true)+
      '<div class="bar"><i style="width:'+pct.toFixed(1)+'%"></i></div>'+
      '<div class="live-meta tnum"><span>'+c.s+' a '+c.e+'</span><span>Quedan '+dur(left)+'</span></div>'+
      (st.next?'<button class="live-next" data-open="'+st.next.id+'">Después, a las <b class="tnum">'+st.next.s+'</b>: '+esc(st.next.title)+'</button>':'');
  } else {
    var nx=st.next, mins=nx.sm-st.now;
    h='<div class="live-state">'+(st.phase==="morning"?"Abrimos puertas en "+dur(mins):"Siguiente en "+dur(mins))+'</div>'+
      '<button class="live-title" style="text-align:left" data-open="'+nx.id+'">'+esc(nx.title)+'</button>'+
      speakerLine(nx,true)+
      '<div class="live-meta tnum"><span>'+nx.s+' a '+nx.e+'</span><span>'+esc(nx.kind)+'</span></div>';
  }
  el.innerHTML=h;
}

var filter="all";
function renderTimeline(){
  var st=status(), n=madridNow(), today=dayDiff(n.date,EVENT_DATE)===0, after=dayDiff(n.date,EVENT_DATE)<0;
  var list=SESSIONS.filter(function(x){return filter==="all"||isFav(x.id);});
  var ol=document.getElementById("timeline");
  if(!list.length){
    ol.innerHTML='<li class="empty">'+ICONS.star+'Marca con la estrella las sesiones que no te quieres perder y aparecerán aquí.</li>';
    return;
  }
  ol.innerHTML=list.map(function(x){
    var now=st.phase==="live"&&st.cur.id===x.id;
    var past=after||(today&&n.min>=x.em);
    var cls="slot"+(now?" now":"")+(past?" past":"")+(x.pause?" pause":"");
    return '<li class="'+cls+'" style="--kind:'+KIND_COLOR[x.kind]+'">'+
      '<div class="slot-time tnum">'+x.s+'<small>'+x.e+'</small></div>'+
      '<div class="slot-rail"><i class="dot"></i></div>'+
      '<div class="slot-body">'+
        '<button class="slot-card glass" data-open="'+x.id+'">'+
          '<span class="kind">'+esc(x.kind)+'</span>'+(now?'<span class="badge"><span class="pulse"></span>En directo</span>':'')+
          '<h3>'+esc(x.title)+'</h3>'+(x.sub?'<p class="sub">'+esc(x.sub)+'</p>':'')+speakerLine(x)+
        '</button>'+
        '<button class="fav" data-fav="'+x.id+'" aria-pressed="'+isFav(x.id)+'" aria-label="'+(isFav(x.id)?"Quitar de Mi agenda":"Añadir a Mi agenda")+': '+esc(x.title)+'">'+ICONS.star+'</button>'+
      '</div></li>';
  }).join("");
}
function updateMineCount(){document.getElementById("segMine").textContent="Mi agenda"+(favs.length?" ("+favs.length+")":"");}

function renderSpeakers(){
  var sessOf={}; SESSIONS.forEach(function(x){(x.sp||[]).forEach(function(k){sessOf[k]=x;});});
  document.getElementById("speakers").innerHTML=SPEAKER_ORDER.map(function(k){var p=SPEAKERS[k],s=sessOf[k];
    return '<button class="sp glass" data-speaker="'+k+'"><img src="'+IMG[k]+'" alt="" loading="lazy"><b>'+esc(p.name)+'</b><span>'+esc(p.role)+'</span><em class="tnum">'+s.s+' a '+s.e+'</em></button>';}).join("");
  document.getElementById("faces").innerHTML=SPEAKER_ORDER.map(function(k){var p=SPEAKERS[k];
    return '<button class="face" data-speaker="'+k+'"><img src="'+IMG[k]+'" alt="">'+esc(p.name)+'</button>';}).join("");
}

var cat="comer";
function renderCity(){
  var box=document.getElementById("cityList"), note=document.getElementById("cityNote");
  if(cat==="moverse"){
    note.textContent="Cómo moverte desde la sede.";
    box.innerHTML=MOVE.map(rowMove).join("");
    return;
  }
  note.textContent="Tiempos a pie aproximados desde la sede. Toca un sitio para abrirlo en Mapas.";
  box.innerHTML=CITY[cat].map(function(p){
    return '<a class="row" target="_blank" rel="noopener" href="'+gmaps(p.q)+'"><span class="ico">'+ICONS[CAT_ICON[cat]]+'</span><span class="txt"><b>'+esc(p.n)+'</b><p>'+esc(p.d)+'</p><small><span class="pill tnum">'+p.t+' a pie</span>'+esc(p.a)+'</small></span><span class="go">'+ICONS.go+'</span></a>';
  }).join("");
}
function rowMove(m){
  var inner='<span class="ico">'+ICONS[m.i]+'</span><span class="txt"><b>'+esc(m.n)+'</b><p>'+esc(m.d)+'</p></span>';
  return m.q?'<a class="row" target="_blank" rel="noopener" href="'+gmaps(m.q)+'">'+inner+'<span class="go">'+ICONS.go+'</span></a>':'<div class="row">'+inner+'</div>';
}

/* Hoja inferior */
var wrap=document.getElementById("sheetWrap"), sheet=document.getElementById("sheet"), body=document.getElementById("sheetBody"), lastFocus=null;
function openSheet(html){
  lastFocus=document.activeElement; body.innerHTML=html; body.scrollTop=0;
  wrap.hidden=false; sheet.style.transform="";
  requestAnimationFrame(function(){requestAnimationFrame(function(){wrap.classList.add("open");sheet.focus({preventScroll:true});});});
  document.body.style.overflow="hidden";
}
function closeSheet(){
  if(wrap.hidden) return;
  wrap.classList.remove("open"); sheet.style.transform="";
  document.body.style.overflow="";
  var done=false, fin=function(){if(done)return;done=true;wrap.hidden=true;body.innerHTML="";if(lastFocus&&lastFocus.focus)lastFocus.focus({preventScroll:true});};
  sheet.addEventListener("transitionend",fin,{once:true}); setTimeout(fin,450);
}
function sessionHTML(id){
  var x=byId[id]; if(!x) return "";
  var people=(x.sp||[]).map(function(k){var p=SPEAKERS[k];return '<div class="person"><img src="'+IMG[k]+'" alt=""><div><b>'+esc(p.name)+'</b><span>'+esc(p.role)+'</span>'+(p.bio?'<p>'+esc(p.bio)+'</p>':'')+'</div></div>';}).join("");
  var fav=isFav(id);
  return '<div style="--kind:'+KIND_COLOR[x.kind]+'"><div class="sb-kind">'+esc(x.kind)+'</div>'+
    '<h2 class="sb-title">'+esc(x.title)+'</h2>'+(x.sub?'<p class="sb-sub">'+esc(x.sub)+'</p>':'')+
    '<div class="sb-time tnum">'+x.s+' a '+x.e+', Fundación Cajasol</div>'+
    (x.desc?'<p class="sb-p">'+esc(x.desc)+'</p>':'')+
    (people?'<div style="margin-top:12px">'+people+'</div>':'')+
    '<div class="sb-actions"><button class="btn'+(fav?' soft':'')+'" data-fav-sheet="'+id+'">'+ICONS.star+(fav?'Quitar de Mi agenda':'Añadir a Mi agenda')+'</button></div>'+
    '<div class="notes"><label for="note-'+id+'">Tus notas</label><textarea id="note-'+id+'" data-note="'+id+'" placeholder="Ideas, frases, contactos que quieres recordar">'+esc(notes[id]||"")+'</textarea><small id="noteState">Se guardan solo en este móvil.</small></div></div>';
}
function speakerHTML(k){
  var p=SPEAKERS[k]; var s=SESSIONS.filter(function(x){return (x.sp||[]).indexOf(k)>-1;})[0];
  return '<div class="center"><img class="sp-hero" src="'+IMG[k]+'" alt=""><h2 class="sb-title">'+esc(p.name)+'</h2><p class="sb-sub">'+esc(p.role)+'</p></div>'+
    (p.bio?'<p class="sb-p">'+esc(p.bio)+'</p>':'')+
    (s?'<div class="group glass" style="margin-top:18px;--kind:'+KIND_COLOR[s.kind]+'"><button class="row" data-open="'+s.id+'"><span class="txt"><span class="kind">'+esc(s.kind)+', '+s.s+' a '+s.e+'</span><b style="margin-top:2px">'+esc(s.title)+'</b>'+(s.sub?'<p>'+esc(s.sub)+'</p>':'')+'</span><span class="go"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg></span></button></div>':'');
}

/* Gesto para cerrar la hoja deslizando hacia abajo */
(function(){
  var y0=null, dy=0, dragging=false;
  function start(e){if(body.scrollTop>0&&!e.target.closest(".sheet-head"))return;y0=e.touches[0].clientY;dy=0;dragging=true;sheet.style.transition="none";}
  function move(e){if(!dragging)return;dy=Math.max(0,e.touches[0].clientY-y0);if(dy>0){sheet.style.transform="translateY("+dy+"px)";if(e.cancelable)e.preventDefault();}}
  function end(){if(!dragging)return;dragging=false;sheet.style.transition="";if(dy>110)closeSheet();else sheet.style.transform="";}
  sheet.addEventListener("touchstart",start,{passive:true});
  sheet.addEventListener("touchmove",move,{passive:false});
  sheet.addEventListener("touchend",end);
})();

var noteTimer=null;
document.addEventListener("input",function(e){
  var id=e.target.getAttribute&&e.target.getAttribute("data-note"); if(!id) return;
  clearTimeout(noteTimer);
  noteTimer=setTimeout(function(){
    notes[id]=e.target.value; var ok=save("hi10:notes",notes);
    var s=document.getElementById("noteState"); if(s) s.textContent=ok?"Guardado en este móvil.":"No se ha podido guardar: tu navegador bloquea el almacenamiento.";
  },350);
});

/* Navegación por pestañas */
var TABS=["hoy","agenda","ponentes","sevilla","info"], scrollMem={}, current=null;
function show(tab, opts){
  if(TABS.indexOf(tab)<0) tab="hoy";
  if(current) scrollMem[current]=window.scrollY;
  TABS.forEach(function(t){document.getElementById("v-"+t).hidden=(t!==tab);});
  document.querySelectorAll(".tabbar a").forEach(function(a){if(a.dataset.tab===tab)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current");});
  document.getElementById("topbarTitle").textContent=document.getElementById("v-"+tab).dataset.title;
  var y=(opts&&opts.reset)?0:(scrollMem[tab]||0);
  current=tab; window.scrollTo(0,y); onScroll();
}
function go(tab, extra){
  extra=extra||{};
  if(extra.cat){cat=extra.cat;setPressed("#chips button",function(b){return b.dataset.cat===cat;});renderCity();}
  if(extra.mine){filter="mine";setPressed(".seg button",function(b){return b.dataset.filter==="mine";});renderTimeline();}
  if(location.hash!=="#"+tab){history.replaceState(null,"","#"+tab);}
  show(tab,{reset:!!(extra.cat||extra.mine)});
}
function setPressed(sel, fn){document.querySelectorAll(sel).forEach(function(b){b.setAttribute("aria-pressed",fn(b)?"true":"false");});}
window.addEventListener("hashchange",function(){show(location.hash.slice(1));});

function onScroll(){document.getElementById("topbar").classList.toggle("show",window.scrollY>58);}
window.addEventListener("scroll",onScroll,{passive:true});

var toastT=null;
function toast(msg){var t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");clearTimeout(toastT);toastT=setTimeout(function(){t.classList.remove("show");},1800);}

document.addEventListener("click",function(e){
  var el=e.target.closest("[data-fav],[data-fav-sheet],[data-open],[data-speaker],[data-goto],[data-filter],[data-cat],.tabbar a,#shareBtn,#scrim,#sheetClose");
  if(!el) return;
  if(el.id==="scrim"||el.id==="sheetClose"){closeSheet();return;}
  if(el.matches(".tabbar a")){e.preventDefault();closeSheet();go(el.dataset.tab);return;}
  if(el.dataset.fav){toggleFav(el.dataset.fav);return;}
  if(el.dataset.favSheet){var id=el.dataset.favSheet;toggleFav(id);var ta=body.querySelector("textarea");var keep=ta?ta.value:"";body.innerHTML=sessionHTML(id);var t2=body.querySelector("textarea");if(t2)t2.value=keep;return;}
  if(el.dataset.open){if(!wrap.hidden){body.innerHTML=sessionHTML(el.dataset.open);body.scrollTop=0;}else openSheet(sessionHTML(el.dataset.open));return;}
  if(el.dataset.speaker){openSheet(speakerHTML(el.dataset.speaker));return;}
  if(el.dataset.goto){e.preventDefault();closeSheet();go(el.dataset.goto,{cat:el.dataset.cat,mine:el.dataset.mine});return;}
  if(el.dataset.filter){filter=el.dataset.filter;setPressed(".seg button",function(b){return b.dataset.filter===filter;});renderTimeline();return;}
  if(el.dataset.cat&&el.closest("#chips")){cat=el.dataset.cat;setPressed("#chips button",function(b){return b.dataset.cat===cat;});renderCity();return;}
  if(el.id==="shareBtn"){
    var url=location.href.split("#")[0];
    var data={title:"Hotel Innovación X Edición",text:"Agenda, ponentes y Sevilla para la X Edición de Hotel Innovación",url:url};
    if(navigator.share){navigator.share(data).catch(function(){});}
    else if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(url).then(function(){toast("Enlace copiado");},function(){toast("Copia el enlace desde la barra del navegador");});}
    else toast("Copia el enlace desde la barra del navegador");
  }
});
document.addEventListener("keydown",function(e){if(e.key==="Escape")closeSheet();});

function tick(){renderLive();if(!document.getElementById("v-agenda").hidden)renderTimeline();}

renderSpeakers(); renderCity(); document.getElementById("moveList").innerHTML=MOVE.map(rowMove).join("");
updateMineCount(); renderTimeline(); renderLive();
show(location.hash.slice(1)||"hoy");
setInterval(tick,30000);
document.addEventListener("visibilitychange",function(){if(!document.hidden)tick();});
})();

if ("serviceWorker" in navigator && window.isSecureContext) {
  window.addEventListener("load", function(){ navigator.serviceWorker.register("sw.js").catch(function(){}); });
}
