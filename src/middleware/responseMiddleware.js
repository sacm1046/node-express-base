const logger = require('../config/logger');

// Mensajes seguros y genéricos
const SECURE_MESSAGES = {
  SUCCESS: 'Operación completada exitosamente',
  ERROR: 'Ha ocurrido un error en la operación',
  NOT_FOUND: 'El recurso solicitado no está disponible',
  UNAUTHORIZED: 'Acceso no autorizado',
  FORBIDDEN: 'No tiene permisos para realizar esta acción',
  SERVER_ERROR: 'Error interno del servidor',
  VALIDATION_ERROR: 'Los datos proporcionados no son válidos',
  AUTH_ERROR: 'Error de autenticación',
  RATE_LIMIT: 'Demasiadas solicitudes, por favor intente más tarde',
  INVALID_TOKEN: 'Token de acceso inválido',
  EXPIRED_TOKEN: 'La sesión ha expirado',
  INVALID_CREDENTIALS: 'Credenciales inválidas'
};

// Códigos de error genéricos
const ERROR_CODES = {
  'ValidationError': 'VALIDATION_ERROR',
  'UnauthorizedError': 'AUTH_ERROR',
  'NotFoundError': 'NOT_FOUND',
  'ForbiddenError': 'FORBIDDEN',
  'RateLimitError': 'RATE_LIMIT',
  'default': 'GENERAL_ERROR'
};

// Función para sanitizar datos
const sanitizeData = (data) => {
  if (!data) return null;
  if (typeof data === 'object') {
    const sanitized = { ...data };
    delete sanitized.password;
    delete sanitized.token;
    delete sanitized.refreshToken;
    return sanitized;
  }
  return data;
};

// Función para sanitizar errores de validación
const sanitizeValidationErrors = (errors) => {
  if (!errors) return null;
  if (Array.isArray(errors)) {
    return errors.map(error => ({
      field: error.field || 'unknown',
      message: error.message || SECURE_MESSAGES.VALIDATION_ERROR
    }));
  }
  return Object.keys(errors).map(key => ({
    field: key,
    message: errors[key]
  }));
};

// Middleware para extender el objeto response
const responseMiddleware = (req, res, next) => {
  // Método para respuestas exitosas
  res.success = function(data, message = null, statusCode = 200) {
    const responseMessage = message || SECURE_MESSAGES.SUCCESS;
    logger.info(`Respuesta exitosa: ${responseMessage}`);
    return this.status(statusCode).json({
      success: true,
      message: responseMessage,
      data: sanitizeData(data)
    });
  };

  // Método para errores
  res.error = function(error, statusCode = 400) {
    logger.error(`Error en la respuesta: ${error.message}`);
    return this.status(statusCode).json({
      success: false,
      message: SECURE_MESSAGES.ERROR,
      code: ERROR_CODES[error.name] || ERROR_CODES.default
    });
  };

  // Método para recursos no encontrados
  res.notFound = function() {
    logger.warn(`Recurso no encontrado`);
    return this.status(404).json({
      success: false,
      message: SECURE_MESSAGES.NOT_FOUND
    });
  };

  // Método para no autorizado
  res.unauthorized = function(errorType = 'AUTH_ERROR') {
    logger.warn(`Acceso no autorizado: ${errorType}`);
    return this.status(401).json({
      success: false,
      message: SECURE_MESSAGES[errorType] || SECURE_MESSAGES.UNAUTHORIZED
    });
  };

  // Método para prohibido
  res.forbidden = function() {
    logger.warn(`Acceso prohibido`);
    return this.status(403).json({
      success: false,
      message: SECURE_MESSAGES.FORBIDDEN
    });
  };

  // Método para errores del servidor
  res.serverError = function(error) {
    logger.error(`Error del servidor: ${error.message}`);
    return this.status(500).json({
      success: false,
      message: SECURE_MESSAGES.SERVER_ERROR
    });
  };

  // Método para errores de validación
  res.validationError = function(errors) {
    logger.warn(`Error de validación`);
    return this.status(422).json({
      success: false,
      message: SECURE_MESSAGES.VALIDATION_ERROR,
      errors: sanitizeValidationErrors(errors)
    });
  };

  // Método para rate limit
  res.rateLimit = function() {
    logger.warn(`Límite de tasa excedido`);
    return this.status(429).json({
      success: false,
      message: SECURE_MESSAGES.RATE_LIMIT
    });
  };

  next();
};

module.exports = responseMiddleware; 