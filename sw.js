const CACHE='flow-inc-runtime-v6';
const PRECACHE=[
  '/','/index.html','/services.html','/about.html','/tours-events.html','/events.html','/contact.html','/blog.html',
  '/blog/tattoo-aftercare-basics.html','/blog/sanitary-practices-you-should-expect.html','/blog/why-sobriety-matters-before-ink-or-piercing.html',
  '/styles.css','/app.js','/motion.css','/motion-system.js','/manifest.webmanifest','/icon.svg','/assets/logo.svg','/assets/hero.svg','/assets/shop-front.svg'
];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(PRECACHE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(Promise.all([
  caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))),
  self.clients.claim()
])));
async function networkFirst(request){
  const cache=await caches.open(CACHE);
  try{const response=await fetch(request);if(response.ok)cache.put(request,response.clone());return response}
  catch{const cached=await cache.match(request);return cached||cache.match('/index.html')}
}
async function staleWhileRevalidate(request){
  const cache=await caches.open(CACHE);
  const cached=await cache.match(request);
  const update=fetch(request).then(response=>{if(response.ok)cache.put(request,response.clone());return response}).catch(()=>null);
  return cached||update||Response.error()
}
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  if(request.mode==='navigate'){event.respondWith(networkFirst(request));return}
  event.respondWith(staleWhileRevalidate(request));
});
