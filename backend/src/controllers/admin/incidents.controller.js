const { Incident, User, Provider, Department, Building } = require('../../models');
const { Op } = require('sequelize');

const getIncidents = async (req, res) => {
  try {
    console.log('📋 Admin - Obteniendo incidencias...');
    
    const { estado, urgencia, categoria } = req.query;
    
    const whereConditions = {};
    if (estado) whereConditions.estado = estado;
    if (urgencia) whereConditions.urgencia = urgencia;
    if (categoria) whereConditions.categoria = categoria;

    console.log('🔍 Filtros aplicados:', whereConditions);

    const incidents = await Incident.findAll({
      where: whereConditions,
      include: [
        {
          model: User,
          as: 'inquilino',
          attributes: ['idUsuario', 'nombreCompleto', 'correo', 'telefono']
        },
        {
          model: Provider,
          as: 'proveedor',
          attributes: ['idProveedor', 'nombre', 'especialidad', 'contacto']
        }
      ],
      order: [['fechaReporte', 'DESC']]
    });
    
    console.log(`✅ ${incidents.length} incidencias encontradas`);
    
    // Obtener el departamento de cada inquilino (solo uno por inquilino)
    for (let incident of incidents) {
      if (incident.inquilino) {
        const department = await Department.findOne({
          where: { idInquilino: incident.inquilino.idUsuario },
          include: [{
            model: Building,
            as: 'edificio',
            attributes: ['idEdificio', 'nombre']
          }],
          attributes: ['idDepartamento', 'numero', 'piso']
        });
        
        // Agregar el departamento al objeto inquilino
        incident.inquilino.dataValues.departamento = department;
      }
    }

    // Estadísticas para el dashboard
    const total = await Incident.count();
    const abiertas = await Incident.count({ where: { estado: 'Abierta' } });
    const en_proceso = await Incident.count({ 
      where: { 
        estado: {
          [Op.in]: ['En Revisión', 'Asignada', 'En Proceso']
        }
      } 
    });
    const completadas = await Incident.count({ where: { estado: 'Completada' } });

    console.log('📊 Estadísticas:', { total, abiertas, en_proceso, completadas });

    res.json({
      success: true,
      data: {
        incidencias: incidents,
        estadisticas: {
          total,
          abiertas,
          en_proceso,
          completadas
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo incidencias:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener incidencias'
    });
  }
};

const updateIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, idProveedor, mensajeAsignacion } = req.body;

    const incident = await Incident.findByPk(id);
    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incidencia no encontrada'
      });
    }

    // Si se marca como completada, establecer fecha de cierre
    const updateData = { 
      estado, 
      idProveedor: idProveedor || null, 
      mensajeAsignacion 
    };
    
    if (estado === 'Completada' && !incident.fechaCierre) {
      updateData.fechaCierre = new Date();
    } else if (estado !== 'Completada') {
      updateData.fechaCierre = null;
    }

    await incident.update(updateData);

    // Obtener la incidencia actualizada con relaciones
    const updatedIncident = await Incident.findByPk(id, {
      include: [
        {
          model: User,
          as: 'inquilino',
          attributes: ['idUsuario', 'nombreCompleto', 'correo']
        },
        {
          model: Provider,
          as: 'proveedor',
          attributes: ['idProveedor', 'nombre', 'especialidad']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Incidencia actualizada correctamente',
      data: updatedIncident
    });

  } catch (error) {
    console.error('Error actualizando incidencia:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar incidencia'
    });
  }
};

const getIncidentDetails = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`📋 Obteniendo detalle de incidencia ID: ${id}`);

    const incident = await Incident.findByPk(id, {
      include: [
        {
          model: User,
          as: 'inquilino',
          attributes: ['idUsuario', 'nombreCompleto', 'correo', 'telefono', 'dni']
        },
        {
          model: Provider,
          as: 'proveedor',
          attributes: ['idProveedor', 'nombre', 'especialidad', 'contacto']
        }
      ]
    });

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incidencia no encontrada'
      });
    }

    // Obtener el departamento del inquilino (solo uno)
    if (incident.inquilino) {
      const department = await Department.findOne({
        where: { idInquilino: incident.inquilino.idUsuario },
        include: [{
          model: Building,
          as: 'edificio',
          attributes: ['idEdificio', 'nombre', 'direccion']
        }],
        attributes: ['idDepartamento', 'numero', 'piso', 'metrosCuadrados']
      });
      
      // Agregar el departamento al objeto inquilino
      incident.inquilino.dataValues.departamento = department;
    }

    console.log('✅ Detalle de incidencia obtenido');

    res.json({
      success: true,
      data: incident
    });

  } catch (error) {
    console.error('❌ Error obteniendo detalle de incidencia:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener detalle de incidencia'
    });
  }
};

module.exports = {
  getIncidents,
  updateIncident,
  getIncidentDetails
};