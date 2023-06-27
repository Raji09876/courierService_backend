const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Role = require('./role');

const User = sequelize.define(
  'User',
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: /^\d{10}$/i,
      },
    },
  },
  {
    timestamps: false,
  }
);

User.belongsTo(Role, { foreignKey: 'role_id' });

module.exports = User;