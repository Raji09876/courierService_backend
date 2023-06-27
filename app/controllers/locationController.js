const Location = require('../models/Location');

// Create a location
exports.createLocation = async (req, res) => {
  try {
    const { user_id, address, city, state, country, postal_code } = req.body;
    const location = await Location.create({ user_id, address, city, state, country, postal_code });
    res.status(201).json(location);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a location by location_id
exports.getLocation = async (req, res) => {
  try {
    const { location_id } = req.params;
    const location = await Location.findByPk(location_id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.status(200).json(location);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a location by location_id
exports.updateLocation = async (req, res) => {
  try {
    const { location_id } = req.params;
    const { address, city, state, country, postal_code } = req.body;
    const location = await Location.findByPk(location_id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    location.address = address;
    location.city = city;
    location.state = state;
    location.country = country;
    location.postal_code = postal_code;
    await location.save();
    res.status(200).json(location);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a location by location_id
exports.deleteLocation = async (req, res) => {
  try {
    const { location_id } = req.params;
    const location = await Location.findByPk(location_id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    await location.destroy();
    res.status(204).json();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};