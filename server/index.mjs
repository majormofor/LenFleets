import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { createContactHandler } from './contact.mjs';

const root=resolve('dist');
const handler=createContactHandler({...process.env,NODE_ENV:'production'});
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2','.xml':'application/xml','.txt':'text/plain; charset=utf-8'};
const server=http.createServer(async(req,res)=>{
 res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');res.setHeader('X-Frame-Options','DENY');
 const url=new URL(req.url,'http://localhost');
 if(url.pathname==='/api/contact')return handler(req,res);
 if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);return res.end('Method not allowed')}
 if(url.pathname==='/healthz'){res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});return res.end(req.method==='HEAD'?undefined:JSON.stringify({status:'ok'}))}
 let pathname;try{pathname=decodeURIComponent(url.pathname)}catch{res.writeHead(400);return res.end('Invalid URL')}
 let file=resolve(root,'.'+pathname);
 if(file!==root&&!file.startsWith(root+sep)){res.writeHead(403);return res.end('Forbidden')}
 try{if((await stat(file)).isDirectory())file=resolve(file,'index.html');const bytes=await readFile(file);res.setHeader('Content-Type',mime[extname(file)]||'application/octet-stream');res.setHeader('Cache-Control',file.includes(sep+'assets'+sep)?'public, max-age=31536000, immutable':'no-cache');res.writeHead(200);res.end(req.method==='HEAD'?undefined:bytes)}catch{try{const page=await readFile(resolve(root,'404.html'));res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(req.method==='HEAD'?undefined:page)}catch{res.writeHead(404);res.end('Not found')}}
});
server.requestTimeout=20000;server.headersTimeout=15000;
server.listen(Number(process.env.PORT||4173),process.env.HOST||'127.0.0.1',()=>console.log(`LensFleet production server: http://${process.env.HOST||'127.0.0.1'}:${process.env.PORT||4173}`));
