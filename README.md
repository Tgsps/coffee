# Coffee Commerce Platform

Modern full-stack coffee experience that pairs a premium, marketing-focused landing page with a complete e-commerce workflow. The project ships with a React 18 + Tailwind CSS frontend, a Node/Express API (with MongoDB or in-memory storage), authentication, order management, and optional Netlify serverless mocks for demos.

## Feature Highlights
- **Premium storytelling homepage** - Framer Motion powered hero, tasting notes grid, roasting timeline, and premium navigation/footer combo inspired by `PREMIUM_DESIGN_GUIDE.md`.
- **End-to-end shopping** - product grid with filters, product detail, cart persistence, checkout, order history, and toast-based UX feedback using Context API for auth/cart state.
- **Role-aware access** - JWT authentication, profile management, protected customer routes, and dedicated admin routes for catalog, orders, users, and store settings.
- **Flexible data layer** - connect to MongoDB for persistence or run entirely in-memory during quick demos; database seeding plus a guaranteed admin bootstrap (`tamimghassan@gmail.com` / `1234567890`).
- **Deployment ready** - Netlify build config for the SPA, Netlify Functions mock API (`netlify/functions/api.js`), and scripts for concurrent local development.

## Tech Stack
**Frontend**: React 18, React Router 6, Context API, Tailwind CSS, Framer Motion, Axios, React Toastify, CRA toolchain  
**Backend**: Node.js, Express, JWT, bcryptjs, MongoDB + Mongoose (optional), Multer, Express Validator, Stripe SDK  
**Tooling**: Concurrently, dotenv, Netlify CLI (optional for mock API), npm

## Repository Layout
```
coffee/
|-- backend/                 # Express API, database abstraction, routes
|-- frontend/                # React application (premium + standard layouts)
|-- netlify/
|   \-- functions/api.js     # Mock API for serverless demos
|-- netlify.toml             # Netlify build rules + headers
|-- PREMIUM_DESIGN_GUIDE.md  # Detailed visual/UX guidelines
|-- package.json             # Root scripts to run both services
\-- README.md
```

## Getting Started

### 1. Install dependencies
```bash
# from repo root
cd coffee
npm run install-all   # installs root, backend, and frontend deps
```
You can also install individually inside `backend/` and `frontend/` if preferred.

### 2. Configure environment variables
Create a `.env` file in `backend/` (sample included):
```env
MONGODB_URI=mongodb://localhost:27017/coffee-shop   # leave empty to use in-memory storage
JWT_SECRET=replace-me
PORT=5000
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```
For the frontend, create `frontend/.env` when pointing to a non-default API origin:
```env
REACT_APP_API_URL=http://localhost:5000
```

### 3. Run locally
```bash
# From repo root
npm run dev      # concurrently runs backend on :5000 and frontend on :3000
```
Or launch each service independently via `npm run server` / `npm run client`.

#### Default access
- Admin user auto-seeded on backend boot: `tamimghassan@gmail.com / 1234567890`.
- Products/orders/users are pre-populated through `backend/database.js::seedData()` even without MongoDB.

### 4. Optional mock API (no backend required)
Need a quick UI preview? Use the bundled Netlify Function mock:
```bash
cd coffee
netlify dev         # serves frontend build + /.netlify/functions/api proxy
```
The handler responds to `/api/products`, `/api/auth/register`, and `/api/auth/login` with in-memory data so you can validate flows without spinning up Express.

## Backend Notes
- **Routes**: `/api/auth`, `/api/products`, `/api/orders`, `/api/admin` (CRUD for catalog, orders, and users).
- **Storage strategy**: `backend/database.js` seamlessly handles MongoDB models when `MONGODB_URI` is set; otherwise it falls back to an in-memory `memoryStore` while keeping identical method signatures.
- **Seeding**: `db.seedData()` and `db.ensureAdminUser()` run on startup. You can force seeding via `npm run seed:products` or bootstrap collections with `npm run setup:db` when MongoDB is available.
- **Payments**: Stripe keys are wired for future checkout integration; replace the placeholders before going live.

## Frontend Notes
- Two layout shells: `PremiumLayout` (landing page) and `StandardLayout` (catalog + account). Routing is defined in `frontend/src/App.js`.
- Context providers in `frontend/src/context` manage auth tokens, persisted cart, and guard protected routes via `ProtectedRoute` and `AdminRoute` components.
- Styles are driven by Tailwind (`frontend/tailwind.config.js`) with custom palettes that mirror the premium design guide; any marketing adjustments happen here.
- API access is centralized in `frontend/src/api/axios.js`, pulling the base URL from `REACT_APP_API_URL` for seamless environment switching.

## Deployment
- **Frontend**: `netlify.toml` builds the CRA app (`npm ci && npm run build`) and enforces immutable caching headers for static assets. You can deploy elsewhere (Vercel/S3) by reusing the build output from `frontend/build/`.
- **Backend**: Host the Express API on any Node-friendly platform (Render, Railway, VPS). Ensure environment variables are set and MongoDB is reachable (Atlas/local). If you only need read-only demos, the in-memory mode works without any external service.

## Contributing / Next Steps
1. Fork & create a feature branch.
2. Run lint/tests relevant to your change (frontend `npm test`, backend integration with Postman/Thunder Client).
3. Submit a PR describing the feature set (UI change, route addition, etc.).

Ideas queued up in `PREMIUM_DESIGN_GUIDE.md` include improved imagery, lazy-loaded animations, skeleton loaders, SEO/analytics, and A/B testing hooks, so feel free to pick one up!
