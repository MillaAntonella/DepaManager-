// frontend/src/router/AppRouter.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LandingPage from '../pages/public/LandingPage';
import LoginPage from '../pages/public/LoginPage';
import AdminRoutes from './AdminRoutes';

export default function AppRouter() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        <span className="ml-3">Cargando...</span>
      </div>
    );
  }

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin/auth" element={<LoginPage />} />

      {/* Rutas protegidas - Admin */}
      <Route 
        path="/admin/*" 
        element={
          user ? (
            <AdminRoutes />
          ) : (
            <Navigate to="/admin/auth" replace />
          )
        } 
      />

      {/* Redirección por defecto */}
      <Route 
        path="*" 
        element={
          <Navigate to={user ? "/admin" : "/"} replace />
        } 
      />
    </Routes>
  );
}