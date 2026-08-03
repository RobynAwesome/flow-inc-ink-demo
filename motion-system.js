const MOTION_VERSION='12.42.1';
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const connection=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
const saveData=Boolean(connection?.saveData);
const lowHardware=(navigator.deviceMemory&&navigator.deviceMemory<=4)||(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4);
const tier=reduceMotion?'reduced':saveData||lowHardware?'soft':'full';
document.documentElement.dataset.motionTier=tier;

const css=document.createElement('link');
css.rel='stylesheet';
css.href='/motion.css';
document.head.append(css);

function selectAll(selector){return [...document.querySelectorAll(selector)]}
function markReveal(elements){elements.forEach(el=>el.dataset.motionReveal='')}
function nativeReveal(elements){
  if(reduceMotion)return;
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      const el=entry.target;
      el.animate([
        {opacity:0,transform:'translate3d(0,24px,0)'},
        {opacity:1,transform:'translate3d(0,0,0)'}
      ],{duration:tier==='soft'?360:620,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'});
      observer.unobserve(el);
    });
  },{rootMargin:'0px 0px -8% 0px',threshold:.08});
  elements.forEach(el=>observer.observe(el));
}

async function loadMotion(){
  if(reduceMotion)return null;
  try{return await import(`https://cdn.jsdelivr.net/npm/motion@${MOTION_VERSION}/+esm`)}
  catch(error){console.info('[Flow Motion] Native fallback active.',error);return null}
}

function addPointerWarmth(){
  if(tier!=='full'||matchMedia('(pointer: coarse)').matches)return;
  let raf=0;
  addEventListener('pointermove',event=>{
    cancelAnimationFrame(raf);
    raf=requestAnimationFrame(()=>{
      document.documentElement.style.setProperty('--pointer-x',`${event.clientX}px`);
      document.documentElement.style.setProperty('--pointer-y',`${event.clientY}px`);
    });
  },{passive:true});
}

function bootDisclosure(){
  const path=location.pathname;
  const disclosure=document.createElement('aside');
  disclosure.className='poc-disclosure';
  disclosure.setAttribute('role','note');

  if(path==='/blog.html'||path.startsWith('/blog/')){
    disclosure.innerHTML='<strong>Educational POC</strong> — Studio review and source approval are required before these drafts are treated as published medical, legal or operational guidance. Email automation is not active yet; the current form opens WhatsApp.';
    document.querySelector('main')?.before(disclosure);
    document.querySelectorAll('.blog-card-meta').forEach(meta=>meta.textContent='Draft POC · Studio review required');
    const eyebrow=document.querySelector('.blog-post-hero .eyebrow');
    const postMeta=document.querySelector('.blog-post-hero .post-meta');
    if(eyebrow)eyebrow.textContent='Education draft · Studio review required';
    if(postMeta)postMeta.textContent='Prepared for Flow Inc Ink · Not medical advice';
  }

  if(path==='/tours-events.html'||path==='/events.html'){
    disclosure.innerHTML='<strong>Evidence boundary</strong> — Tour locations, dates, flags and photographs must remain tied to client-supplied evidence. Unconfirmed destinations and upcoming dates are not presented as completed events.';
    document.querySelector('main')?.before(disclosure);
  }

  document.querySelectorAll('p').forEach(paragraph=>{
    if(paragraph.textContent.includes('no third-party servers, no data stored')){
      paragraph.textContent='Submitting opens WhatsApp, a third-party service. Flow Inc Ink receives the prepared message only after you choose to send it.';
    }
  });
}

const revealSelector=[
  '.hero-copy>*','.page-hero-copy>*','.contact-hero-copy>*','.blog-post-hero>*',
  '.section-kicker','.section h2','.work-head>*','.gallery-item','.feature-grid article',
  '.hub-grid article','.experience article','.review-grid blockquote','.price-card',
  '.labelled-photo','.archive-grid figure','.contact-info-grid article','.blog-card'
].join(',');
const revealElements=selectAll(revealSelector);
markReveal(revealElements);

const motion=await loadMotion();
if(motion){
  const {animate,inView,scroll,stagger}=motion;
  const intro=selectAll('.hero-copy>* , .page-hero-copy>* , .contact-hero-copy>* , .blog-post-hero>*');
  if(intro.length){
    animate(intro,{opacity:[0,1],transform:['translate3d(0,28px,0)','translate3d(0,0,0)']},{duration:tier==='soft'?.42:.72,delay:stagger(tier==='soft'?.035:.07),ease:[.22,1,.36,1]});
  }
  inView(revealElements.filter(el=>!intro.includes(el)),element=>{
    animate(element,{opacity:[0,1],transform:['translate3d(0,22px,0)','translate3d(0,0,0)']},{duration:tier==='soft'?.34:.58,ease:[.22,1,.36,1]});
  },{amount:.12,margin:'0px 0px -7% 0px'});

  const heroImage=document.querySelector('.hero-image');
  if(heroImage&&tier==='full'){
    scroll(animate(heroImage,{transform:['scale(1.035) translate3d(0,0,0)','scale(1.08) translate3d(0,4vh,0)']},{ease:'linear'}),{target:document.querySelector('.hero'),offset:['start start','end start']});
  }

  selectAll('.outline-btn,.solid-btn,.outline-dark,.outline-light,.floating-whatsapp').forEach(control=>{
    control.addEventListener('pointerenter',()=>animate(control,{transform:'translate3d(0,-2px,0) scale(1.015)'},{duration:.18}));
    control.addEventListener('pointerleave',()=>animate(control,{transform:'translate3d(0,0,0) scale(1)'},{duration:.24}));
  });
}else{
  nativeReveal(revealElements);
}

addPointerWarmth();
bootDisclosure();
document.documentElement.classList.add('motion-ready');
