const Product = require('../models/Product');
const Category = require('../models/Category');
const { multipleMongooseToObject } = require('../../util/mongoose');

class ProductController {
  // [GET] /admin/products/create
  showCreate(req, res, next) {
    Category.find({})
      .then((categories) => {
        res.render('products/create', {
          categories: multipleMongooseToObject(categories),
        });
      })
      .catch(next);
  }

  // [GET] /admin/products/show
  showAllProduct(req, res, next) {
    Product.find({})
      .then((products) => {
        res.render('products/show', {
          products: multipleMongooseToObject(products),
        });
      })
      .catch(next);
  }

  // [GET] /admin/products/show
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

  // [GET] /admin/products/:id/edit
  edit(req, res, next) {
    Product.findOne({ _id: req.params.id })
      .populate('category', 'name')
      .then((product) => {
        res.json({
          product: product,
        });
      })
      .catch(next);
  }

  // [POST] /admin/products/create
  create(req, res, next) {
    Product.findOne({ name: req.body.name })
      .then((product) => {
        if (product) {
          res.render('products/create', {
            status: 'error',
            title: 'Thất bại',
            icon: 'fa-exclamation-circle',
            message: 'Sản phẩm này đã tồn tại!',
          });
        } else {
          req.body.image = req.file.path;
          req.body.price = Number.parseFloat(req.body.price);

          const product = new Product(req.body);

          product
            .save()
            .then(() => {
              res.render('products/create', {
                status: 'success',
                title: 'Thành công',
                icon: 'fa-check-circle',
                message: 'Tạo sản phẩm thành công!',
              });
            })
            .catch((error) => {
              console.log(error);
              res.render('products/create', {
                status: 'error',
                title: 'Thất bại',
                icon: 'fa-exclamation-circle',
                message: 'Thêm sản phẩm thất bại!',
              });
            });
        }
      })
      .catch(next);
  }

  // [PUT] /admin/products/:id
  update(req, res, next) {
    if (req.file) {
      req.body.image = req.file.path;
    }

    if (req.body.price) {
      req.body.price = Number.parseFloat(req.body.price);
    }

    Product.updateOne({ _id: req.params.id }, req.body)
      .then(() => {
        res.redirect('/admin/products/show');
      })
      .catch(next);
  }

  //Destroy
  destroy(req, res, next) {
    Product.deleteOne({ _id: req.params.id })
      .then(() => {
        res.json({
          status: 'OK',
          message: 'Delete successfully!',
        });
      })
      .catch(next);
  }
}

module.exports = new ProductController();
