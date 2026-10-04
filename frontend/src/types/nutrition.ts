export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';

export interface MacroNutrients {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG?: number;
  waterMl?: number;
}

export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG?: number;
  isVerified: boolean;
  category?: 'protein' | 'carbs' | 'fats' | 'fruits_veg' | 'beverage' | 'snack';
}

export interface MealItem {
  id?: string;
  foodItemId: string;
  foodName: string;
  brand?: string;
  quantity: number;
  servingUnit: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export interface MealLog {
  id: string;
  date: string;
  mealType: MealType;
  notes?: string;
  items: MealItem[];
  totalCalories: number;
  totalProteinG: number;
  totalCarbsG: number;
  totalFatG: number;
  createdAt: string;
}

export interface DailyAdaptiveTarget {
  baselineCalories: number;
  adjustedCalories: number;
  baselineProteinG: number;
  adjustedProteinG: number;
  baselineCarbsG: number;
  adjustedCarbsG: number;
  baselineFatG: number;
  adjustedFatG: number;
  sleepBufferKcal: number;
  sleepBufferProteinG: number;
  strainAdjustmentKcal: number;
  explanation: string;
}

export function isValidMealType(type: string): type is MealType {
  return ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'].includes(type as MealType);
}

export function calculateMealTotals(items: readonly MealItem[]): MacroNutrients {
  return items.reduce(
    (acc, item) => ({
      calories: Math.round((acc.calories + item.calories) * 10) / 10,
      proteinG: Math.round((acc.proteinG + item.proteinG) * 10) / 10,
      carbsG: Math.round((acc.carbsG + item.carbsG) * 10) / 10,
      fatG: Math.round((acc.fatG + item.fatG) * 10) / 10,
    }),
    { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 }
  );
}
