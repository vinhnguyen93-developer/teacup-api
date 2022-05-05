const bcrypt = require('bcrypt');

const User = require('../models/User');
const validateUser = require('../../util/validateUser');
const validateUserLogin = require('../../util/validateUserLogin');

const saltRounds = 10;

class AuthController {
  signup(req, res, next) {
    // Validate form data
    const result = validateUser(req.body);

    if (result.error) {
      res.json({
        status: 'Error',
        message: result.error.message,
      });
    } else {
      // Check user already exist
      User.findOne({ email: req.body.email })
        .exec()
        .then(async (user) => {
          if (user) {
            res.json({
              status: false,
              message: 'User already exist!',
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
                    res.json({
                      status: true,
                      message: 'Create user successfully!',
                    });
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

    if (result.error) {
      res.json({
        status: 'Error',
        message: result.error.message,
      });
    } else {
      User.findOne({ email: req.body.email })
        .then(async (user) => {
          if (user) {
            await bcrypt.compare(
              req.body.password,
              user.password,
              function (err, result) {
                if (result === false) {
                  res.json({
                    status: false,
                    message: 'Incorrect password!',
                  });
                } else {
                  res.json({
                    status: true,
                    message: 'Login successfully!',
                    data: user.email,
                  });
                }
              }
            );
          } else {
            res.json({
              status: false,
              message: 'Account does not exist!',
            });
          }
        })
        .catch(next);
    }
  }
}

module.exports = new AuthController();
