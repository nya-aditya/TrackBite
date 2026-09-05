# Implementation Plan: TrackBite — Wearable-Integrated Nutrition & Recovery Platform

Build **TrackBite**, a modern, high-performance, dark-mode wellness web application that connects wearable physiological data (Sleep, HRV, Strain, Heart Rate, Activity) with real-time adaptive nutrition targets, frictionless AI photo food logging, barcode scanning, macro-aware recipe matching, and recovery correlation analytics.

---

## User Review Required

> [!IMPORTANT]
> **Key Architecture Decisions**:
> 1. **Technology Stack**: React 19 + TypeScript + Vite + Lucide Icons + Canvas/SVG Visualizers with custom Vanilla CSS design tokens (Sleek dark mode inspired by Whoop, Oura, and Apple Fitness).
> 2. **AI Photo Logging Simulation & Integration**: Built-in intelligent computer vision simulation engine with bounding box detection, portion estimation, and nutritional breakdown. Also equipped with pre-loaded instant demo meals and custom file/camera upload.
> 3. **Wearable Sync Engine**: Comprehensive multi-device sync manager (Fitbit / Google Health API, Whoop 4.0, Apple Health, Oura Ring) with a live Wearable Simulator to test dynamic macro recalculations under various physiological conditions (e.g., sleep deprivation, high strain workout days).
> 4. **Adaptive Nutrition Algorithm**: Dynamic TDEE + Sleep & Recovery Readiness Spoil/Recovery adjustment + Active Strain Replenishment formula.

---

## Proposed Changes

```
TrackBite/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── public/
│   ├── favicon.svg
│   └── demo-meals/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── types/
│   │   ├── wearable.ts        # Wearable data, metrics, sleep stages, devices
│   │   ├── nutrition.ts       # Foods, meals, macros, targets, logged items
│   │   ├── recipe.ts          # Recipes, ingredients, macro matching scores
│   │   └── user.ts            # User profile, goals, onboarding state
│   ├── services/
│   │   ├── adaptiveEngine.ts  # Dynamic adaptive calorie/macro calculation algorithm
│   │   ├── wearableService.ts # Wearable sync simulator & OAuth manager
│   │   ├── visionAiService.ts # AI food image recognition & portion analysis
│   │   ├── foodDatabaseService.ts # 100+ verified food items & USDA lookup
│   │   ├── barcodeService.ts  # Barcode scanner simulator & database
│   │   ├── recipeService.ts   # Macro-gap recipe recommendation engine
│   │   └── storageService.ts  # LocalStorage persistence & initial mock seeding
│   ├── context/
│   │   └── AppContext.tsx     # Unified reactive state (User, Wearable, Logs, Settings)
│   ├── components/
│   │   ├── Navigation/
│   │   │   ├── Header.tsx     # Wearable sync badge, quick action bar, date picker
│   │   │   └── NavTabs.tsx    # Bottom/Sidebar navigation (Dashboard, Log, Recipes, Trends, Wearables)
│   │   ├── Dashboard/
│   │   │   ├── RecoveryHero.tsx       # Whoop/Oura-grade Recovery & Strain score rings
│   │   │   ├── AdaptiveTargetCard.tsx # Dynamic target explainer badge (+X kcal for recovery)
│   │   │   ├── MacroRings.tsx         # Circular animated macro progress (Calories, P, C, F, Water)
│   │   │   ├── MealTimeline.tsx       # Daily meal logs with breakdown & quick-add
│   │   │   └── SmartNudgeBanner.tsx   # Circadian & recovery-based actionable tips
│   │   ├── Logging/
│   │   │   ├── PhotoLoggingModal.tsx  # Camera/upload AI scanner with bounding boxes & portions
│   │   │   ├── BarcodeScannerModal.tsx# Interactive camera barcode scanner simulator
│   │   │   ├── ManualSearchModal.tsx  # Fast searchable food database with portion selector
│   │   │   ├── QuickAddModal.tsx      # Quick macro entry
│   │   │   └── FavoritesList.tsx      # 1-click re-logging for recent/favorite foods
│   │   ├── Recipes/
│   │   │   ├── RecipeMatcher.tsx      # "Fill Your Remaining Macros" smart filter
│   │   │   └── RecipeDetailModal.tsx  # Ingredients, prep instructions, 1-click log meal
│   │   ├── Analytics/
│   │   │   ├── RecoveryVsNutritionChart.tsx # Correlation: Sleep/HRV vs Calorie/Sugar intake
│   │   │   ├── MacroAdherenceChart.tsx      # 7-day and 30-day compliance trends
│   │   │   └── StrainEnergyBalance.tsx      # Daily active burn vs intake balance
│   │   ├── Wearables/
│   │   │   ├── WearableManager.tsx    # Connected devices (Fitbit, Whoop, Oura, Apple Health)
│   │   │   └── LiveSimulatorDrawer.tsx# Sliders for Sleep, REM, HRV, Strain to test live adaptation
│   │   ├── Onboarding/
│   │   │   └── OnboardingModal.tsx    # Multi-step onboarding (Goals, metrics, wearable connect)
│   │   └── Common/
│   │       ├── CircularProgress.tsx   # SVG animated concentric gauges
│   │       ├── Modal.tsx              # Glassmorphic modal backdrop
│   │       └── Toast.tsx              # Action feedback notifications
```

