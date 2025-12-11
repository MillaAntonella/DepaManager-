import React, { useState } from 'react';
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Filter, 
  Search, 
  Calendar,
  AlertCircle,
  DollarSign,
  FileText,
  CreditCard
} from 'lucide-react';

export default function PaymentsList() {
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Datos de ejemplo
  const pagos = [
    {
      id_pago: 1,
      inquilino: {
        nombre: 'Juan Pérez',
        departamento: '301',
        foto: null
      },
      concepto: 'Alquiler',
      descripcion_servicio: 'Alquiler Mensual - Diciembre 2024',
      monto: 1500.00,
      fecha_vencimiento: '2024-12-15',
      estado: 'Pendiente de Verificación',
      metodo_pago: 'Yape',
      fecha_comprobante: '2024-12-10T14:30:00',
      url_comprobante: 'https://via.placeholder.com/400x600/9333EA/ffffff?text=Comprobante+Yape'
    },
    {
      id_pago: 2,
      inquilino: {
        nombre: 'María González',
        departamento: '205',
        foto: null
      },
      concepto: 'Servicios',
      descripcion_servicio: 'Luz, Agua, Internet',
      monto: 350.00,
      fecha_vencimiento: '2024-12-20',
      estado: 'Pendiente',
      metodo_pago: null,
      fecha_comprobante: null,
      url_comprobante: null
    },
    {
      id_pago: 3,
      inquilino: {
        nombre: 'Carlos Ramírez',
        departamento: '102',
        foto: null
      },
      concepto: 'Alquiler',
      descripcion_servicio: 'Alquiler Mensual - Diciembre 2024',
      monto: 1200.00,
      fecha_vencimiento: '2024-12-15',
      estado: 'Pagado',
      metodo_pago: 'PayPal',
      fecha_pago: '2024-12-08',
      fecha_comprobante: '2024-12-08T10:15:00',
      url_comprobante: null
    },
    {
      id_pago: 4,
      inquilino: {
        nombre: 'Ana Torres',
        departamento: '404',
        foto: null
      },
      concepto: 'Alquiler',
      descripcion_servicio: 'Alquiler Mensual - Diciembre 2024',
      monto: 1800.00,
      fecha_vencimiento: '2024-12-15',
      estado: 'Pendiente de Verificación',
      metodo_pago: 'Transferencia',
      fecha_comprobante: '2024-12-11T09:00:00',
      url_comprobante: 'https://via.placeholder.com/400x600/10B981/ffffff?text=Comprobante+Transferencia'
    },
    {
      id_pago: 5,
      inquilino: {
        nombre: 'Luis Mendoza',
        departamento: '507',
        foto: null
      },
      concepto: 'Servicios',
      descripcion_servicio: 'Mantenimiento del Edificio',
      monto: 200.00,
      fecha_vencimiento: '2024-12-10',
      estado: 'Vencido',
      metodo_pago: null,
      fecha_comprobante: null,
      url_comprobante: null
    },
    {
      id_pago: 6,
      inquilino: {
        nombre: 'Patricia Silva',
        departamento: '203',
        foto: null
      },
      concepto: 'Alquiler',
      descripcion_servicio: 'Alquiler Mensual - Noviembre 2024',
      monto: 1500.00,
      fecha_vencimiento: '2024-11-15',
      estado: 'Pagado',
      metodo_pago: 'Plin',
      fecha_pago: '2024-11-14',
      fecha_comprobante: '2024-11-14T16:20:00',
      url_comprobante: 'https://via.placeholder.com/400x600/3B82F6/ffffff?text=Comprobante+Plin'
    }
  ];

  const filtrarPagos = () => {
    let filtrados = pagos;

    if (filtroEstado !== 'todos') {
      filtrados = filtrados.filter(p => p.estado === filtroEstado);
    }

    if (searchQuery) {
      filtrados = filtrados.filter(p =>
        p.inquilino.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.inquilino.departamento.includes(searchQuery) ||
        p.concepto.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtrados;
  };

  const pagosFiltrados = filtrarPagos();

  const handleVerificar = (pago, aprobado) => {
    const mensaje = aprobado 
      ? `¿Aprobar el pago de ${pago.inquilino.nombre}?`
      : `¿Rechazar el pago de ${pago.inquilino.nombre}?`;
    
    if (window.confirm(mensaje)) {
      console.log(aprobado ? 'Pago aprobado' : 'Pago rechazado', pago.id_pago);
      alert(aprobado ? 'Pago aprobado exitosamente' : 'Pago rechazado');
      setShowModal(false);
    }
  };

  const getEstadoBadge = (estado) => {
    const styles = {
      'Pendiente': { 
        bg: 'bg-amber-50', 
        text: 'text-amber-700', 
        border: 'border-amber-200',
        icon: Clock 
      },
      'Pagado': { 
        bg: 'bg-emerald-50', 
        text: 'text-emerald-700', 
        border: 'border-emerald-200',
        icon: CheckCircle 
      },
      'Vencido': { 
        bg: 'bg-red-50', 
        text: 'text-red-700', 
        border: 'border-red-200',
        icon: AlertCircle 
      },
      'Pendiente de Verificación': { 
        bg: 'bg-blue-50', 
        text: 'text-blue-700', 
        border: 'border-blue-200',
        icon: Eye 
      }
    };
    return styles[estado] || styles['Pendiente'];
  };

  // Estadísticas
  const stats = {
    total: pagos.length,
    pendientes: pagos.filter(p => p.estado === 'Pendiente').length,
    verificacion: pagos.filter(p => p.estado === 'Pendiente de Verificación').length,
    pagados: pagos.filter(p => p.estado === 'Pagado').length,
    vencidos: pagos.filter(p => p.estado === 'Vencido').length,
    totalMonto: pagos.reduce((sum, p) => sum + p.monto, 0),
    montoPagado: pagos.filter(p => p.estado === 'Pagado').reduce((sum, p) => sum + p.monto, 0)
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Pagos</h1>
        <p className="text-gray-600">Administra y verifica los pagos de los inquilinos</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-blue-100 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">Verificación</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats.verificacion}</p>
          <p className="text-sm text-gray-600">Pendientes de revisar</p>
        </div>

        <div className="bg-white border border-emerald-100 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Completado</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats.pagados}</p>
          <p className="text-sm text-gray-600">S/ {stats.montoPagado.toFixed(2)}</p>
        </div>

        <div className="bg-white border border-amber-100 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded">Pendiente</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats.pendientes}</p>
          <p className="text-sm text-gray-600">Por realizar</p>
        </div>

        <div className="bg-white border border-red-100 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">Vencido</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats.vencidos}</p>
          <p className="text-sm text-gray-600">Requieren atención</p>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Búsqueda */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por inquilino o departamento..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Filtros de Estado */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
            >
              <option value="todos">Todos los estados</option>
              <option value="Pendiente de Verificación">Pendientes de Verificación</option>
              <option value="Pendiente">Pendientes</option>
              <option value="Pagado">Pagados</option>
              <option value="Vencido">Vencidos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Pagos */}
      <div className="space-y-4">
        {pagosFiltrados.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No se encontraron pagos
            </h3>
            <p className="text-gray-600">
              {searchQuery 
                ? 'No hay pagos que coincidan con tu búsqueda'
                : 'Todos los pagos aparecerán aquí'
              }
            </p>
          </div>
        ) : (
          pagosFiltrados.map((pago) => {
            const estadoData = getEstadoBadge(pago.estado);
            const IconoEstado = estadoData.icon;
            
            return (
              <div
                key={pago.id_pago}
                className={`bg-white rounded-lg shadow-sm border transition-all hover:shadow-md ${
                  pago.estado === 'Pendiente de Verificación'
                    ? 'border-blue-200'
                    : 'border-gray-200'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    {/* Información del Inquilino y Pago */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        {/* Avatar */}
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                          {pago.inquilino.nombre.split(' ').map(n => n[0]).join('')}
                        </div>
                        
                        {/* Datos */}
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">
                            {pago.inquilino.nombre}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Departamento {pago.inquilino.departamento} • {pago.concepto}
                          </p>
                        </div>
                      </div>

                      {/* Detalles del Pago */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-gray-50 border border-gray-100 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1 flex items-center">
                            <DollarSign className="w-3 h-3 mr-1" />
                            Monto
                          </p>
                          <p className="text-lg font-bold text-gray-900">S/ {pago.monto.toFixed(2)}</p>
                        </div>
                        
                        <div className="bg-gray-50 border border-gray-100 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            Vencimiento
                          </p>
                          <p className="text-sm font-medium text-gray-700">
                            {new Date(pago.fecha_vencimiento).toLocaleDateString('es-PE', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        </div>

                        {pago.metodo_pago && (
                          <div className="bg-gray-50 border border-gray-100 p-3 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1 flex items-center">
                              <CreditCard className="w-3 h-3 mr-1" />
                              Método
                            </p>
                            <p className="text-sm font-medium text-gray-700">
                              {pago.metodo_pago}
                            </p>
                          </div>
                        )}

                        <div className="bg-gray-50 border border-gray-100 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Estado</p>
                          <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium border ${estadoData.bg} ${estadoData.text} ${estadoData.border}`}>
                            <IconoEstado className="w-3.5 h-3.5" />
                            <span>{pago.estado}</span>
                          </span>
                        </div>
                      </div>

                      {/* Descripción */}
                      <p className="text-sm text-gray-600 mt-3">
                        {pago.descripcion_servicio}
                      </p>
                    </div>

                    {/* Acciones */}
                    <div className="ml-6 flex flex-col space-y-2">
                      {pago.estado === 'Pendiente de Verificación' && (
                        <button
                          onClick={() => {
                            setSelectedPayment(pago);
                            setShowModal(true);
                          }}
                          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2 whitespace-nowrap text-sm font-medium shadow-sm"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Ver Comprobante</span>
                        </button>
                      )}
                      
                      {pago.estado === 'Pagado' && (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-lg font-medium whitespace-nowrap flex items-center space-x-2 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          <span>Verificado</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal de Comprobante */}
      {showModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-1">Verificar Comprobante de Pago</h2>
                  <p className="text-emerald-100 text-sm">
                    {selectedPayment.inquilino.nombre} • Departamento {selectedPayment.inquilino.departamento}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Detalles del Pago */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Información del Pago</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Concepto</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedPayment.concepto}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Monto</p>
                    <p className="text-xl font-bold text-emerald-600">S/ {selectedPayment.monto.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Método de Pago</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedPayment.metodo_pago}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Fecha de Comprobante</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {new Date(selectedPayment.fecha_comprobante).toLocaleDateString('es-PE', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Comprobante */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Comprobante Adjunto</h3>
                {selectedPayment.url_comprobante ? (
                  <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                    <img
                      src={selectedPayment.url_comprobante}
                      alt="Comprobante"
                      className="max-h-96 mx-auto rounded-lg shadow-md"
                    />
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 border border-gray-200 rounded-lg">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">Pago realizado mediante {selectedPayment.metodo_pago}</p>
                    <p className="text-sm text-gray-500 mt-1">No requiere comprobante físico</p>
                  </div>
                )}
              </div>

              {/* Acciones */}
              <div className="flex space-x-3">
                <button
                  onClick={() => handleVerificar(selectedPayment, true)}
                  className="flex-1 bg-emerald-600 text-white py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors font-semibold flex items-center justify-center space-x-2 shadow-sm"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Aprobar Pago</span>
                </button>
                <button
                  onClick={() => handleVerificar(selectedPayment, false)}
                  className="flex-1 bg-white border-2 border-red-500 text-red-600 py-3 px-6 rounded-lg hover:bg-red-50 transition-colors font-semibold flex items-center justify-center space-x-2"
                >
                  <XCircle className="w-5 h-5" />
                  <span>Rechazar Pago</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}