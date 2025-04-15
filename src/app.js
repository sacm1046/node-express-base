const express = require('express');
const morgan = require('morgan');
const logger = require('./config/logger');
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const {
  corsOptions,
  limiter,
  speedLimiter,
  helmetConfig,
  sanitizeInput,
  validateContentType
} = require('./middleware/security');

const app = express();

// Middleware de seguridad
app.use(helmetConfig);
app.use(require('cors')(corsOptions));
app.use(limiter);
app.use(speedLimiter);
app.use(sanitizeInput);
app.use(validateContentType);

// Middleware básico
app.use(express.json());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Rutas
app.use('/api/users', userRoutes);

// Rutas básicas
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a la API' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

// Sincronizar base de datos y levantar servidor
const PORT = process.env.PORT || 3000;

// Solo sincronizar la base de datos si no estamos en Vercel
if (process.env.NODE_ENV !== 'production') {
  sequelize.sync()
    .then(() => {
      app.listen(PORT, () => {
        logger.info(`Servidor corriendo en puerto ${PORT}`);
      });
    })
    .catch(err => {
      logger.error('Error al conectar con la base de datos:', err);
    });
} else {
  // En producción (Vercel), solo exportamos la app
  module.exports = app;
} 