// frontend/src/pages/admin/departments/DepartmentsList.jsx
import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../../services/api/admin';

// 🔥 SOLO UNA VERSIÓN DEL DepartmentForm - LA CORREGIDA
const DepartmentForm = ({ onClose, onSuccess }) => {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(false);
  // 🔥 ESTADO PARA MANEJAR CAMPOS VACÍOS
  const [formValues, setFormValues] = useState({
    idEdificio: '',
    numeroPisos: '6',
    desdeNumero: '101', 
    hastaNumero: '124',
    departamentosPorPiso: '4'
  });

  useEffect(() => {
    fetchBuildings();
  }, []);

  const fetchBuildings = async () => {
    try {
      const response = await adminAPI.getBuildings();
      if (response.data.success) {
        setBuildings(response.data.data);
        if (response.data.data.length > 0) {
          setFormValues(prev => ({
            ...prev,
            idEdificio: response.data.data[0].idEdificio.toString()
          }));
        }
      }
    } catch (error) {
      console.error('Error cargando edificios:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // 🔥 PERMITIR CAMPOS VACÍOS PERO EVITAR VALORES NO NUMÉRICOS
    if (value === '' || /^\d*$/.test(value)) {
      setFormValues(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 🔥 VALIDAR QUE NO HAYA CAMPOS VACÍOS
    const { idEdificio, numeroPisos, desdeNumero, hastaNumero, departamentosPorPiso } = formValues;
    
    if (!idEdificio || !numeroPisos || !desdeNumero || !hastaNumero || !departamentosPorPiso) {
      alert('❌ Todos los campos son requeridos');
      return;
    }

    setLoading(true);

    const dataToSend = {
      idEdificio,
      numeroPisos: parseInt(numeroPisos) || 0,
      desdeNumero: parseInt(desdeNumero) || 0,
      hastaNumero: parseInt(hastaNumero) || 0,
      departamentosPorPiso: parseInt(departamentosPorPiso) || 0
    };

    try {
      const response = await adminAPI.createDepartmentsBatch(dataToSend);
      
      if (response.data.success) {
        onSuccess(response.data.data);
      } else {
        alert(response.data.message || 'Error al crear departamentos');
      }
    } catch (error) {
      console.error('Error creando departamentos:', error);
      alert(error.response?.data?.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  // 🔥 CALCULAR TOTAL DE FORMA SEGURA
  const calcularTotalDepartamentos = () => {
    const numPisos = formValues.numeroPisos === '' ? 0 : parseInt(formValues.numeroPisos) || 0;
    const numPorPiso = formValues.departamentosPorPiso === '' ? 0 : parseInt(formValues.departamentosPorPiso) || 0;
    const total = numPisos * numPorPiso;
    return isNaN(total) ? 0 : total;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Crear Departamentos en Lote</h2>
          <p className="text-gray-600 text-sm mt-1">
            Configure la numeración automática de departamentos
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Edificio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Edificio
            </label>
            <select
              name="idEdificio"
              value={formValues.idEdificio}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            >
              <option value="">Seleccionar edificio</option>
              {buildings.map(building => (
                <option key={building.idEdificio} value={building.idEdificio}>
                  {building.nombre} - {building.direccion}
                </option>
              ))}
            </select>
          </div>

          {/* Número de pisos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de pisos (máx. 8)
            </label>
            <input
              type="text" // 🔥 CAMBIADO A "text" PARA MEJOR CONTROL
              name="numeroPisos"
              value={formValues.numeroPisos}
              onChange={handleChange}
              placeholder="6"
              required
              disabled={loading}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            />
          </div>

          {/* Rango de números */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Desde (número)
              </label>
              <input
                type="text" // 🔥 CAMBIADO A "text"
                name="desdeNumero"
                value={formValues.desdeNumero}
                onChange={handleChange}
                placeholder="101"
                required
                disabled={loading}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hasta (número)
              </label>
              <input
                type="text" // 🔥 CAMBIADO A "text"
                name="hastaNumero"
                value={formValues.hastaNumero}
                onChange={handleChange}
                placeholder="124"
                required
                disabled={loading}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              />
            </div>
          </div>

          {/* Departamentos por piso */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Departamentos por piso (máx. 4)
            </label>
            <input
              type="text" // 🔥 CAMBIADO A "text"
              name="departamentosPorPiso"
              value={formValues.departamentosPorPiso}
              onChange={handleChange}
              placeholder="4"
              required
              disabled={loading}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            />
          </div>

          {/* Resumen */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Resumen de creación</h3>
            <div className="text-sm text-blue-600 space-y-1">
              <p>• Pisos: {formValues.numeroPisos || '0'}</p>
              <p>• Departamentos por piso: {formValues.departamentosPorPiso || '0'}</p>
              <p>• Total departamentos: {calcularTotalDepartamentos()} / 32 máximo</p>
              <p>• Numeración: {formValues.desdeNumero || '?'} - {formValues.hastaNumero || '?'}</p>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Creando...' : 'Confirmar y Crear Departamentos'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Componente principal DepartmentsList
const DepartmentsList = () => {
  const [departments, setDepartments] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // ✅ ESTADOS PARA FILTROS Y PAGINACIÓN
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // ✅ 10 items por página

    const initializeData = async () => {
    try {
      console.log('🔄 Inicializando datos de departamentos...');
      
      // Primero obtener edificios
      const buildingsResponse = await adminAPI.getBuildings();
      
      if (buildingsResponse.data.success) {
        const buildingsData = buildingsResponse.data.data;
        console.log('🏢 Edificios obtenidos:', buildingsData.length);
        
        // Si no hay edificios, crear uno por defecto
        if (buildingsData.length === 0) {
          console.log('🏗️ No hay edificios, creando uno por defecto...');
          try {
            const defaultBuildingResponse = await adminAPI.createDefaultBuilding();
            
            if (defaultBuildingResponse.data.success) {
              console.log('✅ Edificio por defecto creado');
              // Recargar los edificios después de crear uno nuevo
              const updatedBuildings = await adminAPI.getBuildings();
              if (updatedBuildings.data.success) {
                setBuildings(updatedBuildings.data.data);
              }
            }
          } catch (buildingError) {
            console.error('❌ Error creando edificio por defecto:', buildingError);
          }
        } else {
          // Ya hay edificios, establecer en estado
          setBuildings(buildingsData);
        }
        
        // Ahora cargar departamentos
        await fetchDepartments();
      }
    } catch (error) {
      console.error('❌ Error inicializando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const deptsResponse = await adminAPI.getDepartments();
      if (deptsResponse.data.success) {
        setDepartments(deptsResponse.data.data);
      }
    } catch (err) {
      console.error('Error cargando departamentos:', err);
    }
  };

  
  const fetchData = async () => {
    try {
      console.log('🔄 Cargando edificios y departamentos...'); // ✅ LOG AGREGADO
      
      const [deptsResponse, bldgsResponse] = await Promise.all([
        adminAPI.getDepartments(),
        adminAPI.getBuildings()
      ]);

      console.log('📥 Respuesta departamentos:', deptsResponse.data); // ✅ LOG MEJORADO
      console.log('📥 Respuesta edificios:', bldgsResponse.data); // ✅ LOG MEJORADO

      if (deptsResponse.data.success) {
        console.log('📦 Departamentos cargados:', deptsResponse.data.data.length); // ✅ LOG AGREGADO
        setDepartments(deptsResponse.data.data);
      }
      
      if (bldgsResponse.data.success) {
        console.log('🏢 Edificios recibidos:', bldgsResponse.data.data.length); // ✅ LOG AGREGADO
        console.log('🏢 Datos completos de edificios:', bldgsResponse.data.data); // ✅ LOG AGREGADO
        
        // ✅ VERIFICACIÓN ADICIONAL
        if (Array.isArray(bldgsResponse.data.data)) {
          setBuildings(bldgsResponse.data.data);
          console.log('✅ Estado buildings actualizado con', bldgsResponse.data.data.length, 'edificios');
        } else {
          console.error('❌ Los datos de edificios no son un array:', typeof bldgsResponse.data.data);
        }
      } else {
        console.error('❌ La respuesta de edificios no es exitosa:', bldgsResponse.data);
      }
    } catch (err) {
      console.error('❌ Error al cargar datos:', err);
      console.error('❌ Detalles del error:', err.response?.data); // ✅ LOG MEJORADO
    } finally {
      setLoading(false);
    }
  };

  // ✅ CAMBIAR useEffect para usar initializeData en lugar de fetchData
  useEffect(() => {
    console.log('🚀 Componente DepartmentsList montado'); // ✅ LOG AGREGADO
    fetchData(); // Mantener fetchData pero con logs mejorados
  }, []);

  const handleCreateSuccess = (newDepartments) => {
    setShowForm(false);
    setDepartments(prev => [...prev, ...newDepartments]);
    alert(`✅ Se crearon ${newDepartments.length} departamentos exitosamente`);
    fetchData();
  };

  const getBuildingName = (buildingId) => {
    const building = buildings.find(b => b.idEdificio === buildingId);
    return building ? building.nombre : 'N/A';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Disponible': 'bg-green-100 text-green-800',
      'Ocupado': 'bg-blue-100 text-blue-800', 
      'En Mantenimiento': 'bg-yellow-100 text-yellow-800'
    };
    return statusConfig[status] || 'bg-gray-100 text-gray-800';
  };

  // ✅ LÓGICA DE FILTRADO
  const filteredDepartments = departments.filter(dept => {
    const matchBuilding = !selectedBuilding || dept.idEdificio === parseInt(selectedBuilding);
    const matchStatus = !selectedStatus || dept.estado === selectedStatus;
    return matchBuilding && matchStatus;
  });

  // ✅ LÓGICA DE PAGINACIÓN
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDepartments = filteredDepartments.slice(startIndex, endIndex);

  // ✅ FUNCIÓN PARA CAMBIAR DE PÁGINA
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // ✅ RESETEAR A PÁGINA 1 CUANDO CAMBIAN LOS FILTROS
  const handleBuildingFilter = (e) => {
    setSelectedBuilding(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (e) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

 return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header con información mejorada */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Departamentos</h1>
          <p className="text-gray-600">
            {buildings.length > 0 
              ? `Administrando ${buildings.length} edificio(s)` 
              : 'Configura tu primer edificio'}
          </p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          disabled={buildings.length === 0}
          className={`px-4 py-2 rounded-lg transition-colors ${
            buildings.length === 0
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {buildings.length === 0 ? 'Crea un edificio primero' : '+ Nuevo Departamento'}
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex gap-4">
          <select 
            value={selectedBuilding}
            onChange={handleBuildingFilter}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los edificios</option>
            {buildings.map(building => (
              <option key={building.idEdificio} value={building.idEdificio}>
                {building.nombre}
              </option>
            ))}
          </select>
          <select 
            value={selectedStatus}
            onChange={handleStatusFilter}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los estados</option>
            <option value="Disponible">Disponible</option>
            <option value="Ocupado">Ocupado</option>
            <option value="En Mantenimiento">En Mantenimiento</option>
          </select>
          {/* ✅ MOSTRAR RESULTADOS */}
          <div className="flex items-center text-sm text-gray-600 ml-auto">
            Mostrando {paginatedDepartments.length} de {filteredDepartments.length} departamentos
          </div>
        </div>
      </div>

      {/* Tarjetas de Edificios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {buildings.map(building => (
          <div key={building.idEdificio} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{building.nombre}</h3>
            <p className="text-gray-600 text-sm mb-4">{building.direccion}</p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total departamentos:</span>
                <span className="font-medium">{building.totalDepartamentos || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Disponibles:</span>
                <span className="text-green-600 font-medium">
                  {departments.filter(d => d.idEdificio === building.idEdificio && d.estado === 'Disponible').length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Ocupados:</span>
                <span className="text-blue-600 font-medium">
                  {departments.filter(d => d.idEdificio === building.idEdificio && d.estado === 'Ocupado').length}
                </span>
              </div>
            </div>

            <button className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg transition-colors text-sm">
              Ver Departamentos
            </button>
          </div>
        ))}
      </div>

      {/* Tabla de Departamentos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Lista de Departamentos</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Departamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Edificio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Piso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inquilino
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* ✅ USAR paginatedDepartments EN LUGAR DE departments */}
              {paginatedDepartments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No hay departamentos para mostrar
                  </td>
                </tr>
              ) : (
                paginatedDepartments.map(dept => (
                  <tr key={dept.idDepartamento} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Apt. {dept.numero}</div>
                      <div className="text-sm text-gray-500">{dept.habitaciones} hab. · {dept.banios} baño(s)</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getBuildingName(dept.idEdificio)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Piso {dept.piso}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(dept.estado)}`}>
                        {dept.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {dept.inquilino ? dept.inquilino.nombreCompleto : '--'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Editar</button>
                      <button className="text-red-600 hover:text-red-900">Eliminar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ AGREGAR PAGINACIÓN */}
        {filteredDepartments.length > itemsPerPage && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Página {currentPage} de {totalPages} · Total: {filteredDepartments.length} departamentos
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Anterior
              </button>
              
              {/* Números de página */}
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                // Mostrar solo páginas cercanas a la actual
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => goToPage(pageNumber)}
                      className={`px-3 py-1 rounded-lg ${
                        currentPage === pageNumber
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                } else if (
                  pageNumber === currentPage - 2 ||
                  pageNumber === currentPage + 2
                ) {
                  return <span key={pageNumber} className="px-2">...</span>;
                }
                return null;
              })}
              
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <DepartmentForm 
          onClose={() => setShowForm(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
};

export default DepartmentsList;