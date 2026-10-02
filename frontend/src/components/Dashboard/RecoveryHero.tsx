import React from 'react';
import { useApp } from '../../context/AppContext';
import { CircularProgress } from '../Common/CircularProgress';

export const RecoveryHero: React.FC = () => {
  const { snapshot, setActiveModal } = useApp();
  const { readiness, sleep, activity } = snapshot;

  const sleepHours = Math.round((sleep.totalDurationMinutes / 60) * 10) / 10;

  // Determine readiness theme color
  const readinessColor =
    readiness.score >= 70
      ? 'var(--color-sage)'
      : readiness.score >= 40
      ? 'var(--color-ochre)'
      : 'var(--color-coral)';

  return (
    <div
      style={{
        backgroundColor: 'var(--surface-panel)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '4px',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: readinessColor,
            }}
          />
          <h2
            className="font-interface"
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: 'var(--text-chalk)',
            }}
          >
            Fitbit Physiological Telemetry
          </h2>
        </div>
        <button
          onClick={() => setActiveModal('simulator')}
          className="font-interface"
          style={{
            fontSize: '0.75rem',
            color: 'var(--color-sage)',
            backgroundColor: 'var(--color-sage-dim)',
            border: '1px solid var(--color-sage-border)',
            padding: '0.25rem 0.6rem',
            borderRadius: '2px',
            fontWeight: 600,
          }}
        >
          Adjust Signals
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1.25rem',
          alignItems: 'center',
        }}
      >
        {/* Readiness Circular Metric */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            paddingRight: '1rem',
            borderRight: '1px solid var(--border-subtle)',
          }}
        >
          <CircularProgress
            percentage={readiness.score}
            size={96}
            strokeWidth={7}
            color={readinessColor}
          >
            <span
              className="font-telemetry"
              style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-chalk)' }}
            >
              {readiness.score}
            </span>
            <span
              className="font-interface"
              style={{ fontSize: '0.625rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}
            >
              {readiness.state}
            </span>
          </CircularProgress>

          <div>
            <div className="font-interface" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Daily Readiness
            </div>
            <div className="font-telemetry" style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
              HRV: <span style={{ color: 'var(--text-chalk)' }}>{readiness.hrvRmssd}ms</span>
            </div>
            <div className="font-telemetry" style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Resting HR: <span style={{ color: 'var(--text-chalk)' }}>{readiness.restingHeartRate} bpm</span>
            </div>
          </div>
        </div>

        {/* Sleep Duration & Score */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            paddingRight: '1rem',
            borderRight: '1px solid var(--border-subtle)',
          }}
        >
          <div className="font-interface" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Sleep Duration & Quality
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
            <span className="font-telemetry" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-chalk)' }}>
              {sleepHours}h
            </span>
            <span
              className="font-telemetry"
              style={{
                fontSize: '0.75rem',
                color: sleepHours >= 7.6 ? 'var(--color-sage)' : sleepHours >= 6.0 ? 'var(--color-ochre)' : 'var(--color-coral)',
              }}
            >
              ({sleep.efficiencyPercent}% efficiency)
            </span>
          </div>
          <div className="font-telemetry" style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Deep: {Math.round(sleep.deepMinutes / 60 * 10) / 10}h • REM: {Math.round(sleep.remMinutes / 60 * 10) / 10}h
          </div>
        </div>

        {/* Cardiovascular Load & AZM */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div className="font-interface" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Active Zone Minutes (AZM)
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
            <span className="font-telemetry" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-ochre)' }}>
              {activity.activeZoneMinutes}
            </span>
            <span className="font-interface" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              mins in cardio zone
            </span>
          </div>
          <div className="font-telemetry" style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Active Burn: <span style={{ color: 'var(--text-chalk)' }}>{activity.activeCalories} kcal</span> ({activity.steps.toLocaleString()} steps)
          </div>
        </div>
      </div>
    </div>
  );
};
