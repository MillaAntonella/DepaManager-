// backend/src/controllers/admin/buildings.controller.js
const { Building, Department, User, sequelize } = require('../../models');

/**
 * ✅ OBTENER TODOS LOS EDIFICIOS DEL ADMINISTRADOR
 * Devuelve la lista de edificios con sus estadísticas básicas
 */
const getBuildings = async (req, res) => {
  try {
    console.log('=== 🔍 GET BUILDINGS REQUEST ==='); // ✅ LOG MEJORADO
    console.log('🔍 Usuario autenticado ID:', req.user?.idUsuario);
    console.log('🔍 Usuario autenticado ROL:', req.user?.rol);
    
    const adminId = req.user.idUsuario;

    // Obtener edificios con conteo de departamentos por estado
    const buildings = await Building.findAll({
      where: { idAdministrador: adminId },
      attributes: [
        'idEdificio', 
        'nombre', 
        'direccion', 
        'totalDepartamentos',
        // ✅ CORREGIDO: Usar literal SQL para mapear correctamente fecha_creacion
        [sequelize.literal('`Building`.`fecha_creacion`'), 'fechaCreacion']
      ],
      include: [
        {
          model: Department,
          as: 'departamentos',
          attributes: ['estado'],
          required: false
        }
      ],
      order: [['nombre', 'ASC']]
    });

    console.log('🏢 Total de edificios encontrados:', buildings.length); // ✅ LOG MEJORADO
    
    // Procesar estadísticas para cada edificio
    const buildingsWithStats = buildings.map(building => {
      const depts = building.departamentos || [];
      
      const stats = {
        disponibles: depts.filter(d => d.estado === 'Disponible').length,
        ocupados: depts.filter(d => d.estado === 'Ocupado').length,
        mantenimiento: depts.filter(d => d.estado === 'En Mantenimiento').length
      };

      return {
        idEdificio: building.idEdificio,
        nombre: building.nombre,
        direccion: building.direccion,
        totalDepartamentos: building.totalDepartamentos,
        fechaCreacion: building.dataValues.fechaCreacion, // ✅ CORREGIDO: Acceso desde dataValues
        estadisticas: stats
      };
    });

    console.log(`✅ Enviando respuesta con ${buildingsWithStats.length} edificios`);
    console.log('📤 Edificios:', JSON.stringify(buildingsWithStats, null, 2)); // ✅ LOG DETALLADO
    
    res.json({
      success: true,
      data: buildingsWithStats
    });

  } catch (error) {
    console.error('❌ Error obteniendo edificios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener edificios',
      error: error.message
    });
  }
};

/**
 * ✅ CREAR NUEVO EDIFICIO
 * Crea un nuevo edificio para el administrador
 */
const createBuilding = async (req, res) => {
  try {
    console.log('🏗️ Creando nuevo edificio para admin:', req.user.idUsuario);
    
    const adminId = req.user.idUsuario;
    const { nombre, direccion } = req.body;

    // Validaciones básicas
    if (!nombre || !direccion) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y dirección son requeridos'
      });
    }

    // Crear el edificio
    const nuevoEdificio = await Building.create({
      idAdministrador: adminId,
      nombre: nombre.trim(),
      direccion: direccion.trim(),
      totalDepartamentos: 0
    });

    console.log('✅ Edificio creado:', nuevoEdificio.nombre);

    res.status(201).json({
      success: true,
      message: 'Edificio creado exitosamente',
      data: nuevoEdificio
    });

  } catch (error) {
    console.error('❌ Error creando edificio:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear edificio',
      error: error.message
    });
  }
};

/**
 * ✅ ACTUALIZAR EDIFICIO EXISTENTE
 * Actualiza la información de un edificio específico
 */
const updateBuilding = async (req, res) => {
  try {
    console.log('✏️ Actualizando edificio ID:', req.params.id);
    
    const adminId = req.user.idUsuario;
    const buildingId = req.params.id;
    const { nombre, direccion } = req.body;

    // Verificar que el edificio existe y pertenece al admin
    const edificio = await Building.findOne({
      where: { 
        idEdificio: buildingId,
        idAdministrador: adminId 
      }
    });

    if (!edificio) {
      return res.status(404).json({
        success: false,
        message: 'Edificio no encontrado'
      });
    }

    // Actualizar el edificio
    await Building.update(
      {
        nombre: nombre || edificio.nombre,
        direccion: direccion || edificio.direccion
      },
      {
        where: { idEdificio: buildingId }
      }
    );

    // Obtener el edificio actualizado
    const edificioActualizado = await Building.findByPk(buildingId);

    console.log('✅ Edificio actualizado:', edificioActualizado.nombre);

    res.json({
      success: true,
      message: 'Edificio actualizado exitosamente',
      data: edificioActualizado
    });

  } catch (error) {
    console.error('❌ Error actualizando edificio:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar edificio',
      error: error.message
    });
  }
};

