import { Router } from "express";
import { PrismaMetricsRepository } from "../data/PrismaMetricsRepository";
import { MetricsService } from "../domain/MetricsService";
import { MetricsController } from "./metrics.controller";

const repo = new PrismaMetricsRepository();
const service = new MetricsService(repo);
const controller = new MetricsController(service);

export const metricsRouter = Router();

// Matches the frontend expectations:
metricsRouter.get("/complexity-histogram", controller.histogram);
metricsRouter.get("/class-sizes", controller.classSizes);
metricsRouter.get("/complexity-trend", controller.trend);
metricsRouter.get("/benchmarks", controller.benchmarks);
