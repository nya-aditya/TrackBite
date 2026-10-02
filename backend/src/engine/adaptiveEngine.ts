/**
 * TrackBite Adaptive Nutrition Calculation Engine
 * 
 * Yeh engine user ke biometrics aur wearable telemetry (Fitbit / smartwatch signals)
 * ko analyze karke dynamically daily calories aur macronutrients (protein, carbs, fat) calculate karta hai.
 */

// 1. Data Contracts (TypeScript Interfaces)
// Yeh define karta hai ki engine ko input me kis shape ka data chahiye.

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
  sleepEfficiency?: number | null; // neend ki efficiency percentage (0 - 100) ya decimal me
  restingHeartRate?: number | null; // aaram ke waqt heart rate (bpm)
  hrv?: number | null; // Heart Rate Variability (RMSSD ms me)
  strainScore?: number | null; // body par kitna strain/load pada (0 - 21 scale)
  recoveryScore?: number | null; // body kitni recover hui (0 - 100 score)
  activeZoneMinutes?: number | null; // Fitbit ke Active Zone Minutes (AZM)
  activeCaloriesBurned?: number | null; // workout/exercise se kitni extra calories burn hui
  readinessScore?: number | null; // Fitbit Daily Readiness score (0 - 100)
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
 * Step 1: Basal Metabolic Rate (BMR) calculate karna (Mifflin-St Jeor formula se).
 * Yeh wo minimum calories hain jo body ko zinda aur organs function karne ke liye chahiye
 * (chahe aap poora din bed par aaram hi kyu na karein).
 */
export function calculateBMR(user: UserBiometrics): number {
  const gender = (user.gender || '').toLowerCase();
  // Gender factor: Males ke liye +5, Females ke liye -161, Others ke liye -78
  const s = gender === 'male' ? 5 : gender === 'female' ? -161 : -78;
  return Math.round(10 * user.weightKg + 6.25 * user.heightCm - 5 * user.age + s);
}

/**
 * Step 2: Activity Multiplier
 * User din bhar kitna physically active rehta hai, uske hisab se BMR ko multiply karte hain (TDEE nikalne ke liye).
 */
export function getActivityMultiplier(activityLevel: UserBiometrics['activityLevel']): number {
  switch ((activityLevel || '').toLowerCase()) {
    case 'sedentary':
      return 1.2; // Desk job, bilkul ya na ke barabar exercise
    case 'light':
      return 1.375; // Halka workout 1-3 din per week
    case 'moderate':
      return 1.55; // Normal workout 3-5 din per week
    case 'very_active':
      return 1.725; // Heavy workout 6-7 din per week
    case 'athlete':
      return 1.9; // Bahut heavy physical job ya din me 2 baar intense training
    default:
      return 1.4;
  }
}

/**
 * Step 3: Goal Calorie Shift
 * Agar fat loss karna hai toh sustainable deficit banayenge, aur agar muscle gain karna hai toh clean surplus denge.
 */
export function getGoalCalorieAdjustment(goal: UserBiometrics['primaryGoal']): number {
  switch ((goal || '').toLowerCase()) {
    case 'fat_loss':
      return -400; // -400 kcal deficit: lagbhag 0.4 kg fat loss/week bina metabolism slow kiye
    case 'muscle_gain':
      return 300; // +300 kcal lean surplus: muscle mass badhane ke liye bina faltu charbi/fat ke
    case 'maintenance':
    case 'athletic_performance':
    default:
      return 0; // Maintenance me calories same rahengi
  }
}

/**
 * Step 4: Sleep Deficit Compensation (Kam sone par calorie aur protein buffer)
 * Jab neend 7 ghante se kam hoti hai, toh ghrelin (bhookh lagane wala hormone) badh jata hai aur insulin sensitivity gir jati hai.
 * Muscle breakdown (catabolism) rokne aur energy crash se bachne ke liye hum protective calories aur protein add karte hain.
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
      explanation: '+80 kcal & +7g protein: Thodi si neend kam hai; blood glucose balance stabilize kiya gaya hai.',
    };
  } else if (sleepHours >= 5.8) {
    return {
      bufferKcal: 160,
      bufferProteinG: 17,
      explanation: '+160 kcal & +17g protein: Moderate sleep deficit; din ke cortisol spikes aur energy dip se bachane ke liye.',
    };
  } else if (sleepHours >= 4.8) {
    return {
      bufferKcal: 240,
      bufferProteinG: 27,
      explanation: '+240 kcal & +27g protein: Kafi kam neend mili hai; muscle tissue ko protect karna priority hai.',
    };
  } else {
    return {
      bufferKcal: 310,
      bufferProteinG: 35,
      explanation: '+310 kcal & +35g protein: Severe neend ki kami; anti-catabolic recovery protocol activate kiya gaya hai.',
    };
  }
}

/**
 * Step 5: Master Function: Compute Adaptive Plan
 * Saare user biometrics aur wearable signals ko combine karke exact daily prescription calculate karta hai.
 */
