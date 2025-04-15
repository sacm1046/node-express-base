const Joi = require('joi');

const userSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'El email debe ser válido',
      'any.required': 'El email es requerido'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'La contraseña debe tener al menos 6 caracteres',
      'any.required': 'La contraseña es requerida'
    }),
  name: Joi.string()
    .optional()
    .allow('')
    .messages({
      'string.base': 'El nombre debe ser texto'
    })
});

const validateUser = (data) => {
  return userSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true
  });
};

module.exports = {
  validateUser
}; 