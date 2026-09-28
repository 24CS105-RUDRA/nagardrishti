import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { PlateSearchPage } from './pages/PlateSearchPage';
import { LiveMapPage } from './pages/LiveMapPage';
import { AlertsPage } from './pages/AlertsPage';
import { BlacklistPage } from './pages/BlacklistPage';
import { CameraManagerPage } from './pages/CameraManagerPage';
import { ReviewQueuePage } from './pages/ReviewQueuePage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AuditLogPage } from './pages/AuditLogPage';
import { useAuthStore } from './store';

export function App() {
  const { isAuthenticated, login } = useAuthStore();

  // Auto-login with default session so the user can immediately explore without friction
  useEffect(() => {
    if (!isAuthenticated) {
      login('BEL-IND-8841', 'Traffic Analyst');
    }
  }, [isAuthenticated, login]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Operational Routes inside Government Portal Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="search" element={<PlateSearchPage />} />
          <Route path="live-map" element={<LiveMapPage />} />
          <Route path="alerts" element={<AlertsPage />} />
          <Route path="blacklist" element={<BlacklistPage />} />
          <Route path="cameras" element={<CameraManagerPage />} />
          <Route path="review" element={<ReviewQueuePage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="audit" element={<AuditLogPage />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
