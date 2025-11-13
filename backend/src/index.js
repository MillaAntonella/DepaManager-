// backend/src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');


const app = express();
const PORT = process.env.PORT || 3000;

// CORS para React
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log('🔍 Cargando rutas...');

// Rutas (SIN /api - como las tienes actualmente)
app.use('/auth', require('./routes/auth.routes'));
app.use('/admin', require('./routes/admin.routes'));
app.use('/tenant', require('./routes/tenant.routes'));

// Ruta de salud
app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ 
      success: true, 
      message: 'DepaManager API funcionando',
      database: 'Conectado',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error de base de datos',
      error: error.message
    });
  }
});

// Ruta de prueba raíz
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: '🚀 DepaManager Backend API',
    version: '1.0.0',
    endpoints: {
      auth: '/auth',
      admin: '/admin', 
      tenant: '/tenant',
      health: '/health'
    }
  });
});

// Manejo de errores 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.originalUrl}`
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('❌ Error no manejado:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

app.use('/tenant', require('./routes/tenant.routes'));
app.use('/admin', require('./routes/admin.routes'));

// Sincronización de base de datos
const startServer = async () => {
  try {
    console.log('🔍 Verificando conexión a base de datos...');
    
    await sequelize.authenticate();
    console.log('✅ Conexión a BD establecida correctamente');
    
    console.log('🔄 Creando tablas...');
    await sequelize.sync({ 
      force: false, 
      alter: false
    });
    
    console.log('✅ Tablas verificadas/creadas correctamente');
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`🌐 CORS: Habilitado para http://localhost:3001`);
      console.log(`📋 Endpoints disponibles:`);
      console.log(`   - http://localhost:${PORT}/`);
      console.log(`   - http://localhost:${PORT}/health`);
      console.log(`   - http://localhost:${PORT}/auth/login`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();