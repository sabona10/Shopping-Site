const User = require('../models/user');
const Product = require('../models/product');

module.exports = {
  show: yourCart,
  delete:deleteFromCart,
};


function yourCart(req, res) {
  Product
    .find({})
    .exec(function (err, carts) {
      res.render('carts/cart', {
        title: 'Your Cart',
        carts
      });
  });
}

function deleteFromCart(req, res, next) {
  id = (req.params.id).split('&');
  console.log(id[1].split('=')[1]);
  User.findById(id[0].split('=')[1], function (err, product) {
    newarr = [];
    for (var i = 0; i < product.cart.length; i++){
      if (product.cart[i] == id[1].split('=')[1]){
        continue
      }else{
        newarr.push(product.cart[i])
      }
    }
    product.cart= newarr;
    product.save(function (err) {
      res.redirect(`/carts/cart`);
    });
    console.log(product);
  });
}