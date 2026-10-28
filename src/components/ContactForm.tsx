import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowUpRight, CircleAlert, CheckCircle2, LoaderCircle } from 'lucide-react';
import { interests, countries, fleetSizes, timelines } from '../content/site';

type Errors = Record<string,string>;
export function ContactForm({demo=false,waitlist=false,quote=""}:{demo?:boolean;waitlist?:boolean;quote?:string}){
 const started=useRef(Date.now());
 const [status,setStatus]=useState<'idle'|'loading'|'success'|'error'>('idle');
 const [message,setMessage]=useState('');
 const [errors,setErrors]=useState<Errors>({});
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();
  const form=event.currentTarget;
  const data=Object.fromEntries(new FormData(form));
  const next:Errors={};
  if(String(data.name||'').trim().length<2)next.name='Enter your full name.';
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email||'')))next.email='Enter a valid email address.';
  if(!interests.includes(String(data.interest)))next.interest='Choose an area of interest.';
  if(!countries.includes(String(data.country)))next.country='Choose your country.';
  setErrors(next);
  if(Object.keys(next).length){setStatus('error');setMessage('Please check the highlighted fields.');form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();return}
  setStatus('loading');setMessage('');
  try{
   // Same-origin by default, which is what the Node server serves. On a static
   // host with no Node (Hostinger shared hosting, Netlify, a plain S3 bucket)
   // set VITE_CONTACT_ENDPOINT at build time to the full URL of a deployment
   // that does run the API, and set SITE_ORIGIN there to this site's origin so
   // its origin check accepts the post.
   const endpoint=(import.meta as {env?:Record<string,string>}).env?.VITE_CONTACT_ENDPOINT||'/api/contact';
   const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...data,currency:quote,elapsedMs:Date.now()-started.current,requestType:waitlist?'waitlist':quote?'quote':demo?'demo':'enquiry'}),signal:AbortSignal.timeout(20000)});
   const result=await response.json().catch(()=>({message:'The enquiry service is unavailable. Please email info@lensfleet.com.'}));
   if(!response.ok||result.accepted!==true){setErrors(result.errors||{});throw new Error(result.message||'Your enquiry was not accepted. Please try again or contact us directly.')}
   setStatus('success');setMessage('Thanks — your message is on its way to the LensFleet team. We reply from info@lensfleet.com, so check your spam folder if you have not heard back within two working days.');form.reset();
  }catch(error){setStatus('error');setMessage(error instanceof Error&&error.name!=='TimeoutError'?error.message:'The service did not respond in time. Please try again or email info@lensfleet.com.')}
 }
 const error=(name:string)=>errors[name]?<span className="field-error" id={`${name}-error`}>{errors[name]}</span>:null;
 return <form className="contact-form" onSubmit={submit} noValidate aria-label={waitlist?'Get LensFleet Home':demo?'Book a LensFleet demo':'Contact LensFleet'}><div className="form-heading"><span className="form-number">Let’s talk</span><h2>{waitlist?'Get LensFleet Home.':quote?'Get an itemised quote.':demo?'Book a demo.':'Tell us what you need.'}</h2><p>Fleet size, city, and what you need to be able to show. We reply within one working day.</p></div><fieldset disabled={status==='loading'}><legend className="sr-only">Your enquiry details</legend><div className="form-row"><label htmlFor="name">Full name <span aria-hidden="true">*</span><input id="name" name="name" autoComplete="name" required minLength={2} maxLength={120} placeholder="Your full name" aria-invalid={!!errors.name} aria-describedby={errors.name?'name-error':undefined}/>{error('name')}</label><label htmlFor="email">Email address <span aria-hidden="true">*</span><input id="email" name="email" type="email" autoComplete="email" required maxLength={200} placeholder="you@company.com" aria-invalid={!!errors.email} aria-describedby={errors.email?'email-error':undefined}/>{error('email')}</label></div><div className="form-row"><label htmlFor="phone">Phone or WhatsApp <span className="optional">Optional</span><input name="phone" id="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={40} placeholder="+234 or +44…" aria-invalid={!!errors.phone} aria-describedby={errors.phone?'phone-error':undefined}/>{error('phone')}</label><label htmlFor="company">Company or organisation <span className="optional">Optional</span><input name="company" id="company" autoComplete="organization" maxLength={160} placeholder="Your organisation"/></label></div><div className="form-row"><label htmlFor="country">Country <span aria-hidden="true">*</span><select name="country" id="country" defaultValue="" required aria-invalid={!!errors.country} aria-describedby={errors.country?'country-error':undefined}><option value="" disabled>Choose your country</option>{countries.map(c=><option key={c}>{c}</option>)}</select>{error('country')}</label><label htmlFor="fleetSize">Vehicles or assets to cover <span className="optional">Optional</span><select name="fleetSize" id="fleetSize" defaultValue=""><option value="">Choose a range</option>{fleetSizes.map(f=><option key={f}>{f}</option>)}</select></label></div><label htmlFor="timeline">When would you want this running? <span className="optional">Optional</span><select name="timeline" id="timeline" defaultValue=""><option value="">Choose a timeline</option>{timelines.map(t=><option key={t}>{t}</option>)}</select></label><label htmlFor="interest">Area of interest <span aria-hidden="true">*</span><select name="interest" id="interest" defaultValue={waitlist?"LensFleet Home":""} required aria-invalid={!!errors.interest} aria-describedby={errors.interest?'interest-error':undefined}><option value="" disabled>Choose your area of interest</option>{interests.map(interest=><option key={interest}>{interest}</option>)}</select>{error('interest')}</label><label htmlFor="message">Anything else? <span className="optional">Optional</span><textarea name="message" id="message" rows={5} maxLength={4000} defaultValue={waitlist?'I’d like to set up LensFleet Home for my household. ':quote?`I’d like an itemised quote in ${quote==='GBP'?'GBP (£)':'NGN (₦)'}. `:demo?'I’d like a demo of LensFleet on my own routes. ':''} placeholder="Tell us about the devices, people, or operations you’d like to connect." aria-invalid={!!errors.message} aria-describedby={errors.message?'message-error':undefined}/>{error('message')}</label><div className="honeypot" aria-hidden="true"><label htmlFor="website">Leave this empty<input name="website" id="website" autoComplete="off" tabIndex={-1}/></label></div><button type="submit" className="btn btn-primary submit-button" disabled={status==='loading'}>{status==='loading'?<><LoaderCircle className="spinner" size={17}/>Sending enquiry…</>:<>{waitlist?'Get LensFleet Home':demo?'Book a demo':'Send enquiry'}<ArrowUpRight aria-hidden="true" size={17}/></>}</button></fieldset><div className={`form-feedback ${status}`} role={status==='error'?'alert':'status'} aria-live="polite">{status==='error'&&<CircleAlert size={17}/>} {status==='success'&&<CheckCircle2 size={17}/>}<span>{message}</span></div><p className="form-note">Required fields are marked *. Please avoid sharing sensitive personal or incident details. We only use this to reply to you. <a href="/privacy">Privacy notice</a>.</p></form>;
}
