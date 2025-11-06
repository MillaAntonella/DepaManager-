// frontend/src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('depamanager_token');
      const userData = localStorage.getItem('depamanager_user');
      
      if (token && userData) {
        console.log('🔍 Verificando token...');
        const response = await authAPI.verifyToken();
        if (response.data.success) {
          setUser(response.data.user);
          console.log('✅ Usuario autenticado:', response.data.user.correo);
        } else {
          console.log('❌ Token inválido');
          clearAuth();
        }
      } else {
        console.log('🔐 No hay token almacenado');
      }
    } catch (error) {
      console.error('❌ Error verificando autenticación:', error);
      clearAuth();
    } finally {
      setLoading(false);
    }
  };

  const clearAuth = () => {
    localStorage.removeItem('depamanager_token');
    localStorage.removeItem('depamanager_user');
    setUser(null);
  };

  const login = async (credentials) => {
    try {
      console.log('🔐 Enviando login...');
      const response = await authAPI.login(credentials);
      
      console.log('✅ Respuesta del servidor:', response.data);
      
      if (response.data.success) {
        localStorage.setItem('depamanager_token', response.data.token);
        localStorage.setItem('depamanager_user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        
        return { 
          success: true, 
          user: response.data.user
        };
      } else {
        return { 
          success: false, 
          error: response.data.message 
        };
      }
    } catch (error) {
      console.error('❌ Error en login:', error);
      
      if (error.response) {
        return { 
          success: false, 
          error: error.response.data?.message || `Error ${error.response.status}` 
        };
      }
      
      return { 
        success: false, 
        error: 'Error de conexión con el servidor' 
      };
    }
  };

  const logout = () => {
    console.log('🚪 Cerrando sesión...');
    clearAuth();
  };

  // ✅ FUNCIÓN DE REGISTRO PARA ADMINISTRADOR (agregada para solucionar error)
  const registerAdmin = async (userData) => {
    try {
      console.log('👤 Registrando nuevo administrador...', userData);
      const response = await authAPI.registerAdmin(userData);
      
      console.log('✅ Respuesta del registro:', response.data);
      
      if (response.data.success) {
        // Guardar token y usuario en localStorage
        localStorage.setItem('depamanager_token', response.data.token);
        localStorage.setItem('depamanager_user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        
        console.log('✅ Administrador registrado exitosamente:', response.data.user.correo);
        
        // ✅ LOGS DEL EDIFICIO CREADO
        if (response.data.buildingCreated && response.data.building) {
          console.log('🏢 Edificio creado automáticamente:');
          console.log('   - ID:', response.data.building.id);
          console.log('   - Nombre:', response.data.building.nombre);
          console.log('   - Dirección:', response.data.building.direccion);
        } else {
          console.warn('⚠️ No se pudo crear el edificio automáticamente');
        }
        
        return { 
          success: true, 
          user: response.data.user,
          buildingCreated: response.data.buildingCreated,
          building: response.data.building // ✅ Devolver info del edificio
        };
      } else {
        return { 
          success: false, 
          error: response.data.message 
        };
      }
    } catch (error) {
      console.error('❌ Error en registro:', error);
      
      // ✅ MANEJO MEJORADO DE ERRORES CON MENSAJES ESPECÍFICOS
      if (error.response) {
        const errorMessage = error.response.data?.message || `Error ${error.response.status}`;
        console.error('❌ Error del servidor:', errorMessage);
        
        return { 
          success: false, 
          error: errorMessage
        };
      }
      
      // ✅ Error de conexión
      console.error('❌ Error de conexión con el servidor');
      return { 
        success: false, 
        error: 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.' 
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    registerAdmin, // ✅ AGREGADA la función registerAdmin
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};