import type { ReactNode } from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

export function Button({children,href='/contact',variant='primary',className=''}:{children:ReactNode;href?:string;variant?:'primary'|'secondary'|'light'|'text';className?:string}) {
 return <a className={`btn btn-${variant} ${className}`} href={href} data-cta={typeof children==='string'?children:href}>{children}{variant==='text'?<ArrowRight aria-hidden="true" size={17}/>:<ArrowUpRight aria-hidden="true" size={17}/>}</a>;
}
export function Eyebrow({children,light=false}:{children:ReactNode;light?:boolean}) {return <div className={`eyebrow ${light?'eyebrow-light':''}`}><span/>{children}</div>}
export function SectionHeading({eyebrow,title,text}:{eyebrow:string;title:ReactNode;text?:string}) {return <div className="section-heading"><div><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2></div>{text&&<p>{text}</p>}</div>}
export function CheckList({items}:{items:readonly string[]}) {return <ul className="check-list">{items.map(item=><li key={item}><span className="planned-list-marker" aria-hidden="true"/><span>{item}</span></li>)}</ul>}
export function Breadcrumb({label}:{label:string}) {return <div className="breadcrumb"><a href="/">LensFleet</a><span>/</span><span>{label}</span></div>}
export function FinalCTA(){return <section className="final-cta"><div className="container"><div><Eyebrow light>Help shape what comes next</Eyebrow><h2>Tell us what <br/>you need to see.</h2><p>LensFleet is in development. <br/>Register your interest and share your requirements.</p></div><div className="final-actions"><Button variant="light" href="/contact?early=1">Register interest</Button><Button variant="text" href="/contact">Contact us</Button></div><span className="cta-watermark" aria-hidden="true">↗</span></div></section>}
