// frontend/src/pages/auth/LoginPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

/**
 * 🔐 PÁGINA DE LOGIN
 * Permite iniciar sesión tanto para administradores como para inquilinos
 * Redirige automáticamente según el rol del usuario
 */
const LoginPage = () => {
  // ✅ Hook de autenticación del contexto global
  const { login } = useAuth();
  
  // ✅ Estados del formulario
  const [formData, setFormData] = useState({
    correo: '',      // Email del usuario
    contrasenia: ''  // Contraseña (sin ñ para coincidir con el backend)
  });
  
  const [error, setError] = useState('');       // Mensajes de error
  const [loading, setLoading] = useState(false); // Estado de carga

  /**
   * 📝 Maneja los cambios en los inputs del formulario
   * Actualiza el estado formData cuando el usuario escribe
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  /**
   * 🚀 Maneja el envío del formulario de login
   * Valida los campos y llama a la función login del contexto
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // ✅ Validación de campos vacíos
    if (!formData.correo || !formData.contrasenia) {
      setError('Por favor completa todos los campos');
      return;
    }

    // ✅ Validación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
      setError('Por favor ingresa un correo válido');
      return;
    }

    setLoading(true);
    
    try {
      console.log('🔐 LoginPage - Iniciando login...');
      console.log('📋 formData completo:', formData);
      console.log('📧 formData.correo:', formData.correo);
      console.log('🔑 formData.contrasenia:', formData.contrasenia);
      console.log('📦 Tipo de formData.correo:', typeof formData.correo);
      console.log('📦 Tipo de formData.contrasenia:', typeof formData.contrasenia);
      
      // ✅ IMPORTANTE: Enviar datos directamente, NO dentro de un objeto "email"
      console.log('🚀 Llamando a login() con:', formData.correo, formData.contrasenia);
      const result = await login(formData.correo, formData.contrasenia);
      
      console.log('📋 Resultado del login:', result);
      
      // Si el login es exitoso, redirigir según el rol
      if (result.success) {
        console.log('✅ Login exitoso');
        console.log('🎭 Rol del usuario:', result.user?.rol);
        
        // NO hacer nada aquí - el AppRouter se encargará de redirigir
        // basándose en el estado isAuthenticated y user.rol
        
        // Forzar recarga de la página para que AppRouter detecte el cambio
        window.location.reload();
      } else {
        // Si el login falla, mostrar el error
        setError(result.error || 'Error al iniciar sesión');
      }
      // Si es exitoso, el AuthContext se encarga de la redirección
      
    } catch (err) {
      console.error('❌ Error en handleSubmit:', err);
      setError('Error de conexión. Verifica que el servidor esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* 🏢 Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">DepaManager</h1>
          <p className="text-gray-600 mt-2">Gestión inteligente de departamentos</p>
        </div>

        {/* 📋 Formulario de login */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Iniciar Sesión
          </h2>

          {/* ⚠️ Mensaje de error */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 📧 Campo de correo */}
            <div>
              <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <input
                id="correo"
                name="correo"
                type="email"
                value={formData.correo}
                onChange={handleChange}
                disabled={loading}
                required
                placeholder="tu@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* 🔒 Campo de contraseña */}
            <div>
              <label htmlFor="contrasenia" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                id="contrasenia"
                name="contrasenia"
                type="password"
                value={formData.contrasenia}
                onChange={handleChange}
                disabled={loading}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* 🔗 Link para recuperar contraseña (futuro) */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 text-gray-600">
                  Recordarme
                </label>
              </div>
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* 🚀 Botón de envío */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* 📝 Link para registrarse */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <Link to="/auth/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                Regístrate aquí
              </Link>
            </p>
          </div>

          {/* ℹ️ Información adicional */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              🔒 Conexión segura • Tus datos están protegidos
            </p>
          </div>
        </div>

        {/* 👥 Información de roles */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Acceso disponible para Administradores e Inquilinos
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
