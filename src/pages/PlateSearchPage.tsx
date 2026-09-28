import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  MapPin,
  Clock,
  Gauge,
  Camera as CameraIcon,
  Eye,
  Flag,
  Plus,
  Download,
  Play,
  Pause,
  RotateCcw,
  SlidersHorizontal,
  ShieldAlert,
} from 'lucide-react';
import { Breadcrumbs, StatusChip, Modal } from '../components/ui';
import { TrajectoryMap } from '../components/TrajectoryMap';
import { useToastStore } from '../store';
import { searchPlates, plates } from '../data/plates';
import { trajectories } from '../data/trajectories';
import { mockApi } from '../mockApi';
import type { TrajectoryPoint, Plate } from '../data/types';

export const PlateSearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { addToast } = useToastStore();

  const [query, setQuery] = useState(searchParams.get('plate') || 'GJ01AB1234');
  const [suggestions, setSuggestions] = useState<Plate[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedPlate, setSelectedPlate] = useState<string>('GJ01AB1234');
  const [trajectory, setTrajectory] = useState<TrajectoryPoint[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [minConfidence, setMinConfidence] = useState(75);
  const [startDate, setStartDate] = useState('2026-09-28');
  const [endDate, setEndDate] = useState('2026-09-28');
  const [showAmbiguous, setShowAmbiguous] = useState(true);

  // Replay Animation state
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Modals
  const [snapshotModalPoint, setSnapshotModalPoint] = useState<TrajectoryPoint | null>(null);
  const [flagModalPoint, setFlagModalPoint] = useState<TrajectoryPoint | null>(null);
  const [blacklistModal, setBlacklistModal] = useState(false);
  const [blacklistReason, setBlacklistReason] = useState('Stolen Vehicle');
  const [blacklistNotes, setBlacklistNotes] = useState('');
  const [exporting, setExporting] = useState(false);

  const searchBoxRef = useRef<HTMLDivElement>(null);

  // Load initial vehicle trajectory
  useEffect(() => {
    const initialPlate = searchParams.get('plate') || 'GJ01AB1234';
    setQuery(initialPlate);
    setSelectedPlate(initialPlate);
    loadTrajectory(initialPlate);
  }, [searchParams]);

  // Click outside suggestions
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleQueryChange = (val: string) => {
    const clean = val.toUpperCase().replace(/\s/g, '');
    setQuery(clean);
    if (clean.length >= 2) {
      const matches = searchPlates(clean);
      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const loadTrajectory = (plateStr: string) => {
    setLoading(true);
    setIsPlaying(false);
    setActiveIndex(0);

    const points = trajectories[plateStr] || trajectories['GJ01AB1234'] || [];
    mockApi(points, 400).then((data) => {
      setTrajectory(data.filter((p) => p.confidence >= minConfidence));
      setLoading(false);
    });
  };

  const handleSelectSuggestion = (plateStr: string) => {
    setQuery(plateStr);
    setSelectedPlate(plateStr);
    setShowSuggestions(false);
    loadTrajectory(plateStr);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSelectedPlate(query.trim());
      loadTrajectory(query.trim());
    }
  };

  // Trajectory replay loop
  useEffect(() => {
    if (!isPlaying || trajectory.length === 0) return;

    const intervalTime = Math.max(500, 2000 / playbackSpeed);
    const timer = setInterval(() => {
      setActiveIndex((curr) => {
        if (curr >= trajectory.length - 1) {
          setIsPlaying(false);
          return curr;
        }
        return curr + 1;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, trajectory.length]);

  const activePlateMeta = plates.find((p) => p.plate === selectedPlate);

  // Compute summary metrics
  const summary =
    trajectory.length > 0
      ? {
          count: trajectory.length,
          firstSeen: new Date(trajectory[0].timestamp).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          lastSeen: new Date(trajectory[trajectory.length - 1].timestamp).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          avgSpeed: Math.round(
            trajectory.reduce((acc, p) => acc + p.speed, 0) / trajectory.length
          ),
          distanceKm: (trajectory.length * 4.2).toFixed(1),
          totalMinutes: Math.round(
            (new Date(trajectory[trajectory.length - 1].timestamp).getTime() -
              new Date(trajectory[0].timestamp).getTime()) /
              60000
          ),
        }
      : null;

  const handleExportPDF = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      addToast({
        type: 'success',
        title: 'Export Generated',
        message: `Official ANPR Trajectory Dossier for ${selectedPlate} exported as PDF`,
      });
    }, 1800);
  };

  const handleAddBlacklist = () => {
    setBlacklistModal(false);
    addToast({
      type: 'success',
      title: 'Added to Blacklist',
      message: `Registration ${selectedPlate} added under flag "${blacklistReason}"`,
    });
  };

  const handleFlagMatch = () => {
    if (flagModalPoint) {
      setFlagModalPoint(null);
      addToast({
        type: 'warning',
        title: 'OCR Match Flagged',
        message: `Sighting at ${flagModalPoint.cameraName} forwarded to Manual Review Queue`,
      });
    }
  };

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Plate Search & Trajectory Tracking' }]} />

      {/* Top Search & Filter Bar */}
      <div className="bg-white border border-[#DDE3EA] rounded-md shadow-sm p-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[240px] relative" ref={searchBoxRef}>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Vehicle Registration (Plate Number)
            </label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                onFocus={() => query.length >= 2 && setShowSuggestions(true)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-[#DDE3EA] rounded font-mono font-bold text-[#1F3A6E] uppercase focus:outline-none focus:border-[#1F3A6E] focus:ring-1 focus:ring-[#1F3A6E]"
                placeholder="e.g. GJ01AB1234 or GJ05CD5678"
              />
            </div>

            {/* Fuzzy Autocomplete dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#DDE3EA] rounded-md shadow-xl z-50 max-h-64 overflow-y-auto">
                <div className="p-1.5 text-[10px] uppercase font-bold text-gray-400 border-b">
                  Suggested Seed Plates ({suggestions.length})
                </div>
                {suggestions.map((p) => (
                  <button
                    key={p.plate}
                    type="button"
                    onClick={() => handleSelectSuggestion(p.plate)}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50/70 border-b border-gray-100 flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <span className="font-mono font-bold text-[#1F3A6E]">{p.plate}</span>
                      <span className="ml-2 text-gray-600">
                        {p.make} ({p.color} {p.vehicleType})
                      </span>
                    </div>
                    {p.isBlacklisted && (
                      <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-semibold">
                        Blacklisted
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-xs border border-[#DDE3EA] rounded px-2.5 py-2 text-gray-700 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Min OCR Confidence ({minConfidence}%)
            </label>
            <input
              type="range"
              min="70"
              max="95"
              value={minConfidence}
              onChange={(e) => {
                setMinConfidence(Number(e.target.value));
                loadTrajectory(selectedPlate);
              }}
              className="w-28 accent-[#1F3A6E]"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-[#1F3A6E] hover:bg-[#162B52] text-white text-xs font-semibold rounded transition-colors shadow-xs"
          >
            Track Vehicle
          </button>
        </form>
      </div>

      {/* Vehicle Info Bar & Action Strip */}
      <div className="bg-white border border-[#DDE3EA] rounded-md p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-[#1F3A6E] text-white px-3 py-1.5 rounded font-mono font-bold text-base tracking-wider shadow-inner flex items-center gap-1.5">
            <span className="text-[11px] text-[#E8891A] font-sans font-semibold">IND</span>
            {selectedPlate}
          </div>

          <div className="text-xs space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-800">
                {activePlateMeta?.make || 'Maruti Suzuki Swift'}
              </span>
              <span className="text-gray-500">
                {activePlateMeta?.color || 'White'} {activePlateMeta?.vehicleType || 'Car'}
              </span>
              {activePlateMeta?.isBlacklisted ? (
                <span className="bg-red-100 text-[#C62828] text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-200">
                  FLAGGED ON BLACKLIST
                </span>
              ) : (
                <span className="bg-green-100 text-[#2E7D32] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  CLEARED VEHICLE
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-500">
              Registered Owner: <span className="font-semibold text-gray-700">{activePlateMeta?.ownerName || 'Verified Citizen'}</span> · Gujarat RTO
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setBlacklistModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[#C62828] text-[#C62828] hover:bg-red-50 rounded font-semibold transition-colors"
          >
            <ShieldAlert size={14} /> Add to Blacklist
          </button>
          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#1F3A6E] hover:bg-[#162B52] text-white rounded font-semibold transition-colors shadow-xs disabled:opacity-50"
          >
            <Download size={13} /> {exporting ? 'Exporting...' : 'Export Dossier (PDF)'}
          </button>
        </div>
      </div>

      {/* Summary Metrics Strip */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <div className="bg-white border border-[#DDE3EA] rounded p-2.5 shadow-xs">
            <span className="text-[10px] uppercase font-semibold text-gray-400">Total Route</span>
            <p className="text-base font-bold text-[#1F3A6E] mt-0.5">~{summary.distanceKm} km</p>
          </div>
          <div className="bg-white border border-[#DDE3EA] rounded p-2.5 shadow-xs">
            <span className="text-[10px] uppercase font-semibold text-gray-400">Elapsed Time</span>
            <p className="text-base font-bold text-gray-800 mt-0.5">
              {Math.floor(summary.totalMinutes / 60)}h {summary.totalMinutes % 60}m
            </p>
          </div>
          <div className="bg-white border border-[#DDE3EA] rounded p-2.5 shadow-xs">
            <span className="text-[10px] uppercase font-semibold text-gray-400">Average Speed</span>
            <p className="text-base font-bold text-gray-800 mt-0.5">{summary.avgSpeed} km/h</p>
          </div>
          <div className="bg-white border border-[#DDE3EA] rounded p-2.5 shadow-xs">
            <span className="text-[10px] uppercase font-semibold text-gray-400">Cameras Crossed</span>
            <p className="text-base font-bold text-[#1F3A6E] mt-0.5">{summary.count} Nodes</p>
          </div>
          <div className="bg-white border border-[#DDE3EA] rounded p-2.5 shadow-xs">
            <span className="text-[10px] uppercase font-semibold text-gray-400">First Sighting</span>
            <p className="text-xs font-bold text-gray-800 mt-1">{summary.firstSeen}</p>
          </div>
          <div className="bg-white border border-[#DDE3EA] rounded p-2.5 shadow-xs">
            <span className="text-[10px] uppercase font-semibold text-gray-400">Last Sighting</span>
            <p className="text-xs font-bold text-gray-800 mt-1">{summary.lastSeen}</p>
          </div>
        </div>
      )}

      {/* Split View: Map (Left) + Timeline Cards (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Interactive Map & Replay Controls */}
        <div className="lg:col-span-7 space-y-3">
          {/* Replay controller */}
          <div className="bg-white border border-[#DDE3EA] rounded-md p-3 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#1F3A6E] hover:bg-[#162B52] text-white rounded font-semibold transition-colors shadow-xs"
              >
                {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                {isPlaying ? 'Pause Replay' : 'Replay Trajectory'}
              </button>
              <button
                onClick={() => {
                  setIsPlaying(false);
                  setActiveIndex(0);
                }}
                className="p-1.5 border border-[#DDE3EA] hover:bg-gray-100 rounded text-gray-600"
                title="Reset to origin"
              >
                <RotateCcw size={13} />
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-gray-500 font-medium">Speed:</span>
                {[1, 2, 4].map((s) => (
                  <button
                    key={s}
                    onClick={() => setPlaybackSpeed(s)}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      playbackSpeed === s ? 'bg-[#E8891A] text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>

              <label className="flex items-center gap-1.5 text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAmbiguous}
                  onChange={(e) => setShowAmbiguous(e.target.checked)}
                  className="rounded text-[#1F3A6E] accent-[#1F3A6E]"
                />
                <span>Ambiguous Paths</span>
              </label>
            </div>
          </div>

          {/* Trajectory Map Component */}
          <TrajectoryMap
            points={trajectory}
            activeIndex={activeIndex}
            showAmbiguousPaths={showAmbiguous}
            height="500px"
          />
        </div>

        {/* Right Column: Sighting Timeline Cards */}
        <div className="lg:col-span-5 bg-white border border-[#DDE3EA] rounded-md shadow-sm p-4 flex flex-col h-[570px]">
          <div className="flex items-center justify-between border-b pb-2 mb-3">
            <div>
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                Optical Sighting Timeline ({trajectory.length})
              </h3>
              <p className="text-[11px] text-gray-500">Chronological ANPR gate detections</p>
            </div>
            <span className="text-[11px] text-gray-400 font-mono">
              Stop {activeIndex + 1} of {trajectory.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {trajectory.map((point, idx) => {
              const isCurrent = idx === activeIndex;
              const confColor =
                point.confidence >= 90
                  ? 'text-[#2E7D32] bg-green-50 border-green-200'
                  : point.confidence >= 85
                  ? 'text-[#ED9B00] bg-amber-50 border-amber-200'
                  : 'text-[#C62828] bg-red-50 border-red-200';

              return (
                <div
                  key={`${point.cameraId}-${idx}`}
                  onClick={() => setActiveIndex(idx)}
                  className={`p-3 rounded border cursor-pointer transition-all ${
                    isCurrent
                      ? 'border-[#1F3A6E] bg-blue-50/50 shadow-sm ring-1 ring-[#1F3A6E]'
                      : 'border-[#DDE3EA] hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5 ${
                          point.confidence >= 90
                            ? 'bg-[#2E7D32]'
                            : point.confidence >= 85
                            ? 'bg-[#ED9B00]'
                            : 'bg-[#C62828]'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-[#1F3A6E] leading-tight">
                          {point.cameraName}
                        </p>
                        <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                          {point.cameraId}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${confColor}`}
                    >
                      {point.confidence}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-500 mt-2 pt-2 border-t border-gray-100">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {new Date(point.timestamp).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-gray-700">
                      <Gauge size={11} /> {point.speed} km/h
                    </span>
                  </div>

                  {/* Card actions */}
                  <div className="flex items-center justify-end gap-2 mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSnapshotModalPoint(point);
                      }}
                      className="text-[11px] text-[#1F3A6E] hover:underline font-semibold flex items-center gap-1"
                    >
                      <Eye size={11} /> View Snapshot
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFlagModalPoint(point);
                      }}
                      className="text-[11px] text-amber-700 hover:underline font-semibold flex items-center gap-1"
                    >
                      <Flag size={11} /> Flag Match
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Snapshot Modal with CSS Plate Bounding Box */}
      <Modal
        isOpen={!!snapshotModalPoint}
        onClose={() => setSnapshotModalPoint(null)}
        title={`Optical OCR Capture – ${snapshotModalPoint?.cameraName}`}
        size="md"
      >
        {snapshotModalPoint && (
          <div className="space-y-4">
            {/* Simulated camera snapshot frame */}
            <div className="relative w-full h-60 bg-gray-900 rounded-md overflow-hidden flex items-center justify-center border border-gray-700 shadow-inner">
              <div className="text-center text-gray-400">
                <CameraIcon size={36} className="mx-auto mb-2 opacity-50" />
                <p className="text-xs uppercase font-mono tracking-widest text-gray-400">
                  BEL HD Optical ANPR Node Feed
                </p>
                <p className="text-[10px] text-gray-500 mt-1">
                  LAT: {snapshotModalPoint.lat.toFixed(4)} · LON: {snapshotModalPoint.lng.toFixed(4)}
                </p>
              </div>

              {/* Timestamp watermarks */}
              <div className="absolute top-2 left-2 text-[10px] font-mono text-green-400 bg-black/60 px-2 py-0.5 rounded">
                CAM: {snapshotModalPoint.cameraId} · {new Date(snapshotModalPoint.timestamp).toLocaleString('en-IN')}
              </div>

              {/* Plate Bounding Box Overlay */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 border-2 border-[#E8891A] bg-black/70 px-4 py-2 rounded shadow-2xl flex flex-col items-center">
                <span className="text-[9px] text-[#E8891A] font-bold uppercase tracking-wider">
                  OCR Bounding Box [Confidence: {snapshotModalPoint.confidence}%]
                </span>
                <span className="font-mono text-lg font-extrabold text-white tracking-widest mt-0.5">
                  {selectedPlate}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-3 rounded border">
              <div>
                <span className="text-gray-500">Camera Node:</span>{' '}
                <span className="font-semibold text-gray-800">{snapshotModalPoint.cameraName}</span>
              </div>
              <div>
                <span className="text-gray-500">Timestamp:</span>{' '}
                <span className="font-semibold text-gray-800">
                  {new Date(snapshotModalPoint.timestamp).toLocaleTimeString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Calculated Velocity:</span>{' '}
                <span className="font-semibold text-gray-800">{snapshotModalPoint.speed} km/h</span>
              </div>
              <div>
                <span className="text-gray-500">Neural Model Score:</span>{' '}
                <span className="font-bold text-[#1F3A6E]">{snapshotModalPoint.confidence}%</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Flag Incorrect Match Confirmation Modal */}
      <Modal
        isOpen={!!flagModalPoint}
        onClose={() => setFlagModalPoint(null)}
        title="Flag Incorrect ANPR Match"
        size="sm"
      >
        <div className="space-y-3">
          <p className="text-xs text-gray-600 leading-relaxed">
            Are you sure you want to flag the OCR match at <strong>{flagModalPoint?.cameraName}</strong> as a false positive? This will transfer the record to the Human Verification Queue.
          </p>
          <div className="flex justify-end gap-2 pt-2 border-t">
            <button
              onClick={() => setFlagModalPoint(null)}
              className="px-3 py-1.5 text-xs border border-[#DDE3EA] rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleFlagMatch}
              className="px-3 py-1.5 text-xs bg-[#ED9B00] hover:bg-amber-600 text-white rounded font-semibold"
            >
              Confirm & Forward
            </button>
          </div>
        </div>
      </Modal>

      {/* Add to Blacklist Modal */}
      <Modal
        isOpen={blacklistModal}
        onClose={() => setBlacklistModal(false)}
        title="Add Registration to National Blacklist"
        size="md"
      >
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Plate Number</label>
            <input
              type="text"
              value={selectedPlate}
              disabled
              className="w-full border border-[#DDE3EA] bg-gray-100 rounded px-3 py-2 text-sm font-mono font-bold text-gray-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Enforcement Reason
            </label>
            <select
              value={blacklistReason}
              onChange={(e) => setBlacklistReason(e.target.value)}
              className="w-full border border-[#DDE3EA] bg-white rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#1F3A6E]"
            >
              <option value="Stolen Vehicle">Stolen Vehicle (FIR Registered)</option>
              <option value="Wanted by Police">Wanted by Police / Criminal Investigation</option>
              <option value="Court Order">High Court / Sessions Court Attachment Order</option>
              <option value="Suspicious Activity">Suspicious Surveillance Anomaly</option>
              <option value="Insurance Expired">Lapsed Mandatory Third-Party Insurance</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Officer Investigation Notes
            </label>
            <textarea
              rows={3}
              value={blacklistNotes}
              onChange={(e) => setBlacklistNotes(e.target.value)}
              placeholder="Provide case diary reference or reason for tracking..."
              className="w-full border border-[#DDE3EA] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#1F3A6E]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <button
              onClick={() => setBlacklistModal(false)}
              className="px-3 py-1.5 text-xs border border-[#DDE3EA] rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleAddBlacklist}
              className="px-3 py-1.5 text-xs bg-[#C62828] hover:bg-red-800 text-white rounded font-semibold"
            >
              Enact Blacklist Intercept
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
