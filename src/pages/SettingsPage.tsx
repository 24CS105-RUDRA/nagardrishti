import React, { useState } from 'react';
import {
  Save,
  Plus,
  Edit2,
  Users,
  Sliders,
  BellRing,
  ShieldCheck,
  AlertTriangle,
  Mail,
  Smartphone,
  Webhook,
} from 'lucide-react';
import { Breadcrumbs, StatusChip, Modal } from '../components/ui';
import { useAuthStore, useToastStore } from '../store';
import { users as seedUsers } from '../data/users';
import type { User } from '../data/types';

export const SettingsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { addToast } = useToastStore();

  const [activeTab, setActiveTab] = useState<'users' | 'thresholds' | 'notifications'>('users');
  const [userList, setUserList] = useState<User[]>(seedUsers);

  // Threshold states
  const [congestionThreshold, setCongestionThreshold] = useState(75);
  const [ocrThreshold, setOcrThreshold] = useState(85);
  const [speedTolerance, setSpeedTolerance] = useState(10);
  const [alertCooldown, setAlertCooldown] = useState(15);

  // Notification toggles
  const [notifChannels, setNotifChannels] = useState({
    email: true,
    sms: true,
    webhook: false,
    soundAlarm: true,
  });

  // Modal
  const [addUserModal, setAddUserModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newOfficerId, setNewOfficerId] = useState('');
  const [newRole, setNewRole] = useState<User['role']>('Traffic Analyst');
  const [newEmail, setNewEmail] = useState('');

  const isAdmin = user?.role === 'Admin';

  const handleSaveThresholds = () => {
    addToast({
      type: 'success',
      title: 'Thresholds Updated',
      message: 'Neural ANPR cutoff and congestion sensitivity metrics updated on central server',
    });
  };

  const handleSaveChannels = () => {
    addToast({
      type: 'success',
      title: 'Dispatch Channels Saved',
      message: 'State Police Command dispatch hooks updated successfully',
    });
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: `USR-${String(userList.length + 1).padStart(3, '0')}`,
      name: newName,
      officerId: newOfficerId,
      role: newRole,
      email: newEmail,
      phone: '+91 79 2630 XXXX',
      lastLogin: new Date(),
      status: 'active',
    };

    setUserList([...userList, newUser]);
    setAddUserModal(false);
    setNewName('');
    setNewOfficerId('');
    setNewEmail('');

    addToast({
      type: 'success',
      title: 'Personnel Provisioned',
      message: `Access credentials created for ${newUser.name} (${newUser.role})`,
    });
  };

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'System Configuration' }]} />

      {/* Header */}
      <div className="bg-white border border-[#DDE3EA] rounded-md shadow-sm p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-[#1F3A6E] tracking-tight">
            System & Architecture Parameter Configuration
          </h1>
          <p className="text-xs text-gray-500">
            Current Operator: <strong>{user?.name}</strong> · Role:{' '}
            <span className="font-semibold text-[#1F3A6E]">{user?.role}</span>
          </p>
        </div>

        {!isAdmin && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-1.5 rounded flex items-center gap-1.5">
            <AlertTriangle size={14} className="text-[#ED9B00]" />
            <span>Read-Only Preview: Administrative privilege required for modifications</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[#DDE3EA]">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors ${
            activeTab === 'users'
              ? 'border-[#1F3A6E] text-[#1F3A6E] bg-white'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Users size={13} /> Personnel Access & Role Matrix
        </button>
        <button
          onClick={() => setActiveTab('thresholds')}
          className={`px-4 py-2 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors ${
            activeTab === 'thresholds'
              ? 'border-[#1F3A6E] text-[#1F3A6E] bg-white'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Sliders size={13} /> Analytics & Optical Cutoffs
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors ${
            activeTab === 'notifications'
              ? 'border-[#1F3A6E] text-[#1F3A6E] bg-white'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <BellRing size={13} /> Alert Notification Gateways
        </button>
      </div>

      {/* Tab 1: Users & Roles */}
      {activeTab === 'users' && (
        <div className="bg-white border border-[#DDE3EA] rounded-md shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#DDE3EA] flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                Authorized Platform Operators ({userList.length})
              </h3>
              <p className="text-[11px] text-gray-500">
                Role-based access control for Gujarat Traffic Command
              </p>
            </div>
            {isAdmin && (
              <button
                onClick={() => setAddUserModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#1F3A6E] hover:bg-[#162B52] text-white rounded font-semibold transition-colors shadow-xs"
              >
                <Plus size={13} /> Add Officer Account
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-[#F4F6F9] text-gray-600 font-bold uppercase tracking-wider border-b border-[#DDE3EA]">
                <tr>
                  <th className="p-3 text-left">Officer Name</th>
                  <th className="p-3 text-left">Service ID</th>
                  <th className="p-3 text-left">Designated Role</th>
                  <th className="p-3 text-left">Official Email</th>
                  <th className="p-3 text-left">Contact Number</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {userList.map((u, idx) => (
                  <tr
                    key={u.id}
                    className={`border-b border-[#DDE3EA]/70 hover:bg-blue-50/40 transition-colors ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-[#F4F6F9]/30'
                    }`}
                  >
                    <td className="p-3 font-semibold text-gray-800 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#1F3A6E]/10 text-[#1F3A6E] font-bold flex items-center justify-center text-[10px]">
                        {u.name.charAt(0)}
                      </div>
                      {u.name}
                    </td>
                    <td className="p-3 font-mono font-bold text-gray-700">{u.officerId}</td>
                    <td className="p-3">
                      <span className="font-semibold text-[#1F3A6E] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-gray-600">{u.email}</td>
                    <td className="p-3 font-mono text-gray-600">{u.phone}</td>
                    <td className="p-3">
                      <StatusChip status={u.status} />
                    </td>
                    <td className="p-3 text-right">
                      {isAdmin ? (
                        <button
                          onClick={() =>
                            addToast({
                              type: 'info',
                              title: 'Edit Officer Permissions',
                              message: `Editing credentials for ${u.name}`,
                            })
                          }
                          className="p-1 text-gray-500 hover:bg-gray-200 rounded"
                        >
                          <Edit2 size={13} />
                        </button>
                      ) : (
                        <span className="text-[10px] text-gray-400">Locked</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Thresholds */}
      {activeTab === 'thresholds' && (
        <div className="bg-white border border-[#DDE3EA] rounded-md shadow-sm p-6 space-y-6 max-w-3xl">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                Congestion Sensitivity Index
              </label>
              <span className="text-xs font-mono font-bold text-[#1F3A6E] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {congestionThreshold}% Density
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mb-2">
              Intersections exceeding this density ratio will trigger automatic arterial re-routing advisories
            </p>
            <input
              type="range"
              min="50"
              max="95"
              disabled={!isAdmin}
              value={congestionThreshold}
              onChange={(e) => setCongestionThreshold(Number(e.target.value))}
              className="w-full accent-[#1F3A6E]"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                Neural OCR Confidence Filter Cutoff
              </label>
              <span className="text-xs font-mono font-bold text-[#C62828] bg-red-50 px-2 py-0.5 rounded border border-red-200">
                {ocrThreshold}% Minimum Parity
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mb-2">
              Optical reads scoring below this probability threshold are routed directly to the Manual Verification Queue
            </p>
            <input
              type="range"
              min="70"
              max="98"
              disabled={!isAdmin}
              value={ocrThreshold}
              onChange={(e) => setOcrThreshold(Number(e.target.value))}
              className="w-full accent-[#1F3A6E]"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                Radar Speed Violation Margin of Tolerance
              </label>
              <span className="text-xs font-mono font-bold text-[#ED9B00] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                +{speedTolerance} km/h Tolerance
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mb-2">
              Buffer velocity before automated challan generation is enacted
            </p>
            <input
              type="range"
              min="0"
              max="20"
              disabled={!isAdmin}
              value={speedTolerance}
              onChange={(e) => setSpeedTolerance(Number(e.target.value))}
              className="w-full accent-[#1F3A6E]"
            />
          </div>

          {isAdmin && (
            <div className="pt-4 border-t flex justify-end">
              <button
                onClick={handleSaveThresholds}
                className="flex items-center gap-1.5 px-4 py-2 text-xs bg-[#1F3A6E] hover:bg-[#162B52] text-white rounded font-semibold transition-colors shadow-xs"
              >
                <Save size={13} /> Save Neural Parameters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Notification Channels */}
      {activeTab === 'notifications' && (
        <div className="bg-white border border-[#DDE3EA] rounded-md shadow-sm p-6 space-y-4 max-w-3xl">
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-2">
            Interception Broadcast Gateways
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 border border-[#DDE3EA] rounded-md">
              <div className="flex items-center gap-3">
                <Mail className="text-[#1F3A6E]" size={20} />
                <div>
                  <h4 className="text-xs font-bold text-gray-800">Automated Official Email Digest</h4>
                  <p className="text-[11px] text-gray-500">
                    Dispatches hourly incident roll-ups to Gujarat Police Control Room
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                disabled={!isAdmin}
                checked={notifChannels.email}
                onChange={(e) =>
                  setNotifChannels({ ...notifChannels, email: e.target.checked })
                }
                className="w-4 h-4 accent-[#1F3A6E]"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 border border-[#DDE3EA] rounded-md">
              <div className="flex items-center gap-3">
                <Smartphone className="text-[#2E7D32]" size={20} />
                <div>
                  <h4 className="text-xs font-bold text-gray-800">Critical SMS Field Intercept Dispatch</h4>
                  <p className="text-[11px] text-gray-500">
                    Sends high-priority SMS alerts to patrolling PCR vans on blacklist match
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                disabled={!isAdmin}
                checked={notifChannels.sms}
                onChange={(e) =>
                  setNotifChannels({ ...notifChannels, sms: e.target.checked })
                }
                className="w-4 h-4 accent-[#1F3A6E]"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 border border-[#DDE3EA] rounded-md">
              <div className="flex items-center gap-3">
                <Webhook className="text-[#E8891A]" size={20} />
                <div>
                  <h4 className="text-xs font-bold text-gray-800">State Command Webhook Webhook API</h4>
                  <p className="text-[11px] text-gray-500">
                    REST POST payload trigger to central Ministry of Road Transport (MoRTH) servers
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                disabled={!isAdmin}
                checked={notifChannels.webhook}
                onChange={(e) =>
                  setNotifChannels({ ...notifChannels, webhook: e.target.checked })
                }
                className="w-4 h-4 accent-[#1F3A6E]"
              />
            </div>
          </div>

          {isAdmin && (
            <div className="pt-4 border-t flex justify-end">
              <button
                onClick={handleSaveChannels}
                className="flex items-center gap-1.5 px-4 py-2 text-xs bg-[#1F3A6E] hover:bg-[#162B52] text-white rounded font-semibold transition-colors shadow-xs"
              >
                <Save size={13} /> Update Dispatch Gateways
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add User Modal */}
      <Modal
        isOpen={addUserModal}
        onClose={() => setAddUserModal(false)}
        title="Provision New Operator Profile"
        size="md"
      >
        <form onSubmit={handleCreateUser} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Inspector R. K. Varma"
              className="w-full border border-[#DDE3EA] rounded px-3 py-1.5 text-xs text-gray-800"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Government Officer ID *
            </label>
            <input
              type="text"
              value={newOfficerId}
              onChange={(e) => setNewOfficerId(e.target.value)}
              placeholder="e.g. BEL-IND-9912"
              className="w-full border border-[#DDE3EA] rounded px-3 py-1.5 text-xs font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Assigned Role</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as any)}
              className="w-full border border-[#DDE3EA] bg-white rounded px-3 py-1.5 text-xs text-gray-800"
            >
              <option value="Admin">Admin</option>
              <option value="Traffic Analyst">Traffic Analyst</option>
              <option value="Enforcement Officer">Enforcement Officer</option>
              <option value="Auditor">Auditor</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Official NIC / BEL Email</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="name@bel.gov.in"
              className="w-full border border-[#DDE3EA] rounded px-3 py-1.5 text-xs font-mono"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={() => setAddUserModal(false)}
              className="px-3 py-1.5 text-xs border border-[#DDE3EA] rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs bg-[#1F3A6E] hover:bg-[#162B52] text-white rounded font-semibold shadow-xs"
            >
              Issue Access Card
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
