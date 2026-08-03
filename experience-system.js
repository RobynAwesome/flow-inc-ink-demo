const root=document.documentElement;
const connection=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const saveData=Boolean(connection?.saveData);
const lowBandwidth=/^(slow-)?2g$/.test(connection?.effectiveType||'');
const tier=root.dataset.motionTier||(reduced?'reduced':saveData||lowBandwidth?'soft':'full');
root.dataset.experienceTier=tier;

const style=document.createElement('link');
style.rel='stylesheet';
style.href='/experience.css';
document.head.append(style);

const selectAll=selector=>[...document.querySelectorAll(selector)];

function bootScrollState(){
  const header=document.querySelector('.site-header');
  const progress=document.createElement('div');
  progress.className='flow-progress';
  progress.setAttribute('aria-hidden','true');
  progress.innerHTML='<span></span>';
  document.body.append(progress);
  const bar=progress.firstElementChild;
  let ticking=false;
  const update=()=>{
    const max=Math.max(document.documentElement.scrollHeight-innerHeight,1);
    const ratio=Math.min(Math.max(scrollY/max,0),1);
    bar.style.transform=`scaleX(${ratio})`;
    header?.classList.toggle('is-scrolled',scrollY>24);
    ticking=false;
  };
  addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(update)}},{passive:true});
  update();
}

function bootRoutePrefetch(){
  if(saveData||lowBandwidth)return;
  const prefetched=new Set();
  const prefetch=link=>{
    const url=new URL(link.href,location.href);
    if(url.origin!==location.origin||url.pathname===location.pathname||prefetched.has(url.href))return;
    if(!/\.(?:html)?$/.test(url.pathname)&&!url.pathname.endsWith('/'))return;
    const hint=document.createElement('link');
    hint.rel='prefetch';
    hint.href=url.href;
    hint.as='document';
    document.head.append(hint);
    prefetched.add(url.href);
  };
  selectAll('a[href]').forEach(link=>{
    link.addEventListener('pointerenter',()=>prefetch(link),{once:true,passive:true});
    link.addEventListener('focus',()=>prefetch(link),{once:true});
  });
}

function bootGalleryLightbox(){
  const images=selectAll('.gallery-item img,.image-strip img,.labelled-photo img,.archive-grid img');
  if(!images.length)return;
  const dialog=document.createElement('dialog');
  dialog.className='flow-lightbox';
  dialog.setAttribute('aria-label','Portfolio image viewer');
  dialog.innerHTML='<button class="flow-lightbox-close" type="button" aria-label="Close image viewer">×</button><button class="flow-lightbox-nav previous" type="button" aria-label="Previous image">←</button><figure><img alt=""><figcaption></figcaption></figure><button class="flow-lightbox-nav next" type="button" aria-label="Next image">→</button>';
  document.body.append(dialog);
  const viewer=dialog.querySelector('img');
  const caption=dialog.querySelector('figcaption');
  let index=0;
  let returnTarget=null;
  const describe=image=>image.closest('figure')?.querySelector('figcaption')?.textContent?.trim()||image.alt||'Flow Inc Ink portfolio work';
  const show=nextIndex=>{
    index=(nextIndex+images.length)%images.length;
    const image=images[index];
    viewer.src=image.currentSrc||image.src;
    viewer.alt=image.alt||'Flow Inc Ink portfolio work';
    caption.textContent=describe(image);
    if(!reduced&&dialog.open)viewer.animate([{opacity:.25,transform:'scale(.985)'},{opacity:1,transform:'scale(1)'}],{duration:260,easing:'cubic-bezier(.22,1,.36,1)'});
  };
  const open=image=>{
    index=images.indexOf(image);
    returnTarget=image.closest('figure')||image;
    show(index);
    dialog.showModal();
    dialog.querySelector('.flow-lightbox-close').focus();
  };
  images.forEach(image=>{
    const target=image.closest('figure')||image;
    target.classList.add('flow-viewable');
    target.tabIndex=target.tabIndex>=0?target.tabIndex:0;
    target.setAttribute('role','button');
    target.setAttribute('aria-label',`Open image: ${describe(image)}`);
    target.addEventListener('click',event=>{if(event.target.closest('a'))return;open(image)});
    target.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();open(image)}});
  });
  dialog.querySelector('.flow-lightbox-close').addEventListener('click',()=>dialog.close());
  dialog.querySelector('.previous').addEventListener('click',()=>show(index-1));
  dialog.querySelector('.next').addEventListener('click',()=>show(index+1));
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
  dialog.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft')show(index-1);
    if(event.key==='ArrowRight')show(index+1);
  });
  dialog.addEventListener('close',()=>returnTarget?.focus());
}

function bootFilterAccessibility(){
  const buttons=selectAll('[data-filter]');
  buttons.forEach(button=>button.setAttribute('aria-pressed',button.classList.contains('active')?'true':'false'));
  buttons.forEach(button=>button.addEventListener('click',()=>{
    buttons.forEach(item=>item.setAttribute('aria-pressed',item===button?'true':'false'));
    const visible=selectAll('.gallery-item:not(.hidden)');
    if(!reduced)visible.forEach((item,index)=>item.animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:320,delay:Math.min(index*35,210),easing:'cubic-bezier(.22,1,.36,1)',fill:'both'}));
  }));
}

function bootInstallAndNetworkState(){
  const status=document.createElement('div');
  status.className='flow-runtime-status';
  status.hidden=true;
  status.setAttribute('role','status');
  document.body.append(status);
  const setOffline=()=>{
    status.hidden=navigator.onLine;
    status.textContent=navigator.onLine?'':'Offline mode · cached pages remain available';
  };
  addEventListener('online',setOffline);
  addEventListener('offline',setOffline);
  setOffline();

  let installPrompt=null;
  addEventListener('beforeinstallprompt',event=>{
    event.preventDefault();
    installPrompt=event;
    const button=document.createElement('button');
    button.className='flow-install';
    button.type='button';
    button.textContent='Install studio app';
    button.addEventListener('click',async()=>{
      if(!installPrompt)return;
      installPrompt.prompt();
      await installPrompt.userChoice;
      installPrompt=null;
      button.remove();
    });
    document.body.append(button);
  },{once:true});
}

function bootPerformanceDebug(){
  if(!new URLSearchParams(location.search).has('flow-debug')||!('PerformanceObserver'in window))return;
  const metrics={};
  const report=()=>console.table({...metrics,tier,saveData,connection:connection?.effectiveType||'unknown'});
  try{new PerformanceObserver(list=>{metrics.LCP=Math.round(list.getEntries().at(-1)?.startTime||0);report()}).observe({type:'largest-contentful-paint',buffered:true})}catch{}
  try{let cls=0;new PerformanceObserver(list=>{for(const entry of list.getEntries())if(!entry.hadRecentInput)cls+=entry.value;metrics.CLS=Number(cls.toFixed(3));report()}).observe({type:'layout-shift',buffered:true})}catch{}
  try{new PerformanceObserver(list=>{metrics.INP=Math.round(Math.max(metrics.INP||0,...list.getEntries().map(entry=>entry.duration)));report()}).observe({type:'event',buffered:true,durationThreshold:40})}catch{}
}

bootScrollState();
bootRoutePrefetch();
bootGalleryLightbox();
bootFilterAccessibility();
bootInstallAndNetworkState();
bootPerformanceDebug();
root.classList.add('experience-ready');
