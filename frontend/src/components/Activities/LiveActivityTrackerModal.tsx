import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../Common/Modal';
import { ActivityType, GPSCoordinate } from '../../types/activity';
import {
  SIMULATED_GPS_ROUTES,
  calculateHaversineDistance,
  formatDuration,
  formatDistance,
  formatPace,
  saveActivity,
} from '../../services/activityService';
import { ActivityMap } from './ActivityMap';

interface LiveActivityTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivitySaved?: () => void;
}

export const LiveActivityTrackerModal: React.FC<LiveActivityTrackerModalProps> = ({
  isOpen,
  onClose,
  onActivitySaved,
}) => {
  const { user, showToast } = useApp();

  const [type, setType] = useState<ActivityType>('RUN');
  const [activityName, setActivityName] = useState('Central Park Run');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [distanceMeters, setDistanceMeters] = useState(0);
  const [coords, setCoords] = useState<GPSCoordinate[]>([]);
  const [isSimulating, setIsSimulating] = useState(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const simStepRef = useRef(0);

  // Clean up and reset tracking if modal is closed
  useEffect(() => {
    if (!isOpen) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setIsRecording(false);
      setIsPaused(false);
    }
  }, [isOpen]);

  // Timer loop
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((sec) => sec + 1);

        // Simulated movement progression
        if (isSimulating) {
          const route = SIMULATED_GPS_ROUTES[type];
          if (route && route.length > 1) {
            simStepRef.current = (simStepRef.current + 1) % route.length;
            const nextCoord = route[simStepRef.current];

            setCoords((prev) => {
              const last = prev[prev.length - 1];
              if (last) {
                const stepDist = calculateHaversineDistance(last, nextCoord);
                setDistanceMeters((d) => d + (stepDist > 0 ? stepDist : 35));
              } else {
                setDistanceMeters((d) => d + 30);
              }
              return [...prev, nextCoord];
            });
          }
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, isPaused, isSimulating, type]);

  // Real GPS tracking on supported devices
  useEffect(() => {
    let watchId: number | null = null;
    if (isRecording && !isPaused && !isSimulating && 'geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const newPt: GPSCoordinate = [pos.coords.latitude, pos.coords.longitude];
          setCoords((prev) => {
            const last = prev[prev.length - 1];
            if (last) {
              const delta = calculateHaversineDistance(last, newPt);
              if (delta > 3) setDistanceMeters((d) => d + delta);
            }
            return [...prev, newPt];
          });
        },
        (err) => console.warn('Geolocation error:', err.message),
        { enableHighAccuracy: true, maximumAge: 1000 }
      );
    }
    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    };
  }, [isRecording, isPaused, isSimulating]);

  const handleStart = () => {
    setIsRecording(true);
    setIsPaused(false);
    setElapsedSeconds(0);
    setDistanceMeters(0);
    simStepRef.current = 0;
    const initialCoord = SIMULATED_GPS_ROUTES[type][0];
    setCoords([initialCoord]);
    showToast(`${type} tracking started`);
  };

  const handlePauseResume = () => {
    setIsPaused((p) => !p);
  };

  const handleFinish = async () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);

    const distKm = distanceMeters / 1000;
    const durMin = elapsedSeconds / 60;
    const pace = distKm > 0 ? Math.round((durMin / distKm) * 100) / 100 : 0;
    const metFactor = type === 'RUN' ? 1.03 : type === 'CYCLING' ? 0.65 : 0.75;
    const calories = Math.round(user.weightKg * distKm * metFactor);

    await saveActivity(user.id, {
      userId: user.id,
      name: activityName || `${type} Session`,
      type,
      distanceMeters,
      durationSeconds: elapsedSeconds,
      paceMinPerKm: pace,
      caloriesBurned: calories,
      elevationGainM: 28,
      averageHeartRate: type === 'RUN' ? 154 : 115,
      routeCoordinates: coords,
      startDate: new Date().toISOString(),
    });

    showToast(`Activity '${activityName}' saved! +${calories} kcal accounted for.`);
    if (onActivitySaved) onActivitySaved();
    onClose();
  };

  const distKm = distanceMeters / 1000;
  const durMin = elapsedSeconds / 60;
  const currentPace = distKm > 0 ? durMin / distKm : 0;
  const metFactor = type === 'RUN' ? 1.03 : type === 'CYCLING' ? 0.65 : 0.75;
  const estCalories = Math.round(user.weightKg * distKm * metFactor);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Live GPS Workout Tracker"
      subtitle="Track real-time distance, pace, and route trajectory with dynamic nutrition buffering"
      maxWidth="640px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Controls / Type Picker */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {(['RUN', 'WALK', 'CYCLING'] as ActivityType[]).map((t) => (
              <button
                key={t}
                disabled={isRecording}
                onClick={() => {
                  setType(t);
                  setActivityName(t === 'RUN' ? 'Central Park Run' : t === 'WALK' ? 'Neighborhood Walk' : 'Morning Bike Ride');
                }}
                className="font-interface"
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '3px',
                  fontSize: '0.75rem',
                  fontWeight: type === t ? 600 : 500,
                  backgroundColor: type === t ? 'var(--color-sage)' : 'var(--surface-recessed)',
                  color: type === t ? 'var(--bg-ground)' : 'var(--text-muted)',
                  border: '1px solid var(--border-subtle)',
                  opacity: isRecording && type !== t ? 0.4 : 1,
                }}
              >
                {t === 'RUN' ? '🏃 Run' : t === 'WALK' ? '🚶 Walk' : '🚴 Cycling'}
              </button>
            ))}
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={isSimulating}
              onChange={(e) => setIsSimulating(e.target.checked)}
              disabled={isRecording}
            />
            <span className="font-interface" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Simulate Movement
            </span>
          </label>
        </div>

        {/* Workout Name Input */}
        <div>
          <input
            type="text"
            value={activityName}
            onChange={(e) => setActivityName(e.target.value)}
            disabled={isRecording}
            placeholder="Workout Name (e.g. Morning 5k)"
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

        {/* Live HUD Dashboard */}
        <div
          style={{
            backgroundColor: 'var(--surface-recessed)',
            padding: '1.25rem',
            borderRadius: '4px',
            border: '1px solid var(--border-subtle)',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.75rem',
            textAlign: 'center',
          }}
        >
          <div>
            <div className="font-interface" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              DURATION
            </div>
            <div className="font-telemetry" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-chalk)' }}>
              {formatDuration(elapsedSeconds)}
            </div>
          </div>

          <div>
            <div className="font-interface" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              DISTANCE
            </div>
            <div className="font-telemetry" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-sage)' }}>
              {formatDistance(distanceMeters)}
            </div>
          </div>

          <div>
            <div className="font-interface" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              AVG PACE
            </div>
            <div className="font-telemetry" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-ochre)' }}>
              {formatPace(currentPace)}
            </div>
          </div>

          <div>
            <div className="font-interface" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              ACTIVE BURN
            </div>
            <div className="font-telemetry" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-chalk)' }}>
              {estCalories} kcal
            </div>
          </div>
        </div>

        {/* Live Route Map Canvas */}
        <ActivityMap coordinates={coords} height={190} strokeColor="var(--color-sage)" />

        {/* Recording Action Controls */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
          {!isRecording ? (
            <button
              onClick={handleStart}
              className="font-interface"
              style={{
                flex: 1,
                backgroundColor: 'var(--color-sage)',
                color: 'var(--bg-ground)',
                fontSize: '0.875rem',
                fontWeight: 700,
                padding: '0.75rem',
                borderRadius: '3px',
              }}
            >
              ▶ Start {type}
            </button>
          ) : (
            <>
              <button
                onClick={handlePauseResume}
                className="font-interface"
                style={{
                  flex: 1,
                  backgroundColor: isPaused ? 'var(--color-sage)' : 'var(--surface-active)',
                  color: isPaused ? 'var(--bg-ground)' : 'var(--text-chalk)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  padding: '0.75rem',
                  borderRadius: '3px',
                }}
              >
                {isPaused ? '▶ Resume' : '⏸ Pause'}
              </button>
              <button
                onClick={handleFinish}
                className="font-interface"
                style={{
                  flex: 1,
                  backgroundColor: 'var(--color-ochre)',
                  color: 'var(--bg-ground)',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  padding: '0.75rem',
                  borderRadius: '3px',
                }}
              >
                ⏹ Finish & Save Workout
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};
