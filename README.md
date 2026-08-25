# Earnify

**Find trusted professionals. Get things done.**

Earnify is a production-level frontend service marketplace that connects customers with local service providers such as plumbers, electricians, mechanics, tutors, and more.

## What is Earnify?

Earnify allows:

- **Customers** to search, compare, book, and review local service professionals
- **Service Providers** to manage bookings, services, availability, and earnings

This is a **frontend-only** application using realistic mock data. No backend server is included.

## Technology

- Next.js 15 (App Router)
- React 19
- TypeScript (strict mode)
- Tailwind CSS 4
- shadcn/ui components
- TanStack Query (React Query)
- React Hook Form + Zod
- Zustand (search/filter state)
- Recharts (earnings chart)
- Lucide React icons

## Installation

```bash
npm install
```

Copy environment variables:

```bash
cp .env.example .env.local
```

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Build

```bash
npm run build
npm start
```

## Mock API

The application runs entirely on the frontend with mock data when:

```env
NEXT_PUBLIC_USE_MOCK_API=true
```

Mock data includes 15 providers, 10+ bookings, 20 reviews, notifications, and earnings data with realistic Indian locations and INR pricing.

### Architecture

```
UI → Components → Hooks → API Service Layer → Mock API
```

API service functions live in `src/lib/api/`. Mock data lives in `src/mocks/`. Components never access mock arrays directly.

## Getting Started

1. Visit the landing page at `/`
2. Click **Get Started** → `/auth`
3. Choose **Customer** or **Service Provider**
4. Explore the full application flow with mock data

### Customer Flow

Landing → Auth → Customer Home → Search → Providers → Profile → Book → Bookings → Profile

### Provider Flow

Landing → Auth → Dashboard → Bookings → Accept/Reject → Services → Availability → Earnings → Profile

## Future Backend Integration

When the backend is ready:

1. Set `NEXT_PUBLIC_USE_MOCK_API=false`
2. Set `NEXT_PUBLIC_API_BASE_URL` to your API server
3. Replace mock implementations in `src/lib/api/` with real `fetch` calls using `apiRequest()` from `src/lib/api/client.ts`

See documentation:

- `docs/API_CONTRACT.md` — Future API endpoints
- `docs/BACKEND_HANDOFF.md` — Architecture handoff guide

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # Reusable UI components
├── hooks/            # React Query hooks
├── lib/api/          # API service layer
├── mocks/            # Mock data
├── stores/           # Zustand stores
└── types/            # TypeScript interfaces
```

## License

Private — All rights reserved.
