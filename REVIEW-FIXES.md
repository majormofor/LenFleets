# LensFleet review implementation — 25 October 2026

**Current stage:** The owner subsequently confirmed that the app is a work in progress. The website now presents capabilities as planned, uses registration of interest instead of demo bookings, and removes the unconfirmed active-pilot claim. These changes supersede earlier launch-ready wording below. See `review/CLAIMS-AUDIT.md`.

The supplied review is a work list, not evidence that device partnerships, hosting locations, prices or pilot results are verified. No such facts were invented.

| Review IDs | Implemented | Remaining dependency |
| --- | --- | --- |
| F1 | Transparent white vector lockup in header/footer, 168px desktop / 140px phone; SVG favicon, 16/32/180/192/512 PNGs and manifest. Original vector outlines extracted from the supplied brand PDF. | The shared v2 artifact lists the SVG files, but their previews/downloads are unavailable in its read-only view; original PDF artwork remains in use. |
| F2 | Spaces before heading line breaks throughout; checked in all 22 generated pages. | None. |
| F3 | Full-screen native modal dialog, scroll lock, focus trap, initial close-button focus, Escape, route/link close and focus restoration. | Final target-device checks. |
| F4–F5 | Readable nav/buttons/footer, 12px labels, neutral dark palette, shared token stylesheet, no hex colours in layout stylesheets. | Official v2 tokens now imported from the owner’s shared Brand Book. Token colours, spacing, radii, type styles and floating-layer shadow generate from the saved source. Outfit is self-hosted as its required web substitute. |
| F6 | Supplied company disclosure and office in footer; expanded privacy/terms drafts; explicit privacy/terms robots exclusions removed. | Approved legal policies, lawful bases, mailbox/waitlist retention and processor/hosting details. Drafts remain noindex and excluded from the sitemap. This P0 item is NOT complete. |
| F7 | Empty disc removed; original falcon displayed. About uses the v2 mission and vision, with the story adapted to the owner-confirmed development stage. | Founder identity and UK/Nigeria team details are not specified in this book and remain unclaimed. The book mentions a Lagos pilot, but current status/permission remain unverified; that claim is now withheld. |
| F8 | Accessible field validation and success/error states; acceptance requires the email provider to return an ID; Home waitlist enquiries labelled separately. | Configure Resend if needed; live Render URL and actual mailbox receipt test. Acceptance is not proof of inbox delivery. |
| C1–C3 | Brand Book v2 copy sweep: live views/recordings, consent wording, direct product copy, one Platform setup note, hidden decorative arrows, no heading arrows; hero has one honest example-data caption. | Real staging screenshots, recordings and 15-second loop. |
| C4 | Trust strip uses owner-supplied UK company details, Lagos development focus and planned camera/GPS scope; the active-pilot claim is removed. | Teltonika/Jimi integrations, data country and compliance statements remain unconfirmed. Shelleyes is a reference device class in the book, not proof of a tested integration. |
| C5 | Devices and Pricing pages; NGN/GBP itemised-quote paths. Sign in removed from desktop and mobile navigation at the owner’s request on 25 October 2026. | Approved models, device photos and actual prices. |
| C6 | Existing stock photography retained with responsive formats and accurate descriptions. | Documentary photos and Lagos pilot shoot. Not marked complete. |
| C7 | Six homepage sections: hero, trust strip, three proofs, sectors, one scenario, CTA. Toolkit stays on Platform. | None. |
| C8 | Removed reveal observer; content remains fully visible; reduced-motion support preserved. | None. |
| C9 | AVIF/WebP 480/800/1200 variants, picture/srcset, lazy images, dimensions; gzip for production text assets. | Actual Render/Lagos 3G measurement. Estimated full-scroll resources: 281,918 bytes with gzip, 800px AVIF, font and extra hero image. Not a Lighthouse/network measurement. |
| C10 | Unique page descriptions; Organization JSON-LD; Product JSON-LD on Home/Sentinel; client navigation updates schema. Canonicals use the configured origin or Render origin. | Confirm domain connection and set PUBLIC_SITE_URL=https://lensfleet.com before rebuilding for that domain. |
| C11 | Owner-approved info@lensfleet.com and +44 7511 802724 shown on Contact and in the footer, with email/call links and registered office. | WhatsApp not added: the number was approved as a phone contact, with no WhatsApp service confirmed. |
| C12 | Visible 2px focus rings; decorative icons hidden; existing keyboard tab controls retained. | None beyond target-device QA. |
| X1 | No fabricated case study. | Pilot results, operator permission and quote. |
| X2 | Security & privacy page gives deployment questions and a contact path. | Written encryption, access-log, data-location, retention and deletion specifications before publishing those as guarantees. |
| X3 | Home and footer link to a working waitlist enquiry flow. | Configure email delivery; app-store links when published. |
| X4 | Resource index plus three practical guides. Body-camera guide links to primary ICO guidance. | Editorial approval and future real examples. |
| X5 | Naira quote option, Lagos context, Nigeria enquiry path. | Approved Nigerian contact/address, shipping/import/fitting commitments and prices. |

## Verification

- `npm run check`: TypeScript and production build; 22 prerendered pages; unique titles/descriptions; heading spacing; 1,286 internal/asset references; image dimensions; schema; manifest; token checks.
- Seven contact-handler tests: validation, missing delivery configuration, rejected origins/spam, Render origin handling, rate limit, provider acceptance/failure, Home waitlist labelling.
- Browser: mobile layout, modal initial focus, reverse-tab containment, Escape focus restoration, closing on Pricing navigation, GBP/NGN switching, Home waitlist defaults and validation focus.
- Production server: gzip, AVIF and manifest MIME types, deep route responses and missing-route status checked locally.

Live Render deployment and mailbox receipt have not been verified. The missing legal and company-specific approvals still prevent calling the complete launch review finished.

## Brand Book supplied after the initial review

Source: https://claude.ai/artifact/863GxHmfAjTnDfkktzdjvv#readme . Visible v2 tokens, story, mission, vision, logo rules, sectors and voice guidance were read and saved under `brand-book/`. F5’s official palette and F7’s v2 narrative requirements are now implemented. The published story was later adapted to the owner-confirmed development stage. The book contains additional semantic colours and neutral tokens, so the website follows that palette rather than an artificial limit of two greys. See `brand-book/SOURCE.md` for source and access limits.
