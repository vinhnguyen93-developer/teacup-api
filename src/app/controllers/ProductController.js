const Product = require('../models/Product');
const Category = require('../models/Category');
const { multipleMongooseToObject, mongooseToObject } = require('../../util/mongoose');

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
    Promise.all([Product.countDocumentsDeleted(), Product.find({})])
      .then(([deletedCount, products]) => {
        res.render('products/show', {
          products: multipleMongooseToObject(products),
          deletedCount,
        });
      })
      .catch(next);
  }

  // [GET] /admin/products/trash
  trashProduct(req, res, next) {
    Product.findDeleted({})
      .then((products) => {
        res.render('products/trash', {
          products: multipleMongooseToObject(products),
        });
      })
      .catch(next);
  }

  // [GET] /admin/products/:id/edit
  edit(req, res, next) {
    Promise.all([Category.find({}), Product.findOne({ _id: req.params.id })])
      .then(([categories, product]) => {
        res.render('products/edit', {
          categories: multipleMongooseToObject(categories),
          product: mongooseToObject(product),
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
      .catch((err) => console.log(err));
  }

  // [DELETE] /admin/products/:id
  destroy(req, res, next) {
    Product.delete({ _id: req.params.id })
      .then(() => {
        res.redirect('back');
      })
      .catch(next);
  }

  // [DELETE] /admin/products/:id/force
  forceDestroy(req, res, next) {
    Product.deleteOne({ _id: req.params.id })
      .then(() => {
        res.redirect('back');
      })
      .catch(next);
  }

  // [PATCH] /admin/products/:id/restore
  restore(req, res, next) {
    Product.restore({ _id: req.params.id })
      .then(() => {
        res.redirect('back');
      })
      .catch(next);
  }
}

module.exports = new ProductController();
