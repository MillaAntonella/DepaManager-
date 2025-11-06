// backend/src/controllers/admin/tenants.controller.js
const { User, Department, Contract, Payment, Building, sequelize } = require('../../models');//                                                         ✅ AGREGAR Building
const { Op } = require('sequelize');

/**
 * ✅ OBTENER TODOS LOS INQUILINOS
 * Devuelve la lista de inquilinos con información de sus contratos y departamentos
 */
const getTenants = async (req, res) => {
  try {
    console.log('🔍 Obteniendo inquilinos para admin:', req.user.idUsuario);
    
    const adminId = req.user.idUsuario;

    // Obtener inquilinos activos con sus departamentos y contratos
    const tenants = await User.findAll({
      where: { 
        rol: 'Inquilino',
        estado: 'Activo'
      },
      attributes: [
        'idUsuario',
        'nombreCompleto',
        'correo',
        'telefono',
        'dni',
        'fechaNacimiento',
        'fechaInicioContrato',
        'fechaFinContrato',
        'plan',
        'estado'
      ],
      include: [
        {
          model: Department,
          as: 'departamentosInquilino',
          include: [
            {
              model: Building,
              where: { idAdministrador: adminId },
              attributes: ['idEdificio', 'nombre', 'direccion']
            }
          ]
        },
        {
          model: Contract,
          as: 'contratos',
          where: { estado: 'Activo' },
          required: false,
          include: [
            {
              model: Department,
              attributes: ['numero', 'piso']
            }
          ]
        }
      ],
      order: [['nombreCompleto', 'ASC']]
    });

    // Procesar datos para respuesta
    const processedTenants = tenants.map(tenant => {
      const departamento = tenant.departamentosInquilino?.[0] || null;
      const contrato = tenant.contratos?.[0] || null;

      return {
        idUsuario: tenant.idUsuario,
        nombreCompleto: tenant.nombreCompleto,
        correo: tenant.correo,
        telefono: tenant.telefono,
        dni: tenant.dni,
        fechaNacimiento: tenant.fechaNacimiento,
        fechaInicioContrato: tenant.fechaInicioContrato,
        fechaFinContrato: tenant.fechaFinContrato,
        plan: tenant.plan,
        estado: tenant.estado,
        departamento: departamento ? {
          numero: departamento.numero,
          piso: departamento.piso,
          edificio: departamento.edificio?.nombre
        } : null,
        contrato: contrato ? {
          idContrato: contrato.idContrato,
          fechaInicio: contrato.fechaInicio,
          fechaFin: contrato.fechaFin,
          montoMensual: contrato.montoMensual
        } : null
      };
    });

    console.log(`✅ Obtenidos ${processedTenants.length} inquilinos`);
    
    res.json({
      success: true,
      data: processedTenants
    });

  } catch (error) {
    console.error('❌ Error obteniendo inquilinos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener inquilinos',
      error: error.message
    });
  }
};

/**
 * ✅ CREAR NUEVO INQUILINO
 * Crea un nuevo usuario con rol de inquilino
 */
const createTenant = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    console.log('👤 Creando nuevo inquilino para admin:', req.user.idUsuario);
    
    const adminId = req.user.idUsuario;
    const {
      nombreCompleto,
      correo,
      contrasenia,
      telefono,
      dni,
      fechaNacimiento,
      idDepartamento,
      fechaInicioContrato,
      fechaFinContrato,
      montoMensual
    } = req.body;

    // Validaciones básicas
    if (!nombreCompleto || !correo || !contrasenia) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Nombre, correo y contraseña son requeridos'
      });
    }

    // Verificar si el correo ya existe
    const usuarioExistente = await User.findOne({
      where: { correo },
      transaction
    });

    if (usuarioExistente) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'El correo ya está registrado'
      });
    }

    // Crear el usuario inquilino
    const nuevoInquilino = await User.create({
      nombreCompleto: nombreCompleto.trim(),
      correo: correo.trim(),
      contrasenia: contrasenia,
      rol: 'Inquilino',
      telefono: telefono || null,
      dni: dni || null,
      fechaNacimiento: fechaNacimiento || null,
      fechaInicioContrato: fechaInicioContrato || null,
      fechaFinContrato: fechaFinContrato || null,
      estado: 'Activo',
      plan: 'Gratuito'
    }, { transaction });

    // Si se proporcionó un departamento, asignarlo
    if (idDepartamento) {
      // Verificar que el departamento existe y pertenece al admin
      const departamento = await Department.findOne({
        include: [
          {
            model: Building,
            where: { idAdministrador: adminId }
          }
        ],
        where: { idDepartamento },
        transaction
      });

      if (departamento) {
        // Actualizar el departamento con el inquilino
        await Department.update(
          { 
            idInquilino: nuevoInquilino.idUsuario,
            estado: 'Ocupado'
          },
          { 
            where: { idDepartamento },
            transaction 
          }
        );

        // Crear contrato si se proporcionaron fechas y monto
        if (fechaInicioContrato && fechaFinContrato && montoMensual) {
          await Contract.create({
            idInquilino: nuevoInquilino.idUsuario,
            idDepartamento: idDepartamento,
            fechaInicio: fechaInicioContrato,
            fechaFin: fechaFinContrato,
            montoMensual: montoMensual,
            estado: 'Activo'
          }, { transaction });
        }
      }
    }

    await transaction.commit();

    console.log('✅ Inquilino creado:', nuevoInquilino.nombreCompleto);

    // Omitir contraseña en la respuesta
    const { contrasenia: _, ...inquilinoSinPassword } = nuevoInquilino.toJSON();

    res.status(201).json({
      success: true,
      message: 'Inquilino creado exitosamente',
      data: inquilinoSinPassword
    });

  } catch (error) {
    await transaction.rollback();
    console.error('❌ Error creando inquilino:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear inquilino',
      error: error.message
    });
  }
};

