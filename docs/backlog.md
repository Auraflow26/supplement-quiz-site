# Backlog & Sprint Plan

Source: Lab 3 board (Tech Management Group 2) and user story map. Issue keys match the team board (`TEC-*`).

## Sprint plan

- **Sprint 1 — core site:** create an account, take the quiz (decides which product the user gets), and the order process so users can actually buy.
- **Sprint 2 — extras:** supplement descriptions and a review tab so users can learn more about the product.

## User stories

| Key | Story |
|---|---|
| TEC-5 | User story 1: Celia |
| TEC-37 | User story 2: JChest |
| TEC-38 | User story 3: Bobby McBob |
| TEC-39 | User story 4: Anna |

Personas: [personas.md](personas.md)

## Issues by epic

### Create Account (Sprint 1)

| Key | Issue | Status |
|---|---|---|
| TEC-11 | Enter name, email, and password | Done |
| TEC-12 | Send confirmation email when account is created | Done |
| TEC-13 | Password reset button if user forgets password | Done |
| TEC-14 | Link user activity to their account when signed in | Done |
| TEC-29 | Meet password requirement: 10 characters minimum, one uppercase, ... | In Progress |
| TEC-28 | Show error if a field is left unfilled | Todo |
| TEC-30 | User can enter email to receive a password reset link | Todo |
| TEC-10 | User can log back into account later (saved in database) | Todo |

### Create Quiz (Sprint 1)

| Key | Issue | Status |
|---|---|---|
| TEC-25 | Button that takes the user to the quiz | In Progress |
| TEC-27 | Form that collects daily routine, personal habits, wellness concerns, demographics | In Progress |
| TEC-31 | Pop-up summarizing recommended supplements and why | In Progress |
| TEC-26 | Choose supplement form | Todo |

### Order Procedure (Sprint 1)

| Key | Issue | Status |
|---|---|---|
| TEC-20 | Button to check out and order | Backlog |
| TEC-15 | Ask user for card information for payment | Backlog |
| TEC-17 | Enter billing information | Backlog |
| TEC-18 | Enter shipping information and address | Backlog |
| TEC-16 | Send email receipt and confirmation after order | Backlog |

### Supplement Breakdown (Sprint 2)

| Key | Issue | Status |
|---|---|---|
| TEC-22 | Write out descriptions | Todo |
| TEC-23 | List supplements on website | Todo |
| TEC-24 | Combine the supplements | Todo |

### Review Tab on Website (Sprint 2)

| Key | Issue | Status |
|---|---|---|
| TEC-32 | Create "customized supplement" product tab on website | Backlog |
| TEC-33 | Drop-down where reviews are shown | Backlog |
| TEC-34 | Sort reviews by top rated, lowest rated, most popular, most recent | Backlog |
| TEC-35 | Allow reviewers to attach photos | Backlog |

> Board statuses are planning status, not code status. No site code exists yet.

## User story map

```
Take Quiz ────────────────────────────────────────────────────────────►  Order Supplements

Navigate to quiz    Answer questions      Choose form           Submit order        Confirmation
─────────────────   ───────────────────   ───────────────────   ─────────────────   ─────────────────
Scan website        Enter daily routine,  Coffee creamer,       Enter shipping      Receive
  on entry          habits, wellness      liposomal drops, or   information         confirmation
Search for quiz     concerns,             protein shake                             email
  button            demographics          Read description      Enter billing
                    Read questions        of each form          information
                    carefully
                    ⚠ Leave when email
                      is requested
                    ⚠ Don't take quiz
```
