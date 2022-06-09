const express = require('express');
const router = express.Router();

const orderController = require('../app/controllers/OrderController');

router.get('/show', orderController.show);
router.get('/my-order', orderController.showMyOrder);
router.get('/vnpay_return', orderController.vnpReturn);
router.post('/create', orderController.create);

module.exports = router;
