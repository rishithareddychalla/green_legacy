import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLogin } from './AdminLogin';
import { AdminRoute } from './AdminRoute';
import { AdminDashboardLayout } from './AdminDashboardLayout';
import { AdminOverview } from './AdminOverview';
import { UsersTable } from './UsersTable';
import { DonationsTable } from './DonationsTable';
import { ContactsTable } from './ContactsTable';
import { CSRTable } from './CSRTable';
import { TreesTable } from './TreesTable';
import { VolunteersTable } from './VolunteersTable';
import { LoginsTable } from './LoginsTable';
import { SignupsTable } from './SignupsTable';

export function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route
        path="dashboard"
        element={
          <AdminRoute>
            <AdminDashboardLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="users" element={<UsersTable />} />
        <Route path="donations" element={<DonationsTable />} />
  <Route path="logins" element={<LoginsTable />} />
  <Route path="signups" element={<SignupsTable />} />
        <Route path="contacts" element={<ContactsTable />} />
        <Route path="csr" element={<CSRTable />} />
        <Route path="trees" element={<TreesTable />} />
        <Route path="volunteers" element={<VolunteersTable />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
}