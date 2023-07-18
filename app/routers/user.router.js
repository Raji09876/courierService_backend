const express = require('express');
const userController = require('../controllers/user.controller');

const router = express.Router();
router.get('/users', userController.findAll);
router.get('/users/available-delivery-boys', userController.findAvailableCourierBoys);
router.get('/users/:id', userController.findOne);
router.post('/users', userController.create);
router.delete('/users/:id', userController.delete);
router.delete('/users/', userController.deleteAll);
router.put('/users/:id', userController.update);
module.exports = router