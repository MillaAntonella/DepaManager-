import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Lock,
  Camera,
  Save,
  X,
  Eye,
  EyeOff,
  Shield,
  Building
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

export default function AdminProfile() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Estados para estadísticas
  const [stats, setStats] = useState({
    totalDepartamentos: 12,  // ✅ Valor fijo temporal
    totalInquilinos: 2        // ✅ Valor fijo temporal
  });

  // Estado para información personal - usando datos reales del usuario
  const [profileData, setProfileData] = useState({
    nombre_completo: '',
    correo: '',
    telefono: '',
    dni: '',
    fecha_nacimiento: '',
    foto_perfil: null,
    rol: '',
    estado: '',
    plan: ''
  });

  // ✅ Cargar datos del usuario y estadísticas cuando el componente se monte
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        console.log('👤 Usuario del contexto:', user);

        // Cargar datos básicos del usuario desde el contexto
        setProfileData({
          nombre_completo: user.nombre || user.nombre_completo || '',
          correo: user.correo || user.email || '',
          telefono: user.telefono || '',
          dni: user.dni || '',
          fecha_nacimiento: user.fecha_nacimiento || '',
          foto_perfil: user.foto_perfil || null,
          rol: user.rol || 'Administrador',
          estado: user.estado || 'Activo',
          plan: user.plan || 'Gratuito'
        });

        // ✅ COMENTADO: Cargar estadísticas desde el backend (usar valores fijos por ahora)
        /*
        const token = localStorage.getItem('depamanager_token');
        
        console.log('🔍 Cargando estadísticas...');
        console.log('   Token:', token ? 'SÍ' : 'NO');

        try {
          // Obtener total de departamentos
          console.log('📊 Llamando a /api/departamentos...');
          const deptosResponse = await fetch('http://localhost:3000/api/departamentos', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          console.log('📊 Respuesta departamentos - Status:', deptosResponse.status);
          
          if (deptosResponse.ok) {
            const deptosData = await deptosResponse.json();
            console.log('📊 Datos departamentos recibidos:', deptosData);
            console.log('   Tipo:', typeof deptosData);
            console.log('   Es Array:', Array.isArray(deptosData));
            console.log('   Tiene data:', deptosData.data ? 'SÍ' : 'NO');
            console.log('   Tiene departamentos:', deptosData.departamentos ? 'SÍ' : 'NO');
            
            // Intentar diferentes formatos de respuesta
            let totalDeptos = 0;
            if (Array.isArray(deptosData)) {
              totalDeptos = deptosData.length;
            } else if (deptosData.data && Array.isArray(deptosData.data)) {
              totalDeptos = deptosData.data.length;
            } else if (deptosData.departamentos && Array.isArray(deptosData.departamentos)) {
              totalDeptos = deptosData.departamentos.length;
            } else if (typeof deptosData.total === 'number') {
              totalDeptos = deptosData.total;
            } else if (typeof deptosData.count === 'number') {
              totalDeptos = deptosData.count;
            }
            
            console.log('✅ Total departamentos calculado:', totalDeptos);
            
            // Actualizar estado con departamentos
            setStats(prev => ({ ...prev, totalDepartamentos: totalDeptos }));
          } else {
            console.error('❌ Error al obtener departamentos:', deptosResponse.status);
          }
        } catch (error) {
          console.error('❌ Error al cargar departamentos:', error);
        }

        try {
          // Obtener total de inquilinos
          console.log('👥 Llamando a /api/usuarios?rol=Inquilino...');
          const inquilinosResponse = await fetch('http://localhost:3000/api/usuarios?rol=Inquilino', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          console.log('👥 Respuesta inquilinos - Status:', inquilinosResponse.status);
          
          if (inquilinosResponse.ok) {
            const inquilinosData = await inquilinosResponse.json();
            console.log('👥 Datos inquilinos recibidos:', inquilinosData);
            console.log('   Tipo:', typeof inquilinosData);
            console.log('   Es Array:', Array.isArray(inquilinosData));
            console.log('   Tiene data:', inquilinosData.data ? 'SÍ' : 'NO');
            console.log('   Tiene usuarios:', inquilinosData.usuarios ? 'SÍ' : 'NO');
            
            // Intentar diferentes formatos de respuesta
            let totalInquilinos = 0;
            if (Array.isArray(inquilinosData)) {
              totalInquilinos = inquilinosData.length;
            } else if (inquilinosData.data && Array.isArray(inquilinosData.data)) {
              totalInquilinos = inquilinosData.data.length;
            } else if (inquilinosData.usuarios && Array.isArray(inquilinosData.usuarios)) {
              totalInquilinos = inquilinosData.usuarios.length;
            } else if (typeof inquilinosData.total === 'number') {
              totalInquilinos = inquilinosData.total;
            } else if (typeof inquilinosData.count === 'number') {
              totalInquilinos = inquilinosData.count;
            }
            
            console.log('✅ Total inquilinos calculado:', totalInquilinos);
            
            // Actualizar estado con inquilinos
            setStats(prev => ({ ...prev, totalInquilinos: totalInquilinos }));
          } else {
            console.error('❌ Error al obtener inquilinos:', inquilinosResponse.status);
          }
        } catch (error) {
          console.error('❌ Error al cargar inquilinos:', error);
        }

        console.log('✅ Estadísticas finales:', {
          totalDepartamentos: stats.totalDepartamentos,
          totalInquilinos: stats.totalInquilinos
        });
        */

      } catch (error) {
        console.error('❌ Error general al cargar datos:', error);
      } finally {
        setIsLoading(false);
        console.log('✅ Carga completada - isLoading = false');
      }
    };

    loadUserData();
  }, [user]);

  // Estado para cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Estado para configuración de notificaciones
  const [notificationSettings, setNotificationSettings] = useState({
    emailPagos: true,
    emailMantenimiento: true,
    emailNuevosInquilinos: true,
    pushPagos: true,
    pushMantenimiento: false,
    pushNuevosInquilinos: true
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationToggle = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('depamanager_token');
      
      const response = await fetch(`http://localhost:3000/api/usuarios/${user.id || user.id_usuario}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre_completo: profileData.nombre_completo,
          correo: profileData.correo,
          telefono: profileData.telefono,
          dni: profileData.dni,
          fecha_nacimiento: profileData.fecha_nacimiento
        })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        
        // Actualizar el contexto con los nuevos datos
        updateUser({
          nombre: profileData.nombre_completo,
          nombre_completo: profileData.nombre_completo,
          correo: profileData.correo,
          telefono: profileData.telefono,
          dni: profileData.dni,
          fecha_nacimiento: profileData.fecha_nacimiento
        });

        setIsEditing(false);
        alert('✅ Perfil actualizado exitosamente');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('❌ Error al guardar:', error);
      alert('❌ Error al actualizar el perfil: ' + error.message);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('❌ Las contraseñas no coinciden');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      alert('❌ La contraseña debe tener al menos 8 caracteres');
      return;
    }

    try {
      const token = localStorage.getItem('depamanager_token');
      
      const response = await fetch(`http://localhost:3000/api/usuarios/${user.id || user.id_usuario}/cambiar-contrasena`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          contrasenaActual: passwordData.currentPassword,
          contrasenaNueva: passwordData.newPassword
        })
      });

      if (response.ok) {
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        alert('✅ Contraseña actualizada exitosamente');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Error al cambiar la contraseña');
      }
    } catch (error) {
      console.error('❌ Error al cambiar contraseña:', error);
      alert('❌ Error al cambiar la contraseña: ' + error.message);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({
          ...prev,
          foto_perfil: reader.result
        }));
        // TODO: Subir imagen al servidor
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'AD';
    const names = name.trim().split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getPlanBadge = (plan) => {
    const styles = {
      'Gratuito': 'bg-gray-100 text-gray-700',
      'Estándar': 'bg-blue-100 text-blue-700',
      'Premium': 'bg-purple-100 text-purple-700'
    };
    return styles[plan] || styles['Gratuito'];
  };

  // Mostrar loading mientras se cargan los datos
  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
        <p className="text-gray-600">Gestiona tu información personal y configuración</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar - Tarjeta de Perfil */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                {profileData.foto_perfil ? (
                  <img
                    src={profileData.foto_perfil}
                    alt="Avatar"
                    className="w-32 h-32 rounded-full object-cover border-4 border-emerald-100"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-3xl border-4 border-emerald-100">
                    {getInitials(profileData.nombre_completo)}
                  </div>
                )}
                
                {/* Botón para cambiar foto */}
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors"
                >
                  <Camera className="w-5 h-5" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mt-4 text-center">
                {profileData.nombre_completo || 'Administrador'}
              </h3>
              <p className="text-sm text-gray-600">{profileData.rol}</p>
              
              {/* Badges */}
              <div className="flex gap-2 mt-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                  {profileData.rol}
                </span>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getPlanBadge(profileData.plan)}`}>
                  {profileData.plan}
                </span>
              </div>
            </div>

            {/* Información Rápida */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                <span className="truncate">{profileData.correo || 'No especificado'}</span>
              </div>
              {profileData.telefono && (
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                  {profileData.telefono}
                </div>
              )}
              {profileData.dni && (
                <div className="flex items-center text-sm text-gray-600">
                  <User className="w-4 h-4 mr-2 text-gray-400" />
                  DNI: {profileData.dni}
                </div>
              )}
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">
                  {stats.totalDepartamentos}
                </p>
                <p className="text-xs text-gray-600">Departamentos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {stats.totalInquilinos}
                </p>
                <p className="text-xs text-gray-600">Inquilinos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('personal')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'personal'
                    ? 'border-b-2 border-emerald-500 text-emerald-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <User className="w-4 h-4 inline mr-2" />
                Información Personal
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'security'
                    ? 'border-b-2 border-emerald-500 text-emerald-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Lock className="w-4 h-4 inline mr-2" />
                Seguridad
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'notifications'
                    ? 'border-b-2 border-emerald-500 text-emerald-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Shield className="w-4 h-4 inline mr-2" />
                Notificaciones
              </button>
            </div>
          </div>

          {/* Contenido de las Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* TAB: Información Personal */}
            {activeTab === 'personal' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Información Personal</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Editar Perfil
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          // Revertir cambios
                          if (user) {
                            setProfileData({
                              nombre_completo: user.nombre || user.nombre_completo || '',
                              correo: user.correo || user.email || '',
                              telefono: user.telefono || '',
                              dni: user.dni || '',
                              fecha_nacimiento: user.fecha_nacimiento || '',
                              foto_perfil: user.foto_perfil || null,
                              rol: user.rol || 'Administrador',
                              estado: user.estado || 'Activo',
                              plan: user.plan || 'Gratuito'
                            });
                          }
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Guardar
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nombre Completo */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      name="nombre_completo"
                      value={profileData.nombre_completo}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2 border rounded-lg ${
                        isEditing
                          ? 'border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
                          : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      }`}
                    />
                  </div>

                  {/* DNI */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      DNI
                    </label>
                    <input
                      type="text"
                      name="dni"
                      value={profileData.dni}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      maxLength="20"
                      className={`w-full px-4 py-2 border rounded-lg ${
                        isEditing
                          ? 'border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
                          : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      }`}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      name="correo"
                      value={profileData.correo}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2 border rounded-lg ${
                        isEditing
                          ? 'border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
                          : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      }`}
                    />
                  </div>

                  {/* Teléfono */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={profileData.telefono}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      maxLength="20"
                      className={`w-full px-4 py-2 border rounded-lg ${
                        isEditing
                          ? 'border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
                          : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      }`}
                    />
                  </div>

                  {/* Fecha de Nacimiento */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Nacimiento
                    </label>
                    <input
                      type="date"
                      name="fecha_nacimiento"
                      value={profileData.fecha_nacimiento}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2 border rounded-lg ${
                        isEditing
                          ? 'border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
                          : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      }`}
                    />
                  </div>

                  {/* Rol (Solo lectura) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rol
                    </label>
                    <input
                      type="text"
                      value={profileData.rol}
                      disabled
                      className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg cursor-not-allowed"
                    />
                  </div>

                  {/* Estado (Solo lectura) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado
                    </label>
                    <input
                      type="text"
                      value={profileData.estado}
                      disabled
                      className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg cursor-not-allowed"
                    />
                  </div>

                  {/* Plan (Solo lectura) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plan
                    </label>
                    <input
                      type="text"
                      value={profileData.plan}
                      disabled
                      className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Seguridad */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Cambiar Contraseña</h2>
                
                <form onSubmit={handleChangePassword} className="space-y-6">
                  {/* Contraseña Actual */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña Actual
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="Ingresa tu contraseña actual"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Nueva Contraseña */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nueva Contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength="8"
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="Mínimo 8 caracteres"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirmar Contraseña */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Nueva Contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength="8"
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="Repite la nueva contraseña"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Requisitos de Contraseña */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800 font-medium mb-2">Requisitos de la contraseña:</p>
                    <ul className="text-sm text-blue-700 space-y-1 ml-4 list-disc">
                      <li>Mínimo 8 caracteres</li>
                      <li>Al menos una letra mayúscula</li>
                      <li>Al menos un número</li>
                      <li>Al menos un carácter especial (@, #, $, etc.)</li>
                    </ul>
                  </div>

                  <button
                    type="submit"
                    className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                  >
                    Actualizar Contraseña
                  </button>
                </form>

                {/* Sesiones Activas */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Sesiones Activas</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                          <Building className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Windows - Chrome</p>
                          <p className="text-xs text-gray-600">Lima, Perú • Sesión actual</p>
                        </div>
                      </div>
                      <span className="text-xs text-emerald-600 font-medium">Activo</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Notificaciones */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Preferencias de Notificaciones</h2>
                
                <div className="space-y-6">
                  {/* Notificaciones por Email */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Notificaciones por Email</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Pagos</p>
                          <p className="text-sm text-gray-600">Recibe notificaciones sobre pagos pendientes y realizados</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.emailPagos}
                            onChange={() => handleNotificationToggle('emailPagos')}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Mantenimiento</p>
                          <p className="text-sm text-gray-600">Notificaciones de incidencias y mantenimientos</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.emailMantenimiento}
                            onChange={() => handleNotificationToggle('emailMantenimiento')}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Nuevos Inquilinos</p>
                          <p className="text-sm text-gray-600">Alertas cuando se registran nuevos inquilinos</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.emailNuevosInquilinos}
                            onChange={() => handleNotificationToggle('emailNuevosInquilinos')}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Notificaciones Push */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Notificaciones Push</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Pagos</p>
                          <p className="text-sm text-gray-600">Notificaciones instantáneas sobre pagos</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.pushPagos}
                            onChange={() => handleNotificationToggle('pushPagos')}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Mantenimiento</p>
                          <p className="text-sm text-gray-600">Alertas inmediatas de incidencias</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.pushMantenimiento}
                            onChange={() => handleNotificationToggle('pushMantenimiento')}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Nuevos Inquilinos</p>
                          <p className="text-sm text-gray-600">Notificaciones de nuevos registros</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.pushNuevosInquilinos}
                            onChange={() => handleNotificationToggle('pushNuevosInquilinos')}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => alert('Preferencias guardadas')}
                    className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                  >
                    Guardar Preferencias
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}