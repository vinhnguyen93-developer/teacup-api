const express = require('express');
const passport = require('passport');

const router = express.Router();

const authController = require('../app/controllers/AuthController');
const { notLoggedIn } = require('../app/middlewares/LoginMiddleware');

router.get('/login', notLoggedIn, authController.showLogin);
router.get('/register', notLoggedIn, authController.showRegister);
router.get('/logout', authController.logout);

router.post(
  '/login',
  passport.authenticate('local.signin', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true,
  }),
);

router.post(
  '/register',
  passport.authenticate('local.signup', {
    successRedirect: '/auth/login',
    failureRedirect: '/auth/register',
    failureFlash: true,
  }),
);

module.exports = router;
