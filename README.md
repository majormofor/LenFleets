# LensFleet — Proof in motion.

A marketing and product-discovery website for LensFleet. React 19, TypeScript, Vite, Lucide, and a small Node.js enquiry server. The existing frontend stack has been retained.

## Local preview

Use Node.js 22.9+ (tested with Node 24).

```sh
npm install
npm run dev
```

Open http://127.0.0.1:5173/. The local server also exposes `/api/contact`. Legacy hash links redirect to the appropriate new page.

## Production and verification

```sh
npm run check
npm start
```

`check` runs TypeScript, the production build, static prerendering, page/link/asset checks, and contact handler tests. `npm start` serves the built website and the real enquiry endpoint at http://127.0.0.1:4173. Set `HOST` and `PORT` for your deployment; place it behind HTTPS and a trusted reverse proxy.

The build writes 22 prerendered HTML pages, a 404 page, metadata, robots.txt, and sitemap.xml. Pages contain their content without needing JavaScript for indexing. Client navigation uses the same normal URLs. Static hosting is supported for the pages, but the enquiry endpoint requires the included Node server or an equivalent server-side adapter.

## Routes

- `/`
- `/platform`
- `/platform/sentinel`
- `/home`
- `/solutions`
- `/solutions/transport-logistics`
- `/solutions/security`
- `/solutions/care-services`
- `/solutions/pet-tracking`
- `/solutions/content-creators`
- `/solutions/asset-tracking`
- `/about`
- `/contact` (also `/contact?demo=1`)
- `/privacy`
- `/terms`
- `/devices` and `/pricing`
- `/security-privacy`
- `/resources` and three guide pages

## Enquiry delivery

Copy `.env.example` to `.env` and configure these **server-only** values:

- `RESEND_API_KEY`: a valid Resend server API key.
- `CONTACT_FROM_EMAIL`: a sender on a verified Resend domain, optionally with display name.
- `CONTACT_TO_EMAIL`: the actual recipient, default suggestion `info@lensfleet.com`.
- `SITE_ORIGIN`: exact allowed origin for form submissions, including scheme and port when applicable.
- `HOST`, `PORT`: production server bind address and port.

No credentials are exposed in the frontend. Restart the server after environment changes. Test delivery with a real mailbox before launch. Success is displayed only after the provider accepts the message and returns an ID; this means accepted for delivery, not guaranteed inbox receipt. Without credentials, `/api/contact` returns HTTP 503 and the form clearly says nothing was sent, with a direct email alternative.

The handler validates data server-side as well as client-side. It rejects invalid interests, header-injection attempts, oversize content, invalid origin, a filled honeypot, and very fast submissions. It limits attempts to 5 per socket IP per 10 min. This is an in-memory, per-process limit. Add trusted edge rate limiting and, when required, a properly integrated challenge service for multi-instance or high-traffic deployment. Forwarding headers are not trusted for rate limiting by default. No enquiry content is logged or saved locally.

The production server has request/header timeouts, private API responses, content-type checks, static path containment, and standard response headers. Configure TLS and platform-level limits in your host. There is no tracking backend, authentication system, evidence database, or live-camera service in this marketing website.

## SEO configuration

Set `PUBLIC_SITE_URL` to the confirmed production **origin** before building. For a local shell, set the variable before `npm run build`; it is not read from `.env` by the prerender script automatically. Alternatively run `node --env-file=.env scripts/prerender.mjs` after `vite build` and TypeScript validation. A deployment pipeline can supply the variable directly.

When set, the build emits canonical URLs, absolute social-card URLs, a populated sitemap, and crawlable robots.txt. Until set, robots.txt blocks indexing and the sitemap intentionally has no invented domain. Privacy, terms, and 404 pages have `noindex` metadata. Legal drafts are excluded from the sitemap.

Each route has unique titles, descriptions, Open Graph and Twitter sharing metadata. Organization structured data uses the supplied company disclosure; Home and Sentinel pages include Product structured data without invented offers or ratings.

## Design and assets

The supplied LensFleet brand materials now inform the design: graphite `#27292B`, neutral greys, restrained blue interface accents, the Geom typeface, and the supplied falcon/wordmark. Both Sentinel and LensFleet Home share this system.

