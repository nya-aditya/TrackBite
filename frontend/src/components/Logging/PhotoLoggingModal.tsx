import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../Common/Modal';
import { VISION_AI_PRESETS, VisionAiMealPreset } from '../../services/visionAiService';
import { MealType } from '../../types/nutrition';

export const PhotoLoggingModal: React.FC = () => {
  const { activeModal, setActiveModal, addMealLog } = useApp();
  const [selectedPreset, setSelectedPreset] = useState<VisionAiMealPreset>(VISION_AI_PRESETS[0]);
  const [selectedMealType, setSelectedMealType] = useState<MealType>('LUNCH');
  const [isScanning, setIsScanning] = useState(false);

  const isOpen = activeModal === 'photo_log';

  const handleSelectPreset = (preset: VisionAiMealPreset) => {
    setIsScanning(true);
    setTimeout(() => {
      setSelectedPreset(preset);
      setIsScanning(false);
    }, 450);
  };

  const handleConfirmAiMeal = () => {
    const totalCals = selectedPreset.detectedItems.reduce((acc, i) => acc + i.mealItem.calories, 0);
    const totalP = selectedPreset.detectedItems.reduce((acc, i) => acc + i.mealItem.proteinG, 0);
    const totalC = selectedPreset.detectedItems.reduce((acc, i) => acc + i.mealItem.carbsG, 0);
    const totalF = selectedPreset.detectedItems.reduce((acc, i) => acc + i.mealItem.fatG, 0);

    addMealLog({
      date: new Date().toISOString().split('T')[0],
      mealType: selectedMealType,
      notes: `AI Photo Detection: ${selectedPreset.name} (${selectedPreset.confidenceScore}% confidence)`,
      items: selectedPreset.detectedItems.map((i) => i.mealItem),
      totalCalories: totalCals,
      totalProteinG: totalP,
      totalCarbsG: totalC,
      totalFatG: totalF,
    });
    setActiveModal(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setActiveModal(null)}
      title="Vision AI Multi-Item Food Scanner"
      subtitle="Instant machine vision segmenting whole foods with volumetric macro estimation"
      maxWidth="600px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Preset Selector */}
        <div>
          <label className="font-interface" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
            Demo Meal Photo Presets:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            {VISION_AI_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p)}
                style={{
                  backgroundColor: selectedPreset.id === p.id ? 'var(--color-sage-dim)' : 'var(--surface-recessed)',
                  border: `1px solid ${selectedPreset.id === p.id ? 'var(--color-sage)' : 'var(--border-subtle)'}`,
                  color: selectedPreset.id === p.id ? 'var(--color-sage)' : 'var(--text-chalk)',
                  padding: '0.5rem 0.65rem',
                  borderRadius: '3px',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: selectedPreset.id === p.id ? 600 : 500,
                }}
              >
                {p.name.split(' (')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Viewfinder Mockup */}
        <div
          style={{
            backgroundColor: 'var(--surface-recessed)',
            border: '1px dashed var(--border-focus)',
            borderRadius: '4px',
            padding: '1.25rem',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            minHeight: '160px',
            justifyContent: 'center',
          }}
        >
          {isScanning ? (
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <span className="font-telemetry" style={{ fontSize: '0.875rem', color: 'var(--color-sage)' }}>
                Analyzing neural bounding boxes...
              </span>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="font-interface" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-chalk)' }}>
                  {selectedPreset.name}
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
                  {selectedPreset.confidenceScore}% CONFIDENCE
                </span>
              </div>

              {/* Detected Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {selectedPreset.detectedItems.map((item) => (
                  <div
                    key={item.foodName}
                    style={{
                      backgroundColor: 'var(--surface-active)',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div>
                      <span className="font-interface" style={{ fontSize: '0.8125rem', color: 'var(--text-chalk)' }}>
                        {item.foodName}
                      </span>
                      <span className="font-telemetry" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                        ({item.portionText})
                      </span>
                    </div>
                    <span className="font-telemetry" style={{ fontSize: '0.75rem', color: 'var(--color-sage)' }}>
                      {item.mealItem.calories} kcal • {item.mealItem.proteinG}g P
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Slot Selector and Submit */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="font-interface" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Meal Slot:
            </span>
            <select
              value={selectedMealType}
              onChange={(e) => setSelectedMealType(e.target.value as MealType)}
              style={{
                backgroundColor: 'var(--surface-recessed)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-chalk)',
                padding: '0.35rem 0.5rem',
                borderRadius: '3px',
                fontSize: '0.8125rem',
                outline: 'none',
              }}
            >
              <option value="BREAKFAST">Breakfast</option>
              <option value="LUNCH">Lunch</option>
              <option value="DINNER">Dinner</option>
              <option value="SNACK">Snack</option>
            </select>
          </div>

          <button
            onClick={handleConfirmAiMeal}
            className="font-interface"
            style={{
              backgroundColor: 'var(--color-sage)',
              color: 'var(--bg-ground)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              padding: '0.5rem 1.25rem',
              borderRadius: '3px',
            }}
          >
            Confirm & Log AI Meal
          </button>
        </div>
      </div>
    </Modal>
  );
};
