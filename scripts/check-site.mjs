import { readFile, stat, access } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import assert from 'node:assert/strict';

const expected=['/','/platform','/platform/sentinel','/home','/solutions','/solutions/transport-logistics','/solutions/security','/solutions/care-services','/solutions/pet-tracking','/solutions/content-creators','/solutions/asset-tracking','/about','/contact','/privacy','/terms','/devices','/pricing','/security-privacy','/resources','/resources/dashcam-lagos-bus','/resources/body-cameras-care','/resources/verified-delivery-record'];
const titles=new Set();
const descriptions=new Set();
let checkedLinks=0;
for(const path of expected){
 const html=await readFile(join('dist',path,'index.html'),'utf8');
 const title=html.match(/<title>([^<]+)<\/title>/)?.[1];
 assert.ok(title,`${path}: page title missing`);assert.ok(!titles.has(title),`${path}: duplicate page title`);titles.add(title);
 assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,`${path}: exactly one h1 required`);
 assert.ok(/<meta name="description" content="[^"]{40,}"/.test(html),`${path}: description missing`);
 assert.ok(html.includes('property="og:title"'),`${path}: Open Graph metadata missing`);
 assert.ok(html.includes('twitter:card'),`${path}: sharing metadata missing`);
 const description=html.match(/<meta name="description" content="([^"]+)/)?.[1];assert.ok(!descriptions.has(description),`${path}: duplicate description`);descriptions.add(description);
 assert.ok(html.includes('/brand/lensfleet-lockup-white.svg'),`${path}: transparent brand logo missing`);
 assert.ok(html.includes('company no.'),`${path}: company disclosure missing`);
 for(const image of html.matchAll(/<img\b[^>]+>/g)){assert.match(image[0],/width="\d+"/,`${path}: image width missing`);assert.match(image[0],/height="\d+"/,`${path}: image height missing`)}
 for(const heading of html.matchAll(/<h[12]\b[^>]*>([\s\S]*?)<\/h[12]>/g))assert.ok(!/[^\s>]<(?:br)[\s/>]/.test(heading[1]),`${path}: missing space before heading line break`);
 assert.ok(html.includes('id="site-schema"'),`${path}: structured data missing`);
 assert.ok(!html.includes('LensFleet Nest'),`${path}: old consumer name visible`);
 const urls=[...html.matchAll(/(?:href|src)="([^"#]+)"/g)].map(match=>match[1]).filter(url=>url.startsWith('/'));
 for(const url of urls){const pathname=url.split('?')[0];let file=resolve('dist','.'+pathname);let info;try{info=await stat(file)}catch{throw new Error(`${path}: missing target ${url}`)}if(info.isDirectory())await access(join(file,'index.html'));checkedLinks++;}
 if(['/privacy','/terms'].includes(path))assert.ok(html.includes('Requires legal review'),`${path}: legal draft status missing`);
}
assert.ok((await readFile('dist/404.html','utf8')).includes('Page not found'));
assert.ok((await readFile('dist/robots.txt','utf8')).includes('User-agent'));
assert.ok((await readFile('dist/sitemap.xml','utf8')).includes('urlset'));
console.log(`Verified ${expected.length} page documents, unique metadata, semantic headings, legal draft labels, and ${checkedLinks} internal/asset references.`);

const home=await readFile('dist/index.html','utf8');
assert.equal((home.match(/<section\b/g)||[]).length,6,'Home must have six sections');
assert.ok(!home.includes('connected toolkit'),'Toolkit belongs on Platform');
const manifest=JSON.parse(await readFile('dist/manifest.webmanifest','utf8'));
for(const icon of manifest.icons)await access(join('dist',icon.src));
assert.ok(!(await readFile('dist/robots.txt','utf8')).includes('Disallow: /privacy'));
for(const css of ['src/styles/site.css','src/styles/review.css'])assert.ok(!/#[0-9a-f]{3,8}\b/i.test(await readFile(css,'utf8')),`${css}: non-token colour`);
for(const size of [16,32,180,192,512])await access(`dist/brand/icon-${size}.png`);
console.log('Review checks passed: six-section home, responsive assets, schema, manifest, heading spacing and token colours.');
