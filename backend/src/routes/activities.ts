import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { computeAdaptivePlan } from '../engine/adaptiveEngine';

const router = Router();

const createActivitySchema = z.object({
  name: z.string().min(1, 'Activity name is required'),
  type: z.enum(['RUN', 'WALK', 'CYCLING']),
  distanceMeters: z.number().positive(),
  durationSeconds: z.number().int().positive(),
  paceMinPerKm: z.number().positive().optional(),
  caloriesBurned: z.number().positive().optional(),
  elevationGainM: z.number().min(0).optional().default(0),
  averageHeartRate: z.number().int().positive().optional().nullable(),
  routeCoordinates: z.union([z.string(), z.array(z.array(z.number()))]).optional(),
  startDate: z.string().optional(),
});

// GET /api/activities/:userId - Get all activities for user
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const userId = String(req.params.userId);
    const { limit } = req.query;

    const activities = await prisma.activity.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
      take: limit ? parseInt(limit as string, 10) : 30,
    });

    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activities', message: (error as Error).message });
  }
});

// GET /api/activities/detail/:id - Get single activity detail
router.get('/detail/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const activity = await prisma.activity.findUnique({
      where: { id },
    });

    if (!activity) {
      res.status(404).json({ error: 'ActivityNotFound', message: `Activity ${id} not found` });
      return;
    }

    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activity detail', message: (error as Error).message });
  }
});

// POST /api/activities/:userId - Save new activity and dynamically adapt nutrition
router.post('/:userId', async (req: Request, res: Response) => {
  try {
    const userId = String(req.params.userId);
    const validated = createActivitySchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: 'UserNotFound', message: `User ${userId} not found` });
      return;
    }

    // Auto-calculate pace if missing (min/km)
    const distanceKm = validated.distanceMeters / 1000;
    const durationMin = validated.durationSeconds / 60;
    const paceMinPerKm = validated.paceMinPerKm ?? (distanceKm > 0 ? Math.round((durationMin / distanceKm) * 100) / 100 : 0);

    // Auto-calculate calories if missing (using MET standard estimation: ~1 kcal/kg/km for run, ~0.7 for walk)
    const metFactor = validated.type === 'RUN' ? 1.03 : validated.type === 'CYCLING' ? 0.65 : 0.75;
    const estimatedCalories = validated.caloriesBurned ?? Math.round(user.weightKg * distanceKm * metFactor);

    // Format routeCoordinates as string if array
    const routeCoordsString =
      typeof validated.routeCoordinates === 'string'
        ? validated.routeCoordinates
        : validated.routeCoordinates
        ? JSON.stringify(validated.routeCoordinates)
        : null;

    const startDate = validated.startDate ? new Date(validated.startDate) : new Date();
    const todayDateStr = startDate.toISOString().split('T')[0];

    // 1. Create Activity Record
    const activity = await prisma.activity.create({
      data: {
        userId,
        name: validated.name,
        type: validated.type,
        distanceMeters: validated.distanceMeters,
        durationSeconds: validated.durationSeconds,
        paceMinPerKm,
        caloriesBurned: estimatedCalories,
        elevationGainM: validated.elevationGainM ?? 0,
        averageHeartRate: validated.averageHeartRate ?? null,
        routeCoordinates: routeCoordsString,
        startDate,
      },
    });

    // 2. Automatically feed into today's DailyTelemetry
    const currentTelem = await prisma.dailyTelemetry.findUnique({
      where: { userId_date: { userId, date: todayDateStr } },
    });

    const additionalAZM = Math.round(durationMin);
    const additionalBurn = Math.round(estimatedCalories);
    const additionalSteps = Math.round(validated.distanceMeters * 1.3);

    const updatedTelem = await prisma.dailyTelemetry.upsert({
      where: { userId_date: { userId, date: todayDateStr } },
      update: {
        activeCaloriesBurned: (currentTelem?.activeCaloriesBurned ?? 0) + additionalBurn,
        strainScore: Math.min(21, (currentTelem?.strainScore ?? 8) + (additionalAZM > 30 ? 4.5 : 2.5)),
        steps: (currentTelem?.steps ?? 0) + additionalSteps,
      },
      create: {
        userId,
        date: todayDateStr,
        sleepHours: 7.5,
        activeCaloriesBurned: additionalBurn,
        strainScore: 12.0,
        recoveryScore: 75,
        steps: additionalSteps,
        source: 'gps_tracker',
      },
    });

    // 3. Recalculate Today's Adaptive Nutrition Plan
    const computedPlan = computeAdaptivePlan(user, updatedTelem);

    await prisma.adaptivePlan.upsert({
      where: { userId_date: { userId, date: todayDateStr } },
      update: {
        ...computedPlan,
        status: 'ACTIVE',
      },
      create: {
        userId,
        date: todayDateStr,
        ...computedPlan,
        status: 'ACTIVE',
      },
    });

    res.status(201).json({
      activity,
      message: `Activity '${activity.name}' saved. Today's nutrition plan adapted (+${estimatedCalories} kcal burn accounted for).`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'ValidationError', details: error.errors });
      return;
    }
    res.status(500).json({ error: 'Failed to create activity', message: (error as Error).message });
  }
});

// DELETE /api/activities/:id - Delete an activity
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await prisma.activity.delete({
      where: { id },
    });
    res.json({ success: true, message: `Activity ${id} deleted` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete activity', message: (error as Error).message });
  }
});

export default router;
