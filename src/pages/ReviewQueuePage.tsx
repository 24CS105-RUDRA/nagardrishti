import React, { useState, useEffect } from 'react';
import {
  Check,
  X,
  Edit3,
  Camera as CameraIcon,
  ClipboardCheck,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Breadcrumbs, StatusChip } from '../components/ui';
import { useToastStore } from '../store';
import { reviewQueueItems as seedReviewQueue } from '../data/reviewQueue';
import { mockApi } from '../mockApi';
import type { ReviewQueueItem } from '../data/types';

export const ReviewQueuePage: React.FC = () => {
  const { addToast } = useToastStore();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<(ReviewQueueItem & { editedPlate: string })[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'corrected' | 'rejected'>('all');

  useEffect(() => {
    mockApi(seedReviewQueue, 300).then((data) => {
      setItems(data.map((item) => ({ ...item, editedPlate: item.plate })));
      setLoading(false);
    });
  }, []);

  const handleConfirm = (id: string, plateStr: string) => {
    setItems((curr) =>
      curr.map((i) => (i.id === id ? { ...i, status: 'confirmed' as const } : i))
    );
    addToast({
      type: 'success',
      title: 'OCR Read Confirmed',
      message: `Registration ${plateStr} approved into official vehicle sightings registry`,
    });
  };

  const handleCorrectAndSave = (id: string, corrected: string) => {
    setItems((curr) =>
      curr.map((i) =>
        i.id === id
          ? { ...i, status: 'corrected' as const, correctedPlate: corrected, plate: corrected }
          : i
      )
    );
    addToast({
      type: 'success',
      title: 'Plate Rectified & Committed',
      message: `Updated optical match to "${corrected.toUpperCase()}"`,
    });
  };

  const handleReject = (id: string) => {
    setItems((curr) =>
      curr.map((i) => (i.id === id ? { ...i, status: 'rejected' as const } : i))
    );
    addToast({
      type: 'warning',
      title: 'Optical Capture Rejected',
      message: `Item ${id} discarded due to low optical parity / motion blur`,
    });
  };

  const filtered = items.filter((i) => filter === 'all' || i.status === filter);
  const pendingCount = items.filter((i) => i.status === 'pending').length;

  if (loading) {
    return (
      <div className="space-y-4">
        <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Manual Review Queue' }]} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((k) => (
            <div key={k} className="h-60 bg-white border rounded p-4 skeleton" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Manual Review Queue' }]} />

      {/* Header */}
      <div className="bg-white border border-[#DDE3EA] rounded-md shadow-sm p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-[#1F3A6E] tracking-tight flex items-center gap-2">
            <ClipboardCheck size={18} className="text-[#ED9B00]" />
            Human-in-the-Loop OCR Verification Queue
          </h1>
          <p className="text-xs text-gray-500">
            Mandatory manual inspection of ambiguous license plate reads where AI confidence fell below 85%
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-amber-50 text-[#ED9B00] border border-amber-200 px-3 py-1 rounded">
            {pendingCount} Awaiting Verification
          </span>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-gray-500 font-semibold">Filter State:</span>
        {(['all', 'pending', 'confirmed', 'corrected', 'rejected'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3 py-1 rounded-full border capitalize font-semibold transition-colors ${
              filter === st
                ? 'bg-[#1F3A6E] text-white border-[#1F3A6E]'
                : 'bg-white text-gray-600 border-[#DDE3EA] hover:bg-gray-50'
            }`}
          >
            {st} ({st === 'all' ? items.length : items.filter((x) => x.status === st).length})
          </button>
        ))}
      </div>

      {/* Grid of Review Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => {
          const isPending = item.status === 'pending';

          return (
            <div
              key={item.id}
              className={`bg-white border rounded-md shadow-sm overflow-hidden flex flex-col justify-between transition-all ${
                isPending
                  ? 'border-[#DDE3EA] hover:border-[#1F3A6E]'
                  : item.status === 'confirmed'
                  ? 'border-green-200 bg-green-50/10'
                  : item.status === 'corrected'
                  ? 'border-blue-200 bg-blue-50/10'
                  : 'border-red-200 bg-red-50/10'
              }`}
            >
              <div>
                {/* Crop placeholder box */}
                <div className="relative h-32 bg-gray-900 border-b flex items-center justify-center p-3">
                  <div className="border border-dashed border-[#E8891A] bg-black/60 px-4 py-2 rounded flex flex-col items-center shadow-lg">
                    <span className="text-[9px] text-[#E8891A] font-bold uppercase tracking-wider">
                      Neural OCR Crop
                    </span>
                    <span className="font-mono text-base font-extrabold text-white tracking-widest mt-0.5">
                      {item.plate}
                    </span>
                  </div>

                  <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 px-1.5 py-0.5 rounded text-[10px] text-gray-300 font-mono">
                    <CameraIcon size={10} /> {item.cameraId}
                  </div>

                  <div className="absolute top-2 right-2">
                    <StatusChip status={item.status} />
                  </div>

                  <div className="absolute bottom-2 left-2 text-[10px] text-gray-400">
                    {new Date(item.timestamp).toLocaleTimeString('en-IN')}
                  </div>
                </div>

                <div className="p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#1F3A6E] leading-tight">
                        {item.cameraName}
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">{item.vehicleType}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 uppercase font-semibold">
                        Model Confidence
                      </span>
                      <p className="text-xs font-mono font-bold text-[#C62828] bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                        {item.confidence}%
                      </p>
                    </div>
                  </div>

                  {/* Editable input field for operator correction */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">
                      Operator Verified Plate
                    </label>
                    <input
                      type="text"
                      value={item.editedPlate}
                      disabled={!isPending}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase();
                        setItems((curr) =>
                          curr.map((i) => (i.id === item.id ? { ...i, editedPlate: val } : i))
                        );
                      }}
                      className="w-full font-mono font-bold text-xs uppercase border border-[#DDE3EA] rounded px-2.5 py-1.5 text-gray-900 bg-white focus:outline-none focus:border-[#1F3A6E] disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="p-3 border-t bg-gray-50/50">
                {isPending ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleConfirm(item.id, item.plate)}
                      className="flex-1 py-1.5 text-xs bg-[#2E7D32] hover:bg-green-800 text-white rounded font-semibold flex items-center justify-center gap-1 shadow-xs"
                      title="Accept AI classification as correct"
                    >
                      <Check size={12} /> Confirm
                    </button>
                    <button
                      onClick={() => handleCorrectAndSave(item.id, item.editedPlate)}
                      className="flex-1 py-1.5 text-xs bg-[#1F3A6E] hover:bg-[#162B52] text-white rounded font-semibold flex items-center justify-center gap-1 shadow-xs"
                      title="Save operator corrected license plate"
                    >
                      <Edit3 size={12} /> Correct
                    </button>
                    <button
                      onClick={() => handleReject(item.id)}
                      className="px-2.5 py-1.5 text-xs border border-[#C62828] text-[#C62828] hover:bg-red-50 rounded font-semibold"
                      title="Discard read"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <p className="text-center text-[11px] text-gray-500 font-semibold py-0.5">
                    Status: <span className="capitalize font-bold text-gray-700">{item.status}</span>
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="p-12 bg-white border border-[#DDE3EA] rounded-md text-center text-gray-500 text-xs">
          No queue items found matching filter
        </div>
      )}
    </div>
  );
};
