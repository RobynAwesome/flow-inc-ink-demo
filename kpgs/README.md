# KPGS APWA / HUE Engine foundation

This branch adds a non-invasive foundation for applying CrisisConnect/KPGS interaction concepts to Flow Inc Ink without disrupting the client-approved home page or the two active Copilot pull requests.

## Protocol stack

`Prompt → PP → EP → BP → KPCB+ envelope → HUE interpretation → KPGS governance → POC validation`

- **Prompting Protocol (PP):** iterative refinement and failure detection, not merely a prompt string.
- **Bracket Protocol (BP):** `[]` hierarchy, `{}` active state, `<>` narrative vessel, `()` interpretation.
- **Emoji Protocol (EP):** symbolic routing where the emoji is the marker and surrounding language is the payload.
- **Kopano Context (KC):** the full prompt, protocol markers, ordinary language, runtime state and evidence carried into one normalized envelope.
- **KPCB+:** the transport representation joining protocol language, context, evidence and governance state.
- **HUE Engine:** interprets intent and context without pretending that interpretation is proof.

## Three operational vectors

This POC uses the existing APWA validation model:

1. **Reality vector** — lived human/street context, location, media and human state.
2. **Runtime vector** — page, device, cloud/session and application state.
3. **Governance vector** — consent, report classification, action, evidence and escalation.

These are kept as explicit objects so the vocabulary can evolve without breaking the event format.

## Implemented files

- `protocol-parser.js` — reads PP, BP, EP and ordinary English.
- `hue-engine.js` — emits a consent-aware KPCB+ event envelope, redacts common PII and marks unsupported claims as FOC risk.
- `crisisconnect-adapter.js` — transmission adapter that remains disabled until a verified CrisisConnect endpoint exists.
- `hue-event.schema.json` — machine-readable event contract.
- `/hue-lab.html` — browser POC for testing the language and output.

## POC / FOC boundary

### Proven in this branch

- Protocol markers can be detected in browser JavaScript.
- Ordinary English can be routed into candidate intents.
- Events can be normalized across reality, runtime and governance vectors.
- Local persistence can require explicit consent.
- Claims without evidence can be marked `FOC-risk-unverified`.

### Not claimed

- No production CrisisConnect API has been discovered or connected.
- No server-side identity, GSMB persistence or cross-application memory exists here.
- No medical or safety decision is automated.
- No personal data is transmitted.

## Integration sequence

1. Review and merge the client Blog and multi-page Copilot PRs.
2. Rebase this branch onto the resulting `main`.
3. Add the HUE bootstrap to selected pages, initially Blog and Contact.
4. Capture only consented engagement events such as article interest, safety education, map opens and booking intent.
5. Connect the adapter only after CrisisConnect publishes a verified authenticated ingestion contract.
6. Validate every remote claim with repository commit, deployment ID and observable runtime evidence.
