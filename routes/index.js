const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', function(req, res, next) {
  res.redirect('/products');
});

// Login with Google
router.get('/auth/google', passport.authenticate(
  'google',
  { scope: ['profile', 'email'] }
));

router.get('/oauth2callback', passport.authenticate(
  'google',
  {
    successRedirect: '/products',
    failureMessage: '/products'
  }
));

// Logout
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/products');
});

module.exports = router;
