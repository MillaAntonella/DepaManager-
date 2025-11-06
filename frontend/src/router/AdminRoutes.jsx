// frontend/src/router/AdminRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminLayout from '../components/layout/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import DepartmentsList from '../pages/admin/departments/DepartmentsList';
import TenantsList from '../pages/admin/tenants/TenantsList';

export default function AdminRoutes() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || user?.rol !== 'Administrador') {
    return <Navigate to="/admin/auth" replace />;
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/departments" element={<DepartmentsList />} />
        <Route path="/tenants" element={<TenantsList />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </AdminLayout>
  );
}