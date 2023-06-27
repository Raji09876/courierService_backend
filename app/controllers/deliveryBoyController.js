const DeliveryBoy = require('../models/deliveryBoy');

// Create a delivery boy
exports.createDeliveryBoy = async (req, res) => {
  try {
    const { name } = req.body;
    const deliveryBoy = await DeliveryBoy.create({ name });
    res.status(201).json(deliveryBoy);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a delivery boy by delivery_boy_id
exports.getDeliveryBoy = async (req, res) => {
  try {
    const { delivery_boy_id } = req.params;
    const deliveryBoy = await DeliveryBoy.findByPk(delivery_boy_id);
    if (!deliveryBoy) {
      return res.status(404).json({ message: 'Delivery boy not found' });
    }
    res.status(200).json(deliveryBoy);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a delivery boy by delivery_boy_id
exports.updateDeliveryBoy = async (req, res) => {
  try {
    const { delivery_boy_id } = req.params;
    const { name, availability } = req.body;
    const deliveryBoy = await DeliveryBoy.findByPk(delivery_boy_id);
    if (!deliveryBoy) {
      return res.status(404).json({ message: 'Delivery boy not found' });
    }
    deliveryBoy.name = name;
    deliveryBoy.availability = availability;
    await deliveryBoy.save();
    res.status(200).json(deliveryBoy);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a delivery boy by delivery_boy_id
exports.deleteDeliveryBoy = async (req, res) => {
  try {
    const { delivery_boy_id } = req.params;
    const deliveryBoy = await DeliveryBoy.findByPk(delivery_boy_id);
    if (!deliveryBoy) {
      return res.status(404).json({ message: 'Delivery boy not found' });
    }
    await deliveryBoy.destroy();
    res.status(204).json();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};