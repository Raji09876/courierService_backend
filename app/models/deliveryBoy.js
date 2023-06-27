const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DeliveryBoy = sequelize.define(
  'DeliveryBoy',
  {
    delivery_boy_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    availability: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = DeliveryBoy;