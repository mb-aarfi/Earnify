Backend Handoff Guide
Earnify • Frontend → Backend Integration
Purpose: This guide describes the current frontend contracts, the mock-to-real integration boundary, backend responsibilities, required API behavior, security rules, and the frontend changes needed for a clean handoff.
## 1. Frontend Architecture
The frontend is structured so the backend integration should happen primarily at the API service layer:
Next.js App Router (src/app/) → Reusable Components (src/components/) → React Query Hooks (src/hooks/) → API Service Layer (src/lib/api/) → HTTP Backend
During mock development, the API service layer currently uses data from src/mocks/. The intended production boundary is:
Pages/components → hooks → src/lib/api/*.ts → apiRequest() → backend
- Do not move backend calls directly into pages/components.
- Keep React Query hooks responsible for fetching, mutations and cache invalidation.
- Keep API request/response handling in src/lib/api/ and src/lib/api/client.ts.
- Keep mock data as a temporary development/test implementation, not as a production data source.
## 2. Important Mock → Real Integration Note
NEXT_PUBLIC_USE_MOCK_API=false currently does not automatically convert every service function to a real API call. The existing service functions still contain mock implementations. Each relevant function in src/lib/api/ must be updated to use the real HTTP client when production/staging mode is enabled.
Recommended pattern:
if (API_CONFIG.useMock) { return simulate/mock implementation; } return apiRequest(...);
- Preserve the exported function names and frontend-facing return contracts where practical.
- Do not duplicate HTTP logic in every page or hook.
- Once real endpoints are stable, mock implementations can remain for local/demo mode or be removed if the team no longer needs them.
## 3. API Service Files
| File | Current responsibility | Backend integration |
| --- | --- | --- |
| src/lib/api/providers.ts | Provider list, nearby search, provider detail, categories | Provider search/filter/sort/geo APIs |
| src/lib/api/bookings.ts | Create/list/detail/cancel/status/timeline | Booking APIs + state machine + ownership |
| src/lib/api/services.ts | Provider service CRUD | Authenticated provider-owned service CRUD |
| src/lib/api/users.ts | Customer/provider profiles, contact phone | Authenticated profile APIs + controlled contact data |
| src/lib/api/reviews.ts | Reviews, rating distribution, create review | Review eligibility, validation and aggregation |
| src/lib/api/notifications.ts | Notifications, read/unread | Authenticated user notification APIs |
| src/lib/api/location.ts | Location, availability, earnings, time slots | Geo, schedule, slots and earnings APIs |
| src/lib/api/client.ts | HTTP client/config/mock delay | Base URL, auth transport, errors, response parsing |

## 4. TypeScript Data Contracts
Current frontend types live in src/types/:
| File | Important types |
| --- | --- |
| user.ts | User, UserRole, CustomerProfile, Address, MockSession |
| provider.ts | Provider, Service, ServiceCategory, ProviderFilters, ProviderSortOption, ProviderProfileUpdate |
| booking.ts | Booking, BookingStatus, CreateBookingInput, BookingTimelineEvent |
| review.ts | Review, CreateReviewInput, RatingDistribution |
| notification.ts | Notification, NotificationType |
| location.ts | Coordinates, Location, LocationSearchParams |
| api.ts | ApiResponse, PaginatedResponse, TimeSlot, DayAvailability, ProviderAvailability, EarningsSummary, EarningsDataPoint, ServiceInput |

Backend DTOs do not have to be identical to TypeScript interfaces internally, but the JSON contract consumed by the frontend must be agreed and documented. If the backend uses different field names, update the API service/mapping layer rather than scattering mappings across components.
## 5. Standard API Response Contract
The frontend currently expects the following general shape:
{ "success": true, "data": ..., "message": "Success" }
For failures:
{ "success": false, "error": { "code": "...", "message": "...", "fieldErrors": { "...": "..." } } }
- Use stable machine-readable error codes.
- Use fieldErrors for form validation where useful.
- Do not expose stack traces, SQL errors or internal implementation details.
- Recommended codes include NOT_FOUND, UNAUTHORIZED, FORBIDDEN, VALIDATION_ERROR, CONFLICT, SLOT_UNAVAILABLE and NETWORK_ERROR.
- HTTP status codes should still be meaningful; the frontend API client should normalize non-2xx responses into its agreed ApiResponse shape.
## 6. Environment Variables
Example:
NEXT_PUBLIC_APP_NAME=Earnify
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_API_BASE_URL=https://api.earnify.com/api
- Use the real staging/production API URL in Vercel environment variables.
- Do not commit secrets to GitHub.
- Do not put private backend credentials in NEXT_PUBLIC_* variables.
- The final authentication strategy must be agreed before implementing auth headers/cookies in apiRequest().
## 7. Authentication & Roles
Current roles: type UserRole = "customer" | "provider".
- Customer routes are under /customer/*.
- Provider routes are under /provider/*.
- The current src/lib/session.ts uses localStorage and is a mock-only session.
- The auth page currently contains mock OTP behavior and TODOs for real OTP send/verify.
- Backend must authenticate every protected request.
- Backend must derive the authenticated user/customer/provider from the authenticated session, not from a client-controlled userId/providerId.
- The frontend should not assume JWT specifically unless that is the backend team's chosen auth mechanism. Secure cookie/session or another agreed token mechanism is also possible.
- Replace getSession()/setSession() mock behavior once real authentication is integrated.
## 8. Authentication API Requirements
The auth page currently expects the equivalent of:
| Operation | Purpose |
| --- | --- |
| POST /auth/send-otp | Send OTP to the submitted phone/contact identifier |
| POST /auth/verify-otp | Verify OTP and establish authenticated session |
| GET /auth/me | Return current authenticated user/role |
| POST /auth/logout | Terminate/invalidate the current session |

These endpoint names are suggested integration targets; the backend team may use different routes if the final documented contract is equivalent.
## 9. Booking Status Flow
Frontend BookingStatus values:
pending | accepted | rejected | confirmed | in_progress | completed | cancelled
| Current | Allowed next status |
| --- | --- |
| pending | accepted, rejected, cancelled |
| accepted | confirmed, cancelled |
| rejected | none |
| confirmed | in_progress, cancelled |
| in_progress | completed |
| completed | none |
| cancelled | none |

- Backend must enforce transitions regardless of what the frontend sends.
- Customer/provider ownership must be checked before changing a booking.
- Cancellation rules should be enforced server-side according to final product policy.
- Do not allow arbitrary jumps such as pending → completed.
- Persist actual status-change history if the timeline is expected to show real timestamps.
- Do not fabricate timeline timestamps on the backend just to satisfy the UI.
## 10. Booking API Requirements
- createBooking: validate provider, service, customer address, date and time.
- Verify the selected service belongs to the selected provider.
- Verify slot availability server-side.
- Prevent race-condition/double-booking cases.
- Derive customer identity from authenticated session.
- Generate booking ID and authoritative createdAt/updatedAt on the backend.
- getBookings: return only bookings visible to the authenticated customer/provider according to role.
- getBookingById: enforce ownership/authorization.
- cancelBooking: enforce current status and cancellation rules.
- updateBookingStatus: enforce role permissions and the state-transition table.
- Customer must not be able to impersonate another customer by changing customerId in the request.
- Provider must not be able to update another provider's booking.
## 11. Provider API Requirements
Provider objects consumed by the frontend currently include:
- id, userId, name/business information
- category/categoryName
- bio, rating, reviewCount, verified
- location with coordinates
- services with pricing
- portfolioImages
- currency, startingPrice
- availableToday and optional distanceKm
- contact fields where appropriate
- Backend should distinguish public provider data from private provider/user data.
## 12. Provider Search, Filters & Sorting
ProviderFilters currently support:
query, categoryId, minRating, maxPrice, verified, availableToday, maxDistanceKm, sortBy
ProviderSortOption currently supports:
recommended, nearest, highest_rated, lowest_price, most_booked
- Backend should support the agreed filters or the frontend API layer should translate them.
- For production, recommended ranking should be server/search-layer controlled rather than relying on mock ranking logic.
- startingPrice should have a documented meaning, e.g. lowest active service price.
- verified and availableToday must be based on authoritative backend data.
## 13. Location & Nearby Search
Frontend location search parameters:
{ "latitude": 26.8467, "longitude": 80.9462, "radiusKm": 10 }
- The coordinates above are mock/default data only; do not treat them as a production user's location.
- Backend should perform the actual geographic query.
- Nearby results should include distanceKm if the UI is expected to display distance.
- Validate coordinate ranges and reasonable radius limits.
- Client location is not an authorization mechanism.
- If browser geolocation permission is denied, the UI should still be able to operate where location is not required.
## 14. Provider Services
- Provider service fields include name, categoryId, description, price, currency, durationMinutes, durationLabel and active.
- Create/update/delete operations must be scoped to the authenticated provider.
- Validate price and duration server-side.
- Verify category existence.
- Do not trust providerId supplied by a client as proof of ownership.
- Current mock service generation uses frontend IDs; production IDs must be backend/database generated.
## 15. Availability & Time Slots
- Availability is provider-specific.
- Time-slot results must consider provider, date, schedule, vacation mode, existing bookings and applicable service duration/business rules.
- Updating availability must affect only the authenticated provider.
- The current mock getAvailableTimeSlots ignores date/provider; production implementation must not.
- The backend should be authoritative for whether a slot is actually bookable.
## 16. Earnings
- Current frontend expects EarningsSummary and EarningsDataPoint data.
- Backend should calculate earnings from authoritative booking/payment records.
- Agree what totalEarnings, pending, thisMonth and thisWeek mean before implementation.
- If payments are not implemented yet, document whether earnings are simulated, estimated or unavailable.
- Do not use mock earnings data in production.
## 17. Reviews & Ratings
- Review fields include providerId, customerId, customerName, customerImage, bookingId, rating, comment and createdAt.
- Validate rating range 1–5.
- Derive customer identity from authentication.
- Verify that the customer is eligible to review the booking.
- Verify booking/customer/provider relationships.
- Prevent duplicate reviews for the same booking if that is the agreed rule.
- Rating distribution and provider aggregate rating should be calculated from authoritative backend data.
- The frontend already invalidates reviews and ratingDistribution after successful review creation.
## 18. Notifications
Current notification types:
booking_request, booking_accepted, booking_rejected, booking_completed, new_review, booking_cancelled
- Notifications must be scoped to the authenticated user.
- Backend should create appropriate notifications from booking/review events.
- Unread count must be authoritative.
- Mark-read and mark-all-read operations must verify notification ownership.
- Realtime delivery can be added later using WebSocket/SSE/push without requiring a redesign of the UI contracts.
## 19. Customer & Provider Profiles
- Customer profile includes User fields plus saved addresses.
- Customer updates should ideally use a dedicated update DTO containing only editable fields.
- Provider profile updates must be scoped to the authenticated provider.
- Decide which phone/email/profile fields are public.
- Do not expose private contact information through public provider listing/detail endpoints unless intentionally required.
- The current mock getProviderProfile combines provider data with a fixed mock provider user; production must use the correct user/provider relationship.
## 20. Addresses
- Booking creation currently accepts addressId.
- Backend must verify that the address belongs to the authenticated customer.
- Address creation/update/delete APIs may be added if not already available in the backend contract.
- The final booking record should store the address snapshot required for historical accuracy if addresses can later change.
## 21. Contact Abstraction
Current frontend flow:
handleCallProvider(providerId) → contactProvider({ providerId, method: 'call' }) → phone → tel: link
Messaging currently only displays a 'coming soon' message and does not call a backend messaging system.
- Do not expose private phone numbers in public provider listings if privacy rules prohibit it.
- Use a controlled authenticated endpoint or approved public contact field for phone retrieval.
- Backend authorization/privacy rules determine who may retrieve contact information.
## 22. File Uploads — Future / Confirm Before Implementation
The current frontend has attachment/image fields in its data model, but a complete production upload flow is not established in this handoff.
- Agree storage provider and upload strategy first.
- Decide whether uploads are direct-to-storage using signed URLs or sent through the backend.
- Define allowed file types, size limits, authentication and ownership.
- Define whether returned URLs are public, signed, or authenticated.
- Potential upload areas include profile photos, portfolio images and booking attachments.
Do not implement a generic POST /uploads contract until the storage/security design is agreed.
## 23. Payments — Future
The current frontend displays estimated pricing but does not contain a complete payment integration. Payment provider, authorization/capture/refund behavior, webhook handling and earnings semantics must be defined separately before implementation.
## 24. React Query & Cache Invalidation
Cache invalidation is a frontend concern. The backend does not 'trigger' React Query invalidation. After a successful mutation response, the corresponding frontend hook invalidates its query keys.
| Mutation/domain | Frontend cache affected |
| --- | --- |
| Bookings | bookings, providerBookings, individual booking |
| Provider services | providerServices |
| Provider profile | providerProfile |
| Customer profile | customerProfile |
| Reviews | reviews, ratingDistribution |
| Notifications | notifications, unreadCount |
| Availability | availability |

Backend responsibility: return authoritative updated data and consistent success/error responses so these frontend mutations can invalidate/refetch correctly.
## 25. Current Frontend Fixes Before Integration
| Priority | File | Required action |
| --- | --- | --- |
| P0 | src/lib/api/providers.ts | Fix TypeScript narrowing for minRating, maxPrice and maxDistanceKm by assigning checked values to local constants before callbacks. |
| P0 | src/components/bookings/booking-status-badge.tsx | Remove unused cn import. |
| P0 | src/app/auth/page.tsx | Resolve unused locationData warning and finalize how location data is handled. |
| P1 | src/lib/api/client.ts | Ensure real HTTP mode handles non-2xx responses, network errors and the agreed auth mechanism. |
| P1 | src/lib/session.ts | Replace mock localStorage session in production with the agreed real auth/session flow. |
| P1 | src/lib/api/*.ts | Switch production paths from mock data to real endpoints while preserving hook/component contracts. |
| P2 | src/types/user.ts | Consider CustomerProfileUpdate and centralize MockSession if mock session remains temporarily. |
| P2 | src/lib/api/services.ts | Return NOT_FOUND for missing provider instead of silently returning an empty service list, if that matches the final contract. |
| P2 | next.config.ts | Verify all external image hosts used by next/image are configured. |

## 26. Known Mock Data Issues
- mockCustomer identity is inconsistent with several booking/review/notification records using user_customer_1.
- Provider prov_1 identity is inconsistent across mock files.
- Some mock provider emails do not match displayed names.
- prov_1 startingPrice currently does not match its lowest service price.
- Some reviews reference historical booking IDs not present in current mockBookings.
- Some reviews reference provider IDs not present in the current provider list.
- At least one notification has customer/booking details inconsistent with its referenced mock booking.
- Some mock dates are in the past and should be updated if current-date UI behavior depends on them.
These are mock-data cleanup items, not reasons to redesign the frontend.
## 27. Suggested Endpoint Map
These are suggested route shapes for discussion. The exact backend contract should be documented and agreed by both teams.
| Domain | Suggested operations |
| --- | --- |
| Auth | POST /auth/send-otp, POST /auth/verify-otp, GET /auth/me, POST /auth/logout |
| Providers | GET /providers, GET /providers/:id, GET /providers/nearby, GET /categories |
| Services | GET/POST /providers/me/services, PATCH/DELETE /providers/me/services/:id |
| Bookings | POST /bookings, GET /bookings, GET /bookings/:id, PATCH/POST /bookings/:id/status, POST /bookings/:id/cancel |
| Reviews | GET /providers/:id/reviews, GET /providers/:id/rating-distribution, POST /reviews |
| Notifications | GET /notifications, GET /notifications/unread-count, PATCH /notifications/:id/read, POST /notifications/read-all |
| Profiles | GET/PATCH /users/me, GET/PATCH /providers/me |
| Availability | GET/PATCH /providers/me/availability, GET /providers/:id/time-slots |
| Earnings | GET /providers/me/earnings |
| Contact | GET /providers/:id/contact or equivalent controlled contact operation |

## 28. Security Checklist
- Authenticate all protected endpoints.
- Authorize every customer/provider resource access.
- Never trust client-supplied userId/providerId for ownership.
- Enforce booking state transitions server-side.
- Prevent double booking with transactional/concurrency-safe logic.
- Validate prices, durations, dates, times, coordinates and IDs.
- Rate-limit OTP and abuse-prone endpoints.
- Protect notification ownership.
- Protect customer/provider contact information.
- Validate file uploads if/when implemented.
- Do not expose secrets in frontend environment variables.
- Use appropriate CORS/CSRF/cookie configuration for the chosen authentication strategy.
## 29. Integration Order
1. Agree and document authentication/session strategy.
1. Agree ApiResponse/error contract and date/time formats.
1. Agree core DTOs and endpoint names.
1. Implement apiRequest() with the agreed authentication and error handling.
1. Integrate provider search/detail and categories.
1. Integrate customer/provider profiles.
1. Integrate availability and time slots.
1. Integrate booking creation/list/detail/state transitions/cancellation.
1. Integrate provider services.
1. Integrate reviews and rating distribution.
1. Integrate notifications.
1. Integrate earnings.
1. Replace mock session/auth.
1. Run end-to-end customer and provider flows.
1. Remove or isolate remaining mock-only production dependencies.
## 30. Testing Checklist
- OTP send/verify and session persistence.
- Customer/provider role authorization.
- Provider search, filters and sorting.
- Nearby provider search with real coordinates.
- Provider detail and services.
- Saved address ownership.
- Available slots across dates/providers.
- Booking creation and validation.
- All valid booking status transitions.
- Invalid booking transitions rejected by backend.
- Customer cannot access another customer's booking.
- Provider cannot access another provider's booking.
- Cancellation rules.
- Provider availability update.
- Provider service CRUD ownership.
- Profile update validation.
- Review eligibility, rating validation and duplicate prevention.
- Rating summary refresh.
- Notification ownership and unread count.
- Earnings calculation.
- Contact privacy.
- Loading, error and empty states.
- External image configuration.
- Clean production build.
## 31. Vercel Build Requirement
Before pushing integration changes:
npm run build
- Current build failure identified during handoff: src/lib/api/providers.ts had TypeScript errors because minRating/maxPrice/maxDistanceKm were still accessed inside callbacks after an undefined check.
- Fix pattern: assign the checked value to a local constant and use that constant inside the filter callback.
- Example: const maxPrice = filters.maxPrice; then provider.startingPrice <= maxPrice.
- Unused-variable/import warnings should also be cleaned up, even when they do not fail the build.
- Recharts and ESLint deprecation warnings shown by Vercel are maintenance items, not the cause of the reported build failure.
## 32. Definition of Done
- Backend API contract is documented and agreed.
- Real authentication/session is working.
- Frontend API service functions call the backend in non-mock mode.
- No production flow depends on hardcoded prov_1 or user_customer_1 identities.
- Customer/provider ownership is enforced server-side.
- Booking state machine is enforced server-side.
- Availability and double-booking protection are server-authoritative.
- Reviews, ratings and notifications are server-authoritative.
- Production image hosts are configured.
- Mock mode can still be used for local/demo testing if desired.
- npm run build passes.
- Vercel deployment succeeds.
- Customer and provider end-to-end flows pass QA.
## 33. Important Final Notes for the Team
- This handoff is based on the current frontend implementation and reviewed contracts.
- Suggested endpoint names are not final backend requirements unless the team explicitly agrees to them.
- Do not force JWT specifically; agree on the actual authentication mechanism first.
- Do not expect NEXT_PUBLIC_USE_MOCK_API=false alone to switch the current mock service implementations; the service layer still needs real HTTP implementations.
- Do not make backend decisions based only on UI validation. Backend remains the source of truth for security and business rules.
- Keep the existing frontend architecture intact wherever possible. The goal is integration, not a frontend rewrite.
