import React from 'react';
import { useApp } from '../../context/AppContext';

export const SmartNudgeBanner: React.FC = () => {
  const { snapshot, setActiveNavTab } = useApp();
  const { readiness, sleep, activity } = snapshot;

  const sleepHours = sleep.totalDurationMinutes / 60;

  let title = 'Clinical Readiness Coaching';
  let tip = 'Your physiology is in prime balance. Maintain balanced protein distribution every 3-4 hours.';
  let badge = 'OPTIMAL RECOVERY';
  let badgeColor = 'var(--color-sage)';

  if (readiness.score < 40) {
    title = 'Anti-Catabolic Protection Active';
    tip =
      'Readiness is suppressed. Prioritize easily digestible complete proteins (whey, egg whites, Greek yogurt) and 500ml extra water to mitigate systemic inflammation.';
    badge = 'RECOVERY DEFICIT';
    badgeColor = 'var(--color-coral)';
  } else if (activity.activeZoneMinutes > 45) {
    title = 'Glycogen Fueling Window';
    tip =
      `You logged ${activity.activeZoneMinutes} Active Zone Minutes. Replenish muscle glycogen with clean, complex carbohydrates (sweet potatoes, oats, jasmine rice).`;
    badge = 'HIGH STRAIN DETECTED';
    badgeColor = 'var(--color-ochre)';
  } else if (sleepHours < 6.0) {
    title = 'Circadian Glycemic Caution';
    tip =
      'Sleep deprivation elevates afternoon ghrelin. Focus on high-satiety fiber and protein to eliminate cravings and energy crashes.';
    badge = 'SLEEP RESTRICTION';
    badgeColor = 'var(--color-ochre)';
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--surface-recessed)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '4px',
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '4px',
            backgroundColor: 'var(--surface-active)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
          }}
        >
          🧠
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              className="font-interface"
              style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-chalk)' }}
            >
              {title}
            </span>
            <span
              className="font-telemetry"
              style={{
                fontSize: '0.625rem',
                color: badgeColor,
                border: `1px solid ${badgeColor}`,
                padding: '0.05rem 0.35rem',
                borderRadius: '2px',
              }}
            >
              {badge}
            </span>
          </div>
          <p
            className="font-interface"
            style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.2rem', lineHeight: 1.4 }}
          >
            {tip}
          </p>
        </div>
      </div>

      <button
        onClick={() => setActiveNavTab('recipes')}
        className="font-interface"
        style={{
          fontSize: '0.75rem',
          color: 'var(--text-chalk)',
          backgroundColor: 'var(--surface-active)',
          border: '1px solid var(--border-focus)',
          padding: '0.4rem 0.75rem',
          borderRadius: '3px',
          whiteSpace: 'nowrap',
          fontWeight: 600,
        }}
      >
        View Matched Recipes →
      </button>
    </div>
  );
};
