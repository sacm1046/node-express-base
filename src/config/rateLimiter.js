const rateLimit = require('express-rate-limit');
const logger = require('./logger');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 solicitudes por IP en la ventana de tiempo
  message: {
    error: 'Demasiadas solicitudes desde esta IP, por favor intente nuevamente más tarde'
  },
  standardHeaders: true, // Retorna información de límite en los headers
  legacyHeaders: false, // Desactiva los headers legacy
  handler: (req, res) => {
    logger.warn(`Rate limit excedido para IP: ${req.ip}`);
    res.status(429).json({
      error: 'Demasiadas solicitudes desde esta IP, por favor intente nuevamente más tarde'
    });
  }
});

module.exports = limiter; 