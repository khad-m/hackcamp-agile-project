import express from "express";
import cors from "cors";
import { config } from "./config";
import { metricsRouter } from "../features/metrics/api/metrics.routes";

export function createApp() {
  const app = express();

  app.use(express.json());

  app.use(
    cors({
      origin: config.corsOrigin
    })
  );

  app.get("/health", (_req, res) => {
    res.json({ ok: true, status: "healthy" });
  });

  app.use("/api/metrics", metricsRouter);

  // basic error handler
  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  });

  return app;
}
