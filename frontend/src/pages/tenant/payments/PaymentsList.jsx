import React, { useState, useEffect, useCallback } from 'react';
import { tenantAPI } from '../../../services/api/tenant';
import PaymentGatewayModal from '../../../components/tenant/PaymentGatewayModal';

/**
 * Vista de gestión de pagos del inquilino
 * Muestra pagos pendientes y permite subir comprobantes
 */
export default function PaymentsList() {
  const [paymentsData, setPaymentsData] = useState({
    pagos: [],
    estadisticas: {}
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    estado: ''
  });
  const [showGateway, setShowGateway] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [pagos, setPagos] = useState([]);

  /**
   * Cargar pagos desde la API
   */
  const loadPayments = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando pagos...');

      const response = await tenantAPI.getPayments(filters);
      
      if (response.success) {
        setPaymentsData(response.data);
        setPagos(response.data.pagos);
        console.log('✅ Pagos cargados exitosamente');
      }
    } catch (error) {
      console.error('❌ Error cargando pagos:', error);
      alert('Error al cargar los pagos: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /**
   * Cargar pagos cuando cambian los filtros
   */
  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  /**
   * Manejar clic en pagar
   */
  const handlePayClick = (pago) => {
    setSelectedPayment(pago);
    setShowGateway(true);
  };

  /**
   * Manejar pago completado
   */
  const handlePaymentComplete = (metodoPago, comprobanteUrl = null) => {
    // Actualizar el pago a Pagado o Pendiente de Verificación
    setPagos(prevPagos => 
      prevPagos.map(p => 
        p.id_pago === selectedPayment.id_pago 
          ? {
              ...p,
              estado: metodoPago === 'PayPal' ? 'Pagado' : 'Pendiente de Verificación',
              fecha_pago: new Date().toISOString().split('T')[0],
              metodo_pago: metodoPago,
              url_comprobante: comprobanteUrl
            }
          : p
      )
    );

    setShowGateway(false);
    setSelectedPayment(null);

    // Mostrar mensaje de éxito
    if (metodoPago === 'PayPal') {
      alert('Pago procesado exitosamente con PayPal');
    } else {
      alert('Comprobante enviado exitosamente. El administrador verificará tu pago.');
    }
  };

  /**
   * Formatear monto como dinero
   */
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  /**
   * Obtener badge de estado con estilos
   */
  const getEstadoBadge = (estado) => {
    const styles = {
      'Pendiente': 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      'Pagado': 'bg-green-100 text-green-800 border border-green-300',
      'Vencido': 'bg-red-100 text-red-800 border border-red-300',
      'Pendiente de Verificación': 'bg-blue-100 text-blue-800 border border-blue-300'
    };
    return styles[estado] || 'bg-gray-100 text-gray-800 border border-gray-300';
  };

  /**
   * Obtener icono del método de pago
   */
  const getMetodoPagoIcon = (metodo) => {
    const icons = {
      'Yape': '💜',
      'Plin': '💙',
      'Transferencia': '🏦',
      'PayPal': '💳',
      'Efectivo': '💵'
    };
    return icons[metodo] || '💰';
  };

  const pagosPendientes = pagos.filter(p => p.estado === 'Pendiente');
  const pagosVerificacion = pagos.filter(p => p.estado === 'Pendiente de Verificación');
  const totalPendiente = pagosPendientes.reduce((sum, p) => sum + p.monto, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-slate-200">
            <h1 className="text-2xl font-bold text-slate-900">Mis Pagos</h1>
            <p className="text-slate-600">Gestiona tus pagos y comprobantes</p>
          </div>

          {/* Estadísticas */}
          {paymentsData.estadisticas && (
            <div className="px-6 py-4 bg-slate-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900">
                    {formatMoney(paymentsData.estadisticas.totalPagado || 0)}
                  </p>
                  <p className="text-sm text-slate-600">Total Pagado</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900">
                    {formatMoney(paymentsData.estadisticas.totalPendiente || 0)}
                  </p>
                  <p className="text-sm text-slate-600">Total Pendiente</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900">
                    {paymentsData.estadisticas.totalPagos || 0}
                  </p>
                  <p className="text-sm text-slate-600">Total Pagos</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-900">Filtrar Pagos</h2>
            <div className="flex gap-4">
              <select
                value={filters.estado}
                onChange={(e) => setFilters(prev => ({ ...prev, estado: e.target.value }))}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Todos los estados</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Pagado">Pagado</option>
                <option value="Vencido">Vencido</option>
                <option value="Pendiente de Verificación">Pendiente de Verificación</option>
              </select>
              <button
                onClick={loadPayments}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
              >
                🔄 Actualizar
              </button>
            </div>
          </div>
        </div>

        {/* Resumen de Pagos Pendientes */}
        {pagosPendientes.length > 0 && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 p-6 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Tienes {pagosPendientes.length} pago{pagosPendientes.length > 1 ? 's' : ''} pendiente{pagosPendientes.length > 1 ? 's' : ''}
                </h3>
                <p className="text-2xl font-bold text-orange-600">
                  Total: S/ {totalPendiente.toFixed(2)}
                </p>
              </div>
              <div className="text-6xl">💳</div>
            </div>
          </div>
        )}

        {pagosVerificacion.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 p-6 rounded-lg mb-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">⏳</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {pagosVerificacion.length} pago{pagosVerificacion.length > 1 ? 's' : ''} en verificación
                </h3>
                <p className="text-sm text-gray-600">
                  El administrador está revisando tu{pagosVerificacion.length > 1 ? 's' : ''} comprobante{pagosVerificacion.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Resumen de Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-4xl">💰</span>
              <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-1 rounded">
                Pendientes
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{pagosPendientes.length}</p>
            <p className="text-sm text-gray-600">Pagos por realizar</p>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-4xl">⏳</span>
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded">
                En revisión
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{pagosVerificacion.length}</p>
            <p className="text-sm text-gray-600">En verificación</p>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-4xl">✅</span>
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded">
                Completados
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {pagos.filter(p => p.estado === 'Pagado').length}
            </p>
            <p className="text-sm text-gray-600">Pagos realizados</p>
          </div>
        </div>

        {/* Lista de Pagos */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Historial de Pagos</h2>
          
          {pagos.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No tienes pagos registrados
              </h3>
              <p className="text-gray-600">
                Los pagos asignados por el administrador aparecerán aquí
              </p>
            </div>
          ) : (
            pagos.map((pago) => (
              <div
                key={pago.id_pago}
                className={`bg-white rounded-lg shadow-md border transition-all hover:shadow-lg ${
                  pago.estado === 'Pendiente' 
                    ? 'border-orange-200 ring-2 ring-orange-100' 
                    : 'border-gray-200'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-3xl">
                          {pago.concepto === 'Alquiler' ? '🏠' : '⚡'}
                        </span>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {pago.concepto}
                          </h3>
                          <p className="text-sm text-gray-600">{pago.descripcion_servicio}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Monto</p>
                          <p className="text-xl font-bold text-gray-900">S/ {pago.monto.toFixed(2)}</p>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Vencimiento</p>
                          <p className="text-sm font-medium text-gray-700">
                            {new Date(pago.fecha_vencimiento).toLocaleDateString('es-PE', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        </div>

                        {pago.fecha_pago && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">Pagado el</p>
                            <p className="text-sm font-medium text-gray-700">
                              {new Date(pago.fecha_pago).toLocaleDateString('es-PE', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        )}

                        {pago.metodo_pago && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">Método</p>
                            <p className="text-sm font-medium text-gray-700">
                              {getMetodoPagoIcon(pago.metodo_pago)} {pago.metodo_pago}
                            </p>
                          </div>
                        )}

                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Estado</p>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getEstadoBadge(pago.estado)}`}>
                            {pago.estado}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="ml-6 flex flex-col space-y-2">
                      {pago.estado === 'Pendiente' && (
                        <button
                          onClick={() => handlePayClick(pago)}
                          className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all shadow-md hover:shadow-lg font-medium whitespace-nowrap flex items-center space-x-2"
                        >
                          <span>💳</span>
                          <span>Pagar Ahora</span>
                        </button>
                      )}
                      
                      {pago.estado === 'Pagado' && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-3 rounded-lg font-medium whitespace-nowrap flex items-center space-x-2">
                          <span>✅</span>
                          <span>Pagado</span>
                        </div>
                      )}
                      
                      {pago.estado === 'Pendiente de Verificación' && (
                        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-6 py-3 rounded-lg font-medium whitespace-nowrap flex items-center space-x-2">
                          <span>⏳</span>
                          <span>En Revisión</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal de Pasarela de Pagos */}
        {showGateway && selectedPayment && (
          <PaymentGatewayModal
            pago={selectedPayment}
            onClose={() => setShowGateway(false)}
            onPaymentComplete={handlePaymentComplete}
          />
        )}
      </div>
    </div>
  );
}