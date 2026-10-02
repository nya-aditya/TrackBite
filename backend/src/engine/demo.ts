/**
 * Test & Interactive Demo Script for Adaptive Engine
 * Run with: npx tsx src/engine/demo.ts
 */

import { computeAdaptivePlan, UserBiometrics, TelemetryMetrics } from './adaptiveEngine';

const testUser: UserBiometrics = {
  gender: 'male',
  age: 26,
  heightCm: 180,
  weightKg: 78,
  primaryGoal: 'fat_loss',
  activityLevel: 'moderate',
};

console.log('=================================================================');
console.log('🏋️‍♂️ USER PROFILE:');
console.log(`Age: ${testUser.age} | Weight: ${testUser.weightKg}kg | Goal: ${testUser.primaryGoal} | Activity: ${testUser.activityLevel}`);
console.log('=================================================================\n');

// Scenario 1: Optimal Rest Day (8 hours sleep, low strain)
const optimalTelemetry: TelemetryMetrics = {
  sleepHours: 8.2,
  readinessScore: 92,
  activeZoneMinutes: 15,
};

const plan1 = computeAdaptivePlan(testUser, optimalTelemetry);
console.log('--- SCENARIO 1: Optimal Sleep & Low Strain (Readiness: 92) ---');
console.log(`Baseline Targets: ${plan1.baselineCalories} kcal | P: ${plan1.baselineProteinG}g | C: ${plan1.baselineCarbsG}g | F: ${plan1.baselineFatG}g`);
console.log(`Adjusted Targets: ${plan1.adjustedCalories} kcal | P: ${plan1.adjustedProteinG}g | C: ${plan1.adjustedCarbsG}g | F: ${plan1.adjustedFatG}g`);
console.log(`Rationale: ${plan1.explanation}\n`);

// Scenario 2: Sleep Deprived Day (5.2 hours sleep)
const sleepDeprivedTelemetry: TelemetryMetrics = {
  sleepHours: 5.2,
  readinessScore: 54,
  activeZoneMinutes: 20,
};

const plan2 = computeAdaptivePlan(testUser, sleepDeprivedTelemetry);
console.log('--- SCENARIO 2: Sleep Deprivation (5.2h sleep, Readiness: 54) ---');
console.log(`Baseline Targets: ${plan2.baselineCalories} kcal | P: ${plan2.baselineProteinG}g | C: ${plan2.baselineCarbsG}g | F: ${plan2.baselineFatG}g`);
console.log(`Adjusted Targets: ${plan2.adjustedCalories} kcal | P: ${plan2.adjustedProteinG}g | C: ${plan2.adjustedCarbsG}g | F: ${plan2.adjustedFatG}g`);
console.log(`Rationale: ${plan2.explanation}\n`);

// Scenario 3: High Strain Cardio Workout (65 Active Zone Minutes)
const workoutTelemetry: TelemetryMetrics = {
  sleepHours: 7.8,
  readinessScore: 85,
  activeZoneMinutes: 65,
  activeCaloriesBurned: 620,
};

const plan3 = computeAdaptivePlan(testUser, workoutTelemetry);
console.log('--- SCENARIO 3: Heavy Workout Day (65 AZM, 620 active kcal) ---');
console.log(`Baseline Targets: ${plan3.baselineCalories} kcal | P: ${plan3.baselineProteinG}g | C: ${plan3.baselineCarbsG}g | F: ${plan3.baselineFatG}g`);
console.log(`Adjusted Targets: ${plan3.adjustedCalories} kcal | P: ${plan3.adjustedProteinG}g | C: ${plan3.adjustedCarbsG}g | F: ${plan3.adjustedFatG}g`);
console.log(`Rationale: ${plan3.explanation}\n`);

console.log('=================================================================');
