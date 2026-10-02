import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../Common/Modal';
import { searchFoodItems } from '../../services/foodDatabaseService';
import { FoodItem, MealType } from '../../types/nutrition';

export const ManualSearchModal: React.FC = () => {
  const { activeModal, setActiveModal, addMealLog } = useApp();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [selectedMealType, setSelectedMealType] = useState<MealType>('LUNCH');
  const [quantities, setQuantities] = useState<{ [id: string]: number }>({});

  const isOpen = activeModal === 'manual_search';
  const filteredFoods = searchFoodItems(query, category);

  const getQty = (id: string) => quantities[id] ?? 1.0;

  const handleQtyChange = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0.5, Math.round(((prev[id] ?? 1.0) + delta) * 10) / 10),
    }));
  };

  const handleLogFood = (food: FoodItem) => {
    const qty = getQty(food.id);
    addMealLog({
      date: new Date().toISOString().split('T')[0],
      mealType: selectedMealType,
      notes: `${food.name} (${qty}x ${food.servingSize}${food.servingUnit})`,
      items: [
        {
          foodItemId: food.id,
          foodName: food.name,
          brand: food.brand,
          quantity: qty,
          servingUnit: `${food.servingSize}${food.servingUnit}`,
          calories: Math.round(food.calories * qty),
          proteinG: Math.round(food.proteinG * qty * 10) / 10,
          carbsG: Math.round(food.carbsG * qty * 10) / 10,
          fatG: Math.round(food.fatG * qty * 10) / 10,
        },
      ],
      totalCalories: Math.round(food.calories * qty),
      totalProteinG: Math.round(food.proteinG * qty * 10) / 10,
      totalCarbsG: Math.round(food.carbsG * qty * 10) / 10,
      totalFatG: Math.round(food.fatG * qty * 10) / 10,
    });
    setActiveModal(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setActiveModal(null)}
      title="Verified Food Database Search"
      subtitle="Select clinically verified whole foods and sports nutrition items"
      maxWidth="640px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Controls row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '0.75rem' }}>
          <input
            type="text"
            placeholder="Search foods (e.g. Chicken, Salmon, Oatmeal)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              backgroundColor: 'var(--surface-recessed)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-chalk)',
              padding: '0.6rem 0.85rem',
              borderRadius: '3px',
              fontSize: '0.8125rem',
              outline: 'none',
            }}
          />

          <select
            value={selectedMealType}
            onChange={(e) => setSelectedMealType(e.target.value as MealType)}
            style={{
              backgroundColor: 'var(--surface-recessed)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-chalk)',
              padding: '0.6rem 0.5rem',
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

        {/* Categories */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Foods' },
            { id: 'protein', label: '🥩 Lean Proteins' },
            { id: 'carbs', label: '🌾 Clean Carbs' },
            { id: 'fats', label: '🥑 Healthy Fats' },
            { id: 'fruits_veg', label: '🥦 Greens & Fruits' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className="font-interface"
              style={{
                fontSize: '0.75rem',
                padding: '0.3rem 0.6rem',
                borderRadius: '2px',
                backgroundColor: category === cat.id ? 'var(--color-sage)' : 'var(--surface-recessed)',
                color: category === cat.id ? 'var(--bg-ground)' : 'var(--text-muted)',
                fontWeight: category === cat.id ? 600 : 500,
                border: '1px solid var(--border-subtle)',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '340px', overflowY: 'auto' }}>
          {filteredFoods.map((food) => {
            const qty = getQty(food.id);
            return (
              <div
                key={food.id}
                style={{
                  backgroundColor: 'var(--surface-recessed)',
                  padding: '0.75rem 1rem',
                  borderRadius: '3px',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span className="font-interface" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-chalk)' }}>
                      {food.name}
                    </span>
                    {food.isVerified && (
                      <span className="font-telemetry" style={{ fontSize: '0.625rem', color: 'var(--color-sage)' }}>
                        ✓ VERIFIED
                      </span>
                    )}
                  </div>
                  <div className="font-telemetry" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {food.servingSize}{food.servingUnit} • {food.calories} kcal (P: {food.proteinG}g • C: {food.carbsG}g • F: {food.fatG}g)
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {/* Quantity Stepper */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: 'var(--surface-active)',
                      borderRadius: '2px',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <button
                      onClick={() => handleQtyChange(food.id, -0.5)}
                      style={{ padding: '0.2rem 0.5rem', color: 'var(--text-muted)' }}
                    >
                      -
                    </button>
                    <span className="font-telemetry" style={{ fontSize: '0.75rem', padding: '0 0.4rem', color: 'var(--text-chalk)' }}>
                      {qty}x
                    </span>
                    <button
                      onClick={() => handleQtyChange(food.id, 0.5)}
                      style={{ padding: '0.2rem 0.5rem', color: 'var(--text-muted)' }}
                    >
                      +
                    </button>
                  </div>

                  {/* Log button */}
                  <button
                    onClick={() => handleLogFood(food)}
                    className="font-interface"
                    style={{
                      backgroundColor: 'var(--color-sage)',
                      color: 'var(--bg-ground)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '0.35rem 0.75rem',
                      borderRadius: '2px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    + Log
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
