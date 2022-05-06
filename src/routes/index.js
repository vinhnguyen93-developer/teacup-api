const authRouter = require('./auth');
const categoryRouter = require('./category');

function route(app) {
  app.use('/admin/category', categoryRouter);

  app.use('/', authRouter);
}

module.exports = route;
