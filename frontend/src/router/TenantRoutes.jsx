// frontend/src/router/TenantRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import TenantLayout from '../components/layout/TenantLayout';
import TenantDashboard from '../pages/tenant/Dashboard';

export default function TenantRoutes() {
  const { user, isAuthenticated } = useAuth();

  console.log('🔍 TenantRoutes - Verificando acceso:', {
    isAuthenticated,
    userRol: user?.rol,
    canAccess: isAuthenticated && user?.rol === 'Inquilino'
  });

  // ✅ CORREGIDO: Si no está autenticado, redirigir a /admin/auth (no /tenant/login)
  if (!isAuthenticated || user?.rol !== 'Inquilino') {
    console.log('❌ TenantRoutes - Acceso denegado, redirigiendo a /admin/auth');
    return <Navigate to="/admin/auth" replace />;
  }

  console.log('✅ TenantRoutes - Acceso permitido, renderizando layout');

  return (
    <TenantLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/tenant/dashboard" replace />} />
        <Route path="/dashboard" element={<TenantDashboard />} />
        <Route path="*" element={<Navigate to="/tenant/dashboard" replace />} />
      </Routes>
    </TenantLayout>
  );
}