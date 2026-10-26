# Claims audit: LensFleet in development

## Current status

On 25 October 2026, the owner confirmed that the app is a work in progress and could not confirm which features are live. This newer statement takes precedence over present-tense wording in the brand book. No product feature is treated as production-proven by this audit.

The marketing website now explains the planned product and accepts general enquiries/interest through its existing email boundary. It does not offer product ordering, promise a working demo, or claim an active customer pilot.

## Proven website facts

| Statement | Evidence | Limit |
| --- | --- | --- |
| The owner says the app is in development. | Owner's explicit message, 25 October 2026. | No feature readiness or launch date was supplied. |
| Website visuals and journey records use example data. | `src/components/Visuals.tsx`, `Sections.tsx`, `pages.tsx`; contextual stock photography documented in `ASSETS.md`. | The Bus 14 route, times and passenger count are not pilot statistics. |
| Enquiries have validation and acceptance/error states. | `ContactForm.tsx`, `server/contact.mjs`, contact tests. | Provider acceptance is not mailbox receipt. Live delivery remains unverified. |
| Email/phone details are approved for publication. | Owner's explicit approval of info@lensfleet.com and +44 7511 802724. | No WhatsApp service is inferred. |
| Prices are not published and the Home enquiry path is a waitlist. | Pricing/Home pages and form code. | A waitlist submission is an enquiry, not an app account or guaranteed launch reservation. |

## Owner-stated but unevidenced facts

This corresponds to the review's “true but unevidenced” group, but we do not assert that an unverified statement is true.

| Statement | Source | Current handling / evidence needed |
| --- | --- | --- |
| Active Lagos bus pilot. | Brand Book v2. | Removed from the website. Confirm current operation, dates, operator permission and the underlying records before publishing. |
| Company registration/name/office. | Owner-supplied disclosure. | Retained as supplied. Reconcile exact legal name and office against the current Companies House record before legal approval. |
| Real device compatibility and installation. | Brand book reference device classes. | Categories described as planned. Require model/firmware list, installation photographs and end-to-end tests. |
| Any customer, partner, operator quote or third-party certification. | None supplied. | Not published. Require identity, evidence and permission. |
| Delivery to info@lensfleet.com. | Configurable email endpoint; no live receipt provided. | A real end-to-end receipt test is still required. |

## Aspirational / planned product claims

All capability descriptions, including sector examples, are now framed by a site-wide development notice. Marketing copy is not treated as evidence that the feature exists.

| Claim family | Where | Evidence required before calling it live |
| --- | --- | --- |
| GPS locations, route history, alerts and asset insights | Home, Platform, Sentinel, sector pages | Working staging journey with actual device updates, timestamps, lost-connectivity behaviour and recorded events. |
| Live camera views and playback | Platform, Sentinel, transport/security pages | Real camera stream and replay; device model, resolution, connection/storage limits and a publishable anonymised sample. |
| Combined journey/clip record | Home, Platform, transport, resources | A working journey with its linked clip and source timestamps; define what a record establishes and what it does not. The generic “verified journey records” homepage claim was removed. |
| Passenger counts | Home example, transport, Platform, Devices | Counting model, installation/door layout, manual ground-truth comparison, measured error and test conditions. No accuracy promise or real passenger statistic is published. |
| Sharing, expiry and recipient permissions | Platform, Sentinel, privacy sections | Tests of unauthorised access, expiry/revocation, access levels and exports, plus real permission screens and access logs. |
| Care visit confirmation | Care page | Arrival/departure logic and agreed deployment/privacy process. A GPS event alone must not be presented as proof that care was delivered. |
| Home family/pet/camera experience | Home, pet page, Platform | Working product, consent/permission controls and device coverage; app-store links only when published. Currently labelled in development with waitlist. |
| Encryption, retention, data location and compliance | Security & privacy / legal drafts | Actual architecture and operational policies, processor list, verified safeguards and appropriate legal approval. None is invented or certified by this website. |
| Pricing, shipping and fitting | Pricing / Devices | Approved prices/currencies, tested devices, installation coverage, commercial terms and delivery arrangements. No prices, orders or shipping commitments currently published. |

## Copy changes made

- Site-wide “In development” notice; planned-feature wording and example-data status.
- Homepage says “We’re building”, with an interest CTA rather than a demo booking.
- Sentinel and Home explicitly labelled in development; selected Platform tabs labelled planned capabilities.
- Unconfirmed active-pilot line removed, including the About page. Brand-book source files remain unchanged; the published story is adapted to the confirmed development stage. Mission and vision remain aspirations from the book.
- Journey records explained as locations, timestamps and linked recordings for comparison, not independent certification or a guarantee that a delivery/visit happened.
- Product schema and page descriptions updated for development status; no offers, ratings or invented launch dates.
- Pricing explicitly unpublished; device categories are not a compatibility/specification catalogue.
- The personal-data enquiry boundary and legal drafts remain explicit; they are not a finished product privacy agreement.

## Evidence to collect when the app is ready

1. Test each feature and record its status: planned, staging-tested, pilot-tested or released. Keep a dated test/demo reference.
2. Capture anonymised real map, journey, clip, permissions and alert screens. Keep permission to publish people, plates and customer material.
3. Run a real pilot only when ready. Keep agreed scope/dates, device list, source logs, a defensible calculation for every metric and written quote/publication approval.
4. Produce a short screen recording with captions and a transcript. Only show actions that work in the build shown.
5. Approve actual product/data flows, retention, hosting, subprocessors and commercial terms with the responsible team and qualified reviewers before launch.

No operator was contacted, no testimonial or result was invented, and no legal policy was represented as approved. The review text is useful guidance; it is not evidence of real product controls or a legal determination.

## Copy inventory

`copy-inventory.json` records the rendered main-page text blocks for all 22 routes, plus the shared capability/group text used by interactive tabs. It is a coverage aid for the audit above, not an automated truth checker or a substitute for source evidence. Navigation labels and shared footer content are checked separately in the site build.

## Owner update — 26 October 2026

The owner confirmed that the business is registered in Nigeria and the UK. The homepage strip and About page now reflect both countries. The existing UK legal disclosure remains specific to its supplied company number and office. No Nigerian legal entity name, registration number or registered office was inferred; those details are still needed for a separate Nigerian legal disclosure.
