const Product = require('../models/Product');
const { multipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');

const saltRounds = 10;

class SiteController {
  // [GET] /
  show(req, res, next) {
    const message = req.flash('success')[0];

    Product.find({})
      .populate('category', 'name')
      .then((products) => {
        res.render('home', {
          products: multipleMongooseToObject(products),
          message: message,
        });
      })
      .catch(next);
  }

  // [GET] product/:id/detail
  showOne(req, res, next) {
    Product.findOne({ _id: req.params.id })
      .populate('category', 'name')
      .then((product) => {
        res.render('products/productDetail', {
          product: mongooseToObject(product),
        });
      })
      .catch(next);
  }
}

module.exports = new SiteController();
