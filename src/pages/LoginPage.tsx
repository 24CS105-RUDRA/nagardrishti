import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { Shield, KeyRound, UserCheck, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [officerId, setOfficerId] = useState('BEL-IND-8841');
  const [password, setPassword] = useState('GovPortal@2026');
  const [role, setRole] = useState<'Admin' | 'Traffic Analyst' | 'Enforcement Officer' | 'Auditor'>('Traffic Analyst');
  const [captcha, setCaptcha] = useState('10');
  const [error, setError] = useState('');
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerId.trim() || !password.trim()) {
      setError('Please provide Officer ID and password');
      return;
    }
    if (captcha.trim() !== '10') {
      setError('Incorrect security verification answer (7 + 3 = 10)');
      return;
    }
    login(officerId, role);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col justify-between">
      {/* Tricolour top strip */}
      <div className="h-1.5 flex" aria-hidden="true">
        <div className="flex-1 bg-[#E8891A]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-md border border-[#DDE3EA] shadow-md p-8">
          {/* Emblem & Portal Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full border-2 border-[#1F3A6E] bg-blue-50/50 flex flex-col items-center justify-center mx-auto mb-3 shadow-inner">
              <span className="text-[#1F3A6E] font-extrabold text-sm tracking-widest">भारत</span>
              <span className="text-[10px] text-gray-500 font-semibold uppercase">BEL</span>
            </div>
            <h1 className="text-xl font-bold text-[#1F3A6E] tracking-tight">NagarDrishti</h1>
            <p className="text-xs font-semibold text-[#E8891A] mt-0.5">नगर दृष्टि · Smart ANPR Platform</p>
            <p className="text-[11px] text-gray-500 mt-1">
              Bharat Electronics Limited – Advanced City Surveillance
            </p>
          </div>

          {/* Warning banner */}
          <div className="bg-red-50 border border-red-200 rounded px-3 py-2 mb-5 flex items-start gap-2">
            <AlertCircle size={16} className="text-[#C62828] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-[#C62828]">Authorized Personnel Only</p>
              <p className="text-[11px] text-red-700/80 leading-snug">
                Unauthorized access to traffic trajectory infrastructure is punishable under IT Act 2000.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-100/70 border border-red-300 text-red-800 text-xs px-3 py-2 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="officerId">
                Officer ID / Service Number
              </label>
              <div className="relative">
                <input
                  id="officerId"
                  type="text"
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value)}
                  className="w-full border border-[#DDE3EA] rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#1F3A6E] focus:ring-1 focus:ring-[#1F3A6E]"
                  placeholder="e.g. BEL-IND-8841"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-[#DDE3EA] rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#1F3A6E] focus:ring-1 focus:ring-[#1F3A6E]"
                  placeholder="Enter secure password"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="role">
                Assigned Operational Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full border border-[#DDE3EA] bg-white rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#1F3A6E] focus:ring-1 focus:ring-[#1F3A6E]"
              >
                <option value="Admin">Admin (Full System & Config Control)</option>
                <option value="Traffic Analyst">Traffic Analyst (Trajectory & Heatmap Analytics)</option>
                <option value="Enforcement Officer">Enforcement Officer (Interception & Blacklist)</option>
                <option value="Auditor">Auditor (Log Verification & Read-Only)</option>
              </select>
            </div>

            {/* Captcha */}
            <div className="border border-[#DDE3EA] rounded bg-gray-50/70 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-700">Security Math Verification</span>
                <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 border border-gray-300 rounded text-[#1F3A6E] tracking-wider">
                  7 + 3 = ?
                </span>
              </div>
              <input
                type="text"
                value={captcha}
                onChange={(e) => setCaptcha(e.target.value)}
                className="w-full border border-[#DDE3EA] bg-white rounded px-3 py-1.5 text-sm text-center font-mono focus:outline-none focus:border-[#1F3A6E]"
                placeholder="Enter computed answer"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#1F3A6E] hover:bg-[#162B52] text-white py-2.5 px-4 rounded text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Shield size={16} /> Sign In to Command Console
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#DDE3EA] text-center">
            <p className="text-[11px] text-gray-500">
              Demo Portal: Use any Officer ID or click Sign In directly.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#DDE3EA] bg-white py-3 px-4 text-center text-xs text-gray-500">
        © Bharat Electronics Limited | Designed for Smart City Traffic Management | Helpline: 1800-XXX-XXXX
      </footer>
    </div>
  );
};
