import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../Common/Modal';
import { MealType } from '../../types/nutrition';

export const QuickAddModal: React.FC = () => {
  const { activeModal, setActiveModal, addMealLog } = useApp();
  const [description, setDescription] = useState('');
  const [calories, setCalories] = useState('450');
  const [protein, setProtein] = useState('35');
  const [carbs, setCarbs] = useState('45');
  const [fat, setFat] = useState('12');
  const [mealType, setMealType] = useState<MealType>('LUNCH');

  const isOpen = activeModal === 'quick_add';

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const calsNum = parseFloat(calories) || 0;
    const proteinNum = parseFloat(protein) || 0;
    const carbsNum = parseFloat(carbs) || 0;
    const fatNum = parseFloat(fat) || 0;

    addMealLog({
      date: new Date().toISOString().split('T')[0],
      mealType,
      notes: description || 'Custom Quick Entry',
      items: [
        {
          foodItemId: `custom-${Date.now()}`,
          foodName: description || 'Custom Food Item',
          quantity: 1,
          servingUnit: 'portion',
          calories: calsNum,
          proteinG: proteinNum,
          carbsG: carbsNum,
          fatG: fatNum,
        },
      ],
      totalCalories: calsNum,
      totalProteinG: proteinNum,
      totalCarbsG: carbsNum,
      totalFatG: fatNum,
    });
    setActiveModal(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setActiveModal(null)}
      title="Quick Macro Entry"
      subtitle="Directly input calories and macronutrients without looking up ingredients"
      maxWidth="500px"
    >
      <form onSubmit={handleQuickAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label className="font-interface" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
            Description (Optional):
          </label>
          <input
            type="text"
            placeholder="e.g. Protein shake + banana"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: 'var(--surface-recessed)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-chalk)',
              padding: '0.55rem 0.75rem',
              borderRadius: '3px',
              fontSize: '0.8125rem',
              outline: 'none',
            }}
          />
        </div>

        {/* 4 Macros */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          <div>
            <label className="font-interface" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Calories (kcal):
            </label>
            <input
              type="number"
              min="0"
              required
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'var(--surface-recessed)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-chalk)',
                padding: '0.55rem 0.75rem',
                borderRadius: '3px',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label className="font-interface" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Protein (g):
            </label>
            <input
              type="number"
              min="0"
              required
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'var(--surface-recessed)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--color-sage)',
                padding: '0.55rem 0.75rem',
                borderRadius: '3px',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label className="font-interface" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Carbs (g):
            </label>
            <input
              type="number"
              min="0"
              required
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'var(--surface-recessed)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--color-ochre)',
                padding: '0.55rem 0.75rem',
                borderRadius: '3px',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label className="font-interface" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Fat (g):
            </label>
            <input
              type="number"
              min="0"
              required
              value={fat}
              onChange={(e) => setFat(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'var(--surface-recessed)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-chalk)',
                padding: '0.55rem 0.75rem',
                borderRadius: '3px',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Meal Slot and Submit */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value as MealType)}
            style={{
              backgroundColor: 'var(--surface-recessed)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-chalk)',
              padding: '0.45rem 0.65rem',
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

          <button
            type="submit"
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
            Add Macros
          </button>
        </div>
      </form>
    </Modal>
  );
};
