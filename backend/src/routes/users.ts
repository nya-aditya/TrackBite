import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

const router = Router();

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  age: z.number().int().positive().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  heightCm: z.number().positive().optional(),
  weightKg: z.number().positive().optional(),
  targetWeightKg: z.number().positive().optional(),
  primaryGoal: z.string().optional(),
  activityLevel: z.string().optional(),
  dietaryPreference: z.string().optional(),
  dailyWaterGoalMl: z.number().int().positive().optional(),
  isAutoAdaptiveEnabled: z.boolean().optional(),
});

// GET /api/users - List users
router.get('/', async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users', message: (error as Error).message });
  }
});

// GET /api/users/:id - Get single user with latest telemetry
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        telemetries: {
          orderBy: { date: 'desc' },
          take: 7,
        },
        adaptivePlans: {
          orderBy: { date: 'desc' },
          take: 1,
        },
      },
    });

    if (!user) {
      res.status(404).json({ error: 'UserNotFound', message: `User ${id} not found` });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user', message: (error as Error).message });
  }
});

// PATCH /api/users/:id - Update user biometrics/settings
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const validatedData = updateUserSchema.parse(req.body);

    const updatedUser = await prisma.user.update({
      where: { id },
      data: validatedData,
    });

    res.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'ValidationError', details: error.errors });
      return;
    }
    res.status(500).json({ error: 'Failed to update user', message: (error as Error).message });
  }
});

export default router;
