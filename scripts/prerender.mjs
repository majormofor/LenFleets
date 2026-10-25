import { build } from 'esbuild';
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';

const temp=resolve('node_modules/.cache/lensfleet-ssr.mjs');
await build({stdin:{contents:"export { App } from './src/App'; export { routes, metadata } from './src/content/site'; export { structuredData } from './src/content/schema';",resolveDir:process.cwd(),loader:'tsx'},outfile:temp,bundle:true,platform:'node',format:'esm',packages:'external',jsx:'automatic'});
const {App,routes,metadata,structuredData}=await import(pathToFileURL(temp).href+'?v='+Date.now());
const template=await readFile('dist/index.html','utf8');
const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
let origin=(process.env.PUBLIC_SITE_URL||process.env.RENDER_EXTERNAL_URL||'').replace(/\/$/,'');
if(origin){const url=new URL(origin);if(!['https:','http:'].includes(url.protocol)||url.pathname!=='/'||url.search||url.hash||url.username||url.password)throw new Error('PUBLIC_SITE_URL must be an origin without credentials, a path, query, or fragment.');origin=url.origin}
const all=[...routes,'/404'];
for(const path of all){
 const meta=metadata[path]||{title:'Page not found | LensFleet',description:'Find your way back to the LensFleet platform.'};
 let html=template.replace(/<title>.*?<\/title>/,`<title>${escape(meta.title)}</title>`).replace(/(<meta name="description" content=")[^"]*/,`$1${escape(meta.description)}`);
 const social=`<meta property="og:type" content="website"/><meta property="og:site_name" content="LensFleet"/><meta property="og:title" content="${escape(meta.title)}"/><meta property="og:description" content="${escape(meta.description)}"/><meta name="twitter:card" content="summary_large_image"/><meta name="twitter:title" content="${escape(meta.title)}"/><meta name="twitter:description" content="${escape(meta.description)}"/>`;
 const canonical=origin?`<link rel="canonical" data-origin="${escape(origin)}" href="${escape(origin+path)}"/><meta property="og:url" content="${escape(origin+path)}"/><meta property="og:image" content="${escape(origin)}/brand/share-card.png"/><meta name="twitter:image" content="${escape(origin)}/brand/share-card.png"/>`:'';
 const schema=`<script id="site-schema" type="application/ld+json">${JSON.stringify(structuredData(path,origin)).replaceAll('<','\\u003c')}</script>`;
 const noindex=['/privacy','/terms','/404'].includes(path)?'<meta name="robots" content="noindex, nofollow"/>':'';
 html=html.replace('</head>',`${social}${canonical}${schema}${noindex}</head>`).replace('<div id="root"></div>',`<div id="root">${renderToString(createElement(App,{initialPath:path}))}</div>`);
 if(path==='/404')await writeFile('dist/404.html',html);else{const dir=resolve('dist','.'+path);await mkdir(dir,{recursive:true});await writeFile(resolve(dir,'index.html'),html)}
}
const sitemap=origin?`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.filter(p=>!['/privacy','/terms'].includes(p)).map(path=>`<url><loc>${escape(origin+path)}</loc></url>`).join('')}</urlset>`:`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`;
await writeFile('dist/sitemap.xml',sitemap);
await writeFile('dist/robots.txt',origin?`User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${origin}/sitemap.xml\n`:'User-agent: *\nDisallow: /\n# Set PUBLIC_SITE_URL and rebuild when the public domain is confirmed.\n');
await rm(temp,{force:true});
console.log(`Prerendered ${routes.length} pages and a 404 page. ${origin?'Canonical origin: '+origin:'Canonical URLs pending confirmed PUBLIC_SITE_URL.'}`);
