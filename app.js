const dialog=document.getElementById('bookingDialog');
const service=document.getElementById('serviceSelect');
const serviceLinks=document.querySelectorAll('.service-list a');
serviceLinks.forEach(link=>{link.style.display='flex';link.style.justifyContent='space-between';link.style.width='100%';link.style.padding='20px 0';link.style.borderBottom='1px solid #bbb';link.style.textTransform='uppercase';link.style.letterSpacing='.08em'});
document.querySelectorAll('[data-open-booking]').forEach(b=>b.addEventListener('click',()=>dialog?.showModal()));
document.querySelectorAll('[data-service]').forEach(b=>b.addEventListener('click',()=>{if(service)service.value=b.dataset.service;if(dialog)dialog.showModal()}));
const menu=document.querySelector('.menu-btn');
menu?.addEventListener('click',e=>{const h=document.querySelector('.site-header');h?.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',h?.classList.contains('open')?'true':'false')});
document.querySelectorAll('.desktop-nav a').forEach(a=>a.addEventListener('click',()=>document.querySelector('.site-header')?.classList.remove('open')));
document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');document.querySelectorAll('.gallery-item').forEach(item=>item.classList.toggle('hidden',btn.dataset.filter!=='all'&&item.dataset.category!==btn.dataset.filter))}));
const bookingForm=document.getElementById('bookingForm');
bookingForm?.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(e.currentTarget);const msg=`Hi Flow Inc Ink, I'd like to make an enquiry.%0A%0AService: ${encodeURIComponent(d.get('service'))}%0AArtist: ${encodeURIComponent(d.get('artist'))}%0AName: ${encodeURIComponent(d.get('name'))}%0APhone: ${encodeURIComponent(d.get('phone'))}%0AEmail: ${encodeURIComponent(d.get('email'))}%0ADetails: ${encodeURIComponent(d.get('brief'))}`;window.open(`https://wa.me/27606184165?text=${msg}`,'_blank');dialog?.close()});
const notifyForm=document.getElementById('notifyForm');
notifyForm?.addEventListener('submit',e=>{e.preventDefault();const email=e.currentTarget.querySelector('input')?.value||'';const msg=`Hi Flow Inc Ink, please add me to tour and event updates.%0AEmail: ${encodeURIComponent(email)}`;document.getElementById('notifyMessage').textContent='Opening WhatsApp so the studio can confirm your update request.';window.open(`https://wa.me/27606184165?text=${msg}`,'_blank');e.currentTarget.reset()});
const blogSubscribeForm=document.getElementById('blogSubscribeForm');
blogSubscribeForm?.addEventListener('submit',e=>{e.preventDefault();const email=e.currentTarget.querySelector('input')?.value||'';const msg=`Hi Flow Inc Ink, please subscribe me to blog updates.%0AEmail: ${encodeURIComponent(email)}`;const msg_el=document.getElementById('blogSubscribeMessage');if(msg_el)msg_el.textContent='Thanks! Opening WhatsApp so the studio can confirm your subscription.';window.open(`https://wa.me/27606184165?text=${msg}`,'_blank');e.currentTarget.reset()});
const contactForm=document.getElementById('contactForm');
contactForm?.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(e.currentTarget);const msg=`Hi Flow Inc Ink, I have an enquiry.%0A%0AName: ${encodeURIComponent(d.get('name'))}%0AEmail: ${encodeURIComponent(d.get('email'))}%0AMessage: ${encodeURIComponent(d.get('message'))}`;window.open(`https://wa.me/27606184165?text=${msg}`,'_blank');e.currentTarget.reset()});
if('serviceWorker'in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}))}
