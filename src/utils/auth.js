const bcrypt = require('bcrypt');
const logger = require('../config/logger');

const SALT_ROUNDS = 10;

const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    logger.error('Error hashing password:', error);
    throw new Error('Error al encriptar la contraseña');
  }
};

const comparePassword = async (password, hash) => {
  try {
    const match = await bcrypt.compare(password, hash);
    return match;
  } catch (error) {
    logger.error('Error comparing passwords:', error);
    throw new Error('Error al comparar contraseñas');
  }
};

module.exports = {
  hashPassword,
  comparePassword
}; 