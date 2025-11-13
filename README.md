# Broker Pro BlackGlass v3 — Full scaffold

Includes:
- Next.js app with Prisma (SQLite by default)
- CRUD APIs: /api/users, /api/clients, /api/properties, /api/sales
- Auth: /api/auth/login returns JWT (use seeded users: admin@broker.local / password123)
- Commission auto-calculation on sale create
- Export CSV: /api/export/sales
- Dockerfile + docker-compose

## Quick local run (dev)
1. Copy .env.example -> .env or edit .env (DATABASE_URL already present)
2. Install deps:
   npm install
3. Generate prisma client & migrate:
   npx prisma generate
   npx prisma migrate dev --name init
4. Seed:
   npm run seed
5. Run:
   npm run dev
6. Open http://localhost:3000 and http://localhost:3000/dashboard

## Docker
Build & run with docker-compose:
  docker compose up --build

## Notes
- JWT secret in .env must be changed for production.
- Commission policy is implemented in app/api/sales/route.ts — adapt to exact business rules.
