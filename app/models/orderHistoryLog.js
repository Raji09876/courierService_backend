const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Order = require('./order');
const User = require('./user');

const OrderHistoryLog = sequelize.define(
  'OrderHistoryLog',
  {
    log_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    timestamps: false,
  }
);

OrderHistoryLog.belongsTo(Order, { foreignKey: 'order_id' });
OrderHistoryLog.belongsTo(User, { foreignKey: 'user_id' });
OrderHistoryLog.belongsTo(User, { foreignKey: 'clerk_id' });

module.exports = OrderHistoryLog;