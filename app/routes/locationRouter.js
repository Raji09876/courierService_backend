const express = require('express');
const router = express.Router();
const LocationController = require('../controllers/LocationController');

router.post('/', LocationController.createLocation);

module.exports = router;