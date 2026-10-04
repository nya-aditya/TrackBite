import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

const router = Router();

const telemetryPayloadSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  sleepHours: z.number().min(0).max(24),
  sleepEfficiency: z.number().min(0).max(1).optional().nullable(),
  restingHeartRate: z.number().int().positive().optional().nullable(),
  hrv: z.number().positive().optional().nullable(),
  strainScore: z.number().min(0).max(21).optional().nullable(),
  recoveryScore: z.number().min(0).max(100).optional().nullable(),
  activeCaloriesBurned: z.number().int().min(0).optional().nullable(),
  steps: z.number().int().min(0).optional().nullable(),
  source: z.string().default('fitbit'),
});

// GET /api/telemetry/:userId - Fetch telemetry records
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const userId = String(req.params.userId).trim();
    if (!userId) {
      res.status(400).json({ error: 'ValidationError', message: 'userId is required' });
      return;
    }

    const { date, days } = req.query;

    if (date && typeof date === 'string') {
      const record = await prisma.dailyTelemetry.findUnique({
        where: {
          userId_date: {
            userId,
            date,
          },
        },
      });
      res.json(record);
      return;
    }

    const parsedDays = days ? parseInt(days as string, 10) : 14;
    const limit = Math.max(1, Math.min(parsedDays, 90)); // clamp between 1 and 90 days

    const history = await prisma.dailyTelemetry.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: limit,
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch telemetry', message: (error as Error).message });
  }
});

// POST /api/telemetry/:userId - Upsert wearable daily telemetry
router.post('/:userId', async (req: Request, res: Response) => {
  try {
    const userId = String(req.params.userId);
    const data = telemetryPayloadSchema.parse(req.body);

    const telemetry = await prisma.dailyTelemetry.upsert({
      where: {
        userId_date: {
          userId,
          date: data.date,
        },
      },
      update: {
        sleepHours: data.sleepHours,
        sleepEfficiency: data.sleepEfficiency,
        restingHeartRate: data.restingHeartRate,
        hrv: data.hrv,
        strainScore: data.strainScore,
        recoveryScore: data.recoveryScore,
        activeCaloriesBurned: data.activeCaloriesBurned,
        steps: data.steps,
        source: data.source,
      },
      create: {
        userId,
        date: data.date,
        sleepHours: data.sleepHours,
        sleepEfficiency: data.sleepEfficiency,
        restingHeartRate: data.restingHeartRate,
        hrv: data.hrv,
        strainScore: data.strainScore,
        recoveryScore: data.recoveryScore,
        activeCaloriesBurned: data.activeCaloriesBurned,
        steps: data.steps,
        source: data.source,
      },
    });

    res.json(telemetry);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'ValidationError', details: error.errors });
      return;
    }
    res.status(500).json({ error: 'Failed to save telemetry', message: (error as Error).message });
  }
});

export default router;
