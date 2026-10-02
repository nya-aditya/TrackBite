import React, { useState } from 'react';
import { LandingPage } from './components/Landing/LandingPage';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Navigation/Header';
import { NavTabs } from './components/Navigation/NavTabs';
import { RecoveryHero } from './components/Dashboard/RecoveryHero';
import { AdaptiveTargetCard } from './components/Dashboard/AdaptiveTargetCard';
import { MacroRings } from './components/Dashboard/MacroRings';
import { MealTimeline } from './components/Dashboard/MealTimeline';
import { SmartNudgeBanner } from './components/Dashboard/SmartNudgeBanner';
import { PersonaSwitcher } from './components/Onboarding/PersonaSwitcher';
import { RecipeMatcher } from './components/Recipes/RecipeMatcher';
import { RecoveryVsNutritionChart } from './components/Analytics/RecoveryVsNutritionChart';
import { ManualSearchModal } from './components/Logging/ManualSearchModal';
import { PhotoLoggingModal } from './components/Logging/PhotoLoggingModal';
import { BarcodeScannerModal } from './components/Logging/BarcodeScannerModal';
import { QuickAddModal } from './components/Logging/QuickAddModal';
import { LiveSimulatorDrawer } from './components/Wearables/LiveSimulatorDrawer';
import { WearableManager } from './components/Wearables/WearableManager';
import { RecipeDetailModal } from './components/Recipes/RecipeDetailModal';
import { Toast } from './components/Common/Toast';

const AppContent: React.FC<{ onBackToLanding: () => void }> = ({ onBackToLanding }) => {
  const { activeNavTab } = useApp();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-ground)', display: 'flex', flexDirection: 'column' }}>
      <Header onBackToLanding={onBackToLanding} />
      <NavTabs />

      <main
        style={{
          flex: 1,
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          padding: '1.75rem 1.5rem 3.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        {activeNavTab === 'dashboard' && (
          <>
            <PersonaSwitcher />
            <SmartNudgeBanner />
            <RecoveryHero />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem' }}>
              <AdaptiveTargetCard />
              <MacroRings />
            </div>
            <MealTimeline />
          </>
        )}

        {activeNavTab === 'logs' && (
          <>
            <PersonaSwitcher />
            <MealTimeline />
          </>
        )}

        {activeNavTab === 'recipes' && (
          <>
            <RecipeMatcher />
          </>
        )}

        {activeNavTab === 'simulator' && (
          <>
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
                <h2 className="font-interface" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-chalk)' }}>
                  Interactive Fitbit Signal Modulation
                </h2>
                <p className="font-interface" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Simulate high strain workouts, sleep restriction, or optimal recovery to see targets recalculate in real-time.
                </p>
              </div>
            </div>
            <RecoveryHero />
            <AdaptiveTargetCard />
          </>
        )}

        {activeNavTab === 'analytics' && (
          <>
            <RecoveryVsNutritionChart />
          </>
        )}
      </main>

      {/* Global Modals & Dialogs */}
      <ManualSearchModal />
      <PhotoLoggingModal />
      <BarcodeScannerModal />
      <QuickAddModal />
      <LiveSimulatorDrawer />
      <WearableManager />
      <RecipeDetailModal />
      <Toast />
    </div>
  );
};

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'app'>('landing');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-ground)' }}>
      {currentView === 'landing' ? (
        <LandingPage onEnterApp={() => setCurrentView('app')} />
      ) : (
        <AppProvider>
          <AppContent onBackToLanding={() => setCurrentView('landing')} />
        </AppProvider>
      )}
    </div>
  );
};

export default App;
