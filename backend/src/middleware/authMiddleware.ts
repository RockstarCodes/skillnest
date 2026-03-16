import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";

export type AuthenticatedUser = {
  id: number;
  email: string;
  name: string;
};

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.header("authorization");
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "UNAUTHORIZED" });
  }

  const token = header.slice("Bearer ".length);
  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: Number(payload.sub),
      email: payload.email,
      name: payload.name
    };
    return next();
  } catch {
    return res.status(401).json({ error: "UNAUTHORIZED" });
  }
}

