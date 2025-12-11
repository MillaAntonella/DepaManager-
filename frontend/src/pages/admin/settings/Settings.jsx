import React, { useState } from 'react';
import {
  Building,
  DollarSign,
  Mail,
  Shield,
  Bell,
  Database,
  FileText,
  HardDrive,
  Trash2,
  Download,
  Upload,
  Save,
  RefreshCw,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('edificio');
  const [isSaving, setIsSaving] = useState(false);

  // Estados para configuración del edificio
  const [edificioSettings, setEdificioSettings] = useState({
    nombre: 'Edificio Central',
    direccion: 'Av. Principal 123, Lima',
    telefono: '+51 987 654 321',
    email: 'contacto@edificiocentral.com',
    numero_pisos: 10,
    departamentos_por_piso: 4,
    horario_atencion: '8:00 AM - 6:00 PM'
  });

  // Estados para configuración de pagos
  const [pagosSettings, setPagosSettings] = useState({
    moneda: 'PEN',
    dia_vencimiento: 15,
    multa_por_retraso: 5.00,
    dias_gracia: 3,
    recordatorio_dias_antes: 5,
    permitir_pago_parcial: false
  });

  // Estados para configuración de emails
  const [emailSettings, setEmailSettings] = useState({
    smtp_host: 'smtp.gmail.com',
    smtp_port: 587,
    smtp_user: 'admin@depamanager.com',
    smtp_password: '••••••••',
    email_remitente: 'admin@depamanager.com',
    nombre_remitente: 'DepaManager'
  });

  // Estados para configuración de notificaciones
  const [notificacionesSettings, setNotificacionesSettings] = useState({
    notificar_nuevos_inquilinos: true,
    notificar_pagos_pendientes: true,
    notificar_pagos_vencidos: true,
    notificar_incidencias: true,
    notificar_contratos_proximos_vencer: true,
    dias_aviso_vencimiento_contrato: 30
  });

  // Estados para configuración de seguridad
  const [seguridadSettings, setSeguridadSettings] = useState({
    tiempo_sesion_minutos: 120,
    intentos_login_max: 5,
    requiere_2fa: false,
    cambio_password_obligatorio_dias: 90,
    complejidad_password: 'media',
    registro_actividades: true
  });

  // Estados para configuración de almacenamiento
  const [almacenamientoSettings, setAlmacenamientoSettings] = useState({
    espacio_total_gb: 50,
    espacio_usado_gb: 15.7,
    auto_backup: true,
    frecuencia_backup: 'semanal',
    retener_backups_dias: 30
  });

  const handleSave = async (tipo) => {
    setIsSaving(true);
    
    try {
      // TODO: Implementar guardado en backend
      console.log(`Guardando configuración de ${tipo}`);
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(`Configuración de ${tipo} guardada exitosamente`);
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar la configuración');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = () => {
    alert('Exportando datos del sistema...');
    // TODO: Implementar exportación
  };

  const handleBackup = () => {
    alert('Creando backup manual...');
    // TODO: Implementar backup
  };

  const calcularPorcentajeAlmacenamiento = () => {
    return ((almacenamientoSettings.espacio_usado_gb / almacenamientoSettings.espacio_total_gb) * 100).toFixed(1);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuración del Sistema</h1>
        <p className="text-gray-600">Administra las configuraciones generales de DepaManager</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar de Navegación */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('edificio')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'edificio'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Building className="w-5 h-5" />
                <span className="font-medium text-sm">Edificio</span>
              </button>

              <button
                onClick={() => setActiveTab('pagos')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'pagos'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <DollarSign className="w-5 h-5" />
                <span className="font-medium text-sm">Pagos</span>
              </button>

              <button
                onClick={() => setActiveTab('emails')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'emails'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Mail className="w-5 h-5" />
                <span className="font-medium text-sm">Emails</span>
              </button>

              <button
                onClick={() => setActiveTab('notificaciones')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'notificaciones'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Bell className="w-5 h-5" />
                <span className="font-medium text-sm">Notificaciones</span>
              </button>

              <button
                onClick={() => setActiveTab('seguridad')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'seguridad'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Shield className="w-5 h-5" />
                <span className="font-medium text-sm">Seguridad</span>
              </button>

              <button
                onClick={() => setActiveTab('almacenamiento')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'almacenamiento'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <HardDrive className="w-5 h-5" />
                <span className="font-medium text-sm">Almacenamiento</span>
              </button>

              <button
                onClick={() => setActiveTab('sistema')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'sistema'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Database className="w-5 h-5" />
                <span className="font-medium text-sm">Sistema</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            
            {/* TAB: Configuración del Edificio */}
            {activeTab === 'edificio' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Información del Edificio</h2>
                    <p className="text-sm text-gray-600 mt-1">Configuración general del edificio</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre del Edificio
                      </label>
                      <input
                        type="text"
                        value={edificioSettings.nombre}
                        onChange={(e) => setEdificioSettings({...edificioSettings, nombre: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono de Contacto
                      </label>
                      <input
                        type="tel"
                        value={edificioSettings.telefono}
                        onChange={(e) => setEdificioSettings({...edificioSettings, telefono: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dirección
                      </label>
                      <input
                        type="text"
                        value={edificioSettings.direccion}
                        onChange={(e) => setEdificioSettings({...edificioSettings, direccion: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email de Contacto
                      </label>
                      <input
                        type="email"
                        value={edificioSettings.email}
                        onChange={(e) => setEdificioSettings({...edificioSettings, email: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Horario de Atención
                      </label>
                      <input
                        type="text"
                        value={edificioSettings.horario_atencion}
                        onChange={(e) => setEdificioSettings({...edificioSettings, horario_atencion: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número de Pisos
                      </label>
                      <input
                        type="number"
                        value={edificioSettings.numero_pisos}
                        onChange={(e) => setEdificioSettings({...edificioSettings, numero_pisos: parseInt(e.target.value)})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Departamentos por Piso
                      </label>
                      <input
                        type="number"
                        value={edificioSettings.departamentos_por_piso}
                        onChange={(e) => setEdificioSettings({...edificioSettings, departamentos_por_piso: parseInt(e.target.value)})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleSave('edificio')}
                    disabled={isSaving}
                    className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Guardar Cambios
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* TAB: Configuración de Pagos */}
            {activeTab === 'pagos' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Configuración de Pagos</h2>
                    <p className="text-sm text-gray-600 mt-1">Gestiona las opciones de pagos y vencimientos</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Moneda
                      </label>
                      <select
                        value={pagosSettings.moneda}
                        onChange={(e) => setPagosSettings({...pagosSettings, moneda: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        <option value="PEN">Soles (S/)</option>
                        <option value="USD">Dólares ($)</option>
                        <option value="EUR">Euros (€)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Día de Vencimiento
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={pagosSettings.dia_vencimiento}
                        onChange={(e) => setPagosSettings({...pagosSettings, dia_vencimiento: parseInt(e.target.value)})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Multa por Retraso (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={pagosSettings.multa_por_retraso}
                        onChange={(e) => setPagosSettings({...pagosSettings, multa_por_retraso: parseFloat(e.target.value)})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Días de Gracia
                      </label>
                      <input
                        type="number"
                        value={pagosSettings.dias_gracia}
                        onChange={(e) => setPagosSettings({...pagosSettings, dias_gracia: parseInt(e.target.value)})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Recordatorio (días antes)
                      </label>
                      <input
                        type="number"
                        value={pagosSettings.recordatorio_dias_antes}
                        onChange={(e) => setPagosSettings({...pagosSettings, recordatorio_dias_antes: parseInt(e.target.value)})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Permitir Pagos Parciales</p>
                      <p className="text-sm text-gray-600">Los inquilinos pueden pagar en cuotas</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pagosSettings.permitir_pago_parcial}
                        onChange={(e) => setPagosSettings({...pagosSettings, permitir_pago_parcial: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <button
                    onClick={() => handleSave('pagos')}
                    disabled={isSaving}
                    className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Guardar Cambios
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* TAB: Configuración de Emails */}
            {activeTab === 'emails' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Configuración de Correo</h2>
                    <p className="text-sm text-gray-600 mt-1">Configura el servidor SMTP para envío de emails</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertTriangle className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                      <p className="text-sm text-blue-800">
                        Los cambios en esta configuración afectarán el envío de notificaciones por email.
                        Asegúrate de probar la conexión después de guardar.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Servidor SMTP
                      </label>
                      <input
                        type="text"
                        value={emailSettings.smtp_host}
                        onChange={(e) => setEmailSettings({...emailSettings, smtp_host: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Puerto SMTP
                      </label>
                      <input
                        type="number"
                        value={emailSettings.smtp_port}
                        onChange={(e) => setEmailSettings({...emailSettings, smtp_port: parseInt(e.target.value)})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Usuario SMTP
                      </label>
                      <input
                        type="text"
                        value={emailSettings.smtp_user}
                        onChange={(e) => setEmailSettings({...emailSettings, smtp_user: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contraseña SMTP
                      </label>
                      <input
                        type="password"
                        value={emailSettings.smtp_password}
                        onChange={(e) => setEmailSettings({...emailSettings, smtp_password: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Remitente
                      </label>
                      <input
                        type="email"
                        value={emailSettings.email_remitente}
                        onChange={(e) => setEmailSettings({...emailSettings, email_remitente: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre del Remitente
                      </label>
                      <input
                        type="text"
                        value={emailSettings.nombre_remitente}
                        onChange={(e) => setEmailSettings({...emailSettings, nombre_remitente: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => alert('Probando conexión SMTP...')}
                      className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Probar Conexión
                    </button>
                    <button
                      onClick={() => handleSave('emails')}
                      disabled={isSaving}
                      className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5 mr-2" />
                          Guardar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Notificaciones */}
            {activeTab === 'notificaciones' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Notificaciones Automáticas</h2>
                    <p className="text-sm text-gray-600 mt-1">Configura cuándo enviar notificaciones automáticas</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Nuevos Inquilinos</p>
                      <p className="text-sm text-gray-600">Notificar cuando se registre un nuevo inquilino</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificacionesSettings.notificar_nuevos_inquilinos}
                        onChange={(e) => setNotificacionesSettings({...notificacionesSettings, notificar_nuevos_inquilinos: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Pagos Pendientes</p>
                      <p className="text-sm text-gray-600">Recordatorio de pagos próximos a vencer</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificacionesSettings.notificar_pagos_pendientes}
                        onChange={(e) => setNotificacionesSettings({...notificacionesSettings, notificar_pagos_pendientes: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Pagos Vencidos</p>
                      <p className="text-sm text-gray-600">Alertas cuando un pago está vencido</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificacionesSettings.notificar_pagos_vencidos}
                        onChange={(e) => setNotificacionesSettings({...notificacionesSettings, notificar_pagos_vencidos: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Incidencias</p>
                      <p className="text-sm text-gray-600">Notificar sobre nuevas incidencias reportadas</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificacionesSettings.notificar_incidencias}
                        onChange={(e) => setNotificacionesSettings({...notificacionesSettings, notificar_incidencias: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Contratos por Vencer</p>
                      <p className="text-sm text-gray-600">Alertas sobre contratos próximos a finalizar</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificacionesSettings.notificar_contratos_proximos_vencer}
                        onChange={(e) => setNotificacionesSettings({...notificacionesSettings, notificar_contratos_proximos_vencer: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Días de Aviso antes del Vencimiento del Contrato
                    </label>
                    <input
                      type="number"
                      value={notificacionesSettings.dias_aviso_vencimiento_contrato}
                      onChange={(e) => setNotificacionesSettings({...notificacionesSettings, dias_aviso_vencimiento_contrato: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    onClick={() => handleSave('notificaciones')}
                    disabled={isSaving}
                    className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Guardar Cambios
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* TAB: Seguridad */}
            {activeTab === 'seguridad' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Seguridad del Sistema</h2>
                    <p className="text-sm text-gray-600 mt-1">Configura las políticas de seguridad</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tiempo de Sesión (minutos)
                      </label>
                      <input
                        type="number"
                        value={seguridadSettings.tiempo_sesion_minutos}
                        onChange={(e) => setSeguridadSettings({...seguridadSettings, tiempo_sesion_minutos: parseInt(e.target.value)})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Intentos de Login Máximos
                      </label>
                      <input
                        type="number"
                        value={seguridadSettings.intentos_login_max}
                        onChange={(e) => setSeguridadSettings({...seguridadSettings, intentos_login_max: parseInt(e.target.value)})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cambio Obligatorio de Contraseña (días)
                      </label>
                      <input
                        type="number"
                        value={seguridadSettings.cambio_password_obligatorio_dias}
                        onChange={(e) => setSeguridadSettings({...seguridadSettings, cambio_password_obligatorio_dias: parseInt(e.target.value)})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Complejidad de Contraseña
                      </label>
                      <select
                        value={seguridadSettings.complejidad_password}
                        onChange={(e) => setSeguridadSettings({...seguridadSettings, complejidad_password: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        <option value="baja">Baja (6 caracteres)</option>
                        <option value="media">Media (8 caracteres + números)</option>
                        <option value="alta">Alta (12 caracteres + especiales)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Autenticación de Dos Factores (2FA)</p>
                      <p className="text-sm text-gray-600">Requiere código adicional al iniciar sesión</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={seguridadSettings.requiere_2fa}
                        onChange={(e) => setSeguridadSettings({...seguridadSettings, requiere_2fa: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Registro de Actividades</p>
                      <p className="text-sm text-gray-600">Guardar log de todas las acciones del sistema</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={seguridadSettings.registro_actividades}
                        onChange={(e) => setSeguridadSettings({...seguridadSettings, registro_actividades: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <button
                    onClick={() => handleSave('seguridad')}
                    disabled={isSaving}
                    className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Guardar Cambios
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* TAB: Almacenamiento */}
            {activeTab === 'almacenamiento' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Almacenamiento y Backups</h2>
                    <p className="text-sm text-gray-600 mt-1">Gestiona el espacio y copias de seguridad</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Indicador de Espacio */}
                  <div className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Espacio Utilizado</span>
                      <span className="text-sm font-bold text-emerald-600">
                        {almacenamientoSettings.espacio_usado_gb} GB / {almacenamientoSettings.espacio_total_gb} GB
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-emerald-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${calcularPorcentajeAlmacenamiento()}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      {calcularPorcentajeAlmacenamiento()}% utilizado
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Backup Automático</p>
                      <p className="text-sm text-gray-600">Realizar copias de seguridad automáticamente</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={almacenamientoSettings.auto_backup}
                        onChange={(e) => setAlmacenamientoSettings({...almacenamientoSettings, auto_backup: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frecuencia de Backup
                      </label>
                      <select
                        value={almacenamientoSettings.frecuencia_backup}
                        onChange={(e) => setAlmacenamientoSettings({...almacenamientoSettings, frecuencia_backup: e.target.value})}
                        disabled={!almacenamientoSettings.auto_backup}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="diario">Diario</option>
                        <option value="semanal">Semanal</option>
                        <option value="mensual">Mensual</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Retener Backups (días)
                      </label>
                      <input
                        type="number"
                        value={almacenamientoSettings.retener_backups_dias}
                        onChange={(e) => setAlmacenamientoSettings({...almacenamientoSettings, retener_backups_dias: parseInt(e.target.value)})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Acciones Manuales</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <button
                        onClick={handleBackup}
                        className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Crear Backup Ahora
                      </button>
                      <button
                        onClick={() => alert('Función de limpieza en desarrollo')}
                        className="px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center justify-center"
                      >
                        <Trash2 className="w-5 h-5 mr-2" />
                        Limpiar Archivos Temporales
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSave('almacenamiento')}
                    disabled={isSaving}
                    className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Guardar Cambios
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* TAB: Sistema */}
            {activeTab === 'sistema' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Información del Sistema</h2>
                    <p className="text-sm text-gray-600 mt-1">Versión y herramientas del sistema</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Información del Sistema */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Versión del Sistema</p>
                      <p className="text-lg font-bold text-gray-900">v2.0.0</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Última Actualización</p>
                      <p className="text-lg font-bold text-gray-900">11 Dic, 2024</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Base de Datos</p>
                      <p className="text-lg font-bold text-gray-900">MySQL 8.0</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Servidor</p>
                      <p className="text-lg font-bold text-gray-900">Node.js 18</p>
                    </div>
                  </div>

                  {/* Herramientas del Sistema */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Herramientas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <button
                        onClick={handleExportData}
                        className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Exportar Datos
                      </button>
                      <button
                        onClick={() => alert('Función de importación en desarrollo')}
                        className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center"
                      >
                        <Upload className="w-5 h-5 mr-2" />
                        Importar Datos
                      </button>
                      <button
                        onClick={() => alert('Limpiando caché...')}
                        className="px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center justify-center"
                      >
                        <RefreshCw className="w-5 h-5 mr-2" />
                        Limpiar Caché
                      </button>
                      <button
                        onClick={() => alert('Abriendo logs del sistema...')}
                        className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center justify-center"
                      >
                        <FileText className="w-5 h-5 mr-2" />
                        Ver Logs
                      </button>
                    </div>
                  </div>

                  {/* Zona de Peligro */}
                  <div className="border-t border-red-200 pt-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h3 className="font-semibold text-red-900 mb-2 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        Zona de Peligro
                      </h3>
                      <p className="text-sm text-red-700 mb-4">
                        Estas acciones son irreversibles. Por favor, procede con precaución.
                      </p>
                      <button
                        onClick={() => {
                          if (window.confirm('¿Estás seguro de que deseas restablecer todas las configuraciones? Esta acción no se puede deshacer.')) {
                            alert('Restableciendo configuraciones...');
                          }
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Restablecer Configuraciones
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}