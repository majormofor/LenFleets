import type { ReactNode } from 'react';
import { ArrowUpRight, ArrowRight, Check } from 'lucide-react';

export function Button({children,href='/contact',variant='primary',className=''}:{children:ReactNode;href?:string;variant?:'primary'|'secondary'|'light'|'text';className?:string}) {
 return <a className={`btn btn-${variant} ${className}`} href={href} data-cta={typeof children==='string'?children:href}>{children}{variant==='text'?<ArrowRight size={17}/>:<ArrowUpRight size={17}/>}</a>;
}
export function Eyebrow({children,light=false}:{children:ReactNode;light?:boolean}) {return <div className={`eyebrow ${light?'eyebrow-light':''}`}><span/>{children}</div>}
export function SectionHeading({eyebrow,title,text}:{eyebrow:string;title:ReactNode;text?:string}) {return <div className="section-heading"><div><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2></div>{text&&<p>{text}</p>}</div>}
export function CheckList({items}:{items:readonly string[]}) {return <ul className="check-list">{items.map(item=><li key={item}><Check size={16}/><span>{item}</span></li>)}</ul>}
export function Breadcrumb({label}:{label:string}) {return <div className="breadcrumb"><a href="/">LensFleet</a><span>/</span><span>{label}</span></div>}
export function FinalCTA(){return <section className="final-cta"><div className="container"><div><Eyebrow light>Your next clear step</Eyebrow><h2>Bring clarity to<br/>every journey.</h2><p>Track movement. Verify events.<br/>Share the moments that matter.</p></div><div className="final-actions"><Button variant="light" href="/contact?demo=1">Book a demo</Button><Button variant="text" href="/contact">Contact us</Button></div><span className="cta-watermark" aria-hidden="true">↗</span></div></section>}
