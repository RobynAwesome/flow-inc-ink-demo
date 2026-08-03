import {readdir,readFile,stat} from 'node:fs/promises';
import path from 'node:path';

const root=process.cwd();
const errors=[];
const warnings=[];
const required=['index.html','services.html','about.html','tours-events.html','contact.html','blog.html','app.js','styles.css','motion-system.js','motion.css','experience-system.js','experience.css','social-map-system.js','social-map.css','map-system.js','social-feed-system.js','api/instagram-feed.js','api/facebook-feed.js','sw.js','manifest.webmanifest','vercel.json','content-approvals.json'];

async function exists(file){try{await stat(path.join(root,file));return true}catch{return false}}
async function walk(dir='.'){
  const entries=await readdir(path.join(root,dir),{withFileTypes:true});
  const files=[];
  for(const entry of entries){
    if(['.git','node_modules'].includes(entry.name))continue;
    const rel=path.join(dir,entry.name);
    if(entry.isDirectory())files.push(...await walk(rel));else files.push(rel.replaceAll('\\','/'));
  }
  return files;
}

for(const file of required)if(!await exists(file))errors.push(`Missing required production file: ${file}`);
const files=await walk();
const htmlFiles=files.filter(file=>file.endsWith('.html'));
const localRefPattern=/(?:href|src)=["']([^"']+)["']/g;
const externalPattern=/^(?:https?:|mailto:|tel:|whatsapp:|data:|javascript:|#)/i;

for(const file of htmlFiles){
  const source=await readFile(path.join(root,file),'utf8');
  const ids=[...source.matchAll(/\sid=["']([^"']+)["']/g)].map(match=>match[1]);
  const duplicates=ids.filter((id,index)=>ids.indexOf(id)!==index);
  if(duplicates.length)errors.push(`${file}: duplicate IDs: ${[...new Set(duplicates)].join(', ')}`);
  if(/<img\b(?![^>]*\balt=)[^>]*>/i.test(source))errors.push(`${file}: image without alt text`);
  for(const match of source.matchAll(localRefPattern)){
    const ref=match[1];
    if(externalPattern.test(ref))continue;
    const clean=decodeURIComponent(ref.split(/[?#]/)[0]);
    if(!clean)continue;
    const resolved=clean.startsWith('/')?clean.slice(1):path.normalize(path.join(path.dirname(file),clean)).replaceAll('\\','/');
    const candidate=resolved===''?'index.html':resolved;
    if(!await exists(candidate))errors.push(`${file}: missing local reference ${ref} -> ${candidate}`);
  }
  if(/target=["']_blank["']/.test(source)&&!/(?:noopener|noreferrer)/.test(source))warnings.push(`${file}: review target=_blank rel protections`);
}

const app=await readFile(path.join(root,'app.js'),'utf8');
if(!app.includes('checkValidity()')||!app.includes('reportValidity()'))errors.push('Forms do not enforce browser validity before opening WhatsApp.');
if(!app.includes("import('/motion-system.js')"))errors.push('Adaptive motion runtime is not loaded.');
if(!app.includes("import('/social-map-system.js')"))errors.push('Social and map runtime is not loaded.');
const motionCss=await readFile(path.join(root,'motion.css'),'utf8');
if(!motionCss.includes('prefers-reduced-motion'))errors.push('Motion does not respect reduced-motion preferences.');
const socialMap=await readFile(path.join(root,'social-map-system.js'),'utf8');
if(!socialMap.includes('@flow_inc_ink')||!socialMap.includes('@snow_ink_flow')||!socialMap.includes('@inkboy_que_backup'))errors.push('Client-provided Instagram profiles are not represented in the social hub.');
if(!socialMap.includes('data-flow-map'))errors.push('Interactive map mount is missing.');
const worker=await readFile(path.join(root,'sw.js'),'utf8');
if(!worker.includes("request.mode==='navigate'"))errors.push('Service worker does not use a navigation-specific strategy.');
if(!worker.includes('url.origin!==self.location.origin'))errors.push('Service worker may intercept cross-origin requests.');
if(!worker.includes("url.pathname.startsWith('/api/')"))errors.push('Service worker may cache live social API responses.');
const vercel=JSON.parse(await readFile(path.join(root,'vercel.json'),'utf8'));
const vercelText=JSON.stringify(vercel);
if(!vercelText.includes('X-Robots-Tag')||!vercelText.includes('noindex'))errors.push('Draft Blog POC is indexable before studio/source approval.');
const approvals=JSON.parse(await readFile(path.join(root,'content-approvals.json'),'utf8'));
if(approvals.social?.liveInstagramMediaActive&&!approvals.social?.instagramProfessionalAccountsAuthorised)errors.push('Instagram feed cannot be marked live before account authorisation.');
if(approvals.social?.publicInstagramCommentsActive&&!approvals.social?.instagramProfessionalAccountsAuthorised)errors.push('Instagram comments cannot be public before account authorisation.');
if(approvals.social?.liveFacebookFeedActive&&!approvals.social?.facebookPageAuthorised)errors.push('Facebook feed cannot be marked live before Page authorisation.');

for(const file of files.filter(file=>/\.(svg|html|css|js)$/.test(file))){
  const source=await readFile(path.join(root,file),'utf8');
  const bytes=Buffer.byteLength(source);
  if(source.includes('data:image/')&&bytes>300_000)warnings.push(`${file}: embedded image payload is ${(bytes/1024).toFixed(0)} KB; convert to responsive WebP/AVIF assets.`);
}

for(const file of htmlFiles.filter(file=>file==='blog.html'||file.startsWith('blog/'))){
  const source=await readFile(path.join(root,file),'utf8');
  if(/\b2025\b/.test(source))warnings.push(`${file}: publication date appears backdated and requires client evidence.`);
  if(/By Flow Inc Ink Studio/.test(source))warnings.push(`${file}: authorship requires explicit studio approval.`);
  if(/At Flow Inc Ink, (?:we|compliance)/.test(source))warnings.push(`${file}: operational claim requires studio evidence before publication.`);
}

console.log(`Audited ${htmlFiles.length} HTML files and ${files.length} repository files.`);
for(const warning of warnings)console.warn(`WARN: ${warning}`);
for(const error of errors)console.error(`ERROR: ${error}`);
console.log(`Result: ${errors.length} errors, ${warnings.length} warnings.`);
if(errors.length)process.exit(1);
