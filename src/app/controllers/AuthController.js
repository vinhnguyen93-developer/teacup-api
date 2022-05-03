const bcrypt = require('bcrypt');

const User = require('../models/User');
const validateUser = require('../../util/validateUser');

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
}

module.exports = new AuthController();
