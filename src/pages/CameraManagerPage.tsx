import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  Search,
  LayoutGrid,
  List,
  MapPin,
  Camera as CameraIcon,
  CheckCircle,
} from 'lucide-react';
import { Breadcrumbs, StatusChip, Modal, TableSkeleton } from '../components/ui';
import { useToastStore } from '../store';
import { cameras as seedCameras } from '../data/cameras';
import { mockApi } from '../mockApi';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { Camera } from '../data/types';

export const CameraManagerPage: React.FC = () => {
  const { addToast } = useToastStore();
  const [loading, setLoading] = useState(true);
  const [cameraList, setCameraList] = useState<Camera[]>([]);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Modals
  const [addModal, setAddModal] = useState(false);
  const [editModalCam, setEditModalCam] = useState<Camera | null>(null);
  const [trendModalCam, setTrendModalCam] = useState<Camera | null>(null);

  // New Camera Form state with Pin Drop
  const [newCamId, setNewCamId] = useState('CAM-051');
  const [newCamName, setNewCamName] = useState('');
  const [newCamZone, setNewCamZone] = useState('Zone-A');
  const [newCamMake, setNewCamMake] = useState('Hikvision DarkFighter');
  const [newCamRes, setNewCamRes] = useState('4K Ultra HD');
  const [newCamIP, setNewCamIP] = useState('10.1.9.15');
  const [pinnedCoords, setPinnedCoords] = useState<{ lat: number; lng: number }>({
    lat: 23.052,
    lng: 72.535,
  });

  useEffect(() => {
    mockApi(seedCameras, 350).then((data) => {
      setCameraList(data);
      setLoading(false);
    });
  }, []);

  const filtered = cameraList.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.zone.toLowerCase().includes(search.toLowerCase()) ||
      c.make.toLowerCase().includes(search.toLowerCase())
  );

  const toggleCamera = (id: string) => {
    setCameraList((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const next = c.status === 'online' ? 'offline' : 'online';
          addToast({
            type: 'info',
            title: 'Camera State Toggled',
            message: `${c.id} (${c.name}) is now ${next.toUpperCase()}`,
          });
          return { ...c, status: next as any };
        }
        return c;
      })
    );
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Camera = {
      id: newCamId,
      name: newCamName || 'New Junction Node',
      zone: newCamZone,
      lat: pinnedCoords.lat,
      lng: pinnedCoords.lng,
      status: 'online',
      lastPing: new Date(),
      ocrAccuracy: 96.5,
      installedDate: '2026-09-28',
      ipAddress: newCamIP,
      make: newCamMake,
      resolution: newCamRes,
    };

    setCameraList([created, ...cameraList]);
    setAddModal(false);
    setNewCamName('');
    addToast({
      type: 'success',
      title: 'ANPR Camera Commissioned',
      message: `${created.id} online and integrated with Ahmedabad-Gandhinagar grid`,
    });
  };

  // Mock 24h OCR accuracy trend series
  const trendData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, '0')}:00`,
    accuracy: Math.round((92 + Math.sin(i) * 3 + Math.random() * 2) * 10) / 10,
  }));

  const formatPing = (d: Date) => {
    const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
    if (mins < 1) return 'Active now';
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ago`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Camera Node Manager' }]} />
        <TableSkeleton rows={10} cols={7} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Camera Node Manager' }]} />

      {/* Header */}
      <div className="bg-white border border-[#DDE3EA] rounded-md shadow-sm p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-[#1F3A6E] tracking-tight flex items-center gap-2">
            <CameraIcon size={18} />
            Hardware Node & Optical Sensor Management
          </h1>
          <p className="text-xs text-gray-500">
            50 High-Speed Multi-Lane Optical Recognition Terminals across Gujarat Tri-City
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex border border-[#DDE3EA] rounded overflow-hidden">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 ${viewMode === 'table' ? 'bg-[#1F3A6E] text-white' : 'bg-white text-gray-600'}`}
              title="Table View"
            >
              <List size={15} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 ${viewMode === 'grid' ? 'bg-[#1F3A6E] text-white' : 'bg-white text-gray-600'}`}
              title="Grid Card View"
            >
              <LayoutGrid size={15} />
            </button>
          </div>

          <button
            onClick={() => setAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#1F3A6E] hover:bg-[#162B52] text-white rounded font-semibold transition-colors shadow-xs"
          >
            <Plus size={13} /> Commission Camera Node
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-[#DDE3EA] rounded-md p-3 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative max-w-sm w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by junction name, camera ID, zone, or manufacturer..."
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-[#DDE3EA] rounded focus:outline-none focus:border-[#1F3A6E]"
          />
        </div>

        <div className="flex items-center gap-4 text-gray-600 font-medium">
          <span>Active Nodes: <strong className="text-[#2E7D32]">{cameraList.filter((c) => c.status === 'online').length}</strong></span>
          <span>Offline Faults: <strong className="text-gray-500">{cameraList.filter((c) => c.status === 'offline').length}</strong></span>
          <span>Alerting: <strong className="text-[#C62828]">{cameraList.filter((c) => c.status === 'alerting').length}</strong></span>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' ? (
        <div className="bg-white border border-[#DDE3EA] rounded-md shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-[#F4F6F9] text-gray-600 font-bold uppercase tracking-wider border-b border-[#DDE3EA]">
                <tr>
                  <th className="p-3 text-left">Node ID</th>
                  <th className="p-3 text-left">Junction / Arterial Road</th>
                  <th className="p-3 text-left">Sector Zone</th>
                  <th className="p-3 text-left">Operational Status</th>
                  <th className="p-3 text-left">Heartbeat Ping</th>
                  <th className="p-3 text-left">24h OCR Accuracy</th>
                  <th className="p-3 text-left">Hardware & IP</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cam, idx) => (
                  <tr
                    key={cam.id}
                    className={`border-b border-[#DDE3EA]/70 hover:bg-blue-50/40 transition-colors ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-[#F4F6F9]/30'
                    }`}
                  >
                    <td className="p-3 font-mono font-bold text-[#1F3A6E]">{cam.id}</td>
                    <td className="p-3">
                      <p className="font-semibold text-gray-800">{cam.name}</p>
                      <p className="text-[10px] text-gray-400 font-mono">
                        LAT: {cam.lat.toFixed(4)} · LON: {cam.lng.toFixed(4)}
                      </p>
                    </td>
                    <td className="p-3 font-medium text-gray-700">{cam.zone}</td>
                    <td className="p-3">
                      <StatusChip status={cam.status} />
                    </td>
                    <td className="p-3 font-mono text-gray-600">{formatPing(cam.lastPing)}</td>
                    <td className="p-3">
                      <span
                        className={`font-mono font-bold ${
                          cam.ocrAccuracy >= 95
                            ? 'text-[#2E7D32]'
                            : cam.ocrAccuracy >= 90
                            ? 'text-[#ED9B00]'
                            : 'text-[#C62828]'
                        }`}
                      >
                        {cam.ocrAccuracy}%
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">
                      <p>{cam.make}</p>
                      <p className="font-mono text-[10px] text-gray-400">{cam.ipAddress}</p>
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditModalCam(cam)}
                          className="p-1 text-gray-600 hover:bg-gray-200 rounded"
                          title="Edit Configuration"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => toggleCamera(cam.id)}
                          className="p-1 text-[#1F3A6E] hover:bg-blue-100 rounded"
                          title={cam.status === 'online' ? 'Disable Sensor' : 'Enable Sensor'}
                        >
                          {cam.status === 'online' ? (
                            <ToggleRight size={18} className="text-[#2E7D32]" />
                          ) : (
                            <ToggleLeft size={18} className="text-gray-400" />
                          )}
                        </button>
                        <button
                          onClick={() => setTrendModalCam(cam)}
                          className="p-1 text-amber-700 hover:bg-amber-100 rounded"
                          title="View OCR Accuracy Trend"
                        >
                          <TrendingUp size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Card View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {filtered.map((cam) => (
            <div
              key={cam.id}
              className="bg-white border border-[#DDE3EA] rounded-md p-3.5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-xs text-[#1F3A6E]">{cam.id}</span>
                  <StatusChip status={cam.status} />
                </div>
                <h4 className="text-xs font-bold text-gray-800 leading-snug mb-1">{cam.name}</h4>
                <p className="text-[11px] text-gray-500 mb-2">{cam.zone} · {cam.make}</p>

                <div className="grid grid-cols-2 gap-1.5 text-[11px] bg-gray-50 p-2 rounded border mb-3">
                  <div>
                    <span className="text-gray-400">Accuracy:</span>
                    <p className="font-bold text-[#1F3A6E]">{cam.ocrAccuracy}%</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Ping:</span>
                    <p className="font-mono text-gray-600">{formatPing(cam.lastPing)}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t flex items-center justify-between text-xs">
                <span className="font-mono text-[10px] text-gray-400">{cam.ipAddress}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditModalCam(cam)}
                    className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => toggleCamera(cam.id)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {cam.status === 'online' ? (
                      <ToggleRight size={17} className="text-[#2E7D32]" />
                    ) : (
                      <ToggleLeft size={17} className="text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={() => setTrendModalCam(cam)}
                    className="p-1 text-amber-700 hover:bg-amber-50 rounded"
                  >
                    <TrendingUp size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Camera Modal with Embedded Pin-Drop Mock Map */}
      <Modal
        isOpen={addModal}
        onClose={() => setAddModal(false)}
        title="Commission New ANPR Camera Node"
        size="lg"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Node Identifier</label>
                <input
                  type="text"
                  value={newCamId}
                  onChange={(e) => setNewCamId(e.target.value)}
                  className="w-full border border-[#DDE3EA] rounded px-3 py-1.5 text-xs font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Intersection / Junction Name *
                </label>
                <input
                  type="text"
                  value={newCamName}
                  onChange={(e) => setNewCamName(e.target.value)}
                  placeholder="e.g. Shyamal Crossroads - Flyover East"
                  className="w-full border border-[#DDE3EA] rounded px-3 py-1.5 text-xs text-gray-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Surveillance Zone</label>
                <select
                  value={newCamZone}
                  onChange={(e) => setNewCamZone(e.target.value)}
                  className="w-full border border-[#DDE3EA] bg-white rounded px-3 py-1.5 text-xs text-gray-800"
                >
                  <option value="Zone-A">Zone A - SG Highway Corridor</option>
                  <option value="Zone-B">Zone B - CG Road & Ellis Bridge</option>
                  <option value="Zone-C">Zone C - Ashram Road & Riverfront</option>
                  <option value="Zone-D">Zone D - Satellite & Vastrapur</option>
                  <option value="Zone-E">Zone E - Maninagar & Isanpur</option>
                  <option value="Zone-F">Zone F - Naroda & Chandkheda</option>
                  <option value="Zone-G">Zone G - Gandhinagar Sector Grid</option>
                  <option value="Zone-H">Zone H - Anand & Vidyanagar</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Hardware Sensor</label>
                  <select
                    value={newCamMake}
                    onChange={(e) => setNewCamMake(e.target.value)}
                    className="w-full border border-[#DDE3EA] bg-white rounded px-2 py-1.5 text-xs"
                  >
                    <option>Hikvision DarkFighter</option>
                    <option>Dahua DeepSense</option>
                    <option>Bosch DINION 8000</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Optical Stream</label>
                  <select
                    value={newCamRes}
                    onChange={(e) => setNewCamRes(e.target.value)}
                    className="w-full border border-[#DDE3EA] bg-white rounded px-2 py-1.5 text-xs"
                  >
                    <option>4K Ultra HD</option>
                    <option>2MP Full HD 60fps</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Internal IP Address</label>
                <input
                  type="text"
                  value={newCamIP}
                  onChange={(e) => setNewCamIP(e.target.value)}
                  className="w-full border border-[#DDE3EA] rounded px-3 py-1.5 text-xs font-mono"
                  required
                />
              </div>
            </div>

            {/* Embedded Mini-Map Pin Dropper */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Pin Location on Gujarat City Grid (Click to drop)
              </label>
              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = (e.clientX - rect.left) / rect.width;
                  const y = (e.clientY - rect.top) / rect.height;
                  const newLat = 23.0 + (1 - y) * 0.2;
                  const newLng = 72.48 + x * 0.2;
                  setPinnedCoords({ lat: Number(newLat.toFixed(4)), lng: Number(newLng.toFixed(4)) });
                  addToast({
                    type: 'info',
                    title: 'Pin Location Dropped',
                    message: `Coordinates: ${newLat.toFixed(4)}°N, ${newLng.toFixed(4)}°E`,
                  });
                }}
                className="relative w-full h-56 bg-blue-50 border-2 border-dashed border-[#1F3A6E] rounded-md overflow-hidden cursor-crosshair flex flex-col items-center justify-center p-3 text-center"
              >
                <div className="absolute inset-0 bg-radial from-blue-100/50 to-transparent" />
                <MapPin size={28} className="text-[#C62828] mb-1 z-10 animate-bounce" />
                <p className="text-xs font-bold text-[#1F3A6E] z-10">
                  Interactive Node Positioning Map
                </p>
                <p className="text-[11px] text-gray-600 mt-1 z-10 font-mono">
                  Current Pin: {pinnedCoords.lat}°N, {pinnedCoords.lng}°E
                </p>
                <span className="text-[10px] text-gray-400 mt-2 z-10">
                  Click anywhere inside this area to update GPS anchor coordinates
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={() => setAddModal(false)}
              className="px-3 py-1.5 text-xs border border-[#DDE3EA] rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs bg-[#1F3A6E] hover:bg-[#162B52] text-white rounded font-semibold shadow-xs"
            >
              Commission & Connect Node
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Camera Modal */}
      <Modal
        isOpen={!!editModalCam}
        onClose={() => setEditModalCam(null)}
        title={`Configure Camera Node – ${editModalCam?.id}`}
        size="md"
      >
        {editModalCam && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Junction Name</label>
              <input
                type="text"
                value={editModalCam.name}
                onChange={(e) => setEditModalCam({ ...editModalCam, name: e.target.value })}
                className="w-full border border-[#DDE3EA] rounded px-3 py-1.5 text-xs text-gray-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">IP Address</label>
              <input
                type="text"
                value={editModalCam.ipAddress}
                onChange={(e) => setEditModalCam({ ...editModalCam, ipAddress: e.target.value })}
                className="w-full border border-[#DDE3EA] rounded px-3 py-1.5 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Resolution Mode</label>
              <select
                value={editModalCam.resolution}
                onChange={(e) => setEditModalCam({ ...editModalCam, resolution: e.target.value })}
                className="w-full border border-[#DDE3EA] bg-white rounded px-3 py-1.5 text-xs"
              >
                <option>4K Ultra HD</option>
                <option>2MP Full HD 60fps</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => setEditModalCam(null)}
                className="px-3 py-1.5 text-xs border border-[#DDE3EA] rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setCameraList((prev) =>
                    prev.map((c) => (c.id === editModalCam.id ? editModalCam : c))
                  );
                  setEditModalCam(null);
                  addToast({
                    type: 'success',
                    title: 'Node Updated',
                    message: `Parameters updated for ${editModalCam.id}`,
                  });
                }}
                className="px-3 py-1.5 text-xs bg-[#1F3A6E] hover:bg-[#162B52] text-white rounded font-semibold"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* View Accuracy Trend Modal with Recharts Line Chart */}
      <Modal
        isOpen={!!trendModalCam}
        onClose={() => setTrendModalCam(null)}
        title={`24-Hour OCR Accuracy Trend – ${trendModalCam?.name} (${trendModalCam?.id})`}
        size="lg"
      >
        {trendModalCam && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs bg-gray-50 p-2.5 rounded border">
              <div>
                <span className="text-gray-500">Sector:</span>{' '}
                <strong className="text-gray-800">{trendModalCam.zone}</strong>
              </div>
              <div>
                <span className="text-gray-500">24h Mean Accuracy:</span>{' '}
                <strong className="text-[#2E7D32]">{trendModalCam.ocrAccuracy}%</strong>
              </div>
              <div>
                <span className="text-gray-500">Sensor Model:</span>{' '}
                <strong className="text-gray-800">{trendModalCam.make}</strong>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" />
                  <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#6B7280' }} interval={2} />
                  <YAxis domain={[85, 100]} tick={{ fontSize: 10, fill: '#6B7280' }} unit="%" />
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
                    dataKey="accuracy"
                    stroke="#1F3A6E"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#E8891A' }}
                    name="OCR Precision"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
