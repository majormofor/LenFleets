LensFleet is a camera-and-location platform that lets the people who move, deliver, guard, care for and look after things prove what happened. One codebase serves two products: **Sentinel** for organisations (fleets, security teams, care providers, asset owners) and **LensFleet Home** for households (cars, family members, pets, the house). This book is the single reference for how the brand looks, sounds and behaves across both — read it before producing anything that carries the name.

## Brand story

LensFleet began with a simple observation: a status update is not proof. "Delivered", "visited", "patrolled", "on site" are claims, and every dispute, insurance claim and complaint starts with a claim nobody can check. LensFleet puts a lens on the movement — a dashcam on the bus, a body camera on the guard or carer, a tracker on the generator or the dog — and turns the claim into something that can be seen, placed on a map, timestamped and shared.

We started with goods in transit. The same need turned out to exist everywhere people and things move: a security firm that has to answer for an incident, a care agency whose client's daughter wants to know the carer came, a vlogger who wants viewers to ride along live, a plant-hire company that keeps losing track of generators. The platform did not change; the sectors multiplied. Today LensFleet serves six of them and is built so that the seventh needs no new code — only new words in the interface.

## Vision

A world in which the movement of people, goods and services is transparent, trusted and verifiable, so that the people who depend on it can act on evidence rather than assumption.

## Mission

To give any organisation or household a camera-enabled, location-aware platform that records what happened, where and when, protects that record, and lets it be shared with exactly the people who need to see it — no more, no less.

## What we stand for

- **Proof over promise.** Every feature should make something verifiable: a clip, a position, a count, a timestamp. If a screen cannot answer "what happened?", it is not finished.
- **Transparent, not intrusive.** We show what is needed to the people who need it. Sharing is deliberate, time-boxed and revocable; "Can view" means view only, everywhere.
- **Plain language.** Three permission levels, named in words. No jargon in the product, no acronyms in a headline. Write for the Lagos bus owner and the London care manager in the same sentence.
- **One platform, many fronts.** Sector and household differences live in copy and defaults, never in separate systems. The data layer has zero brand awareness.
- **Built for where it will run.** Patchy networks, hot cabins, WhatsApp as the default channel, two currencies. Design for the pilot in Lagos first and the brand will hold up anywhere.

## Brand architecture

| Name | What it is | Who sees it |
| --- | --- | --- |
| **LensFleet** | The company and the masterbrand. The falcon mark, the wordmark, this book. | Investors, partners, press, hiring, legal. |
| **Sentinel** | The product for organisations: fleets, security, care providers, logistics, asset owners. | Business customers, in the web app and the Sentinel mobile app. |
| **LensFleet Home** | The product for households: cars, family members, pets and the home. | Consumers, in the LensFleet Home mobile app. |

Write "LensFleet" as one word, capital L and F, never "Lens Fleet" or "Lensfleet". "Sentinel" and "LensFleet Home" are product names and take no trademark symbol in running text. Sector names (Logistics, Security, Care, Pets, Creators, Assets) are descriptions, not sub-brands — they never get their own logo, colour or wordmark. The sectors and what each needs are set out in **Sectors**.

## Voice

LensFleet sounds like a calm, competent colleague who has seen the footage. Confident, specific, never breathless. The full guide, including the Business/Household copy dictionary and the words we avoid, is in **Voice and copy**. The short version:

- Lead with the fact, then the reassurance: "Bus 14 arrived at Oshodi at 07:42. Clip saved." not "Great news! Your bus has safely arrived!"
- Use "you" and "your"; use "we" only when LensFleet the company is speaking.
- Say *verified*, *recorded*, *shared*, *proof*. Do not say *surveillance*, *spy*, *monitor* (of people), *track* (of people — track vehicles and assets, *see* people).
- Sentence case everywhere, including buttons and headings. No exclamation marks in the product.

## Logo

The mark is a falcon drawn in a circle — speed, precision and elevated sight — with the curves of an "L" and an "F" hidden in its form. Use the files in **Logos** exactly as supplied; never redraw, recolour outside the palette, rotate, outline, shadow or place inside a shape. Rules, clear space, minimum sizes and prohibited uses are in **Logo**. In short: the horizontal lockup (`lensfleet-lockup-graphite.svg` on light grounds, `lensfleet-lockup-white.svg` on dark) is the default; the mark alone (`lensfleet-mark-*.svg`) is for app icons, favicons, avatars, dashboard navigation and vehicle branding where the name is already established.

