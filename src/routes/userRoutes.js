const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const passwordValidator = require('../middleware/passwordValidator');

// Rutas públicas
router.post('/register', passwordValidator, userController.createUser);
router.post('/login', userController.login);

// Rutas protegidas
router.get('/:id', authMiddleware, userController.getUser);
router.put('/:id', authMiddleware, passwordValidator, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);

module.exports = router; 