const { User, Department, Building, Payment, Incident, Contract } = require('../../models');
const { Op } = require('sequelize');

/**
 * Controlador para el dashboard del inquilino
 */
const getDashboard = async (req, res) => {
  try {
    const userId = req.user.idUsuario || req.user.id;
    
    console.log('📊 Dashboard Tenant - Usuario ID:', userId);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Usuario no identificado'
      });
    }

    // Obtener información del usuario
    const user = await User.findByPk(userId, {
      attributes: ['nombreCompleto', 'correo', 'telefono']
    });
    
    console.log('👤 Usuario:', user ? user.nombreCompleto : 'No encontrado');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Obtener departamento del usuario
    const department = await Department.findOne({
      where: { idInquilino: userId },
      include: [{
        model: Building,
        as: 'edificio',
        attributes: ['nombre', 'direccion']
      }]
    });
    
    console.log('🏠 Departamento:', department ? `Depto ${department.numero}` : 'No asignado');

    // Obtener próximo pago pendiente
    const nextPayment = await Payment.findOne({
      where: {
        idInquilino: userId,
        estado: 'Pendiente',
        fechaVencimiento: {
          [Op.gte]: new Date()
        }
      },
      order: [['fechaVencimiento', 'ASC']]
    });
    
    console.log('💰 Próximo pago:', nextPayment ? nextPayment.monto : 'Sin pagos');

    // Contar pagos del año actual
    const currentYear = new Date().getFullYear();
    const paymentCount = await Payment.count({
      where: {
        idInquilino: userId,
        estado: 'Pagado',
        fechaPago: {
          [Op.gte]: new Date(`${currentYear}-01-01`),
          [Op.lte]: new Date(`${currentYear}-12-31`)
        }
      }
    });

    // Contar incidencias activas
    const incidentsCount = await Incident.count({
      where: {
        idInquilino: userId,
        estado: {
          [Op.in]: ['Abierta', 'En Revisión', 'Asignada', 'En Proceso']
        }
      }
    });
    
    console.log('🚨 Incidencias activas:', incidentsCount);

    // Construir respuesta
    const dashboardData = {
      usuario: {
        nombreCompleto: user.nombreCompleto
      },
      proximoPago: {
        monto: nextPayment ? parseFloat(nextPayment.monto) : 0,
        fechaVencimiento: nextPayment ? 
          new Date(nextPayment.fechaVencimiento).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }) : 'Sin pagos pendientes'
      },
      departamento: {
        numero: department ? department.numero : 'No asignado',
        edificio: department && department.edificio ? department.edificio.nombre : 'No asignado'
      },
      estadisticas: {
        pagosEsteAnio: paymentCount,
        incidenciasActivas: incidentsCount
      },
      actividadReciente: []
    };

    console.log('✅ Dashboard generado correctamente');

    res.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('❌ Error en dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

module.exports = {
  getDashboard
};