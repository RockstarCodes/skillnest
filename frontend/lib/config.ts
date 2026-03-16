export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  // Next.js will inline NEXT_PUBLIC_* at build time. If it's missing, fail fast in dev/build.
  throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
}

