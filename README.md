# Campus Code Hub

Role-based coding platform with:
- React + Vite frontend (existing UI theme reused)
- Express + MongoDB backend
- Login-only authentication for `user` and `admin`
- Admin dashboard for user management (search/add/edit/delete)

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind/shadcn
- Backend: Node.js, Express
- Database: MongoDB (Mongoose)
- Auth: JWT + bcrypt password hashing

## Project Structure

```text
src/
  components/
    Layout.tsx
    ProtectedRoute.tsx
  lib/
    api.ts
    auth.ts
  pages/
    Login.tsx
    AdminDashboard.tsx
    ...existing user pages
  types/
    auth.ts

server/
  config/
    db.js
  controllers/
    authController.js
    userController.js
  middleware/
    authMiddleware.js
  models/
    User.js
  routes/
    authRoutes.js
    userRoutes.js
  seedAdmin.js
  server.js
```

## API Endpoints

- `POST /api/login`
- `GET /api/users` (admin only)
- `POST /api/users` (admin only)
- `PUT /api/users/:id` (admin only)
- `DELETE /api/users/:id` (admin only)

## Setup and Run

1) Install dependencies
```sh
npm install
```

2) Configure environment
- Copy `.env.example` to `.env` (or update existing `.env`)
- Ensure these values are present:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `PORT`
  - `CLIENT_URL`
  - `VITE_API_BASE_URL`

3) Start MongoDB locally (default)
```sh
mongod
```

4) Start backend server
```sh
npm run server
```

5) Start frontend (new terminal)
```sh
npm run dev
```

## Default Login Credentials

- User login ID: `user@123`
- User password: `user123`
- Admin login ID: `admin@123`
- Admin password: `admin123`

These accounts are auto-seeded when backend starts.
