import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../../services/api/admin';
import Table from '../../../components/ui/Table';
import Modal from '../../../components/ui/Modal';

export default function VehiclesList() {
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDetections = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminAPI.getAllPlateDetections();
      if (res.data && res.data.success) {
        setDetections(res.data.data.detections || []);
      } else if (res.data && res.data.data && res.data.data.detections) {
        setDetections(res.data.data.detections);
      } else {
        setError('No se pudieron obtener las detecciones');
      }
    } catch (err) {
      console.error('Error cargando detecciones:', err);
      setError(err.response?.data?.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetections();
  }, []);

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendiente', icon: '⏳' },
      verified: { bg: 'bg-green-100', text: 'text-green-800', label: 'Verificado', icon: '✅' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rechazado', icon: '❌' }
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        <span>{badge.icon}</span>
        <span>{badge.label}</span>
      </span>
    );
  };

  const getConfidenceBadge = (confidence) => {
    let color = 'bg-gray-100 text-gray-800';
    if (confidence >= 95) color = 'bg-green-100 text-green-800';
    else if (confidence >= 80) color = 'bg-blue-100 text-blue-800';
    else if (confidence >= 65) color = 'bg-yellow-100 text-yellow-800';
    else color = 'bg-red-100 text-red-800';

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${color}`}>
        {confidence}%
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900">
          {date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
        <span className="text-xs text-gray-500">
          {date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    );
  };

  const headers = ['Placa', 'Confianza', 'IP Dispositivo', 'Fecha', 'Estado', 'Notas', 'Acciones'];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDetection, setSelectedDetection] = useState(null);
  const [modalPlate, setModalPlate] = useState('');
  const [modalSaving, setModalSaving] = useState(false);
  const [modalError, setModalError] = useState('');

  const openEditModal = (det) => {
    setSelectedDetection(det);
    setModalPlate(det.plate_text || '');
    setModalError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDetection(null);
    setModalPlate('');
    setModalSaving(false);
    setModalError('');
  };

  const saveModal = async () => {
    if (!selectedDetection) return;
    setModalSaving(true);
    setModalError('');
    try {
      await adminAPI.updateDetection(selectedDetection.id, { plate_text: modalPlate });
      await fetchDetections();
      closeModal();
    } catch (err) {
      console.error('Error guardando desde modal:', err);
      setModalError(err.response?.data?.message || 'Error al guardar');
    } finally {
      setModalSaving(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              Vehículos-Detecciones de Placas
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Lista de detecciones de placas registradas por las cámaras
            </p>
          </div>
          <button
            onClick={fetchDetections}
            disabled={loading}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span>🔄</span>
            <span>Actualizar</span>
          </button>
        </div>

        {!loading && detections.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Total</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{detections.length}</p>
                </div>
                <div className="text-3xl">📊</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Pendientes</p>
                  <p className="text-2xl font-bold text-yellow-600 mt-1">
                    {detections.filter(d => d.status === 'pending').length}
                  </p>
                </div>
                <div className="text-3xl">⏳</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Verificados</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {detections.filter(d => d.status === 'verified').length}
                  </p>
                </div>
                <div className="text-3xl">✅</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Confianza Prom.</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">
                    {Math.round(detections.reduce((sum, d) => sum + d.confidence, 0) / detections.length)}%
                  </p>
                </div>
                <div className="text-3xl">🎯</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando detecciones...</p>
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-red-600 font-semibold text-lg mb-2">Error al cargar detecciones</p>
          <p className="text-red-500 text-sm">{error}</p>
          <button
            onClick={fetchDetections}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && detections.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No hay detecciones registradas</h3>
          <p className="text-gray-600 mb-6">
            Las detecciones de placas aparecerán aquí una vez que las cámaras comiencen a registrar vehículos.
          </p>
          <button
            onClick={fetchDetections}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Verificar nuevamente
          </button>
        </div>
      )}

      {!loading && !error && detections.length > 0 && (
        <Table headers={headers}>
          {detections.map(det => (
            <tr key={det.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center justify-between">
                  <div className="bg-blue-100 rounded-lg px-4 py-2">
                    <span className="text-base font-bold text-blue-900 tracking-wider">{det.plate_text}</span>
                  </div>
                  <button
                    onClick={() => openEditModal(det)}
                    className="ml-3 text-sm text-gray-600 hover:text-gray-800"
                    title="Editar placa"
                  >
                    Editar
                  </button>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getConfidenceBadge(det.confidence)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">📡</span>
                  <span className="text-sm font-mono text-gray-900">
                    {det.device_ip || '-'}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {formatDate(det.detection_timestamp)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(det.status)}
              </td>
              <td className="px-6 py-4">
                <div className="max-w-xs">
                  <p className="text-xs text-gray-600 line-clamp-2" title={det.notes}>
                    {det.notes || '-'}
                  </p>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(det)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
                    title="Editar"
                  >
                    ✏️ Editar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedDetection ? `Editar placa - #${selectedDetection.id}` : 'Editar placa'}>
        {selectedDetection && (
          <div>
            <div className="mb-3">
              <label htmlFor="modalPlateInput" className="block text-xs font-medium text-gray-600 mb-1">Placa</label>
              <input
                id="modalPlateInput"
                type="text"
                value={modalPlate}
                onChange={(e) => setModalPlate(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-xs text-gray-500">Confianza</p>
                <div className="mt-1">{getConfidenceBadge(selectedDetection.confidence)}</div>
              </div>
              <div>
                <p className="text-xs text-gray-500">IP Dispositivo</p>
                <div className="mt-1 text-sm font-mono text-gray-800">{selectedDetection.device_ip || '-'}</div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs text-gray-500">Notas</p>
              <p className="text-sm text-gray-700 mt-1">{selectedDetection.notes || '-'}</p>
            </div>

            {modalError && (
              <div className="text-sm text-red-600 mb-3">{modalError}</div>
            )}

            <div className="flex justify-end gap-3">
              <button onClick={closeModal} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md">Cancelar</button>
              <button onClick={saveModal} disabled={modalSaving} className="px-4 py-2 bg-blue-600 text-white rounded-md">
                {modalSaving ? 'Guardando...' : 'Guardar y Verificar'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
