// frontend/src/pages/tenant/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { tenantAPI } from '../../services/api/tenant';

/**
 * Dashboard principal del inquilino con diseño similar al admin
 */
export default function TenantDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Cargar datos del dashboard al montar el componente
   */
  useEffect(() => {
    loadDashboardData();
  }, []);

  /**
   * Función para cargar datos del dashboard desde la API
   */
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Cargando datos del dashboard...');
      
      const response = await tenantAPI.getDashboard();
      
      if (response.success) {
        setDashboardData(response.data);
        console.log('✅ Dashboard cargado exitosamente');
      } else {
        throw new Error(response.message || 'Error al cargar dashboard');
      }
    } catch (err) {
      console.error('❌ Error cargando dashboard:', err);
      setError(err.response?.data?.message || 'Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Formatear fecha actual en español
   */
  const getCurrentDate = () => {
    return new Date().toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  /**
   * Formatear monto como dinero
   */
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount || 0);
  };

  // Mostrar estado de carga
  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-center">
          <div className="text-red-500 text-4xl mb-4">❌</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar el dashboard</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Hola, {dashboardData?.usuario?.nombreCompleto || user?.nombreCompleto || 'Usuario'}
          </h1>
          <p className="text-gray-600 capitalize">{getCurrentDate()}</p>
        </div>

        {/* Tarjetas de Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Próximo Pago */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Próximo Pago</h3>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {formatMoney(dashboardData?.proximoPago?.monto)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {dashboardData?.proximoPago?.fechaVencimiento || 'Sin vencimientos'}
                </p>
              </div>
              <div className="text-3xl text-blue-500">💰</div>
            </div>
          </div>

          {/* Mi Departamento */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Mi Departamento</h3>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {dashboardData?.departamento?.numero || '--'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {dashboardData?.departamento?.edificio || 'Sin asignar'}
                </p>
              </div>
              <div className="text-3xl text-green-500">🏠</div>
            </div>
          </div>

          {/* Pagos Este Año */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Pagos Este Año</h3>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {dashboardData?.estadisticas?.pagosEsteAnio || 0}
                </p>
                <p className="text-sm text-gray-500 mt-1">Realizados</p>
              </div>
              <div className="text-3xl text-purple-500">📊</div>
            </div>
          </div>

          {/* Incidencias Activas */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Incidencias Activas</h3>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {dashboardData?.estadisticas?.incidenciasActivas || 0}
                </p>
                <p className="text-sm text-gray-500 mt-1">En seguimiento</p>
              </div>
              <div className="text-3xl text-orange-500">🔧</div>
            </div>
          </div>
        </div>

        {/* Grid de Contenido Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Acciones Rápidas */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Acciones Rápidas</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <button 
                    onClick={() => navigate('/tenant/pagos')}
                    className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <span className="text-blue-600">💰</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Ver mis pagos</p>
                        <p className="text-sm text-gray-500">Consulta tu historial de pagos</p>
                      </div>
                    </div>
                  </button>

                  <button 
                    onClick={() => navigate('/tenant/incidencias')}
                    className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <span className="text-green-600">🚨</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Reportar incidencia</p>
                        <p className="text-sm text-gray-500">Reporta un problema en tu departamento</p>
                      </div>
                    </div>
                  </button>

                  <button 
                    onClick={() => navigate('/tenant/notificaciones')}
                    className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                        <span className="text-yellow-600">🔔</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Ver notificaciones</p>
                        <p className="text-sm text-gray-500">Revisa tus notificaciones</p>
                      </div>
                    </div>
                  </button>

                  <button 
                    onClick={() => navigate('/tenant/contratos')}
                    className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                        <span className="text-purple-600">📄</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Mis contratos</p>
                        <p className="text-sm text-gray-500">Consulta tu contrato actual</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Actividad Reciente y Información del Departamento */}
          <div className="lg:col-span-2 space-y-6">
            {/* Actividad Reciente */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Actividad Reciente</h2>
              </div>
              <div className="p-6">
                {dashboardData?.actividadReciente && dashboardData.actividadReciente.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.actividadReciente.map((actividad, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            actividad.tipo === 'Pago' ? 'bg-green-100 text-green-600' :
                            actividad.tipo === 'Incidencia' ? 'bg-orange-100 text-orange-600' :
                            actividad.tipo === 'Contrato' ? 'bg-blue-100 text-blue-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {actividad.tipo === 'Pago' ? '💰' :
                             actividad.tipo === 'Incidencia' ? '🔧' :
                             actividad.tipo === 'Contrato' ? '📄' : '📝'}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{actividad.tipo}</p>
                            <p className="text-sm text-gray-500">
                              {actividad.concepto || actividad.descripcion || 'Actividad del sistema'}
                            </p>
                            {actividad.monto && (
                              <p className="text-sm font-medium text-gray-700">{formatMoney(actividad.monto)}</p>
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{actividad.fecha}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📝</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay actividad reciente</h3>
                    <p className="text-gray-500">Tu actividad aparecerá aquí</p>
                  </div>
                )}
              </div>
            </div>

            {/* Información del Departamento */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Mi Departamento</h2>
              </div>
              <div className="p-6">
                {dashboardData?.departamento ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Número</label>
                      <p className="text-gray-900 font-medium">{dashboardData.departamento.numero}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Piso</label>
                      <p className="text-gray-900">Piso {dashboardData.departamento.piso}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-600">Edificio</label>
                      <p className="text-gray-900">{dashboardData.departamento.edificio}</p>
                    </div>
                    {dashboardData.departamento.direccion && (
                      <div className="col-span-2">
                        <label className="text-sm font-medium text-gray-600">Dirección</label>
                        <p className="text-gray-900">{dashboardData.departamento.direccion}</p>
                      </div>
                    )}
                    {dashboardData.departamento.metrosCuadrados && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Metros Cuadrados</label>
                        <p className="text-gray-900">{dashboardData.departamento.metrosCuadrados} m²</p>
                      </div>
                    )}
                    {dashboardData.departamento.habitaciones && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Habitaciones</label>
                        <p className="text-gray-900">{dashboardData.departamento.habitaciones}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🏠</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes departamento asignado</h3>
                    <p className="text-gray-500">Contacta al administrador para más información</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Botón para actualizar */}
        <div className="mt-6 text-center">
          <button
            onClick={loadDashboardData}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <span>🔄</span>
            <span>Actualizar datos</span>
          </button>
        </div>
      </div>
    </div>
  );
}