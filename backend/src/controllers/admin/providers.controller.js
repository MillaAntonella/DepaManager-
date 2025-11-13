const { Provider } = require('../../models');

const getProviders = async (req, res) => {
  try {
    const providers = await Provider.findAll({
      where: { estado: 'Activo' },
      attributes: ['idProveedor', 'nombre', 'especialidad', 'contacto', 'telefono', 'ubicacion'],
      order: [['nombre', 'ASC']]
    });

    res.json({
      success: true,
      data: providers
    });

  } catch (error) {
    console.error('Error obteniendo proveedores:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener proveedores'
    });
  }
};

module.exports = {
  getProviders
};