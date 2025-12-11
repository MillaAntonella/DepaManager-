import React, { useState } from 'react';
import { Bell, Check, Trash2, Search, Clock } from 'lucide-react';

export default function NotificationsList() {
  const [activeTab, setActiveTab] = useState('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  // Datos de ejemplo
  const notificaciones = [
    {
      id_notificacion: 1,
      categoria: 'Pagos',
      tipo: 'Automatica',
      asunto: 'Nuevo comprobante de pago',
      mensaje: 'El inquilino Juan Pérez del Depto. 301 ha subido un comprobante de pago por S/ 1,500.00',
      fecha_envio: '2024-12-11T10:30:00',
      leido: false,
      prioridad: 'alta',
      inquilino: {
        nombre: 'Juan Pérez',
        departamento: '301'
      }
    },
    {
      id_notificacion: 2,
      categoria: 'Mantenimiento',
      tipo: 'Manual',
      asunto: 'Nueva incidencia reportada',
      mensaje: 'María González del Depto. 205 ha reportado una fuga de agua en el baño',
      fecha_envio: '2024-12-11T09:15:00',
      leido: false,
      prioridad: 'urgente',
      inquilino: {
        nombre: 'María González',
        departamento: '205'
      }
    },
    {
      id_notificacion: 3,
      categoria: 'Avisos Administrativos',
      tipo: 'Automatica',
      asunto: 'Nuevo postulante registrado',
      mensaje: 'Se ha registrado un nuevo postulante interesado en el Depto. 402',
      fecha_envio: '2024-12-11T08:00:00',
      leido: true,
      prioridad: 'normal'
    },
    {
      id_notificacion: 4,
      categoria: 'Pagos',
      tipo: 'Automatica',
      asunto: 'Pago próximo a vencer',
      mensaje: 'El pago del Depto. 103 vence en 3 días (S/ 1,200.00)',
      fecha_envio: '2024-12-10T16:45:00',
      leido: true,
      prioridad: 'normal'
    },
    {
      id_notificacion: 5,
      categoria: 'Mantenimiento',
      tipo: 'Automatica',
      asunto: 'Incidencia completada',
      mensaje: 'La incidencia #45 del Depto. 507 ha sido marcada como completada',
      fecha_envio: '2024-12-10T14:20:00',
      leido: true,
      prioridad: 'baja'
    }
  ];

  const filtrarNotificaciones = () => {
    let filtradas = notificaciones;

    // Filtrar por tab
    if (activeTab === 'no-leidas') {
      filtradas = filtradas.filter(n => !n.leido);
    } else if (activeTab === 'leidas') {
      filtradas = filtradas.filter(n => n.leido);
    }

    // Filtrar por búsqueda
    if (searchQuery) {
      filtradas = filtradas.filter(n => 
        n.asunto.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.mensaje.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtradas;
  };

  const notificacionesFiltradas = filtrarNotificaciones();
  const noLeidas = notificaciones.filter(n => !n.leido).length;

  const handleMarcarLeida = (id) => {
    console.log('Marcar como leída:', id);
    // Aquí iría la lógica para marcar como leída
  };

  const handleMarcarTodasLeidas = () => {
    console.log('Marcar todas como leídas');
    // Aquí iría la lógica para marcar todas como leídas
  };

  const handleEliminar = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta notificación?')) {
      console.log('Eliminar notificación:', id);
      // Aquí iría la lógica para eliminar
    }
  };

  const handleSeleccionar = (id) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(nId => nId !== id)
        : [...prev, id]
    );
  };

  const handleEliminarSeleccionadas = () => {
    if (selectedNotifications.length === 0) return;
    if (window.confirm(`¿Eliminar ${selectedNotifications.length} notificaciones seleccionadas?`)) {
      console.log('Eliminar seleccionadas:', selectedNotifications);
      setSelectedNotifications([]);
    }
  };

  const getIconoCategoria = (categoria) => {
    switch (categoria) {
      case 'Pagos':
        return { icon: '💳', color: 'text-green-600', bg: 'bg-green-100' };
      case 'Mantenimiento':
        return { icon: '🔧', color: 'text-orange-600', bg: 'bg-orange-100' };
      case 'Avisos Administrativos':
        return { icon: '📢', color: 'text-blue-600', bg: 'bg-blue-100' };
      default:
        return { icon: '📋', color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  const getPrioridadBadge = (prioridad) => {
    const styles = {
      urgente: 'bg-red-100 text-red-700 border-red-300',
      alta: 'bg-orange-100 text-orange-700 border-orange-300',
      normal: 'bg-blue-100 text-blue-700 border-blue-300',
      baja: 'bg-gray-100 text-gray-700 border-gray-300'
    };
    return styles[prioridad] || styles.normal;
  };

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    const ahora = new Date();
    const diff = ahora - date;
    const minutos = Math.floor(diff / 60000);
    const horas = Math.floor(diff / 3600000);
    const dias = Math.floor(diff / 86400000);

    if (minutos < 60) return `Hace ${minutos} min`;
    if (horas < 24) return `Hace ${horas}h`;
    if (dias < 7) return `Hace ${dias}d`;
    return date.toLocaleDateString('es-PE');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Notificaciones</h1>
            <p className="text-gray-600">
              Gestiona todas tus notificaciones del sistema
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {noLeidas > 0 && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-semibold">
                {noLeidas} sin leer
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Barra de acciones */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Búsqueda */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar notificaciones..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Acciones */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleMarcarTodasLeidas}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span className="text-sm font-medium">Marcar todas leídas</span>
            </button>
            
            {selectedNotifications.length > 0 && (
              <button
                onClick={handleEliminarSeleccionadas}
                className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Eliminar ({selectedNotifications.length})
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('todas')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'todas'
                ? 'border-b-2 border-emerald-500 text-emerald-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Todas ({notificaciones.length})
          </button>
          <button
            onClick={() => setActiveTab('no-leidas')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'no-leidas'
                ? 'border-b-2 border-emerald-500 text-emerald-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            No leídas ({noLeidas})
          </button>
          <button
            onClick={() => setActiveTab('leidas')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'leidas'
                ? 'border-b-2 border-emerald-500 text-emerald-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Leídas ({notificaciones.length - noLeidas})
          </button>
        </div>
      </div>

      {/* Lista de Notificaciones */}
      <div className="space-y-3">
        {notificacionesFiltradas.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay notificaciones
            </h3>
            <p className="text-gray-600">
              {searchQuery 
                ? 'No se encontraron notificaciones con ese criterio'
                : 'Todas tus notificaciones aparecerán aquí'
              }
            </p>
          </div>
        ) : (
          notificacionesFiltradas.map((notif) => {
            const iconData = getIconoCategoria(notif.categoria);
            return (
              <div
                key={notif.id_notificacion}
                className={`bg-white rounded-lg shadow-sm border transition-all hover:shadow-md ${
                  notif.leido 
                    ? 'border-gray-200' 
                    : 'border-l-4 border-l-emerald-500 bg-emerald-50/30'
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start space-x-4">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notif.id_notificacion)}
                      onChange={() => handleSeleccionar(notif.id_notificacion)}
                      className="mt-1 w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />

                    {/* Icono de categoría */}
                    <div className={`w-12 h-12 ${iconData.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <span className="text-2xl">{iconData.icon}</span>
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className={`font-semibold ${notif.leido ? 'text-gray-700' : 'text-gray-900'}`}>
                              {notif.asunto}
                            </h3>
                            {!notif.leido && (
                              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{notif.mensaje}</p>
                          
                          {/* Metadata */}
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatearFecha(notif.fecha_envio)}
                            </span>
                            <span className={`px-2 py-1 rounded-full ${iconData.bg} ${iconData.color} font-medium`}>
                              {notif.categoria}
                            </span>
                            {notif.prioridad !== 'normal' && (
                              <span className={`px-2 py-1 rounded border ${getPrioridadBadge(notif.prioridad)} font-medium`}>
                                {notif.prioridad.charAt(0).toUpperCase() + notif.prioridad.slice(1)}
                              </span>
                            )}
                            {notif.inquilino && (
                              <span>
                                👤 {notif.inquilino.nombre} - Depto. {notif.inquilino.departamento}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Acciones */}
                        <div className="flex items-center space-x-2 ml-4">
                          {!notif.leido && (
                            <button
                              onClick={() => handleMarcarLeida(notif.id_notificacion)}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Marcar como leída"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleEliminar(notif.id_notificacion)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}