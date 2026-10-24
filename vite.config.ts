import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// Server-only handler: never import this module from the client application.
// @ts-expect-error The handler is shared with the plain Node production server.
import { createContactHandler } from './server/contact.mjs';
export default defineConfig(({mode})=>({ plugins: [react(),{
 name:'lensfleet-contact',
 configureServer(server){const env={...process.env,...loadEnv(mode,process.cwd(),'')};const contact=createContactHandler(env);server.middlewares.use('/api/contact',contact)},
 }], server:{host:'127.0.0.1'} }));
