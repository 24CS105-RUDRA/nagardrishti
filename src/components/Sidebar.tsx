import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Search, Map, AlertTriangle, ShieldAlert,
  Camera, ClipboardCheck, FileText, Settings, ScrollText, Menu
} from 'lucide-react';
import { useUIStore, useAlertStore } from '../store';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/search', label: 'Plate Search', icon: Search },
  { path: '/live-map', label: 'Live Map', icon: Map },
  { path: '/alerts', label: 'Alerts Center', icon: AlertTriangle },
  { path: '/blacklist', label: 'Blacklist', icon: ShieldAlert },
  { path: '/cameras', label: 'Camera Manager', icon: Camera },
  { path: '/review', label: 'Manual Review', icon: ClipboardCheck },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/settings', label: 'Settings', icon: Settings },
  { path: '/audit', label: 'Audit Log', icon: ScrollText },
];

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const { unreadCount } = useAlertStore();
  const location = useLocation();

  return (
    <aside
      className={`fixed left-0 top-0 mt-[calc(0.25rem+3.25rem)] h-[calc(100vh-0.25rem-3.25rem)] bg-white border-r border-border-card z-30 transition-all duration-300 flex flex-col ${
        sidebarCollapsed ? 'w-16' : 'w-56'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <button
        onClick={toggleSidebar}
        className="p-3 hover:bg-bg-main border-b border-border-card flex items-center justify-center"
        aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <Menu size={18} className="text-text-body" />
      </button>

      <nav className="flex-1 overflow-y-auto py-2">
        {navItems.map((item) => {
          const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 mx-2 my-0.5 rounded-md text-sm transition-colors ${
                isActive
                  ? 'bg-navy text-white font-medium'
                  : 'text-text-body hover:bg-bg-main hover:text-navy'
              }`}
              title={item.label}
            >
              <Icon size={18} className="shrink-0" />
              {!sidebarCollapsed && (
                <span className="truncate">{item.label}</span>
              )}
              {item.path === '/alerts' && unreadCount > 0 && (
                <span className={`ml-auto text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 ${
                  isActive ? 'bg-white text-navy' : 'bg-status-red text-white'
                }`}>
                  {unreadCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};
