// backend/src/routes/admin.routes.js - VERSIÓN CORREGIDA Y SIMPLIFICADA
const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middlewares/auth.middleware');

// Importar controladores SOLO con funciones que existen
const dashboardController = require('../controllers/admin/dashboard.controller');
const departmentsController = require('../controllers/admin/departments.controller');
const buildingsController = require('../controllers/admin/buildings.controller');
const tenantsController = require('../controllers/admin/tenants.controller');

console.log('✅ Controladores cargados correctamente');

// ==================== ✅ RUTAS BÁSICAS FUNCIONALES ====================

// DASHBOARD
router.get('/dashboard', verifyToken, verifyAdmin, dashboardController.getDashboardData);

// EDIFICIOS
router.get('/buildings', verifyToken, verifyAdmin, buildingsController.getBuildings);

// DEPARTAMENTOS  
router.get('/departments', verifyToken, verifyAdmin, departmentsController.getDepartments);
// ✅ AGREGAR RUTA PARA CREAR DEPARTAMENTOS EN LOTE
router.post('/departments/batch', verifyToken, verifyAdmin, departmentsController.createDepartmentsBatch);

// INQUILINOS
router.get('/tenants', verifyToken, verifyAdmin, tenantsController.getTenants);

// ==================== ✅ RUTA DE SALUD ====================
router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Admin routes funcionando',
    timestamp: new Date().toISOString()
  });
});

// ✅ EXPORTAR ROUTER CORRECTAMENTE
module.exports = router;