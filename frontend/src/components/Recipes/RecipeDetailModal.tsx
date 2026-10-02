import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../Common/Modal';

export const RecipeDetailModal: React.FC = () => {
  const { activeModal, setActiveModal, selectedRecipe, addMealLog } = useApp();

  const isOpen = activeModal === 'recipe_detail';
  if (!selectedRecipe) return null;

  const handleLogRecipe = () => {
    addMealLog({
      date: new Date().toISOString().split('T')[0],
      mealType: 'DINNER',
      notes: `Cooked Recipe: ${selectedRecipe.title}`,
      items: [
        {
          foodItemId: selectedRecipe.id,
          foodName: selectedRecipe.title,
          quantity: 1,
          servingUnit: 'serving',
          calories: selectedRecipe.calories,
          proteinG: selectedRecipe.proteinG,
          carbsG: selectedRecipe.carbsG,
          fatG: selectedRecipe.fatG,
        },
      ],
      totalCalories: selectedRecipe.calories,
      totalProteinG: selectedRecipe.proteinG,
      totalCarbsG: selectedRecipe.carbsG,
      totalFatG: selectedRecipe.fatG,
    });
    setActiveModal(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setActiveModal(null)}
      title={selectedRecipe.title}
      subtitle={`${selectedRecipe.calories} kcal • P: ${selectedRecipe.proteinG}g • C: ${selectedRecipe.carbsG}g • F: ${selectedRecipe.fatG}g`}
      maxWidth="600px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <p className="font-interface" style={{ fontSize: '0.875rem', color: 'var(--text-chalk)', lineHeight: 1.5 }}>
          {selectedRecipe.description}
        </p>

        {/* Ingredients */}
        <div>
          <h4
            className="font-interface"
            style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-sage)', textTransform: 'uppercase', marginBottom: '0.5rem' }}
          >
            Ingredients & Portions:
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {selectedRecipe.ingredients.map((ing) => (
              <div
                key={ing.name}
                style={{
                  backgroundColor: 'var(--surface-recessed)',
                  padding: '0.45rem 0.75rem',
                  borderRadius: '2px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <span className="font-interface" style={{ fontSize: '0.8125rem', color: 'var(--text-chalk)' }}>
                  {ing.name}
                </span>
                <span className="font-telemetry" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {ing.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div>
          <h4
            className="font-interface"
            style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-ochre)', textTransform: 'uppercase', marginBottom: '0.5rem' }}
          >
            Preparation & Cooking Instructions:
          </h4>
          <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {selectedRecipe.instructions.map((step, idx) => (
              <li key={idx} className="font-interface" style={{ fontSize: '0.8125rem', color: 'var(--text-chalk)', lineHeight: 1.4 }}>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Log button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button
            onClick={handleLogRecipe}
            className="font-interface"
            style={{
              backgroundColor: 'var(--color-sage)',
              color: 'var(--bg-ground)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              padding: '0.55rem 1.25rem',
              borderRadius: '3px',
            }}
          >
            + Log This Meal Now
          </button>
        </div>
      </div>
    </Modal>
  );
};
