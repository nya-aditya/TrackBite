import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Activity } from '../../types/activity';
import {
  fetchUserActivities,
  formatDistance,
  formatDuration,
  formatPace,
} from '../../services/activityService';
import { ActivityMap } from './ActivityMap';
import { LiveActivityTrackerModal } from './LiveActivityTrackerModal';

export const ActivitiesView: React.FC = () => {
  const { user, showToast } = useApp();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const loadActivities = async () => {
    const list = await fetchUserActivities(user.id);
    setActivities(list);
    if (list.length > 0 && !selectedActivity) {
      setSelectedActivity(list[0]);
    }
  };

  useEffect(() => {
    loadActivities();
  }, [user.id]);

  const filtered = useMemo(() => {
    if (filterType === 'ALL') return activities;
    return activities.filter((a) => a.type === filterType);
  }, [activities, filterType]);

  const totalDistanceMeters = useMemo(() => {
    return activities.reduce((sum, a) => sum + a.distanceMeters, 0);
  }, [activities]);

  const totalCaloriesBurned = useMemo(() => {
    return activities.reduce((sum, a) => sum + a.caloriesBurned, 0);
  }, [activities]);

  const handleDeleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
    showToast('Activity log deleted');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header & Recording Trigger */}
      <div
        style={{
          backgroundColor: 'var(--surface-panel)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '4px',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-sage)',
              }}
            />
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
              GPS Activity & Endurance Logs
            </h2>
            <span
              className="font-telemetry"
              style={{
                fontSize: '0.625rem',
                color: 'var(--color-sage)',
                backgroundColor: 'var(--color-sage-dim)',
                border: '1px solid var(--color-sage-border)',
                padding: '0.1rem 0.4rem',
                borderRadius: '2px',
              }}
            >
              STRAVA CORE
            </span>
          </div>
          <p className="font-interface" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Track outdoor runs, walks, and cycling with live GPS mapping and adaptive carb replenishment
          </p>
        </div>

        <button
          onClick={() => setIsTrackerOpen(true)}
          className="font-interface"
          style={{
            backgroundColor: 'var(--color-sage)',
            color: 'var(--bg-ground)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            padding: '0.55rem 1.25rem',
            borderRadius: '3px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
          }}
        >
          <span>▶</span>
          <span>Record Run / Walk</span>
        </button>
      </div>

      {/* Aggregate Stats Summary Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--surface-recessed)',
            padding: '1rem',
            borderRadius: '3px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div className="font-interface" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
            TOTAL DISTANCE LOGGED
          </div>
          <div className="font-telemetry" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-chalk)' }}>
            {formatDistance(totalDistanceMeters)}
          </div>
          <div className="font-interface" style={{ fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
            Across {activities.length} workouts
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--surface-recessed)',
            padding: '1rem',
            borderRadius: '3px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div className="font-interface" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
            CUMULATIVE CALORIES BURNED
          </div>
          <div className="font-telemetry" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-ochre)' }}>
            {Math.round(totalCaloriesBurned).toLocaleString()} kcal
          </div>
          <div className="font-interface" style={{ fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
            Replenished via adaptive carbs
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--surface-recessed)',
            padding: '1rem',
            borderRadius: '3px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div className="font-interface" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
            AVG PACE (RUNNING)
          </div>
          <div className="font-telemetry" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-sage)' }}>
            5:21 /km
          </div>
          <div className="font-interface" style={{ fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
            Aerobic threshold zone
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem' }}>
        {[
          { id: 'ALL', label: 'All Activities' },
          { id: 'RUN', label: '🏃 Running' },
          { id: 'WALK', label: '🚶 Walking' },
          { id: 'CYCLING', label: '🚴 Cycling' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className="font-interface"
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '2px',
              fontSize: '0.75rem',
              fontWeight: filterType === tab.id ? 600 : 500,
              backgroundColor: filterType === tab.id ? 'var(--color-sage)' : 'var(--surface-recessed)',
              color: filterType === tab.id ? 'var(--bg-ground)' : 'var(--text-muted)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Past Activities Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filtered.map((activity) => (
          <div
            key={activity.id}
            style={{
              backgroundColor: 'var(--surface-panel)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '4px',
              padding: '1.25rem',
              display: 'grid',
              gridTemplateColumns: 'minmax(240px, 1fr) 280px',
              gap: '1.5rem',
              alignItems: 'center',
            }}
          >
            {/* Left Column: Details & Stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.1rem' }}>
                    {activity.type === 'RUN' ? '🏃' : activity.type === 'WALK' ? '🚶' : '🚴'}
                  </span>
                  <div>
                    <h3
                      className="font-interface"
                      style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-chalk)' }}
                    >
                      {activity.name}
                    </h3>
                    <div className="font-telemetry" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                      {new Date(activity.startDate).toLocaleDateString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteActivity(activity.id)}
                  style={{ color: 'var(--text-dim)', fontSize: '0.875rem', padding: '0.2rem' }}
                  title="Delete activity"
                >
                  ✕
                </button>
              </div>

              {/* 4 Metric Columns */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '0.5rem',
                  backgroundColor: 'var(--surface-recessed)',
                  padding: '0.75rem',
                  borderRadius: '3px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <div className="font-interface" style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
                    DISTANCE
                  </div>
                  <div className="font-telemetry" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-chalk)' }}>
                    {formatDistance(activity.distanceMeters)}
                  </div>
                </div>

                <div>
                  <div className="font-interface" style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
                    DURATION
                  </div>
                  <div className="font-telemetry" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-chalk)' }}>
                    {formatDuration(activity.durationSeconds)}
                  </div>
                </div>

                <div>
                  <div className="font-interface" style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
                    AVG PACE
                  </div>
                  <div className="font-telemetry" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-sage)' }}>
                    {formatPace(activity.paceMinPerKm)}
                  </div>
                </div>

                <div>
                  <div className="font-interface" style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
                    BURN
                  </div>
                  <div className="font-telemetry" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-ochre)' }}>
                    {Math.round(activity.caloriesBurned)} kcal
                  </div>
                </div>
              </div>

              {/* Adaptive Nutrition Feedback */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.75rem',
                  color: 'var(--color-sage)',
                }}
              >
                <span>⚡</span>
                <span className="font-interface">
                  Adaptive impact: +{Math.round(activity.caloriesBurned)} kcal & +{Math.round((activity.caloriesBurned * 0.12))}g clean carbs buffered to daily prescription.
                </span>
              </div>
            </div>

            {/* Right Column: GPS Polyline Map */}
            <div>
              <ActivityMap coordinates={activity.routeCoordinates} height={155} strokeColor="var(--color-sage)" />
            </div>
          </div>
        ))}
      </div>

      {/* Live Tracker Modal */}
      <LiveActivityTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        onActivitySaved={loadActivities}
      />
    </div>
  );
};
