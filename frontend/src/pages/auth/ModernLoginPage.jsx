// frontend/src/pages/auth/ModernLoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * 🎨 MODERN LOGIN PAGE
 * Página de login con diseño moderno y minimalista
 * Funciona para Administradores e Inquilinos
 */
const ModernLoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  // ✅ Estados del formulario
  const [formData, setFormData] = useState({
    correo: '',
    contrasenia: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ Redirigir si ya está autenticado
  useEffect(() => {
    console.log('🔍 ModernLoginPage - Verificando autenticación previa');
    
    if (isAuthenticated && user) {
      console.log('✅ Usuario ya autenticado, redirigiendo según rol');
      
      if (user.rol === 'Administrador') {
        navigate('/admin/dashboard', { replace: true });
      } else if (user.rol === 'Inquilino') {
        navigate('/tenant/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  /**
   * 📝 Maneja cambios en los inputs
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error al escribir
    if (error) setError('');
  };

  /**
   * 🚀 Maneja el envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validar campos vacíos
    if (!formData.correo || !formData.contrasenia) {
      setError('Por favor completa todos los campos');
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
      setError('Por favor ingresa un correo válido');
      return;
    }

    setLoading(true);

    try {
      console.log('🔐 ModernLoginPage - Iniciando login...');
      console.log('📧 Correo:', formData.correo);

      // ✅ Llamar a la función login del contexto
      const result = await login(formData.correo, formData.contrasenia);

      console.log('📋 Resultado del login:', result);

      if (result.success) {
        console.log('✅ Login exitoso');
        console.log('🎭 Rol:', result.user?.rol);

        // ✅ Esperar un momento y redirigir
        setTimeout(() => {
          if (result.user.rol === 'Administrador') {
            console.log('🔀 Redirigiendo a /admin/dashboard');
            window.location.href = '/admin/dashboard';
          } else if (result.user.rol === 'Inquilino') {
            console.log('🔀 Redirigiendo a /tenant/dashboard');
            window.location.href = '/tenant/dashboard';
          }
        }, 200);
      } else {
        setError(result.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      console.error('❌ Error en login:', err);
      setError('Error de conexión. Verifica que el servidor esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 🏢 Logo y Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-600 to-emerald-600 rounded-2xl mb-4 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            DepaManager
          </h1>
          <p className="text-gray-600">Gestión inteligente de departamentos</p>
        </div>

        {/* 📋 Card del Formulario */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Bienvenido 👋
            </h2>
            <p className="text-gray-600 text-sm">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          {/* ⚠️ Mensaje de error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* 📝 Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 📧 Campo de correo */}
            <div>
              <label htmlFor="correo" className="block text-sm font-semibold text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="correo"
                  name="correo"
                  type="email"
                  value={formData.correo}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  placeholder="tu@email.com"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            {/* 🔒 Campo de contraseña */}
            <div>
              <label htmlFor="contrasenia" className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="contrasenia"
                  name="contrasenia"
                  type="password"
                  value={formData.contrasenia}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed text-gray-900"
                />
              </div>
            </div>

            {/* 🔗 Recordar y olvidé contraseña */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                />
                <span className="ml-2 text-gray-600">Recordarme</span>
              </label>
              <a href="#" className="text-teal-600 hover:text-teal-700 font-semibold">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* 🚀 Botón de envío */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
                <>
                  Iniciar Sesión
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* 📝 Link para registrarse */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <a href="/admin/register" className="text-teal-600 hover:text-teal-700 font-semibold">
                Regístrate aquí
              </a>
            </p>
          </div>
        </div>

        {/* ℹ️ Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 flex items-center justify-center">
            <svg className="w-4 h-4 mr-1 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Conexión segura • Tus datos están protegidos
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Acceso disponible para Administradores e Inquilinos
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModernLoginPage;
