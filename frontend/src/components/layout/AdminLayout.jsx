// frontend/src/components/layout/AdminLayout.jsx
import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Navegación lateral */}
      <AdminSidebar />
      
      {/* Contenedor principal - Header + Contenido */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - Barra superior con buscador y perfil */}
        <AdminHeader />

        {/* Main Content - Área de contenido principal */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}