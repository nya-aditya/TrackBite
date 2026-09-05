export type PrimaryGoal = 'fat_loss' | 'muscle_gain' | 'maintenance' | 'athletic_performance';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active' | 'athlete';
export type DietaryPreference = 'none' | 'high_protein' | 'keto' | 'plant_based' | 'paleo' | 'mediterranean';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  primaryGoal: PrimaryGoal;
  activityLevel: ActivityLevel;
  dietaryPreference: DietaryPreference;
  dailyWaterGoalMl: number;
  isAutoAdaptiveEnabled: boolean;
  onboardingCompleted: boolean;
}
