import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { TrajectoryPoint } from '../data/types';

interface TrajectoryMapProps {
  points: TrajectoryPoint[];
  activeIndex?: number;
  showAmbiguousPaths?: boolean;
  height?: string;
}

// Controller to fit bounds to trajectory points
const BoundsController: React.FC<{ points: TrajectoryPoint[] }> = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [points, map]);

  return null;
};

// Moving vehicle icon controller
const MovingVehicleController: React.FC<{ point: TrajectoryPoint }> = ({ point }) => {
  const map = useMap();
  useEffect(() => {
    map.panTo([point.lat, point.lng], { animate: true, duration: 0.6 });
  }, [point, map]);
  return null;
};

const createNumberedIcon = (num: number, confidence: number, isActive: boolean) => {
  const color = confidence >= 90 ? '#2E7D32' : confidence >= 85 ? '#ED9B00' : '#C62828';
  const activeClass = isActive ? 'ring-4 ring-[#E8891A] scale-125 z-50' : 'shadow-md';

  const html = `
    <div style="
      background-color: ${color};
      color: white;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: bold;
      border: 2px solid white;
    " class="${activeClass}">
      ${num}
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-trajectory-marker',
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -13],
  });
};

const createVehicleIcon = () => {
  const html = `
    <div style="
      background-color: #1F3A6E;
      color: #E8891A;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      border: 2px solid white;
      box-shadow: 0 0 10px rgba(232, 137, 26, 0.8);
    " class="animate-bounce">
      🚗
    </div>
  `;
  return L.divIcon({
    html,
    className: 'custom-vehicle-moving-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

export const TrajectoryMap: React.FC<TrajectoryMapProps> = ({
  points,
  activeIndex = 0,
  showAmbiguousPaths = false,
  height = '480px',
}) => {
  if (points.length === 0) {
    return (
      <div style={{ height }} className="bg-gray-100 flex items-center justify-center text-gray-500 rounded border">
        No coordinate points available for trajectory mapping
      </div>
    );
  }

  const positions: [number, number][] = points.map((p) => [p.lat, p.lng]);
  const activePoint = points[activeIndex] || points[0];

  // Alternate ambiguous dashed route if toggled
  const alternatePositions: [number, number][] = points.map((p, i) => [
    p.lat + (i % 2 === 0 ? 0.005 : -0.005),
    p.lng + (i % 2 === 0 ? -0.004 : 0.004),
  ]);

  return (
    <div style={{ height, width: '100%', position: 'relative' }} className="rounded overflow-hidden border border-[#DDE3EA]">
      <MapContainer
        center={[points[0].lat, points[0].lng]}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <BoundsController points={points} />
        {activePoint && <MovingVehicleController point={activePoint} />}

        {/* Primary trajectory polyline */}
        <Polyline
          positions={positions}
          pathOptions={{
            color: '#1F3A6E',
            weight: 4,
            opacity: 0.85,
            lineJoin: 'round',
          }}
        />

        {/* Ambiguous alternate paths */}
        {showAmbiguousPaths && (
          <Polyline
            positions={alternatePositions}
            pathOptions={{
              color: '#ED9B00',
              weight: 3,
              opacity: 0.7,
              dashArray: '6, 6',
            }}
          />
        )}

        {/* Numbered point markers */}
        {points.map((p, index) => {
          const isActive = index === activeIndex;
          return (
            <Marker
              key={`${p.cameraId}-${index}`}
              position={[p.lat, p.lng]}
              icon={createNumberedIcon(index + 1, p.confidence, isActive)}
            >
              <Popup>
                <div className="p-1 min-w-[170px] font-sans text-xs">
                  <div className="flex justify-between items-center border-b pb-1 mb-1">
                    <span className="font-bold text-[#1F3A6E]">Stop #{index + 1}</span>
                    <span className="font-mono text-gray-500">{p.cameraId}</span>
                  </div>
                  <p className="font-semibold text-gray-800">{p.cameraName}</p>
                  <p className="text-gray-500 mt-0.5">
                    {new Date(p.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <div className="mt-2 pt-1 border-t flex justify-between">
                    <span>Confidence:</span>
                    <span
                      className={`font-bold ${
                        p.confidence >= 90 ? 'text-green-700' : p.confidence >= 85 ? 'text-amber-700' : 'text-red-700'
                      }`}
                    >
                      {p.confidence}%
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Recorded Speed:</span>
                    <span className="font-semibold">{p.speed} km/h</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Moving replay vehicle marker */}
        {activePoint && (
          <Marker position={[activePoint.lat, activePoint.lng]} icon={createVehicleIcon()}>
            <Popup>
              <div className="text-xs font-sans font-semibold">
                Simulated Vehicle Position (Stop #{activeIndex + 1})
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};
