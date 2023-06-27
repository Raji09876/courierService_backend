const User = require('../models/User');
const Role = require('../models/Role');

// Create a user
exports.createUser = async (req, res) => {
  try {
    const { username, password, role_name, name, email, phone } = req.body;
    const role = await Role.findOne({ where: { name: role_name } });
    if (!role) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const user = await User.create({ username, password, role_id: role.id, name, email, phone });
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a user by user_id
exports.getUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a user by user_id
exports.updateUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { name, email, phone } = req.body;
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.name = name;
    user.email = email;
    user.phone = phone;
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a user by user_id
exports.deleteUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.destroy();
    res.status(204).json();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};