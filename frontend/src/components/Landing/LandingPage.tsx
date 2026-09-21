import React from 'react';
import { HeroSleepWidget } from './HeroSleepWidget';

interface LandingPageProps {
  onEnterApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-ground)',
        color: 'var(--text-chalk)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Header */}
      <header
        style={{
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-ground)',
          padding: '1.25rem 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span
              className="font-interface"
              style={{
                fontSize: '1.125rem',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--text-chalk)',
              }}
            >
              TrackBite
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.2rem 0.6rem',
                backgroundColor: 'var(--surface-recessed)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '2px',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-sage)',
                }}
              />
              <span
                className="font-telemetry"
                style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}
              >
                Fitbit Web API Active
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={onEnterApp}
              className="font-interface"
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--text-chalk)',
                padding: '0.5rem 0.875rem',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--surface-panel)',
                borderRadius: '3px',
              }}
            >
              Explore Dashboard
            </button>
            <button
              onClick={onEnterApp}
              className="font-interface"
              style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--bg-ground)',
                backgroundColor: 'var(--color-sage)',
                padding: '0.5rem 1rem',
                borderRadius: '3px',
              }}
            >
              Connect Fitbit
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* HERO SECTION */}
        <section
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            padding: '5rem 2rem 4.5rem 2rem',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
              gap: '4rem',
              alignItems: 'center',
            }}
          >
            {/* Left Copy Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  className="font-telemetry"
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-sage)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  Physiological Nutrition Telemetry
                </span>
              </div>

              <h1
                className="font-interface"
                style={{
                  fontSize: '2.75rem',
                  fontWeight: 600,
                  lineHeight: 1.15,
                  letterSpacing: '-0.03em',
                  color: 'var(--text-chalk)',
                }}
              >
                Nutrition calibrated to your biometrics, not a generic calorie formula.
              </h1>

              <p
                className="font-interface"
                style={{
                  fontSize: '1.0625rem',
                  lineHeight: 1.6,
                  color: 'var(--text-muted)',
                  maxWidth: '540px',
                }}
              >
                TrackBite synchronizes directly with your Fitbit Daily Readiness Score, Sleep Stages, and Active Zone Minutes to recalibrate your daily macronutrient requirements in real time.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingTop: '0.5rem' }}>
                <button
                  onClick={onEnterApp}
                  className="font-interface"
                  style={{
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    color: 'var(--bg-ground)',
                    backgroundColor: 'var(--color-sage)',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '3px',
                  }}
                >
                  Connect Fitbit
                </button>
                <button
                  onClick={onEnterApp}
                  className="font-interface"
                  style={{
                    fontSize: '0.9375rem',
                    fontWeight: 500,
                    color: 'var(--text-chalk)',
                    backgroundColor: 'var(--surface-panel)',
                    border: '1px solid var(--border-subtle)',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '3px',
                  }}
                >
                  Open Adaptive Console
                </button>
              </div>

              {/* Hardware Spec Line */}
              <div
                className="font-telemetry"
                style={{
                  paddingTop: '1.5rem',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  gap: '1.5rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-dim)',
                }}
              >
                <span>Charge 6 · Sense 2 · Versa 4 · Inspire 3</span>
                <span>Sub-150ms Telemetry Pipeline</span>
              </div>
            </div>

            {/* Right Column: Hero Interactive Widget */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <HeroSleepWidget />
            </div>
          </div>
        </section>

        {/* SECTION: THE BIOMETRIC FEEDBACK LOOP */}
        <section
          style={{
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--surface-panel)',
            padding: '4.5rem 2rem',
          }}
        >
          <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span
                className="font-telemetry"
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-ochre)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                Adaptive Calibration Engine
              </span>
              <h2
                className="font-interface"
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  color: 'var(--text-chalk)',
                }}
              >
                How your Fitbit telemetry stream reshapes your metabolic day
              </h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1.5rem',
              }}
            >
              {/* Pillar 1: Readiness Score */}
              <div
                style={{
                  backgroundColor: 'var(--bg-ground)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '3px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span className="font-interface" style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-chalk)' }}>
                    Daily Readiness Score
                  </span>
                  <span
                    className="font-telemetry"
                    style={{ fontSize: '0.6875rem', color: 'var(--color-sage)' }}
                  >
                    0–100 Scale
                  </span>
                </div>
                <p
                  className="font-interface"
                  style={{ fontSize: '0.875rem', lineHeight: 1.55, color: 'var(--text-muted)' }}
                >
                  When HRV baseline drops or resting HR remains elevated, TrackBite reduces high-glycemic carb load by 15% and increases leucine-rich protein targets to accelerate tissue repair without gastrointestinal strain.
                </p>
                <div
                  className="font-telemetry"
                  style={{
                    fontSize: '0.6875rem',
                    color: 'var(--text-dim)',
                    marginTop: 'auto',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-subtle)',
                  }}
                >
                  Autonomic nervous system recovery index
                </div>
              </div>

              {/* Pillar 2: Sleep Stages */}
              <div
                style={{
                  backgroundColor: 'var(--bg-ground)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '3px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span className="font-interface" style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-chalk)' }}>
                    Sleep Architecture (Deep & REM)
                  </span>
                  <span
                    className="font-telemetry"
                    style={{ fontSize: '0.6875rem', color: 'var(--color-ochre)' }}
                  >
                    Stage Fidelity
                  </span>
                </div>
                <p
                  className="font-interface"
                  style={{ fontSize: '0.875rem', lineHeight: 1.55, color: 'var(--text-muted)' }}
                >
                  Sleep fragmentation lowers daytime leptin and triggers ghrelin elevation by up to 24%. TrackBite accounts for hormonal hunger signaling, automatically shifting fiber targets to stabilize insulin responses.
                </p>
                <div
                  className="font-telemetry"
                  style={{
                    fontSize: '0.6875rem',
                    color: 'var(--text-dim)',
                    marginTop: 'auto',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-subtle)',
                  }}
                >
                  Deep %, REM %, wake restlessness coefficient
                </div>
              </div>

              {/* Pillar 3: Active Zone Minutes */}
              <div
                style={{
                  backgroundColor: 'var(--bg-ground)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '3px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span className="font-interface" style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-chalk)' }}>
                    Active Zone Minutes (AZM)
                  </span>
                  <span
                    className="font-telemetry"
                    style={{ fontSize: '0.6875rem', color: 'var(--color-coral)' }}
                  >
                    Cardio & Peak
                  </span>
                </div>
                <p
                  className="font-interface"
                  style={{ fontSize: '0.875rem', lineHeight: 1.55, color: 'var(--text-muted)' }}
                >
                  Tracks glycogen expenditure across Fat Burn, Cardio, and Peak heart rate zones, calculating precise carbohydrate replenishment grams to prevent metabolic depletion without surplus fat storage.
                </p>
                <div
                  className="font-telemetry"
                  style={{
                    fontSize: '0.6875rem',
                    color: 'var(--text-dim)',
                    marginTop: 'auto',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-subtle)',
                  }}
                >
                  Targeted carbohydrate refeeding formula
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: PRECISION INPUT LOGGING */}
        <section
          style={{
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-ground)',
            padding: '4.5rem 2rem',
          }}
        >
          <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span
                className="font-telemetry"
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-sage)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                Input Telemetry
              </span>
              <h2
                className="font-interface"
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  color: 'var(--text-chalk)',
                }}
              >
                Three high-fidelity intake capture methods
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
              {/* Method 1 */}
              <div
                style={{
                  backgroundColor: 'var(--surface-panel)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '3px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <span className="font-interface" style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-chalk)' }}>
                  Computer Vision Photo Analysis
                </span>
                <p className="font-interface" style={{ fontSize: '0.875rem', lineHeight: 1.55, color: 'var(--text-muted)' }}>
                  Upload a meal image for multi-item volumetric detection with precision bounding boxes, confidence scoring, and interactive gram adjustments.
                </p>
              </div>

              {/* Method 2 */}
              <div
                style={{
                  backgroundColor: 'var(--surface-panel)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '3px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <span className="font-interface" style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-chalk)' }}>
                  Sub-Second Barcode Scanner
                </span>
                <p className="font-interface" style={{ fontSize: '0.875rem', lineHeight: 1.55, color: 'var(--text-muted)' }}>
                  Instant camera viewport scanning cross-referencing verified USDA nutritional databases for packaged goods with exact macro breakdown.
                </p>
              </div>

              {/* Method 3 */}
              <div
                style={{
                  backgroundColor: 'var(--surface-panel)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '3px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <span className="font-interface" style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-chalk)' }}>
                  Macro-Gap Recipe Synthesis
                </span>
                <p className="font-interface" style={{ fontSize: '0.875rem', lineHeight: 1.55, color: 'var(--text-muted)' }}>
                  Instead of guessing dinner portions, TrackBite ranks recipes by how cleanly they satisfy your remaining protein, carbohydrate, and fat deficits.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: DATA INTEGRATION MATRIX */}
        <section
          style={{
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--surface-recessed)',
            padding: '3rem 2rem',
          }}
        >
          <div
            style={{
              maxWidth: '1240px',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '2rem',
            }}
          >
            <div>
              <span className="font-telemetry" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-chalk)' }}>
                15 min
              </span>
              <span className="font-interface" style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Fitbit polling frequency
              </span>
            </div>
            <div>
              <span className="font-telemetry" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-chalk)' }}>
                99.8%
              </span>
              <span className="font-interface" style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Sync telemetry fidelity
              </span>
            </div>
            <div>
              <span className="font-telemetry" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-chalk)' }}>
                100%
              </span>
              <span className="font-interface" style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Local client-side caching
              </span>
            </div>
            <div>
              <span className="font-telemetry" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-chalk)' }}>
                0ms
              </span>
              <span className="font-interface" style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Target recalibration latency
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-ground)',
          padding: '2.5rem 2rem',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span className="font-interface" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-chalk)' }}>
              TrackBite
            </span>
            <div className="font-interface" style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              <span>Fitbit Web API Integration</span>
              <span>Metabolic Model Docs</span>
              <span>Privacy & Security</span>
            </div>
          </div>

          <p
            className="font-interface"
            style={{ fontSize: '0.75rem', lineHeight: 1.5, color: 'var(--text-dim)' }}
          >
            TrackBite is an independent metabolic analytics and adaptive nutrition application. TrackBite is not affiliated with, endorsed by, or sponsored by Fitbit LLC or Google LLC. Fitbit is a registered trademark of Fitbit LLC.
          </p>
        </div>
      </footer>
    </div>
  );
};
