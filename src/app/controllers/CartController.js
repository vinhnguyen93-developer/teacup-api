const Cart = require('../models/Cart');
const Product = require('../models/Product');

class CartController {
  // [GET] cart/show
  show(req, res, next) {
    if (!req.session.cart) {
      return res.render('carts/shopping-cart');
    }

    const cart = new Cart(req.session.cart);

    res.render('carts/shopping-cart', {
      products: cart.generateArray(),
      totalPrice: cart.totalPrice,
    });
  }

  // [GET] cart/add-to-cart/:id
  addToCart(req, res, next) {
    const productId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId)
      .then((product) => {
        cart.add(product, product._id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('back');
      })
      .catch((error) => {
        res.redirect('/');
      });
  }
}

module.exports = new CartController();
