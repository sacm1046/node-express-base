const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');
const passwordValidator = require('../middleware/passwordValidator');

// Rutas públicas
router.post('/register', passwordValidator, userController.createUser);
router.post('/login', userController.login);

// Rutas protegidas
router.get('/:id', authenticate, userController.getUser);
router.put('/:id', authenticate, passwordValidator, userController.updateUser);
router.delete('/:id', authenticate, userController.deleteUser);

module.exports = router; 