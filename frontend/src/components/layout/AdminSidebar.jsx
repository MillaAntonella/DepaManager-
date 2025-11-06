// frontend/src/components/layout/AdminSidebar.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin/auth');
  };

  // ORDEN CORREGIDO: Dashboard -> Departamentos -> Inquilinos
  const menuItems = [
    { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/admin/departments', icon: '🏠', label: 'Departamentos' },
    { path: '/admin/tenants', icon: '👥', label: 'Inquilinos' },
    { path: '/admin/contracts', icon: '📝', label: 'Contratos' },
    { path: '/admin/payments', icon: '💰', label: 'Pagos' },
    { path: '/admin/incidents', icon: '🔧', label: 'Incidencias' },
    { path: '/admin/providers', icon: '🏢', label: 'Proveedores' },
    { path: '/admin/applicants', icon: '📋', label: 'Postulantes' },
    { path: '/admin/vehicles', icon: '🚗', label: 'Vehículos' },
    { path: '/admin/cameras', icon: '📷', label: 'Cámaras' },
    { path: '/admin/notifications', icon: '🔔', label: 'Notificaciones' },
    { path: '/admin/reports', icon: '📈', label: 'Reportes' }
  ];

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">DepaManager</h1>
        <p className="text-gray-400 text-sm">Panel de Administración</p>
        {user && (
          <p className="text-gray-400 text-xs mt-2">Hola, {user.nombre}</p>
        )}
      </div>

      {/* Menú de Navegación */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="text-lg mr-3">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Perfil y Cerrar Sesión */}
      <div className="p-4 border-t border-gray-700">
        <Link
          to="/admin/profile"
          className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
            location.pathname === '/admin/profile'
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <span className="text-lg mr-3">👤</span>
          <span className="font-medium">Perfil</span>
        </Link>
        
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 mt-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
        >
          <span className="text-lg mr-3">🚪</span>
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;