// backend/src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Acceso denegado. No se proporcionó token.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    console.log('🔍 Token decodificado:', decoded);
    
    // ✅ Buscar usuario con todos los campos necesarios
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['contrasenia'] }
    });
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token inválido. Usuario no encontrado.' 
      });
    }

    console.log('✅ Usuario autenticado:', user.correo);
    console.log('🔍 Campos del usuario:', {
      id: user.idUsuario,
      idUsuario: user.idUsuario,
      correo: user.correo,
      rol: user.rol
    });

    // ✅ Asegurar que req.user tenga los campos correctos
    req.user = {
      id: user.idUsuario,
      idUsuario: user.idUsuario,
      correo: user.correo,
      rol: user.rol,
      nombreCompleto: user.nombreCompleto
    };

    next();
    
  } catch (error) {
    console.error('❌ Error en verifyToken:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token inválido.' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expirado.' 
      });
    }

    return res.status(500).json({ 
      success: false, 
      message: 'Error del servidor en autenticación.' 
    });
  }
};

const verifyAdmin = (req, res, next) => {
  if (req.user.rol !== 'Administrador') {
    return res.status(403).json({ 
      success: false, 
      message: 'Acceso denegado. Se requieren privilegios de administrador.' 
    });
  }
  next();
};

const verifyTenant = (req, res, next) => {
  if (req.user.rol !== 'Inquilino') {
    return res.status(403).json({ 
      success: false, 
      message: 'Acceso denegado. Se requieren privilegios de inquilino.' 
    });
  }
  next();
};

module.exports = {
  verifyToken,
  verifyAdmin,
  verifyTenant
};