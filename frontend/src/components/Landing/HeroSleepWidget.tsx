import React, { useState, useEffect, useRef } from 'react';

interface SleepAdaptation {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  explainer: string;
  statusTag: string;
  stateType: 'optimal' | 'moderate' | 'severe';
}

function calculateSleepImpact(hours: number): SleepAdaptation {
  // Baseline metabolic profile for a 75kg active individual: ~2,400 kcal
  // 8.2h sleep -> 2,400 kcal (175g P / 270g C / 65g F)
  // When sleep is degraded:
  // - Cortisol increases -> protein requirement goes up by 15-25g to mitigate muscle catabolism
  // - Ghrelin increases & insulin sensitivity decreases -> caloric buffer of +120 to +280 kcal added
  if (hours >= 7.6) {
    return {
      calories: 2400,
      proteinG: 175,
      carbsG: 270,
      fatG: 65,
      explainer: 'Baseline target: Optimal restorative sleep supports full insulin sensitivity and baseline recovery.',
      statusTag: 'Optimal Recovery',
      stateType: 'optimal',
    };
  } else if (hours >= 6.8) {
    return {
      calories: 2480,
      proteinG: 182,
      carbsG: 275,
      fatG: 68,
      explainer: '+80 kcal & +7g protein added: Mild recovery deficit detected; maintaining baseline glucose balance.',
      statusTag: 'Nominal Reserve',
      stateType: 'optimal',
    };
  } else if (hours >= 5.8) {
    return {
      calories: 2560,
      proteinG: 192,
      carbsG: 280,
      fatG: 70,
      explainer: '+160 kcal & +17g protein buffered: Sleep duration deficit; buffering afternoon cortisol & glycemic dips.',
      statusTag: 'Elevated Strain',
      stateType: 'moderate',
    };
  } else if (hours >= 4.8) {
    return {
      calories: 2640,
      proteinG: 202,
      carbsG: 285,
      fatG: 72,
      explainer: '+240 kcal & +27g protein buffered to offset acute sleep deprivation and heightened cortisol.',
      statusTag: 'High Cortisol Load',
      stateType: 'severe',
    };
  } else {
    return {
      calories: 2710,
      proteinG: 210,
      carbsG: 290,
      fatG: 74,
      explainer: '+310 kcal & +35g protein buffered: Severe sleep deficit; prioritizing cellular tissue repair & leptin suppression.',
      statusTag: 'Critical Sleep Debt',
      stateType: 'severe',
    };
  }
}

