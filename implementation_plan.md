# Implementation Plan: TrackBite — Fitbit-Powered Adaptive Nutrition & Recovery Platform

Build **TrackBite**, an adaptive nutrition web application tailored specifically for **Fitbit** users (with extensible architecture for other wearables in the future). TrackBite pulls and simulates Fitbit's core biometric signals (**Daily Readiness Score, Sleep Stages [Deep, Light, REM, Awake], Active Zone Minutes (AZM), Heart Rate Variability (HRV), Resting Heart Rate, and Calorie Expenditure**) to dynamically adjust daily nutrition targets in real-time, accompanied by frictionless multi-modal food logging (AI photo, barcode, database) and macro-gap recipe matching.

---

## User Review Required

> [!IMPORTANT]
> **Fitbit-First Focus & Extensible Architecture**:
> 1. **Fitbit Biometrics Integration**: The platform is centered on Fitbit's proprietary metrics:
>    - **Daily Readiness Score (0–100)**: Used as the primary signal for physiological strain vs. recovery.
>    - **Fitbit Sleep Score & Stages**: Deep sleep %, REM %, duration vs. target, restlessness index.
>    - **Active Zone Minutes (AZM) & Cardio Load**: Fitbit's signature intensity metric driving active carbohydrate and calorie replenishment.
>    - **Stress Management Score & HRV (RMSSD)**: Influencing micronutrient prompts and protein protection under high stress.
> 2. **Extensibility**: Data models use a generic `WearableDevice` interface with `'fitbit'` as the active and fully wired provider, with placeholders/stubs for `'whoop' | 'oura' | 'apple_health'` in future releases.
> 3. **Fitbit Sync & Simulation Engine**: Includes simulated Fitbit Web API OAuth connection, sync timestamps, battery level, device model (e.g., *Fitbit Charge 6*, *Fitbit Sense 2*, *Fitbit Inspire 3*), and an interactive **Fitbit Live Biometrics Simulator** to test how changing Fitbit metrics dynamically recalibrates daily nutrition targets.

---

## Proposed Changes

### 1. Types & Data Models
* **`src/types/wearable.ts`**:
  - `FitbitDeviceModel`: `'charge_6' | 'sense_2' | 'versa_4' | 'inspire_3' | 'luxe'`
  - `FitbitDailyReadiness`: score (0-100), state (`'low' | 'moderate' | 'optimal'`), components (sleep, hrv, restingHeartRate)
  - `FitbitSleepData`: totalDurationMinutes, sleepScore, deepMinutes, remMinutes, lightMinutes, awakeMinutes, efficiencyPercent
  - `FitbitActivityData`: activeZoneMinutes, fatBurnMinutes, cardioMinutes, peakMinutes, steps, totalCaloriesBurned, activeCalories
  - `FitbitMetricSnapshot`: timestamp, readiness, sleep, activity, hrvRmssd, restingHeartRate
  - Extensible `WearableDevice` interface with provider enum (`'fitbit' | 'whoop' | 'oura' | 'apple_health'`) and active provider flag.

* **`src/types/nutrition.ts`**:
  - Macronutrient profile (calories, proteinG, carbsG, fatG, fiberG, sugarG, sodiumMg, waterMl)
  - Meal slots: `breakfast`, `lunch`, `dinner`, `snack`
  - `LoggedFoodItem`, `FoodItem`, `MealLog`, and `DailyTarget`
  - `AdaptiveAdjustment`: specific explanations of adjustments made based on Fitbit metrics (e.g., `+180 kcal and +22g Carbs from 45 Active Zone Minutes`).

* **`src/types/recipe.ts`**:
  - Recipe interface with macros per serving, cook time, dietary tags, ingredient list, and dynamic `macroMatchScore` based on remaining daily targets.

---

### 2. Computational Services
* **`src/services/adaptiveEngine.ts`**:
  - Computes baseline TDEE using Mifflin-St Jeor equation + activity multiplier.
  - Modulates daily targets based on **Fitbit Daily Readiness**:
    - *Readiness < 40*: Prioritize muscle recovery, increase protein target by +10%, boost anti-inflammatory hydration +500ml, recommend easier-to-digest carbs.
    - *Readiness 40–75*: Moderate baseline adaptation.
    - *Readiness > 75*: Prime for high-intensity training, full carb fueling.
  - Modulates targets based on **Fitbit Active Zone Minutes & Active Calories**:
    - Adds active burn directly to caloric budget with carbohydrate replenishment ($0.05\text{g} \text{ carbs per active kcal}$).
  - Modulates targets based on **Fitbit Sleep Score**:
    - Sleep deficit (<6.5h or sleep score < 70): Adds metabolic stabilization buffer (+150 kcal) to mitigate cortisol spikes and midday energy dips.
  - Generates clear, human-readable rationale strings (e.g. *"Fitbit synced 8:15 AM: +310 kcal & +25g carbs added due to 52 Active Zone Minutes & 88% Readiness Score"*).

