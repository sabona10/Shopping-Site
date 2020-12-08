const express = require('express');
const router = express.Router();
const cartCtrl = require('../controllers/carts');
const isLoggedIn = require('../config/auth');

router.get('/carts/cart', isLoggedIn, cartCtrl.show);
router.post('/carts/cart/:id', isLoggedIn, cartCtrl.delete);

module.exports = router;