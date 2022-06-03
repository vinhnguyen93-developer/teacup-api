const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../app/models/User');
const validateUserLogin = require('../util/validateUserLogin');
const validateUser = require('../util/validateUser');

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  'local.signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    function (req, email, password, done) {
      // Validate form data
      const result = validateUser(req.body);

      if (result.error) {
        let messages = [];
        messages.push(result.error.message);

        return done(null, false, req.flash('error', messages));
      }

      User.findOne({ email: email }, function (error, user) {
        if (error) {
          return done(error);
        }

        if (user) {
          return done(null, false, { message: 'Tài khoản email đã tồn tại!' });
        }

        const newUser = new User();

        newUser.email = email;
        newUser.userName = req.body.username;
        newUser.password = newUser.encryptPassword(password);

        newUser.save(function (error, result) {
          if (error) {
            return done(error);
          }

          return done(null, newUser);
        });
      });
    },
  ),
);

passport.use(
  'local.signin',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    function (req, email, password, done) {
      // Validate form data
      const result = validateUserLogin({ email });

      if (result.error) {
        let messages = [];
        messages.push(result.error.message);

        return done(null, false, req.flash('error', messages));
      }

      User.findOne({ email: email }, function (error, user) {
        if (error) {
          return done(error);
        }

        if (!user) {
          return done(null, false, { message: 'Tài khoản không tồn tại!' });
        }

        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Bạn đã nhập sai mật khẩu!' });
        }

        return done(null, user);
      });
    },
  ),
);
