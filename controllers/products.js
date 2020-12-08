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


  var unirest = require("unirest");

  var req = unirest("GET", "https://asos2.p.rapidapi.com/products/v2/list");

  req.query({
    "country": "US",
    "currency": "USD",
    "sort": "freshness",
    "lang": "en-US",
    "sizeSchema": "US",
    "offset": "0",
    "categoryId": "6993",
    "limit": "48",
    "store": "US"
  });

  req.headers({
    "x-rapidapi-host": "asos2.p.rapidapi.com",
    "x-rapidapi-key": "512bb8a9d8mshecf8b087cdf8537p1a355bjsna8a1a26060c9",
    "useQueryString": true
  });


  req.end(function (res) {
    if (res.error) throw new Error(res.error);
    for (var i = 0; i < res.body.products.length; i++) {
      
      ok = 0 ;
      Product.find({}, function (err, productss) {
        // console.log(i);
        // res.body.products[i].name
        // console.log(res.body.products[i]);
        // console.log(res.body.products[i].name, productss[0].name);
        for (var ix = 0; ix < productss.length; ix++) {
          if (productss[ix].name == res.body.products[i-1].name) ok = 1;
        }
        // res.render('products/index', { title: 'All products', products });
      });
      if (ok) continue;
      // setTimeout(() => { console.log("created one!"); }, 1000);
      // console.log(res.body.products.length);
      id = res.body.products[i].id;
      // var unirest = require("unirest");
      var rle = unirest("GET", "https://asos2.p.rapidapi.com/products/v3/detail");

      rle.query({
        "store": "US",
        "sizeSchema": "US",
        "lang": "en-US",
        "currency": "USD",
        "id": id
      });

      rle.headers({
        "x-rapidapi-host": "asos2.p.rapidapi.com",
        "x-rapidapi-key": "512bb8a9d8mshecf8b087cdf8537p1a355bjsna8a1a26060c9",
        "useQueryString": true
      });


      rle.end(function (res) {
        // await new Promise(r => setTimeout(r, 2000));
        if (!res.error && res.body.media.images){
        reqq.body.name = res.body.name;
        reqq.body.description = removea(res.body.description);
        reqq.body.gender = res.body.gender;
        reqq.body.brand = res.body.brand.name;
        
        pcs = []
        for (var ii = 0; ii < res.body.media.images.length; ii++) {
          pcs.push(res.body.media.images[ii].url);
        }
        reqq.body.pics = pcs
        reqq.body.price = res.body.price.current.value
        reqq.body.onSale = res.body.isMarkedDown

        let product = new Product(reqq.body);
        product.save();
        console.log(res.body.name);
      }
      });
    }
    // console.log(res.body);
  });
  // convert checkbox of nothing or "on" to boolean
  // if (req.body.pics) req.body.pics = req.body.pics.split(",");
  // req.body.onSale = !!req.body.onSale;
  // // ensure empty inputs are removed so that model's default values will work
  // for (let key in req.body) {
  //   if (req.body[key] === '') delete req.body[key];
  // }
  // const product = new Product(req.body);
  // product.save(function(err) {
  //   if (err) return res.redirect('/products/new');
  //   res.redirect(`/products/${product._id}`);
  // });
}
