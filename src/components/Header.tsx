import React from 'react';
import { Bell, LogOut, Globe, Minus, Plus, Type } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useAlertStore, useUIStore } from '../store';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { unreadCount } = useAlertStore();
  const { fontSize, language, setFontSize, toggleLanguage } = useUIStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-border-card sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Left: Emblem + Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-navy flex items-center justify-center bg-navy/5">
            <span className="text-navy font-bold text-sm">IN</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-navy leading-tight">
              NagarDrishti
              <span className="text-xs font-normal text-text-muted ml-2">नगर दृष्टि</span>
            </h1>
            <p className="text-[10px] text-text-muted leading-tight">
              Bharat Electronics Limited – Smart City Traffic Management
            </p>
          </div>
        </div>

        {/* Center: Screen reader / font size */}
        <div className="hidden md:flex items-center gap-1 text-xs text-text-muted">
          <span className="mr-1">Screen reader access</span>
          <span className="mx-1">|</span>
          <button
            onClick={() => setFontSize(Math.max(12, fontSize - 1))}
            className="px-1 hover:text-navy"
            aria-label="Decrease font size"
            title="Decrease font size"
          >
            <span className="flex items-center gap-0.5"><Type size={10} /><Minus size={8} /></span>
          </button>
          <button
            onClick={() => setFontSize(14)}
            className="px-1 font-bold hover:text-navy"
            aria-label="Reset font size"
            title="Reset font size"
          >
            A
          </button>
          <button
            onClick={() => setFontSize(Math.min(20, fontSize + 1))}
            className="px-1 hover:text-navy"
            aria-label="Increase font size"
            title="Increase font size"
          >
            <span className="flex items-center gap-0.5"><Type size={14} /><Plus size={8} /></span>
          </button>
        </div>

        {/* Right: User info, notifications, language, logout */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="text-xs border border-border-card rounded px-2 py-1 hover:bg-bg-main transition-colors"
            aria-label="Toggle language"
          >
            <Globe size={12} className="inline mr-1" />
            {language}
          </button>

          <button
            onClick={() => navigate('/alerts')}
            className="relative p-2 hover:bg-bg-main rounded-lg transition-colors"
            aria-label={`Notifications: ${unreadCount} unread`}
          >
            <Bell size={18} className="text-text-body" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-status-red text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          <div className="hidden sm:flex items-center gap-2 border-l border-border-card pl-3">
            <div className="text-right">
              <p className="text-sm font-medium text-text-heading leading-tight">{user?.name}</p>
              <p className="text-[10px] text-text-muted">{user?.role} | {user?.officerId}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors text-text-muted hover:text-status-red"
            aria-label="Logout"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};
