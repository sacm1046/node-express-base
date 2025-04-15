const { User } = require('../models');
const { validateUser } = require('../validators/userValidator');
const { hashPassword, comparePassword } = require('../utils/auth');
const { generateToken } = require('../utils/jwt');
const logger = require('../config/logger');

class UserController {
  async createUser(req, res) {
    try {
      const { error } = validateUser(req.body);
      if (error) return res.validationError(error.details);

      const { email, password } = req.body;
      
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.error('El usuario ya existe', 409);
      }

      const hashedPassword = await hashPassword(password);
      const user = await User.create({
        email,
        password: hashedPassword
      });

      const token = generateToken(user);
      return res.success({ user, token });
    } catch (error) {
      logger.error('Error en registro:', error);
      return res.serverError(error);
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.unauthorized('Credenciales inválidas');
      }

      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        return res.unauthorized('Credenciales inválidas');
      }

      const token = generateToken(user);
      return res.success({ user, token });
    } catch (error) {
      logger.error('Error en login:', error);
      return res.serverError(error);
    }
  }

  async getUser(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] }
      });
      
      if (!user) {
        return res.notFound('Usuario no encontrado');
      }

      return res.success({ user });
    } catch (error) {
      logger.error('Error al obtener perfil:', error);
      return res.serverError(error);
    }
  }

  async updateUser(req, res) {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.notFound('Usuario no encontrado');
      }

      const { email, password } = req.body;
      if (email) {
        user.email = email;
      }
      if (password) {
        const hashedPassword = await hashPassword(password);
        user.password = hashedPassword;
      }

      await user.save();
      return res.success(user, 'Usuario actualizado exitosamente');
    } catch (error) {
      return res.serverError(error);
    }
  }

  async deleteUser(req, res) {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.notFound('Usuario no encontrado');
      }

      await user.destroy();
      return res.success(null, 'Usuario eliminado exitosamente');
    } catch (error) {
      return res.serverError(error);
    }
  }
}

module.exports = new UserController(); 