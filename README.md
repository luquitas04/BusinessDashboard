# Business Dashboard (Vite + React + TypeScript)

Admin-style dashboard built with React, Redux Toolkit, RTK Query, React Router, SCSS, and json-server mock API. The UI follows a strict Feature-Sliced Design (FSD) structure and includes i18n (English default with toggle), role-based routing, CRUD for customers/products, and order status management.

## Demo
Project demo: <a href="https://businessdashbo4rd.netlify.app/login" target="_blank">businessdashbo4rd.netlify.app</a>

## Quick Start
- Requirements: Node 18+ and npm
- Install: `npm install`
- Start mock API (port 4000): `npm run mock`
- Start app (port 5173): `npm run dev`
  - Run `mock` and `dev` in separate terminals.
- Demo deploys: set env `VITE_API_MODE=mock` to enable MSW runtime mocking.
- Lint: `npm run lint`
- Build: `npm run build`
- Tests (Jest + RTL + MSW):
  - `npm test`
  - `npm run test:watch`
  - CI mode: `npm run test:ci`

## Mock Accounts (json-server)
- Admin: `admin@test.com`
- Staff: `staff@test.com`
These emails authenticate via the mock `/users?email=` endpoint. Admin can access all routes; Staff cannot open `/products`.

## Architecture (Strict FSD)
- `app/` — app shell: router, providers, store wiring.
- `pages/` — route-level screens composed from widgets/features only.
- `widgets/` — large UI blocks (tables, layout shell).
- `features/` — reusable UI + interaction logic (auth controls, modals).
- `entities/` — domain models + RTK Query endpoints/types (unchanged).
- `shared/` — UI primitives, styles, lib utilities, router guards, tests, i18n.

## Functionality
- Auth: email-only mock login, localStorage persistence, role-aware nav.
- Layout: `DashboardLayout` with `Sidebar` + `Topbar` (logout + language toggle).
- Protected routes:
  - `/login`
  - `/customers`
  - `/products` (admin only)
  - `/orders`
  - `/` redirects to `/customers`
- Customers: search, status filter, sort, pagination, create/edit/delete modals, loading/empty/error states.
- Products: CRUD with modals, status including `archived`.
- Orders: list with status transitions (pending → paid/cancelled), per-row loading/error handling, create order modal.
- Toasters: success/error feedback.
- i18n: English by default; toggle to Spanish from the Topbar.

## Testing Stack
- Jest with `ts-jest` + `jest-environment-jsdom`.
- React Testing Library + jest-dom + user-event.
- MSW (node server) for mocking API calls used by RTK Query.
- Helpers live in `src/shared/test/` (`setupTests.ts`, `msw/handlers.ts`, `renderWithProviders.tsx`).

## Project Structure (high level)
```
mock/db.json              # json-server data (users, customers, products, orders)
src/
  app/                    # router, providers, store
  pages/                  # LoginPage, CustomersPage, ProductsPage, OrdersPage
  widgets/                # Sidebar, Topbar, CustomersTable, ProductsTable, OrdersTable
  features/               # Auth UI/logic, forms, modals
  entities/               # RTK Query endpoints and types
  shared/                 # ui primitives, lib (router guards, i18n, debounce), test utilities
```

## Notes
- The mock API is stateful while the server runs; restart `npm run mock` to reset data to `mock/db.json`.
- Base API URL defaults to `http://localhost:4000` when running on localhost (dev/tests) and falls back to the current origin for production builds (see `src/shared/api/baseApi.ts`).
- Styled with SCSS (no external UI kits) to keep a lightweight, professional admin look.

## Demo & Mock API

This project uses a mock API for demonstration purposes.

- **Local development**: json-server (`npm run mock`) provides a stateful mock backend.
- **Live demo**: API requests are intercepted using **MSW (Mock Service Worker)** to ensure a stable, backend-free demo.

> Note: In the live demo, data mutations are simulated and may reset on reload.  
> The API layer is implemented with RTK Query and is ready to connect to a real backend.
