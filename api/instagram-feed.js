const ACCOUNT_ENV={
  flow:['IG_FLOW_USER_ID','IG_FLOW_ACCESS_TOKEN'],
  snow:['IG_SNOW_USER_ID','IG_SNOW_ACCESS_TOKEN'],
  que:['IG_QUE_USER_ID','IG_QUE_ACCESS_TOKEN']
};

function publicComment(comment){
  const username=comment?.from?.username||comment?.username||'';
  const text=String(comment?.text||'').trim();
  if(!text||text.length>280||/https?:\/\//i.test(text))return null;
  return{username,text,timestamp:comment.timestamp||null};
}

async function getComments(base,version,mediaId,token){
  if(process.env.PUBLIC_IG_COMMENTS!=='true')return[];
  const url=new URL(`${base}/${version}/${mediaId}/comments`);
  url.searchParams.set('fields','from,text,timestamp');url.searchParams.set('limit','5');
  const result=await fetch(url,{headers:{authorization:`Bearer ${token}`}});
  if(!result.ok)return[];
  const json=await result.json();
  return(json.data||[]).map(publicComment).filter(Boolean).slice(0,2);
}

export default async function handler(request,response){
  response.setHeader('Cache-Control','s-maxage=300, stale-while-revalidate=3600');
  const account=String(request.query.account||'flow').toLowerCase();
  const envNames=ACCOUNT_ENV[account];
  if(!envNames)return response.status(400).json({configured:false,state:'unknown-account',account,media:[]});
  const [idName,tokenName]=envNames;
  const userId=process.env[idName];const token=process.env[tokenName];const version=process.env.META_GRAPH_VERSION;
  if(!userId||!token||!version)return response.status(200).json({configured:false,state:'meta-authorization-required',account,media:[]});
  const base=process.env.META_IG_GRAPH_BASE||'https://graph.instagram.com';
  try{
    const url=new URL(`${base}/${version}/${userId}/media`);
    url.searchParams.set('fields','id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,comments_count');
    url.searchParams.set('limit','6');
    const result=await fetch(url,{headers:{authorization:`Bearer ${token}`}});
    if(!result.ok){const detail=await result.text();console.error('[Instagram API]',result.status,detail.slice(0,300));return response.status(502).json({configured:true,state:'meta-request-failed',account,media:[]})}
    const json=await result.json();
    const media=await Promise.all((json.data||[]).map(async item=>({
      id:item.id,caption:item.caption||'',media_type:item.media_type,media_url:item.media_url||null,thumbnail_url:item.thumbnail_url||null,permalink:item.permalink,timestamp:item.timestamp,comments_count:item.comments_count||0,
      comments:await getComments(base,version,item.id,token)
    })));
    return response.status(200).json({configured:true,state:'live',account,commentsPublic:process.env.PUBLIC_IG_COMMENTS==='true',media});
  }catch(error){console.error('[Instagram API]',error);return response.status(502).json({configured:true,state:'meta-request-error',account,media:[]})}
}
