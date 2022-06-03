const authRouter = require('./auth');
const categoryRouter = require('./category');
const productRouter = require('./product');
const siteRoute = require('./site');

const { isLoggedIn } = require('../app/middlewares/LoginMiddleware');
const { adminRequired } = require('../app/middlewares/AdminMiddlware');

function route(app) {
  app.use('/admin/category', adminRequired, categoryRouter);
  app.use('/admin/products', adminRequired, productRouter);
  app.use('/auth', authRouter);

  app.use('/', siteRoute);
}

module.exports = route;
