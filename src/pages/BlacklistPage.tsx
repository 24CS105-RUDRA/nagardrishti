import React, { useState, useEffect } from 'react';
import {
  Plus,
  Upload,
  Edit2,
  ToggleLeft,
  ToggleRight,
  Eye,
  Search,
  ShieldAlert,
  FileCheck,
  AlertTriangle,
} from 'lucide-react';
import { Breadcrumbs, StatusChip, Modal, TableSkeleton } from '../components/ui';
import { useToastStore } from '../store';
import { blacklistEntries as seedBlacklist } from '../data/blacklist';
import { mockApi } from '../mockApi';
import type { BlacklistEntry } from '../data/types';

const INDIAN_PLATE_REGEX = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;

export const BlacklistPage: React.FC = () => {
  const { addToast } = useToastStore();

  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<BlacklistEntry[]>([]);
  const [search, setSearch] = useState('');

  // Modals
  const [addModal, setAddModal] = useState(false);
  const [editModalEntry, setEditModalEntry] = useState<BlacklistEntry | null>(null);
  const [importModal, setImportModal] = useState(false);
  const [historyModalEntry, setHistoryModalEntry] = useState<BlacklistEntry | null>(null);

  // Form states
  const [newPlate, setNewPlate] = useState('');
  const [newReason, setNewReason] = useState<BlacklistEntry['reason']>('Stolen Vehicle');
  const [newExpiry, setNewExpiry] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [plateError, setPlateError] = useState('');

  useEffect(() => {
    mockApi(seedBlacklist, 350).then((data) => {
      setEntries(data);
      setLoading(false);
    });
  }, []);

  const filtered = entries.filter(
    (e) =>
      e.plate.toLowerCase().includes(search.toLowerCase()) ||
      e.reason.toLowerCase().includes(search.toLowerCase()) ||
      e.addedBy.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddPlateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = newPlate.toUpperCase().replace(/\s/g, '');

    if (!INDIAN_PLATE_REGEX.test(formatted)) {
      setPlateError('Invalid Indian Registration Format. Example: GJ01AB1234 or GJ05C5678');
      return;
    }

    if (entries.some((e) => e.plate === formatted)) {
      setPlateError('This vehicle is already flagged in the active blacklist registry.');
      return;
    }

    const created: BlacklistEntry = {
      id: `BL-${String(entries.length + 1).padStart(3, '0')}`,
      plate: formatted,
      reason: newReason,
      addedBy: 'Duty Officer (Current Session)',
      addedDate: new Date(),
      expiryDate: newExpiry ? new Date(newExpiry) : null,
      status: 'active',
      sightingCount: 0,
      notes: newNotes || undefined,
    };

    setEntries([created, ...entries]);
    setAddModal(false);
    setNewPlate('');
    setNewNotes('');
    setNewExpiry('');
    setPlateError('');

    addToast({
      type: 'success',
      title: 'Vehicle Blacklisted',
      message: `${formatted} registered for automatic gate interception alarms`,
    });
  };

  const toggleEntryStatus = (id: string) => {
    setEntries((curr) =>
      curr.map((e) => {
        if (e.id === id) {
          const nextStatus = e.status === 'active' ? 'inactive' : 'active';
          addToast({
            type: 'info',
            title: 'Blacklist Status Changed',
            message: `${e.plate} status changed to ${nextStatus.toUpperCase()}`,
          });
          return { ...e, status: nextStatus };
        }
        return e;
      })
    );
  };

  const handleEditSave = () => {
    if (editModalEntry) {
      setEntries((curr) => curr.map((e) => (e.id === editModalEntry.id ? editModalEntry : e)));
      addToast({
        type: 'success',
        title: 'Entry Updated',
        message: `Changes saved for ${editModalEntry.plate}`,
      });
      setEditModalEntry(null);
    }
  };

  const handleConfirmCSVImport = () => {
    setImportModal(false);
    addToast({
      type: 'success',
      title: 'Bulk Import Successful',
      message: '3 verified stolen vehicle plates imported from State Crime Record Bureau',
    });
  };

  const formatDate = (d: Date | null | undefined) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Permanent';

  if (loading) {
    return (
      <div className="space-y-4">
        <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Blacklist Registry' }]} />
        <TableSkeleton rows={10} cols={8} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Blacklist Registry' }]} />

      {/* Header bar */}
      <div className="bg-white border border-[#DDE3EA] rounded-md shadow-sm p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-[#1F3A6E] tracking-tight flex items-center gap-2">
            <ShieldAlert size={18} className="text-[#C62828]" />
            National & State Intercept Blacklist Registry
          </h1>
          <p className="text-xs text-gray-500">
            Vehicles flagged for immediate interception, court summons, or criminal lookout notices
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setImportModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[#DDE3EA] hover:bg-gray-100 rounded text-gray-700 font-semibold transition-colors"
          >
            <Upload size={13} /> Bulk Import CSV
          </button>
          <button
            onClick={() => setAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#1F3A6E] hover:bg-[#162B52] text-white rounded font-semibold transition-colors shadow-xs"
          >
            <Plus size={13} /> Add Plate
          </button>
        </div>
      </div>

      {/* Search & Counter strip */}
      <div className="bg-white border border-[#DDE3EA] rounded-md p-3 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative max-w-sm w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by registration number, reason, or officer..."
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-[#DDE3EA] rounded focus:outline-none focus:border-[#1F3A6E]"
          />
        </div>

        <div className="flex items-center gap-3 text-gray-600 font-medium">
          <span>Total Records: <strong className="text-gray-900">{entries.length}</strong></span>
          <span>Active Flagged: <strong className="text-[#C62828]">{entries.filter((e) => e.status === 'active').length}</strong></span>
        </div>
      </div>

      {/* Main Blacklist Table */}
      <div className="bg-white border border-[#DDE3EA] rounded-md shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-[#F4F6F9] text-gray-600 font-bold uppercase tracking-wider border-b border-[#DDE3EA]">
              <tr>
                <th className="p-3 text-left">Registration Plate</th>
                <th className="p-3 text-left">Enforcement Reason</th>
                <th className="p-3 text-left">Authorizing Officer</th>
                <th className="p-3 text-left">Date Added</th>
                <th className="p-3 text-left">Validity Expiry</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">ANPR Hits</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry, idx) => (
                <tr
                  key={entry.id}
                  className={`border-b border-[#DDE3EA]/70 hover:bg-blue-50/40 transition-colors ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-[#F4F6F9]/30'
                  }`}
                >
                  <td className="p-3 font-mono font-bold text-[#1F3A6E] text-xs">
                    <span className="bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {entry.plate}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-gray-800">{entry.reason}</td>
                  <td className="p-3 text-gray-600">{entry.addedBy}</td>
                  <td className="p-3 font-mono text-gray-600">{formatDate(entry.addedDate)}</td>
                  <td className="p-3 font-mono text-gray-600">{formatDate(entry.expiryDate)}</td>
                  <td className="p-3">
                    <StatusChip status={entry.status} />
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`font-mono font-bold px-2 py-0.5 rounded-full ${
                        entry.sightingCount > 0
                          ? 'bg-red-100 text-[#C62828]'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {entry.sightingCount} hits
                    </span>
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setEditModalEntry({ ...entry })}
                        className="p-1 text-gray-600 hover:bg-gray-200 rounded"
                        title="Edit Entry"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => toggleEntryStatus(entry.id)}
                        className="p-1 text-[#1F3A6E] hover:bg-blue-100 rounded"
                        title={entry.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {entry.status === 'active' ? (
                          <ToggleRight size={18} className="text-[#2E7D32]" />
                        ) : (
                          <ToggleLeft size={18} className="text-gray-400" />
                        )}
                      </button>
                      <button
                        onClick={() => setHistoryModalEntry(entry)}
                        className="p-1 text-amber-700 hover:bg-amber-100 rounded"
                        title="View Sighting History"
                      >
                        <Eye size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-8 text-center text-gray-500 text-xs">
            No blacklist records found matching search query
          </div>
        )}
      </div>

      {/* Add Plate Modal with Strict Regex Validation */}
      <Modal
        isOpen={addModal}
        onClose={() => {
          setAddModal(false);
          setPlateError('');
        }}
        title="Add Vehicle to Intercept Blacklist"
        size="md"
      >
        <form onSubmit={handleAddPlateSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Plate Number (Indian Standard Format) *
            </label>
            <input
              type="text"
              value={newPlate}
              onChange={(e) => {
                setNewPlate(e.target.value.toUpperCase());
                setPlateError('');
              }}
              placeholder="e.g. GJ01AB1234"
              className="w-full border border-[#DDE3EA] rounded px-3 py-2 text-sm font-mono font-bold uppercase focus:outline-none focus:border-[#1F3A6E]"
              required
            />
            {plateError ? (
              <p className="text-[11px] text-[#C62828] mt-1 font-semibold flex items-center gap-1">
                <AlertTriangle size={12} /> {plateError}
              </p>
            ) : (
              <p className="text-[10px] text-gray-400 mt-1">
                Format: 2-letter state code + 2-digit district + 1-2 letters + 4 digits
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Enforcement Reason *
            </label>
            <select
              value={newReason}
              onChange={(e) => setNewReason(e.target.value as any)}
              className="w-full border border-[#DDE3EA] bg-white rounded px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#1F3A6E]"
            >
              <option value="Stolen Vehicle">Stolen Vehicle (FIR Registered)</option>
              <option value="Wanted by Police">Wanted by Police / Criminal Investigation</option>
              <option value="Court Order">High Court Attachment Order</option>
              <option value="Suspicious Activity">Suspicious Surveillance Anomaly</option>
              <option value="Insurance Expired">Insurance Lapsed / Pollution Offender</option>
              <option value="Registration Expired">Registration Expired / Fit Certificate Lapsed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Validity Expiry Date (Optional - Leave blank for permanent)
            </label>
            <input
              type="date"
              value={newExpiry}
              onChange={(e) => setNewExpiry(e.target.value)}
              className="w-full border border-[#DDE3EA] rounded px-3 py-2 text-xs text-gray-800 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Case Diary Reference & Notes
            </label>
            <textarea
              rows={2}
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="e.g. Navrangpura Police Station FIR #88/2026..."
              className="w-full border border-[#DDE3EA] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#1F3A6E]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={() => {
                setAddModal(false);
                setPlateError('');
              }}
              className="px-3 py-1.5 text-xs border border-[#DDE3EA] rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs bg-[#C62828] hover:bg-red-800 text-white rounded font-semibold shadow-xs"
            >
              Confirm Blacklist
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Entry Modal */}
      <Modal
        isOpen={!!editModalEntry}
        onClose={() => setEditModalEntry(null)}
        title={`Edit Blacklist Record – ${editModalEntry?.plate}`}
        size="md"
      >
        {editModalEntry && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Plate Number</label>
              <input
                type="text"
                value={editModalEntry.plate}
                disabled
                className="w-full border border-[#DDE3EA] bg-gray-100 rounded px-3 py-2 text-xs font-mono font-bold text-gray-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Reason</label>
              <select
                value={editModalEntry.reason}
                onChange={(e) =>
                  setEditModalEntry({ ...editModalEntry, reason: e.target.value as any })
                }
                className="w-full border border-[#DDE3EA] bg-white rounded px-3 py-2 text-xs text-gray-800"
              >
                <option value="Stolen Vehicle">Stolen Vehicle</option>
                <option value="Wanted by Police">Wanted by Police</option>
                <option value="Court Order">Court Order</option>
                <option value="Suspicious Activity">Suspicious Activity</option>
                <option value="Insurance Expired">Insurance Expired</option>
                <option value="Registration Expired">Registration Expired</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Officer Notes</label>
              <textarea
                rows={2}
                value={editModalEntry.notes || ''}
                onChange={(e) =>
                  setEditModalEntry({ ...editModalEntry, notes: e.target.value })
                }
                className="w-full border border-[#DDE3EA] rounded px-3 py-2 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => setEditModalEntry(null)}
                className="px-3 py-1.5 text-xs border border-[#DDE3EA] rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-3 py-1.5 text-xs bg-[#1F3A6E] hover:bg-[#162B52] text-white rounded font-semibold"
              >
                Save Updates
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Sighting History Modal */}
      <Modal
        isOpen={!!historyModalEntry}
        onClose={() => setHistoryModalEntry(null)}
        title={`Optical Sighting History – ${historyModalEntry?.plate}`}
        size="md"
      >
        {historyModalEntry && (
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 border rounded text-xs space-y-1">
              <p>
                <strong>Reason:</strong> {historyModalEntry.reason}
              </p>
              <p>
                <strong>Added By:</strong> {historyModalEntry.addedBy} on{' '}
                {formatDate(historyModalEntry.addedDate)}
              </p>
              <p>
                <strong>Total ANPR Sighting Triggers:</strong>{' '}
                <span className="font-bold text-[#C62828]">
                  {historyModalEntry.sightingCount} optical gate detections
                </span>
              </p>
            </div>

            <div className="text-xs text-gray-600">
              <p className="font-semibold text-gray-800 mb-2">Simulated Intercept Events:</p>
              <div className="space-y-1.5">
                <div className="p-2 border rounded bg-white flex justify-between">
                  <span>CAM-036 (Gandhinagar Sector 21)</span>
                  <span className="text-gray-500">28 Sep 2026, 14:22:10</span>
                </div>
                <div className="p-2 border rounded bg-white flex justify-between">
                  <span>CAM-011 (Income Tax Circle)</span>
                  <span className="text-gray-500">28 Sep 2026, 11:05:42</span>
                </div>
                <div className="p-2 border rounded bg-white flex justify-between">
                  <span>CAM-001 (SG Highway – Thaltej)</span>
                  <span className="text-gray-500">27 Sep 2026, 19:40:15</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Bulk CSV Import Modal */}
      <Modal
        isOpen={importModal}
        onClose={() => setImportModal(false)}
        title="Bulk Import Blacklist Dossier (CSV)"
        size="lg"
      >
        <div className="space-y-4">
          <div className="border-2 border-dashed border-[#DDE3EA] hover:border-[#1F3A6E] rounded-md p-6 text-center cursor-pointer bg-gray-50/50">
            <Upload size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-xs font-semibold text-gray-700">
              Drag and drop Gujarat Police SCRB .csv dataset here
            </p>
            <p className="text-[10px] text-gray-400 mt-1">
              Required Columns: Plate, Reason, AddedBy, ExpiryDate, CaseRef
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5">
              <FileCheck size={14} className="text-[#2E7D32]" />
              Dataset Ingestion Preview (3 Records Detected)
            </h4>
            <div className="border rounded overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-gray-100 text-gray-600 font-semibold">
                  <tr>
                    <th className="p-2 text-left">Plate</th>
                    <th className="p-2 text-left">Reason</th>
                    <th className="p-2 text-left">Authorizer</th>
                    <th className="p-2 text-left">Expiry</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-gray-700 font-mono">
                  <tr>
                    <td className="p-2 font-bold text-[#1F3A6E]">GJ01KP9090</td>
                    <td className="p-2 font-sans">Stolen Vehicle</td>
                    <td className="p-2 font-sans">Crime Branch Ahd</td>
                    <td className="p-2 font-sans">Permanent</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-[#1F3A6E]">GJ05TX4411</td>
                    <td className="p-2 font-sans">Court Order</td>
                    <td className="p-2 font-sans">High Court Surat</td>
                    <td className="p-2 font-sans">31 Dec 2026</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-[#1F3A6E]">GJ23ZZ1001</td>
                    <td className="p-2 font-sans">Wanted by Police</td>
                    <td className="p-2 font-sans">Anand SP Office</td>
                    <td className="p-2 font-sans">Permanent</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <button
              onClick={() => setImportModal(false)}
              className="px-3 py-1.5 text-xs border border-[#DDE3EA] rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmCSVImport}
              className="px-4 py-1.5 text-xs bg-[#1F3A6E] hover:bg-[#162B52] text-white rounded font-semibold shadow-xs"
            >
              Process & Ingest 3 Records
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