export const HeroSleepWidget: React.FC = () => {
  const [sleepHours, setSleepHours] = useState<number>(8.2);
  const [displayedCalories, setDisplayedCalories] = useState<number>(2400);
  const [displayedProtein, setDisplayedProtein] = useState<number>(175);
  const [displayedCarbs, setDisplayedCarbs] = useState<number>(270);
  const [displayedFat, setDisplayedFat] = useState<number>(65);

  const [activeExplainer, setActiveExplainer] = useState<string>(
    'Baseline target: Optimal restorative sleep supports full insulin sensitivity and baseline recovery.'
  );
  const [explainerOpacity, setExplainerOpacity] = useState<number>(1);
  const [userHasInteracted, setUserHasInteracted] = useState<boolean>(false);

  const currentImpact = calculateSleepImpact(sleepHours);
  const animFrameRef = useRef<number | null>(null);
  const autoPlayTimeoutRef = useRef<number | null>(null);
  const autoPlayAnimRef = useRef<number | null>(null);

  // Smoothly interpolate numeric telemetry
  const animateValuesTo = (
    targetKcal: number,
    targetP: number,
    targetC: number,
    targetF: number,
    durationMs = 500
  ) => {
    // Check reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayedCalories(targetKcal);
      setDisplayedProtein(targetP);
      setDisplayedCarbs(targetC);
      setDisplayedFat(targetF);
      return;
    }

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    const startKcal = displayedCalories;
    const startP = displayedProtein;
    const startC = displayedCarbs;
    const startF = displayedFat;
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      setDisplayedCalories(Math.round(startKcal + (targetKcal - startKcal) * ease));
      setDisplayedProtein(Math.round(startP + (targetP - startP) * ease));
      setDisplayedCarbs(Math.round(startC + (targetC - startC) * ease));
      setDisplayedFat(Math.round(startF + (targetF - startF) * ease));

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  };

  // Crossfade explainer when impact text changes
  useEffect(() => {
    if (activeExplainer !== currentImpact.explainer) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setActiveExplainer(currentImpact.explainer);
        return;
      }

      setExplainerOpacity(0);
      const timeout = setTimeout(() => {
        setActiveExplainer(currentImpact.explainer);
        setExplainerOpacity(1);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [currentImpact.explainer, activeExplainer]);

  // Handle manual slider move
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserHasInteracted(true);
    if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);
    if (autoPlayAnimRef.current) cancelAnimationFrame(autoPlayAnimRef.current);

    const val = parseFloat(e.target.value);
    setSleepHours(val);
    const newImpact = calculateSleepImpact(val);
    animateValuesTo(newImpact.calories, newImpact.proteinG, newImpact.carbsG, newImpact.fatG, 450);
  };

  // Auto-play on mount: moves from 8.2h down to 5.2h once, then resets to idle
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    autoPlayTimeoutRef.current = window.setTimeout(() => {
      if (userHasInteracted) return;

      const startHours = 8.2;
      const endHours = 5.2;
      const duration = 1800; // 1.8s deliberate movement
      const startTime = performance.now();

      const runAutoPlay = (now: number) => {
        if (userHasInteracted) return;
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quadratic for natural demonstration deceleration
        const ease = 1 - (1 - progress) * (1 - progress);
        const currentH = parseFloat((startHours - (startHours - endHours) * ease).toFixed(1));

        setSleepHours(currentH);
        const impact = calculateSleepImpact(currentH);
        setDisplayedCalories(impact.calories);
        setDisplayedProtein(impact.proteinG);
        setDisplayedCarbs(impact.carbsG);
        setDisplayedFat(impact.fatG);

        if (progress < 1) {
          autoPlayAnimRef.current = requestAnimationFrame(runAutoPlay);
        }
      };

      autoPlayAnimRef.current = requestAnimationFrame(runAutoPlay);
    }, 700);

    return () => {
      if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);
      if (autoPlayAnimRef.current) cancelAnimationFrame(autoPlayAnimRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [userHasInteracted]);

  const stateColor =
    currentImpact.stateType === 'optimal'
      ? 'var(--color-sage)'
      : currentImpact.stateType === 'moderate'
      ? 'var(--color-ochre)'
      : 'var(--color-coral)';

  const stateBg =
    currentImpact.stateType === 'optimal'
      ? 'var(--color-sage-dim)'
      : currentImpact.stateType === 'moderate'
      ? 'var(--color-ochre-dim)'
      : 'var(--color-coral-dim)';

  const stateBorder =
    currentImpact.stateType === 'optimal'
      ? 'var(--color-sage-border)'
      : currentImpact.stateType === 'moderate'
      ? 'var(--color-ochre-border)'
      : 'var(--color-coral-border)';

  return (
    <div
      style={{
        backgroundColor: 'var(--surface-panel)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '4px',
        padding: '1.75rem',
        width: '100%',
        maxWidth: '520px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      {/* Device & Status Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.875rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-sage)',
              display: 'inline-block',
            }}
          />
          <span
            className="font-interface"
            style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-chalk)' }}
          >
            Fitbit Charge 6 Synced
          </span>
        </div>
        <span
          className="font-telemetry"
          style={{
            fontSize: '0.6875rem',
            padding: '0.2rem 0.5rem',
            borderRadius: '2px',
            backgroundColor: stateBg,
            color: stateColor,
            border: `1px solid ${stateBorder}`,
            letterSpacing: '0.04em',
          }}
        >
          {currentImpact.statusTag}
        </span>
      </div>

      {/* Interactive Sleep Slider Control */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <label
            htmlFor="hero-sleep-slider"
            className="font-interface"
            style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}
          >
            Last night's sleep
          </label>
          <span
            className="font-telemetry"
            style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: stateColor,
            }}
          >
            {sleepHours.toFixed(1)}
            <span style={{ fontSize: '0.8125rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '2px' }}>
              h
            </span>
          </span>
        </div>

        <input
          id="hero-sleep-slider"
          type="range"
          min="4.0"
          max="9.0"
          step="0.1"
          value={sleepHours}
          onChange={handleSliderChange}
          className={`telemetry-slider ${
            currentImpact.stateType === 'severe'
              ? 'severe-deficit'
              : currentImpact.stateType === 'moderate'
              ? 'deficit'
              : ''
          }`}
          aria-label="Last night's sleep in hours"
        />

        <div
          className="font-telemetry"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.6875rem',
            color: 'var(--text-dim)',
          }}
        >
          <span>4.0h (Severe Deficit)</span>
          <span>6.5h</span>
          <span>9.0h (Optimal)</span>
        </div>
      </div>

      {/* Live Calorie & Macro Readout Matrix */}
      <div
        style={{
          backgroundColor: 'var(--surface-recessed)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '3px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span className="font-interface" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Calculated Metabolic Target
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
            <span
              className="font-telemetry"
              style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                color: 'var(--text-chalk)',
                lineHeight: 1,
              }}
            >
              {displayedCalories.toLocaleString()}
            </span>
            <span
              className="font-telemetry"
              style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}
            >
              kcal
            </span>
          </div>
        </div>

        {/* Macro Partition Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.5rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <span className="font-interface" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', display: 'block' }}>
              Protein
            </span>
            <span className="font-telemetry" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-sage)' }}>
              {displayedProtein}g
            </span>
          </div>
          <div>
            <span className="font-interface" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', display: 'block' }}>
              Carbs
            </span>
            <span className="font-telemetry" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-ochre)' }}>
              {displayedCarbs}g
            </span>
          </div>
          <div>
            <span className="font-interface" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', display: 'block' }}>
              Fats
            </span>
            <span className="font-telemetry" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              {displayedFat}g
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic One-Line Physiological Explainer Banner (Crossfading) */}
      <div
        style={{
          borderLeft: `3px solid ${stateColor}`,
          backgroundColor: 'var(--surface-recessed)',
          padding: '0.75rem 1rem',
          borderRadius: '0 3px 3px 0',
          minHeight: '3.75rem',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <p
          className="font-interface"
          style={{
            fontSize: '0.8125rem',
            lineHeight: 1.45,
            color: 'var(--text-chalk)',
            opacity: explainerOpacity,
            transition: 'opacity 220ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {activeExplainer}
        </p>
      </div>
    </div>
  );
};
