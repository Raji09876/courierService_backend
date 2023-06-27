const express = require('express');
const router = express.Router();
const LocationController = require('../controllers/locationController');

router.post('/', LocationController.createLocation);

module.exports = router;