# Deployment

## Production URL

- https://flow-inc-ink-demo.vercel.app

## Vercel

This is a static PWA. Vercel serves the repository root using `vercel.json`.

## Google Maps

The storefront image and location CTA open a Google Maps search for:

Flow Inc Ink, Shop M3A, Boulders Shopping Centre, Midrand, Gauteng, South Africa.

## GitHub → Vercel workflow

1. Connect this repository to the existing Vercel project `flow-inc-ink-demo`.
2. Set the production branch to `main`.
3. No build command is required.
4. The output directory is the repository root.
5. Every push to `main` should create a production deployment after the Vercel Git connection is enabled.
