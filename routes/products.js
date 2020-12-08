const express = require('express');
const router = express.Router();
const productsCtrl = require('../controllers/products');
const isLoggedIn = require('../config/auth');

router.get('/', productsCtrl.index);
router.get('/new', isLoggedIn, productsCtrl.new);
router.get('/:id', productsCtrl.show);
router.post('/user/:id', productsCtrl.addToCart);
router.post('/', isLoggedIn, productsCtrl.create);

module.exports = router;
