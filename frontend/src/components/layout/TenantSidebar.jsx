import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Sidebar específico para el módulo de inquilino
 * Navegación entre las diferentes secciones del portal
 */
export default function TenantSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Items del menú de navegación
   */
  const menuItems = [
    { 
      path: '/tenant/dashboard', 
      label: 'Panel', 
      icon: '🏠',
      description: 'Resumen general'
    },
    { 
      path: '/tenant/pagos', 
      label: 'Mis Pagos', 
      icon: '💳',
      description: 'Gestionar pagos'
    },
    { 
      path: '/tenant/incidencias', 
      label: 'Incidencias', 
      icon: '⚠️',
      description: 'Reportar y seguir'
    },
    { 
      path: '/tenant/contratos', 
      label: 'Mis Contratos', 
      icon: '📄',
      description: 'Abogados'
    },
    { 
      path: '/tenant/notificaciones', 
      label: 'No', 
      icon: '🔔',
      description: 'Avisos importantes'
    },
    { 
      path: '/tenant/perfil', 
      label: 'Mi perfil', 
      icon: '👤',
      description: 'Información personal'
    }
  ];

  /**
   * Manejar cierre de sesión
   */
  const handleLogout = () => {
    console.log('🚪 Cerrando sesión...');
    logout();
    navigate('/');
  };

  /**
   * Verificar si una ruta está activa
   */
  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 bg-gradient-to-b from-teal-600 to-teal-700 shadow-lg flex flex-col h-full">
      {/* Header del Sidebar */}
      <div className="p-6 border-b border-teal-500/30">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">Gerente de</h1>
            <h2 className="text-lg font-bold text-white leading-tight">Departamento</h2>
            <p className="text-xs text-teal-100">Portal del Inquilino</p>
          </div>
        </div>
      </div>
      
      {/* Navegación Principal */}
      <nav className="flex-1 p-4">
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-teal-200 uppercase tracking-wider mb-3">
            Navegación Principal
          </h2>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full text-left p-3 rounded-lg transition-all group ${
                    isActivePath(item.path)
                      ? 'bg-white/10 text-white border-l-4 border-white shadow-sm'
                      : 'text-teal-100 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-lg mr-3">{item.icon}</span>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-sm">{item.label}</p>
                      <p className={`text-xs ${
                        isActivePath(item.path) ? 'text-teal-200' : 'text-teal-300'
                      }`}>
                        {item.description}
                      </p>
                    </div>
                    {isActivePath(item.path) && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Sección de Ayuda */}
        <div className="mt-8">
          <h2 className="text-xs font-semibold text-teal-200 uppercase tracking-wider mb-3">
            Ayuda y Soporte
          </h2>
          <ul className="space-y-1">
            <li>
              <button className="w-full text-left p-3 rounded-lg text-teal-100 hover:bg-white/5 hover:text-white transition-all">
                <div className="flex items-center">
                  <span className="text-lg mr-3">📞</span>
                  <div>
                    <p className="font-medium text-sm">Soporte Técnico</p>
                    <p className="text-xs text-teal-300">Disponible las 24 horas, los 7 días de la semana.</p>
                  </div>
                </div>
              </button>
            </li>
            <li>
              <button className="w-full text-left p-3 rounded-lg text-teal-100 hover:bg-white/5 hover:text-white transition-all">
                <div className="flex items-center">
                  <span className="text-lg mr-3">📋</span>
                  <div>
                    <p className="font-medium text-sm">Manual de usuario</p>
                    <p className="text-xs text-teal-300">Guía completa</p>
                  </div>
                </div>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Footer del Sidebar - Información del Usuario */}
      <div className="p-4 border-t border-teal-500/30 bg-teal-800/30">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
            <span className="text-white font-semibold text-sm">
              {user?.nombreCompleto?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              Usuario
            </p>
            <p className="text-xs text-teal-200 truncate">
              {user?.correo || 'inquilino@email.com'}
            </p>
            <p className="text-xs text-teal-100 font-medium">Inquilino</p>
          </div>
        </div>

        {/* Botón de Cerrar Sesión */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2 text-sm text-teal-100 hover:bg-white/10 hover:text-white rounded-lg transition-all border border-transparent hover:border-white/20"
        >
          <span className="mr-2">🚪</span>
          Sesión
        </button>
      </div>
    </div>
  );
}