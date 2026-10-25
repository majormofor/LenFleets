import { useEffect, useState } from 'react';
import { structuredData } from './content/schema';
import { Header, Footer } from './components/Layout';
import { AboutPage, ContactPage, HomePage, HouseholdPage, IndustryPage, LegalPage, NotFoundPage, PlatformPage, SentinelPage, SolutionsPage } from './pages';
import { DevicesPage, PricingPage, ResourcesPage, SecurityPage, GuidePage, guides } from './MorePages';
import { metadata, solutions } from './content/site';

export function App({initialPath='/',initialSearch=''}:{initialPath?:string;initialSearch?:string}){
 const [location,setLocation]=useState({path:initialPath,search:initialSearch});
 useEffect(()=>{
  const sync=()=>{setLocation({path:window.location.pathname.replace(/\/$/,'')||'/',search:window.location.search});window.scrollTo({top:0,behavior:'instant'});document.getElementById('main')?.focus({preventScroll:true})};
  const click=(event:MouseEvent)=>{const a=(event.target as Element).closest<HTMLAnchorElement>('a[href]');if(!a||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||a.target==='_blank'||a.hasAttribute('download'))return;const url=new URL(a.href);if(url.origin!==window.location.origin||!['http:','https:'].includes(url.protocol))return;if(url.hash&&url.pathname===window.location.pathname)return;event.preventDefault();window.history.pushState(null,'',url.pathname+url.search+url.hash);sync();if(a.dataset.cta)window.dispatchEvent(new CustomEvent('lensfleet:cta',{detail:{cta:a.dataset.cta,page:url.pathname}}))};
  window.addEventListener('popstate',sync);document.addEventListener('click',click);
  return()=>{window.removeEventListener('popstate',sync);document.removeEventListener('click',click)};
 },[]);
 useEffect(()=>{
  const meta=metadata[location.path]||{title:'Page not found | LensFleet',description:'Explore the LensFleet platform and its solutions.'};document.title=meta.title;
  const set=(selector:string,value:string)=>document.querySelector(selector)?.setAttribute('content',value);
  set('meta[name="description"]',meta.description);set('meta[property="og:title"]',meta.title);set('meta[property="og:description"]',meta.description);set('meta[name="twitter:title"]',meta.title);set('meta[name="twitter:description"]',meta.description);
  const canonical=document.querySelector<HTMLLinkElement>('link[rel="canonical"]');const origin=canonical?.dataset.origin;if(canonical&&origin){canonical.href=origin+location.path;set('meta[property="og:url"]',origin+location.path)}
  let schema=document.getElementById('site-schema');if(!schema){schema=document.createElement('script');schema.id='site-schema';schema.setAttribute('type','application/ld+json');document.head.append(schema)}schema.textContent=JSON.stringify(structuredData(location.path,origin||''));
 },[location.path]);
 const path=location.path;
 const solution=solutions.find(s=>path===`/solutions/${s.slug}`);
 let page;
 if(path==='/')page=<HomePage/>;
 else if(path==='/platform')page=<PlatformPage/>;
 else if(path==='/platform/sentinel')page=<SentinelPage/>;
 else if(path==='/home')page=<HouseholdPage/>;
 else if(path==='/solutions')page=<SolutionsPage/>;
 else if(solution)page=<IndustryPage solution={solution}/>;
 else if(path==='/devices')page=<DevicesPage/>;
 else if(path==='/pricing')page=<PricingPage/>;
 else if(path==='/resources')page=<ResourcesPage/>;
 else if(path==='/security-privacy')page=<SecurityPage/>;
 else if(guides.some(g=>path==='/resources/'+g.slug))page=<GuidePage slug={path.split('/').pop()!}/>;
 else if(path==='/about')page=<AboutPage/>;
 else if(path==='/contact')page=<ContactPage key={location.search} demo={new URLSearchParams(location.search).has('demo')} waitlist={new URLSearchParams(location.search).get('waitlist')==='home'} quote={new URLSearchParams(location.search).get('quote')||''}/>;
 else if(path==='/privacy'||path==='/terms')page=<LegalPage type={path.slice(1) as 'privacy'|'terms'}/>;
 else page=<NotFoundPage/>;
 return <><a className="skip-link" href="#main">Skip to content</a><Header path={path+location.search}/><main id="main" tabIndex={-1} key={path}>{page}</main><Footer/></>;
}
