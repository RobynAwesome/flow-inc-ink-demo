const STUDIO={
  name:'Flow Inc Ink',
  lat:-25.9969,
  lng:28.1275,
  address:'Shop M3A, Boulders Shopping Centre, 1685 Old Pretoria Road, Halfway House Estate, Midrand, Gauteng',
  maps:'https://www.google.com/maps/search/?api=1&query=Flow%20Inc%20Ink%2C%20Shop%20M3A%2C%20Boulders%20Shopping%20Centre%2C%20Midrand%2C%20Gauteng'
};

function loadStyle(href,integrity){
  if(document.querySelector(`link[href="${href}"]`))return Promise.resolve();
  return new Promise((resolve,reject)=>{
    const link=document.createElement('link');
    link.rel='stylesheet';link.href=href;
    if(integrity){link.integrity=integrity;link.crossOrigin='anonymous'}
    link.onload=resolve;link.onerror=reject;document.head.append(link);
  });
}

function loadScript(src,integrity){
  if(document.querySelector(`script[src="${src}"]`))return Promise.resolve();
  return new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    script.src=src;script.defer=true;
    if(integrity){script.integrity=integrity;script.crossOrigin='anonymous'}
    script.onload=resolve;script.onerror=reject;document.head.append(script);
  });
}

function fallback(node){
  node.className='map-fallback';
  const text=document.createElement('p');
  text.textContent='Interactive map temporarily unavailable.';
  const link=document.createElement('a');
  link.href=STUDIO.maps;link.target='_blank';link.rel='noopener noreferrer';
  link.textContent='Open Flow Inc Ink in Google Maps ↗';
  node.replaceChildren(text,link);
}

async function bootMap(){
  const node=document.querySelector('[data-flow-map]');
  if(!node)return;
  try{
    await Promise.all([
      loadStyle('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css','sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='),
      loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js','sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=')
    ]);
    if(!globalThis.L)throw new Error('Leaflet unavailable');
    const map=L.map(node,{scrollWheelZoom:false}).setView([STUDIO.lat,STUDIO.lng],17);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
      maxZoom:19,attribution:'&copy; OpenStreetMap contributors'
    }).addTo(map);
    const icon=L.divIcon({className:'',html:'<div class="flow-map-marker" aria-hidden="true"></div>',iconSize:[26,26],iconAnchor:[13,13]});
    const marker=L.marker([STUDIO.lat,STUDIO.lng],{icon}).addTo(map);
    marker.bindPopup(`<strong>${STUDIO.name}</strong><br>${STUDIO.address}<br><a href="${STUDIO.maps}" target="_blank" rel="noopener noreferrer">Directions in Google Maps ↗</a>`).openPopup();
    L.circle([STUDIO.lat,STUDIO.lng],{radius:45,color:'#d7ff36',weight:2,fillColor:'#d7ff36',fillOpacity:.08}).addTo(map);
    document.querySelectorAll('[data-map-command]').forEach(control=>control.addEventListener('click',()=>{
      if(control.dataset.mapCommand==='studio'){map.flyTo([STUDIO.lat,STUDIO.lng],18,{duration:.8});marker.openPopup()}
      if(control.dataset.mapCommand==='zoom-in')map.zoomIn();
      if(control.dataset.mapCommand==='zoom-out')map.zoomOut();
    }));
    setTimeout(()=>map.invalidateSize(),100);
  }catch(error){console.info('[Flow Map] Fallback active.',error);fallback(node)}
}

bootMap();
