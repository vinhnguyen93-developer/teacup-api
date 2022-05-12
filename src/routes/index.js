const authRouter = require('./auth');
const categoryRouter = require('./category');
const productRouter = require('./product');

function route(app) {
  app.use('/admin/category', categoryRouter);
  app.use('/admin/products', productRouter);

  app.use('/', authRouter);
}

module.exports = route;
