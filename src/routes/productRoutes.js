const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authenticate');

// Rutas públicas
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.get('/:id/status', productController.getProductStatus);

// Rutas protegidas
router.post('/', authMiddleware, productController.createProduct);
router.put('/:id', authMiddleware, productController.updateProduct);
router.delete('/:id', authMiddleware, productController.deleteProduct);

module.exports = router; 