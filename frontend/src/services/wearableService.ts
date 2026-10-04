import { WearableDevice, FitbitMetricSnapshot } from '../types/wearable';

export interface TelemetryPreset {
  id: string;
  name: string;
  description: string;
  readinessScore: number;
  sleepHours: number;
  activeZoneMinutes: number;
  activeCalories: number;
  restingHeartRate: number;
  hrv: number;
}

export const TELEMETRY_PRESETS: TelemetryPreset[] = [
  {
    id: 'optimal',
    name: 'Peak Recovery & Low Strain',
    description: '8.2h restorative sleep, optimal 92 readiness, light recovery movement.',
    readinessScore: 92,
    sleepHours: 8.2,
    activeZoneMinutes: 15,
    activeCalories: 210,
    restingHeartRate: 49,
    hrv: 72,
  },
  {
    id: 'sleep_deprived',
    name: 'Acute Sleep Deprivation',
    description: '5.2h broken sleep, 48 readiness score, heightened morning cortisol load.',
    readinessScore: 48,
    sleepHours: 5.2,
    activeZoneMinutes: 20,
    activeCalories: 260,
    restingHeartRate: 59,
    hrv: 38,
  },
  {
    id: 'high_strain',
    name: 'High Strain Cardio / HIIT',
    description: '65 Active Zone Minutes, 620 kcal burned, glycogen replenishment needed.',
    readinessScore: 78,
    sleepHours: 7.8,
    activeZoneMinutes: 65,
    activeCalories: 620,
    restingHeartRate: 52,
    hrv: 64,
  },
  {
    id: 'low_readiness',
    name: 'Severe Fatigue & Low Readiness',
    description: '35 readiness score, requires anti-catabolic protein protection.',
    readinessScore: 35,
    sleepHours: 5.8,
    activeZoneMinutes: 10,
    activeCalories: 150,
    restingHeartRate: 64,
    hrv: 28,
  },
];

export const INITIAL_WEARABLE_DEVICE: WearableDevice = {
  id: 'device-fitbit-charge6-01',
  provider: 'fitbit',
  modelName: 'Fitbit Charge 6',
  deviceModelId: 'charge_6',
  isConnected: true,
  batteryPercent: 84,
  lastSyncTime: 'Just now',
};

export function clampBattery(percent: number): number {
  if (isNaN(percent)) return 100;
  return Math.max(0, Math.min(100, Math.round(percent)));
}

export function formatSyncTimestamp(date: Date = new Date()): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function createSnapshotFromPreset(preset: TelemetryPreset): FitbitMetricSnapshot {
  const readinessScore = Math.max(0, Math.min(100, Math.round(preset.readinessScore)));
  const readinessState = readinessScore >= 70 ? 'optimal' : readinessScore >= 40 ? 'moderate' : 'low';
  const totalMinutes = Math.max(0, Math.round(preset.sleepHours * 60));

  return {
    timestamp: new Date().toISOString(),
    readiness: {
      score: readinessScore,
      state: readinessState,
      restingHeartRate: Math.max(30, preset.restingHeartRate),
      hrvRmssd: Math.max(5, preset.hrv),
    },
    sleep: {
      totalDurationMinutes: totalMinutes,
      sleepScore: Math.max(0, Math.min(100, Math.round((preset.sleepHours / 8) * 90))),
      deepMinutes: Math.round(totalMinutes * 0.22),
      remMinutes: Math.round(totalMinutes * 0.24),
      lightMinutes: Math.round(totalMinutes * 0.46),
      awakeMinutes: Math.round(totalMinutes * 0.08),
      efficiencyPercent: preset.sleepHours >= 7.5 ? 93 : preset.sleepHours >= 6 ? 82 : 71,
    },
    activity: {
      activeZoneMinutes: Math.max(0, preset.activeZoneMinutes),
      fatBurnMinutes: Math.max(10, preset.activeZoneMinutes * 2),
      cardioMinutes: Math.round(preset.activeZoneMinutes * 0.7),
      peakMinutes: Math.round(preset.activeZoneMinutes * 0.3),
      steps: Math.max(0, 8500 + preset.activeZoneMinutes * 75),
      totalCaloriesBurned: Math.max(0, 2100 + preset.activeCalories),
      activeCalories: Math.max(0, preset.activeCalories),
    },
  };
}
