import React from 'react';
import Modal from '../../../components/ui/Modal';

const DepartmentDetails = ({ department, isOpen, onClose }) => {
  if (!department) return null;

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Disponible': 'bg-green-100 text-green-800',
      'Ocupado': 'bg-blue-100 text-blue-800', 
      'En Mantenimiento': 'bg-yellow-100 text-yellow-800'
    };
    return statusConfig[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Detalles - Apt. ${department.numero}`}
      size="lg"
    >
      <div className="space-y-6">
        {/* Información Básica */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Número</h3>
            <p className="text-lg font-semibold">Apt. {department.numero}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Piso</h3>
            <p className="text-lg font-semibold">Piso {department.piso}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Estado</h3>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(department.estado)}`}>
              {department.estado}
            </span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Edificio</h3>
            <p className="text-lg font-semibold">{department.edificio?.nombre || 'N/A'}</p>
          </div>
        </div>

        {/* Características */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Características</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-blue-600">{department.metrosCuadrados || '0'}</p>
              <p className="text-sm text-gray-600">m²</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-green-600">{department.habitaciones || '0'}</p>
              <p className="text-sm text-gray-600">Habitaciones</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-purple-600">{department.banios || '0'}</p>
              <p className="text-sm text-gray-600">Baños</p>
            </div>
          </div>
        </div>

        {/* Información del Inquilino */}
        {department.inquilino && (
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Inquilino Actual</h3>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {department.inquilino.nombreCompleto?.charAt(0) || 'I'}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{department.inquilino.nombreCompleto}</p>
                  <p className="text-sm text-gray-600">{department.inquilino.correo}</p>
                  {department.inquilino.telefono && (
                    <p className="text-sm text-gray-600">{department.inquilino.telefono}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fecha de Creación */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-500">Fecha de Creación</h3>
          <p className="text-gray-800">
            {new Date(department.fechaCreacion).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Cerrar
        </button>
      </div>
    </Modal>
  );
};

export default DepartmentDetails;