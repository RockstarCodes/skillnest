import type { Request, Response } from "express";
import { REFRESH_COOKIE_NAME, getRefreshCookieOptions } from "../../config/security";
import { env } from "../../config/env";
import { AuthService } from "./auth.service";
import { LoginSchema, RegisterSchema } from "./auth.validator";

const service = new AuthService();

export async function register(req: Request, res: Response) {
  const parsed = RegisterSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "VALIDATION_ERROR", details: parsed.error.flatten() });

  try {
    const user = await service.register(parsed.data);
    return res.status(201).json({ user });
  } catch (e: any) {
    if (e?.code === "EMAIL_IN_USE") return res.status(409).json({ error: "EMAIL_IN_USE" });
    throw e;
  }
}

export async function login(req: Request, res: Response) {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "VALIDATION_ERROR", details: parsed.error.flatten() });

  try {
    const { user, accessToken, refreshToken } = await service.login(parsed.data);
    const cookieOpts = getRefreshCookieOptions();
    const domain = env.COOKIE_DOMAIN?.trim() ? env.COOKIE_DOMAIN.trim() : undefined;
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, { ...cookieOpts, ...(domain ? { domain } : {}) });
    return res.status(200).json({ user, accessToken });
  } catch (e: any) {
    if (e?.code === "INVALID_CREDENTIALS") return res.status(401).json({ error: "INVALID_CREDENTIALS" });
    throw e;
  }
}

export async function refresh(req: Request, res: Response) {
  const token = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;
  if (!token) return res.status(401).json({ error: "NO_REFRESH_TOKEN" });

  try {
    const { accessToken, user } = await service.refresh({ refreshToken: token });
    return res.status(200).json({ accessToken, user });
  } catch (e: any) {
    return res.status(401).json({ error: e?.code ?? "INVALID_REFRESH" });
  }
}

export async function logout(req: Request, res: Response) {
  const token = (req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined) ?? null;
  await service.logout({ refreshToken: token });

  const cookieOpts = getRefreshCookieOptions();
  const domain = env.COOKIE_DOMAIN?.trim() ? env.COOKIE_DOMAIN.trim() : undefined;
  res.clearCookie(REFRESH_COOKIE_NAME, { ...cookieOpts, ...(domain ? { domain } : {}) });
  return res.status(204).send();
}

