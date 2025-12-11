// frontend/src/components/layout/AdminHeader.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Search,
  User,
  Settings,
  Bell,
  ChevronDown,
  LogOut
} from 'lucide-react';

const AdminHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Implementar lógica de búsqueda
    console.log('Buscando:', searchQuery);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/auth');
  };

  // Obtener iniciales del nombre
  const getInitials = (name) => {
    if (!name) return 'AD';
    const names = name.trim().split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="flex items-center justify-between h-16 px-6">
        
        {/* SECCIÓN IZQUIERDA - Saludo Personalizado */}
        <div className="flex items-center">
          <h1 className="text-lg font-semibold text-gray-800">
            Hola de nuevo, 
            <span className="text-emerald-600 ml-1">
              {user?.nombre || 'Usuario'}
            </span>
          </h1>
        </div>

        {/* SECCIÓN CENTRAL - Buscador */}
        <div className="flex-1 max-w-xl mx-8">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar..."
                className="
                  w-full pl-10 pr-4 py-2
                  bg-gray-50 border border-gray-200
                  rounded-lg text-sm
                  focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                  transition-all duration-200
                  placeholder-gray-400
                "
              />
            </div>
          </form>
        </div>

        {/* SECCIÓN DERECHA - Perfil de Usuario */}
        <div className="flex items-center space-x-4">
          
          {/* Botón de Notificaciones */}
          <button
            onClick={() => navigate('/admin/notificaciones')}
            className="relative p-2 text-gray-600 hover:text-emerald-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Bell className="w-6 h-6" />
            {/* Badge de notificaciones no leídas */}
            <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* Dropdown del perfil */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="
                flex items-center space-x-3 px-3 py-2
                hover:bg-gray-50 rounded-lg
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-emerald-500
              "
            >
              {/* Avatar con Iniciales */}
              <div className="
                w-10 h-10 rounded-full
                bg-gradient-to-br from-emerald-500 to-emerald-600
                flex items-center justify-center
                text-white font-semibold text-sm
                shadow-md
              ">
                {getInitials(user?.nombre)}
              </div>

              {/* Información del Usuario */}
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-800">
                  {user?.nombre || 'Usuario'}
                </p>
                <p className="text-xs text-gray-500">
                  Administrador
                </p>
              </div>

              {/* Icono de Dropdown */}
              <ChevronDown 
                className={`
                  w-4 h-4 text-gray-500
                  transition-transform duration-200
                  ${isDropdownOpen ? 'transform rotate-180' : ''}
                `}
              />
            </button>

            {/* DROPDOWN DEL PERFIL */}
            {isDropdownOpen && (
              <div className="
                absolute right-0 mt-2 w-64
                bg-white rounded-lg shadow-xl
                border border-gray-100
                py-2
                animate-fadeIn
              ">
                {/* Información del Usuario en Dropdown */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800">
                    {user?.nombre || 'Usuario'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {user?.email || 'Administrador'}
                  </p>
                </div>

                {/* Opciones del Menú */}
                <div className="py-2">
                  {/* Mi Perfil */}
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate('/admin/perfil');
                    }}
                    className="
                      w-full flex items-center space-x-3 px-4 py-2.5
                      hover:bg-gray-50 transition-colors duration-150
                      text-gray-700 hover:text-emerald-600
                    "
                  >
                    <User className="w-5 h-5" />
                    <span className="text-sm font-medium">Mi Perfil</span>
                  </button>

                  {/* Configuración */}
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate('/admin/configuracion');
                    }}
                    className="
                      w-full flex items-center space-x-3 px-4 py-2.5
                      hover:bg-gray-50 transition-colors duration-150
                      text-gray-700 hover:text-emerald-600
                    "
                  >
                    <Settings className="w-5 h-5" />
                    <span className="text-sm font-medium">Configuración</span>
                  </button>

                  {/* Notificaciones */}
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate('/admin/notificaciones');
                    }}
                    className="
                      w-full flex items-center space-x-3 px-4 py-2.5
                      hover:bg-gray-50 transition-colors duration-150
                      text-gray-700 hover:text-emerald-600
                    "
                  >
                    <Bell className="w-5 h-5" />
                    <span className="text-sm font-medium">Notificaciones</span>
                  </button>
                </div>

                {/* Separador */}
                <div className="border-t border-gray-100 my-2"></div>

                {/* Cerrar Sesión */}
                <button
                  onClick={handleLogout}
                  className="
                    w-full flex items-center space-x-3 px-4 py-2.5
                    hover:bg-red-50 transition-colors duration-150
                    text-red-600 hover:text-red-700
                  "
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-semibold">Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Estilos para animación de dropdown */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </header>
  );
};

export default AdminHeader;