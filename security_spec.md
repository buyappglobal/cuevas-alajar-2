# Firestore Security Specification: Peña de Arias Montano

## 1. Data Invariants
- A Reservation must have a valid date, time, customer details, and totalTickets (1-20).
- Slots aggregate bookings and must not exceed the global limit (30).
- Admin access is derived from the `admins` collection, which is restricted to bootstrap emails and existing admins.

## 2. The "Dirty Dozen" Payloads (Examples)
1. Unauthorized Creation: Missing fields in Reservation.
2. Capacity Overflow: Booking 21 tickets in a single request.
3. ID Poisoning: Malicious long string as `reservationId`.
4. Role Hijacking: User trying to set `role: 'admin'` in their profile.
5. PII Leak: Reading all documents in `reservations` where `email` is present.
6. Status Manipulation: Directly changing `status` to 'paid' without payment integration.
7. Terminal State Mutation: Updating a cancelled reservation.
8. System Field Injection: Adding `isSystemGenerated: true` to a reservation.
9. Timestamp Spoofing: Providing a past `createdAt` value.
10. Orphaned Slot Write: Trying to create a slot that doesn't correspond to a date.
11. Admin Lockdown: Admin trying to remove themselves from the admin list.
12. Bulk Read: Querying slots without required where clause.

## 3. Test Runner
Will be implemented in `firestore.rules.test.ts`.
