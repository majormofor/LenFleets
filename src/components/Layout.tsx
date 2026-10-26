import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronDown, Menu, X, Mail, Phone, ArrowRight } from 'lucide-react';
import { contact, company, navItems, solutions } from '../content/site';
import { Button } from './ui';

export function Logo(){return <a className="wordmark" href="/" aria-label="LensFleet home"><img src="/brand/lensfleet-lockup-white.svg" alt="LensFleet" width="168" height="44"/></a>}

export function Header({path}:{path:string}) {
 const [open,setOpen]=useState(false);
 const dropdown=useRef<HTMLDetailsElement>(null);
 const menuButton=useRef<HTMLButtonElement>(null);
 const closeButton=useRef<HTMLButtonElement>(null);
 const dialog=useRef<HTMLDialogElement>(null);
 const restoreScroll=useRef(true);
 const route=path.split('?')[0];
 function closeMenu(restore=true){restoreScroll.current=restore;setOpen(false)}
 useEffect(()=>{closeMenu(false);if(dropdown.current)dropdown.current.open=false},[path]);
 useEffect(()=>{
  if(!open)return;
  const layer=dialog.current!;
  const y=window.scrollY;
  const previous={position:document.body.style.position,top:document.body.style.top,width:document.body.style.width,overflow:document.body.style.overflow};
  document.body.style.position='fixed';document.body.style.top=`-${y}px`;document.body.style.width='100%';document.body.style.overflow='hidden';
  restoreScroll.current=true;
  layer.showModal();closeButton.current?.focus();
  const trap=(event:KeyboardEvent)=>{
   if(event.key==='Escape'){event.preventDefault();closeMenu();return}
   if(event.key!=='Tab')return;
   const controls=Array.from(layer.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), summary, [tabindex="0"]')).filter(el=>el.getClientRects().length>0);
   const first=controls[0],last=controls[controls.length-1];
   if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}
  };
  layer.addEventListener('keydown',trap);
  return()=>{layer.removeEventListener('keydown',trap);layer.close();Object.assign(document.body.style,previous);window.scrollTo({top:restoreScroll.current?y:0,behavior:'instant'});if(restoreScroll.current)menuButton.current?.focus()};
 },[open]);
 return <><header className="site-header"><div className="container header-inner"><Logo/><nav className="desktop-nav" aria-label="Main navigation">{navItems.map(item=>item.path==='/solutions'?<details ref={dropdown} className="nav-dropdown" key={item.path} onKeyDown={event=>{if(event.key==='Escape'){event.currentTarget.open=false;event.currentTarget.querySelector('summary')?.focus()}}} onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node))event.currentTarget.open=false}}><summary className={route.startsWith('/solutions')?'current':''}>Solutions<ChevronDown aria-hidden="true" size={15}/></summary><div className="dropdown-panel"><a className="dropdown-overview" href="/solutions">Explore all solutions<ArrowUpRight aria-hidden="true" size={17}/></a>{solutions.map(({slug,short,icon:Icon})=><a href={`/solutions/${slug}`} key={slug}><Icon aria-hidden="true" size={18}/>{short}<ArrowRight aria-hidden="true" size={15}/></a>)}</div></details>:<a key={item.path} href={item.path} aria-current={route===item.path?'page':undefined}>{item.name}</a>)}</nav><div className="header-actions"><Button href="/contact?demo=1" cta="Book a demo"><span className="cta-label-long">Book a demo</span><span className="cta-label-short">Demo</span></Button><button ref={menuButton} className="mobile-toggle" aria-expanded={open} aria-controls="mobile-navigation" aria-label="Open navigation" onClick={()=>setOpen(true)}><Menu aria-hidden="true"/></button></div></div><dialog ref={dialog} className="mobile-menu" id="mobile-navigation" aria-label="Navigation" onCancel={event=>{event.preventDefault();closeMenu()}}><div className="mobile-menu-head"><div onClick={()=>closeMenu(false)}><Logo/></div><button ref={closeButton} className="mobile-close" onClick={()=>closeMenu()} aria-label="Close navigation"><X aria-hidden="true" size={25}/></button></div><nav aria-label="Mobile navigation" onClick={event=>{if((event.target as Element).closest('a'))closeMenu(false)}}>{navItems.map(item=><a key={item.path} href={item.path} aria-current={route===item.path?'page':undefined}>{item.name}<ArrowUpRight aria-hidden="true" size={20}/></a>)}<Button href="/contact?demo=1">Book a demo</Button></nav><div className="mobile-menu-foot"><a href={`mailto:${contact.email}`}>{contact.email}</a><p>GPS tracking. Camera views. Journey records.</p></div></dialog></header></>;
}

// Persistent call to action for phones. Pages run 3700-4600px tall, so after the
// first screen there was previously nothing to tap. CSS-only visibility (shown
// under 760px) keeps it free of scroll listeners and safe to prerender.
export function MobileCTABar({path}:{path:string}){
 if(path.startsWith('/contact'))return null;
 return <div className="mobile-cta-bar" aria-label="Quick actions">
  <a className="cta-primary" href="/contact?demo=1" data-cta="Mobile bar: book a demo">Book a demo<ArrowUpRight aria-hidden="true" size={17}/></a>
  <a className="cta-secondary" href={`tel:${contact.phoneHref}`} data-cta="Mobile bar: call"><Phone aria-hidden="true" size={17}/>Call us</a>
 </div>;
}

export function Footer(){return <footer className="site-footer"><div className="container"><div className="footer-grid"><div className="footer-brand"><Logo/><p>Cameras, trackers and records <br/>that show what actually happened.</p><a href={`mailto:${contact.email}`}><Mail aria-hidden="true" size={17}/>{contact.email}</a><a href={`tel:${contact.phoneHref}`}><Phone aria-hidden="true" size={17}/>{contact.phone}</a></div><div><h3>Platform</h3><a href="/platform">The LensFleet platform</a><a href="/platform/sentinel">Sentinel for businesses</a><a href="/home">LensFleet Home</a><a href="/devices">Devices</a><a href="/pricing">Pricing</a><a href="/contact?interest=home">Get LensFleet Home</a></div><div><h3>Solutions</h3>{solutions.map(s=><a href={`/solutions/${s.slug}`} key={s.slug}>{s.short}</a>)}</div><div><h3>Company</h3><a href="/about">About LensFleet</a><a href="/security-privacy">Security & privacy</a><a href="/resources">Resources</a><a href="/contact">Contact</a><a href="/contact?demo=1">Book a demo</a></div></div><div className="company-disclosure">{company.name} · Registered in {company.jurisdiction}, company no. {company.number} · Registered office: {company.address}</div><div className="footer-bottom"><span>© {new Date().getFullYear()} LensFleet. All rights reserved.</span><span className="footer-legal"><a href="/privacy">Privacy</a><a href="/terms">Terms</a><span className="footer-tag">Proof in motion.</span></span></div></div></footer>}
