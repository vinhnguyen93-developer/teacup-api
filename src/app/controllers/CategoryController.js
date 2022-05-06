const Category = require('../models/Category');

class CategoryController {
  // [GET] /admin/category/show
  show(req, res, next) {
    Category.find({})
      .then((categories) => {
        res.json({
          categories: categories,
        });
      })
      .catch(next);
  }

  // [POST] /admin/category/create
  create(req, res, next) {
    Category.findOne({ name: req.body.name })
      .then((item) => {
        if (item) {
          res.json({
            status: 'Error',
            message: 'This category already exists!',
          });
        } else {
          const category = new Category(req.body);

          category
            .save()
            .then(() => {
              res.json({
                status: 'OK',
                message: 'Create category successfully!',
              });
            })
            .catch(() => {
              res.json({
                status: 'Error',
                message: 'Something error!',
              });
            });
        }
      })
      .catch(next);
  }

  // [GET] /admin/category/:id/edit
  edit(req, res, next) {
    Category.findOne({ _id: req.params.id })
      .then((category) => {
        res.json({
          category: category,
        });
      })
      .catch(next);
  }

  // [PUT] /admin/category/:id
  update(req, res, next) {
    Category.updateOne({ _id: req.params.id }, req.body)
      .then(() => {
        res.json({
          status: 'OK',
          message: 'Update successfully!',
        });
      })
      .catch(next);
  }

  // [DELETE] /admin/category/:id
  destroy(req, res, next) {
    Category.deleteOne({ _id: req.params.id })
      .then(() => {
        res.json({
          status: 'OK',
          message: 'Delete successfully!',
        });
      })
      .catch(next);
  }
}

module.exports = new CategoryController();
