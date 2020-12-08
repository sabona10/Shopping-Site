require('./config/database')
const Product = require('./models/product');
const Cart = require('./models/cart');

let m;
let p;

Product.findOne({}, function(err, product) {
  m = product;
});
