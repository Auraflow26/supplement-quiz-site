# Supple-MEANT Demo Store — Design

Date: 2026-10-01 · Status: approved

## Goal

A working demo website for Supple-MEANT: personalized supplement coffee creamer and liposomal drops. Visitors create an account, take a quiz, get a personalized blend with reasons, and place a **demo order** (no payment processing, no real store).

## Stack

| Job | Tool |
|---|---|
| Site + hosting | Next.js (App Router) on Vercel |
| Auth (sign up, log in, password reset) + data (quiz answers, blends, demo orders) | Supabase (via Vercel Marketplace) |
| Order confirmation email | Resend (via Vercel Marketplace); without a verified domain it sends only to the account owner's address |
| Funnel analytics | Vercel Analytics |

Not used: Shopify, Stripe, Clerk.

## Brand

"Warm cafe": cream `#F6EFE6` background, espresso `#3B2A20` text, terracotta `#C2410C`-family accent. Serif display headlines (Fraunces), sans body (Inter). Tagline "Supple-MEANT for you!".

## Pages

1. `/` Home — hero ("Your supplements, poured into your coffee."), how it works (3 steps), products (creamer, drops), "made for" sections (lifters / busy days / new moms), FAQ, supplement disclaimer footer.
2. `/signup`, `/login`, `/reset-password` — email + password. Password rule: ≥10 characters, ≥1 uppercase. Inline errors for empty/invalid fields. Account required before the quiz.
3. `/quiz` — one question per screen, progress bar, answers autosaved after each step; resumes where the user left off.
4. `/blend` — recommended product, base + up to 3 packs, why each pack was picked, flavor, serving, price, subscribe/one-time toggle (display only), "Continue to checkout".
5. `/checkout` — shipping + billing forms; card step shows a read-only test card (4242 4242 4242 4242) and a "Demo store — no payment is taken" banner. Real card data is never requested or stored.
6. `/order/[id]` — confirmation page; confirmation email sent.
7. `/account` — current blend, retake quiz, demo orders.
8. `/staff` — list of demo orders with each blend's recipe (in-house mixing view). Demo only; visible to any signed-in user.

## Formula engine

Pure function `recommend(answers) → Blend`. Fixed packs: Energy, Calm, Recovery, Sleep, Gut-friendly, Postnatal. Rules map answers to a base plus up to 3 packs (ranked by score), plus flavor and form. Safety: pregnant/breastfeeding users only receive packs marked safe for that life stage; stomach-sensitive users always get Gut-friendly and never harsh-flagged ingredients. Deterministic rules, no AI. Ingredient doses shown are illustrative and labeled as such.

## Data (Supabase, RLS: users read/write own rows)

- `quiz_responses(user_id pk, answers jsonb, step int, completed_at, updated_at)`
- `blends(id, user_id, product, flavor, packs text[], reasons jsonb, created_at)`
- `orders(id, user_id, blend_id, plan, price_cents, shipping jsonb, billing jsonb, status, created_at)`

## Error handling

- Quiz autosave failure → keep answers in local state, retry on next step.
- Email send failure → order still saved; confirmation page notes the email could not be sent.
- Server-side validation on every form.

## Testing

- Unit: formula engine with JChest, Bobby, and Anna fixtures.
- E2E: sign up → quiz → blend → demo checkout → confirmation.

## Out of scope (Sprint 2)

Product detail pages, reviews tab, "Learn" articles.
