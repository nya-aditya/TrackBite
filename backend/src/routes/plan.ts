import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { computeAdaptivePlan } from '../engine/adaptiveEngine';

const router = Router();

// GET /api/plan/:userId - Get today's adaptive plan (or for specified ?date=)
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const userId = String(req.params.userId);
    const date = (req.query.date as string) || new Date().toISOString().split('T')[0];

    const plan = await prisma.adaptivePlan.findUnique({
      where: {
        userId_date: {
          userId,
          date,
        },
      },
    });

    if (plan) {
      res.json(plan);
      return;
    }

    // If no plan is recorded for today, auto-compute one
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: 'UserNotFound', message: `User ${userId} not found` });
      return;
    }

    const telemetry = await prisma.dailyTelemetry.findUnique({
      where: {
        userId_date: {
          userId,
          date,
        },
      },
    });

    const computed = computeAdaptivePlan(user, telemetry);

    // Save as active plan for today
    const savedPlan = await prisma.adaptivePlan.create({
      data: {
        userId,
        date,
        ...computed,
        status: 'ACTIVE',
      },
    });

    res.json(savedPlan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve adaptive plan', message: (error as Error).message });
  }
});

// POST /api/plan/:userId/recalculate - Force recalculate adaptive plan based on latest telemetry
router.post('/:userId/recalculate', async (req: Request, res: Response) => {
  try {
    const userId = String(req.params.userId);
    const date = req.body.date || new Date().toISOString().split('T')[0];

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: 'UserNotFound', message: `User ${userId} not found` });
      return;
    }

    const telemetry = await prisma.dailyTelemetry.findUnique({
      where: {
        userId_date: {
          userId,
          date,
        },
      },
    });

    const computed = computeAdaptivePlan(user, telemetry);

    const updatedPlan = await prisma.adaptivePlan.upsert({
      where: {
        userId_date: {
          userId,
          date,
        },
      },
      update: {
        ...computed,
        status: 'ACTIVE',
      },
      create: {
        userId,
        date,
        ...computed,
        status: 'ACTIVE',
      },
    });

    res.json(updatedPlan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to recalculate plan', message: (error as Error).message });
  }
});

export default router;
