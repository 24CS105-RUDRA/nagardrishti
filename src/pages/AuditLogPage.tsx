import React, { useState, useEffect } from 'react';
import { Search, Filter, ShieldCheck, Download, ScrollText } from 'lucide-react';
import { Breadcrumbs, TableSkeleton } from '../components/ui';
import { auditLogEntries as seedAuditLog } from '../data/auditLog';
import { mockApi } from '../mockApi';
import { useToastStore } from '../store';
import type { AuditLogEntry } from '../data/types';

export const AuditLogPage: React.FC = () => {
  const { addToast } = useToastStore();
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');

  useEffect(() => {
    mockApi(seedAuditLog, 300).then((data) => {
      setEntries(data);
      setLoading(false);
    });
  }, []);

  const modules = ['all', ...Array.from(new Set(entries.map((e) => e.module)))];

  const filtered = entries.filter((e) => {
    if (moduleFilter !== 'all' && e.module !== moduleFilter) return false;
    if (
      search &&
      !e.action.toLowerCase().includes(search.toLowerCase()) &&
      !e.userName.toLowerCase().includes(search.toLowerCase()) &&
      !e.ipAddress.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const formatTimestamp = (d: Date) =>
    new Date(d).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

  if (loading) {
    return (
      <div className="space-y-4">
        <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Security Audit Trail' }]} />
        <TableSkeleton rows={10} cols={5} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Security Audit Trail' }]} />

      {/* Header */}
      <div className="bg-white border border-[#DDE3EA] rounded-md shadow-sm p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-[#1F3A6E] tracking-tight flex items-center gap-2">
            <ScrollText size={18} />
            Cryptographic Operator Action & Audit Trail
          </h1>
          <p className="text-xs text-gray-500">
            Immutable system activity log tracking all operator queries, blacklist edits, and incident escalations
          </p>
        </div>

        <button
          onClick={() =>
            addToast({
              type: 'success',
              title: 'Audit Log Exported',
              message: 'Full SHA-256 verified audit ledger exported to CSV format',
            })
          }
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[#DDE3EA] hover:bg-gray-100 rounded text-gray-700 font-semibold transition-colors"
        >
          <Download size={13} /> Export Ledger CSV
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#DDE3EA] rounded-md p-3 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative max-w-sm w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by officer name, action keyword, or IP..."
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-[#DDE3EA] rounded focus:outline-none focus:border-[#1F3A6E]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={13} className="text-gray-500" />
          <span className="text-gray-600 font-medium">Subsystem Module:</span>
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="border border-[#DDE3EA] bg-white rounded px-2.5 py-1 text-xs text-gray-700"
          >
            {modules.map((m) => (
              <option key={m} value={m}>
                {m === 'all' ? 'All Subsystems' : m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-[#DDE3EA] rounded-md shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-[#F4F6F9] text-gray-600 font-bold uppercase tracking-wider border-b border-[#DDE3EA]">
              <tr>
                <th className="p-3 text-left">Event Timestamp</th>
                <th className="p-3 text-left">Operator Profile</th>
                <th className="p-3 text-left">Action Description</th>
                <th className="p-3 text-left">Subsystem Module</th>
                <th className="p-3 text-left">Origin IP Address</th>
                <th className="p-3 text-right">Verification</th>
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
                  <td className="p-3 font-mono text-gray-600 whitespace-nowrap">
                    {formatTimestamp(entry.timestamp)}
                  </td>
                  <td className="p-3">
                    <p className="font-semibold text-gray-800">{entry.userName}</p>
                    <p className="text-[10px] text-gray-400 font-mono">{entry.userId}</p>
                  </td>
                  <td className="p-3 font-medium text-gray-800 leading-snug">{entry.action}</td>
                  <td className="p-3">
                    <span className="font-semibold text-[11px] text-[#1F3A6E] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {entry.module}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-gray-600">{entry.ipAddress}</td>
                  <td className="p-3 text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#2E7D32] bg-green-50 px-2 py-0.5 rounded border border-green-200">
                      <ShieldCheck size={11} /> SHA-256
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-8 text-center text-gray-500 text-xs">
            No audit records found matching search filters
          </div>
        )}
      </div>
    </div>
  );
};
