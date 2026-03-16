# Quick deploy guide (SkillNest)

## 1) Push repo to GitHub

- Create a GitHub repository (e.g. `skillnest`)
- Push this monorepo (contains `backend/` and `frontend/`)

## 2) Deploy database (Aiven MySQL)

- Create an Aiven MySQL service
- Import `backend/sql/schema.sql` to create tables
- Copy DB connection values for Render env vars

## 3) Deploy backend to Render

- Create a new **Web Service**
- **Root directory**: `backend`
- **Build command**: `npm install && npm run build`
- **Start command**: `node dist/server.js`

### Render env vars (backend)

- `PORT` (Render sets this)
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`
- `CORS_ORIGIN=https://<your-vercel-domain>.vercel.app`
- `COOKIE_DOMAIN=<your-vercel-domain>.vercel.app`

### Seed after deploy

Option A (manual once):

```bash
cd backend
npm run seed
```

Option B (automated on Render):

- Set **Build Command** to: `bash deploy.sh`
- Keep **Start Command** as: `node dist/server.js`

## 4) Deploy frontend to Vercel

- Import the GitHub repo into Vercel
- **Root Directory**: `frontend`
- **Framework preset**: Next.js

### Vercel env vars (frontend)

- `NEXT_PUBLIC_API_BASE_URL=https://<your-render-backend-url>/api`

## 5) Verify

Open:

- `/`
- `/subjects`
- `/auth/login`
- `/auth/register`

Confirm the seeded subjects (Java/Python/ML) appear.

