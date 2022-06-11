const express = require('express');
const router = express.Router();

const cartController = require('../app/controllers/CartController');

router.get('/show', cartController.show);
router.get('/add-to-cart/:id', cartController.addToCart);
router.get('/delete/:id', cartController.destroy);
router.get('/:id/sub', cartController.subOneProduct);
router.get('/:id/plus', cartController.plusOneProduct);

module.exports = router;