export function computeAdaptivePlan(
  user: UserBiometrics,
  telemetry?: TelemetryMetrics | null
): AdaptivePlanResult {
  // A. Baseline Energy Expenditure calculate karna (BMR * Activity + Goal)
  const bmr = calculateBMR(user);
  const activityMult = getActivityMultiplier(user.activityLevel);
  const goalAdjustment = getGoalCalorieAdjustment(user.primaryGoal);

  const baselineCalories = Math.round(bmr * activityMult + goalAdjustment);

  // B. Baseline Protein Target:
  // Fat loss ya muscle gain ke liye 2.2g/kg bodyweight, normal maintenance ke liye 2.0g/kg
  const goal = (user.primaryGoal || '').toLowerCase();
  const proteinMultiplier = goal === 'fat_loss' || goal === 'muscle_gain' ? 2.2 : 2.0;
  const baselineProteinG = Math.round(user.weightKg * proteinMultiplier);

  // C. Baseline Fat Target:
  // Total calories ka 28% healthy fats ko allocate karte hain (1g fat = 9 kcal)
  const baselineFatG = Math.round((baselineCalories * 0.28) / 9);

  // D. Baseline Carbs Target:
  // Bachi hui remaining calories clean carbs ko milti hain (1g carb = 4 kcal, 1g protein = 4 kcal)
  const remainingKcalForCarbs = baselineCalories - (baselineProteinG * 4 + baselineFatG * 9);
  const baselineCarbsG = Math.max(50, Math.round(remainingKcalForCarbs / 4));

  // --- Wearable Adaptive Adjustments ---

  // 1. Sleep adjustment (neend ke ghante ke hisab se buffer)
  const sleepHours = telemetry?.sleepHours ?? 8.0;
  const sleepBuffer = calculateSleepBuffer(sleepHours);

  // 2. Cardiovascular strain / Active Zone Minutes (AZM) workout adjustment
  let strainAdjustmentKcal = 0;
  let strainExplanationParts: string[] = [];

  // Active Zone Minutes (AZM) compensation (workout me heart rate kitni der high raha)
  if (telemetry?.activeZoneMinutes && telemetry.activeZoneMinutes > 30) {
    // 30 minute baseline ke baad har extra AZM par 3.5 kcal replenish karenge
    const azmBurn = Math.round((telemetry.activeZoneMinutes - 30) * 3.5);
    strainAdjustmentKcal += azmBurn;
    strainExplanationParts.push(`+${azmBurn} kcal from ${telemetry.activeZoneMinutes} Active Zone Minutes`);
  } else if (telemetry?.activeCaloriesBurned && telemetry.activeCaloriesBurned > 400) {
    // Ya phir agar active burn 400 se upar hai toh 30% buffer karenge taaki energy deficit bahut zyada na ho jaye
    const extraBurn = Math.round((telemetry.activeCaloriesBurned - 400) * 0.3);
    strainAdjustmentKcal += extraBurn;
    strainExplanationParts.push(`+${extraBurn} kcal replenishing ${telemetry.activeCaloriesBurned} active burn`);
  }

  // 3. Low Readiness Score penalty / protection (Fitbit Daily Readiness ya Recovery Score < 40 hone par)
  let readinessBufferProteinG = 0;
  const effectiveReadiness = telemetry?.readinessScore ?? telemetry?.recoveryScore;
  if (effectiveReadiness !== undefined && effectiveReadiness !== null && effectiveReadiness < 40) {
    // Low recovery me muscle repair ke liye extra +0.2g/kg protein dete hain
    readinessBufferProteinG = Math.round(user.weightKg * 0.2);
    strainExplanationParts.push(`+${readinessBufferProteinG}g protein for low readiness (${effectiveReadiness}/100)`);
  }

  // Final totals (Baseline + Sleep Buffer + Workout Strain)
  const adjustedCalories = baselineCalories + sleepBuffer.bufferKcal + strainAdjustmentKcal;
  const adjustedProteinG = baselineProteinG + sleepBuffer.bufferProteinG + readinessBufferProteinG;

  // Fats ko stable rakhte hain (naya total calories ka 27%)
  const adjustedFatG = Math.round((adjustedCalories * 0.27) / 9);

  // Bachi hui extra energy muscle glycogen replenish karne ke liye Carbs me assign hoti hai
  const adjRemainingKcal = adjustedCalories - (adjustedProteinG * 4 + adjustedFatG * 9);
  const adjustedCarbsG = Math.max(50, Math.round(adjRemainingKcal / 4));

  // User ke dashboard ke liye readable clinical explanation banate hain
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
