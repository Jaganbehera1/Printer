import { Route, Routes } from 'react-router-dom';
import ConfigMissing from '@/components/ConfigMissing';
import RequireAdmin from '@/admin/RequireAdmin';
import { isFirebaseConfigured } from '@/firebase/client';
import { isCloudinaryConfigured } from '@/services/storageService';
import AdminLayout from '@/layouts/AdminLayout';
import PublicLayout from '@/layouts/PublicLayout';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import AdminJobsPage from '@/pages/AdminJobsPage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import AdminSettingsPage from '@/pages/AdminSettingsPage';
import HomePage from '@/pages/HomePage';
import NotFoundPage from '@/pages/NotFoundPage';
import PrintRequestPage from '@/pages/PrintRequestPage';
import StatusPage from '@/pages/StatusPage';
import SuccessPage from '@/pages/SuccessPage';

export default function App() {
  if (!isFirebaseConfigured || !isCloudinaryConfigured) return <ConfigMissing />;

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/print" element={<PrintRequestPage />} />
        <Route path="/success/:jobId" element={<SuccessPage />} />
        <Route path="/status/:jobId" element={<StatusPage />} />
      </Route>

      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="jobs" element={<AdminJobsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
