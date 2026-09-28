import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Camera } from '../data/types';

interface CityMapProps {
  cameras: Camera[];
  selectedCameraId?: string | null;
  onSelectCamera?: (camera: Camera) => void;
  showHeatmap?: boolean;
  showCameras?: boolean;
  showCongestionZones?: boolean;
  center?: [number, number];
  zoom?: number;
  height?: string;
}

// Controller component to pan smoothly
const MapController: React.FC<{ center?: [number, number]; zoom?: number; selectedCamera?: Camera | null }> = ({
  center,
  zoom,
  selectedCamera,
}) => {
  const map = useMap();

  useEffect(() => {
    if (selectedCamera) {
      map.flyTo([selectedCamera.lat, selectedCamera.lng], 15, { duration: 1.2 });
    } else if (center) {
      map.setView(center, zoom || 11);
    }
  }, [selectedCamera, center, zoom, map]);

  return null;
};

// Create custom colored markers
const createCameraIcon = (status: Camera['status'], isSelected: boolean) => {
  const color = status === 'online' ? '#2E7D32' : status === 'alerting' ? '#C62828' : '#6B7280';
  const pulse = status === 'alerting' ? 'animate-ping' : '';
  const border = isSelected ? 'border-[#E8891A] scale-125' : 'border-white';

  const html = `
    <div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
      ${
        status === 'alerting'
          ? `<span style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background-color: #C62828; opacity: 0.6;" class="${pulse}"></span>`
          : ''
      }
      <div style="width: 14px; height: 14px; border-radius: 50%; background-color: ${color}; border: 2px solid white; box-shadow: 0 1px 4px rgba(0,0,0,0.4);" class="${border}"></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-camera-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

// Zone centers for congestion overlays
const zoneCenters: Record<string, { lat: number; lng: number; radius: number; color: string; label: string }> = {
  'Zone-A': { lat: 23.06, lng: 72.52, radius: 4500, color: '#E8891A', label: 'Zone A - SG Highway' },
  'Zone-B': { lat: 23.03, lng: 72.56, radius: 3000, color: '#C62828', label: 'Zone B - CG Road/Ellis Bridge (High)' },
  'Zone-C': { lat: 23.02, lng: 72.57, radius: 2800, color: '#ED9B00', label: 'Zone C - Ashram Rd/Riverfront' },
  'Zone-D': { lat: 23.03, lng: 72.52, radius: 3200, color: '#1565C0', label: 'Zone D - Satellite/Vastrapur' },
  'Zone-E': { lat: 23.00, lng: 72.61, radius: 3800, color: '#C62828', label: 'Zone E - Maninagar (Bottleneck)' },
  'Zone-F': { lat: 23.08, lng: 72.61, radius: 4200, color: '#2E7D32', label: 'Zone F - Naroda/Chandkheda' },
  'Zone-G': { lat: 23.21, lng: 72.65, radius: 5500, color: '#2E7D32', label: 'Zone G - Gandhinagar Sector Grid' },
  'Zone-H': { lat: 22.55, lng: 72.94, radius: 4000, color: '#2E7D32', label: 'Zone H - Anand/Vidyanagar' },
};

export const CityMap: React.FC<CityMapProps> = ({
  cameras,
  selectedCameraId,
  onSelectCamera,
  showHeatmap = true,
  showCameras = true,
  showCongestionZones = true,
  center = [23.045, 72.56],
  zoom = 11,
  height = '420px',
}) => {
  const selectedCamera = cameras.find((c) => c.id === selectedCameraId) || null;

  return (
    <div style={{ height, width: '100%', position: 'relative' }} className="rounded overflow-hidden border border-[#DDE3EA]">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController center={center} zoom={zoom} selectedCamera={selectedCamera} />

        {/* Congestion zones layer */}
        {showCongestionZones &&
          Object.entries(zoneCenters).map(([key, zone]) => (
            <Circle
              key={key}
              center={[zone.lat, zone.lng]}
              radius={zone.radius}
              pathOptions={{
                color: zone.color,
                fillColor: zone.color,
                fillOpacity: 0.12,
                weight: 1.5,
                dashArray: '4, 4',
              }}
            >
              <Popup>
                <div className="text-xs font-sans">
                  <p className="font-bold text-[#1F3A6E]">{zone.label}</p>
                  <p className="text-gray-600 mt-0.5">Surveillance Zone Boundary</p>
                </div>
              </Popup>
            </Circle>
          ))}

        {/* Heatmap density blobs around cameras */}
        {showHeatmap &&
          cameras.map((cam) => {
            const isAlerting = cam.status === 'alerting';
            const densityScore = isAlerting ? 95 : cam.zone === 'Zone-B' || cam.zone === 'Zone-E' ? 82 : 45;
            const heatColor = densityScore > 80 ? '#C62828' : densityScore > 60 ? '#ED9B00' : '#2E7D32';

            return (
              <CircleMarker
                key={`heat-${cam.id}`}
                center={[cam.lat, cam.lng]}
                radius={densityScore > 80 ? 24 : 16}
                pathOptions={{
                  color: 'transparent',
                  fillColor: heatColor,
                  fillOpacity: 0.28,
                }}
              />
            );
          })}

        {/* Camera markers layer */}
        {showCameras &&
          cameras.map((cam) => {
            const isSelected = cam.id === selectedCameraId;
            return (
              <Marker
                key={cam.id}
                position={[cam.lat, cam.lng]}
                icon={createCameraIcon(cam.status, isSelected)}
                eventHandlers={{
                  click: () => onSelectCamera && onSelectCamera(cam),
                }}
              >
                <Popup>
                  <div className="p-1 min-w-[180px] font-sans">
                    <div className="flex items-center justify-between gap-2 border-b pb-1 mb-1">
                      <span className="font-bold text-xs text-[#1F3A6E]">{cam.id}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-semibold capitalize ${
                          cam.status === 'online'
                            ? 'bg-green-100 text-green-800'
                            : cam.status === 'alerting'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {cam.status}
                      </span>
                    </div>
                    <p className="font-semibold text-xs text-gray-800">{cam.name}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{cam.zone} · {cam.make}</p>
                    <div className="mt-2 pt-1 border-t flex justify-between text-[11px]">
                      <span>OCR Accuracy:</span>
                      <span className="font-bold text-[#1F3A6E]">{cam.ocrAccuracy}%</span>
                    </div>
                    {onSelectCamera && (
                      <button
                        onClick={() => onSelectCamera(cam)}
                        className="mt-2 w-full text-center bg-[#1F3A6E] text-white py-1 px-2 text-[11px] rounded hover:bg-[#162B52]"
                      >
                        View Node Details
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
    </div>
  );
};
