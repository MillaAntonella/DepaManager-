// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import TenantLoginPage from './pages/public/TenantLoginPage';
import RegisterPage from './pages/public/RegisterPage';
import { AuthProvider } from './contexts/AuthContext';
import AdminRoutes from './router/AdminRoutes';
import './styles/globals.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Ruta principal - Landing Page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Rutas públicas de autenticación */}
            <Route path="/admin/auth" element={<LoginPage />} />
            <Route path="/admin/register" element={<RegisterPage />} />
            <Route path="/tenant/login" element={<TenantLoginPage />} />
            
            {/* Rutas protegidas - Admin */}
            <Route path="/admin/*" element={<AdminRoutes />} />
            
            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;