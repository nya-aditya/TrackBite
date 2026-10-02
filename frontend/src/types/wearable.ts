export type WearableProvider = 'fitbit' | 'whoop' | 'oura' | 'apple_health';

export type FitbitDeviceModel = 'charge_6' | 'sense_2' | 'versa_4' | 'inspire_3' | 'luxe';

export interface FitbitDailyReadiness {
  score: number; // 0 - 100
  state: 'low' | 'moderate' | 'optimal';
  restingHeartRate: number;
  hrvRmssd: number;
}

export interface FitbitSleepData {
  totalDurationMinutes: number;
  sleepScore: number;
  deepMinutes: number;
  remMinutes: number;
  lightMinutes: number;
  awakeMinutes: number;
  efficiencyPercent: number;
}

export interface FitbitActivityData {
  activeZoneMinutes: number;
  fatBurnMinutes: number;
  cardioMinutes: number;
  peakMinutes: number;
  steps: number;
  totalCaloriesBurned: number;
  activeCalories: number;
}

export interface FitbitMetricSnapshot {
  timestamp: string;
  readiness: FitbitDailyReadiness;
  sleep: FitbitSleepData;
  activity: FitbitActivityData;
}

export interface WearableDevice {
  id: string;
  provider: WearableProvider;
  modelName: string;
  deviceModelId: FitbitDeviceModel;
  isConnected: boolean;
  batteryPercent: number;
  lastSyncTime: string;
}
