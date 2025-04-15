const passwordValidator = (req, res, next) => {
  const password = req.body.password;
  
  if (!password) {
    return res.status(400).json({ error: 'La contraseña es requerida' });
  }

  // Mínimo 8 caracteres
  if (password.length < 8) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
  }

  // Al menos una letra mayúscula
  if (!/[A-Z]/.test(password)) {
    return res.status(400).json({ error: 'La contraseña debe contener al menos una letra mayúscula' });
  }

  // Al menos una letra minúscula
  if (!/[a-z]/.test(password)) {
    return res.status(400).json({ error: 'La contraseña debe contener al menos una letra minúscula' });
  }

  // Al menos un número
  if (!/[0-9]/.test(password)) {
    return res.status(400).json({ error: 'La contraseña debe contener al menos un número' });
  }

  // Al menos un carácter especial
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return res.status(400).json({ error: 'La contraseña debe contener al menos un carácter especial' });
  }

  next();
};

module.exports = passwordValidator; 