---

## Key Features & User Workflows

### 1. Adaptive Daily Targets Algorithm
- **Baseline TDEE Calculation**: Mifflin-St Jeor equation modulated by target goal (Fat Loss: -20% deficit, Muscle Gain: +10% surplus, Maintenance: 0%, Performance: +5% with higher carb partition).
- **Physiological Adaptation Layer**:
  - **Recovery Score < 45% (Poor Recovery / Low Sleep)**: Protein target increased by +10% to protect lean muscle under cortisol stress, anti-inflammatory micronutrient prompts, carb timing shifted to daytime, hydration goal +500ml.
  - **Sleep Duration Deficit (<6.5h)**: +150-250 kcal adjustment to prevent metabolic sluggishness and support energy balance.
  - **Daily Strain & Active Burn**: Dynamic active calorie addition ($1.0 \times \text{Active Burn}$) + extra carbohydrates for glycogen replenishment ($0.05\text{g} \times \text{Active kcal}$).
- **Target Explainer Banner**: Transparently explains *why* targets shifted today (e.g. *"⚡ +280 kcal & +18g Carbs added: 8.2h sleep but high strain (15.4) workout detected"*).

### 2. Multi-Modal Frictionless Food Logging
- **AI Photo Logging**:
  - Image upload or camera snapshot.
  - Multi-item detection with simulated vision bounding boxes and confidence scores.
  - Interactive portion slider (grams / servings) with instant recalculation of macros.
  - 6 preloaded realistic demo meals (Avocado Egg Toast, Salmon Quinoa Bowl, Protein Berry Smoothie, Ribeye & Sweet Potato, Greek Chicken Salad, Oatmeal Power Bowl) for immediate testing.
- **Barcode Scanner**:
  - Interactive camera viewport with simulated barcode target overlay.
  - Quick-select barcodes for popular foods (e.g., Fairlife Core Power, Quest Bar, Chobani Greek Yogurt, Oats, Almond Milk).
- **Searchable Database**:
  - Instant fuzzy search over 100+ common foods with custom portion sizes.
- **Favorites & Recents**:
  - 1-click re-logging for rapid breakfast/lunch entries.

### 3. Smart Recipe Recommendations Filtered by Remaining Macros
- Real-time calculation of remaining Calories, Protein, Carbs, and Fats.
- Intelligent ranking algorithm matching recipes that fit precisely into remaining budget without exceeding limits.
- "1-Click Log Entire Recipe" to instantly push ingredients into today's food log.

### 4. Wearable Integration & Live Simulation Hub
- Connect flows for **Fitbit (Google Health API)**, **Whoop 4.0**, **Apple Health**, and **Oura Ring Gen 3**.
- Real-time OAuth connection toggles and last-synced indicators.
- **Live Simulator Drawer**: Interactive sliders allowing users to manipulate Sleep Time, Deep Sleep %, REM %, Resting HR, HRV (ms), and Workout Strain, triggering instant live recalculation of their daily nutrition targets.

### 5. Recovery & Nutrition Correlation Analytics
- Interactive canvas/SVG charts showing:
  - **Sleep Quality vs. Next-Day Sugar/Calorie Intake** (visualizing the physiological impact of sleep deprivation on cravings).
  - **Protein Adherence vs. Readiness Score Trends**.
  - **Weekly Caloric Balance vs. Body Weight/Energy Level**.

---

## Verification Plan

### Automated Build & Typecheck
- Run `npm run build` or `tsc --noEmit` to verify type safety and zero compilation errors.
- Run dev server and verify assets load cleanly.

### Manual Verification Flow
1. **Onboarding Flow**: Complete onboarding step-by-step, set goal (e.g. Lean Muscle Gain), connect Fitbit wearable, verify initial targets.
2. **Wearable Live Adaptation**: Open the Wearable Simulator, switch preset to "Poor Sleep / High Strain", verify that the dashboard instantly adapts targets with an explanatory badge.
3. **AI Photo Food Logging**: Test photo log with demo meals and uploaded pictures, verify bounding boxes, adjust portion grams, confirm meal log into Lunch.
4. **Barcode Scanning**: Open Barcode Scanner, scan a test item (e.g., Protein Shake), verify instant nutrition auto-fill.
5. **Macro Rings & Timeline**: Verify circular rings update in real-time as items are added/deleted.
6. **Smart Recipes**: Check that recipe suggestions rank based on remaining daily macros and test 1-click meal logging.
7. **Trends View**: Navigate to Analytics and verify interactive correlation charts.
8. **Persistence**: Refresh page to ensure all logged meals and wearable state persist via LocalStorage.
