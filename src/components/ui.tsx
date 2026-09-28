import React from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertOctagon } from 'lucide-react';
import { useToastStore } from '../store';

const icons = {
  success: CheckCircle,
  error: AlertOctagon,
  warning: AlertTriangle,
  info: Info,
};

const colors = {
  success: 'border-l-status-green bg-status-green-bg',
  error: 'border-l-status-red bg-status-red-bg',
  warning: 'border-l-status-amber bg-status-amber-bg',
  info: 'border-l-status-blue bg-status-blue-bg',
};

const iconColors = {
  success: 'text-status-green',
  error: 'text-status-red',
  warning: 'text-status-amber',
  info: 'text-status-blue',
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-16 right-4 z-50 space-y-2 max-w-sm" role="alert" aria-live="polite">
      {toasts.map((toast) => {
        const Icon = icons[toast.type];
        return (
          <div
            key={toast.id}
            className={`toast-enter border-l-4 ${colors[toast.type]} rounded-md shadow-lg p-3 flex items-start gap-2`}
          >
            <Icon size={18} className={`${iconColors[toast.type]} shrink-0 mt-0.5`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-heading">{toast.title}</p>
              <p className="text-xs text-text-body mt-0.5">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-text-muted hover:text-text-heading"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

// --- KPI Card ---
interface KpiCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  trend?: { value: string; positive: boolean };
  onClick?: () => void;
  loading?: boolean;
}

export const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon, subtitle, trend, onClick, loading }) => {
  if (loading) {
    return (
      <div className="bg-white border border-border-card rounded-md p-4 shadow-sm">
        <div className="skeleton h-4 w-24 mb-2" />
        <div className="skeleton h-8 w-32 mb-1" />
        <div className="skeleton h-3 w-20" />
      </div>
    );
  }

  return (
    <div
      className={`bg-white border border-border-card rounded-md p-4 shadow-sm transition-all ${
        onClick ? 'cursor-pointer hover:shadow-md hover:border-navy/30' : ''
      }`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-text-muted font-medium uppercase tracking-wide">{title}</span>
        <div className="text-navy/60">{icon}</div>
      </div>
      <p className="text-2xl font-bold text-text-heading">{typeof value === 'number' ? value.toLocaleString('en-IN') : value}</p>
      <div className="flex items-center gap-2 mt-1">
        {subtitle && <span className="text-xs text-text-muted">{subtitle}</span>}
        {trend && (
          <span className={`text-xs font-medium ${trend.positive ? 'text-status-green' : 'text-status-red'}`}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
    </div>
  );
};

// --- Status Chip ---
interface StatusChipProps {
  status: string;
  size?: 'sm' | 'md';
}

const statusStyles: Record<string, string> = {
  online: 'bg-status-green-bg text-status-green',
  offline: 'bg-gray-100 text-gray-600',
  alerting: 'bg-status-red-bg text-status-red',
  active: 'bg-status-green-bg text-status-green',
  inactive: 'bg-gray-100 text-gray-600',
  new: 'bg-status-red-bg text-status-red',
  acknowledged: 'bg-status-amber-bg text-status-amber',
  resolved: 'bg-status-green-bg text-status-green',
  escalated: 'bg-status-blue-bg text-status-blue',
  pending: 'bg-status-amber-bg text-status-amber',
  confirmed: 'bg-status-green-bg text-status-green',
  corrected: 'bg-status-blue-bg text-status-blue',
  rejected: 'bg-status-red-bg text-status-red',
  critical: 'bg-status-red-bg text-status-red',
  high: 'bg-orange-50 text-orange-700',
  medium: 'bg-status-amber-bg text-status-amber',
  low: 'bg-status-blue-bg text-status-blue',
  free: 'bg-status-green-bg text-status-green',
  moderate: 'bg-status-amber-bg text-status-amber',
  congested: 'bg-orange-50 text-orange-700',
  gridlock: 'bg-status-red-bg text-status-red',
  completed: 'bg-status-green-bg text-status-green',
  generating: 'bg-status-amber-bg text-status-amber',
};

export const StatusChip: React.FC<StatusChipProps> = ({ status, size = 'sm' }) => {
  const style = statusStyles[status] ?? 'bg-gray-100 text-gray-600';
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium capitalize ${style} ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
      }`}
    >
      {status.replace('_', ' ')}
    </span>
  );
};

// --- Modal ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-border-card">
          <h2 className="text-lg font-semibold text-text-heading">{title}</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-heading p-1" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};

// --- Breadcrumbs ---
interface BreadcrumbItem {
  label: string;
  path?: string;
}

export const Breadcrumbs: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => {
  return (
    <nav className="text-xs text-text-muted mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center gap-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <span className="mx-1">/</span>}
            {item.path ? (
              <a href={item.path} className="hover:text-navy hover:underline">{item.label}</a>
            ) : (
              <span className="text-text-heading font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

// --- Skeleton loaders ---
export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 5 }) => (
  <div className="bg-white border border-border-card rounded-md overflow-hidden">
    <div className="p-3 border-b border-border-card flex gap-4">
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="skeleton h-4 flex-1" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="p-3 border-b border-border-card flex gap-4">
        {Array.from({ length: cols }).map((_, c) => (
          <div key={c} className="skeleton h-3 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

export const CardSkeleton: React.FC = () => (
  <div className="bg-white border border-border-card rounded-md p-4 shadow-sm">
    <div className="skeleton h-4 w-24 mb-3" />
    <div className="skeleton h-8 w-32 mb-2" />
    <div className="skeleton h-3 w-20" />
  </div>
);
