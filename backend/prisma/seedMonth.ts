import { PrismaClient } from '@prisma/client';
import { computeAdaptivePlan } from '../src/engine/adaptiveEngine';

const prisma = new PrismaClient();

// GPS Waypoint Tracks for 4 different locations
const CENTRAL_PARK_5K = JSON.stringify([
  [40.785091, -73.968285],
  [40.786522, -73.966955],
  [40.788147, -73.965410],
  [40.790163, -73.963436],
  [40.791528, -73.960947],
  [40.789512, -73.958286],
  [40.786912, -73.957600],
  [40.784442, -73.959230],
  [40.783142, -73.962062],
  [40.783467, -73.965152],
  [40.785091, -73.968285],
]);

const HUDSON_RIVER_WALK = JSON.stringify([
  [40.712776, -74.013382],
  [40.714200, -74.013800],
  [40.716100, -74.014500],
  [40.718000, -74.015100],
  [40.720200, -74.015400],
  [40.722500, -74.015100],
  [40.724800, -74.014200],
  [40.727000, -74.013500],
]);

const PROSPECT_PARK_10K = JSON.stringify([
  [40.660204, -73.968956],
  [40.663110, -73.964200],
  [40.667500, -73.961000],
  [40.672000, -73.963500],
  [40.674500, -73.968800],
  [40.671200, -73.974100],
  [40.666100, -73.975500],
  [40.661800, -73.972100],
  [40.660204, -73.968956],
]);

const HIGHWAY_CYCLING_TRACK = JSON.stringify([
  [40.758896, -73.985130],
  [40.763000, -73.980000],
  [40.769000, -73.973000],
  [40.776000, -73.968000],
  [40.784000, -73.961000],
  [40.792000, -73.954000],
  [40.801000, -73.948000],
]);

