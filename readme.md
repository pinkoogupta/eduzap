# EDUZAP — Project Flow

This repository contains three main parts:
- Backend API (Express + MongoDB + Redis + Socket.IO)
- Admin frontend (React + Vite)
- Mobile client (Expo React Native)

---

## High-level flow

1. Client (web or mobile) -> sends HTTP request or uploads image.
2. Backend route receives request, validates, processes file (via multer), uploads to Cloudinary, stores record in MongoDB, clears Redis cache, and emits real-time events via Socket.IO.
3. Admin frontend listens to Socket.IO events and updates UI in real-time.
4. Redis is used to cache list/search/sorted responses to reduce DB load.

---

## Backend (API)

Primary entry:
- [backend/server.js](backend/server.js)

Database:
- Connection helper: [`connectDB`](backend/src/db/db.js) — [backend/src/db/db.js](backend/src/db/db.js)
- Mongo model: [`Request`](backend/src/models/request.model.js) — [backend/src/models/request.model.js](backend/src/models/request.model.js)

File upload & media:
- Multer middleware: [backend/src/middlewares/multer.middleware.js](backend/src/middlewares/multer.middleware.js)
- Cloudinary helper: [`uploadToCloudinary`](backend/src/utils/cloudinary.js) — [backend/src/utils/cloudinary.js](backend/src/utils/cloudinary.js)

Realtime:
- Socket initialization: [`initSocket`](backend/src/utils/socket.js) — [backend/src/utils/socket.js](backend/src/utils/socket.js)
- Socket getter: [`getIO`](backend/src/utils/socket.js) — [backend/src/utils/socket.js](backend/src/utils/socket.js)

Caching:
- Redis client: [`redisClient`](backend/src/utils/redis.util.js) — [backend/src/utils/redis.util.js](backend/src/utils/redis.util.js)

Business module (requests):
- Routes: [backend/src/businesses/product/routes/request.route.js](backend/src/businesses/product/routes/request.route.js)
- Router mount: [backend/src/businesses/product/request.js](backend/src/businesses/product/request.js)
- Controller (core logic): [`createRequest`, `getRequests`, `getSortedRequests`, `searchRequests`, `deleteRequest`] — [backend/src/businesses/product/controllers/request.controller.js](backend/src/businesses/product/controllers/request.controller.js)
- Module aggregator: [backend/src/businesses/businesses.js](backend/src/businesses/businesses.js)

Run (backend):
- script: `npm run server` in [backend/package.json](backend/package.json)

---

## Admin frontend (web)

Primary:
- [frontendAdmin/src/pages/Home.jsx](frontendAdmin/src/pages/Home.jsx)
- Vite config: [frontendAdmin/vite.config.js](frontendAdmin/vite.config.js)
- Env: [frontendAdmin/.env](frontendAdmin/.env)
- Scripts: `npm run dev` in [frontendAdmin/package.json](frontendAdmin/package.json)

API client:
- Service functions: [`fetchRequests`, `fetchSortedRequests`, `searchRequests`, `deleteRequest`] — [frontendAdmin/src/services/api.js](frontendAdmin/src/services/api.js)

UI components:
- Search: [frontendAdmin/src/components/SearchBar.jsx](frontendAdmin/src/components/SearchBar.jsx)
- Sort: [frontendAdmin/src/components/SortButton.jsx](frontendAdmin/src/components/SortButton.jsx)
- Pagination: [frontendAdmin/src/components/Pagination.jsx](frontendAdmin/src/components/Pagination.jsx)
- Request list: [frontendAdmin/src/components/RequestList.jsx](frontendAdmin/src/components/RequestList.jsx)
- Request card: [frontendAdmin/src/components/RequestCard.jsx](frontendAdmin/src/components/RequestCard.jsx)
- Stats: [frontendAdmin/src/components/RequestStats.jsx](frontendAdmin/src/components/RequestStats.jsx)

Realtime client:
- Socket client initialized inside: [frontendAdmin/src/pages/Home.jsx](frontendAdmin/src/pages/Home.jsx) (uses `socket.io-client`)

---

## Mobile client (Expo)

Primary screen:
- Request form: [MyApp/screens/RequestFormScreen.tsx](MyApp/screens/RequestFormScreen.tsx)
- App entry: [MyApp/app/index.tsx](MyApp/app/index.tsx)
- Expo config & scripts: [MyApp/package.json](MyApp/package.json), [MyApp/app.json](MyApp/app.json)

Notes:
- For physical device testing, replace `localhost` with your machine IP in [MyApp/screens/RequestFormScreen.tsx](MyApp/screens/RequestFormScreen.tsx).

---

## Important helpers & utilities (quick links)
- Redis util: [backend/src/utils/redis.util.js](backend/src/utils/redis.util.js)
- Socket utils: [backend/src/utils/socket.js](backend/src/utils/socket.js)
- Cloudinary helper: [backend/src/utils/cloudinary.js](backend/src/utils/cloudinary.js)
- Multer middleware: [backend/src/middlewares/multer.middleware.js](backend/src/middlewares/multer.middleware.js)

---

## How data flows for a "Create Request"
1. Client sends POST -> /api/v1/requests/create (see [backend/src/businesses/product/routes/request.route.js](backend/src/businesses/product/routes/request.route.js))
2. Multer stores temp file ([backend/src/middlewares/multer.middleware.js](backend/src/middlewares/multer.middleware.js))
3. Controller [`createRequest`](backend/src/businesses/product/controllers/request.controller.js) validates input, uploads image via [`uploadToCloudinary`](backend/src/utils/cloudinary.js), saves [`Request` model](backend/src/models/request.model.js) to MongoDB, clears caches via [`redisClient`](backend/src/utils/redis.util.js), emits `request:created` via [`getIO`](backend/src/utils/socket.js).
4. Admin UI listens and prepends item in [frontendAdmin/src/pages/Home.jsx](frontendAdmin/src/pages/Home.jsx).

---

## Useful commands
- Backend: cd backend && npm run server — uses [backend/package.json](backend/package.json)
- Frontend admin: cd frontendAdmin && npm run dev — uses [frontendAdmin/package.json](frontendAdmin/package.json)
- Mobile: cd MyApp && npm start (expo) — uses [MyApp/package.json](MyApp/package.json)

---

## Appendix — Short answers (Q1–Q4)

Q1. How to handle 100,000 requests efficiently with a database?

Use connection pooling to reuse DB connections.

Apply indexes on frequently queried fields.

Use read replicas & load balancing to distribute traffic.

Implement caching (Redis/Memcached) for hot data.

Use batching & async processing for heavy operations.

Q2. Best data structure choice:

Fast insertion & search → Hash Table (HashMap)

Efficient sorted retrieval → Balanced BST (e.g., Red-Black Tree) or B-Tree

Q3. Real-time updates with Socket.IO:

Client connects via WebSocket.

Server emits events (socket.emit) on data change.

Clients listen (socket.on) and update UI instantly.

Can be combined with rooms/namespaces for scaling.

Q4. Cache algorithm for frequently requested data:

LRU (Least Recently Used) → Most common, removes old unused data first.

Good balance of speed + memory efficiency.

Works well for APIs where popular