const Cart = require('../models/Cart');

class OrderController {
  // [GET] order/show
  show(req, res, next) {
    if (!req.session.cart) {
      return res.redirect('/');
    } else if (Object.keys(req.session.cart.items).length === 0) {
      return res.redirect('/');
    }

    const cart = new Cart(req.session.cart);

    res.render('orders/checkout-order', {
      totalPrice: cart.totalPrice,
      totalQuantity: cart.totalQuantity,
      products: cart.generateArray(),
    });
  }
}

module.exports = new OrderController();
