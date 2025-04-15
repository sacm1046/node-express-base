const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.unauthorized('No se proporcionó token de autenticación');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.unauthorized('Formato de token inválido');
    }
    return res.unauthorized('Token inválido o expirado');
  }
};

module.exports = authMiddleware; 