# ASSMIA POS acceptance tests (run before real use)

1. Register user A, create Restaurant A and menu item (₹120.00). Create cash test order, check KOT and invoice number INV-000001.
2. Register user B (separate browser/incognito), create Restaurant B. Verify user B cannot see A's menu, orders, order items or update A's order status, even if A's UUIDs are copied into requests.
3. Test zero items, negative discount, discount above subtotal, tax outside 0..100%, invalid quantities, unavailable products, other-tenant menu UUIDs: all should be rejected by the RPC.
4. Submit two orders concurrently to A; invoice numbers must be unique and transactions must persist matching totals.
5. Verify a normal restaurant owner cannot view /admin data; grant platform admin only through manually controlled Supabase SQL Editor and confirm it can see restaurants.
6. Verify a suspended restaurant cannot create new orders.
7. Test kitchen transitions and refresh, menu availability toggle, cash/UPI/unpaid labels.
8. Test with Email confirmation enabled AND disabled, including logged-out access, refresh/logout/reauthentication and password error handling.
9. Run automated Postgres RLS permission tests with Supabase CLI before any customer launch; manually auditing from the UI is NOT enough.
10. Before any LIVE tax invoice/payment usage: verify tax classification and invoice fields, implement receipt template + printer integration, automated subscriptions/webhooks, backups, support access controls, staff invitations, audit trails, operational monitoring, and security review.
