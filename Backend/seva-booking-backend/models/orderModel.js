const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // adjust if your db instance is in a different path

const Order = sequelize.define('orders', {
  order_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  items: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  address: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  amounttopay: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  paymentid: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false,
  tableName: 'orders', // match your actual table name
});

module.exports = Order;