## Colour

The identity is graphite and neutral. Colour is spent on meaning, not decoration.

- **Grounds and ink.** `surface` is the page; `surface-raised` lifts cards and panels; `ink` is primary text, `ink-muted` secondary text and `ink-subtle` hints, all on `surface` or `surface-raised`. `line` draws borders and dividers. In the dark theme the graphite that is ink in light becomes the ground — the brand's own dark pages are built this way.
- **Graphite scale.** `graphite-900` (#27292B), `graphite-700` (#5D5F60), `graphite-500` (#939495), `graphite-300` (#C9C9CA) are the four greys of the original identity. Use them for the mark, type and structure; they are what makes a LensFleet surface look like LensFleet.
- **Blue is the brand's one working colour.** `blue` for links, primary actions, selected states and informational highlights; `blue-text` for blue words on white (the brand blue itself is 3.9:1 on white — fine for fills and large type, not for body-size text). Live indicators also use blue, never red.
- **Turquoise** signals the smart and the interactive: AI summaries, live-view affordances, embeds. Always as a fill with `ink` on it, or as `turquoise-text`; never as text on white.
- **Green** is confirmation and success: accepted, delivered, verified, online. `green-text` for words, `green` for fills with `ink` on them.
- **Red** is attention: alerts, severity, destructive actions, recording indicators. `red` reads on white; in the dark theme it brightens to stay legible. Red and green are never the only difference between two states — pair them with an icon or a word.
- **Tints** (`*-tint-*`) are backgrounds for chips, callouts and status rows, always carrying `ink` text.
- No gradients, no glows, no colour on the mark other than graphite, white, or a solid tint of blue, red, turquoise or green for an app-icon background.

## Typography

**Geom** is the brand typeface — geometric, clean, confident — used for every weight from headlines to captions. It is a licensed face from the original identity and is not hosted here: use the licensed files in print and in the native apps, and on the web load **Outfit** from Google Fonts as the nearest open substitute (the stacks in `tokens.json` list Geom first, Outfit second). Set headings in `display`, `h1`–`h3`; body in `body` and `body-small`; interface labels and chips in `label` (uppercase, tracked); numbers that must line up — speeds, counts, timestamps — in `data` with tabular figures. Headings are sentence case. Never letter-space Geom below 600 weight; never set body copy below 15px on screen.

## Spacing, radius and layout

A 4px grid: `space-1` to `space-12`. Cards and panels use `space-5` padding and `radius-md`; chips and controls `radius-sm`; the map and video tiles `radius-lg`; avatars and the record indicator are discs. Borders (`line`, 1px) rather than shadows separate surfaces; the single `shadow-raised` is reserved for floating layers such as menus and the mobile action sheet. Dense data views (lists of assets, event logs) use `space-2`/`space-3` rhythm; marketing and onboarding use `space-8`+ generously.

## Imagery

Photograph the work, not the product. Real buses in Lagos traffic, a carer at a door, a security guard's shoulder with the camera on it, a dog at the gate, a generator on a site — people and places mid-task, documentary light, no stock smiles, no stock datacentres. Show screens only as part of a scene (a phone in a hand, a wall display in a depot). Video stills from the platform itself, lightly graded towards graphite, are preferred over illustrations. When footage would show identifiable members of the public, blur faces and plates; the brand that sells proof must be seen handling it carefully.

## Iconography

Product UI uses a single consistent line-icon set at 1.5px stroke (Lucide is the current choice; keep to one set). The eight icons from the original identity — Home/Dashboard, Live camera, Package/Service tracking, Activity logs, Notifications, Settings, Share, User — remain the canonical glyphs for those concepts and should be matched, not replaced, when an equivalent is picked from the set. Icons are `ink` or `ink-muted`, never coloured, except a red disc for recording and a blue dot for live. No emoji in the product or in brand communications.

## Status and state

Online / live: blue dot or `blue` text. Offline or stale: `ink-subtle` with the time since last contact. Recording: red disc. Verified / accepted / delivered: `green-text` with a check. Alert: `red` with the severity word. Every state carries a word or an icon as well as a colour.
