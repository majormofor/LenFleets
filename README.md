# LensFleet marketing website

React + TypeScript + Vite. All website source lives in this workspace root.

## Run

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
npm run preview
```

## Launch configuration

Edit `src/config.ts` to add verified iOS/Android app links, approved legal page URLs, and a real HTTPS enquiry endpoint. The endpoint receives JSON containing `name`, `email`, `company`, `businessType`, `fleetSize`, and `message`; configure CORS and server-side validation. The form reports success only after a successful HTTP response. Without an endpoint it clearly states that nothing was sent.

All phone screens, maps, alerts, and status examples are illustrative concepts. No location service, authentication, database, or tracking backend is included. No fabricated ratings, testimonials, or app-store URLs are used.

Navigation uses hash routes to support static hosting: `#/apps`, `#/solutions/vehicle`, `#/solutions/asset`, and `#/solutions/family`. Legal placeholder pages must be replaced with reviewed policies before public launch. QR placement remains a labeled placeholder until verified download URLs are provided.

CTA clicks dispatch a `lensfleet:cta` CustomEvent on `window` with `{ cta, page }` details. Connect an analytics listener if required; no external analytics is enabled by default.