/**
 * ✅ ELIMINAR EDIFICIO
 * Elimina un edificio y sus departamentos (CASCADE)
 */
const deleteBuilding = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    console.log('🗑️ Eliminando edificio ID:', req.params.id);
    
    const adminId = req.user.idUsuario;
    const buildingId = req.params.id;

    // Verificar que el edificio existe y pertenece al admin
    const edificio = await Building.findOne({
      where: { 
        idEdificio: buildingId,
        idAdministrador: adminId 
      },
      transaction
    });

    if (!edificio) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Edificio no encontrado'
      });
    }

    // Verificar si tiene departamentos ocupados
    const departamentosOcupados = await Department.count({
      where: { 
        idEdificio: buildingId,
        estado: 'Ocupado'
      },
      transaction
    });

    if (departamentosOcupados > 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar un edificio con departamentos ocupados'
      });
    }

    // Eliminar el edificio (los departamentos se eliminarán en CASCADE)
    await Building.destroy({
      where: { idEdificio: buildingId },
      transaction
    });

    await transaction.commit();

    console.log('✅ Edificio eliminado:', edificio.nombre);

    res.json({
      success: true,
      message: 'Edificio eliminado exitosamente'
    });

  } catch (error) {
    await transaction.rollback();
    console.error('❌ Error eliminando edificio:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar edificio',
      error: error.message
    });
  }
};

/**
 * ✅ OBTENER DETALLES DE UN EDIFICIO
 * Devuelve información detallada de un edificio específico
 */
const getBuildingDetails = async (req, res) => {
  try {
    console.log('🔍 Obteniendo detalles del edificio ID:', req.params.id);
    
    const adminId = req.user.idUsuario;
    const buildingId = req.params.id;

    const edificio = await Building.findOne({
      where: { 
        idEdificio: buildingId,
        idAdministrador: adminId 
      },
      include: [
        {
          model: Department,
          as: 'departamentos',
          include: [
            {
              model: User,
              as: 'inquilino',
              attributes: ['idUsuario', 'nombreCompleto', 'correo', 'telefono']
            }
          ]
        }
      ]
    });

    if (!edificio) {
      return res.status(404).json({
        success: false,
        message: 'Edificio no encontrado'
      });
    }

    // Calcular estadísticas detalladas
    const depts = edificio.departamentos || [];
    const estadisticas = {
      total: depts.length,
      disponibles: depts.filter(d => d.estado === 'Disponible').length,
      ocupados: depts.filter(d => d.estado === 'Ocupado').length,
      mantenimiento: depts.filter(d => d.estado === 'En Mantenimiento').length,
      ocupacionPorPiso: {}
    };

    // Calcular ocupación por piso
    depts.forEach(dept => {
      const piso = dept.piso;
      if (!estadisticas.ocupacionPorPiso[piso]) {
        estadisticas.ocupacionPorPiso[piso] = { total: 0, ocupados: 0 };
      }
      estadisticas.ocupacionPorPiso[piso].total++;
      if (dept.estado === 'Ocupado') {
        estadisticas.ocupacionPorPiso[piso].ocupados++;
      }
    });

    console.log('✅ Detalles del edificio obtenidos:', edificio.nombre);

    res.json({
      success: true,
      data: {
        edificio: {
          idEdificio: edificio.idEdificio,
          nombre: edificio.nombre,
          direccion: edificio.direccion,
          totalDepartamentos: edificio.totalDepartamentos,
          fechaCreacion: edificio.fechaCreacion
        },
        departamentos: depts,
        estadisticas: estadisticas
      }
    });

  } catch (error) {
    console.error('❌ Error obteniendo detalles del edificio:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener detalles del edificio',
      error: error.message
    });
  }
};

// ✅ EXPORTAR TODAS LAS FUNCIONES DEL CONTROLADOR
module.exports = {
  getBuildings,
  createBuilding,
  updateBuilding,
  deleteBuilding,
  getBuildingDetails
};