import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './App';
import './styles.css';

let legacyRedirected=false;
if(location.hash.startsWith('#/')){
 const old=location.hash.slice(1);
 const aliases:Record<string,string>={'/solutions/vehicle':'/solutions/transport-logistics','/solutions/asset':'/solutions/asset-tracking','/solutions/family':'/home','/solutions/dashcam':'/platform/sentinel','/solutions/bodycam':'/solutions/security','/solutions/transport':'/solutions/transport-logistics'};
 let next=aliases[old]||old;
 if(old.startsWith('/apps'))next=old.includes('app=home')||old.includes('app=nest')?'/home':'/platform';
 if(old.startsWith('/legal/'))next=old.includes('privacy')?'/privacy':'/terms';
 history.replaceState(null,'',next);legacyRedirected=true;
}else if(location.hash){const legacy:Record<string,string>={'#how-it-works':'/platform','#capabilities':'/platform','#features':'/platform','#contact':'/contact','#about':'/about','#solutions':'/solutions'};if(legacy[location.hash]){history.replaceState(null,'',legacy[location.hash]);legacyRedirected=true;}}
const root=document.getElementById('root')!;
const app=<App initialPath={location.pathname.replace(/\/$/,'')||'/'} initialSearch={location.search}/>;
if(root.hasChildNodes()&&!legacyRedirected&&!location.search)hydrateRoot(root,app);else createRoot(root).render(app);
