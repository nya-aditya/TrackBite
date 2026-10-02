import React from 'react';
import { useApp } from '../../context/AppContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 2000,
        backgroundColor: 'var(--surface-active)',
        border: '1px solid var(--border-focus)',
        borderRadius: '3px',
        padding: '0.75rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
      }}
    >
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-sage)',
        }}
      />
      <span
        className="font-interface"
        style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-chalk)' }}
      >
        {toastMessage}
      </span>
    </div>
  );
};
