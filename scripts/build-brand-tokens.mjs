import { readFile, writeFile } from 'node:fs/promises';

// Only read the visible token data and narrative supplied by the owner.
const tokens=JSON.parse(await readFile('brand-book/tokens.json','utf8'));
if(tokens.name!=='LensFleet'||tokens.version!==2)throw new Error('Expected LensFleet Brand Book v2 tokens.');
const value=token=>typeof token.value==='string'?token.value:token.value.dark;
const declarations=[];
for(const group of ['color','spacing','radius','shadow'])for(const token of tokens[group].tokens)declarations.push(`  --${token.name}: ${value(token)};`);
for(const [name,family] of Object.entries(tokens.type.families))declarations.push(`  --font-${name}: ${family};`);
for(const group of tokens.type.groups)for(const style of group.styles){
 declarations.push(`  --type-${style.name}: ${style.fontWeight} ${style.fontSize}/${style.lineHeight} var(--font-${group.family});`);
 if(style.letterSpacing)declarations.push(`  --tracking-${style.name}: ${style.letterSpacing};`);
}
const aliases=`  --surface-muted: var(--surface-sunken);
  --success: var(--green-text);
  --danger: var(--red-tint-200);
  --warning: var(--ink-muted);
  --label: var(--type-label);
  --shadow: var(--shadow-raised);`;
await writeFile('src/styles/tokens.css',`/* Generated from brand-book/tokens.json (LensFleet v2). Run npm run build to regenerate. */
:root {
  color-scheme: dark;
${declarations.join('\n')}
${aliases}
}
.label{font:var(--type-label);text-transform:uppercase;letter-spacing:var(--tracking-label)}
`);
const book=await readFile('brand-book/01-brand-book.md','utf8');
const section=name=>{const match=book.match(new RegExp(`## ${name}\\n\\n([\\s\\S]*?)(?=\\n## |$)`));if(!match)throw new Error(`Missing brand-book section: ${name}`);return match[1].trim()};
await writeFile('src/content/brand-book.json',JSON.stringify({story:["LensFleet began with a simple observation: a status update is not proof. “Delivered”, “visited”, “patrolled”, “on site” are claims, and every dispute, insurance claim and complaint starts with a claim nobody can check.","We put a lens on the movement — a dashcam on the bus, a body camera on the guard or carer, a tracker on the generator or the dog — and turn the claim into something you can see, place on a map, timestamp and share. One platform serves six sectors: logistics, security, care, pets, creators and assets. Sentinel is the product for organisations; LensFleet Home is the product for households."],mission:section('Mission'),vision:section('Vision')},null,2)+'\n');
console.log(`Applied ${tokens.color.tokens.length} official dark colour tokens and brand narrative.`);
