const Product = require('../models/Product');

const saltRounds = 10;

class SiteController {
  // [GET] /
  show(req, res, next) {
    Product.find({})
      .populate('category', 'name')
      .then((products) => {
        res.json({
          products: products,
        });
      })
      .catch(next);
  }

  // [GET] /:id/detail
  showOne(req, res, next) {
    Product.findOne({ _id: req.params.id })
      .populate('category', 'name')
      .then((product) => {
        res.json({
          product: product,
        });
      })
      .catch(next);
  }
}

module.exports = new SiteController();
