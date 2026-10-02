/**
 * TrackBite Adaptive Nutrition Calculation Engine
 * 
 * This engine takes user biometrics and wearable telemetry (Fitbit signals)
 * and dynamically calculates adjusted calories and macronutrients.
 */

// 1. Data Contracts (TypeScript Interfaces)
// These define exactly what shapes of data the engine expects as inputs.

export interface UserBiometrics {
  gender: 'male' | 'female' | 'other' | string;
  age: number;
  heightCm: number;
  weightKg: number;
  primaryGoal: 'fat_loss' | 'muscle_gain' | 'maintenance' | 'athletic_performance' | string;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very_active' | 'athlete' | string;
}

export interface TelemetryMetrics {
  sleepHours: number;
  sleepEfficiency?: number | null; // percentage (0 - 100) or decimal
  restingHeartRate?: number | null; // bpm
  hrv?: number | null; // RMSSD in ms
  strainScore?: number | null; // 0 - 21 strain scale
  recoveryScore?: number | null; // 0 - 100 recovery score
  activeZoneMinutes?: number | null; // Fitbit AZM
  activeCaloriesBurned?: number | null; // kcal burned through exercise
  readinessScore?: number | null; // Fitbit Daily Readiness (0 - 100)
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
 * Step 1: Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor.
 * This is the baseline energy needed to keep organs functioning at complete rest.
 */
export function calculateBMR(user: UserBiometrics): number {
  const gender = (user.gender || '').toLowerCase();
  // S-factor: +5 for biological males, -161 for biological females
  const s = gender === 'male' ? 5 : gender === 'female' ? -161 : -78;
  return Math.round(10 * user.weightKg + 6.25 * user.heightCm - 5 * user.age + s);
}

/**
 * Step 2: Activity Multiplier
 * Standard physical activity level factors derived from metabolic chamber studies.
 */
export function getActivityMultiplier(activityLevel: UserBiometrics['activityLevel']): number {
  switch ((activityLevel || '').toLowerCase()) {
    case 'sedentary':
      return 1.2; // Desk job, little to no exercise
    case 'light':
      return 1.375; // Light exercise 1-3 days/week
    case 'moderate':
      return 1.55; // Moderate exercise 3-5 days/week
    case 'very_active':
      return 1.725; // Hard exercise 6-7 days/week
    case 'athlete':
      return 1.9; // Very heavy physical job or 2x daily training
    default:
      return 1.4;
  }
}

/**
 * Step 3: Goal Calorie Shift
 * Creates a sustainable deficit for fat loss or slight surplus for lean hypertrophy.
 */
export function getGoalCalorieAdjustment(goal: UserBiometrics['primaryGoal']): number {
  switch ((goal || '').toLowerCase()) {
    case 'fat_loss':
      return -400; // ~0.4 kg fat loss/week without metabolic slowdown
    case 'muscle_gain':
      return 300; // Lean surplus minimizing excess adiposity
    case 'maintenance':
    case 'athletic_performance':
    default:
      return 0;
  }
}

/**
 * Step 4: Sleep Deficit Compensation
 * When sleep drops below 7 hours, ghrelin (hunger) spikes and insulin sensitivity drops.
 * We add protective calories and protein to prevent catabolism and mitigate energy crashes.
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
      explanation: 'Optimal restorative sleep (≥7.6h): Standard recovery profile applied.',
    };
  } else if (sleepHours >= 6.8) {
    return {
      bufferKcal: 80,
      bufferProteinG: 7,
      explanation: '+80 kcal & +7g protein: Mild sleep deficit detected; stabilizing glucose balance.',
    };
  } else if (sleepHours >= 5.8) {
    return {
      bufferKcal: 160,
      bufferProteinG: 17,
      explanation: '+160 kcal & +17g protein: Moderate sleep deficit; buffering midday cortisol spikes.',
    };
  } else if (sleepHours >= 4.8) {
    return {
      bufferKcal: 240,
      bufferProteinG: 27,
      explanation: '+240 kcal & +27g protein: Acute sleep deprivation; prioritizing muscle tissue preservation.',
    };
  } else {
    return {
      bufferKcal: 310,
      bufferProteinG: 35,
      explanation: '+310 kcal & +35g protein: Severe sleep restriction; anti-catabolic recovery protocol.',
    };
  }
}

/**
 * Step 5: Master Function: Compute Adaptive Plan
 * Coordinates all biometrics and wearable signals into an exact daily prescription.
 */
export function computeAdaptivePlan(
  user: UserBiometrics,
  telemetry?: TelemetryMetrics | null
): AdaptivePlanResult {
  // A. Calculate Baseline Energy Expenditure
  const bmr = calculateBMR(user);
  const activityMult = getActivityMultiplier(user.activityLevel);
  const goalAdjustment = getGoalCalorieAdjustment(user.primaryGoal);

  const baselineCalories = Math.round(bmr * activityMult + goalAdjustment);

  // B. Baseline Protein Target:
  // 2.0g/kg for athletic/fat loss goals, 1.8g/kg for maintenance
  const proteinMultiplier = user.primaryGoal === 'fat_loss' || user.primaryGoal === 'muscle_gain' ? 2.2 : 2.0;
  const baselineProteinG = Math.round(user.weightKg * proteinMultiplier);

  // C. Baseline Fat Target:
  // 28% of total calories allocated to fats (1g fat = 9 kcal)
  const baselineFatG = Math.round((baselineCalories * 0.28) / 9);

  // D. Baseline Carbs Target:
  // Remaining calories allocated to carbohydrates (1g carb = 4 kcal, 1g protein = 4 kcal)
  const remainingKcalForCarbs = baselineCalories - (baselineProteinG * 4 + baselineFatG * 9);
  const baselineCarbsG = Math.max(50, Math.round(remainingKcalForCarbs / 4));

  // --- Wearable Adaptive Adjustments ---

  // 1. Sleep adjustment
  const sleepHours = telemetry?.sleepHours ?? 8.0;
  const sleepBuffer = calculateSleepBuffer(sleepHours);

  // 2. Cardiovascular strain / Active Zone Minutes adjustment
  let strainAdjustmentKcal = 0;
  let strainExplanationParts: string[] = [];

  // Active Zone Minutes (AZM) compensation
  if (telemetry?.activeZoneMinutes && telemetry.activeZoneMinutes > 30) {
    // 3.5 kcal per AZM beyond baseline 30 minutes
    const azmBurn = Math.round((telemetry.activeZoneMinutes - 30) * 3.5);
    strainAdjustmentKcal += azmBurn;
    strainExplanationParts.push(`+${azmBurn} kcal from ${telemetry.activeZoneMinutes} Active Zone Minutes`);
  } else if (telemetry?.activeCaloriesBurned && telemetry.activeCaloriesBurned > 400) {
    // Alternatively, buffer 30% of high active calorie burn
    const extraBurn = Math.round((telemetry.activeCaloriesBurned - 400) * 0.3);
    strainAdjustmentKcal += extraBurn;
    strainExplanationParts.push(`+${extraBurn} kcal replenishing ${telemetry.activeCaloriesBurned} active burn`);
  }

  // 3. Low Readiness Score penalty / protection (Fitbit Daily Readiness / Recovery Score < 40)
  let readinessBufferProteinG = 0;
  const effectiveReadiness = telemetry?.readinessScore ?? telemetry?.recoveryScore;
  if (effectiveReadiness !== undefined && effectiveReadiness !== null && effectiveReadiness < 40) {
    readinessBufferProteinG = Math.round(user.weightKg * 0.2); // +0.2g/kg extra protein for muscle repair
    strainExplanationParts.push(`+${readinessBufferProteinG}g protein for low readiness (${effectiveReadiness}/100)`);
  }

  // Final totals
  const adjustedCalories = baselineCalories + sleepBuffer.bufferKcal + strainAdjustmentKcal;
  const adjustedProteinG = baselineProteinG + sleepBuffer.bufferProteinG + readinessBufferProteinG;

  // Keep fats stable (27% of new caloric pool)
  const adjustedFatG = Math.round((adjustedCalories * 0.27) / 9);

  // Remainder fuels glycogen replenishment (Carbs)
  const adjRemainingKcal = adjustedCalories - (adjustedProteinG * 4 + adjustedFatG * 9);
  const adjustedCarbsG = Math.max(50, Math.round(adjRemainingKcal / 4));

  // Build readable clinical explanation
  let explanation = sleepBuffer.explanation;
  if (strainExplanationParts.length > 0) {
    explanation += ` | Strain adjustments: ${strainExplanationParts.join(', ')}.`;
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
    explanation,
  };
}
