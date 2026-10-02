import { MealItem } from '../types/nutrition';

export interface VisionAiMealPreset {
  id: string;
  name: string;
  description: string;
  confidenceScore: number;
  detectedItems: {
    foodName: string;
    portionText: string;
    confidence: number;
    mealItem: MealItem;
  }[];
}

export const VISION_AI_PRESETS: VisionAiMealPreset[] = [
  {
    id: 'salmon_bowl',
    name: 'Post-Workout Salmon & Brown Rice Bowl',
    description: 'Grilled salmon fillet with steamed brown rice and avocado slices.',
    confidenceScore: 96,
    detectedItems: [
      {
        foodName: 'Wild Atlantic Salmon Fillet',
        portionText: '180g (1 fillet)',
        confidence: 98,
        mealItem: {
          foodItemId: 'food-salmon',
          foodName: 'Wild Atlantic Salmon Fillet',
          quantity: 1,
          servingUnit: 'portion (180g)',
          calories: 374,
          proteinG: 36,
          carbsG: 0,
          fatG: 24,
        },
      },
      {
        foodName: 'Steamed Brown Rice',
        portionText: '200g (1 cup)',
        confidence: 95,
        mealItem: {
          foodItemId: 'food-brown-rice',
          foodName: 'Steamed Brown Rice',
          quantity: 1,
          servingUnit: 'cup (200g)',
          calories: 222,
          proteinG: 4.5,
          carbsG: 46,
          fatG: 1.6,
        },
      },
      {
        foodName: 'Fresh Hass Avocado',
        portionText: '50g (1/2 avocado)',
        confidence: 94,
        mealItem: {
          foodItemId: 'food-avocado',
          foodName: 'Fresh Hass Avocado',
          quantity: 0.5,
          servingUnit: 'half avocado (50g)',
          calories: 80,
          proteinG: 1,
          carbsG: 4.2,
          fatG: 7.3,
        },
      },
    ],
  },
  {
    id: 'chicken_sweet_potato',
    name: 'Grilled Chicken & Sweet Potato Recovery Plate',
    description: 'Lean grilled chicken breast with baked sweet potato and baby spinach.',
    confidenceScore: 97,
    detectedItems: [
      {
        foodName: 'Grilled Chicken Breast',
        portionText: '150g',
        confidence: 99,
        mealItem: {
          foodItemId: 'food-chicken-breast',
          foodName: 'Grilled Chicken Breast',
          quantity: 1,
          servingUnit: 'portion (150g)',
          calories: 247.5,
          proteinG: 46.5,
          carbsG: 0,
          fatG: 5.4,
        },
      },
      {
        foodName: 'Baked Sweet Potato',
        portionText: '200g',
        confidence: 96,
        mealItem: {
          foodItemId: 'food-sweet-potato',
          foodName: 'Baked Sweet Potato',
          quantity: 1,
          servingUnit: 'piece (200g)',
          calories: 180,
          proteinG: 4,
          carbsG: 41.4,
          fatG: 0.3,
        },
      },
    ],
  },
  {
    id: 'anabolic_oats',
    name: 'Power Protein Oatmeal with Blueberries',
    description: 'Rolled oats with whey isolate and organic blueberries.',
    confidenceScore: 95,
    detectedItems: [
      {
        foodName: 'Rolled Oats (Dry)',
        portionText: '80g (1 bowl)',
        confidence: 97,
        mealItem: {
          foodItemId: 'food-oatmeal',
          foodName: 'Rolled Oats (Dry)',
          quantity: 1,
          servingUnit: 'bowl (80g)',
          calories: 304,
          proteinG: 10.4,
          carbsG: 54.4,
          fatG: 5.6,
        },
      },
      {
        foodName: '100% Gold Standard Whey Isolate',
        portionText: '31g (1 scoop)',
        confidence: 93,
        mealItem: {
          foodItemId: 'food-whey',
          foodName: '100% Gold Standard Whey Isolate',
          quantity: 1,
          servingUnit: 'scoop (31g)',
          calories: 120,
          proteinG: 24,
          carbsG: 3,
          fatG: 1,
        },
      },
      {
        foodName: 'Fresh Organic Blueberries',
        portionText: '75g',
        confidence: 94,
        mealItem: {
          foodItemId: 'food-blueberries',
          foodName: 'Fresh Organic Blueberries',
          quantity: 0.5,
          servingUnit: 'portion (75g)',
          calories: 43,
          proteinG: 0.5,
          carbsG: 10.8,
          fatG: 0.2,
        },
      },
    ],
  },
];
