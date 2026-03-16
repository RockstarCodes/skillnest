# LMS Backend (Express + TypeScript + MySQL)

## Quick start (local)

1. Create a `.env` from `.env.example`
2. Install deps and run dev server:

```bash
npm install
npm run dev
```

API will be on `http://localhost:4000` (or `PORT`).

## Implemented endpoints (so far)

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh` (refresh token in HTTP-only cookie)
- `POST /api/auth/logout`

