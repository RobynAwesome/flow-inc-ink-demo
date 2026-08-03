# Flow Inc Ink social and map integration

## Confirmed public profiles

- Studio: `https://www.instagram.com/flow_inc_ink/`
- Founder / Head Artist: `https://www.instagram.com/snow_ink_flow/`
- Tattoo Artist: `https://www.instagram.com/inkboy_que_backup/`
- WhatsApp booking: `+27 60 618 4165`

The repeated `flow_inc_ink` URL is treated as one canonical studio profile. The supplied Google search for Inkboy Que is discovery evidence, not a canonical Facebook Page URL.

## Interactive map

The website uses Leaflet with OpenStreetMap tiles at the public Boulders Shopping Centre location and retains a direct Google Maps directions link. This works without a Google Maps API key. The marker is centred near `-25.9969, 28.1275`; Shop M3A should be visually confirmed by the client before the location is treated as survey-grade coordinates.

## Instagram live feed

The browser calls `/api/instagram-feed`. The serverless function requires authorised Instagram Professional accounts and the following Vercel environment variables:

```text
META_GRAPH_VERSION
IG_FLOW_USER_ID
IG_FLOW_ACCESS_TOKEN
IG_SNOW_USER_ID
IG_SNOW_ACCESS_TOKEN
IG_QUE_USER_ID
IG_QUE_ACCESS_TOKEN
```

Optional:

```text
PUBLIC_IG_COMMENTS=true
META_IG_GRAPH_BASE=https://graph.instagram.com
```

Comments remain off by default. When enabled, the server returns only short comments without links; further human moderation is still required.

## Facebook Page feed

The browser does not invent or scrape a Facebook identity. `/api/facebook-feed` activates only after the client supplies the canonical Facebook Page and authorises the Meta app.

```text
META_GRAPH_VERSION
FACEBOOK_PAGE_ID
FACEBOOK_PAGE_ACCESS_TOKEN
PUBLIC_FACEBOOK_COMMENTS=true
```

## WhatsApp

The current production function is user-controlled Click to Chat. It opens a prepared message and sends nothing until the customer confirms inside WhatsApp.

WhatsApp Cloud API automation requires a Meta business portfolio, WhatsApp Business Account, business phone number, access token, template governance, consent handling, webhook verification and anti-abuse controls. It is not marked active in `content-approvals.json`.

## POC / FOC boundary

Implemented and testable:

- profile links
- interactive Leaflet map
- Google Maps directions
- server-side Instagram adapter
- server-side Facebook adapter
- comment privacy switch
- network-only API behaviour in the service worker

Pending external authorisation:

- live Instagram photographs
- public Instagram comments
- Facebook Page posts and comments
- WhatsApp Cloud API messaging

Do not set the corresponding approval flags to `true` until Vercel environment variables, account permissions and live responses are verified.
