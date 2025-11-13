import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tenantAPI } from '../../services/api/tenant';

/**
 * Dashboard del Inquilino
 * Muestra un resumen de la información principal del inquilino:
 * - Próximo pago pendiente
 * - Incidencias activas
 * - Información del departamento
 * - Actividad reciente
 */
export default function TenantDashboard() {
  // Estado para almacenar los datos del dashboard
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos del dashboard al montar el componente
  useEffect(() => {
    loadDashboardData();
  }, []);

  /**
   * Función para cargar los datos del dashboard desde el backend
   */
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      console.log('📊 Cargando datos del dashboard del inquilino...');
      
      const response = await tenantAPI.getDashboard();
      
      console.log('📦 Respuesta del backend:', response);
      
      if (response.success) {
        console.log('✅ Datos del dashboard cargados:', response.data);
        setDashboardData(response.data);
        setError(null);
      } else {
        console.warn('⚠️ Respuesta sin éxito:', response);
        // Establecer datos por defecto si el backend no devuelve datos
        setDashboardData({
          usuario: { nombreCompleto: 'Inquilino' },
          proximoPago: { monto: 0, fechaVencimiento: 'Sin pagos pendientes' },
          departamento: { numero: 'No asignado', edificio: 'No asignado' },
          estadisticas: { pagosEsteAnio: 0, incidenciasActivas: 0 },
          actividadReciente: []
        });
        setError(null); // No mostrar error, solo usar datos por defecto
      }
    } catch (err) {
      console.error('❌ Error cargando dashboard:', err);
      // Establecer datos por defecto en caso de error
      setDashboardData({
        usuario: { nombreCompleto: 'Inquilino' },
        proximoPago: { monto: 0, fechaVencimiento: 'Sin pagos pendientes' },
        departamento: { numero: 'No asignado', edificio: 'No asignado' },
        estadisticas: { pagosEsteAnio: 0, incidenciasActivas: 0 },
        actividadReciente: []
      });
      setError(null); // No mostrar error, continuar con datos por defecto
    } finally {
      setLoading(false);
    }
  };

  // Mostrar spinner mientras carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  // Mostrar mensaje de error si hay problemas
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md">
          <div className="text-center">
            <span className="text-6xl">⚠️</span>
            <h2 className="text-2xl font-bold text-gray-900 mt-4">Error al cargar</h2>
            <p className="text-gray-600 mt-2">{error}</p>
            <button
              onClick={loadDashboardData}
              className="mt-6 bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si no hay datos, mostrar datos por defecto
  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard del Inquilino</h2>
            <p className="text-gray-600 mt-2">Cargando información...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Hola, {dashboardData?.usuario?.nombreCompleto || 'Inquilino'} 👋
          </h1>
          <p className="text-gray-600 mt-2">Bienvenido a tu panel de control</p>
        </div>

        {/* Información del Departamento */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-sm">Mi Departamento</p>
              <p className="text-3xl font-bold mt-1">
                Depto. {dashboardData?.departamento?.numero || 'No asignado'}
              </p>
              <p className="text-teal-100 mt-1">
                {dashboardData?.departamento?.edificio || 'Edificio no asignado'}
              </p>
            </div>
            <div className="text-6xl opacity-20">
              🏢
            </div>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Próximo Pago */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  ${dashboardData?.proximoPago?.monto || 0}
                </p>
                <p className="text-gray-600 text-sm">Próximo Pago</p>
                <p className="text-xs text-gray-500 mt-1">
                  {dashboardData?.proximoPago?.fechaVencimiento || 'Sin pagos'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Incidencias Activas */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <span className="text-2xl">🚨</span>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData?.estadisticas?.incidenciasActivas || 0}
                </p>
                <p className="text-gray-600 text-sm">Incidencias Activas</p>
              </div>
            </div>
          </div>
          
          {/* Pagos Este Año */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData?.estadisticas?.pagosEsteAnio || 0}
                </p>
                <p className="text-gray-600 text-sm">Pagos Este Año</p>
              </div>
            </div>
          </div>
          
          {/* Contrato Activo */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="text-2xl">📄</span>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">1</p>
                <p className="text-gray-600 text-sm">Contrato Activo</p>
              </div>
            </div>
          </div>
        </div>
        {/* Navegación principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Panel */}
          <Link 
            to="/tenant/dashboard"
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 bg-teal-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Panel</h3>
                <p className="text-gray-600">Resumen general</p>
              </div>
            </div>
          </Link>

          {/* Mis Pagos */}
          <Link 
            to="/tenant/pagos"
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Mis Pagos</h3>
                <p className="text-gray-600">Gestionar pagos</p>
              </div>
            </div>
          </Link>

          {/* Incidencias */}
          <Link 
            to="/tenant/incidencias"
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <span className="text-2xl">🚨</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Incidencias</h3>
                <p className="text-gray-600">Reportar y seguir</p>
              </div>
            </div>
          </Link>

          {/* Mis Contratos */}
          <Link 
            to="/tenant/contratos"
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="text-2xl">📄</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Mis Contratos</h3>
                <p className="text-gray-600">Documentos legales</p>
              </div>
            </div>
          </Link>

          {/* Notificaciones */}
          <Link 
            to="/tenant/notificaciones"
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <span className="text-2xl">🔔</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Notificaciones</h3>
                <p className="text-gray-600">Avisos importantes</p>
              </div>
            </div>
          </Link>

          {/* Mi Perfil */}
          <Link 
            to="/tenant/perfil"
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <span className="text-2xl">👤</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Mi Perfil</h3>
                <p className="text-gray-600">Información personal</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Actividad Reciente */}
        {dashboardData?.actividadReciente && dashboardData.actividadReciente.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Actividad Reciente</h2>
            <div className="space-y-4">
              {dashboardData.actividadReciente.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                      <span>{item.tipo.includes('Pago') ? '💰' : '🚨'}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.tipo}</p>
                      <p className="text-sm text-gray-500">{item.descripcion || item.monto}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{item.fecha}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Acciones rápidas */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/tenant/incidencias/reportar"
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              🚨 Reportar Incidencia
            </Link>
            <Link
              to="/tenant/pagos"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              💰 Ver Mis Pagos
            </Link>
            <Link
              to="/tenant/contratos"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              📄 Ver Contrato
            </Link>
          </div>
        </div>

        {/* Información de ayuda */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ayuda y Soporte */}
          <div className="bg-blue-50 rounded-xl shadow-sm p-6 border border-blue-200">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">AYUDA Y SOPORTE</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-blue-900 mb-1">Soporte Técnico</h3>
                <p className="text-blue-700">Disponible las 24 horas, los 7 días de la semana.</p>
              </div>
              
              <div>
                <h3 className="font-medium text-blue-900 mb-1">Manual de usuario</h3>
                <p className="text-blue-700">Guía completa</p>
              </div>
              
              <div className="pt-4 border-t border-blue-200">
                <p className="text-blue-900 font-medium">Usuario: mayo@gmail.com</p>
                <p className="text-blue-700">inquilino</p>
              </div>
            </div>
          </div>

          {/* Información del sistema */}
          <div className="bg-gray-50 rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">INFORMACIÓN DEL SISTEMA</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Estado del sistema:</span>
                <span className="text-green-600 font-medium">● Operativo</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Última actualización:</span>
                <span className="text-gray-900">Hoy</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Versión:</span>
                <span className="text-gray-900">v1.0.0</span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-gray-500 text-sm text-center">
                © 2024 DepaManager. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}