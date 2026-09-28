import { create } from 'zustand';
import type { Alert, User } from '../data/types';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (officerId: string, role: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: (officerId: string, role: string) => {
    const user: User = {
      id: `USR-${officerId}`,
      name: role === 'Admin' ? 'Rajesh Kumar Singh' : role === 'Traffic Analyst' ? 'Priya Sharma' : role === 'Enforcement Officer' ? 'Amit Patel' : 'Sunita Desai',
      officerId,
      role: role as User['role'],
      email: `${officerId.toLowerCase()}@bel.gov.in`,
      phone: '+91 79 2630 XXXX',
      lastLogin: new Date(),
      status: 'active',
    };
    set({ isAuthenticated: true, user });
  },
  logout: () => set({ isAuthenticated: false, user: null }),
}));

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
}

interface ToastState {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, toast.duration || 4000);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

interface AlertState {
  alerts: Alert[];
  unreadCount: number;
  setAlerts: (alerts: Alert[]) => void;
  addAlert: (alert: Alert) => void;
  acknowledgeAlert: (id: string) => void;
  resolveAlert: (id: string, note: string) => void;
  escalateAlert: (id: string, officer: string) => void;
  acknowledgeMultiple: (ids: string[]) => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  alerts: [],
  unreadCount: 0,
  setAlerts: (alerts) => set({ alerts, unreadCount: alerts.filter((a) => a.status === 'new').length }),
  addAlert: (alert) =>
    set((state) => ({
      alerts: [alert, ...state.alerts],
      unreadCount: state.unreadCount + 1,
    })),
  acknowledgeAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === id ? { ...a, status: 'acknowledged' as const } : a)),
      unreadCount: Math.max(0, state.unreadCount - (state.alerts.find((a) => a.id === id)?.status === 'new' ? 1 : 0)),
    })),
  resolveAlert: (id, note) =>
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === id ? { ...a, status: 'resolved' as const, description: a.description + ` | Resolution: ${note}` } : a)),
      unreadCount: Math.max(0, state.unreadCount - (state.alerts.find((a) => a.id === id)?.status === 'new' ? 1 : 0)),
    })),
  escalateAlert: (id, officer) =>
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === id ? { ...a, status: 'escalated' as const, assignedTo: officer } : a)),
    })),
  acknowledgeMultiple: (ids) =>
    set((state) => ({
      alerts: state.alerts.map((a) => (ids.includes(a.id) && a.status === 'new' ? { ...a, status: 'acknowledged' as const } : a)),
      unreadCount: Math.max(0, state.unreadCount - state.alerts.filter((a) => ids.includes(a.id) && a.status === 'new').length),
    })),
}));

interface UIState {
  sidebarCollapsed: boolean;
  fontSize: number;
  language: 'EN' | 'HI';
  toggleSidebar: () => void;
  setFontSize: (size: number) => void;
  toggleLanguage: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  fontSize: 14,
  language: 'EN',
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setFontSize: (fontSize) => {
    document.documentElement.style.fontSize = `${fontSize}px`;
    set({ fontSize });
  },
  toggleLanguage: () => set((state) => ({ language: state.language === 'EN' ? 'HI' : 'EN' })),
}));
