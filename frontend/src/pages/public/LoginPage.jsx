// frontend/src/pages/public/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  // Redirigir si ya está autenticado
  useEffect(() => {
    console.log('🔍 LoginPage - Estado:', { isAuthenticated, user: user?.correo });
    
    if (isAuthenticated && user) {
      console.log('✅ Usuario autenticado, redirigiendo a /admin');
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('📤 Enviando credenciales...');
      const result = await login({ 
        correo: email, 
        contrasenia: password 
      });

      console.log('📋 Resultado del login:', result);

      if (result.success) {
        console.log('✅ Login exitoso, el useEffect se encargará de la redirección');
        // La redirección se maneja en el useEffect automáticamente
      } else {
        setError(result.error || 'Error en el login');
      }
    } catch (err) {
      console.error('💥 Error inesperado:', err);
      setError('Error inesperado. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Si ya está autenticado, mostrar loading
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Redirigiendo al panel de administración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* COLUMNA IZQUIERDA - FORMULARIO */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-8 py-12">
        <div className="w-full max-w-md">
          {/* Encabezado */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Bienvenid@ de nuevo!
            </h1>
            <p className="text-slate-600 text-sm">
              Acceso exclusivo para administradores
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Campo Correo */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Correo*
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-5 py-3 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="tu@email.com"
              />
            </div>

            {/* Campo Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Contraseña*
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-5 py-3 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            {/* Botón de Ingresar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold py-3 px-6 rounded-full hover:from-emerald-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                  Ingresando...
                </>
              ) : (
                'Ingresar'
              )}
            </button>
          </form>

          {/* Botón volver */}
          <button
            onClick={() => navigate('/')}
            className="mt-6 text-sm text-slate-500 hover:text-slate-700 flex items-center justify-center w-full"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al inicio
          </button>
        </div>
      </div>

      {/* COLUMNA DERECHA - ILUSTRACIÓN */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 items-center justify-center p-12">
        <div className="text-center text-white">
          <p className="text-4xl font-bold mb-4">DepaManager</p>
          <p className="text-emerald-100 text-lg">Gestión Inteligente de Propiedades</p>
        </div>
      </div>
    </div>
  );
}