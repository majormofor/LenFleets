import { company, contact } from './site';

export function structuredData(path:string,origin=''){
 const organization={'@type':'Organization','@id':origin?origin+'/#organization':'#organization',name:'LensFleet',legalName:company.name,identifier:company.number,email:contact.email,telephone:contact.phoneHref,address:{'@type':'PostalAddress',streetAddress:'Flat 2 Milligan House, 99 Avenue Road',addressLocality:'London',postalCode:'N14 4FH',addressCountry:'GB'},...(origin?{url:origin,logo:origin+'/brand/lensfleet-lockup-white.svg'}:{})};
 const product=path==='/home'?{name:'LensFleet Home',description:'Household product for family and pet location sharing, home camera views and arrival alerts.'}:path==='/platform/sentinel'?{name:'LensFleet Sentinel',description:'Business product for GPS tracking, live camera views, intrusion detection and shareable journey records.'}:null;
 return {'@context':'https://schema.org','@graph':[organization,...(product?[{'@type':'Product',...product,brand:{'@type':'Brand',name:'LensFleet'},...(origin?{url:origin+path}:{})}]:[])]};
}
