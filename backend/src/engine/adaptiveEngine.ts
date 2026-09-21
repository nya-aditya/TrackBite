export interface UserBiometrics {
  gender: string;
  age: number;
  heightCm: number;
  weightKg: number;
  primaryGoal: string;
  activityLevel: string;
}

export interface TelemetryMetrics {
  sleepHours: number;
  sleepEfficiency?: number | null;
  restingHeartRate?: number | null;
  hrv?: number | null;
  strainScore?: number | null;
  activeCaloriesBurned?: number | null;
}

export interface AdaptivePlanResult {
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

/**
 * Calculates Basal Metabolic Rate (BMR) using Mifflin-St Jeor formula
 */
export function calculateBMR(user: UserBiometrics): number {
  const s = user.gender.toLowerCase() === 'male' ? 5 : -161;
  return 10 * user.weightKg + 6.25 * user.heightCm - 5 * user.age + s;
}

/**
 * Maps activity level to Total Daily Energy Expenditure (TDEE) multiplier
 */
export function getActivityMultiplier(activityLevel: string): number {
  switch (activityLevel.toLowerCase()) {
    case 'sedentary':
      return 1.2;
    case 'light':
      return 1.375;
    case 'moderate':
      return 1.55;
    case 'very_active':
      return 1.725;
    case 'athlete':
      return 1.9;
    default:
      return 1.4;
  }
}

/**
 * Derives goal delta in calories (deficit or surplus)
 */
export function getGoalCalorieAdjustment(goal: string): number {
  switch (goal.toLowerCase()) {
    case 'fat_loss':
      return -400;
    case 'muscle_gain':
      return 300;
    case 'maintenance':
    case 'athletic_performance':
    default:
      return 0;
  }
}

/**
 * Evaluates physiological sleep deficits and returns calorie and protein buffers
 */
export function calculateSleepBuffer(sleepHours: number): {
  bufferKcal: number;
  bufferProteinG: number;
  explanation: string;
} {
  if (sleepHours >= 7.6) {
    return {
      bufferKcal: 0,
      bufferProteinG: 0,
      explanation:
        'Baseline target: Optimal restorative sleep supports full insulin sensitivity and baseline recovery.',
    };
  } else if (sleepHours >= 6.8) {
    return {
      bufferKcal: 80,
      bufferProteinG: 7,
      explanation:
        '+80 kcal & +7g protein added: Mild recovery deficit detected; maintaining baseline glucose balance.',
    };
  } else if (sleepHours >= 5.8) {
    return {
      bufferKcal: 160,
      bufferProteinG: 17,
      explanation:
        '+160 kcal & +17g protein buffered: Sleep duration deficit; buffering afternoon cortisol & glycemic dips.',
    };
  } else if (sleepHours >= 4.8) {
    return {
      bufferKcal: 240,
      bufferProteinG: 27,
      explanation:
        '+240 kcal & +27g protein buffered to offset acute sleep deprivation and heightened cortisol.',
    };
  } else {
    return {
      bufferKcal: 310,
      bufferProteinG: 35,
      explanation:
        '+310 kcal & +35g protein buffered: Severe sleep deficit; prioritizing cellular tissue repair & leptin suppression.',
    };
  }
}

/**
 * Core TrackBite Adaptive Nutrition Engine:
 * Dynamically computes daily macro and calorie targets based on physiological telemetry.
 */
export function computeAdaptivePlan(
  user: UserBiometrics,
  telemetry?: TelemetryMetrics | null
): AdaptivePlanResult {
  const bmr = calculateBMR(user);
  const activityMult = getActivityMultiplier(user.activityLevel);
  const goalAdjustment = getGoalCalorieAdjustment(user.primaryGoal);

  // Baseline targets
  const baselineCalories = Math.round(bmr * activityMult + goalAdjustment);
  // Standard target: 2.0g to 2.2g per kg bodyweight
  const baselineProteinG = Math.round(user.weightKg * 2.2);

  // Default baseline fat: 28% of calories
  const baselineFatG = Math.round((baselineCalories * 0.28) / 9);
  // Remainder to carbs
  const remainingKcalForCarbs = baselineCalories - (baselineProteinG * 4 + baselineFatG * 9);
  const baselineCarbsG = Math.max(50, Math.round(remainingKcalForCarbs / 4));

  // Compute wearable adjustments
  const sleepHours = telemetry?.sleepHours ?? 8.0;
  const sleepBuffer = calculateSleepBuffer(sleepHours);

  // Calculate strain buffer (e.g. from intense workout)
  let strainAdjustmentKcal = 0;
  if (telemetry?.strainScore && telemetry.strainScore > 14.0) {
    // Buffers 15 kcal per point of strain above 14
    strainAdjustmentKcal = Math.round((telemetry.strainScore - 14.0) * 20);
  } else if (telemetry?.activeCaloriesBurned && telemetry.activeCaloriesBurned > 500) {
    // Buffers 25% of active burn to prevent excessive negative energy balance
    strainAdjustmentKcal = Math.round((telemetry.activeCaloriesBurned - 500) * 0.25);
  }

  const adjustedCalories = baselineCalories + sleepBuffer.bufferKcal + strainAdjustmentKcal;
  const adjustedProteinG = baselineProteinG + sleepBuffer.bufferProteinG;

  // Allocate macro adjustments: keep fat relatively stable, buffer with protein and clean carbs
  const adjustedFatG = Math.round((adjustedCalories * 0.27) / 9);
  const adjRemainingKcal = adjustedCalories - (adjustedProteinG * 4 + adjustedFatG * 9);
  const adjustedCarbsG = Math.max(50, Math.round(adjRemainingKcal / 4));

  let finalExplanation = sleepBuffer.explanation;
  if (strainAdjustmentKcal > 0) {
    finalExplanation += ` Additionally, +${strainAdjustmentKcal} kcal accounted for elevated cardiovascular strain.`;
  }

  return {
    baselineCalories,
    adjustedCalories,
    baselineProteinG,
    adjustedProteinG,
    baselineCarbsG,
    adjustedCarbsG,
    baselineFatG,
    adjustedFatG,
    sleepBufferKcal: sleepBuffer.bufferKcal,
    sleepBufferProteinG: sleepBuffer.bufferProteinG,
    strainAdjustmentKcal,
    explanation: finalExplanation,
  };
}