- Original assets remain unchanged in the user-supplied Downloads folder.
- The transparent SVG logo preserves the original vector outlines extracted from page 6 of the supplied brand PDF.
- The SVG favicon and 16/32/180/192/512 PNG icons derive from that vector falcon; a web manifest is included.
- Geom is self-hosted with its SIL Open Font License in `public/fonts/OFL.txt`.
- Asset sources and credits are recorded in `ASSETS.md`.

The authoritative Figma URL remains https://www.figma.com/design/wIrDFC6gDdRSROpUIQBmoZ/LensFleet-team-library?node-id=7769-4&p=f&m=dev. It was not accessible via the connected tools. No claim is made that the website reproduces the Figma library. The user-supplied brand book and logo artwork provide the implemented brand reference.

## Remaining launch requirements

1. Configure and verify real enquiry delivery, sender domain, allowed origin, HTTPS, and hosting rate limits.
2. Replace `/privacy` and `/terms` with reviewed, approved legal content. The current pages are clearly labelled review drafts, not invented legal commitments.
3. Confirm the public domain, set `PUBLIC_SITE_URL`, and rebuild.
4. Confirm device/app-specific feature availability and approve the supplied product copy before public use.
5. Compare with Figma when access is available.
6. Browser QA completed for the responsive header, menu focus, Escape, navigation, currency switching and waitlist validation. Final checks on the actual Render domain and target phones remain.

## Code organisation

- `src/content/site.ts`: typed marketing content, route metadata, industry data.
- `src/components/`: shared navigation, visuals, sections, forms, and UI.
- `src/pages.tsx`: route components built from the shared system.
- `src/App.tsx`: normal-URL navigation and page selection.
- `src/styles/tokens.css`: shared colours and label tokens; `site.css` and `review.css`: responsive presentation.
- `server/contact.mjs`: validated server-only delivery boundary.
- `server/index.mjs`: production static server and enquiry route.
- `scripts/prerender.mjs`: static page metadata, content, sitemap, and robots output.
- `scripts/check-site.mjs`: route, heading, metadata, and reference verification.
- `scripts/contact.test.mjs`: meaningful server-handler tests with mocked delivery.

CTA clicks dispatch a `lensfleet:cta` CustomEvent with `{cta, page}` details. No external analytics is enabled by default.

All maps, event records, camera compositions, passenger counts, and scenario examples are illustrative. Photographs are contextual stock imagery, not LensFleet customer records or product screenshots.

## Deploy free on Render

This repository includes `render.yaml` for one **Free Node web service**, with no database. Neon is not required. Render's `.node-version` support selects the tested Node version.

1. Push the website source to your own GitHub repository. Do not commit `.env`, `node_modules`, or `dist`.
2. In Render, create a **Blueprint** from that repository. Review `lensfleet-website` and confirm the **Free** plan.
3. Render runs `npm ci --include=dev && npm run build`, starts `npm start`, binds to `0.0.0.0` using Render's assigned `PORT`, and checks `/healthz`.
4. The build uses Render's actual `RENDER_EXTERNAL_URL` for the sitemap, social URLs, and canonical links. The enquiry origin check also recognises that URL.
5. To enable enquiry delivery, add `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` in Render's Environment settings. `CONTACT_TO_EMAIL` defaults to the supplied business address. Redeploy after configuration.
6. For a custom domain, set `PUBLIC_SITE_URL` and `SITE_ORIGIN` to the exact confirmed HTTPS origin, then rebuild/redeploy.

If creating the service manually instead of using the Blueprint, select **Web Service / Node / Free**, use the build and start commands above, set `HOST=0.0.0.0`, and configure the same optional email secrets.

The `prebuild` script checks for the local compiler, React type definitions, and bundler. If Render initially installs only production dependencies, it runs `npm ci --include=dev` before compilation. This also supports a manually configured `npm run build` command. Keep the recommended build command `npm ci --include=dev && npm run build` for reproducible installations.

Free Render web services sleep after 15 minutes of inactivity and can take about a minute to wake. Usage limits apply. There is no persistent database or upload storage in this marketing website. Do not add a paid database or disk for this deployment.

Official references: https://render.com/docs/free , https://render.com/docs/web-services , https://render.com/docs/environment-variables .

## Review implementation

See `REVIEW-FIXES.md` for the supplied review IDs, completed changes and owner-dependent launch requirements. The initial homepage asset estimate is about 282 KB with gzip and 800px AVIF images, including all six sector photographs, the font and the extra hero image. This is a build estimate, not a measured Lagos 3G result.
