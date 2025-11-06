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