async function main() {
  console.log('🗓️  Starting 1-Month (4-Week) Clinical Data Seed for TrackBite...\n');

  // 1. Wipe old records cleanly
  await prisma.activity.deleteMany();
  await prisma.mealLogItem.deleteMany();
  await prisma.mealLog.deleteMany();
  await prisma.adaptivePlan.deleteMany();
  await prisma.dailyTelemetry.deleteMany();
  await prisma.foodItem.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Primary Demo Athlete: Alex Mercer
  const user = await prisma.user.create({
    data: {
      id: 'demo-user-1',
      name: 'Alex Mercer',
      email: 'alex.mercer@trackbite.health',
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
    },
  });
  console.log(`✓ User Profile created: ${user.name} (${user.id})`);

  // 3. Create Verified Clinical Foods
  const foods = await Promise.all([
    prisma.foodItem.create({
      data: {
        id: 'food-chicken-breast',
        name: 'Grilled Chicken Breast',
        brand: 'TrackBite Whole Foods',
        servingSize: 150,
        servingUnit: 'g',
        calories: 247.5,
        proteinG: 46.5,
        carbsG: 0,
        fatG: 5.4,
        fiberG: 0,
        isVerified: true,
      },
    }),
    prisma.foodItem.create({
      data: {
        id: 'food-greek-yogurt',
        name: '0% Fat Plain Greek Yogurt',
        brand: 'Chobani',
        servingSize: 170,
        servingUnit: 'g',
        calories: 100,
        proteinG: 18,
        carbsG: 6,
        fatG: 0,
        fiberG: 0,
        isVerified: true,
      },
    }),
    prisma.foodItem.create({
      data: {
        id: 'food-oatmeal',
        name: 'Rolled Oats (Dry)',
        brand: 'Quaker',
        servingSize: 80,
        servingUnit: 'g',
        calories: 304,
        proteinG: 10.4,
        carbsG: 54.4,
        fatG: 5.6,
        fiberG: 8.2,
        isVerified: true,
      },
    }),
    prisma.foodItem.create({
      data: {
        id: 'food-salmon',
        name: 'Wild Atlantic Salmon Fillet',
        brand: 'TrackBite Catch',
        servingSize: 180,
        servingUnit: 'g',
        calories: 374,
        proteinG: 36,
        carbsG: 0,
        fatG: 24,
        fiberG: 0,
        isVerified: true,
      },
    }),
    prisma.foodItem.create({
      data: {
        id: 'food-brown-rice',
        name: 'Steamed Brown Rice',
        brand: 'TrackBite Pantry',
        servingSize: 200,
        servingUnit: 'g',
        calories: 222,
        proteinG: 4.5,
        carbsG: 46,
        fatG: 1.6,
        fiberG: 3.5,
        isVerified: true,
      },
    }),
    prisma.foodItem.create({
      data: {
        id: 'food-whey',
        name: '100% Gold Standard Whey Isolate',
        brand: 'Optimum Nutrition',
        servingSize: 31,
        servingUnit: 'g',
        calories: 120,
        proteinG: 24,
        carbsG: 3,
        fatG: 1,
        fiberG: 0,
        isVerified: true,
      },
    }),
    prisma.foodItem.create({
      data: {
        id: 'food-avocado',
        name: 'Fresh Hass Avocado',
        brand: 'Whole Foods',
        servingSize: 100,
        servingUnit: 'g',
        calories: 160,
        proteinG: 2,
        carbsG: 8.5,
        fatG: 14.7,
        fiberG: 6.7,
        isVerified: true,
      },
    }),
  ]);
  console.log(`✓ Seeded ${foods.length} verified clinical food items`);

  // 4. Generate 28 Days (4 Weeks) of Telemetry, Plans, Meals, and GPS Activities
  const today = new Date();
  const totalDays = 28;

  let totalMealsCreated = 0;
  let totalActivitiesCreated = 0;

  for (let i = totalDays - 1; i >= 0; i--) {
    const targetDate = new Date(today);
    targetDate.setDate(targetDate.getDate() - i);
    const dateStr = targetDate.toISOString().split('T')[0];

    const dayNumber = totalDays - i; // 1 to 28
    const weekNumber = Math.ceil(dayNumber / 7); // 1, 2, 3, or 4

    let sleepHours: number;
    let sleepEfficiency: number;
    let readinessScore: number;
    let restingHeartRate: number;
    let hrv: number;
    let strainScore: number;
    let activeZoneMinutes: number;
    let activeCaloriesBurned: number;
    let steps: number;

    // Physiological modulation per week
    if (weekNumber === 1) {
      // WEEK 1: Baseline High-Volume Training & Optimal Recovery (Readiness 84-94)
      sleepHours = 7.9 + ((dayNumber * 7) % 8) * 0.1; // 7.9h - 8.6h
      sleepEfficiency = 0.92;
      readinessScore = 86 + (dayNumber % 8);
      restingHeartRate = 49 + (dayNumber % 3);
      hrv = 68 + (dayNumber % 10);
      activeZoneMinutes = dayNumber % 2 === 0 ? 45 : 20;
      activeCaloriesBurned = dayNumber % 2 === 0 ? 520 : 250;
      strainScore = dayNumber % 2 === 0 ? 14.2 : 9.5;
      steps = 9500 + (dayNumber % 4) * 800;
    } else if (weekNumber === 2) {
      // WEEK 2: Acute Sleep Deprivation & Cortisol Load (Sleep 4.8h - 5.6h, Readiness 34 - 48)
      sleepHours = 4.8 + ((dayNumber * 5) % 8) * 0.1; // 4.8h - 5.5h
      sleepEfficiency = 0.72;
      readinessScore = 35 + ((dayNumber * 3) % 14); // 35 - 48 (low recovery!)
      restingHeartRate = 59 + (dayNumber % 5);
      hrv = 34 + (dayNumber % 8);
      activeZoneMinutes = 15;
      activeCaloriesBurned = 210;
      strainScore = 15.6; // High internal strain despite low exercise
      steps = 7200 + (dayNumber % 3) * 500;
    } else if (weekNumber === 3) {
      // WEEK 3: Peak Cardio / Race Prep Strain (AZM 55-80, High Burn 600-850 kcal)
      sleepHours = 7.2 + ((dayNumber * 3) % 6) * 0.1; // 7.2h - 7.7h
      sleepEfficiency = 0.85;
      readinessScore = 72 + (dayNumber % 10);
      restingHeartRate = 53 + (dayNumber % 3);
      hrv = 58 + (dayNumber % 8);
      activeZoneMinutes = 60 + ((dayNumber * 5) % 25); // 60 - 80 AZM!
      activeCaloriesBurned = 620 + ((dayNumber * 30) % 220); // 620 - 840 active kcal
      strainScore = 17.4;
      steps = 12500 + (dayNumber % 5) * 1100;
    } else {
      // WEEK 4: Deload & Active Recovery Taper (Sleep 8.2h - 8.8h, Readiness 90 - 98)
      sleepHours = 8.2 + ((dayNumber * 4) % 6) * 0.1; // 8.2h - 8.7h
      sleepEfficiency = 0.94;
      readinessScore = 90 + (dayNumber % 8);
      restingHeartRate = 47 + (dayNumber % 2);
      hrv = 76 + (dayNumber % 12);
      activeZoneMinutes = dayNumber % 3 === 0 ? 30 : 12;
      activeCaloriesBurned = dayNumber % 3 === 0 ? 320 : 160;
      strainScore = 8.4;
      steps = 8800 + (dayNumber % 3) * 600;
    }

    // A. Seed Daily Telemetry
    const telemetry = await prisma.dailyTelemetry.create({
      data: {
        userId: user.id,
        date: dateStr,
        sleepHours: Math.round(sleepHours * 10) / 10,
        sleepEfficiency,
        restingHeartRate,
        hrv,
        strainScore,
        recoveryScore: readinessScore,
        activeCaloriesBurned,
        steps,
        source: 'fitbit',
      },
    });

    // B. Compute & Seed Exact Adaptive Plan
    const computed = computeAdaptivePlan(user, {
      sleepHours: telemetry.sleepHours,
      sleepEfficiency: telemetry.sleepEfficiency,
      restingHeartRate: telemetry.restingHeartRate,
      hrv: telemetry.hrv,
      strainScore: telemetry.strainScore,
      recoveryScore: telemetry.recoveryScore,
      activeCaloriesBurned: telemetry.activeCaloriesBurned,
      readinessScore: telemetry.recoveryScore,
      activeZoneMinutes,
    });

    await prisma.adaptivePlan.create({
      data: {
        userId: user.id,
        date: dateStr,
        ...computed,
        status: 'ACTIVE',
      },
    });

    // C. Seed Daily Meals (Breakfast + Lunch + Dinner)
    const breakfast = await prisma.mealLog.create({
      data: {
        userId: user.id,
        date: dateStr,
        mealType: 'BREAKFAST',
        notes: 'Morning fuel: rolled oats + whey isolate',
        items: {
          create: [
            {
              foodItemId: 'food-oatmeal',
              quantity: 1.0,
              calories: 304,
              proteinG: 10.4,
              carbsG: 54.4,
              fatG: 5.6,
            },
            {
              foodItemId: 'food-whey',
              quantity: 1.0,
              calories: 120,
              proteinG: 24,
              carbsG: 3,
              fatG: 1,
            },
          ],
        },
      },
    });

    const lunch = await prisma.mealLog.create({
      data: {
        userId: user.id,
        date: dateStr,
        mealType: 'LUNCH',
        notes: 'High protein recovery bowl',
        items: {
          create: [
            {
              foodItemId: 'food-chicken-breast',
              quantity: 1.2,
              calories: 297,
              proteinG: 55.8,
              carbsG: 0,
              fatG: 6.5,
            },
            {
              foodItemId: 'food-brown-rice',
              quantity: 1.0,
              calories: 222,
              proteinG: 4.5,
              carbsG: 46,
              fatG: 1.6,
            },
            {
              foodItemId: 'food-avocado',
              quantity: 0.5,
              calories: 80,
              proteinG: 1,
              carbsG: 4.2,
              fatG: 7.3,
            },
          ],
        },
      },
    });

    const dinner = await prisma.mealLog.create({
      data: {
        userId: user.id,
        date: dateStr,
        mealType: 'DINNER',
        notes: 'Atlantic salmon dinner with clean greens',
        items: {
          create: [
            {
              foodItemId: 'food-salmon',
              quantity: 1.0,
              calories: 374,
              proteinG: 36,
              carbsG: 0,
              fatG: 24,
            },
            {
              foodItemId: 'food-greek-yogurt',
              quantity: 1.0,
              calories: 100,
              proteinG: 18,
              carbsG: 6,
              fatG: 0,
            },
          ],
        },
      },
    });

    totalMealsCreated += 3;

    // D. Seed GPS Workouts (1-2 workouts per week on specific days)
    if (dayNumber % 3 === 0 || dayNumber === 28) {
      const isRun = dayNumber % 2 === 0;
      const track = isRun
        ? weekNumber === 3
          ? PROSPECT_PARK_10K
          : CENTRAL_PARK_5K
        : weekNumber === 3
        ? HIGHWAY_CYCLING_TRACK
        : HUDSON_RIVER_WALK;

      const actType = isRun ? 'RUN' : weekNumber === 3 ? 'CYCLING' : 'WALK';
      const distance = isRun ? (weekNumber === 3 ? 10200 : 5120) : weekNumber === 3 ? 18500 : 3450;
      const durationSec = isRun ? (weekNumber === 3 ? 3120 : 1620) : weekNumber === 3 ? 2700 : 2400;
      const pace = Math.round(((durationSec / 60) / (distance / 1000)) * 100) / 100;
      const cals = Math.round(78.5 * (distance / 1000) * (isRun ? 1.03 : 0.7));

      await prisma.activity.create({
        data: {
          userId: user.id,
          name: isRun
            ? weekNumber === 3
              ? `Prospect Park 10K Tempo [Week ${weekNumber}]`
              : `Morning Central Park 5K [Week ${weekNumber}]`
            : weekNumber === 3
            ? `Highway Endurance Ride [Week ${weekNumber}]`
            : `Waterfront Recovery Walk [Week ${weekNumber}]`,
          type: actType,
          distanceMeters: distance,
          durationSeconds: durationSec,
          paceMinPerKm: pace,
          caloriesBurned: cals,
          elevationGainM: isRun ? 45 : 12,
          averageHeartRate: isRun ? 158 : 110,
          routeCoordinates: track,
          startDate: targetDate,
        },
      });

      totalActivitiesCreated++;
    }
  }

  console.log(`\n======================================================`);
  console.log(`🎉 1-MONTH DATA SEED COMPLETED SUCCESSFULLY!`);
  console.log(`======================================================`);
  console.log(`• Total Days Seeded:      28 Days (4 Distinct Weeks)`);
  console.log(`• Daily Telemetries:      28 Records`);
  console.log(`• Adaptive Plans:         28 Records (Fully Computed)`);
  console.log(`• Meal Logs Created:      ${totalMealsCreated} Meals`);
  console.log(`• GPS Activities Seeded:  ${totalActivitiesCreated} Workouts with Routes`);
  console.log(`\nWEEKLY THEMES APPLIED:`);
  console.log(`  Week 1 (Days 1–7):   Optimal Recovery & Aerobic Baseline (Readiness: ~90)`);
  console.log(`  Week 2 (Days 8–14):  Acute Sleep Deprivation (+240 kcal buffer & +27g protein protection)`);
  console.log(`  Week 3 (Days 15–21): Peak Cardio Strain (60-80 AZM, Glycogen Carb Replenishment)`);
  console.log(`  Week 4 (Days 22–28): Deload & High Efficiency Taper (Readiness: ~95)`);
  console.log(`======================================================\n`);
}

main()
  .catch((e) => {
    console.error('❌ Error during 1-month seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
