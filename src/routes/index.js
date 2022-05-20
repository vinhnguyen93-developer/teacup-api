const authRouter = require('./auth');
const categoryRouter = require('./category');
const productRouter = require('./product');
const siteRoute = require('./site');

function route(app) {
  app.use('/admin/category', categoryRouter);
  app.use('/admin/products', productRouter);
  app.use('/auth', authRouter);

  app.use('/', siteRoute);
}

module.exports = route;
