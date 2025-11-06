// backend/src/controllers/admin/departments.controller.js
const { Department, Building, User, sequelize } = require('../../models');

const createDepartmentsBatch = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { idEdificio, numeroPisos, desdeNumero, hastaNumero, departamentosPorPiso } = req.body;
    const adminId = req.user.idUsuario;

    console.log('🔍 Datos recibidos para creación en lote:', req.body);

    // Validaciones básicas
    if (!idEdificio || !numeroPisos || !desdeNumero || !hastaNumero || !departamentosPorPiso) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    // Verificar que el edificio existe y pertenece al administrador
    const edificio = await Building.findOne({
      where: { 
        idEdificio: parseInt(idEdificio),
        idAdministrador: adminId 
      },
      transaction
    });

    if (!edificio) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Edificio no encontrado o no tienes permisos'
      });
    }

    const totalDepartamentos = parseInt(numeroPisos) * parseInt(departamentosPorPiso);
    const rangoNumeros = parseInt(hastaNumero) - parseInt(desdeNumero) + 1;

    if (totalDepartamentos !== rangoNumeros) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `El rango de números (${rangoNumeros}) no coincide con el total de departamentos (${totalDepartamentos})`
      });
    }

    // Generar departamentos
    const departamentosCreados = [];
    let numeroActual = parseInt(desdeNumero);

    for (let piso = 1; piso <= numeroPisos; piso++) {
      for (let deptPorPiso = 1; deptPorPiso <= departamentosPorPiso; deptPorPiso++) {
        if (numeroActual > hastaNumero) break;

        const departamentoData = {
          idEdificio: parseInt(idEdificio),
          numero: numeroActual.toString(),
          piso: piso,
          metrosCuadrados: 60.00,
          habitaciones: 2,
          banios: 1,
          estado: 'Disponible',
          idInquilino: null
        };

        console.log(`🏠 Creando departamento: ${departamentoData.numero} - Piso ${piso}`);

        const nuevoDepartamento = await Department.create(departamentoData, { transaction });
        departamentosCreados.push(nuevoDepartamento);

        numeroActual++;
      }
    }

    // Actualizar contador en el edificio
    const nuevoTotal = (edificio.totalDepartamentos || 0) + departamentosCreados.length;
    await Building.update(
      { totalDepartamentos: nuevoTotal },
      { 
        where: { idEdificio: parseInt(idEdificio) },
        transaction 
      }
    );

    await transaction.commit();

    console.log(`✅ Creados ${departamentosCreados.length} departamentos para el edificio ${edificio.nombre}`);

    res.json({
      success: true,
      message: `Se crearon ${departamentosCreados.length} departamentos exitosamente`,
      data: departamentosCreados
    });

  } catch (error) {
    await transaction.rollback();
    console.error('❌ Error creando departamentos en lote:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al crear departamentos',
      error: error.message
    });
  }
};

// Obtener todos los departamentos
const getDepartments = async (req, res) => {
  try {
    console.log('=== 🔍 GET DEPARTMENTS REQUEST ==='); // ✅ LOG AGREGADO
    console.log('🔍 Admin ID:', req.user?.idUsuario); // ✅ LOG AGREGADO
    
    const adminId = req.user.idUsuario;

    // Primero obtener los edificios del administrador
    const edificiosAdmin = await Building.findAll({
      where: { idAdministrador: adminId },
      attributes: ['idEdificio']
    });

    console.log('🏢 Edificios del admin:', edificiosAdmin.length); // ✅ LOG AGREGADO

    const idsEdificios = edificiosAdmin.map(ed => ed.idEdificio);

    if (idsEdificios.length === 0) {
      console.log('⚠️  No hay edificios para este admin'); // ✅ LOG AGREGADO
      return res.json({
        success: true,
        data: []
      });
    }

    console.log('🔍 Buscando departamentos en edificios:', idsEdificios); // ✅ LOG AGREGADO

    // ✅ CORRECCIÓN: Usar alias 'edificio' en el include
    const departments = await Department.findAll({
      where: {
        idEdificio: idsEdificios
      },
      include: [
        {
          model: Building,
          as: 'edificio', // ✅ AGREGAR ALIAS
          attributes: ['idEdificio', 'nombre', 'direccion']
        },
        {
          model: User,
          as: 'inquilino',
          attributes: ['idUsuario', 'nombreCompleto', 'correo'],
          required: false // ✅ LEFT JOIN para incluir deptos sin inquilino
        }
      ],
      order: [['idEdificio', 'ASC'], ['piso', 'ASC'], ['numero', 'ASC']]
    });

    console.log('📦 Departamentos encontrados:', departments.length); // ✅ LOG AGREGADO

    res.json({
      success: true,
      data: departments
    });

  } catch (error) {
    console.error('❌ Error obteniendo departamentos:', error);
    console.error('❌ Stack:', error.stack); // ✅ LOG MEJORADO
    res.status(500).json({
      success: false,
      message: 'Error al obtener departamentos: ' + error.message
    });
  }
};

// Obtener edificios
const getBuildings = async (req, res) => {
  try {
    console.log('=== 🔍 GET BUILDINGS REQUEST (departments controller) ==='); // ✅ LOG AGREGADO
    console.log('🔍 Admin ID:', req.user?.idUsuario); // ✅ LOG AGREGADO
    
    const adminId = req.user.idUsuario;

    const buildings = await Building.findAll({
      where: { idAdministrador: adminId },
      attributes: ['idEdificio', 'nombre', 'direccion', 'totalDepartamentos'],
      order: [['nombre', 'ASC']]
    });

    console.log('🏢 Edificios encontrados:', buildings.length); // ✅ LOG AGREGADO
    console.log('📤 Datos edificios:', JSON.stringify(buildings, null, 2)); // ✅ LOG AGREGADO

    res.json({
      success: true,
      data: buildings
    });

  } catch (error) {
    console.error('❌ Error obteniendo edificios:', error);
    console.error('❌ Stack:', error.stack); // ✅ LOG MEJORADO
    res.status(500).json({
      success: false,
      message: 'Error al obtener edificios: ' + error.message
    });
  }
};

// ✅ AGREGAR FUNCIÓN PARA CREAR EDIFICIO SI NO EXISTE
const createDefaultBuilding = async (req, res) => {
  try {
    const adminId = req.user.idUsuario;
    console.log('🏗️ Solicitando creación de edificio por defecto para admin:', adminId);

    // Verificar si ya tiene edificios
    const existingBuildings = await Building.count({
      where: { idAdministrador: adminId }
    });

    if (existingBuildings > 0) {
      console.log('ℹ️  El administrador ya tiene edificios:', existingBuildings);
      return res.json({
        success: true,
        message: 'Ya tienes edificios registrados',
        data: null
      });
    }

    // Crear edificio por defecto
    const defaultBuilding = await Building.create({
      idAdministrador: adminId,
      nombre: 'Mi Edificio Principal',
      direccion: 'Actualiza la dirección en configuración',
      totalDepartamentos: 0
    });

    console.log('✅ Edificio por defecto creado:', defaultBuilding.nombre);

    res.json({
      success: true,
      message: 'Edificio por defecto creado exitosamente',
      data: defaultBuilding
    });

  } catch (error) {
    console.error('❌ Error creando edificio por defecto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear edificio por defecto',
      error: error.message
    });
  }
};

// ✅ CORRECTO: Exportar solo las funciones de departamentos
module.exports = {
  createDepartmentsBatch,
  getDepartments,
  getBuildings,
  createDefaultBuilding  // ✅ AGREGAR ESTA LÍNEA
};