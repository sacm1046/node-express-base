const productService = require('../services/productService');
const logger = require('../config/logger');

class ProductController {
  async createProduct(req, res) {
    try {
      const product = await productService.createProduct(req.body);
      return res.success(product, 'Producto creado y en proceso de validación');
    } catch (error) {
      logger.error('Error creando producto:', error);
      return res.serverError(error);
    }
  }

  async getProducts(req, res) {
    try {
      const products = await productService.getProducts();
      return res.success(products);
    } catch (error) {
      logger.error('Error obteniendo productos:', error);
      return res.serverError(error);
    }
  }

  async getProductById(req, res) {
    try {
      const product = await productService.getProductById(req.params.id);
      return res.success(product);
    } catch (error) {
      if (error.message === 'Producto no encontrado') {
        return res.notFound(error.message);
      }
      logger.error('Error obteniendo producto:', error);
      return res.serverError(error);
    }
  }

  async updateProduct(req, res) {
    try {
      const product = await productService.updateProduct(req.params.id, req.body);
      return res.success(product, 'Producto actualizado exitosamente');
    } catch (error) {
      if (error.message === 'Producto no encontrado') {
        return res.notFound(error.message);
      }
      logger.error('Error actualizando producto:', error);
      return res.serverError(error);
    }
  }

  async deleteProduct(req, res) {
    try {
      await productService.deleteProduct(req.params.id);
      return res.success(null, 'Producto eliminado exitosamente');
    } catch (error) {
      if (error.message === 'Producto no encontrado') {
        return res.notFound(error.message);
      }
      logger.error('Error eliminando producto:', error);
      return res.serverError(error);
    }
  }

  async getProductStatus(req, res) {
    try {
      const status = await productService.getProductStatus(req.params.id);
      return res.success({ status });
    } catch (error) {
      if (error.message === 'Producto no encontrado') {
        return res.notFound(error.message);
      }
      logger.error('Error obteniendo estado del producto:', error);
      return res.serverError(error);
    }
  }
}

module.exports = new ProductController(); 