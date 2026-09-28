import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  Eye,
  ArrowUpRight,
  Download,
  Filter,
  AlertTriangle,
  Bell,
  CheckCheck,
} from 'lucide-react';
import { Breadcrumbs, StatusChip, Modal, TableSkeleton } from '../components/ui';
import { useAlertStore, useAuthStore, useToastStore } from '../store';
import { initialAlerts, generateRandomAlert } from '../data/alerts';
import { mockApi } from '../mockApi';
import type { Alert } from '../data/types';

const tabs = [
  { key: 'all', label: 'All Incident Alerts' },
  { key: 'blacklist_hit', label: 'Blacklist Intercepts' },
  { key: 'route_anomaly', label: 'Route Anomalies' },
  { key: 'system_alert', label: 'System Faults' },
  { key: 'speed_violation', label: 'Speed Violations' },
];

export const AlertsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    alerts,
    setAlerts,
    addAlert,
    acknowledgeAlert,
    resolveAlert,
    escalateAlert,
    acknowledgeMultiple,
  } = useAlertStore();
  const { addToast } = useToastStore();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Modals
  const [resolveModalId, setResolveModalId] = useState<string | null>(null);
  const [resolveNote, setResolveNote] = useState('');
  const [escalateModalId, setEscalateModalId] = useState<string | null>(null);
  const [escalateOfficer, setEscalateOfficer] = useState('Rajesh Kumar Singh (Admin)');

  // Initial load
  useEffect(() => {
    if (alerts.length === 0) {
      mockApi(initialAlerts, 400).then((data) => {
        setAlerts(data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  // Simulate new incoming alert every 25s
  useEffect(() => {
    const alertInterval = setInterval(() => {
      const freshAlert = generateRandomAlert();
      addAlert(freshAlert);
      addToast({
        type: freshAlert.severity === 'critical' ? 'error' : 'warning',
        title: `🚨 Live Alert: ${freshAlert.type.replace('_', ' ').toUpperCase()}`,
        message: freshAlert.description,
        duration: 5000,
      });
    }, 25000);

    return () => clearInterval(alertInterval);
  }, [addAlert, addToast]);

  const filteredAlerts = alerts.filter((a) => {
    if (activeTab !== 'all' && a.type !== activeTab) return false;
    if (severityFilter !== 'all' && a.severity !== severityFilter) return false;
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    return true;
  });

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredAlerts.length && filteredAlerts.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredAlerts.map((a) => a.id)));
    }
  };

  const handleBulkAcknowledge = () => {
    const ids = Array.from(selectedIds);
    acknowledgeMultiple(ids);
    addToast({
      type: 'success',
      title: 'Bulk Acknowledged',
      message: `${ids.length} alerts acknowledged by officer`,
    });
    setSelectedIds(new Set());
  };

  const handleResolveSubmit = () => {
    if (resolveModalId) {
      resolveAlert(resolveModalId, resolveNote || 'Verified and resolved by operator');
      addToast({
        type: 'success',
        title: 'Alert Resolved',
        message: `Alert ${resolveModalId} successfully closed with remarks`,
      });
      setResolveModalId(null);
      setResolveNote('');
    }
  };

  const handleEscalateSubmit = () => {
    if (escalateModalId) {
      escalateAlert(escalateModalId, escalateOfficer);
      addToast({
        type: 'info',
        title: 'Alert Escalated',
        message: `Alert ${escalateModalId} escalated to ${escalateOfficer}`,
      });
      setEscalateModalId(null);
    }
  };

  const formatTimestamp = (d: Date) =>
    new Date(d).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

  if (loading) {
    return (
      <div className="space-y-4">
        <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Alerts Center' }]} />
        <TableSkeleton rows={10} cols={8} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Alerts Center' }]} />

      {/* Header */}
      <div className="bg-white border border-[#DDE3EA] rounded-md shadow-sm p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-[#1F3A6E] tracking-tight flex items-center gap-2">
            <Bell size={18} className="text-[#C62828]" />
            National ANPR Threat & Incident Alerts Center
          </h1>
          <p className="text-xs text-gray-500">
            Real-time interception triggers, blacklist cross-matches, and speed infractions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-red-50 text-[#C62828] border border-red-200 px-3 py-1 rounded font-bold">
            Live Stream Active · {alerts.filter((a) => a.status === 'new').length} Pending Action
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-[#DDE3EA] overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-[#1F3A6E] text-[#1F3A6E] bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter and Bulk Action Controls */}
      <div className="bg-white border border-[#DDE3EA] rounded-md p-3 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="text-gray-500 font-semibold flex items-center gap-1">
            <Filter size={13} /> Filter:
          </span>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="border border-[#DDE3EA] bg-white rounded px-2.5 py-1 text-gray-700"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-[#DDE3EA] bg-white rounded px-2.5 py-1 text-gray-700"
          >
            <option value="all">All Lifecycle States</option>
            <option value="new">New (Unreviewed)</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="resolved">Resolved</option>
            <option value="escalated">Escalated</option>
          </select>
        </div>

        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1F3A6E]">{selectedIds.size} Selected</span>
            <button
              onClick={handleBulkAcknowledge}
              className="px-3 py-1 bg-[#1F3A6E] hover:bg-[#162B52] text-white rounded font-medium shadow-xs"
            >
              <CheckCheck size={12} className="inline mr-1" /> Acknowledge Selected
            </button>
            <button
              onClick={() =>
                addToast({
                  type: 'success',
                  title: 'Export Complete',
                  message: `${selectedIds.size} alerts exported to enforcement CSV dossier`,
                })
              }
              className="px-3 py-1 border border-[#DDE3EA] hover:bg-gray-100 rounded text-gray-700 font-medium"
            >
              <Download size={12} className="inline mr-1" /> Export Selected
            </button>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="bg-white border border-[#DDE3EA] rounded-md shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-[#F4F6F9] text-gray-600 font-bold uppercase tracking-wider border-b border-[#DDE3EA]">
              <tr>
                <th className="p-3 w-8">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.size === filteredAlerts.length && filteredAlerts.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="rounded accent-[#1F3A6E]"
                  />
                </th>
                <th className="p-3 text-left">Timestamp</th>
                <th className="p-3 text-left">Target Plate</th>
                <th className="p-3 text-left">Gate Location</th>
                <th className="p-3 text-left">Classification</th>
                <th className="p-3 text-left">Severity</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-right">Officer Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.map((alert, i) => {
                const isNewAlert = alert.status === 'new';
                const isSelected = selectedIds.has(alert.id);

                return (
                  <tr
                    key={alert.id}
                    className={`border-b border-[#DDE3EA]/70 transition-colors ${
                      isSelected
                        ? 'bg-blue-50/70'
                        : isNewAlert && i === 0
                        ? 'alert-new-row'
                        : i % 2 === 0
                        ? 'bg-white'
                        : 'bg-[#F4F6F9]/40'
                    } hover:bg-blue-50/40`}
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(alert.id)}
                        className="rounded accent-[#1F3A6E]"
                      />
                    </td>
                    <td className="p-3 font-mono text-gray-600 whitespace-nowrap">
                      {formatTimestamp(alert.timestamp)}
                    </td>
                    <td className="p-3">
                      {alert.plate ? (
                        <span className="font-mono font-bold text-[#1F3A6E] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {alert.plate}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">N/A (System)</span>
                      )}
                    </td>
                    <td className="p-3">
                      <p className="font-semibold text-gray-800">{alert.cameraName}</p>
                      <p className="text-[10px] text-gray-500 font-mono">
                        {alert.cameraId} · {alert.location}
                      </p>
                    </td>
                    <td className="p-3 capitalize font-medium text-gray-700">
                      {alert.type.replace(/_/g, ' ')}
                    </td>
                    <td className="p-3">
                      <StatusChip status={alert.severity} />
                    </td>
                    <td className="p-3">
                      <StatusChip status={alert.status} />
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Acknowledge button */}
                        {alert.status === 'new' && (
                          <button
                            onClick={() => {
                              acknowledgeAlert(alert.id);
                              addToast({
                                type: 'success',
                                title: 'Acknowledged',
                                message: `Alert ${alert.id} marked as acknowledged`,
                              });
                            }}
                            className="p-1 text-green-700 hover:bg-green-100 rounded"
                            title="Acknowledge Alert"
                          >
                            <CheckCircle size={15} />
                          </button>
                        )}

                        {/* View Trajectory */}
                        {alert.plate && (
                          <button
                            onClick={() => navigate(`/search?plate=${alert.plate}`)}
                            className="p-1 text-[#1F3A6E] hover:bg-blue-100 rounded"
                            title="Track Trajectory"
                          >
                            <Eye size={15} />
                          </button>
                        )}

                        {/* Resolve modal trigger */}
                        {alert.status !== 'resolved' && (
                          <button
                            onClick={() => setResolveModalId(alert.id)}
                            className="p-1 text-gray-600 hover:bg-gray-200 rounded"
                            title="Resolve Alert"
                          >
                            <CheckCheck size={15} />
                          </button>
                        )}

                        {/* Escalate modal trigger (hidden for Auditor) */}
                        {user?.role !== 'Auditor' && alert.status !== 'resolved' && (
                          <button
                            onClick={() => setEscalateModalId(alert.id)}
                            className="p-1 text-[#E8891A] hover:bg-amber-100 rounded"
                            title="Escalate Alert"
                          >
                            <ArrowUpRight size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredAlerts.length === 0 && (
          <div className="p-8 text-center text-gray-500 text-xs">
            No incidents found matching the selected filter criteria
          </div>
        )}
      </div>

      {/* Resolve Incident Modal */}
      <Modal
        isOpen={!!resolveModalId}
        onClose={() => setResolveModalId(null)}
        title="Resolve & Close Security Incident"
        size="md"
      >
        <div className="space-y-3">
          <p className="text-xs text-gray-600">
            Provide closing remarks for Incident Reference: <strong>{resolveModalId}</strong>
          </p>
          <textarea
            rows={3}
            value={resolveNote}
            onChange={(e) => setResolveNote(e.target.value)}
            placeholder="e.g. Intercepted by PCR van #12 / False positive speed read / Driver verified..."
            className="w-full border border-[#DDE3EA] rounded p-2.5 text-xs focus:outline-none focus:border-[#1F3A6E]"
          />
          <div className="flex justify-end gap-2 pt-2 border-t">
            <button
              onClick={() => setResolveModalId(null)}
              className="px-3 py-1.5 text-xs border border-[#DDE3EA] rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleResolveSubmit}
              className="px-3 py-1.5 text-xs bg-[#2E7D32] hover:bg-green-800 text-white rounded font-semibold"
            >
              Resolve & Archive
            </button>
          </div>
        </div>
      </Modal>

      {/* Escalate Alert Modal */}
      <Modal
        isOpen={!!escalateModalId}
        onClose={() => setEscalateModalId(null)}
        title="Escalate Incident to Higher Authority"
        size="sm"
      >
        <div className="space-y-3">
          <p className="text-xs text-gray-600">
            Escalate Incident <strong>{escalateModalId}</strong> to senior command officer:
          </p>
          <select
            value={escalateOfficer}
            onChange={(e) => setEscalateOfficer(e.target.value)}
            className="w-full border border-[#DDE3EA] bg-white rounded p-2 text-xs text-gray-800 focus:outline-none focus:border-[#1F3A6E]"
          >
            <option>Rajesh Kumar Singh (Commanding Officer - Admin)</option>
            <option>Priya Sharma (Chief Traffic Analyst)</option>
            <option>Amit Patel (Lead Field Enforcement)</option>
            <option>State Police Control Room (Gandhinagar HQ)</option>
          </select>
          <div className="flex justify-end gap-2 pt-2 border-t">
            <button
              onClick={() => setEscalateModalId(null)}
              className="px-3 py-1.5 text-xs border border-[#DDE3EA] rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleEscalateSubmit}
              className="px-3 py-1.5 text-xs bg-[#E8891A] hover:bg-amber-600 text-white rounded font-semibold"
            >
              Dispatch Escalation
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
