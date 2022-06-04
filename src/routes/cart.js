const express = require('express');
const router = express.Router();

const cartController = require('../app/controllers/CartController');

router.get('/show', cartController.show);
router.get('/add-to-cart/:id', cartController.addToCart);

module.exports = router;
