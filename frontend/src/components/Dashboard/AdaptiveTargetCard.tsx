import React from 'react';
import { useApp } from '../../context/AppContext';

export const AdaptiveTargetCard: React.FC = () => {
  const { adaptiveTarget, user } = useApp();

  const calorieDelta = adaptiveTarget.adjustedCalories - adaptiveTarget.baselineCalories;
  const proteinDelta = adaptiveTarget.adjustedProteinG - adaptiveTarget.baselineProteinG;

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
        <div>
          <h3
            className="font-interface"
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: 'var(--text-chalk)',
            }}
          >
            Today's Adaptive Prescription
          </h3>
          <p className="font-interface" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Goal: <strong style={{ color: 'var(--text-chalk)' }}>{user.primaryGoal.replace('_', ' ').toUpperCase()}</strong> ({user.weightKg}kg • {user.activityLevel})
          </p>
        </div>

        {/* Dynamic Delta Badge */}
        <div
          className="font-telemetry"
          style={{
            fontSize: '0.8125rem',
            fontWeight: 600,
            padding: '0.35rem 0.75rem',
            borderRadius: '2px',
            backgroundColor:
              calorieDelta > 0
                ? 'var(--color-ochre-dim)'
                : calorieDelta < 0
                ? 'var(--color-coral-dim)'
                : 'var(--color-sage-dim)',
            color:
              calorieDelta > 0
                ? 'var(--color-ochre)'
                : calorieDelta < 0
                ? 'var(--color-coral)'
                : 'var(--color-sage)',
            border: `1px solid ${
              calorieDelta > 0
                ? 'var(--color-ochre-border)'
                : calorieDelta < 0
                ? 'var(--color-coral-border)'
                : 'var(--color-sage-border)'
            }`,
          }}
        >
          {calorieDelta >= 0 ? `+${calorieDelta}` : calorieDelta} kcal offset ({proteinDelta >= 0 ? `+${proteinDelta}` : proteinDelta}g protein)
        </div>
      </div>

      {/* Rationale String */}
      <div
        style={{
          backgroundColor: 'var(--surface-recessed)',
          borderLeft: '3px solid var(--color-sage)',
          padding: '0.75rem 1rem',
          borderRadius: '0 3px 3px 0',
        }}
      >
        <span className="font-interface" style={{ fontSize: '0.8125rem', color: 'var(--text-chalk)', lineHeight: 1.5 }}>
          💡 {adaptiveTarget.explanation}
        </span>
      </div>

      {/* Target Breakdown Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.75rem',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--surface-recessed)',
            padding: '0.85rem',
            borderRadius: '3px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div className="font-interface" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
            CALORIES
          </div>
          <div className="font-telemetry" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-chalk)' }}>
            {adaptiveTarget.adjustedCalories}
          </div>
          <div className="font-telemetry" style={{ fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
            Base: {adaptiveTarget.baselineCalories}
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--surface-recessed)',
            padding: '0.85rem',
            borderRadius: '3px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div className="font-interface" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
            PROTEIN
          </div>
          <div className="font-telemetry" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-sage)' }}>
            {adaptiveTarget.adjustedProteinG}g
          </div>
          <div className="font-telemetry" style={{ fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
            Base: {adaptiveTarget.baselineProteinG}g
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--surface-recessed)',
            padding: '0.85rem',
            borderRadius: '3px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div className="font-interface" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
            CARBOHYDRATES
          </div>
          <div className="font-telemetry" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-ochre)' }}>
            {adaptiveTarget.adjustedCarbsG}g
          </div>
          <div className="font-telemetry" style={{ fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
            Base: {adaptiveTarget.baselineCarbsG}g
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--surface-recessed)',
            padding: '0.85rem',
            borderRadius: '3px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div className="font-interface" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
            FATS
          </div>
          <div className="font-telemetry" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-chalk)' }}>
            {adaptiveTarget.adjustedFatG}g
          </div>
          <div className="font-telemetry" style={{ fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
            Base: {adaptiveTarget.baselineFatG}g
          </div>
        </div>
      </div>
    </div>
  );
};
