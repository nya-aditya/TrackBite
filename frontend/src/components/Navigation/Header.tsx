import React from 'react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  onBackToLanding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onBackToLanding }) => {
  const { device, snapshot, setActiveModal, user } = useApp();

  return (
    <header
      style={{
        backgroundColor: 'var(--surface-panel)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '0.875rem 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Brand & Landing Link */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              backgroundColor: 'var(--surface-recessed)',
              border: '1px solid var(--border-focus)',
              borderRadius: '3px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-sage)',
              }}
            />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                className="font-interface"
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  color: 'var(--text-chalk)',
                  letterSpacing: '-0.02em',
                }}
              >
                TrackBite
              </span>
              <span
                className="font-telemetry"
                style={{
                  fontSize: '0.6875rem',
                  color: 'var(--color-sage)',
                  backgroundColor: 'var(--color-sage-dim)',
                  border: '1px solid var(--color-sage-border)',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '2px',
                }}
              >
                CLINICAL TELEMETRY
              </span>
            </div>
          </div>
        </div>

        {onBackToLanding && (
          <button
            onClick={onBackToLanding}
            className="font-interface"
            style={{
              fontSize: '0.8125rem',
              color: 'var(--text-muted)',
              padding: '0.25rem 0.5rem',
              borderRadius: '2px',
              border: '1px solid transparent',
              transition: 'all 150ms ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-chalk)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            ← Landing Page
          </button>
        )}
      </div>

      {/* Wearable Status & Quick Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Fitbit connection status badge */}
        <button
          onClick={() => setActiveModal('device_manager')}
          style={{
            backgroundColor: 'var(--surface-recessed)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '3px',
            padding: '0.4rem 0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
          }}
          title="Click to manage wearable connection"
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: device.isConnected ? 'var(--color-sage)' : 'var(--color-coral)',
            }}
          />
          <span className="font-interface" style={{ fontSize: '0.8125rem', color: 'var(--text-chalk)', fontWeight: 500 }}>
            {device.modelName}
          </span>
          <span className="font-telemetry" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {device.batteryPercent}% • {snapshot.readiness.score} Readiness
          </span>
        </button>

        {/* Live Simulator Button */}
        <button
          onClick={() => setActiveModal('simulator')}
          className="font-interface"
          style={{
            backgroundColor: 'var(--surface-active)',
            border: '1px solid var(--border-focus)',
            color: 'var(--color-ochre)',
            fontSize: '0.8125rem',
            fontWeight: 600,
            padding: '0.4rem 0.85rem',
            borderRadius: '3px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <span>⚡</span>
          <span>Fitbit Simulator</span>
        </button>

        {/* Quick Log Meal Dropdown / Modal Trigger */}
        <button
          onClick={() => setActiveModal('quick_add')}
          className="font-interface"
          style={{
            backgroundColor: 'var(--color-sage)',
            color: 'var(--bg-ground)',
            fontSize: '0.8125rem',
            fontWeight: 600,
            padding: '0.4rem 0.9rem',
            borderRadius: '3px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          <span>+</span>
          <span>Log Meal</span>
        </button>

        {/* User Mini Profile */}
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'var(--surface-recessed)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--text-chalk)',
          }}
          title={`${user.name} (${user.primaryGoal})`}
        >
          {user.name.split(' ').map((n) => n[0]).join('')}
        </div>
      </div>
    </header>
  );
};