/**
 * ✅ ACTUALIZAR INQUILINO EXISTENTE
 * Actualiza la información de un inquilino específico
 */
const updateTenant = async (req, res) => {
  try {
    console.log('✏️ Actualizando inquilino ID:', req.params.id);
    
    const adminId = req.user.idUsuario;
    const tenantId = req.params.id;
    const {
      nombreCompleto,
      telefono,
      dni,
      fechaNacimiento,
      estado,
      plan
    } = req.body;

    // Verificar que el inquilino existe
    const inquilino = await User.findOne({
      where: { 
        idUsuario: tenantId,
        rol: 'Inquilino'
      }
    });

    if (!inquilino) {
      return res.status(404).json({
        success: false,
        message: 'Inquilino no encontrado'
      });
    }

    // Actualizar el inquilino
    await User.update(
      {
        nombreCompleto: nombreCompleto || inquilino.nombreCompleto,
        telefono: telefono || inquilino.telefono,
        dni: dni || inquilino.dni,
        fechaNacimiento: fechaNacimiento || inquilino.fechaNacimiento,
        estado: estado || inquilino.estado,
        plan: plan || inquilino.plan
      },
      {
        where: { idUsuario: tenantId }
      }
    );

    // Obtener el inquilino actualizado
    const inquilinoActualizado = await User.findByPk(tenantId, {
      attributes: { exclude: ['contrasenia'] }
    });

    console.log('✅ Inquilino actualizado:', inquilinoActualizado.nombreCompleto);

    res.json({
      success: true,
      message: 'Inquilino actualizado exitosamente',
      data: inquilinoActualizado
    });

  } catch (error) {
    console.error('❌ Error actualizando inquilino:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar inquilino',
      error: error.message
    });
  }
};

/**
 * ✅ OBTENER DETALLES DE UN INQUILINO
 * Devuelve información detallada de un inquilino específico
 */
const getTenantDetails = async (req, res) => {
  try {
    console.log('🔍 Obteniendo detalles del inquilino ID:', req.params.id);
    
    const adminId = req.user.idUsuario;
    const tenantId = req.params.id;

    const inquilino = await User.findOne({
      where: { 
        idUsuario: tenantId,
        rol: 'Inquilino'
      },
      attributes: { exclude: ['contrasenia'] },
      include: [
        {
          model: Department,
          as: 'departamentosInquilino',
          include: [
            {
              model: Building,
              where: { idAdministrador: adminId },
              attributes: ['idEdificio', 'nombre', 'direccion']
            }
          ]
        },
        {
          model: Contract,
          as: 'contratos',
          include: [
            {
              model: Department,
              attributes: ['idDepartamento', 'numero', 'piso', 'metrosCuadrados']
            }
          ]
        },
        {
          model: Payment,
          as: 'pagos',
          limit: 10,
          order: [['fechaVencimiento', 'DESC']]
        }
      ]
    });

    if (!inquilino) {
      return res.status(404).json({
        success: false,
        message: 'Inquilino no encontrado'
      });
    }

    console.log('✅ Detalles del inquilino obtenidos:', inquilino.nombreCompleto);

    res.json({
      success: true,
      data: inquilino
    });

  } catch (error) {
    console.error('❌ Error obteniendo detalles del inquilino:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener detalles del inquilino',
      error: error.message
    });
  }
};

/**
 * ✅ CAMBIAR ESTADO DE INQUILINO
 * Activa o desactiva un inquilino
 */
const updateTenantStatus = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    console.log('🔄 Cambiando estado del inquilino ID:', req.params.id);
    
    const adminId = req.user.idUsuario;
    const tenantId = req.params.id;
    const { estado } = req.body;

    if (!estado || !['Activo', 'Pendiente', 'Retirado'].includes(estado)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Estado inválido. Use: Activo, Pendiente o Retirado'
      });
    }

    // Verificar que el inquilino existe
    const inquilino = await User.findOne({
      where: { 
        idUsuario: tenantId,
        rol: 'Inquilino'
      },
      transaction
    });

    if (!inquilino) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Inquilino no encontrado'
      });
    }

    // Si se retira al inquilino, liberar sus departamentos
    if (estado === 'Retirado') {
      await Department.update(
        { 
          idInquilino: null,
          estado: 'Disponible'
        },
        { 
          where: { idInquilino: tenantId },
          transaction 
        }
      );

      // Finalizar contratos activos
      await Contract.update(
        { estado: 'Finalizado' },
        { 
          where: { 
            idInquilino: tenantId,
            estado: 'Activo'
          },
          transaction 
        }
      );
    }

    // Actualizar estado del inquilino
    await User.update(
      { estado },
      { 
        where: { idUsuario: tenantId },
        transaction 
      }
    );

    await transaction.commit();

    console.log(`✅ Estado del inquilino actualizado a: ${estado}`);

    res.json({
      success: true,
      message: `Estado del inquilino actualizado a ${estado}`
    });

  } catch (error) {
    await transaction.rollback();
    console.error('❌ Error actualizando estado del inquilino:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar estado del inquilino',
      error: error.message
    });
  }
};

// ✅ EXPORTAR TODAS LAS FUNCIONES DEL CONTROLADOR
module.exports = {
  getTenants,
  createTenant,
  updateTenant,
  getTenantDetails,
  updateTenantStatus
};