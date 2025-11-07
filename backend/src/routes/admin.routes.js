const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middlewares/auth.middleware');

// Importar controladores
const dashboardController = require('../controllers/admin/dashboard.controller');
const departmentsController = require('../controllers/admin/departments.controller');
const buildingsController = require('../controllers/admin/buildings.controller');
const tenantsController = require('../controllers/admin/tenants.controller');

console.log('✅ Controladores cargados correctamente');

// ==================== ✅ RUTAS DEL DASHBOARD ====================
router.get('/dashboard', verifyToken, verifyAdmin, dashboardController.getDashboardData);

// ==================== ✅ RUTAS DE EDIFICIOS ====================
router.get('/buildings', verifyToken, verifyAdmin, buildingsController.getBuildings);

// ==================== ✅ RUTAS DE DEPARTAMENTOS ====================
router.get('/departments', verifyToken, verifyAdmin, departmentsController.getDepartments);
router.get('/departments/available', verifyToken, verifyAdmin, departmentsController.getAvailableDepartments);
router.get('/departments/:id', verifyToken, verifyAdmin, departmentsController.getDepartmentDetails);
router.post('/departments/batch', verifyToken, verifyAdmin, departmentsController.createDepartmentsBatch);
router.put('/departments/:id', verifyToken, verifyAdmin, departmentsController.updateDepartment);
router.delete('/departments/:id', verifyToken, verifyAdmin, departmentsController.deleteDepartment);

// ==================== ✅ RUTAS DE INQUILINOS ====================
router.get('/tenants', verifyToken, verifyAdmin, tenantsController.getTenants);
router.get('/tenants/:id', verifyToken, verifyAdmin, tenantsController.getTenantDetails);
router.post('/tenants', verifyToken, verifyAdmin, tenantsController.createTenant);
router.put('/tenants/:id', verifyToken, verifyAdmin, tenantsController.updateTenant);
router.delete('/tenants/:id', verifyToken, verifyAdmin, tenantsController.deleteTenant);
router.patch('/tenants/:id/status', verifyToken, verifyAdmin, tenantsController.updateTenantStatus);

// ==================== ✅ RUTA DE SALUD ====================
router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Admin routes funcionando',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;