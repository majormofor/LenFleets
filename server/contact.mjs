export const interests = ['Fleet and logistics','Security','Care services','Asset tracking','LensFleet Home','Content creators','General enquiry'];

export function validateContact(input) {
  const errors = {};
  const clean = {};
  if (!input || typeof input !== 'object' || Array.isArray(input)) return {errors:{form:'Provide valid enquiry details.'},clean};
  for (const [field,max] of [['name',120],['email',200],['company',160],['interest',80],['message',4000],['website',200]]) {
    const value = input[field];
    if(value != null && typeof value !== 'string') {errors[field]='Enter a text value.';continue}
    clean[field]=(value||'').trim();
    if(clean[field].length>max)errors[field]=`Use no more than ${max} characters.`;
  }
  if(!errors.name && (clean.name.length<2||/[\r\n\0]/.test(clean.name)))errors.name='Enter your full name.';
  if(!errors.email && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email)||/[\r\n\0]/.test(clean.email)))errors.email='Enter a valid email address.';
  if(!interests.includes(clean.interest))errors.interest='Choose an area of interest.';
  if(!errors.message && clean.message.length<10)errors.message='Use at least 10 characters in your message.';
  if(typeof input.elapsedMs!=='number'||!Number.isFinite(input.elapsedMs)||input.elapsedMs<800)errors.form='Please take a moment to complete your enquiry.';
  clean.requestType=input.requestType==='waitlist'?'waitlist':input.requestType==='demo'?'demo':'enquiry';
  return {errors,clean};
}

export function createContactHandler(env={}, {fetchImpl=fetch,now=Date.now}={}) {
  const attempts = new Map();
  const json = (res,status,body) => {res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(body))};
  return async function contact(req,res) {
    if(req.method!=='POST') {res.setHeader('Allow','POST');return json(res,405,{accepted:false,message:'Use POST to send an enquiry.'})}
    const origin=req.headers.origin;
    // Do not trust Host to authorise arbitrary origins. Explicit origin is required in production.
    const allowed=env.SITE_ORIGIN||env.RENDER_EXTERNAL_URL||'http://127.0.0.1:5173';
    const localOrigins=env.NODE_ENV==='production'?[]:['http://localhost:5173','http://127.0.0.1:5173'];
    if(origin&&origin!==allowed&&!localOrigins.includes(origin))return json(res,403,{accepted:false,message:'This origin is not authorised to submit enquiries.'});
    if(!String(req.headers['content-type']||'').toLowerCase().startsWith('application/json'))return json(res,415,{accepted:false,message:'Use JSON for enquiry details.'});
    // Use the socket address, not user-supplied forwarding headers. Configure trusted proxy limiting at the edge if required.
    const ip=req.socket.remoteAddress||'unknown';
    const time=now();
    for(const [key,entry] of attempts) if(time-entry.start>600000)attempts.delete(key);
    const entry=attempts.get(ip)||{start:time,count:0};entry.count++;attempts.set(ip,entry);
    if(entry.count>5){res.setHeader('Retry-After','600');return json(res,429,{accepted:false,message:'Too many attempts. Please try again later or email info@lensfleet.com.'})}
    let raw='';let tooLarge=false;
    try {
      for await (const chunk of req){raw+=chunk;if(Buffer.byteLength(raw)>16000){tooLarge=true;break}}
      if(tooLarge)return json(res,413,{accepted:false,message:'Your enquiry is too large.'});
      let input;try{input=JSON.parse(raw)}catch{return json(res,400,{accepted:false,message:'The enquiry details could not be read.'})}
      const {errors,clean}=validateContact(input);
      if(Object.keys(errors).length)return json(res,422,{accepted:false,errors,message:'Please check your enquiry details.'});
      if(clean.website)return json(res,422,{accepted:false,message:'This enquiry could not be accepted. Please contact us directly.'});
      if(!env.RESEND_API_KEY||!env.CONTACT_FROM_EMAIL||!env.CONTACT_TO_EMAIL)return json(res,503,{accepted:false,message:'Your enquiry has not been sent. The contact delivery service is not configured yet. Please email info@lensfleet.com.'});
      const text=`LensFleet ${clean.requestType}\n\nName: ${clean.name}\nEmail: ${clean.email}\nOrganisation: ${clean.company||'Not provided'}\nInterest: ${clean.interest}\n\n${clean.message}`;
      const delivery=await fetchImpl('https://api.resend.com/emails',{method:'POST',signal:AbortSignal.timeout(12000),headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({from:env.CONTACT_FROM_EMAIL,to:[env.CONTACT_TO_EMAIL],reply_to:clean.email,subject:`LensFleet ${clean.requestType}: ${clean.interest}`,text})});
      const result=await delivery.json().catch(()=>null);
      if(!delivery.ok||typeof result?.id!=='string')return json(res,502,{accepted:false,message:'The delivery service did not accept your enquiry. Please try again or email info@lensfleet.com.'});
      return json(res,200,{accepted:true,message:'Enquiry accepted for delivery.'});
    } catch {return json(res,502,{accepted:false,message:'The enquiry service could not complete your request. Please try again or contact us directly.'})}
  };
}
