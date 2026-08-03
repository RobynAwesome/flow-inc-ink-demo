function addStylesheet(href){if(document.querySelector(`link[href="${href}"]`))return;const link=document.createElement('link');link.rel='stylesheet';link.href=href;document.head.append(link)}
addStylesheet('/social-map.css');
const tasks=[];
if(document.querySelector('[data-flow-map]'))tasks.push(import('/map-system.js'));
if(document.querySelector('[data-social-feed]'))tasks.push(import('/social-feed-system.js'));
Promise.allSettled(tasks).then(results=>results.forEach(result=>{if(result.status==='rejected')console.info('[Flow Social/Map] Progressive enhancement unavailable.',result.reason)}));
