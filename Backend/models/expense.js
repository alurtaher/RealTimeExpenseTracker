const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Expense = sequelize.define('expense', {
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

User.hasMany(Expense);
Expense.belongsTo(User);

module.exports = Expense;