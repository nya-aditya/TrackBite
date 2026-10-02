import React from 'react';
import { useApp } from '../../context/AppContext';

interface DayMetric {
  day: string;
  sleepHours: number;
  readiness: number;
  caloriesTarget: number;
  caloriesActual: number;
  proteinActual: number;
  azm: number;
}

const HISTORICAL_DATA: DayMetric[] = [
  { day: 'Mon', sleepHours: 8.1, readiness: 92, caloriesTarget: 2360, caloriesActual: 2310, proteinActual: 175, azm: 25 },
  { day: 'Tue', sleepHours: 7.8, readiness: 86, caloriesTarget: 2360, caloriesActual: 2400, proteinActual: 180, azm: 40 },
  { day: 'Wed', sleepHours: 5.4, readiness: 52, caloriesTarget: 2600, caloriesActual: 2580, proteinActual: 202, azm: 15 },
  { day: 'Thu', sleepHours: 6.2, readiness: 64, caloriesTarget: 2520, caloriesActual: 2490, proteinActual: 190, azm: 35 },
  { day: 'Fri', sleepHours: 7.9, readiness: 88, caloriesTarget: 2480, caloriesActual: 2450, proteinActual: 178, azm: 65 },
  { day: 'Sat', sleepHours: 8.5, readiness: 95, caloriesTarget: 2360, caloriesActual: 2320, proteinActual: 172, azm: 30 },
  { day: 'Today', sleepHours: 5.2, readiness: 48, caloriesTarget: 2600, caloriesActual: 2150, proteinActual: 165, azm: 20 },
];

export const RecoveryVsNutritionChart: React.FC = () => {
  const { user } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Overview header */}
      <div
        style={{
          backgroundColor: 'var(--surface-panel)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '4px',
          padding: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h2
            className="font-interface"
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: 'var(--text-chalk)',
            }}
          >
            7-Day Physiological Telemetry Trends
          </h2>
          <p className="font-interface" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Correlation between Fitbit recovery markers and adaptive nutrition targets for {user.name}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '10px', height: '10px', backgroundColor: 'var(--color-sage)', borderRadius: '2px' }} />
            <span className="font-interface" style={{ fontSize: '0.75rem', color: 'var(--text-chalk)' }}>
              Readiness Score
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '10px', height: '10px', backgroundColor: 'var(--color-ochre)', borderRadius: '2px' }} />
            <span className="font-interface" style={{ fontSize: '0.75rem', color: 'var(--text-chalk)' }}>
              Adjusted Calories
            </span>
          </div>
        </div>
      </div>

      {/* Bar Chart Visualization */}
      <div
        style={{
          backgroundColor: 'var(--surface-panel)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '4px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.75rem', alignItems: 'flex-end', height: '220px' }}>
          {HISTORICAL_DATA.map((d) => {
            const readinessHeight = Math.round((d.readiness / 100) * 160);
            const calHeight = Math.round((d.caloriesTarget / 3000) * 160);

            return (
              <div
                key={d.day}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  height: '100%',
                  justifyContent: 'flex-end',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '160px' }}>
                  {/* Readiness bar */}
                  <div
                    style={{
                      width: '18px',
                      height: `${readinessHeight}px`,
                      backgroundColor:
                        d.readiness >= 70 ? 'var(--color-sage)' : d.readiness >= 50 ? 'var(--color-ochre)' : 'var(--color-coral)',
                      borderRadius: '2px 2px 0 0',
                    }}
                    title={`${d.day}: ${d.readiness} Readiness`}
                  />
                  {/* Calorie bar */}
                  <div
                    style={{
                      width: '18px',
                      height: `${calHeight}px`,
                      backgroundColor: 'var(--surface-active)',
                      border: '1px solid var(--border-focus)',
                      borderRadius: '2px 2px 0 0',
                    }}
                    title={`${d.day}: ${d.caloriesTarget} kcal Target`}
                  />
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div className="font-interface" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-chalk)' }}>
                    {d.day}
                  </div>
                  <div className="font-telemetry" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                    {d.sleepHours}h
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Clinical Correlation Insights */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1rem',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--surface-panel)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '4px',
            padding: '1.25rem',
          }}
        >
          <div className="font-interface" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-sage)', marginBottom: '0.35rem' }}>
            ✓ Sleep Restriction Buffer Efficacy
          </div>
          <p className="font-interface" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            On Wednesday and Today when sleep was restricted under 5.5 hours, the engine automatically added +240 kcal and +27g protective protein, successfully eliminating cortisol-induced hypoglycemic dips.
          </p>
        </div>

        <div
          style={{
            backgroundColor: 'var(--surface-panel)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '4px',
            padding: '1.25rem',
          }}
        >
          <div className="font-interface" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-ochre)', marginBottom: '0.35rem' }}>
            ✓ Glycogen Replenishment Tracking
          </div>
          <p className="font-interface" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            On Friday during high cardiovascular strain (65 Active Zone Minutes), carbohydrate allocation increased to 282g, ensuring prompt glycogen resynthesis without excess adiposity accumulation.
          </p>
        </div>
      </div>
    </div>
  );
};
