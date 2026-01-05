# Business Dashboard (Vite + React + TypeScript)

Admin-style dashboard built with **React**, **Redux Toolkit**, **RTK Query**, **React Router**, **SCSS**, and a mock API.
The project simulates a real-world internal SaaS tool, focusing on **state-heavy UIs**, **role-based permissions**, and **scalable frontend architecture** using a strict **Feature-Sliced Design (FSD)** structure.

## Demo
<a href="https://businessdashbo4rd.netlify.app" target="_blank">https://businessdashbo4rd.netlify.app</a>

**Mock accounts**
- **Admin:** `admin@test.com`
- **Staff:** `staff@test.com`

> The live demo runs without a real backend. API calls are intercepted using **MSW (Mock Service Worker)**.

---

## Key Features
- Role-based UI and routing (admin / staff)
- Customers, products and orders management
- Advanced tables:
  - search
  - filtering
  - sorting
  - pagination
- CRUD flows with confirmation modals
- Order status transitions (pending → paid / cancelled)
- Loading, empty and error states
- Success / error toasts for async operations
- Internationalization (English default with language toggle)

---

## Killer Feature: Role-based permissions (UI + routing)
This project implements **role-based access control beyond route protection**, closely resembling real SaaS admin dashboards:

- **Admin**
  - Full access to Customers, Products and Orders
  - Can create, update and delete entities
  - Can change order statuses

- **Staff**
  - Read access to Customers and Orders
  - Restricted access to Products (`/products` is blocked)
  - Destructive actions are hidden or disabled at UI level

Permissions are enforced through **centralized guards**, ensuring that both **navigation and UI actions** adapt to the current user role.

---

## Tech Stack
- **Frontend:** React, TypeScript, JavaScript
- **State & Data:** Redux Toolkit, RTK Query
- **Routing:** React Router
- **Styling:** SCSS (no external UI libraries)
- **Mocking:** json-server (local), MSW (live demo)
- **Testing:** Jest, React Testing Library, MSW
- **Tooling:** Vite, ESLint

---

## Architecture (Strict Feature-Sliced Design)
The project follows a strict **FSD** structure to keep the codebase scalable and maintainable:

- `app/` — application shell (router, providers, store wiring)
- `pages/` — route-level screens composed from widgets and features
- `widgets/` — large UI blocks (tables, layout shell)
- `features/` — reusable UI + interaction logic (auth controls, modals)
- `entities/` — domain models, RTK Query endpoints and types
- `shared/` — UI primitives, utilities, router guards, i18n and test helpers

---

## Routes
- `/login`
- `/customers`
- `/products` (admin only)
- `/orders`
- `/` → redirects to `/customers`

---

## Quick Start

### Requirements
- Node.js 18+
- npm

### Local development (stateful mock backend)
```bash
npm install
npm run mock   # starts json-server on port 4000
npm run dev    # starts the app on port 5173
