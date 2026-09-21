import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

const router = Router();

const createFoodItemSchema = z.object({
  name: z.string().min(1),
  brand: z.string().optional(),
  servingSize: z.number().positive(),
  servingUnit: z.string().min(1),
  calories: z.number().min(0),
  proteinG: z.number().min(0),
  carbsG: z.number().min(0),
  fatG: z.number().min(0),
  fiberG: z.number().min(0).optional(),
});

const logMealSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  mealType: z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        foodItemId: z.string().min(1),
        quantity: z.number().positive().default(1.0),
      })
    )
    .min(1),
});

// GET /api/meals/foods - Search food items library
router.get('/foods', async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    const query = typeof q === 'string' ? q.trim() : '';

    const foods = await prisma.foodItem.findMany({
      where: query
        ? {
            name: {
              contains: query,
            },
          }
        : undefined,
      take: 20,
      orderBy: { name: 'asc' },
    });

    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search foods', message: (error as Error).message });
  }
});

// POST /api/meals/foods - Create new food item
router.post('/foods', async (req: Request, res: Response) => {
  try {
    const data = createFoodItemSchema.parse(req.body);
    const item = await prisma.foodItem.create({
      data: {
        ...data,
        isVerified: true,
      },
    });
    res.status(201).json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'ValidationError', details: error.errors });
      return;
    }
    res.status(500).json({ error: 'Failed to create food', message: (error as Error).message });
  }
});

// GET /api/meals/:userId - Get meal logs for user
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const userId = String(req.params.userId);
    const { date } = req.query;

    const meals = await prisma.mealLog.findMany({
      where: {
        userId,
        date: typeof date === 'string' ? date : undefined,
      },
      include: {
        items: {
          include: {
            foodItem: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meals', message: (error as Error).message });
  }
});

// POST /api/meals/:userId - Log a meal
router.post('/:userId', async (req: Request, res: Response) => {
  try {
    const userId = String(req.params.userId);
    const { date, mealType, notes, items } = logMealSchema.parse(req.body);

    // Resolve nutrition for each item
    const foodItemIds = items.map((i) => i.foodItemId);
    const dbFoods = await prisma.foodItem.findMany({
      where: { id: { in: foodItemIds } },
    });

    const foodMap = new Map(dbFoods.map((f) => [f.id, f]));

    const mealItemsData = items.map((item) => {
      const food = foodMap.get(item.foodItemId);
      if (!food) {
        throw new Error(`Food item with id ${item.foodItemId} not found`);
      }
      return {
        foodItemId: food.id,
        quantity: item.quantity,
        calories: Math.round(food.calories * item.quantity * 10) / 10,
        proteinG: Math.round(food.proteinG * item.quantity * 10) / 10,
        carbsG: Math.round(food.carbsG * item.quantity * 10) / 10,
        fatG: Math.round(food.fatG * item.quantity * 10) / 10,
      };
    });

    const mealLog = await prisma.mealLog.create({
      data: {
        userId,
        date,
        mealType,
        notes,
        items: {
          create: mealItemsData,
        },
      },
      include: {
        items: {
          include: {
            foodItem: true,
          },
        },
      },
    });

    res.status(201).json(mealLog);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'ValidationError', details: error.errors });
      return;
    }
    res.status(500).json({ error: 'Failed to log meal', message: (error as Error).message });
  }
});

// DELETE /api/meals/logs/:id - Delete a meal log
router.delete('/logs/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await prisma.mealLog.delete({
      where: { id },
    });
    res.json({ success: true, message: `Meal log ${id} deleted` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete meal log', message: (error as Error).message });
  }
});

export default router;
