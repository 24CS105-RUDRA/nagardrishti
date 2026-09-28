import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ToastContainer } from './ui';
import { useAuthStore, useUIStore } from '../store';

export const Layout: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { sidebarCollapsed } = useUIStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg-main">
      {/* Tricolour strip */}
      <div className="h-1 flex" aria-hidden="true">
        <div className="flex-1 bg-saffron" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-green-india" />
      </div>
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main
          className={`flex-1 overflow-auto transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-56'}`}
          role="main"
        >
          <div className="p-6 min-h-full">
            <Outlet />
          </div>
          {/* Footer */}
          <footer className="border-t border-border-card bg-white px-6 py-3 text-xs text-text-muted text-center">
            © Bharat Electronics Limited | Designed for Smart City Traffic Management | Last updated: {new Date().toLocaleDateString('en-IN')} | Helpline: 1800-274-4357
          </footer>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};
