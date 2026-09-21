# Walkthrough: TrackBite Landing Page & Hero Interactive Motion

TrackBite's landing page has been implemented adhering strictly to a **clinical athletic telemetry** visual identity, with exactly **one deliberate, meaningful animated moment** in the hero section and zero scattered decorative motion across the rest of the page.

---

## 1. Design & Identity Implementation

* **Matte Diagnostic Palette**:
  * **Basalt Canvas (`#0E1013`)**: Non-reflective deep carbon ground. Zero gradient washes or background blobs.
  * **Surface Container (`#16191E`)**: Flat, opaque structural panels delineated strictly with `1px solid #262A33` rules — zero drop shadows or faux-glassmorphism.
  * **Readiness Sage (`#27B27C`)**: Signals optimal sleep recovery and parasympathetic balance.
  * **Metabolic Ochre (`#E09228`)**: Signals glycogen burn and active carbohydrate buffering.
  * **Strain Coral (`#D9534F`)**: Signals acute sleep deficits and elevated cortisol load.
* **Typography Hierarchy**:
  * **Interface & Editorial**: [Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans) in crisp sentence case with clean semantic weights.
  * **Telemetry & Numeric Stream**: [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) in tabular alignment (`tabular-nums`) to eliminate layout jitter.

---

## 2. Hero Interactive Sleep Demo Widget

Implemented in [`src/components/Landing/HeroSleepWidget.tsx`](file:///Users/aditya/Documents/TrackBite/src/components/Landing/HeroSleepWidget.tsx):

* **Sleep Range Slider**: Spans `4.0h` to `9.0h` with custom matte thumb and track.
* **Smooth Numerical Interpolation**: Numbers count smoothly up/down between targets using a `1 - Math.pow(1 - progress, 3)` cubic ease-out curve over 450–500ms.
* **Crossfading Explainer**: The physiological explanation smoothly fades opacity out and in over 220ms when crossing sleep thresholds:
  * `≥ 7.6h`: *"Baseline target: Optimal restorative sleep supports full insulin sensitivity and baseline recovery."*
  * `6.8h - 7.5h`: *"+80 kcal & +7g protein added: Mild recovery deficit detected; maintaining baseline glucose balance."*
  * `5.8h - 6.7h`: *"+160 kcal & +17g protein buffered: Sleep duration deficit; buffering afternoon cortisol & glycemic dips."*
  * `4.8h - 5.7h`: *"+240 kcal & +27g protein buffered to offset acute sleep deprivation and heightened cortisol."*
  * `< 4.8h`: *"+310 kcal & +35g protein buffered: Severe sleep deficit; prioritizing cellular tissue repair & leptin suppression."*
* **Automatic Demonstration on Load**:
  * On initial mount, the slider automatically animates from `8.2h` down to `5.2h` over 1.8 seconds so visitors immediately observe the dynamic target recalibration.
  * Any user interaction (click, touch, drag) immediately cancels the autoplay loop and grants manual control.
* **Motion Budget Discipline & Accessibility**:
  * Everywhere else on the landing page is completely still (no scroll-triggered fades, no card hover-lifts, no floating blobs).
  * Respects `prefers-reduced-motion: reduce`: automatically disables autoplay and removes animated counter transitions.

---

## 3. Stitch Project Integration

* Stitch Project: `projects/9673211937357303773`
* Generated Screen: `51b7f84e887e42bb95fa91aef4ad4917` (*"TrackBite — Wearable-Integrated Adaptive Nutrition"*)
* Design System Asset: `assets/53dd67630f884cde9f4214063b8910c1` (*"Clinical Telemetry"*)

---

## 4. Verification

* **Automated Typecheck & Build**: `npm run build` completed with zero TypeScript errors.
* **Development Server**: Running on `http://localhost:5173/` (HTTP 200 OK verified via curl).
