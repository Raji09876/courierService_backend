const OrderHistoryLog = require('../models/orderHistoryLog');

// Create an order history log
exports.createOrderHistoryLog = async (req, res) => {
  try {
    const { order_id, user_id, clerk_id } = req.body;
    const orderHistoryLog = await OrderHistoryLog.create({ order_id, user_id, clerk_id });
    res.status(201).json(orderHistoryLog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get an order history log by log_id
exports.getOrderHistoryLog = async (req, res) => {
  try {
    const { log_id } = req.params;
    const orderHistoryLog = await OrderHistoryLog.findByPk(log_id);
    if (!orderHistoryLog) {
      return res.status(404).json({ message: 'Order history log not found' });
    }
    res.status(200).json(orderHistoryLog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};