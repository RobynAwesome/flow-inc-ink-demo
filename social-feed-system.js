const ACCOUNTS={
  flow:{label:'Flow Inc Ink',handle:'@flow_inc_ink',url:'https://www.instagram.com/flow_inc_ink/'},
  snow:{label:'Snow Ink',handle:'@snow_ink_flow',url:'https://www.instagram.com/snow_ink_flow/'},
  que:{label:'Inkboy Que',handle:'@inkboy_que_backup',url:'https://www.instagram.com/inkboy_que_backup/'}
};

function createCard(item,response){
  const article=document.createElement('article');article.className='social-media-card';
  const link=document.createElement('a');link.href=item.permalink||ACCOUNTS[response.account].url;link.target='_blank';link.rel='noopener noreferrer';
  const image=document.createElement('img');image.src=item.thumbnail_url||item.media_url||'/assets/hero.svg';image.alt=item.caption?item.caption.slice(0,120):`${response.label} Instagram post`;image.loading='lazy';image.decoding='async';
  link.append(image);article.append(link);
  const body=document.createElement('div');body.className='social-media-body';
  const meta=document.createElement('div');meta.className='social-media-meta';
  const name=document.createElement('strong');name.textContent=response.handle;
  const date=document.createElement('time');if(item.timestamp){date.dateTime=item.timestamp;date.textContent=new Intl.DateTimeFormat('en-ZA',{dateStyle:'medium'}).format(new Date(item.timestamp))}
  meta.append(name,date);
  const caption=document.createElement('p');caption.className='social-media-caption';caption.textContent=item.caption||'Open this post on Instagram.';
  body.append(meta,caption);article.append(body);
  if(Array.isArray(item.comments)&&item.comments.length){
    const comments=document.createElement('div');comments.className='social-comments';
    item.comments.slice(0,2).forEach(comment=>{
      const row=document.createElement('div');row.className='social-comment';
      const author=document.createElement('strong');author.textContent=comment.username?`@${comment.username} `:'Comment: ';
      row.append(author,document.createTextNode(comment.text||''));comments.append(row);
    });
    article.append(comments);
  }
  return article;
}

async function getFeed(account){
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),7000);
  try{const response=await fetch(`/api/instagram-feed?account=${encodeURIComponent(account)}`,{headers:{accept:'application/json'},signal:controller.signal});if(!response.ok)throw new Error(String(response.status));return await response.json()}
  finally{clearTimeout(timeout)}
}

async function bootSocialFeed(){
  const root=document.querySelector('[data-social-feed]');if(!root)return;
  const status=document.querySelector('[data-social-status]');
  const accountKeys=(root.dataset.accounts||'flow,snow,que').split(',').map(value=>value.trim()).filter(Boolean);
  const responses=await Promise.all(accountKeys.map(async account=>{
    try{const data=await getFeed(account);return{...data,account,label:ACCOUNTS[account]?.label||account,handle:ACCOUNTS[account]?.handle||account}}
    catch(error){return{configured:false,account,label:ACCOUNTS[account]?.label||account,handle:ACCOUNTS[account]?.handle||account,media:[],error:error.message}}
  }));
  const media=responses.flatMap(response=>(response.media||[]).map(item=>({item,response}))).sort((a,b)=>new Date(b.item.timestamp||0)-new Date(a.item.timestamp||0)).slice(0,9);
  root.replaceChildren();
  if(media.length){media.forEach(({item,response})=>root.append(createCard(item,response)));if(status)status.textContent=`Live professional-account feed · ${media.length} recent posts`;return}
  const empty=document.createElement('div');empty.className='social-empty';
  const text=document.createElement('p');text.textContent='Live posts and moderated comments activate after each professional Instagram account authorises the Flow Inc Ink Meta app.';
  const link=document.createElement('a');link.href=ACCOUNTS.flow.url;link.target='_blank';link.rel='noopener noreferrer';link.textContent='Open @flow_inc_ink on Instagram ↗';
  empty.append(text,link);root.append(empty);if(status)status.textContent='POC connection shell · Meta authorisation pending';
}

bootSocialFeed().catch(error=>console.info('[Flow Social] Profile-link fallback active.',error));
