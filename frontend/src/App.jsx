// frontend/src/App.jsx
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AppRouter from './router/AppRouter'; // ✅ Usar AppRouter que tiene TODAS las rutas
import './styles/globals.css';

/**
 * 🎯 COMPONENTE PRINCIPAL DE LA APLICACIÓN
 * Configura el contexto de autenticación y el sistema de rutas
 */
function App() {
  console.log('🚀 App.jsx - Iniciando aplicación');
  
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          {/* ✅ AppRouter maneja TODAS las rutas (admin, tenant, públicas) */}
          <AppRouter />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;