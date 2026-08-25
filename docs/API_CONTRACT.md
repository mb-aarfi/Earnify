# Earnify API Contract

This document describes the future backend API endpoints. **These are not implemented** — they serve as a contract for backend developers.

## Base URL

```
{NEXT_PUBLIC_API_BASE_URL}/api
```

## Response Format

### Success

```json
{
  "success": true,
  "data": {},
  "message": "Success"
}
```

### Paginated

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request",
    "fieldErrors": {}
  }
}
```

---

## Providers

### GET /providers

List providers with optional filters.

**Query Parameters:**
- `query` (string) — Search term
- `categoryId` (string) — Filter by category
- `minRating` (number) — Minimum rating
- `maxPrice` (number) — Maximum starting price
- `verified` (boolean) — Verified only
- `availableToday` (boolean) — Available today
- `sortBy` (string) — `recommended|nearest|highest_rated|lowest_price|most_booked`
- `page`, `limit` — Pagination

**Response:** `PaginatedResponse<Provider>`

### GET /providers/nearby

Find providers near a location.

**Query Parameters:**
- `latitude` (number, required)
- `longitude` (number, required)
- `radiusKm` (number, default: 10)
- Plus all filters from GET /providers

**Response:** `ApiResponse<Provider[]>`

### GET /providers/:id

Get provider by ID.

**Response:** `ApiResponse<Provider>`

### GET /providers/:providerId/reviews

Get reviews for a provider.

**Response:** `ApiResponse<Review[]>`

---

## Bookings (Customer)

### POST /bookings

Create a booking.

**Request Body:**
```json
{
  "providerId": "prov_1",
  "serviceId": "svc_1_1",
  "date": "2026-08-28",
  "time": "17:30",
  "addressId": "addr_1",
  "description": "Need help with...",
  "attachments": []
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "booking_123",
    "status": "pending"
  }
}
```

### GET /bookings

List customer bookings.

**Query Parameters:**
- `status` (BookingStatus) — Filter by status

**Response:** `ApiResponse<Booking[]>`

### GET /bookings/:id

Get booking details.

**Response:** `ApiResponse<Booking>`

### POST /bookings/:id/cancel

Cancel a booking.

**Response:** `ApiResponse<Booking>`

### POST /bookings/:bookingId/review

Submit a review for a completed booking.

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Great service!"
}
```

**Response:** `ApiResponse<Review>`

---

## Bookings (Provider)

### GET /provider/bookings

List provider bookings.

**Query Parameters:**
- `status` (BookingStatus)

**Response:** `ApiResponse<Booking[]>`

### PATCH /provider/bookings/:id/status

Update booking status.

**Request Body:**
```json
{
  "status": "accepted"
}
```

**Valid transitions:**
- `pending` → `accepted` | `rejected`
- `accepted` → `confirmed`
- `confirmed` → `in_progress`
- `in_progress` → `completed`
- Any active → `cancelled`

**Response:** `ApiResponse<Booking>`

---

## Provider Services

### GET /provider/services

**Response:** `ApiResponse<Service[]>`

### POST /provider/services

**Request Body:**
```json
{
  "name": "Switch Repair",
  "categoryId": "cat_electrician",
  "description": "...",
  "price": 199,
  "durationMinutes": 45,
  "durationLabel": "45 mins",
  "active": true
}
```

### PATCH /provider/services/:id

Update service fields.

### DELETE /provider/services/:id

Delete a service.

---

## Provider Profile

### GET /provider/profile

**Response:** `ApiResponse<Provider>`

### PATCH /provider/profile

**Request Body:** Partial provider profile fields.

---

## Provider Availability

### GET /provider/availability

**Response:** `ApiResponse<ProviderAvailability>`

### PUT /provider/availability

**Request Body:** Full availability schedule.

---

## Provider Earnings

### GET /provider/earnings

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalEarnings": 87450,
      "thisMonth": 12400,
      "thisWeek": 3200,
      "pending": 1498,
      "completedJobs": 156,
      "currency": "INR"
    },
    "chart": [
      { "month": "Aug", "earnings": 12400 }
    ]
  }
}
```

---

## Notifications

### GET /notifications

**Response:** `ApiResponse<Notification[]>`

### PATCH /notifications/:id/read

Mark notification as read.

### POST /notifications/read-all

Mark all notifications as read.

---

## Authentication (Future)

Authentication is not implemented in the frontend mock. Future requirements:

- JWT-based authentication
- Role-based access (`customer` | `provider`)
- Protected routes with middleware
- OTP verification for phone numbers

---

## Location

Nearby provider search expects:

```json
{
  "latitude": 26.8467,
  "longitude": 80.9462,
  "radiusKm": 10
}
```

Backend should perform geographic distance calculations.
