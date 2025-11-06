// frontend/src/services/api/admin.js
import axios from 'axios';

// Configuración base de axios
const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
});

// Interceptor para agregar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('depamanager_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token agregado a request:', config.url); // ✅ LOG AGREGADO
    } else {
      console.warn('⚠️ No hay token en localStorage para:', config.url); // ✅ LOG AGREGADO
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas de error
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido, limpiar y redirigir
      localStorage.removeItem('depamanager_token');
      localStorage.removeItem('depamanager_user');
      window.location.href = '/admin/auth';
    }
    return Promise.reject(error);
  }
);

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  
  getDepartments: () => {
    console.log('📦 Solicitando departamentos...'); // ✅ LOG AGREGADO
    return api.get('/admin/departments');
  },
  
  getBuildings: () => {
    console.log('🏢 Solicitando edificios...'); // ✅ LOG AGREGADO
    return api.get('/admin/buildings');
  },
  
  getTenants: () => api.get('/admin/tenants'),
  // ... otros métodos

    // ✅ Nuevo método para crear departamentos en lote
  createDepartmentsBatch: (data) => {
    console.log('📤 Creando departamentos en lote:', data);
    return api.post('/admin/departments/batch', data);
  },

   // ✅ AGREGAR MÉTODO PARA CREAR EDIFICIO POR DEFECTO
  createDefaultBuilding: () => {
    console.log('🏗️ Solicitando creación de edificio por defecto...');
    return api.post('/admin/buildings/default');
  }
};