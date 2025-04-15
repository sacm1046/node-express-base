const User = require('../models/User');
const logger = require('../config/logger');

class UserService {
  async createUser(userData) {
    try {
      const user = await User.create(userData);
      logger.info(`Usuario creado: ${user.email}`);
      return user;
    } catch (error) {
      logger.error('Error al crear usuario:', error);
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