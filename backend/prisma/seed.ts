import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting TrackBite database seed...');

  // 1. Clean existing records in reverse order of dependencies
  await prisma.activity.deleteMany();
  await prisma.mealLogItem.deleteMany();
  await prisma.mealLog.deleteMany();
  await prisma.adaptivePlan.deleteMany();
  await prisma.dailyTelemetry.deleteMany();
  await prisma.foodItem.deleteMany();
  await prisma.user.deleteMany();

  // 2. Seed Primary Demo User
  const demoUser = await prisma.user.create({
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
  console.log(`✓ Created user: ${demoUser.name} (${demoUser.id})`);

  // 3. Seed Verified Clinical Food Library
  const foodItems = await Promise.all([
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
  console.log(`✓ Created ${foodItems.length} verified food items`);

  // 4. Seed Telemetry (Yesterday = Rested 8.0h, Today = Sleep Deficit 5.2h with elevated strain)
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  await prisma.dailyTelemetry.createMany({
    data: [
      {
        userId: demoUser.id,
        date: yesterdayStr,
        sleepHours: 8.1,
        sleepEfficiency: 0.92,
        restingHeartRate: 51,
        hrv: 68,
        strainScore: 12.4,
        recoveryScore: 88,
        activeCaloriesBurned: 620,
        steps: 11450,
        source: 'whoop',
      },
      {
        userId: demoUser.id,
        date: todayStr,
        sleepHours: 5.2,
        sleepEfficiency: 0.74,
        restingHeartRate: 59,
        hrv: 42,
        strainScore: 15.8,
        recoveryScore: 38,
        activeCaloriesBurned: 740,
        steps: 8900,
        source: 'whoop',
      },
    ],
  });
  console.log(`✓ Seeded daily wearable telemetry for ${yesterdayStr} and ${todayStr}`);

  // 5. Seed Initial Adaptive Plan for Today
  // Baseline for 78.5kg active male: ~2450 kcal, 175g protein
  // Due to 5.2h sleep (< 5.8h deficit): +240 kcal & +27g protein buffer
  const adaptivePlan = await prisma.adaptivePlan.create({
    data: {
      userId: demoUser.id,
      date: todayStr,
      baselineCalories: 2450,
      adjustedCalories: 2690,
      baselineProteinG: 175,
      adjustedProteinG: 202,
      baselineCarbsG: 260,
      adjustedCarbsG: 275,
      baselineFatG: 78,
      adjustedFatG: 82,
      sleepBufferKcal: 240,
      sleepBufferProteinG: 27,
      strainAdjustmentKcal: 0,
      explanation:
        '+240 kcal & +27g protein buffered to offset acute sleep deprivation (5.2h) and heightened cortisol load.',
      status: 'ACTIVE',
    },
  });
  console.log(`✓ Created adaptive plan for ${todayStr}: ${adaptivePlan.adjustedCalories} kcal / ${adaptivePlan.adjustedProteinG}g protein`);

  // 6. Seed Sample Meal Log for Today (Breakfast)
  const breakfastLog = await prisma.mealLog.create({
    data: {
      userId: demoUser.id,
      date: todayStr,
      mealType: 'BREAKFAST',
      notes: 'Pre-workout fuel and hydration',
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
  console.log(`✓ Seeded breakfast meal log with 2 items`);

  // 7. Seed Past Activities with GPS Route Coordinates
  const centralParkLoop = JSON.stringify([
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

  const riverWalkTrack = JSON.stringify([
    [40.712776, -74.013382],
    [40.715000, -74.014200],
    [40.718000, -74.015100],
    [40.721000, -74.015500],
    [40.724000, -74.014800],
    [40.727000, -74.013500],
  ]);

  const tempoRunTrack = JSON.stringify([
    [40.758896, -73.985130],
    [40.761000, -73.982000],
    [40.764000, -73.978000],
    [40.768000, -73.974000],
    [40.772000, -73.971000],
    [40.776000, -73.969000],
    [40.779000, -73.967000],
  ]);

  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  await prisma.activity.createMany({
    data: [
      {
        id: 'act-park-5k',
        userId: demoUser.id,
        name: 'Morning Reservoir 5K Loop',
        type: 'RUN',
        distanceMeters: 5120,
        durationSeconds: 1620, // 27 mins
        paceMinPerKm: 5.27,
        caloriesBurned: 385.0,
        elevationGainM: 42.0,
        averageHeartRate: 156,
        routeCoordinates: centralParkLoop,
        startDate: yesterday,
      },
      {
        id: 'act-river-walk',
        userId: demoUser.id,
        name: 'Sunset Waterfront Recovery Walk',
        type: 'WALK',
        distanceMeters: 3450,
        durationSeconds: 2400, // 40 mins
        paceMinPerKm: 11.59,
        caloriesBurned: 180.0,
        elevationGainM: 12.0,
        averageHeartRate: 104,
        routeCoordinates: riverWalkTrack,
        startDate: twoDaysAgo,
      },
      {
        id: 'act-tempo-intervals',
        userId: demoUser.id,
        name: 'Threshold Tempo Intervals',
        type: 'RUN',
        distanceMeters: 7800,
        durationSeconds: 2460, // 41 mins
        paceMinPerKm: 5.25,
        caloriesBurned: 590.0,
        elevationGainM: 75.0,
        averageHeartRate: 168,
        routeCoordinates: tempoRunTrack,
        startDate: threeDaysAgo,
      },
    ],
  });
  console.log(`✓ Seeded 3 past activities with GPS route maps`);

  console.log('✨ Seed complete! TrackBite database is ready.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
