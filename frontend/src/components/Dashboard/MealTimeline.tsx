import React from 'react';
import { useApp } from '../../context/AppContext';
import { MealType } from '../../types/nutrition';

const MEAL_SLOTS: { type: MealType; label: string; icon: string }[] = [
  { type: 'BREAKFAST', label: 'Breakfast', icon: '🍳' },
  { type: 'LUNCH', label: 'Lunch', icon: '🥗' },
  { type: 'DINNER', label: 'Dinner', icon: '🥩' },
  { type: 'SNACK', label: 'Snacks & Fuel', icon: '🍎' },
];

export const MealTimeline: React.FC = () => {
  const { mealLogs, deleteMealLog, setActiveModal } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLogs = mealLogs.filter((log) => log.date === todayStr);

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
            Today's Food Intake Timeline
          </h3>
          <p className="font-interface" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Logged meals and macronutrient distributions
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setActiveModal('photo_log')}
            className="font-interface"
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-chalk)',
              backgroundColor: 'var(--surface-recessed)',
              border: '1px solid var(--border-subtle)',
              padding: '0.35rem 0.65rem',
              borderRadius: '2px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <span>📸</span>
            <span>AI Photo</span>
          </button>
          <button
            onClick={() => setActiveModal('barcode_log')}
            className="font-interface"
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-chalk)',
              backgroundColor: 'var(--surface-recessed)',
              border: '1px solid var(--border-subtle)',
              padding: '0.35rem 0.65rem',
              borderRadius: '2px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <span>🏷️</span>
            <span>Barcode</span>
          </button>
          <button
            onClick={() => setActiveModal('manual_search')}
            className="font-interface"
            style={{
              fontSize: '0.75rem',
              color: 'var(--color-sage)',
              backgroundColor: 'var(--color-sage-dim)',
              border: '1px solid var(--color-sage-border)',
              padding: '0.35rem 0.75rem',
              borderRadius: '2px',
              fontWeight: 600,
            }}
          >
            + Search Foods
          </button>
        </div>
      </div>

      {/* Slots */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {MEAL_SLOTS.map((slot) => {
          const logsForSlot = todayLogs.filter((l) => l.mealType === slot.type);
          const totalSlotCalories = logsForSlot.reduce((sum, l) => sum + l.totalCalories, 0);
          const totalSlotProtein = logsForSlot.reduce((sum, l) => sum + l.totalProteinG, 0);

          return (
            <div
              key={slot.type}
              style={{
                backgroundColor: 'var(--surface-recessed)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '3px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              {/* Slot Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>{slot.icon}</span>
                  <span
                    className="font-interface"
                    style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-chalk)' }}
                  >
                    {slot.label}
                  </span>
                  {logsForSlot.length > 0 && (
                    <span className="font-telemetry" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      • {Math.round(totalSlotCalories)} kcal ({Math.round(totalSlotProtein)}g P)
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setActiveModal('manual_search')}
                  className="font-interface"
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '2px',
                    border: '1px dashed var(--border-subtle)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-chalk)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  + Add to {slot.label}
                </button>
              </div>

              {/* Slot Items */}
              {logsForSlot.length === 0 ? (
                <div
                  className="font-interface"
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-dim)',
                    padding: '0.5rem 0',
                    fontStyle: 'italic',
                  }}
                >
                  No food items logged for {slot.label.toLowerCase()} yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {logsForSlot.map((log) => (
                    <div
                      key={log.id}
                      style={{
                        backgroundColor: 'var(--surface-active)',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '3px',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span
                            className="font-interface"
                            style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-chalk)' }}
                          >
                            {log.items.map((i) => `${i.foodName} (${i.quantity}x)`).join(', ')}
                          </span>
                        </div>
                        {log.notes && (
                          <span className="font-interface" style={{ fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
                            {log.notes}
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span className="font-telemetry" style={{ fontSize: '0.8125rem', color: 'var(--text-chalk)' }}>
                          {Math.round(log.totalCalories)} kcal
                        </span>
                        <span className="font-telemetry" style={{ fontSize: '0.75rem', color: 'var(--color-sage)' }}>
                          P: {Math.round(log.totalProteinG)}g
                        </span>
                        <span className="font-telemetry" style={{ fontSize: '0.75rem', color: 'var(--color-ochre)' }}>
                          C: {Math.round(log.totalCarbsG)}g
                        </span>
                        <span className="font-telemetry" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          F: {Math.round(log.totalFatG)}g
                        </span>
                        <button
                          onClick={() => deleteMealLog(log.id)}
                          style={{
                            color: 'var(--text-dim)',
                            fontSize: '0.875rem',
                            padding: '0.1rem 0.35rem',
                          }}
                          title="Delete meal log"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
