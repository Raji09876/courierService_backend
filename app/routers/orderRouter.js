const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');

router.post('/', OrderController.createOrder);
router.put('/assign/:order_id', OrderController.assignOrderToDeliveryBoy);

module.exports = router;