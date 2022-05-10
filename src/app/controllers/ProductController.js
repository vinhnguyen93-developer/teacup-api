const Product = require('../models/Product');

class ProductController {
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
          res.json({
            status: false,
            message: 'Product already exist!',
          });
        } else {
          req.body.image = req.file.path;
          req.body.capacity = Number.parseFloat(req.body.capacity);
          req.body.weight = Number.parseFloat(req.body.weight);
          req.body.price = Number.parseFloat(req.body.price);

          const product = new Product(req.body);

          product
            .save()
            .then(() => {
              res.json({
                status: true,
                message: 'Create product successfully!',
              });
            })
            .catch((error) => {
              res.json({
                status: false,
                message: error,
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

    if (req.body.capacity) {
      req.body.capacity = Number.parseFloat(req.body.capacity);
    }

    if (req.body.weight) {
      req.body.weight = Number.parseFloat(req.body.weight);
    }

    if (req.body.price) {
      req.body.price = Number.parseFloat(req.body.price);
    }

    Product.updateOne({ _id: req.params.id }, req.body)
      .then(() => {
        res.json({
          status: 'OK',
          message: 'Update successfully!',
        });
      })
      .catch(next);
  }
}

module.exports = new ProductController();
