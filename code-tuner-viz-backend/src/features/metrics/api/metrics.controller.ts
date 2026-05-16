import type { Request, Response } from "express";
import { z } from "zod";
import type { MetricsService } from "../domain/MetricsService";

const classSizesQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(200).default(50),
  project: z.string().min(1).optional()
});

const optionalProjectSchema = z.object({
  project: z.string().min(1).optional()
});

export class MetricsController {
  constructor(private readonly service: MetricsService) {}

  histogram = async (req: Request, res: Response) => {
    const { project } = optionalProjectSchema.parse(req.query);
    const data = await this.service.getComplexityHistogram(project);
    res.json(data);
  };

  classSizes = async (req: Request, res: Response) => {
    const { limit, project } = classSizesQuerySchema.parse(req.query);
    const data = await this.service.getClassSizes(limit, project);
    res.json(data);
  };

  trend = async (req: Request, res: Response) => {
    const { project } = optionalProjectSchema.parse(req.query);
    const data = await this.service.getComplexityTrend(project);
    res.json(data);
  };

  benchmarks = async (_req: Request, res: Response) => {
    const data = await this.service.getBenchmarks();
    res.json(data);
  };
}
