# Flow Inc Ink — Realism-first POC audit

Audit branch: `audit/realism-first-motion-poc`

## Governing rule

Aesthetics do not replace evidence or functionality. Realism establishes working routes, truthful forms, accessible interaction, adaptive performance and observable deployment state; aesthetics then amplify the tattoo-studio experience without hiding missing capabilities.

## Audit verdict

| Area | Evidence state | Classification |
|---|---|---|
| Multi-page information architecture | Files and routes exist | POC-supported |
| Services, About, Tours/Events and Contact pages | Implemented in repository | POC-supported |
| Google Maps directions and embedded map | Implemented | POC-supported |
| Blog landing page and starter posts | Implemented as drafts | POC-supported draft |
| Blog email subscriber automation | WhatsApp request only; no mailing backend | FOC if presented as automated email |
| Medical/health editorial approval | No approval evidence committed | FOC if presented as reviewed guidance |
| Tour countries, dates and photographs | Approval evidence incomplete | FOC if presented as verified history |
| Framer Motion React integration | No React runtime exists | Not applicable to current architecture |
| Motion design | Motion v12 progressive enhancement plus native Web Animations fallback | POC-supported |
| Production performance | No committed field measurements | Pending evidence |
| Latest Vercel production state | Control-plane verification unavailable during audit | Pending evidence |

## Critical findings

### 1. The visual stack was static, not adaptive

The original site had CSS transitions but no performance-tiered motion runtime. This branch adds:

- Motion v12 loaded only as progressive enhancement.
- Native Web Animations fallback if the external module is unavailable.
- Reduced-motion support.
- `Save-Data`, effective-connection and low-hardware tiers.
- Scroll reveals, page transitions, hero parallax and pointer warmth.
- Portfolio lightbox, reading/scroll progress, route prefetch and PWA install/offline state.

The static site does not use React, so adding React solely to claim “Framer Motion” would increase runtime and build complexity without improving the client’s core functionality. The current Motion package provides the same animation ecosystem for vanilla JavaScript while preserving the dependency budget.

### 2. Image delivery is the principal performance risk

Several repository SVG files contain embedded WebP payloads. This protects portability but prevents responsive `srcset`, AVIF negotiation and independent image caching. The next optimization pass must extract those payloads into responsive image files and generate width variants before production performance can be marked verified.

### 3. The original service worker risked stale pages

The previous cache-first worker could continue serving old client content after repository updates. The replacement uses:

- Network-first navigation.
- Stale-while-revalidate for same-origin static assets.
- Explicit cross-origin exclusion.
- Updated routes for Blog and Tours/Events.

### 4. Forms must state their real transport

Booking, Contact, Tours and Blog subscription interfaces open prepared WhatsApp messages. They do not submit to a private Flow Inc Ink backend. Validation now runs before WhatsApp opens, and UI copy states that the user must choose to send the message through the third-party service.

### 5. Blog content is not publication-ready evidence

The merged Blog contains backdated dates, studio authorship language, health claims and operational claims that have no committed approval record. This branch therefore:

- Adds `X-Robots-Tag: noindex, nofollow` to Blog routes.
- Injects a visible Educational POC disclosure.
- Replaces displayed dates/authorship metadata at runtime with draft labels.
- Records explicit approval booleans in `content-approvals.json`.
- Fails CI if the POC guard is removed before approvals become true.

## Performance and interaction budget

- No React migration for this static POC.
- No large animation framework in the critical rendering path.
- Motion library failure must leave all content and controls functional.
- Reduced-motion users receive functional interaction without animation.
- Save-Data and constrained-device users receive a softer experience.
- All portfolio enlargement and navigation prefetch remain optional enhancements.
- Production performance remains unverified until measured on the deployed Vercel URL.

## Exit criteria for production validation

1. Client approves Blog authorship, dates and each operational claim.
2. Health/safety posts receive qualified editorial review and source attribution.
3. A real email provider stores consented subscribers and sends verifiable test notifications.
4. Tour countries, dates, flags and photographs are tied to client-provided evidence.
5. Pricing and piercing labels receive explicit studio approval.
6. Images are extracted into responsive WebP/AVIF variants.
7. Vercel preview passes repository workflows.
8. Production deployment records the Git commit SHA.
9. Mobile field tests record working navigation, forms, map, offline cache and reduced-motion behavior.
10. Production performance measurements are committed before `productionPerformanceVerified` is changed to `true`.
