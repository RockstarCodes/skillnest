import crypto from "crypto";
import type { ResultSetHeader } from "mysql2";
import { dbPool } from "../../config/db";
import { REFRESH_TOKEN_TTL_SECONDS } from "../../config/security";
import { hashPassword, verifyPassword } from "../../utils/password";
import { signAccessToken, signRefreshToken, type AccessTokenPayload } from "../../utils/jwt";

function sha256Base64(input: string): string {
  return crypto.createHash("sha256").update(input).digest("base64");
}

export class AuthService {
  async register(input: { email: string; password: string; name: string }) {
    const password_hash = await hashPassword(input.password);

    const conn = await dbPool.getConnection();
    try {
      await conn.beginTransaction();

      const [existing] = await conn.query("SELECT id FROM users WHERE email = ? LIMIT 1", [input.email]);
      if (Array.isArray(existing) && existing.length > 0) {
        const err = new Error("EMAIL_IN_USE");
        // @ts-expect-error: tagged error
        err.code = "EMAIL_IN_USE";
        throw err;
      }

      const [result] = await conn.query<ResultSetHeader>(
        "INSERT INTO users (email, password_hash, name, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
        [
        input.email,
        password_hash,
        input.name
        ]
      );

      await conn.commit();

      return { id: Number(result.insertId), email: input.email, name: input.name };
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  }

  async login(input: { email: string; password: string }) {
    const [rows] = await dbPool.query<any[]>("SELECT id, email, password_hash, name FROM users WHERE email = ? LIMIT 1", [
      input.email
    ]);
    const user = rows?.[0];
    if (!user) {
      const err = new Error("INVALID_CREDENTIALS");
      // @ts-expect-error: tagged error
      err.code = "INVALID_CREDENTIALS";
      throw err;
    }

    const ok = await verifyPassword(input.password, user.password_hash);
    if (!ok) {
      const err = new Error("INVALID_CREDENTIALS");
      // @ts-expect-error: tagged error
      err.code = "INVALID_CREDENTIALS";
      throw err;
    }

    const accessPayload: AccessTokenPayload = {
      sub: String(user.id),
      email: user.email,
      name: user.name
    };

    const refreshJti = crypto.randomUUID();
    const refreshToken = signRefreshToken({ sub: String(user.id), jti: refreshJti });
    const refreshTokenHash = sha256Base64(refreshToken);

    await dbPool.query(
      "INSERT INTO refresh_tokens (user_id, token_hash, expires_at, revoked_at, created_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? SECOND), NULL, NOW())",
      [user.id, refreshTokenHash, REFRESH_TOKEN_TTL_SECONDS]
    );

    return {
      user: { id: Number(user.id), email: user.email, name: user.name },
      accessToken: signAccessToken(accessPayload),
      refreshToken
    };
  }

  async refresh(input: { refreshToken: string }) {
    // Verify signature first; then confirm it exists and is not revoked in DB.
    const { verifyRefreshToken } = await import("../../utils/jwt");
    const decoded = verifyRefreshToken(input.refreshToken);

    const tokenHash = sha256Base64(input.refreshToken);
    const [rows] = await dbPool.query<any[]>(
      "SELECT id, user_id, revoked_at, expires_at FROM refresh_tokens WHERE token_hash = ? LIMIT 1",
      [tokenHash]
    );
    const stored = rows?.[0];
    if (!stored) {
      const err = new Error("INVALID_REFRESH");
      // @ts-expect-error: tagged error
      err.code = "INVALID_REFRESH";
      throw err;
    }
    if (stored.revoked_at) {
      const err = new Error("REFRESH_REVOKED");
      // @ts-expect-error: tagged error
      err.code = "REFRESH_REVOKED";
      throw err;
    }
    if (new Date(stored.expires_at).getTime() < Date.now()) {
      const err = new Error("REFRESH_EXPIRED");
      // @ts-expect-error: tagged error
      err.code = "REFRESH_EXPIRED";
      throw err;
    }
    if (Number(stored.user_id) !== Number(decoded.sub)) {
      const err = new Error("INVALID_REFRESH");
      // @ts-expect-error: tagged error
      err.code = "INVALID_REFRESH";
      throw err;
    }

    const [userRows] = await dbPool.query<any[]>("SELECT id, email, name FROM users WHERE id = ? LIMIT 1", [
      decoded.sub
    ]);
    const user = userRows?.[0];
    if (!user) {
      const err = new Error("USER_NOT_FOUND");
      // @ts-expect-error: tagged error
      err.code = "USER_NOT_FOUND";
      throw err;
    }

    const accessToken = signAccessToken({
      sub: String(user.id),
      email: user.email,
      name: user.name
    });

    return { accessToken, user: { id: Number(user.id), email: user.email, name: user.name } };
  }

  async logout(input: { refreshToken: string | null }) {
    if (!input.refreshToken) return;
    const tokenHash = sha256Base64(input.refreshToken);
    await dbPool.query("UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = ? AND revoked_at IS NULL", [
      tokenHash
    ]);
  }
}

