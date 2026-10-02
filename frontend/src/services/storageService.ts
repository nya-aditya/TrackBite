import { UserProfile } from '../types/user';
import { FitbitMetricSnapshot, WearableDevice } from '../types/wearable';
import { MealLog } from '../types/nutrition';
import { TELEMETRY_PRESETS, createSnapshotFromPreset, INITIAL_WEARABLE_DEVICE } from './wearableService';

const STORAGE_KEYS = {
  USER_PROFILE: 'trackbite_user_profile_v1',
  WEARABLE_DEVICE: 'trackbite_device_v1',
  TELEMETRY_SNAPSHOT: 'trackbite_telemetry_snapshot_v1',
  MEAL_LOGS: 'trackbite_meal_logs_v1',
};

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'user-alex-mercer',
  name: 'Alex Mercer',
  email: 'alex.mercer@trackbite.health',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  age: 28,
  gender: 'male',
  heightCm: 182,
  weightKg: 78.5,
  targetWeightKg: 76.0,
  primaryGoal: 'fat_loss',
  activityLevel: 'very_active',
  dietaryPreference: 'high_protein',
  dailyWaterGoalMl: 3200,
  isAutoAdaptiveEnabled: true,
  onboardingCompleted: true,
};

export function loadUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load user profile from storage', e);
  }
  return DEFAULT_USER_PROFILE;
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save user profile to storage', e);
  }
}

export function loadWearableDevice(): WearableDevice {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WEARABLE_DEVICE);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load wearable device from storage', e);
  }
  return INITIAL_WEARABLE_DEVICE;
}

export function saveWearableDevice(device: WearableDevice): void {
  try {
    localStorage.setItem(STORAGE_KEYS.WEARABLE_DEVICE, JSON.stringify(device));
  } catch (e) {
    console.error('Failed to save wearable device to storage', e);
  }
}

export function loadTelemetrySnapshot(): FitbitMetricSnapshot {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TELEMETRY_SNAPSHOT);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load telemetry snapshot from storage', e);
  }
  // Default to optimal preset
  return createSnapshotFromPreset(TELEMETRY_PRESETS[0]);
}

export function saveTelemetrySnapshot(snapshot: FitbitMetricSnapshot): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TELEMETRY_SNAPSHOT, JSON.stringify(snapshot));
  } catch (e) {
    console.error('Failed to save telemetry snapshot to storage', e);
  }
}

export function loadMealLogs(): MealLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MEAL_LOGS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load meal logs from storage', e);
  }
  const todayStr = new Date().toISOString().split('T')[0];
  return [
    {
      id: 'meal-breakfast-init',
      date: todayStr,
      mealType: 'BREAKFAST',
      notes: 'Morning fuel: rolled oats + whey protein',
      items: [
        {
          id: 'item-1',
          foodItemId: 'food-oatmeal',
          foodName: 'Rolled Oats (Dry)',
          brand: 'Quaker',
          quantity: 1,
          servingUnit: 'bowl (80g)',
          calories: 304,
          proteinG: 10.4,
          carbsG: 54.4,
          fatG: 5.6,
        },
        {
          id: 'item-2',
          foodItemId: 'food-whey',
          foodName: '100% Gold Standard Whey Isolate',
          brand: 'Optimum Nutrition',
          quantity: 1,
          servingUnit: 'scoop (31g)',
          calories: 120,
          proteinG: 24,
          carbsG: 3,
          fatG: 1,
        },
      ],
      totalCalories: 424,
      totalProteinG: 34.4,
      totalCarbsG: 57.4,
      totalFatG: 6.6,
      createdAt: new Date().toISOString(),
    },
  ];
}

export function saveMealLogs(logs: MealLog[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MEAL_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save meal logs to storage', e);
  }
}
