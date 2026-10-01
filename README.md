# Supple-MEANT

**Personalized supplements in your drink — "Supple-MEANT for you!"**

Website for a personalized, supplement-fortified coffee creamer. Visitors take a short quiz (daily routine, habits, wellness concerns, demographics), pick a product form (coffee creamer, liposomal drops, or protein shake), and order supplements made for them.

## Core user flow

1. **Take quiz** — find the quiz button on entry, answer questions about routine, habits, wellness concerns, and demographics.
2. **Choose supplement form** — coffee creamer, pure liposomal drops, or protein shake, with a description of each.
3. **Submit order** — shipping and billing information.
4. **Confirmation** — order confirmation email.

Known drop-off point: users who start the quiz but leave when an email is requested.

## Docs

- [Product brief](docs/product.md)
- [User personas](docs/personas.md)
- [Backlog & sprint plan](docs/backlog.md)
- [Demo store design spec](docs/specs/2026-10-01-demo-store-design.md)

## Tech

Next.js on Vercel · Supabase (accounts + data) · Resend (email, optional) · Vercel Analytics. Demo store: no payments are processed.

## Run locally

```bash
npm install
npx vercel link            # project: supplemeant
npx vercel env pull .env.local
npm run dev
```

Database schema: [supabase/migrations](supabase/migrations).

## Tests

```bash
npm test          # blend logic (personas → expected blends)
npm run e2e       # browser test: sign up → quiz → blend → checkout → order (needs dev server on :3100)
```
