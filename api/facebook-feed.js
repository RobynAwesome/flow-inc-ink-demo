function cleanComment(comment){
  const text=String(comment?.message||'').trim();
  if(!text||text.length>280||/https?:\/\//i.test(text))return null;
  return{name:comment?.from?.name||'Facebook user',text,created_time:comment.created_time||null};
}

module.exports=async function handler(request,response){
  response.setHeader('Cache-Control','s-maxage=300, stale-while-revalidate=3600');
  const pageId=process.env.FACEBOOK_PAGE_ID;const token=process.env.FACEBOOK_PAGE_ACCESS_TOKEN;const version=process.env.META_GRAPH_VERSION;
  if(!pageId||!token||!version)return response.status(200).json({configured:false,state:'verified-facebook-page-required',posts:[]});
  try{
    const fields=['id','message','created_time','permalink_url','full_picture'];
    if(process.env.PUBLIC_FACEBOOK_COMMENTS==='true')fields.push('comments.limit(3){message,created_time,from}');
    const url=new URL(`https://graph.facebook.com/${version}/${pageId}/posts`);
    url.searchParams.set('fields',fields.join(','));url.searchParams.set('limit','6');url.searchParams.set('access_token',token);
    const result=await fetch(url);
    if(!result.ok){const detail=await result.text();console.error('[Facebook API]',result.status,detail.slice(0,300));return response.status(502).json({configured:true,state:'meta-request-failed',posts:[]})}
    const json=await result.json();
    const posts=(json.data||[]).map(post=>({id:post.id,message:post.message||'',created_time:post.created_time,permalink_url:post.permalink_url,full_picture:post.full_picture||null,comments:(post.comments?.data||[]).map(cleanComment).filter(Boolean)}));
    return response.status(200).json({configured:true,state:'live',commentsPublic:process.env.PUBLIC_FACEBOOK_COMMENTS==='true',posts});
  }catch(error){console.error('[Facebook API]',error);return response.status(502).json({configured:true,state:'meta-request-error',posts:[]})}
};
