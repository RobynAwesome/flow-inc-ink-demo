import {readFile} from 'node:fs/promises';

const read=path=>readFile(path,'utf8');
const approvals=JSON.parse(await read('content-approvals.json'));
const vercel=await read('vercel.json');
const app=await read('app.js');
const motion=await read('motion-system.js');
const errors=[];

const allowedSiteStates=new Set(['poc-preview','client-facing-poc']);
if(!allowedSiteStates.has(approvals.siteStatus)){
  errors.push('Site status must remain an explicit POC state until production evidence is recorded.');
}

if(approvals.blog.publicationStatus!=='published'){
  if(!vercel.includes('noindex, nofollow'))errors.push('Draft Blog must remain noindex.');
  if(!motion.includes('Educational POC'))errors.push('Draft Blog must expose a visible POC disclosure.');
}

if(!approvals.blog.emailAutomationActive&&!app.includes('Email automation is not active yet')){
  errors.push('Blog subscription UI must disclose that automated email is inactive.');
}

if(!approvals.blog.healthContentReviewed&&!motion.includes('Not medical advice')){
  errors.push('Unreviewed health content must be presented as draft education, not medical advice.');
}

if(!approvals.tours.countriesApproved&&!motion.includes('Tour locations, dates, flags and photographs must remain tied to client-supplied evidence')){
  errors.push('Tour claims require an evidence boundary until countries are approved.');
}

if(approvals.tours.locationSpecificTourPhotographsCommitted&& !approvals.tours.photographsApproved){
  errors.push('Tour photographs cannot be treated as approved before client approval is recorded.');
}

if(approvals.blog.emailAutomationActive&&(!approvals.blog.subscriberDatabaseImplemented||!approvals.blog.periodicPublishingWorkflowImplemented)){
  errors.push('Email automation cannot be marked active without subscriber storage and a publishing workflow.');
}

if(approvals.blog.seoPublicationActive&&approvals.blog.publicationStatus!=='published'){
  errors.push('SEO publication cannot be active while the Blog remains draft POC.');
}

if(approvals.experience.productionPerformanceVerified){
  errors.push('productionPerformanceVerified cannot be true until measured production evidence is committed.');
}

if(approvals.experience.latestVercelCommitVerified&&!approvals.experience.productionPerformanceVerified){
  console.warn('WARN: Vercel commit verification does not by itself prove production performance.');
}

if(errors.length){
  errors.forEach(error=>console.error(`ERROR: ${error}`));
  process.exit(1);
}

console.log('POC content guard passed. Unapproved claims remain visibly and technically constrained.');
