const Order = require('../models/order');
const DeliveryBoy = require('../models/deliveryBoy');
const moment = require('moment');

// Create an order
exports.createOrder = async (req, res) => {
  try {
    const { user_id, pickup_location_id, drop_location_id, price, distance } = req.body;
    const order = await Order.create({ user_id, pickup_location_id, drop_location_id, price, distance });
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Assign an order to a delivery boy
exports.assignOrderToDeliveryBoy = async (req, res) => {
  try {
    const { order_id, delivery_boy_id } = req.body;
    const deliveryBoy = await DeliveryBoy.findByPk(delivery_boy_id);
    if (!deliveryBoy) {
      return res.status(404).json({ message: 'Delivery boy not found' });
    }
    if (!deliveryBoy.availability) {
      return res.status(400).json({ message: 'Delivery boy is not available' });
    }
    const order = await Order.findByPk(order_id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.delivery_boy_id) {
      return res.status(400).json({ message: 'Order is already assigned to a delivery boy' });
    }
    order.delivery_boy_id = delivery_boy_id;
    await order.save();
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update the pickup status of an order
exports.updatePickupStatus = async (req, res) => {
  try {
    const { order_id } = req.params;
    const order = await Order.findByPk(order_id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (!order.delivery_boy_id) {
      return res.status(400).json({ message: 'Order is not assigned to a delivery boy' });
    }
    order.status = 'in progress';
    order.pickup_time = moment().toISOString();
    await order.save();
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update the delivery status of an order
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { delivered_time, bonus_amount, salary } = req.body;
    const order = await Order.findByPk(order_id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (!order.delivery_boy_id) {
      return res.status(400).json({ message: 'Order is not assigned to a delivery boy' });
    }
    order.status = 'delivered';
    order.delivered_time = delivered_time;
    order.bonus_amount = bonus_amount;
    order.salary = salary;
    await order.save();
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
