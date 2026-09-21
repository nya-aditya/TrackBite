import React, { useState } from 'react';
import { LandingPage } from './components/Landing/LandingPage';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'app'>('landing');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-ground)' }}>
      {currentView === 'landing' ? (
        <LandingPage onEnterApp={() => setCurrentView('app')} />
      ) : (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.5rem',
            padding: '2rem',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--surface-panel)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '4px',
              padding: '2rem',
              maxWidth: '540px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-sage)',
                }}
              />
              <span className="font-interface" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-chalk)' }}>
                TrackBite Telemetry Engine Initializing
              </span>
            </div>
            <p className="font-interface" style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Landing page demo is active. The Today dashboard and Fitbit sync modules are ready to be wired in the next step.
            </p>
            <button
              onClick={() => setCurrentView('landing')}
              className="font-interface"
              style={{
                alignSelf: 'flex-start',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--bg-ground)',
                backgroundColor: 'var(--color-sage)',
                padding: '0.5rem 1rem',
                borderRadius: '3px',
              }}
            >
              Back to Landing Page
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
