# ASSMIA POS — Multi-restaurant Web POS SaaS MVP

**Status:** Development MVP source code. Not deployed, not certified for GST, not tested with production printers/payments. Existing websites untouched.

## Modules included
- Email/password Supabase Auth + restaurant self-onboarding (one restaurant per account initially)
- Separate restaurant records enforced with Postgres Row Level Security (RLS)
- Owner/manager menu management, cashier billing, kitchen KOT list/status, dashboard
- Server-calculated item prices/tax/discount and atomic restaurant-specific invoice sequence
- SaaS super admin overview and manual plan/status controls (no subscription auto-charge)
- Browser print demonstration (not a formatted production receipt)

## Get started
1. Create a **new** Supabase project at https://supabase.com/dashboard — do not reuse existing business databases.
2. Open **SQL Editor** and run `supabase/001_init.sql` in full. Do not run on any existing database.
3. In Supabase Authentication > Providers, enable Email; choose whether to require email confirmation.
4. Copy `.env.example` to `.env.local` and set your new project's URL and anon/publishable key. **NEVER put Supabase service role key in NEXT_PUBLIC variables.**
5. Run `npm install`, then `npm run dev`. Open http://localhost:3000/login.
6. Sign up with a valid email, confirm email if required, sign in, and create a restaurant on dashboard if not created automatically.
7. Create menu items, bill a test order in POS, view KOT in Kitchen, verify dashboard.
8. To enable SaaS admin: edit & run the commented one-time statement in `supabase/002_make_platform_admin.sql` as the project owner in the SQL editor. Log in again and open `/admin`. NEVER add a public admin signup.
9. Create a SECOND account + restaurant; verify restaurant B cannot read/write restaurant A's records. Execute `supabase test db` RLS tests before any commercial release.

## Testing and important limits
- No online payment processing; method is only recorded. No subscription collection, renewals or webhooks.
- There is no customer/staff invitation UI, robust inventory, full offline sync, GST return filing, e-invoice, cancellation audit, reconciliation, refund management, or hardware printer integration.
- GST tax is a manually entered *single percentage* for pilot; invoice is not a legally reviewed tax invoice. Verify tax treatment with a tax professional before real bills.
- Reporting currently totals the last 50 orders only, not official daily accounts.
- Kitchen list polls each 8 seconds. Orders are saved transactionally but status update permission is intentionally basic for the pilot.
- Add tax invoice fields, payment settlement checks, error logging, backups, strict status transition checks, robust automated multi-tenant and concurrent order tests, secure staff invitations, unique outlet numbering, and operational monitoring before production.
- Never use the supplied SQL on your existing Hydotel, CILAXE or other database.

## Architecture
Next.js App Router / React 19 / Supabase JS / Supabase Auth / Postgres RLS + atomic PL/pgSQL order RPC. All values in paise. No service role key in frontend.

## Security posture
Tenant checks enforced by RLS + membership function in `private` schema. Order totals calculated from trusted DB menu prices via security-definer RPC; clients cannot directly insert order records. `platform_admins` must be populated by a privileged SQL operator. Use per-operation grants and security tests prior to production. This is a starter project, not a certified production security audit.
