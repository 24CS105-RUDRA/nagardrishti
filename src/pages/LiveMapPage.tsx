import React, { useState, useEffect } from 'react';
import { Breadcrumbs, StatusChip } from '../components/ui';
import { CityMap } from '../components/CityMap';
import { cameras } from '../data/cameras';
import { useToastStore } from '../store';
import {
  Camera as CameraIcon,
  Radio,
  Clock,
  Layers,
  History,
  X,
  Sliders,
  CheckCircle,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import type { Camera } from '../data/types';

const sampleRecentPlates = [
  'GJ01AB1234',
  'GJ05CD5678',
  'GJ18EF9012',
  'GJ01MN7890',
  'GJ06PQ2345',
  'GJ23RS6789',
  'GJ01TU0123',
  'GJ05VW4567',
  'GJ18XY8901',
  'GJ01ZZ3333',
  'GJ06AA7777',
  'GJ23BB1111',
];

export const LiveMapPage: React.FC = () => {
  const { addToast } = useToastStore();

  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(cameras[0]);
  const [clusterMode, setClusterMode] = useState(true);
  const [heatmapWindow, setHeatmapWindow] = useState(60);
  const [liveClock, setLiveClock] = useState(new Date());

  // Auto-updating live plate reads for side panel
  const [liveReads, setLiveReads] = useState<Array<{ plate: string; time: Date; conf: number; isNew?: boolean }>>([]);

  const onlineCount = cameras.filter((c) => c.status === 'online').length;
  const offlineCount = cameras.filter((c) => c.status === 'offline').length;
  const alertingCount = cameras.filter((c) => c.status === 'alerting').length;

  // Running live clock
  useEffect(() => {
    const timer = setInterval(() => setLiveClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Update plate reads for selected camera
  useEffect(() => {
    if (!selectedCamera) return;

    // Seed 5 initial reads
    const initial = Array.from({ length: 5 }, (_, i) => ({
      plate: sampleRecentPlates[Math.floor(Math.random() * sampleRecentPlates.length)],
      time: new Date(Date.now() - (i + 1) * 35000),
      conf: Math.floor(88 + Math.random() * 11),
    }));
    setLiveReads(initial);

    // Add new plate read every 3-4s
    const readTimer = setInterval(() => {
      const newRead = {
        plate: sampleRecentPlates[Math.floor(Math.random() * sampleRecentPlates.length)],
        time: new Date(),
        conf: Math.floor(91 + Math.random() * 8),
        isNew: true,
      };

      setLiveReads((curr) => [newRead, ...curr.slice(0, 4)]);
    }, 3500);

    return () => clearInterval(readTimer);
  }, [selectedCamera]);

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Live Camera Network Map' }]} />

      {/* Control & Status Bar */}
      <div className="bg-white border border-[#DDE3EA] rounded-md shadow-sm p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-[#1F3A6E] tracking-tight">
            Live Network Surveillance (50 High-Speed ANPR Nodes)
          </h1>
          <p className="text-xs text-gray-500">
            Real-time optical camera node telemetry with active license plate OCR stream
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 bg-green-50 text-[#2E7D32] border border-green-200 px-2.5 py-1 rounded font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#2E7D32]" /> {onlineCount} Online
          </div>
          <div className="flex items-center gap-1.5 bg-red-50 text-[#C62828] border border-red-200 px-2.5 py-1 rounded font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#C62828] animate-ping" /> {alertingCount} Alerting
          </div>
          <div className="flex items-center gap-1.5 bg-gray-100 text-gray-700 border border-gray-300 px-2.5 py-1 rounded font-semibold">
            <span className="w-2 h-2 rounded-full bg-gray-400" /> {offlineCount} Offline
          </div>
        </div>
      </div>

      {/* Slider controls & Cluster toggle */}
      <div className="bg-white border border-[#DDE3EA] rounded-md shadow-sm px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setClusterMode(!clusterMode);
              addToast({
                type: 'info',
                title: 'Node Grouping',
                message: clusterMode ? 'Switched to Individual Camera Nodes' : 'Camera Clustering Enabled',
              });
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded border font-semibold transition-colors ${
              clusterMode
                ? 'bg-[#1F3A6E] text-white border-[#1F3A6E]'
                : 'bg-white text-gray-700 border-[#DDE3EA]'
            }`}
          >
            <Layers size={13} /> {clusterMode ? 'Cluster View Active' : 'Individual Nodes'}
          </button>

          <div className="flex items-center gap-2">
            <Sliders size={13} className="text-gray-500" />
            <span className="text-gray-600 font-medium">Heatmap Time-Window:</span>
            <input
              type="range"
              min="15"
              max="180"
              step="15"
              value={heatmapWindow}
              onChange={(e) => setHeatmapWindow(Number(e.target.value))}
              className="w-28 accent-[#1F3A6E]"
            />
            <span className="font-mono font-bold text-[#1F3A6E]">{heatmapWindow} mins</span>
          </div>
        </div>

        <div className="text-gray-500 font-mono text-[11px]">
          Map Center: Gujarat Corridor (23.05°N, 72.58°E)
        </div>
      </div>

      {/* Full-Page Map Layout with Collapsible Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* The Live Map */}
        <div className={selectedCamera ? 'lg:col-span-8' : 'lg:col-span-12'}>
          <CityMap
            cameras={cameras}
            selectedCameraId={selectedCamera?.id}
            onSelectCamera={(cam) => setSelectedCamera(cam)}
            showHeatmap={true}
            showCameras={true}
            showCongestionZones={true}
            height="620px"
          />
        </div>

        {/* Live Side Panel */}
        {selectedCamera && (
          <div className="lg:col-span-4 bg-white border border-[#DDE3EA] rounded-md shadow-sm p-4 flex flex-col justify-between h-[620px]">
            <div>
              <div className="flex items-start justify-between border-b pb-2 mb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-gray-400">
                    GATE ID: {selectedCamera.id}
                  </span>
                  <h3 className="text-sm font-bold text-[#1F3A6E] leading-tight">
                    {selectedCamera.name}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">{selectedCamera.zone}</p>
                </div>
                <button
                  onClick={() => setSelectedCamera(null)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Live Optical Feed Placeholder */}
              <div className="relative w-full h-44 bg-gray-900 rounded-md overflow-hidden flex items-center justify-center border border-gray-800 shadow-inner mb-3">
                <div className="text-center text-gray-400">
                  <CameraIcon size={30} className="mx-auto mb-1 opacity-60 text-blue-200" />
                  <p className="text-[11px] font-mono text-gray-400">OPTICAL RTSP ENCRYPTED STREAM</p>
                  <p className="text-[10px] text-gray-500">{selectedCamera.resolution} @ 30 FPS</p>
                </div>

                <div className="absolute top-2 left-2 flex items-center gap-1 bg-[#C62828] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  <Radio size={10} className="animate-pulse" /> LIVE
                </div>

                <div className="absolute bottom-2 right-2 text-[10px] font-mono text-green-400 bg-black/70 px-2 py-0.5 rounded">
                  {liveClock.toLocaleTimeString('en-IN')}
                </div>
              </div>

              {/* Hardware specifications */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-2.5 rounded border border-[#DDE3EA] mb-3">
                <div>
                  <span className="text-gray-500">Node Status:</span>
                  <div className="mt-0.5">
                    <StatusChip status={selectedCamera.status} />
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">24h OCR Avg:</span>
                  <p className="font-bold text-[#1F3A6E] mt-0.5">{selectedCamera.ocrAccuracy}%</p>
                </div>
                <div>
                  <span className="text-gray-500">Hardware:</span>
                  <p className="font-semibold text-gray-800">{selectedCamera.make}</p>
                </div>
                <div>
                  <span className="text-gray-500">Internal IP:</span>
                  <p className="font-mono text-gray-700">{selectedCamera.ipAddress}</p>
                </div>
              </div>

              {/* Auto-updating Last 5 Plate Reads */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                    Live Plate Detections (Last 5)
                  </h4>
                  <span className="text-[10px] text-gray-400">Stream active</span>
                </div>

                <div className="space-y-1.5">
                  {liveReads.map((read, idx) => (
                    <div
                      key={`${read.plate}-${idx}`}
                      className={`px-3 py-1.5 rounded border flex items-center justify-between text-xs transition-colors ${
                        read.isNew
                          ? 'bg-amber-50/70 border-amber-200'
                          : 'bg-white border-gray-100 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#1F3A6E]">{read.plate}</span>
                        <span className="text-[10px] text-gray-500">
                          {new Date(read.time).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] font-bold text-[#2E7D32]">
                        {read.conf}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-[#DDE3EA]">
              <button
                onClick={() =>
                  addToast({
                    type: 'info',
                    title: 'Feed Archive',
                    message: `Loading 72-hour ANPR optical archive for ${selectedCamera.name}`,
                  })
                }
                className="w-full py-2 bg-[#1F3A6E] hover:bg-[#162B52] text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs"
              >
                <History size={13} /> View Camera Feed History
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
