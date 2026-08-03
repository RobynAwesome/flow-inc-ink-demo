# Flow Inc Ink — Client Request Audit

**Audit date:** 3 August 2026  
**Source of truth:** the client instruction reproduced below, the current `main` repository, merged PRs #1–#5, and observable repository evidence.

## Governing rule

The client did not ask for a collection of pages that merely exist. The client asked for a usable tattoo-studio product with specific information architecture and operational outcomes.

A request is classified as:

- **POC validated** when the requested function exists and can be evidenced in the repository.
- **Partial POC** when the structure exists but client media, approval, credentials or backend functionality are still missing.
- **FOC risk** when the interface or wording suggests that an unimplemented capability is already working.

---

## Exact requirement matrix

### 1. Home

**Client instruction**

> The home page is perfect, flow and everything.

**Repository evidence**

- Existing Home information architecture is preserved.
- Portfolio, founder, trust, events, location and booking sections remain present.
- Adaptive motion, lightbox and PWA enhancements were added around the approved structure.

**Verdict:** **POC validated**

The Home page was not supposed to be redesigned into a different product. It remains the visual and conversion front door.

---

### 2. Services

**Client instruction**

> Services break away to a new page when clicked on. This page will be split between tattoos on the top section and piercings on the bottom section. There are different types of piercings and an educational gallery of different piercing types and styles will be labelled on the picture of the piercing.

**Repository evidence**

- `services.html` is a dedicated route.
- `#tattoos` appears before `#piercings`.
- Tattoo cards cover custom, fine-line/micro and temporary work.
- Piercing information is divided into ear, facial and body categories.
- The educational gallery places labels directly over piercing images.
- Booking controls connect service intent to WhatsApp.

**Remaining evidence gates**

- Studio approval of every placement label.
- Studio approval of public prices and spelling/terminology.
- Mobile visual inspection of every overlaid label.

**Verdict:** **POC validated structurally; content approval pending**

---

### 3. About

**Client instruction**

> About will be the comprehensive about section for the company. This will act as the corporate hub to centralize vital information for collaborators, financiers, event management, vision/mission, culture roots, our artists, etc.

**Repository evidence**

`about.html` includes:

- company profile;
- vision;
- mission;
- culture roots;
- founder and head artist;
- artist and operational team;
- collaborator pathway;
- financier pathway;
- event-management pathway;
- artist, media and growth pathways;
- corporate enquiry action.

**Remaining evidence gates**

- Client approval of company dates, registration details and biography.
- Approval of finance/franchise/expansion wording.
- Additional artist media and portfolio links where available.

**Verdict:** **POC validated structurally; corporate content approval pending**

---

### 4. Tours / Events

**Client instruction**

> This page should have pictures of the various tattoo tours and flags of countries we have had presence in and also be the page that advertises upcoming tours or events.

**Repository evidence**

- `tours-events.html` exists.
- Country flags are present for South Africa, Mozambique and Botswana.
- An upcoming-events section exists.
- Event-format and event-enquiry sections exist.
- A visual archive shell exists.

**Failure against the exact instruction**

The archive currently uses founder, storefront and studio-work imagery. It does **not** contain verified, location-specific photographs from the various tattoo tours.

No confirmed upcoming tour date is published. The page truthfully says that the next stop is to be announced.

**Verdict:** **Partial POC**

The route and content model are valid. The client’s actual tour photographs, captions, countries and dates are still required before this requirement is complete.

---

### 5. Contact

**Client instruction**

> Standard contact page with the Google map of the placement.

**Repository evidence**

- `contact.html` exists.
- Address, phone, email, WhatsApp and enquiry controls exist.
- Google Maps directions links exist.
- A Google Maps embed exists in the base page.
- The merged progressive enhancement replaces the map region with an interactive Leaflet map, zoom controls, studio marker and Google Maps handoff.

**Production evidence still required**

- Confirm that the latest merged commit is deployed.
- Confirm map tiles and marker render on the public URL.
- Confirm the Shop M3A marker position with the client.

**Verdict:** **Repository POC validated; public production runtime not independently verified in this audit**

---

### 6. Blog

**Client instruction**

> The Blog should grow over time with posts educating people on tattoos, their history, safe aftercare and other insightful topics to drive SEO. Posts will be uploaded periodically and will send an email to subscribers. The purpose is authority, sanitary-practice education and sobriety awareness.

**Repository evidence**

- `blog.html` exists.
- Three article routes exist:
  - tattoo aftercare;
  - sanitary practices;
  - sobriety before tattooing or piercing.
- Metadata and sitemap entries exist.
- A subscription interface exists.
- The Blog carries the requested “We cool, but we care” direction.

**Failures against the exact instruction**

- No dedicated tattoo-history article currently exists.
- There is no CMS or publishing workflow for periodic uploads.
- There is no subscriber database.
- There is no email provider integration.
- No automated notification is sent when a post is published.
- Blog routes remain `noindex` while health, legal, authorship and studio-specific claims await review.
- Therefore the Blog cannot yet prove the requested SEO outcome.

**Verdict:** **Partial POC with a significant FOC risk if described as an active newsletter or SEO engine**

The current form opens WhatsApp so the studio can record an update request. That is not email automation.

---

## Additions beyond the original instruction

These features add value but must not be used to distract from unfinished client requirements:

- adaptive Motion runtime;
- gallery lightbox;
- PWA/offline behaviour;
- KPGS/HUE protocol laboratory;
- Instagram profile hub;
- Instagram and Facebook server adapters;
- repository content guards;
- POC/FOC approval state.

They are useful. They do not replace actual tour media or the missing email-subscription system.

---

## Final audit verdict

| Area | Verdict |
|---|---|
| Home | **POC validated** |
| Services | **POC validated; approval pending** |
| About | **POC validated; approval pending** |
| Tours / Events | **Partial POC** |
| Contact and map | **Repository POC validated; production verification pending** |
| Blog content structure | **Partial POC** |
| Blog email notifications | **Not implemented** |
| Blog SEO outcome | **Not validated** |

## Honest statement to the client

> The requested multi-page product architecture is implemented. Services, About and Contact match the requested structure at POC level. Tours / Events still requires the client’s verified tour photographs and dates. The Blog exists with aftercare, sanitary-practice and sobriety content, but tattoo-history content, periodic publishing operations and automated subscriber emails remain outstanding. We will not describe those unfinished capabilities as live.

---

## Next completion sequence

1. Collect and publish verified tour photographs, dates, cities and country captions.
2. Confirm all displayed piercing labels and public prices with the studio.
3. Add and review a tattoo-history article.
4. Select an email provider and implement subscriber consent, storage, unsubscribe and test delivery.
5. Complete qualified review of health, legal and studio-specific Blog claims.
6. Remove Blog `noindex` only after those approvals.
7. Verify the merged Git commit on Vercel and record mobile route tests.
8. Measure SEO and conversion only after production publication.
