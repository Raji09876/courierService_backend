const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Location = require('./location');
const DeliveryBoy = require('./deliveryBoy');

const Order = sequelize.define(
  'Order',
  {
    order_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    distance: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    pickup_time: {
      type: DataTypes.DATE,
    },
    estimated_delivery_time: {
      type: DataTypes.INTEGER,
    },
    delivered_time: {
      type: DataTypes.DATE,
    },
    bonus_amount: {
      type: DataTypes.FLOAT,
    },
    salary: {
      type: DataTypes.FLOAT,
    },
  },
  {
    timestamps: false,
  }
);

Order.belongsTo(User, { foreignKey: 'user_id' });
Order.belongsTo(Location, { foreignKey: 'pickup_location_id', as: 'pickupLocation' });
Order.belongsTo(Location, { foreignKey: 'drop_location_id', as: 'dropLocation' });
Order.belongsTo(DeliveryBoy, { foreignKey: 'delivery_boy_id', as: 'deliveryBoy' });

module.exports = Order;