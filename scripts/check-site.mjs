import { readFile, stat, access } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import assert from 'node:assert/strict';

const expected=['/','/platform','/platform/sentinel','/home','/solutions','/solutions/transport-logistics','/solutions/security','/solutions/care-services','/solutions/pet-tracking','/solutions/content-creators','/solutions/asset-tracking','/about','/contact','/privacy','/terms'];
const titles=new Set();
let checkedLinks=0;
for(const path of expected){
 const html=await readFile(join('dist',path,'index.html'),'utf8');
 const title=html.match(/<title>([^<]+)<\/title>/)?.[1];
 assert.ok(title,`${path}: page title missing`);assert.ok(!titles.has(title),`${path}: duplicate page title`);titles.add(title);
 assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,`${path}: exactly one h1 required`);
 assert.ok(/<meta name="description" content="[^"]{40,}"/.test(html),`${path}: description missing`);
 assert.ok(html.includes('property="og:title"'),`${path}: Open Graph metadata missing`);
 assert.ok(html.includes('twitter:card'),`${path}: sharing metadata missing`);
 assert.ok(!html.includes('LensFleet Nest'),`${path}: old consumer name visible`);
 const urls=[...html.matchAll(/(?:href|src)="([^"#]+)"/g)].map(match=>match[1]).filter(url=>url.startsWith('/'));
 for(const url of urls){const pathname=url.split('?')[0];let file=resolve('dist','.'+pathname);let info;try{info=await stat(file)}catch{throw new Error(`${path}: missing target ${url}`)}if(info.isDirectory())await access(join(file,'index.html'));checkedLinks++;}
 if(['/privacy','/terms'].includes(path))assert.ok(html.includes('Requires legal review'),`${path}: legal draft status missing`);
}
assert.ok((await readFile('dist/404.html','utf8')).includes('Page not found'));
assert.ok((await readFile('dist/robots.txt','utf8')).includes('User-agent'));
assert.ok((await readFile('dist/sitemap.xml','utf8')).includes('urlset'));
console.log(`Verified ${expected.length} page documents, unique metadata, semantic headings, legal draft labels, and ${checkedLinks} internal/asset references.`);
