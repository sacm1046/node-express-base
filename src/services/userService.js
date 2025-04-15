const User = require('../models');
const logger = require('../config/logger');
const bcrypt = require('bcrypt');
const { generateToken } = require('../config/jwt');

class UserService {
  async createUser(userData) {
    try {
      // Encriptar contraseña
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await User.create({
        ...userData,
        password: hashedPassword
      });
      logger.info(`Usuario creado: ${user.email}`);
      return user;
    } catch (error) {
      logger.error('Error al crear usuario:', error);
      throw error;
    }
  }

  async login(email, password) {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Contraseña incorrecta');
      }

      const token = generateToken(user);
      return { user, token };
    } catch (error) {
      logger.error('Error en login:', error);
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      return user;
    } catch (error) {
      logger.error(`Error al obtener usuario con ID ${id}:`, error);
      throw error;
    }
  }

  async updateUser(id, userData) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
      }

      await user.update(userData);
      logger.info(`Usuario actualizado: ${user.email}`);
      return user;
    } catch (error) {
      logger.error(`Error al actualizar usuario con ID ${id}:`, error);
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      await user.destroy();
      logger.info(`Usuario eliminado con ID: ${id}`);
      return true;
    } catch (error) {
      logger.error(`Error al eliminar usuario con ID ${id}:`, error);
      throw error;
    }
  }
}

module.exports = new UserService(); 