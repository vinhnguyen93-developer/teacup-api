exports.adminRequired = function (req, res, next) {
  const isAdmin = req.user.isAdmin;

  if (isAdmin) {
    return next();
  }

  res.redirect('/');
};
