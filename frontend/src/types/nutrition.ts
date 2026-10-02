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