* **`src/services/wearableService.ts`**:
  - Fitbit-centric sync service: manages connected Fitbit device status, last sync timestamp, battery percentage, mock OAuth sync states.
  - Live simulation presets:
    - *High Strain Cardio Day* (Readiness: 62, AZM: 68 mins, Burn: 840 kcal, Sleep: 7.5h)
    - *Poor Sleep Recovery Day* (Readiness: 32, AZM: 10 mins, Burn: 150 kcal, Sleep: 5.1h)
    - *Peak Readiness Athlete* (Readiness: 94, AZM: 45 mins, Burn: 550 kcal, Sleep: 8.8h)
    - *Rest & Recovery Day* (Readiness: 78, AZM: 8 mins, Burn: 120 kcal, Sleep: 8.2h)
  - Live interactive parameter updater for immediate recalculation.

* **`src/services/foodDatabaseService.ts`**:
  - 100+ verified foods with accurate macro breakdowns per standard serving/100g.
  - Fast instant client-side search with category and portion filtering.

* **`src/services/visionAiService.ts`**:
  - AI photo food logging simulator: multi-item detection with bounding boxes, confidence percentages, and 6 instant demo meal presets.

* **`src/services/barcodeService.ts`**:
  - Barcode scanner simulator with barcode detection overlay and quick-test items.

* **`src/services/recipeService.ts`**:
  - Recipe library and intelligent ranking that scores recipes based on how cleanly they fit remaining macros without exceeding thresholds.

* **`src/services/storageService.ts`**:
  - LocalStorage persistence for user profile, food logs, Fitbit sync preferences, and custom recipes.

---

### 3. Application State & Styling
* **`src/context/AppContext.tsx`**:
  - Global state managing active user, Fitbit snapshot & sync status, food logs for current day, active modal dialogs, and toast notifications.
* **`src/index.css`**:
  - Dark-mode wellness UI inspired by Fitbit / modern health tech (teal `#00B0B9` Fitbit signature accents, slate dark backgrounds, glassmorphism, glowing concentric progress rings, smooth micro-interactions).

---

### 4. UI Components
* **Navigation**:
  - `Header.tsx`: Fitbit device badge with live sync status, battery %, last sync timestamp, and quick-add button.
  - `NavTabs.tsx`: Bottom/side navigation between **Dashboard**, **Food Log**, **Smart Recipes**, **Fitbit Sync & Analytics**.
* **Dashboard**:
  - `RecoveryHero.tsx`: Circular Fitbit Daily Readiness gauge, Active Zone Minutes bar, and Sleep Quality badge.
  - `AdaptiveTargetCard.tsx`: Explains the dynamic target delta calculated from today's Fitbit biometrics.
  - `MacroRings.tsx`: Concentric animated SVG rings for Calories, Protein, Carbs, Fats, and Water.
  - `MealTimeline.tsx`: Categorized logs (Breakfast, Lunch, Dinner, Snacks) with quick food addition and macro breakdown.
  - `SmartNudgeBanner.tsx`: Contextual nutrition tips based on Fitbit Readiness & Sleep.
* **Fitbit Hub & Live Simulator**:
  - `WearableManager.tsx`: Focused on Fitbit (device selection, auto-sync toggle, battery, sync log), with "Coming Soon" badges for Whoop/Oura/Apple Health.
  - `LiveSimulatorDrawer.tsx`: Sliders for Readiness (0-100), Sleep Duration, Deep/REM %, Active Zone Minutes, and Resting HR to instantly simulate biometric changes.
* **Logging System**:
  - `PhotoLoggingModal.tsx`, `BarcodeScannerModal.tsx`, `ManualSearchModal.tsx`, `QuickAddModal.tsx`.
* **Recipes**:
  - `RecipeMatcher.tsx`: "Fill remaining macros" filter and recipe cards with 1-click log.
* **Analytics**:
  - `RecoveryVsNutritionChart.tsx`: Fitbit Readiness & Sleep score vs. daily caloric and sugar adherence.

---

## Verification Plan

### Automated Build
* `npm run build` (`tsc && vite build`) to ensure 100% type safety and clean bundling.

### Manual Verification
1. **Fitbit Status & Simulation**: Verify Fitbit sync indicator in Header; open Simulator, drag Readiness slider from 85 down to 30, and confirm targets adjust dynamically with a Fitbit-branded explainer badge.
2. **Food Logging**: Log foods via AI Photo simulation, Barcode simulator, and manual search; confirm macro rings update.
3. **Recipe Matching**: Check recipe recommendations adapt to remaining macros.
4. **Device Management**: Verify Fitbit connection screen with future-device placeholders.
