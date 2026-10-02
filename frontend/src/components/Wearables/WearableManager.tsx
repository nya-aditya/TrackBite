import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../Common/Modal';
import { FitbitDeviceModel } from '../../types/wearable';

const FITBIT_MODELS: { id: FitbitDeviceModel; name: string }[] = [
  { id: 'charge_6', name: 'Fitbit Charge 6 (Continuous EDA & Heart Rate)' },
  { id: 'sense_2', name: 'Fitbit Sense 2 (Advanced Health Watch)' },
  { id: 'versa_4', name: 'Fitbit Versa 4 (Fitness Smartwatch)' },
  { id: 'inspire_3', name: 'Fitbit Inspire 3 (Slim Health Tracker)' },
  { id: 'luxe', name: 'Fitbit Luxe (Wellness & Fashion)' },
];

export const WearableManager: React.FC = () => {
  const { activeModal, setActiveModal, device, updateDevice, showToast } = useApp();

  const isOpen = activeModal === 'device_manager';

  const handleModelChange = (modelId: FitbitDeviceModel) => {
    const selected = FITBIT_MODELS.find((m) => m.id === modelId);
    if (!selected) return;
    updateDevice({
      deviceModelId: modelId,
      modelName: selected.name.split(' (')[0],
      lastSyncTime: 'Just now',
    });
    showToast(`Switched active wearable to ${selected.name.split(' (')[0]}`);
  };

  const handleToggleConnection = () => {
    const nextState = !device.isConnected;
    updateDevice({ isConnected: nextState });
    showToast(nextState ? 'Fitbit connected and stream active' : 'Fitbit connection paused');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setActiveModal(null)}
      title="Wearable Device Hub"
      subtitle="Manage your connected biometric devices and sync status"
      maxWidth="580px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Connected Primary Provider: Fitbit */}
        <div
          style={{
            backgroundColor: 'var(--surface-recessed)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '4px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{ fontSize: '1.5rem' }}>⌚</span>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="font-interface" style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-chalk)' }}>
                    Fitbit Health & Fitness
                  </span>
                  <span
                    className="font-telemetry"
                    style={{
                      fontSize: '0.625rem',
                      color: device.isConnected ? 'var(--color-sage)' : 'var(--color-coral)',
                      backgroundColor: device.isConnected ? 'var(--color-sage-dim)' : 'var(--color-coral-dim)',
                      border: `1px solid ${device.isConnected ? 'var(--color-sage-border)' : 'var(--color-coral-border)'}`,
                      padding: '0.1rem 0.35rem',
                      borderRadius: '2px',
                    }}
                  >
                    {device.isConnected ? 'CONNECTED' : 'DISCONNECTED'}
                  </span>
                </div>
                <div className="font-telemetry" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Battery: {device.batteryPercent}% • Last sync: {device.lastSyncTime}
                </div>
              </div>
            </div>

            <button
              onClick={handleToggleConnection}
              className="font-interface"
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: device.isConnected ? 'var(--color-coral)' : 'var(--color-sage)',
                border: `1px solid ${device.isConnected ? 'var(--color-coral-border)' : 'var(--color-sage-border)'}`,
                backgroundColor: 'transparent',
                padding: '0.35rem 0.75rem',
                borderRadius: '3px',
              }}
            >
              {device.isConnected ? 'Disconnect' : 'Connect'}
            </button>
          </div>

          {/* Model Selector */}
          <div>
            <label className="font-interface" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Active Fitbit Model:
            </label>
            <select
              value={device.deviceModelId}
              onChange={(e) => handleModelChange(e.target.value as FitbitDeviceModel)}
              style={{
                width: '100%',
                backgroundColor: 'var(--surface-active)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-chalk)',
                padding: '0.5rem 0.75rem',
                borderRadius: '3px',
                fontSize: '0.8125rem',
                outline: 'none',
              }}
            >
              {FITBIT_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Future Integrations */}
        <div>
          <div className="font-interface" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-chalk)', marginBottom: '0.5rem' }}>
            Future Wearable Integrations:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { name: 'Whoop 4.0 (Any-Wear Strain & Recovery)', brand: 'Whoop' },
              { name: 'Oura Ring Gen 3 (Sleep Staging & Readiness)', brand: 'Oura' },
              { name: 'Apple HealthKit (Series 9 & Ultra Cardio Load)', brand: 'Apple' },
            ].map((ext) => (
              <div
                key={ext.name}
                style={{
                  backgroundColor: 'var(--surface-recessed)',
                  padding: '0.75rem 1rem',
                  borderRadius: '3px',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  opacity: 0.65,
                }}
              >
                <span className="font-interface" style={{ fontSize: '0.8125rem', color: 'var(--text-chalk)' }}>
                  {ext.name}
                </span>
                <span className="font-telemetry" style={{ fontSize: '0.6875rem', color: 'var(--color-ochre)' }}>
                  COMING SOON
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
