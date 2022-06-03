exports.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/');
};

exports.notLoggedIn = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }

  res.redirect('/');
};

exports.checkUserLogin = function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.login = req.isAuthenticated();
  next();
};
