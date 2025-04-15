const { Product } = require('../models');
const productQueue = require('../queues/productQueue');
const logger = require('../config/logger');

class ProductService {
  async createProduct(productData) {
    try {
      const product = await Product.create(productData);
      
      // Agregar a la cola para procesamiento
      await productQueue.add('create-product', {
        productData: product.toJSON()
      });

      return product;
    } catch (error) {
      logger.error('Error en servicio creando producto:', error);
      throw error;
    }
  }

  async getProducts() {
    try {
      return await Product.findAll();
    } catch (error) {
      logger.error('Error en servicio obteniendo productos:', error);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const product = await Product.findByPk(id);
      if (!product) {
        throw new Error('Producto no encontrado');
      }
      return product;
    } catch (error) {
      logger.error('Error en servicio obteniendo producto:', error);
      throw error;
    }
  }

  async updateProduct(id, productData) {
    try {
      const product = await Product.findByPk(id);
      if (!product) {
        throw new Error('Producto no encontrado');
      }

      await product.update(productData);
      return product;
    } catch (error) {
      logger.error('Error en servicio actualizando producto:', error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const product = await Product.findByPk(id);
      if (!product) {
        throw new Error('Producto no encontrado');
      }

      await product.destroy();
      return true;
    } catch (error) {
      logger.error('Error en servicio eliminando producto:', error);
      throw error;
    }
  }

  async getProductStatus(id) {
    try {
      const product = await Product.findByPk(id);
      if (!product) {
        throw new Error('Producto no encontrado');
      }
      return product.status;
    } catch (error) {
      logger.error('Error en servicio obteniendo estado del producto:', error);
      throw error;
    }
  }
}

module.exports = new ProductService(); 