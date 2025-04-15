const User = require('./User');
const Product = require('./Product');

// Relaciones entre modelos
// User.hasMany(Product, { foreignKey: 'userId' });
// Product.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  User,
  Product
}; 