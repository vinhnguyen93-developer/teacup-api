const express = require('express');
const router = express.Router();

const orderController = require('../app/controllers/OrderController');

router.get('/show', orderController.show);

module.exports = router;
