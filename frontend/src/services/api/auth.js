// frontend/src/services/api/auth.js - VERSIÓN COMPLETA Y CORREGIDA
import axios from 'axios';

// ✅ Configuración base de axios con URL desde .env o fallback
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
console.log('🔧 API Base URL configurada:', API_BASE_URL); // Log para debug

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json' // ✅ Header explícito
  }
});

// Interceptor para agregar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('depamanager_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('📤 Enviando petición:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      fullURL: `${config.baseURL}${config.url}`, // ✅ Log de URL completa
      data: config.data
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Error en interceptor de request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => {
    console.log('📥 Respuesta exitosa:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ Error en respuesta:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message
    });
    
    // ✅ Manejo específico de errores de conexión
    if (!error.response) {
      console.error('🚨 ERROR DE CONEXIÓN: No hay respuesta del servidor');
      console.error('🔍 Verifica que el backend esté corriendo en:', API_BASE_URL);
      throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté corriendo.');
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('depamanager_token');
      localStorage.removeItem('depamanager_user');
      window.location.href = '/admin/auth';
    }
    
    return Promise.reject(error);
  }
);

// ✅ Funciones de autenticación
export const authAPI = {
  /**
   * 🔐 LOGIN - Envía credenciales al backend
   * @param {Object} credentials - { correo: string, contrasenia: string }
   * @returns {Promise} Respuesta del servidor con token y datos del usuario
   */
  login: (credentials) => {
    console.log('🔐 authAPI.login - INICIO');
    console.log('📦 Parámetro recibido:', credentials);
    console.log('📦 Tipo del parámetro:', typeof credentials);
    console.log('📧 credentials.correo:', credentials.correo);
    console.log('🔑 credentials.contrasenia:', credentials.contrasenia);
    console.log('📤 JSON.stringify:', JSON.stringify(credentials, null, 2));
    
    // ✅ IMPORTANTE: Enviar directamente el objeto credentials
    // NO envolver en otro objeto
    return api.post('/auth/login', credentials);
  },

  /**
   * 👤 REGISTRO DE ADMIN - Crea nuevo administrador
   * @param {Object} userData - Datos del nuevo administrador
   * @returns {Promise} Respuesta con token, usuario y edificio creado
   */
  registerAdmin: (userData) => {
    console.log('👤 authAPI.registerAdmin - Registrando admin:', { 
      nombre: userData.nombre_completo,
      correo: userData.correo 
    });
    return api.post('/auth/register-admin', userData);
  },

  /**
   * 🔍 VERIFICAR TOKEN - Valida el token actual
   * @returns {Promise} Respuesta con validación del token
   */
  verifyToken: () => {
    console.log('🔍 authAPI.verifyToken - Verificando token actual');
    return api.get('/auth/verify');
  }
};

export default api;