import React, { createContext, useContext, useState, useMemo } from 'react';
import { UserProfile } from '../types/user';
import { FitbitMetricSnapshot, WearableDevice } from '../types/wearable';
import { MealLog, DailyAdaptiveTarget, MacroNutrients } from '../types/nutrition';
import { Recipe } from '../types/recipe';
import { computeAdaptivePlan } from '../services/adaptiveEngine';
import {
  loadUserProfile,
  saveUserProfile,
  loadWearableDevice,
  saveWearableDevice,
  loadTelemetrySnapshot,
  saveTelemetrySnapshot,
  loadMealLogs,
  saveMealLogs,
} from '../services/storageService';

export type AppModalType =
  | 'photo_log'
  | 'barcode_log'
  | 'manual_search'
  | 'quick_add'
  | 'simulator'
  | 'device_manager'
  | 'recipe_detail'
  | null;

export type AppNavTab = 'dashboard' | 'logs' | 'activities' | 'recipes' | 'simulator' | 'analytics';

interface AppContextValue {
  user: UserProfile;
  updateUser: (patch: Partial<UserProfile>) => void;
  device: WearableDevice;
  updateDevice: (patch: Partial<WearableDevice>) => void;
  snapshot: FitbitMetricSnapshot;
  updateSnapshot: (newSnapshot: FitbitMetricSnapshot) => void;
  adaptiveTarget: DailyAdaptiveTarget;
  mealLogs: MealLog[];
  addMealLog: (logData: Omit<MealLog, 'id' | 'createdAt'>) => void;
  deleteMealLog: (id: string) => void;
  consumedMacros: MacroNutrients;
  remainingMacros: MacroNutrients;
  activeModal: AppModalType;
  setActiveModal: (modal: AppModalType) => void;
  selectedRecipe: Recipe | null;
  setSelectedRecipe: (recipe: Recipe | null) => void;
  activeNavTab: AppNavTab;
  setActiveNavTab: (tab: AppNavTab) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(loadUserProfile);
  const [device, setDevice] = useState<WearableDevice>(loadWearableDevice);
  const [snapshot, setSnapshot] = useState<FitbitMetricSnapshot>(loadTelemetrySnapshot);
  const [mealLogs, setMealLogs] = useState<MealLog[]>(loadMealLogs);
  const [activeModal, setActiveModal] = useState<AppModalType>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [activeNavTab, setActiveNavTab] = useState<AppNavTab>('dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Compute dynamic daily target based on user profile and wearable biometrics
  const adaptiveTarget = useMemo(() => {
    return computeAdaptivePlan(user, snapshot);
  }, [user, snapshot]);

  // Compute total consumed macros from today's logs
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLogs = useMemo(() => {
    return mealLogs.filter((log) => log.date === todayStr);
  }, [mealLogs, todayStr]);

  const consumedMacros = useMemo(() => {
    return todayLogs.reduce(
      (acc, log) => {
        acc.calories += log.totalCalories;
        acc.proteinG += log.totalProteinG;
        acc.carbsG += log.totalCarbsG;
        acc.fatG += log.totalFatG;
        return acc;
      },
      { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 }
    );
  }, [todayLogs]);

  // Compute remaining budget
  const remainingMacros = useMemo(() => {
    return {
      calories: Math.max(0, adaptiveTarget.adjustedCalories - consumedMacros.calories),
      proteinG: Math.max(0, Math.round((adaptiveTarget.adjustedProteinG - consumedMacros.proteinG) * 10) / 10),
      carbsG: Math.max(0, Math.round((adaptiveTarget.adjustedCarbsG - consumedMacros.carbsG) * 10) / 10),
      fatG: Math.max(0, Math.round((adaptiveTarget.adjustedFatG - consumedMacros.fatG) * 10) / 10),
    };
  }, [adaptiveTarget, consumedMacros]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const updateUser = (patch: Partial<UserProfile>) => {
    setUser((prev) => {
      const updated = { ...prev, ...patch };
      saveUserProfile(updated);
      return updated;
    });
    showToast('Biometrics profile updated');
  };

  const updateDevice = (patch: Partial<WearableDevice>) => {
    setDevice((prev) => {
      const updated = { ...prev, ...patch };
      saveWearableDevice(updated);
      return updated;
    });
  };

  const updateSnapshot = (newSnapshot: FitbitMetricSnapshot) => {
    setSnapshot(newSnapshot);
    saveTelemetrySnapshot(newSnapshot);
    showToast('Wearable biometrics synced & targets updated');
  };

  const addMealLog = (logData: Omit<MealLog, 'id' | 'createdAt'>) => {
    const newLog: MealLog = {
      ...logData,
      id: `meal-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setMealLogs((prev) => {
      const updated = [newLog, ...prev];
      saveMealLogs(updated);
      return updated;
    });
    showToast(`${logData.mealType} logged successfully (+${Math.round(logData.totalCalories)} kcal)`);
  };

  const deleteMealLog = (id: string) => {
    setMealLogs((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      saveMealLogs(updated);
      return updated;
    });
    showToast('Meal log deleted');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        updateUser,
        device,
        updateDevice,
        snapshot,
        updateSnapshot,
        adaptiveTarget,
        mealLogs,
        addMealLog,
        deleteMealLog,
        consumedMacros,
        remainingMacros,
        activeModal,
        setActiveModal,
        selectedRecipe,
        setSelectedRecipe,
        activeNavTab,
        setActiveNavTab,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextValue => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
