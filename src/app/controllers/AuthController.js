const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const validateUser = require('../../util/validateUser');
const validateUserLogin = require('../../util/validateUserLogin');

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

  register(req, res, next) {
    // Validate form data
    const result = validateUser(req.body);

    if (result.error) {
      res.render('register', {
        layout: false,
        status: 'Error',
        message: result.error.message,
        value: req.body,
      });
    } else {
      // Check user already exist
      User.findOne({ email: req.body.email })
        .exec()
        .then(async (user) => {
          if (user) {
            res.render('register', {
              layout: false,
              status: 'Error',
              message: 'Tài khoản email đã tồn tại!',
              value: req.body,
            });
          } else {
            // Hash password
            await bcrypt.hash(req.body.password, saltRounds, (error, hash) => {
              if (error) {
                res.status(500).json({
                  error: error,
                });
              } else {
                // Create new user
                const user = new User({
                  email: req.body.email,
                  userName: req.body.username,
                  password: hash,
                });

                // Save user to database
                user
                  .save()
                  .then((result) => {
                    res.redirect('/auth/login');
                  })
                  .catch((error) => {
                    res.status(500).json({
                      error: error,
                    });
                  });
              }
            });
          }
        })
        .catch(next);
    }
  }

  login(req, res, next) {
    const result = validateUserLogin({
      email: req.body.email,
    });

    console.log(result.error.message);

    if (result.error) {
      res.render('login', {
        layout: false,
        status: 'Error',
        message: result.error.message,
        value: req.body,
      });
    } else {
      User.findOne({ email: req.body.email })
        .then(async (user) => {
          if (user) {
            await bcrypt.compare(req.body.password, user.password, function (err, result) {
              if (result === false) {
                res.render('login', {
                  layout: false,
                  status: 'Error',
                  message: 'Mật khẩu không chính xác!',
                  value: req.body,
                });
              } else {
                const accessToken = jwt.sign(
                  {
                    id: user._id,
                    isAdmin: user.isAdmin,
                  },
                  process.env.JWT_SECRET,
                  { expiresIn: '2d' },
                );

                const payload = {
                  email: user.email,
                  userName: user.userName,
                  isAdmin: user.isAdmin,
                  accessToken,
                };

                res.cookie('userInfo', JSON.stringify(payload));

                res.redirect('/');
              }
            });
          } else {
            res.render('login', {
              layout: false,
              status: 'Error',
              message: 'Tài khoản không tồn tại!',
              value: req.body,
            });
          }
        })
        .catch(next);
    }
  }
}

module.exports = new AuthController();
