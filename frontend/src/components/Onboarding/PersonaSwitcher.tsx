import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserProfile } from '../../types/user';

const DEMO_PERSONAS: UserProfile[] = [
  {
    id: 'user-alex-mercer',
    name: 'Alex Mercer',
    email: 'alex.mercer@trackbite.health',
    avatarUrl: '',
    age: 28,
    gender: 'male',
    heightCm: 182,
    weightKg: 78.5,
    targetWeightKg: 76.0,
    primaryGoal: 'fat_loss',
    activityLevel: 'very_active',
    dietaryPreference: 'high_protein',
    dailyWaterGoalMl: 3200,
    isAutoAdaptiveEnabled: true,
    onboardingCompleted: true,
  },
  {
    id: 'user-maya-lin',
    name: 'Maya Lin',
    email: 'maya.lin@trackbite.health',
    avatarUrl: '',
    age: 25,
    gender: 'female',
    heightCm: 168,
    weightKg: 62.0,
    targetWeightKg: 64.5,
    primaryGoal: 'muscle_gain',
    activityLevel: 'moderate',
    dietaryPreference: 'mediterranean',
    dailyWaterGoalMl: 2600,
    isAutoAdaptiveEnabled: true,
    onboardingCompleted: true,
  },
  {
    id: 'user-marcus-vance',
    name: 'Marcus Vance',
    email: 'marcus.vance@trackbite.health',
    avatarUrl: '',
    age: 34,
    gender: 'male',
    heightCm: 178,
    weightKg: 74.0,
    targetWeightKg: 74.0,
    primaryGoal: 'athletic_performance',
    activityLevel: 'athlete',
    dietaryPreference: 'none',
    dailyWaterGoalMl: 3800,
    isAutoAdaptiveEnabled: true,
    onboardingCompleted: true,
  },
];

export const PersonaSwitcher: React.FC = () => {
  const { user, updateUser, showToast } = useApp();

  const handleSelectPersona = (persona: UserProfile) => {
    updateUser(persona);
    showToast(`Switched user profile to ${persona.name} (${persona.primaryGoal.replace('_', ' ')})`);
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--surface-recessed)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '3px',
        padding: '0.65rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span className="font-interface" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Active Athlete Profile:
        </span>
        <span className="font-interface" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-chalk)' }}>
          {user.name} ({user.weightKg}kg • {user.primaryGoal.replace('_', ' ')})
        </span>
      </div>

      <div style={{ display: 'flex', gap: '0.35rem' }}>
        {DEMO_PERSONAS.map((p) => {
          const isSelected = user.id === p.id;
          return (
            <button
              key={p.id}
              onClick={() => handleSelectPersona(p)}
              className="font-interface"
              style={{
                fontSize: '0.6875rem',
                padding: '0.25rem 0.55rem',
                borderRadius: '2px',
                fontWeight: isSelected ? 600 : 500,
                backgroundColor: isSelected ? 'var(--color-sage-dim)' : 'var(--surface-active)',
                color: isSelected ? 'var(--color-sage)' : 'var(--text-muted)',
                border: `1px solid ${isSelected ? 'var(--color-sage-border)' : 'var(--border-subtle)'}`,
              }}
            >
              {p.name.split(' ')[0]} ({p.primaryGoal === 'fat_loss' ? 'Deficit' : p.primaryGoal === 'muscle_gain' ? 'Bulk' : 'Athlete'})
            </button>
          );
        })}
      </div>
    </div>
  );
};
