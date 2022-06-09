const saltRounds = 10;
class AuthController {
  // [GET] auth/login
  showLogin(req, res, next) {
    const messages = req.flash('error');

    res.render('login', {
      layout: false,
      messages,
      hasError: messages.length > 0,
    });
  }

  // [GET] auth/register
  showRegister(req, res, next) {
    const messages = req.flash('error');

    res.render('register', {
      layout: false,
      messages,
      hasError: messages.length > 0,
    });
  }

  // [GET] /auth/logout
  logout(req, res, next) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  }
}

module.exports = new AuthController();
