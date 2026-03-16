import { isProd } from "./env";

export const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
export const REFRESH_TOKEN_TTL_SECONDS = 30 * 24 * 60 * 60;

export const REFRESH_COOKIE_NAME = "lms_refresh";

export function getRefreshCookieOptions(): {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax" | "strict" | "none";
  path: string;
  maxAge: number;
  domain?: string;
} {
  // Note: "none" requires secure=true; for same-site setups, "lax" is fine.
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/api/auth/refresh",
    maxAge: REFRESH_TOKEN_TTL_SECONDS * 1000
  };
}

