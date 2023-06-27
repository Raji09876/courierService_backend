const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

router.post('/', UserController.createUser);
router.get('/:user_id', UserController.getUser);

module.exports = router;