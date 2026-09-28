import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Camera as CameraIcon,
  AlertTriangle,
  Gauge,
  Eye,
  Download,
  ChevronDown,
  Layers,
  ArrowRight,
  X,
  MapPin,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Breadcrumbs, KpiCard, StatusChip } from '../components/ui';
import { CityMap } from '../components/CityMap';
import { useAlertStore, useToastStore } from '../store';
import {
  getHourlyDensity,
  getSpeedBySegment,
  getVehicleClassSplit,
  getHourlyPeakPattern,
  getODMatrix,
  getCongestionBottlenecks,
  getTrafficDensityByZone,
} from '../data/analytics';
import { cameras, getZones } from '../data/cameras';
import { mockApi } from '../mockApi';
import type { Camera, CongestionBottleneck } from '../data/types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { unreadCount } = useAlertStore();
  const { addToast } = useToastStore();

  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('24h');
  const [densityData, setDensityData] = useState<any[]>([]);
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Map layer controls
  const [layers, setLayers] = useState({
    heatmap: true,
    cameras: true,
    congestion: true,
  });

  // Camera side panel from map or bottleneck table
  const [inspectedCamera, setInspectedCamera] = useState<Camera | null>(null);

  // Live density fluctuation
  const [densityScoreOffset, setDensityScoreOffset] = useState(0);

  const speedData = getSpeedBySegment();
  const vehicleData = getVehicleClassSplit();
  const peakData = getHourlyPeakPattern();
  const odMatrix = getODMatrix();
  const bottlenecks = getCongestionBottlenecks();
  const zoneList = getZones();
  const onlineCameras = cameras.filter((c) => c.status === 'online').length;

  useEffect(() => {
    setLoading(true);
    const data =
      selectedZone === 'all'
        ? getHourlyDensity(timeRange)
        : getTrafficDensityByZone(selectedZone, timeRange);

    mockApi(data, 350).then((res) => {
      setDensityData(res);
      setLoading(false);
    });
  }, [timeRange, selectedZone]);

  // Small random density changes every 5s as requested
  useEffect(() => {
    const interval = setInterval(() => {
      setDensityScoreOffset(Math.floor(Math.random() * 5) - 2);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleExport = useCallback(
    (format: string) => {
      setExporting(true);
      setShowExportMenu(false);
      setTimeout(() => {
        setExporting(false);
        addToast({
          type: 'success',
          title: 'Report Ready',
          message: `Official Gujarat Traffic Report generated as ${format}`,
        });
      }, 1500);
    },
    [addToast]
  );

  const handleBottleneckClick = (b: CongestionBottleneck) => {
    const cam = cameras.find((c) => c.id === b.cameraId);
    if (cam) {
      setInspectedCamera(cam);
    }
  };

  return (
    <div className="space-y-5">
      <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Operational Dashboard' }]} />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-md border border-[#DDE3EA] shadow-sm">
        <div>
          <h1 className="text-lg font-bold text-[#1F3A6E] tracking-tight">
            City-Wide ANPR Command & Traffic Analytics
          </h1>
          <p className="text-xs text-gray-500">
            Real-time optical vehicle trajectory surveillance · Ahmedabad – Gandhinagar – Anand Highway Triangle
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Time range selector */}
          <div className="flex items-center bg-[#F4F6F9] border border-[#DDE3EA] rounded p-0.5">
            {(['1h', '6h', '24h', '7d'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-2.5 py-1 text-xs rounded font-semibold transition-colors ${
                  timeRange === t ? 'bg-[#1F3A6E] text-white shadow-xs' : 'text-gray-600 hover:text-[#1F3A6E]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={exporting}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#1F3A6E] hover:bg-[#162B52] text-white rounded font-medium transition-colors shadow-xs disabled:opacity-50"
            >
              {exporting ? (
                <>
                  <span className="inline-block animate-spin">⟳</span> Preparing...
                </>
              ) : (
                <>
                  <Download size={13} /> Export Report <ChevronDown size={11} />
                </>
              )}
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-1.5 w-44 bg-white border border-[#DDE3EA] rounded-md shadow-lg z-30 py-1 text-xs">
                <button
                  onClick={() => handleExport('PDF')}
                  className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                >
                  <span>Export as PDF (Official)</span>
                  <span className="text-[10px] text-gray-400 font-mono">.pdf</span>
                </button>
                <button
                  onClick={() => handleExport('CSV')}
                  className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                >
                  <span>Export Raw CSV Data</span>
                  <span className="text-[10px] text-gray-400 font-mono">.csv</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <KpiCard
          title="Vehicles Detected"
          value={(184326 + densityScoreOffset * 15).toLocaleString('en-IN')}
          icon={<Activity size={18} className="text-[#1F3A6E]" />}
          subtitle="Today (City-Wide)"
          trend={{ value: '12.4%', positive: true }}
          loading={loading}
        />
        <KpiCard
          title="Active Cameras"
          value={`${onlineCameras} / ${cameras.length}`}
          icon={<CameraIcon size={18} className="text-[#2E7D32]" />}
          subtitle="4 Offline · 2 Alerting"
          onClick={() => navigate('/cameras')}
          loading={loading}
        />
        <KpiCard
          title="Active Alerts"
          value={unreadCount}
          icon={<AlertTriangle size={18} className="text-[#C62828]" />}
          subtitle="Requires Officer Action"
          onClick={() => navigate('/alerts')}
          trend={{ value: '3 Critical', positive: false }}
          loading={loading}
        />
        <KpiCard
          title="Avg City Speed"
          value={`${31 + densityScoreOffset} km/h`}
          icon={<Gauge size={18} className="text-[#ED9B00]" />}
          subtitle="Target: 40 km/h"
          trend={{ value: 'Peak Rush', positive: false }}
          loading={loading}
        />
        <KpiCard
          title="OCR Confidence"
          value="94.6%"
          icon={<Eye size={18} className="text-[#1565C0]" />}
          subtitle="BEL Neural ANPR Engine"
          trend={{ value: '0.8%', positive: true }}
          loading={loading}
        />
      </div>

      {/* Map Section with Layer Chips & Inspected Camera Panel */}
      <div className="bg-white border border-[#DDE3EA] rounded-md shadow-sm p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#1F3A6E] uppercase tracking-wide flex items-center gap-1.5">
              <MapPin size={14} className="text-[#E8891A]" />
              Surveillance Grid: Ahmedabad – Gandhinagar – Anand (50 Nodes)
            </span>
          </div>

          {/* Layer toggles */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-gray-500 font-medium mr-1 flex items-center gap-1">
              <Layers size={12} /> Layers:
            </span>
            <button
              onClick={() => setLayers((p) => ({ ...p, heatmap: !p.heatmap }))}
              className={`px-2.5 py-1 text-xs rounded-full border transition-all ${
                layers.heatmap
                  ? 'bg-amber-50 text-amber-900 border-[#ED9B00] font-semibold'
                  : 'bg-white text-gray-500 border-gray-300'
              }`}
            >
              Heatmap Blobs
            </button>
            <button
              onClick={() => setLayers((p) => ({ ...p, cameras: !p.cameras }))}
              className={`px-2.5 py-1 text-xs rounded-full border transition-all ${
                layers.cameras
                  ? 'bg-blue-50 text-[#1F3A6E] border-[#1F3A6E] font-semibold'
                  : 'bg-white text-gray-500 border-gray-300'
              }`}
            >
              Camera Nodes
            </button>
            <button
              onClick={() => setLayers((p) => ({ ...p, congestion: !p.congestion }))}
              className={`px-2.5 py-1 text-xs rounded-full border transition-all ${
                layers.congestion
                  ? 'bg-red-50 text-red-900 border-[#C62828] font-semibold'
                  : 'bg-white text-gray-500 border-gray-300'
              }`}
            >
              Congestion Zones
            </button>
          </div>
        </div>

        {/* The Leaflet Map */}
        <div className="relative">
          <CityMap
            cameras={cameras}
            selectedCameraId={inspectedCamera?.id}
            onSelectCamera={(cam) => setInspectedCamera(cam)}
            showHeatmap={layers.heatmap}
            showCameras={layers.cameras}
            showCongestionZones={layers.congestion}
            height="440px"
          />

          {/* Inspected Camera Floating Side Panel */}
          {inspectedCamera && (
            <div className="absolute top-3 right-3 w-80 bg-white/95 backdrop-blur-xs border border-[#DDE3EA] rounded-md shadow-xl p-4 z-400">
              <div className="flex items-start justify-between border-b pb-2 mb-2">
                <div>
                  <span className="text-[10px] font-mono text-gray-400 font-bold">
                    {inspectedCamera.id}
                  </span>
                  <h4 className="text-xs font-bold text-[#1F3A6E] leading-tight">
                    {inspectedCamera.name}
                  </h4>
                </div>
                <button
                  onClick={() => setInspectedCamera(null)}
                  className="text-gray-400 hover:text-gray-700"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Zone:</span>
                  <span className="font-semibold text-gray-800">{inspectedCamera.zone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Status:</span>
                  <StatusChip status={inspectedCamera.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">OCR Accuracy:</span>
                  <span className="font-bold text-[#1F3A6E]">{inspectedCamera.ocrAccuracy}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Hardware / IP:</span>
                  <span className="font-mono text-gray-700 text-[11px]">
                    {inspectedCamera.make} · {inspectedCamera.ipAddress}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t flex gap-2">
                <button
                  onClick={() => navigate('/live-map')}
                  className="flex-1 py-1 px-2 text-center text-xs bg-[#1F3A6E] hover:bg-[#162B52] text-white rounded font-medium"
                >
                  Open Live Stream
                </button>
                <button
                  onClick={() => navigate('/cameras')}
                  className="py-1 px-2 text-xs border border-[#DDE3EA] hover:bg-gray-100 rounded text-gray-700"
                >
                  Manage
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart 1: Traffic Density with Per-Zone Dropdown */}
        <div className="bg-white border border-[#DDE3EA] rounded-md p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-gray-800">Traffic Density Trend</h3>
              <p className="text-[11px] text-gray-500">Vehicles per hour across selected sector</p>
            </div>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="text-xs border border-[#DDE3EA] bg-white rounded px-2 py-1 text-gray-700 focus:outline-none focus:border-[#1F3A6E]"
            >
              <option value="all">City-Wide Aggregate</option>
              {zoneList.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name}
                </option>
              ))}
            </select>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={densityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#6B7280' }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#DDE3EA',
                    fontSize: '12px',
                    borderRadius: '4px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="density"
                  stroke="#1F3A6E"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: '#E8891A' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Speed by Road Segment */}
        <div className="bg-white border border-[#DDE3EA] rounded-md p-4 shadow-sm">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-gray-800">Average Speed by Key Segment</h3>
            <p className="text-[11px] text-gray-500">Observed arterial speeds vs speed limits</p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={speedData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" />
                <XAxis type="number" unit=" km/h" tick={{ fontSize: 10, fill: '#6B7280' }} />
                <YAxis
                  dataKey="segment"
                  type="category"
                  tick={{ fontSize: 9.5, fill: '#374151' }}
                  width={140}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#DDE3EA',
                    fontSize: '12px',
                    borderRadius: '4px',
                  }}
                />
                <Bar dataKey="avgSpeed" fill="#1F3A6E" radius={[0, 3, 3, 0]} name="Avg Speed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Vehicle Class Distribution (Donut) */}
        <div className="bg-white border border-[#DDE3EA] rounded-md p-4 shadow-sm">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-gray-800">Vehicle Classification Split</h3>
            <p className="text-[11px] text-gray-500">Breakdown from ANPR optical classifier</p>
          </div>

          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vehicleData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  label={({ name, value }) => `${name} (${value}%)`}
                >
                  {vehicleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val}% of total volume`, 'Volume']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#DDE3EA',
                    fontSize: '12px',
                    borderRadius: '4px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Hourly Peak Pattern */}
        <div className="bg-white border border-[#DDE3EA] rounded-md p-4 shadow-sm">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-gray-800">24-Hour Diurnal Congestion Waves</h3>
            <p className="text-[11px] text-gray-500">Peak morning rush (8-10 AM) & evening surge (5-8 PM)</p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={peakData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#6B7280' }} interval={3} />
                <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#DDE3EA',
                    fontSize: '12px',
                    borderRadius: '4px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="vehicles"
                  stroke="#E8891A"
                  fill="#E8891A"
                  fillOpacity={0.15}
                  strokeWidth={2}
                  name="Detected Traffic"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Origin–Destination (O-D) Matrix Heatmap Grid */}
      <div className="bg-white border border-[#DDE3EA] rounded-md p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-gray-800">Origin–Destination (O-D) Trip Matrix</h3>
            <p className="text-[11px] text-gray-500">
              Corridor travel matrix across 8 surveillance sectors. Click cell to inspect trajectory corridor.
            </p>
          </div>
          <span className="text-[11px] text-gray-500">Color intensity reflects trip density</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-[#F4F6F9] border-b border-[#DDE3EA]">
                <th className="p-2 text-left text-gray-600 font-semibold">Origin \ Destination</th>
                {odMatrix.zones.map((z) => (
                  <th key={z} className="p-2 text-center text-gray-600 font-semibold">
                    {z}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {odMatrix.zones.map((origZone, rowIdx) => (
                <tr key={origZone} className="border-b border-[#DDE3EA]/60">
                  <td className="p-2 font-bold text-[#1F3A6E] bg-gray-50/50">{origZone}</td>
                  {odMatrix.matrix[rowIdx].map((volume, colIdx) => {
                    const destZone = odMatrix.zones[colIdx];
                    const isSelf = origZone === destZone;
                    const maxVal = 4500;
                    const intensity = isSelf ? 0 : Math.min(volume / maxVal, 1);
                    const bg = isSelf ? '#F9FAFB' : `rgba(31, 58, 110, ${0.08 + intensity * 0.75})`;
                    const textColor = intensity > 0.45 && !isSelf ? '#FFFFFF' : '#1F2937';

                    return (
                      <td
                        key={destZone}
                        className="p-2 text-center font-mono cursor-pointer transition-transform hover:scale-105 hover:ring-2 hover:ring-[#E8891A]"
                        style={{ backgroundColor: bg, color: textColor }}
                        title={`${origZone} → ${destZone}: ${volume.toLocaleString()} trips today`}
                        onClick={() => navigate(`/search`)}
                      >
                        {isSelf ? '—' : volume.toLocaleString('en-IN')}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Congestion Bottleneck Table with Map Pan Trigger */}
      <div className="bg-white border border-[#DDE3EA] rounded-md shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#DDE3EA] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-800">Critical Congestion Bottlenecks</h3>
            <p className="text-[11px] text-gray-500">
              Clicking a row pans map directly to the camera node
            </p>
          </div>
          <span className="text-xs text-gray-500 font-medium">10 Intersections Monitored</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F4F6F9] text-gray-600 font-semibold text-xs border-b border-[#DDE3EA]">
              <tr>
                <th className="p-3 text-left">Camera / Zone</th>
                <th className="p-3 text-left">Density Score</th>
                <th className="p-3 text-left">Avg Observed Speed</th>
                <th className="p-3 text-left">Congestion Level</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {bottlenecks.map((b, i) => (
                <tr
                  key={b.cameraId}
                  onClick={() => handleBottleneckClick(b)}
                  className={`border-b border-[#DDE3EA]/70 cursor-pointer hover:bg-blue-50/50 transition-colors ${
                    i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'
                  }`}
                >
                  <td className="p-3">
                    <p className="font-semibold text-xs text-[#1F3A6E]">{b.cameraName}</p>
                    <p className="text-[11px] text-gray-500">
                      {b.cameraId} · {b.zone}
                    </p>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2 max-w-[140px]">
                      <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${b.densityScore}%`,
                            backgroundColor:
                              b.densityScore > 80
                                ? '#C62828'
                                : b.densityScore > 65
                                ? '#ED9B00'
                                : '#2E7D32',
                          }}
                        />
                      </div>
                      <span className="text-xs font-mono font-medium">{b.densityScore}%</span>
                    </div>
                  </td>
                  <td className="p-3 text-xs font-mono font-semibold">{b.avgSpeed} km/h</td>
                  <td className="p-3">
                    <StatusChip status={b.status} />
                  </td>
                  <td className="p-3 text-right">
                    <button className="text-xs text-[#1F3A6E] hover:underline font-semibold flex items-center gap-1 justify-end ml-auto">
                      Pan Map <ArrowRight size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
