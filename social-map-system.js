function addStylesheet(href){if(document.querySelector(`link[href="${href}"]`))return;const link=document.createElement('link');link.rel='stylesheet';link.href=href;document.head.append(link)}

const socialMarkup=`
<section class="social-pulse" id="social-pulse" aria-labelledby="social-pulse-title">
  <div class="social-pulse-head">
    <div><span class="section-kicker">Studio pulse · artists · community</span><h2 id="social-pulse-title">Follow the work<br>as it moves.</h2></div>
    <div><p class="social-pulse-copy">The studio account carries the company portfolio. Snow and Inkboy Que carry artist-specific work, process and personality. Live media activates only through authorised Meta professional accounts; profile links remain available at all times.</p><div class="social-links-inline"><a href="https://wa.me/27606184165?text=Hi%20Flow%20Inc%20Ink%2C%20I%27d%20like%20to%20book" target="_blank" rel="noopener noreferrer">WhatsApp booking ↗</a><a href="/contact.html">Studio contact →</a></div></div>
  </div>
  <div class="social-accounts" aria-label="Flow Inc Ink Instagram profiles">
    <a class="social-account-card" href="https://www.instagram.com/flow_inc_ink/" target="_blank" rel="noopener noreferrer"><small>Company portfolio</small><strong>Flow Inc Ink</strong><span>@flow_inc_ink</span></a>
    <a class="social-account-card" href="https://www.instagram.com/snow_ink_flow/" target="_blank" rel="noopener noreferrer"><small>Founder · Head artist</small><strong>Snow Ink</strong><span>@snow_ink_flow</span></a>
    <a class="social-account-card" href="https://www.instagram.com/inkboy_que_backup/" target="_blank" rel="noopener noreferrer"><small>Tattoo artist</small><strong>Inkboy Que</strong><span>@inkboy_que_backup</span></a>
  </div>
  <div class="social-feed-status"><strong>Meta feed state</strong><span data-social-status aria-live="polite">Checking professional-account connection…</span></div>
  <div class="social-feed-grid" data-social-feed data-accounts="flow,snow,que" aria-live="polite"><div class="social-empty"><p>Loading the latest authorised studio media…</p></div></div>
  <p class="social-governance">Comments are displayed only after the studio enables public-comment moderation. A Facebook Page feed cannot be published until the client supplies and authorises the canonical Page ID. No account is scraped and no access token is exposed in the browser.</p>
</section>`;

const mapMarkup=`
<div class="live-map-shell">
  <div class="studio-map" data-flow-map tabindex="0" role="application" aria-label="Interactive map showing Flow Inc Ink at Boulders Shopping Centre"></div>
  <div class="map-panel"><span class="section-kicker">Interactive studio map</span><h2>Zoom in.<br>Find the flow.</h2><p>Flow Inc Ink is at Shop M3A, Boulders Shopping Centre, 1685 Old Pretoria Road, Halfway House Estate, Midrand, Gauteng.</p><div class="map-toolbar"><button class="primary" type="button" data-map-command="studio">Centre studio</button><button type="button" data-map-command="zoom-in" aria-label="Zoom map in">Zoom +</button><button type="button" data-map-command="zoom-out" aria-label="Zoom map out">Zoom −</button><a href="https://www.google.com/maps/search/?api=1&query=Flow%20Inc%20Ink%2C%20Shop%20M3A%2C%20Boulders%20Shopping%20Centre%2C%20Midrand%2C%20Gauteng" target="_blank" rel="noopener noreferrer">Google Maps directions ↗</a></div></div>
</div>`;

function mountSocial(){
  if(!['/','/index.html','/contact.html'].includes(location.pathname)||document.querySelector('#social-pulse'))return;
  const anchor=location.pathname==='/contact.html'?document.querySelector('.contact-details'):document.querySelector('.contact');
  if(anchor)anchor.insertAdjacentHTML('beforebegin',socialMarkup);
}

function mountMap(){
  if(document.querySelector('[data-flow-map]'))return;
  if(location.pathname==='/contact.html'){
    const section=document.querySelector('.map-section');
    if(section){section.className='live-map-section';section.innerHTML=mapMarkup}
    return;
  }
  if(location.pathname==='/'||location.pathname==='/index.html'){
    const contact=document.querySelector('.contact');
    if(contact)contact.insertAdjacentHTML('beforebegin',`<section class="live-map-section" aria-label="Flow Inc Ink location">${mapMarkup}</section>`);
  }
}

function linkArtists(){
  document.querySelectorAll('.team-grid article').forEach(card=>{
    const name=card.querySelector('h3')?.textContent||'';
    let url='';let label='';
    if(name.includes('Snow')){url='https://www.instagram.com/snow_ink_flow/';label='View @snow_ink_flow ↗'}
    if(name.includes('Inkboy Que')){url='https://www.instagram.com/inkboy_que_backup/';label='View @inkboy_que_backup ↗'}
    if(!url||card.querySelector('.artist-social-link'))return;
    const link=document.createElement('a');link.className='artist-social-link text-link';link.href=url;link.target='_blank';link.rel='noopener noreferrer';link.textContent=label;card.append(link);
  });
}

addStylesheet('/social-map.css');
mountSocial();mountMap();linkArtists();
const tasks=[];
if(document.querySelector('[data-flow-map]'))tasks.push(import('/map-system.js'));
if(document.querySelector('[data-social-feed]'))tasks.push(import('/social-feed-system.js'));
Promise.allSettled(tasks).then(results=>results.forEach(result=>{if(result.status==='rejected')console.info('[Flow Social/Map] Progressive enhancement unavailable.',result.reason)}));
