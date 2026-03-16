import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import { env } from "./config/env";
import { requestLogger } from "./middleware/requestLogger";
import { errorHandler } from "./middleware/errorHandler";
import { healthRoutes } from "./modules/health/health.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { subjectRoutes } from "./modules/subjects/subject.routes";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");

  app.use(helmet());
  app.use(compression());
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());

  const allowedOrigins = env.CORS_ORIGIN.split(",").map((s) => s.trim());

  app.use(
    cors({
      origin: (origin, callback) => {
        // allow server-to-server calls
        if (!origin) return callback(null, true);

        // allow Vercel preview deployments
        if (typeof origin === "string" && origin.includes("vercel.app")) {
          return callback(null, true);
        }

        if (typeof origin === "string" && allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
      },
      credentials: true
    })
  );

  app.use(requestLogger);

  app.get("/", (_req, res) => res.redirect("/api/health"));

  app.use("/api/health", healthRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/subjects", subjectRoutes);

  app.use(errorHandler);

  return app;
}