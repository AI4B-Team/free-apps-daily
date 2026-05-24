## Goal
Replace the hardcoded apps data in `FreeAppsDaily.tsx` with a live backend, and add a protected `/admin` panel for managing daily drops, all on Lovable Cloud (no Cloudflare D1 / wrangler / Resend — those don't run here).

## Mapping the uploaded stack → Lovable Cloud

| Uploaded | Replaced with |
|---|---|
| Cloudflare D1 (`wrangler.jsonc`, `src/db/schema.sql`, `src/lib/db.ts`) | Lovable Cloud Postgres tables + RLS |
| `wrangler secret put ADMIN_PASSWORD` + token sessions | Supabase Auth + `user_roles` table (`admin` role) |
| Resend (`src/lib/email.ts`) | Skipped for v1 (we'll stub `claimApp` to just record the unlock + return the affiliate URL). Email can be added later via Lovable Email or a Resend secret. |
| `src/server-fns/index.ts` (vinxi/h3) | `createServerFn` files under `src/lib/*.functions.ts` using `requireSupabaseAuth` + `supabaseAdmin` |

## Step 1 — Enable Lovable Cloud
Call `supabase--enable`.

## Step 2 — Schema (migration)
Tables (snake_case, with RLS):
- `apps` — id (uuid), name, category, emoji, offer, value_cents, description, affiliate_url, badges (text[]), active_date (date), featured (bool), our_pick (bool), active (bool), sort_order (int), created_at, updated_at
- `subscribers` — id, email (unique citext), industry, source, confirmed, created_at
- `unlocks` — id, email, app_id (fk apps), affiliate_url, claimed_at, unique(email, app_id)
- `app_role` enum (`admin`, `user`) + `user_roles` table + `has_role(uuid, app_role)` SECURITY DEFINER function (per project rules — roles MUST be in a separate table)

RLS:
- `apps`: public SELECT only `WHERE active AND active_date = today`; admin full access via `has_role(auth.uid(), 'admin')`
- `subscribers` / `unlocks`: no public SELECT; INSERT allowed publicly (for signup/claim); admin full access
- `user_roles`: only admins can modify; users can read own roles

Live "claimed today" count: a view `apps_today_with_counts` (security_invoker) joining apps with `count(unlocks)` for today.

## Step 3 — Server functions (`src/lib/apps.functions.ts`, `subscribers.functions.ts`, `admin.functions.ts`)
- `fetchTodaysApps()` — public, uses `supabaseAdmin` scoped by date, returns safe columns
- `subscribe({ email, industry, source })` — public, inserts subscriber (upsert on email)
- `claimApp({ email, app_id })` — public, inserts subscriber if new + insert unlock + return affiliate URL
- `fetchAllApps()` — admin only (`requireSupabaseAuth` + `has_role` check)
- `saveApp(app)` / `removeApp(id)` / `setAppActive(id, active)` — admin only
- `fetchAdminStats()` — admin only (subscriber count, unlock count)

## Step 4 — Auth
- Email/password sign-in for admin only (no public signup UI for v1).
- Add a `/login` route. After login, check `has_role(uid, 'admin')`; if not admin, sign out + error.
- Add `attachSupabaseAuth` middleware to `src/start.ts` if not already wired.
- Seed: after Cloud is enabled, instruct user to create their admin account at `/login` (signup), then we'll add them to `user_roles` via a one-off SQL insert.

## Step 5 — Admin panel (`src/routes/admin.tsx` + `src/components/AdminPanel.tsx`)
Port the uploaded `AdminPanel.tsx` UI, but swap:
- `adminLogin` → `supabase.auth.signInWithPassword`
- `sessionStorage` token → Supabase session
- `fetchAllApps`/`saveApp`/`removeApp`/`setAppActive`/`fetchAdminStats` → new server fns
Keep the same UI: list, edit modal, badges multi-select, featured/our_pick toggles, active toggle, subscriber count.

## Step 6 — Wire `FreeAppsDaily.tsx` to live data
- Replace the hardcoded `APPS` array with `useQuery` calling `fetchTodaysApps`.
- Keep all visual code (badges, hero, owned section, trust logos) untouched.
- Replace the email-capture submit handler with `subscribe()` server fn.
- Replace "Claim" buttons with `claimApp()` → opens affiliate URL in new tab.
- Loading skeleton + empty state when no apps for today.

## Step 7 — Seed data
Insert ~6 sample apps for today's date so the homepage isn't empty on first load (matches the current hardcoded set: Descript, Notion AI, Jasper, Pictory, Real Elite, REVVEN).

## Out of scope (call out to user)
- Transactional email (welcome / unlock emails) — needs Lovable Email or a Resend secret; can add in a follow-up.
- Daily cron digest.
- Public user signup (only admin auth in v1).

## Technical notes
- All server fns return plain DTOs.
- `supabaseAdmin` is used for public reads (apps) so we don't need broad anon RLS policies — only the server function exposes safe columns.
- Admin checks happen inside `.handler()` via `has_role` RPC, not just via middleware.
