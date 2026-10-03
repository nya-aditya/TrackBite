import React, { useMemo } from 'react';
import { GPSCoordinate } from '../../types/activity';

interface ActivityMapProps {
  coordinates?: GPSCoordinate[] | string | null;
  height?: number | string;
  strokeColor?: string;
  showPoints?: boolean;
}

export const ActivityMap: React.FC<ActivityMapProps> = ({
  coordinates,
  height = 200,
  strokeColor = 'var(--color-sage)',
  showPoints = true,
}) => {
  const coordsList: GPSCoordinate[] = useMemo(() => {
    if (!coordinates) return [];
    if (typeof coordinates === 'string') {
      try {
        return JSON.parse(coordinates);
      } catch {
        return [];
      }
    }
    return coordinates;
  }, [coordinates]);

  // Project lat/lng to normalized SVG space [0, 100] with aspect ratio padding
  const { pathData, startPoint, endPoint, hasValidPath } = useMemo(() => {
    if (!coordsList || coordsList.length < 2) {
      return { pathData: '', startPoint: null, endPoint: null, hasValidPath: false };
    }

    const lats = coordsList.map((c) => c[0]);
    const lngs = coordsList.map((c) => c[1]);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const latSpan = Math.max(maxLat - minLat, 0.0001);
    const lngSpan = Math.max(maxLng - minLng, 0.0001);

    // Padding in viewbox 0-100
    const pad = 12;
    const viewW = 100 - 2 * pad;
    const viewH = 100 - 2 * pad;

    const points = coordsList.map(([lat, lng]) => {
      // Normalize: longitude to X, latitude to Y (inverted since SVG Y grows downwards)
      const x = pad + ((lng - minLng) / lngSpan) * viewW;
      const y = pad + (1 - (lat - minLat) / latSpan) * viewH;
      return [x, y] as [number, number];
    });

    const pathStr = points.reduce((acc, [x, y], idx) => {
      return idx === 0 ? `M ${x.toFixed(1)} ${y.toFixed(1)}` : `${acc} L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }, '');

    return {
      pathData: pathStr,
      startPoint: points[0],
      endPoint: points[points.length - 1],
      hasValidPath: true,
    };
  }, [coordsList]);

  if (!hasValidPath) {
    return (
      <div
        style={{
          height,
          backgroundColor: 'var(--surface-recessed)',
          borderRadius: '4px',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
        }}
      >
        <span style={{ fontSize: '1.25rem' }}>📍</span>
        <span className="font-telemetry" style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          NO GPS ROUTE DATA
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        height,
        backgroundColor: 'var(--surface-recessed)',
        borderRadius: '4px',
        border: '1px solid var(--border-subtle)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Background athletic diagnostic grid */}
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0, opacity: 0.15 }}
      >
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--border-focus)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Polyline Path SVG */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        style={{ width: '100%', height: '100%', padding: '0.5rem' }}
      >
        {/* Glow drop-filter */}
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Shadow path */}
        <path
          d={pathData}
          fill="none"
          stroke="rgba(0,0,0,0.5)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Primary glowing athletic route line */}
        <path
          d={pathData}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
        />

        {/* Start Point Pin (Green dot) */}
        {showPoints && startPoint && (
          <circle
            cx={startPoint[0]}
            cy={startPoint[1]}
            r="3.5"
            fill="var(--color-sage)"
            stroke="var(--bg-ground)"
            strokeWidth="1.2"
          />
        )}

        {/* Finish Point Pin (Orange/Chalk dot) */}
        {showPoints && endPoint && (
          <circle
            cx={endPoint[0]}
            cy={endPoint[1]}
            r="3.5"
            fill="var(--color-ochre)"
            stroke="var(--bg-ground)"
            strokeWidth="1.2"
          />
        )}
      </svg>

      {/* Map Legend Overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          backgroundColor: 'rgba(14, 16, 19, 0.8)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '2px',
          padding: '0.2rem 0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-sage)' }} />
          <span className="font-telemetry" style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
            Start
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-ochre)' }} />
          <span className="font-telemetry" style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
            End
          </span>
        </div>
        <span className="font-telemetry" style={{ fontSize: '0.625rem', color: 'var(--text-dim)' }}>
          {coordsList.length} pts
        </span>
      </div>
    </div>
  );
};
