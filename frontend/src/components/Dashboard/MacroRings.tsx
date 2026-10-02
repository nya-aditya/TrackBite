import React from 'react';
import { useApp } from '../../context/AppContext';
import { CircularProgress } from '../Common/CircularProgress';

export const MacroRings: React.FC = () => {
  const { adaptiveTarget, consumedMacros, remainingMacros, user } = useApp();

  const caloriePct = Math.round((consumedMacros.calories / adaptiveTarget.adjustedCalories) * 100);
  const proteinPct = Math.round((consumedMacros.proteinG / adaptiveTarget.adjustedProteinG) * 100);
  const carbsPct = Math.round((consumedMacros.carbsG / adaptiveTarget.adjustedCarbsG) * 100);
  const fatPct = Math.round((consumedMacros.fatG / adaptiveTarget.adjustedFatG) * 100);

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
          Daily Fuel & Macro Adherence
        </h3>
        <span className="font-telemetry" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          {remainingMacros.calories} kcal remaining
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1.25rem',
          textAlign: 'center',
        }}
      >
        {/* Calories Ring */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <CircularProgress percentage={caloriePct} size={88} strokeWidth={6} color="var(--text-chalk)">
            <span className="font-telemetry" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-chalk)' }}>
              {Math.round(consumedMacros.calories)}
            </span>
            <span className="font-interface" style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
              / {adaptiveTarget.adjustedCalories}
            </span>
          </CircularProgress>
          <div>
            <div className="font-interface" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-chalk)' }}>
              Calories
            </div>
            <div className="font-telemetry" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              {caloriePct}% filled
            </div>
          </div>
        </div>

        {/* Protein Ring */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <CircularProgress percentage={proteinPct} size={88} strokeWidth={6} color="var(--color-sage)">
            <span className="font-telemetry" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-sage)' }}>
              {Math.round(consumedMacros.proteinG)}g
            </span>
            <span className="font-interface" style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
              / {adaptiveTarget.adjustedProteinG}g
            </span>
          </CircularProgress>
          <div>
            <div className="font-interface" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-sage)' }}>
              Protein
            </div>
            <div className="font-telemetry" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              {remainingMacros.proteinG}g left
            </div>
          </div>
        </div>

        {/* Carbs Ring */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <CircularProgress percentage={carbsPct} size={88} strokeWidth={6} color="var(--color-ochre)">
            <span className="font-telemetry" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-ochre)' }}>
              {Math.round(consumedMacros.carbsG)}g
            </span>
            <span className="font-interface" style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
              / {adaptiveTarget.adjustedCarbsG}g
            </span>
          </CircularProgress>
          <div>
            <div className="font-interface" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-ochre)' }}>
              Carbohydrates
            </div>
            <div className="font-telemetry" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              {remainingMacros.carbsG}g left
            </div>
          </div>
        </div>

        {/* Fats Ring */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <CircularProgress percentage={fatPct} size={88} strokeWidth={6} color="var(--text-muted)">
            <span className="font-telemetry" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-chalk)' }}>
              {Math.round(consumedMacros.fatG)}g
            </span>
            <span className="font-interface" style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
              / {adaptiveTarget.adjustedFatG}g
            </span>
          </CircularProgress>
          <div>
            <div className="font-interface" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-chalk)' }}>
              Fats
            </div>
            <div className="font-telemetry" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              {remainingMacros.fatG}g left
            </div>
          </div>
        </div>
      </div>

      {/* Hydration Bar */}
      <div
        style={{
          marginTop: '0.5rem',
          padding: '0.85rem 1rem',
          backgroundColor: 'var(--surface-recessed)',
          borderRadius: '3px',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.1rem' }}>💧</span>
          <div>
            <div className="font-interface" style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-chalk)' }}>
              Target Hydration
            </div>
            <div className="font-telemetry" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              {user.dailyWaterGoalMl} ml baseline ({user.dailyWaterGoalMl / 1000}L)
            </div>
          </div>
        </div>
        <div className="font-telemetry" style={{ fontSize: '0.8125rem', color: 'var(--color-sage)', fontWeight: 600 }}>
          Optimal Fluid Protocol
        </div>
      </div>
    </div>
  );
};
