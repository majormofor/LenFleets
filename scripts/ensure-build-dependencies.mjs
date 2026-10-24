import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

// Hosts can omit devDependencies when NODE_ENV=production, even though the
// application still needs TypeScript, React types, and Vite during its build.
const required = ['typescript','vite','@vitejs/plugin-react','@types/react','@types/react-dom','esbuild'];
const missing = required.filter(name => !existsSync(join(process.cwd(),'node_modules',name,'package.json')));
if (missing.length) {
  console.log(`Installing missing build dependencies: ${missing.join(', ')}`);
  const npmCli = process.env.npm_execpath;
  if (!npmCli || !existsSync(npmCli)) {
    throw new Error('Run npm ci --include=dev, then npm run build.');
  }
  const result = spawnSync(process.execPath,[npmCli,'ci','--include=dev'],{stdio:'inherit',env:process.env});
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
  const unresolved = required.filter(name => !existsSync(join(process.cwd(),'node_modules',name,'package.json')));
  if (unresolved.length) throw new Error(`Build dependencies are still missing: ${unresolved.join(', ')}`);
}
