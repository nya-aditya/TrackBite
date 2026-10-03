import React from 'react';
import { useApp, AppNavTab } from '../../context/AppContext';

export const NavTabs: React.FC = () => {
  const { activeNavTab, setActiveNavTab } = useApp();

  const tabs: { id: AppNavTab; label: string; badge?: string }[] = [
    { id: 'dashboard', label: 'Today Dashboard' },
    { id: 'logs', label: 'Meal Logs' },
    { id: 'activities', label: 'Activities & GPS', badge: 'Map' },
    { id: 'recipes', label: 'Smart Recipes', badge: 'AI Match' },
    { id: 'simulator', label: 'Fitbit Simulator' },
    { id: 'analytics', label: 'Telemetry Trends' },
  ];

  return (
    <nav
      style={{
        backgroundColor: 'var(--surface-recessed)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        overflowX: 'auto',
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeNavTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveNavTab(tab.id)}
            className="font-interface"
            style={{
              padding: '0.75rem 1rem',
              fontSize: '0.8125rem',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? 'var(--text-chalk)' : 'var(--text-muted)',
              borderBottom: isActive ? '2px solid var(--color-sage)' : '2px solid transparent',
              backgroundColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'color 150ms ease',
              whiteSpace: 'nowrap',
            }}
          >
            <span>{tab.label}</span>
            {tab.badge && (
              <span
                className="font-telemetry"
                style={{
                  fontSize: '0.625rem',
                  backgroundColor: 'var(--color-ochre-dim)',
                  color: 'var(--color-ochre)',
                  border: '1px solid var(--color-ochre-border)',
                  padding: '0.05rem 0.35rem',
                  borderRadius: '2px',
                }}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
