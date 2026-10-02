import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { RECIPES_CATALOG, computeRecipeMacroMatch } from '../../services/recipeService';
import { Recipe } from '../../types/recipe';

export const RecipeMatcher: React.FC = () => {
  const { remainingMacros, setSelectedRecipe, setActiveModal, addMealLog } = useApp();
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const rankedRecipes = useMemo(() => {
    return RECIPES_CATALOG.map((recipe) => ({
      ...recipe,
      macroMatchScore: computeRecipeMacroMatch(recipe, remainingMacros),
    })).sort((a, b) => (b.macroMatchScore ?? 0) - (a.macroMatchScore ?? 0));
  }, [remainingMacros]);

  const filtered = useMemo(() => {
    if (filterCategory === 'all') return rankedRecipes;
    return rankedRecipes.filter((r) => r.dietaryCategory === filterCategory);
  }, [rankedRecipes, filterCategory]);

  const handleQuickLog = (recipe: Recipe) => {
    addMealLog({
      date: new Date().toISOString().split('T')[0],
      mealType: 'DINNER',
      notes: `Recipe: ${recipe.title}`,
      items: [
        {
          foodItemId: recipe.id,
          foodName: recipe.title,
          quantity: 1,
          servingUnit: 'serving',
          calories: recipe.calories,
          proteinG: recipe.proteinG,
          carbsG: recipe.carbsG,
          fatG: recipe.fatG,
        },
      ],
      totalCalories: recipe.calories,
      totalProteinG: recipe.proteinG,
      totalCarbsG: recipe.carbsG,
      totalFatG: recipe.fatG,
    });
  };

  const handleOpenDetail = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setActiveModal('recipe_detail');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header and Remaining Budget Banner */}
      <div
        style={{
          backgroundColor: 'var(--surface-panel)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '4px',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h2
            className="font-interface"
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: 'var(--text-chalk)',
            }}
          >
            Dynamic Macro-Gap Recipe Matcher
          </h2>
          <p className="font-interface" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Recipes dynamically scored against your unfulfilled daily targets
          </p>
        </div>

        <div
          style={{
            backgroundColor: 'var(--surface-recessed)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '3px',
            padding: '0.5rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <span className="font-interface" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Remaining Today:
          </span>
          <span className="font-telemetry" style={{ fontSize: '0.8125rem', color: 'var(--text-chalk)', fontWeight: 600 }}>
            {remainingMacros.calories} kcal
          </span>
          <span className="font-telemetry" style={{ fontSize: '0.8125rem', color: 'var(--color-sage)', fontWeight: 600 }}>
            {remainingMacros.proteinG}g P
          </span>
          <span className="font-telemetry" style={{ fontSize: '0.8125rem', color: 'var(--color-ochre)', fontWeight: 600 }}>
            {remainingMacros.carbsG}g C
          </span>
        </div>
      </div>

      {/* Filter Categories */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {[
          { id: 'all', label: 'All Recommendations' },
          { id: 'recovery', label: '⚡ Post-Workout Recovery' },
          { id: 'high_protein', label: '🥩 High Protein' },
          { id: 'balanced', label: '⚖️ Balanced Macros' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterCategory(f.id)}
            className="font-interface"
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '2px',
              fontSize: '0.75rem',
              fontWeight: filterCategory === f.id ? 600 : 500,
              backgroundColor: filterCategory === f.id ? 'var(--color-sage)' : 'var(--surface-recessed)',
              color: filterCategory === f.id ? 'var(--bg-ground)' : 'var(--text-muted)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Recipe Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {filtered.map((recipe) => (
          <div
            key={recipe.id}
            style={{
              backgroundColor: 'var(--surface-panel)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '4px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span
                  className="font-telemetry"
                  style={{
                    fontSize: '0.6875rem',
                    color: 'var(--color-sage)',
                    backgroundColor: 'var(--color-sage-dim)',
                    border: '1px solid var(--color-sage-border)',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '2px',
                    fontWeight: 600,
                  }}
                >
                  {recipe.macroMatchScore}% MACRO FIT
                </span>
                <span className="font-telemetry" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  ⏱️ {recipe.prepTimeMinutes + recipe.cookTimeMinutes} mins
                </span>
              </div>

              <h3
                className="font-interface"
                style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-chalk)', lineHeight: 1.3 }}
              >
                {recipe.title}
              </h3>
              <p
                className="font-interface"
                style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.35rem', lineHeight: 1.4 }}
              >
                {recipe.description}
              </p>
            </div>

            <div>
              {/* Macro Pills */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.5rem 0.75rem',
                  backgroundColor: 'var(--surface-recessed)',
                  borderRadius: '3px',
                  marginBottom: '0.85rem',
                }}
              >
                <span className="font-telemetry" style={{ fontSize: '0.8125rem', color: 'var(--text-chalk)', fontWeight: 600 }}>
                  {recipe.calories} kcal
                </span>
                <span className="font-telemetry" style={{ fontSize: '0.75rem', color: 'var(--color-sage)' }}>
                  P: {recipe.proteinG}g
                </span>
                <span className="font-telemetry" style={{ fontSize: '0.75rem', color: 'var(--color-ochre)' }}>
                  C: {recipe.carbsG}g
                </span>
                <span className="font-telemetry" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  F: {recipe.fatG}g
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleOpenDetail(recipe)}
                  className="font-interface"
                  style={{
                    flex: 1,
                    backgroundColor: 'var(--surface-recessed)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-chalk)',
                    padding: '0.45rem',
                    borderRadius: '3px',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                  }}
                >
                  View Details
                </button>
                <button
                  onClick={() => handleQuickLog(recipe)}
                  className="font-interface"
                  style={{
                    flex: 1,
                    backgroundColor: 'var(--color-sage)',
                    color: 'var(--bg-ground)',
                    padding: '0.45rem',
                    borderRadius: '3px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                >
                  + Quick Log
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
