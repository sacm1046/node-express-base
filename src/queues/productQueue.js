const Queue = require('bull');
const Product = require('../models/Product');
const logger = require('../config/logger');

const productQueue = new Queue('product-queue', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  }
});

// Procesar la creación de productos
productQueue.process('create-product', async (job) => {
  try {
    const { productData } = job.data;
    
    // Actualizar el estado a processing
    await Product.update(
      { status: 'processing' },
      { where: { id: productData.id } }
    );

    // Simular un procesamiento largo
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Actualizar el estado a completed
    await Product.update(
      { status: 'completed' },
      { where: { id: productData.id } }
    );

    logger.info(`Producto ${productData.id} procesado exitosamente`);
    return { success: true };
  } catch (error) {
    logger.error(`Error procesando producto: ${error.message}`);
    
    // Actualizar el estado a failed
    await Product.update(
      { status: 'failed' },
      { where: { id: job.data.productData.id } }
    );

    throw error;
  }
});

// Manejar errores de la cola
productQueue.on('failed', (job, error) => {
  logger.error(`Job ${job.id} falló: ${error.message}`);
});

module.exports = productQueue; 