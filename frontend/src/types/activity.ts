export type ActivityType = 'RUN' | 'WALK' | 'CYCLING';

export type GPSCoordinate = [number, number]; // [latitude, longitude]

export interface Activity {
  id: string;
  userId: string;
  name: string;
  type: ActivityType;
  distanceMeters: number;
  durationSeconds: number;
  paceMinPerKm: number;
  caloriesBurned: number;
  elevationGainM: number;
  averageHeartRate?: number | null;
  routeCoordinates?: GPSCoordinate[] | string | null;
  startDate: string;
  createdAt?: string;
}

export interface LiveTrackingState {
  isActive: boolean;
  isPaused: boolean;
  type: ActivityType;
  startTime: number | null;
  elapsedSeconds: number;
  distanceMeters: number;
  currentPaceMinPerKm: number;
  caloriesBurned: number;
  routeCoordinates: GPSCoordinate[];
}
