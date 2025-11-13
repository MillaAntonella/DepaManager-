// frontend/src/router/TenantRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import TenantLayout from '../components/layout/TenantLayout';
import TenantDashboard from '../pages/tenant/Dashboard';
import IncidentsList from '../pages/tenant/incidents/IncidentsList';
import IncidentReport from '../pages/tenant/incidents/IncidentReport';
import IncidentDetails from '../pages/tenant/incidents/IncidentDetails';

export default function TenantRoutes() {
  const { user, isAuthenticated } = useAuth();

  console.log('🔍 TenantRoutes - Verificando acceso:', {
    isAuthenticated,
    userRol: user?.rol,
    canAccess: isAuthenticated && user?.rol === 'Inquilino'
  });

  if (!isAuthenticated || user?.rol !== 'Inquilino') {
    console.log('❌ TenantRoutes - Acceso denegado, redirigiendo a /admin/auth');
    return <Navigate to="/admin/auth" replace />;
  }

  console.log('✅ TenantRoutes - Acceso permitido, renderizando layout');

  return (
    <Routes>
      <Route element={<TenantLayout />}>
        <Route path="/" element={<Navigate to="/tenant/dashboard" replace />} />
        <Route path="/dashboard" element={<TenantDashboard />} />
        
        {/* Incidencias */}
        <Route path="/incidencias" element={<IncidentsList />} />
        <Route path="/incidencias/reportar" element={<IncidentReport />} />
        <Route path="/incidencias/:id" element={<IncidentDetails />} />
        
        <Route path="*" element={<Navigate to="/tenant/dashboard" replace />} />
      </Route>
    </Routes>
  );
}