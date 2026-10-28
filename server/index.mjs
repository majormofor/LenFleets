import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { gzipSync, brotliCompressSync, constants as zlibConstants } from 'node:zlib';
import { createContactHandler } from './contact.mjs';

const root=resolve('dist');
// Everything under /assets is content-hashed by Vite, so it can be cached
// forever. Fonts, photos, the logo and the icons are not hashed but they do not
// change between deploys either, and they were being revalidated on every fresh
// page load — 32KB of font plus ~29KB per photo, repeatedly, on metered mobile
// data. A month of caching with revalidation afterwards is the safe middle.
const immutableDir=sep+'assets'+sep;
const staticDirs=[sep+'fonts'+sep,sep+'images'+sep,sep+'brand'+sep];
function cacheControl(file){
 if(file.includes(immutableDir))return 'public, max-age=31536000, immutable';
 if(staticDirs.some(dir=>file.includes(dir)))return 'public, max-age=2592000, stale-while-revalidate=86400';
 return 'no-cache'; // HTML and the manifest, so a redeploy is picked up at once.
}
const handler=createContactHandler({...process.env,NODE_ENV:'production'});
// Without these three the contact endpoint answers 503 and the enquiry is not
// stored anywhere, so every lead is lost silently. Render's disk is ephemeral,
// so a file fallback would only give false comfort — instead make the
// misconfiguration impossible to miss at boot and queryable at /healthz.
const missingContactEnv=['RESEND_API_KEY','CONTACT_FROM_EMAIL','CONTACT_TO_EMAIL'].filter(name=>!process.env[name]);
if(missingContactEnv.length)console.error(`WARNING: the contact form cannot deliver. Missing ${missingContactEnv.join(', ')}. Every enquiry will be rejected with 503 and will not be stored anywhere.`);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.avif':'image/avif','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.woff2':'font/woff2','.xml':'application/xml','.txt':'text/plain; charset=utf-8'};
const compressed=new Map();
const server=http.createServer(async(req,res)=>{
 res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');res.setHeader('X-Frame-Options','DENY');
 const url=new URL(req.url,'http://localhost');
 if(url.pathname==='/api/contact')return handler(req,res);
 if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);return res.end('Method not allowed')}
 if(url.pathname==='/healthz'){res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});return res.end(req.method==='HEAD'?undefined:JSON.stringify({status:'ok',contactConfigured:missingContactEnv.length===0}))}
 let pathname;try{pathname=decodeURIComponent(url.pathname)}catch{res.writeHead(400);return res.end('Invalid URL')}
 let file=resolve(root,'.'+pathname);
 if(file!==root&&!file.startsWith(root+sep)){res.writeHead(403);return res.end('Forbidden')}
 try{if((await stat(file)).isDirectory())file=resolve(file,'index.html');let bytes=await readFile(file);res.setHeader('Content-Type',mime[extname(file)]||'application/octet-stream');res.setHeader('Cache-Control',cacheControl(file));if(/\.(html|js|css|svg|xml|json|webmanifest)$/.test(file)){res.setHeader('Vary','Accept-Encoding');const accept=req.headers['accept-encoding']||'';
// Brotli first where the client supports it: roughly 15-20% smaller than gzip
// on this payload, and the result is cached per file so we pay the cost once.
const encoding=/\bbr\b/.test(accept)?'br':/\bgzip\b/.test(accept)?'gzip':'';
if(encoding){/* Key on size and mtime too, so a rebuilt file is recompressed rather than serving the previous build's bytes. */const meta=await stat(file);const key=encoding+':'+file+':'+meta.size+':'+meta.mtimeMs;if(!compressed.has(key))compressed.set(key,encoding==='br'?brotliCompressSync(bytes,{params:{[zlibConstants.BROTLI_PARAM_QUALITY]:5}}):gzipSync(bytes));bytes=compressed.get(key);res.setHeader('Content-Encoding',encoding)}}res.writeHead(200);res.end(req.method==='HEAD'?undefined:bytes)}catch{try{const page=await readFile(resolve(root,'404.html'));res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(req.method==='HEAD'?undefined:page)}catch{res.writeHead(404);res.end('Not found')}}
});
server.requestTimeout=20000;server.headersTimeout=15000;
server.listen(Number(process.env.PORT||4173),process.env.HOST||'127.0.0.1',()=>console.log(`LensFleet production server: http://${process.env.HOST||'127.0.0.1'}:${process.env.PORT||4173}`));
