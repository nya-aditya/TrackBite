import { UserProfile } from '../types/user';
import { FitbitMetricSnapshot } from '../types/wearable';
import { DailyAdaptiveTarget } from '../types/nutrition';

export function calculateBMR(user: UserProfile): number {
  const gender = (user.gender || '').toLowerCase();
  const s = gender === 'male' ? 5 : gender === 'female' ? -161 : -78;
  return Math.round(10 * user.weightKg + 6.25 * user.heightCm - 5 * user.age + s);
}

export function getActivityMultiplier(activityLevel: UserProfile['activityLevel']): number {
  switch (activityLevel) {
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

export function getGoalCalorieAdjustment(goal: UserProfile['primaryGoal']): number {
  switch (goal) {
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

export function computeAdaptivePlan(
  user: UserProfile,
  snapshot: FitbitMetricSnapshot | null
): DailyAdaptiveTarget {
  const bmr = calculateBMR(user);
  const activityMult = getActivityMultiplier(user.activityLevel);
  const goalAdjustment = getGoalCalorieAdjustment(user.primaryGoal);

  const baselineCalories = Math.round(bmr * activityMult + goalAdjustment);

  const proteinMultiplier = user.primaryGoal === 'fat_loss' || user.primaryGoal === 'muscle_gain' ? 2.2 : 2.0;
  const baselineProteinG = Math.round(user.weightKg * proteinMultiplier);

  const baselineFatG = Math.round((baselineCalories * 0.28) / 9);

  const remainingKcalForCarbs = baselineCalories - (baselineProteinG * 4 + baselineFatG * 9);
  const baselineCarbsG = Math.max(50, Math.round(remainingKcalForCarbs / 4));

  const sleepHours = snapshot ? snapshot.sleep.totalDurationMinutes / 60 : 8.0;
  const sleepBuffer = calculateSleepBuffer(sleepHours);

  let strainAdjustmentKcal = 0;
  const strainExplanationParts: string[] = [];

  const azm = snapshot?.activity.activeZoneMinutes ?? 0;
  if (azm > 30) {
    const azmBurn = Math.round((azm - 30) * 3.5);
    strainAdjustmentKcal += azmBurn;
    strainExplanationParts.push(`+${azmBurn} kcal from ${azm} Active Zone Minutes`);
  } else if (snapshot?.activity.activeCalories && snapshot.activity.activeCalories > 400) {
    const extraBurn = Math.round((snapshot.activity.activeCalories - 400) * 0.3);
    strainAdjustmentKcal += extraBurn;
    strainExplanationParts.push(`+${extraBurn} kcal replenishing ${snapshot.activity.activeCalories} active burn`);
  }

  let readinessBufferProteinG = 0;
  const readiness = snapshot?.readiness.score ?? 85;
  if (readiness < 40) {
    readinessBufferProteinG = Math.round(user.weightKg * 0.2);
    strainExplanationParts.push(`+${readinessBufferProteinG}g protein for low readiness (${readiness}/100)`);
  }

  const adjustedCalories = baselineCalories + sleepBuffer.bufferKcal + strainAdjustmentKcal;
  const adjustedProteinG = baselineProteinG + sleepBuffer.bufferProteinG + readinessBufferProteinG;
  const adjustedFatG = Math.round((adjustedCalories * 0.27) / 9);

  const adjRemainingKcal = adjustedCalories - (adjustedProteinG * 4 + adjustedFatG * 9);
  const adjustedCarbsG = Math.max(50, Math.round(adjRemainingKcal / 4));

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
