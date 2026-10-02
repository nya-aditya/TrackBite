import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../Common/Modal';
import { TELEMETRY_PRESETS, createSnapshotFromPreset } from '../../services/wearableService';

export const LiveSimulatorDrawer: React.FC = () => {
  const { activeModal, setActiveModal, snapshot, updateSnapshot } = useApp();

  const [sleepHours, setSleepHours] = useState(snapshot.sleep.totalDurationMinutes / 60);
  const [readinessScore, setReadinessScore] = useState(snapshot.readiness.score);
  const [azm, setAzm] = useState(snapshot.activity.activeZoneMinutes);
  const [activeKcal, setActiveKcal] = useState(snapshot.activity.activeCalories);
  const [rhr, setRhr] = useState(snapshot.readiness.restingHeartRate);
  const [hrv, setHrv] = useState(snapshot.readiness.hrvRmssd);

  const isOpen = activeModal === 'simulator';

  const applyCustomValues = (
    newSleep: number,
    newReadiness: number,
    newAzm: number,
    newActiveKcal: number,
    newRhr: number,
    newHrv: number
  ) => {
    const totalMinutes = Math.round(newSleep * 60);
    const readinessState = newReadiness >= 70 ? 'optimal' : newReadiness >= 40 ? 'moderate' : 'low';

    updateSnapshot({
      timestamp: new Date().toISOString(),
      readiness: {
        score: newReadiness,
        state: readinessState,
        restingHeartRate: newRhr,
        hrvRmssd: newHrv,
      },
      sleep: {
        totalDurationMinutes: totalMinutes,
        sleepScore: Math.round(Math.min(100, (newSleep / 8) * 90)),
        deepMinutes: Math.round(totalMinutes * 0.22),
        remMinutes: Math.round(totalMinutes * 0.24),
        lightMinutes: Math.round(totalMinutes * 0.46),
        awakeMinutes: Math.round(totalMinutes * 0.08),
        efficiencyPercent: newSleep >= 7.5 ? 93 : newSleep >= 6 ? 82 : 71,
      },
      activity: {
        activeZoneMinutes: newAzm,
        fatBurnMinutes: Math.max(10, newAzm * 2),
        cardioMinutes: Math.round(newAzm * 0.7),
        peakMinutes: Math.round(newAzm * 0.3),
        steps: 8000 + newAzm * 80,
        totalCaloriesBurned: 2000 + newActiveKcal,
        activeCalories: newActiveKcal,
      },
    });
  };

  const handleApplyPreset = (presetId: string) => {
    const preset = TELEMETRY_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setSleepHours(preset.sleepHours);
    setReadinessScore(preset.readinessScore);
    setAzm(preset.activeZoneMinutes);
    setActiveKcal(preset.activeCalories);
    setRhr(preset.restingHeartRate);
    setHrv(preset.hrv);

    updateSnapshot(createSnapshotFromPreset(preset));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setActiveModal(null)}
      title="Fitbit Live Biometrics Simulator"
      subtitle="Adjust physiological telemetry signals in real-time to observe dynamic nutrition recalibration"
      maxWidth="620px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Presets Grid */}
        <div>
          <div className="font-interface" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-chalk)', marginBottom: '0.5rem' }}>
            Clinical Simulation Presets:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
            {TELEMETRY_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleApplyPreset(p.id)}
                style={{
                  backgroundColor: 'var(--surface-recessed)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '3px',
                  padding: '0.65rem 0.85rem',
                  textAlign: 'left',
                }}
              >
                <div className="font-interface" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-chalk)' }}>
                  {p.name}
                </div>
                <div className="font-interface" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  {p.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sliders */}
        <div
          style={{
            backgroundColor: 'var(--surface-recessed)',
            padding: '1.25rem',
            borderRadius: '4px',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          {/* Sleep Hours */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="font-interface" style={{ fontSize: '0.8125rem', color: 'var(--text-chalk)' }}>
                Sleep Duration (Hours)
              </span>
              <span className="font-telemetry" style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-sage)' }}>
                {sleepHours.toFixed(1)}h
              </span>
            </div>
            <input
              type="range"
              min="4.0"
              max="9.5"
              step="0.1"
              value={sleepHours}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setSleepHours(val);
                applyCustomValues(val, readinessScore, azm, activeKcal, rhr, hrv);
              }}
              className="telemetry-slider"
            />
          </div>

          {/* Daily Readiness */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="font-interface" style={{ fontSize: '0.8125rem', color: 'var(--text-chalk)' }}>
                Daily Readiness Score (0 - 100)
              </span>
              <span className="font-telemetry" style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-chalk)' }}>
                {readinessScore}
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="1"
              value={readinessScore}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setReadinessScore(val);
                applyCustomValues(sleepHours, val, azm, activeKcal, rhr, hrv);
              }}
              className="telemetry-slider"
            />
          </div>

          {/* Active Zone Minutes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="font-interface" style={{ fontSize: '0.8125rem', color: 'var(--text-chalk)' }}>
                Active Zone Minutes (Cardio/Peak)
              </span>
              <span className="font-telemetry" style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-ochre)' }}>
                {azm} mins
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="120"
              step="5"
              value={azm}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setAzm(val);
                applyCustomValues(sleepHours, readinessScore, val, activeKcal, rhr, hrv);
              }}
              className="telemetry-slider"
            />
          </div>

          {/* Active Calories Burned */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="font-interface" style={{ fontSize: '0.8125rem', color: 'var(--text-chalk)' }}>
                Active Workout Burn (Calories)
              </span>
              <span className="font-telemetry" style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-chalk)' }}>
                {activeKcal} kcal
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="1200"
              step="25"
              value={activeKcal}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setActiveKcal(val);
                applyCustomValues(sleepHours, readinessScore, azm, val, rhr, hrv);
              }}
              className="telemetry-slider"
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setActiveModal(null)}
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
            Apply & Close Simulator
          </button>
        </div>
      </div>
    </Modal>
  );
};
