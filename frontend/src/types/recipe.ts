export interface Recipe {
  id: string;
  title: string;
  description: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  tags: string[];
  dietaryCategory: 'high_protein' | 'low_carb' | 'balanced' | 'recovery';
  ingredients: { name: string; amount: string }[];
  instructions: string[];
  macroMatchScore?: number; // 0 - 100 based on remaining budget
}
