const authRouter = require('./auth');
const categoryRouter = require('./category');
const productRouter = require('./product');
const siteRouter = require('./site');
const cartRouter = require('./cart');

const { isLoggedIn } = require('../app/middlewares/LoginMiddleware');
const { adminRequired } = require('../app/middlewares/AdminMiddlware');

function route(app) {
  app.use('/admin/category', adminRequired, categoryRouter);
  app.use('/admin/products', adminRequired, productRouter);
  app.use('/auth', authRouter);
  app.use('/cart', cartRouter);

  app.use('/', siteRouter);
}

module.exports = route;
