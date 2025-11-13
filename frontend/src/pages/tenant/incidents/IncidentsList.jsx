import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tenantAPI } from '../../../services/api/tenant';

export default function IncidentsList() {
  const [incidentsData, setIncidentsData] = useState({
    incidencias: [],
    estadisticas: {}
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    estado: ''
  });

  useEffect(() => {
    loadIncidents();
  }, [filters]);

  const loadIncidents = async () => {
    try {
      setLoading(true);
      const response = await tenantAPI.getIncidents(filters);
      
      if (response.success) {
        setIncidentsData(response.data);
      }
    } catch (error) {
      console.error('Error cargando incidencias:', error);
      alert('Error al cargar las incidencias');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getUrgencyBadgeClass = (urgencia) => {
    switch (urgencia) {
      case 'Alta': return 'bg-red-100 text-red-800';
      case 'Media': return 'bg-yellow-100 text-yellow-800';
      case 'Baja': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeClass = (estado) => {
    switch (estado) {
      case 'Completada': return 'bg-green-100 text-green-800';
      case 'En Proceso': return 'bg-blue-100 text-blue-800';
      case 'Asignada': return 'bg-purple-100 text-purple-800';
      case 'En Revisión': return 'bg-yellow-100 text-yellow-800';
      case 'Abierta': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mis Incidencias</h1>
            <p className="text-gray-600 mt-2">Reporta y sigue el estado de tus incidencias</p>
          </div>
          <Link
            to="/tenant/incidencias/reportar"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            🚨 Reportar Nueva Incidencia
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{incidentsData.estadisticas.total || 0}</p>
                <p className="text-gray-600 text-sm">Total</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{incidentsData.estadisticas.completadas || 0}</p>
                <p className="text-gray-600 text-sm">Completadas</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <span className="text-2xl">🔄</span>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{incidentsData.estadisticas.en_progreso || 0}</p>
                <p className="text-gray-600 text-sm">En Progreso</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{incidentsData.estadisticas.pendientes || 0}</p>
                <p className="text-gray-600 text-sm">Pendientes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Filtrar Incidencias</h2>
            <div className="flex gap-4">
              <select
                value={filters.estado}
                onChange={(e) => setFilters(prev => ({ ...prev, estado: e.target.value }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los estados</option>
                <option value="Abierta">Abierta</option>
                <option value="En Revisión">En Revisión</option>
                <option value="Asignada">Asignada</option>
                <option value="En Proceso">En Proceso</option>
                <option value="Completada">Completada</option>
              </select>
              <button
                onClick={loadIncidents}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                🔄 Actualizar
              </button>
            </div>
          </div>
        </div>

        {/* Incidents List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6">
            {incidentsData.incidencias.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏠</div>
                <p className="text-gray-500 text-lg">No hay incidencias reportadas</p>
                <p className="text-gray-400 mt-2">
                  {filters.estado ? `No hay incidencias ${filters.estado.toLowerCase()}` : 'Tus incidencias aparecerán aquí'}
                </p>
                <Link
                  to="/tenant/incidencias/reportar"
                  className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Reportar Primera Incidencia
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {filters.estado ? `Incidencias ${filters.estado}` : 'Todas mis Incidencias'}
                </h2>
                
                {incidentsData.incidencias.map((incidencia) => (
                  <div key={incidencia.id_incidencia} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                      {/* Incident Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl font-semibold text-gray-900">{incidencia.tipo_problema}</h3>
                          <div className="flex gap-2">
                            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getUrgencyBadgeClass(incidencia.urgencia)}`}>
                              {incidencia.urgencia}
                            </span>
                            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeClass(incidencia.estado)}`}>
                              {incidencia.estado}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-4 leading-relaxed">{incidencia.descripcion}</p>
                        
                        <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                          <p><strong>📅 Reportada:</strong> {formatDate(incidencia.fecha_reporte)}</p>
                          {incidencia.categoria && (
                            <p><strong>📂 Categoría:</strong> {incidencia.categoria}</p>
                          )}
                          {incidencia.fecha_cierre && (
                            <p><strong>✅ Cerrada:</strong> {formatDate(incidencia.fecha_cierre)}</p>
                          )}
                        </div>

                        {incidencia.mensaje_asignacion && (
                          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm font-medium text-blue-900 mb-2">
                              💬 Comentario del administrador:
                            </p>
                            <p className="text-blue-800">{incidencia.mensaje_asignacion}</p>
                            {incidencia.proveedor && (
                              <p className="text-sm text-blue-700 mt-2">
                                <strong>Proveedor asignado:</strong> {incidencia.proveedor.nombre} ({incidencia.proveedor.especialidad})
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-3">
                        <Link
                          to={`/tenant/incidencias/${incidencia.idIncidencia}`}
                          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-center font-medium"
                        >
                          👁️ Ver detalles
                        </Link>
                        {incidencia.estado !== 'Completada' && (
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                            💬 Agregar comentario
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}