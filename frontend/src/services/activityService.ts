import { Activity, GPSCoordinate, ActivityType } from '../types/activity';

const API_BASE_URL = 'http://localhost:4000/api';
const STORAGE_KEY = 'trackbite_activities_v1';

// Preset scenic routes for live simulation
export const SIMULATED_GPS_ROUTES: { [key in ActivityType]: GPSCoordinate[] } = {
  RUN: [
    [40.785091, -73.968285],
    [40.786522, -73.966955],
    [40.788147, -73.965410],
    [40.790163, -73.963436],
    [40.791528, -73.960947],
    [40.789512, -73.958286],
    [40.786912, -73.957600],
    [40.784442, -73.959230],
    [40.783142, -73.962062],
    [40.783467, -73.965152],
    [40.785091, -73.968285],
  ],
  WALK: [
    [40.712776, -74.013382],
    [40.714200, -74.013800],
    [40.716100, -74.014500],
    [40.718000, -74.015100],
    [40.720200, -74.015400],
    [40.722500, -74.015100],
    [40.724800, -74.014200],
    [40.727000, -74.013500],
  ],
  CYCLING: [
    [40.758896, -73.985130],
    [40.763000, -73.980000],
    [40.769000, -73.973000],
    [40.776000, -73.968000],
    [40.784000, -73.961000],
    [40.792000, -73.954000],
    [40.801000, -73.948000],
  ],
};

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act-park-5k',
    userId: 'user-alex-mercer',
    name: 'Morning Reservoir 5K Loop',
    type: 'RUN',
    distanceMeters: 5120,
    durationSeconds: 1620, // 27 mins
    paceMinPerKm: 5.27,
    caloriesBurned: 385.0,
    elevationGainM: 42.0,
    averageHeartRate: 156,
    routeCoordinates: SIMULATED_GPS_ROUTES.RUN,
    startDate: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'act-river-walk',
    userId: 'user-alex-mercer',
    name: 'Sunset Waterfront Recovery Walk',
    type: 'WALK',
    distanceMeters: 3450,
    durationSeconds: 2400, // 40 mins
    paceMinPerKm: 11.59,
    caloriesBurned: 180.0,
    elevationGainM: 12.0,
    averageHeartRate: 104,
    routeCoordinates: SIMULATED_GPS_ROUTES.WALK,
    startDate: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
  },
  {
    id: 'act-tempo-intervals',
    userId: 'user-alex-mercer',
    name: 'Threshold Tempo Intervals',
    type: 'RUN',
    distanceMeters: 7800,
    durationSeconds: 2460, // 41 mins
    paceMinPerKm: 5.25,
    caloriesBurned: 590.0,
    elevationGainM: 75.0,
    averageHeartRate: 168,
    routeCoordinates: SIMULATED_GPS_ROUTES.CYCLING,
    startDate: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
  },
];

// Calculate distance in meters between two lat/lng points using Haversine formula
export function calculateHaversineDistance(coord1: GPSCoordinate, coord2: GPSCoordinate): number {
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export function formatPace(paceMinPerKm: number): string {
  if (!paceMinPerKm || !isFinite(paceMinPerKm) || paceMinPerKm <= 0) return "--:-- /km";
  const mins = Math.floor(paceMinPerKm);
  const secs = Math.round((paceMinPerKm - mins) * 60);
  return `${mins}:${secs.toString().padStart(2, '0')} /km`;
}

export function formatDistance(distanceMeters: number): string {
  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)} m`;
  }
  return `${(distanceMeters / 1000).toFixed(2)} km`;
}

export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) {
    return `${hrs}h ${mins.toString().padStart(2, '0')}m`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export async function fetchUserActivities(userId: string): Promise<Activity[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/activities/${userId}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        // Parse routeCoordinates if string
        return data.map((act) => ({
          ...act,
          routeCoordinates:
            typeof act.routeCoordinates === 'string'
              ? JSON.parse(act.routeCoordinates)
              : act.routeCoordinates,
        }));
      }
    }
  } catch (e) {
    console.warn('Backend API unavailable, falling back to local activity cache', e);
  }

  // Fallback to local storage or defaults
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) return JSON.parse(cached);
  } catch {
    // ignore
  }

  return INITIAL_ACTIVITIES;
}

export async function saveActivity(
  userId: string,
  activityData: Omit<Activity, 'id' | 'createdAt'>
): Promise<Activity> {
  let createdActivity: Activity = {
    ...activityData,
    id: `act-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  try {
    const res = await fetch(`${API_BASE_URL}/activities/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activityData),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.activity) {
        createdActivity = {
          ...json.activity,
          routeCoordinates:
            typeof json.activity.routeCoordinates === 'string'
              ? JSON.parse(json.activity.routeCoordinates)
              : json.activity.routeCoordinates,
        };
      }
    }
  } catch (e) {
    console.warn('Backend API save failed, saving to local cache', e);
  }

  // Update local storage cache
  try {
    const existing = await fetchUserActivities(userId);
    const updated = [createdActivity, ...existing.filter((a) => a.id !== createdActivity.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }

  return createdActivity;
}
