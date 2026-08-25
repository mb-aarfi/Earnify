# Backend Handoff Guide

This document helps backend developers integrate with the Earnify frontend.

## Frontend Architecture

```
Next.js App Router (pages)
        ↓
Reusable Components (src/components/)
        ↓
React Query Hooks (src/hooks/)
        ↓
API Service Layer (src/lib/api/)
        ↓
Mock API (src/mocks/) ← Replace with real backend
```

## Mock API Architecture

Each domain has a service file in `src/lib/api/`:

| File | Functions |
|------|-----------|
| `providers.ts` | `getProviders`, `getNearbyProviders`, `getProviderById` |
| `bookings.ts` | `createBooking`, `getBookings`, `cancelBooking`, `updateBookingStatus` |
| `services.ts` | CRUD for provider services |
| `users.ts` | Customer/provider profiles, contact phone |
| `reviews.ts` | `getReviews`, `createReview` |
| `notifications.ts` | Notification CRUD |
| `location.ts` | Location, availability, earnings, time slots |
| `client.ts` | `apiRequest`, `simulateApiCall`, config |

**To integrate:** Replace function bodies to call `apiRequest()` instead of mock data. Keep the same function signatures and return types.

## TypeScript Types

All types are in `src/types/`:

- `user.ts` — User, CustomerProfile, MockSession, UserRole
- `provider.ts` — Provider, Service, filters, sort options
- `booking.ts` — Booking, BookingStatus, CreateBookingInput
- `review.ts` — Review, CreateReviewInput
- `notification.ts` — Notification types
- `location.ts` — Coordinates, Location
- `api.ts` — ApiResponse, PaginatedResponse, availability, earnings

## Environment Variables

```env
NEXT_PUBLIC_APP_NAME=Earnify
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_API_BASE_URL=https://api.earnify.com/api
```

When `NEXT_PUBLIC_USE_MOCK_API=false`, service functions should use real HTTP calls.

## Booking Status Flow

```
pending → accepted → confirmed → in_progress → completed
pending → rejected
any active → cancelled
```

Frontend components use `BookingStatusBadge` and `BookingTimeline` which depend on these statuses.

## Roles

```typescript
type UserRole = "customer" | "provider";
```

- Customer routes: `/customer/*`
- Provider routes: `/provider/*`
- Auth is currently mock session in localStorage (`src/lib/session.ts`)

Future auth should replace `getSession()` / `setSession()` with JWT tokens.

## Required API Data

### Provider object must include:
- Basic info (name, category, bio, rating, verified)
- Location with coordinates
- Services array with pricing
- Portfolio images URLs
- Phone number for contact abstraction

### Booking object must include:
- Customer and provider info
- Service details
- Address, date, time
- Status and timestamps

## Location Data

Frontend sends location as:

```json
{
  "latitude": 26.8467,
  "longitude": 80.9462,
  "radiusKm": 10
}
```

Backend should calculate `distanceKm` for each provider in nearby search results.

## React Query Invalidation

Hooks invalidate these query keys on mutations:

- `["bookings"]`, `["providerBookings"]`
- `["providerServices"]`
- `["providerProfile"]`, `["customerProfile"]`
- `["reviews"]`, `["notifications"]`
- `["availability"]`

Ensure backend responses trigger the same cache invalidation patterns.

## Contact Abstraction

Phone calls go through `src/lib/contact.ts`:

```typescript
handleCallProvider(providerId) // Uses getContactPhone API
handleMessageProvider(providerId) // Shows "coming soon" toast
```

Backend should provide provider phone via a secure endpoint (not exposed in public provider listings if privacy is required).

## File Uploads (Future)

UI components for file upload exist conceptually. Backend needs:

- `POST /uploads` for profile photos, portfolio, booking attachments
- Return public URLs for display

## Payment (Future)

Frontend shows "Estimated Price" and "Payment integration coming soon". No payment UI is implemented.

## Testing Integration

1. Set `NEXT_PUBLIC_USE_MOCK_API=false`
2. Implement one service file at a time
3. Test corresponding routes in the app
4. Run `npm run build` to verify TypeScript compatibility

See `docs/API_CONTRACT.md` for full endpoint specifications.
