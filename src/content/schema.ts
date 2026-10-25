import { company } from './site';

export function structuredData(path:string,origin=''){
 const organization={'@type':'Organization','@id':origin?origin+'/#organization':'#organization',name:'LensFleet',legalName:company.name,identifier:company.number,email:'info@lensfleet.com',address:{'@type':'PostalAddress',streetAddress:'Flat 2 Milligan House, 99 Avenue Road',addressLocality:'London',postalCode:'N14 4FH',addressCountry:'GB'},...(origin?{url:origin,logo:origin+'/brand/lensfleet-lockup-white.svg'}:{})};
 const product=path==='/home'?{name:'LensFleet Home',description:'Family and pet location sharing and household camera visibility.'}:path==='/platform/sentinel'?{name:'LensFleet Sentinel',description:'GPS tracking, camera visibility and journey records for business operations.'}:null;
 return {'@context':'https://schema.org','@graph':[organization,...(product?[{'@type':'Product',...product,brand:{'@type':'Brand',name:'LensFleet'},...(origin?{url:origin+path}:{})}]:[])]};
}
