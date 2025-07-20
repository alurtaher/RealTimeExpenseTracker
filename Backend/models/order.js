const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  order_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

User.hasMany(Order);
Order.belongsTo(User);

module.exports = Order;