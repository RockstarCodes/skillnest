# SkillNest deployment (Vercel + Render + Aiven MySQL)

## Repo structure

```
root/
  backend/
  frontend/
```

Only the `frontend/` directory is deployed to Vercel.

## 1) Push to GitHub

- Create a GitHub repo named `skillnest`
- Push this monorepo to GitHub

## 2) Deploy backend to Render

- Create a new **Web Service** from the repo (or a separate Render service pointing to `/backend`)
- **Root directory**: `backend`
- **Build command**: `npm install && npm run build`
- **Start command**: `npm run start`

### Render environment variables (backend)

- `NODE_ENV=production`
- `PORT=10000` (Render sets/uses `PORT`; keep your app reading `PORT`)
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `CORS_ORIGIN=https://skillnest.vercel.app`
  - Add preview domains as needed (comma-separated)
- `COOKIE_DOMAIN=skillnest.vercel.app` (or your custom domain)

## 3) Deploy frontend to Vercel

- Log in to Vercel
- Import the GitHub repository
- **Root Directory**: `frontend`
- **Framework preset**: Next.js

### Vercel environment variables (frontend)

- `NEXT_PUBLIC_API_BASE_URL=https://<your-render-backend-url>/api`

## 4) Production build test (local)

Frontend:

```bash
cd frontend
npm install
npm run build
```

Backend:

```bash
cd backend
npm install
npm run build
```

## 5) Post-deploy checks

Verify these routes:

- `/`
- `/subjects`
- `/auth/login`
- `/auth/register`
- `/subjects/[subjectId]`
- `/subjects/[subjectId]/video/[videoId]`

Verify:

- auth works
- YouTube videos load
- progress tracking works
- sidebar navigation updates

