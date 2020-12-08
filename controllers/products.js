const Product = require('../models/product');
const Cart = require('../models/cart');
const { addToImages } = require('./carts');
const User = require('../models/user');
const product = require('../models/product');

module.exports = {
  index,
  show,
  new: newProduct,
  create,
  addToCart:addToCart
};

function index(req, res) {
  Product.find({}, function(err, products) {
    res.render('products/index', { title: 'All products', products });
  });
}

function addToCart(req, res) {
  // event.preventDefault();
  id = (req.params.id).split('&');
  User.findById(id[0].split('=')[1], function (err, product) {
    product.cart.push(id[1].split('=')[1]);
    // // Always save the top-level document (not subdocs)
    product.save(function (err) {
      res.redirect(`/products`);
      // res.redirect(`/products/${product._id}`);
    });
    console.log(product);
  });
  // return
}

function show(req, res) {
  Product.findById(req.params.id)
    .populate('images')
    .exec(function(err, product) {
      // Native MongoDB syntax
      Cart
        .find({_id: {$nin: product.images}})
        .sort('name').exec(function(err, carts) {
          res.render('products/show', { title: 'Product Detail', product, carts });
        });
    });
}

function newProduct(req, res) {
  res.render('products/new', { title: 'Add Product' });
}
function removea(text) {
  var re = /<a\s.*?href=[\"\'](.*?)[\"\']*?>(.*?)<\/a>/g;
  var str = text;
  var subst = '$2';
  var result = str.replace(re, subst);
  return result;
}

function create(reqq, res) {


  // convert checkbox of nothing or "on" to boolean
  if (req.body.pics) req.body.pics = req.body.pics.split(",");
  req.body.onSale = !!req.body.onSale;
  // ensure empty inputs are removed so that model's default values will work
  for (let key in req.body) {
    if (req.body[key] === '') delete req.body[key];
  }
  const product = new Product(req.body);
  product.save(function(err) {
    if (err) return res.redirect('/products/new');
    res.redirect(`/products/${product._id}`);
  });
}
