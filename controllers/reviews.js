const Product = require('../models/product');

module.exports = {
  create,
  delete: deleteReview
};

function deleteReview(req, res, next) {
  Product.findOne({'reviews._id': req.params.id})
    .then(function(product) {
      const review = product.reviews.id(req.params.id);
      if (!review.user.equals(req.user._id)) return res.redirect(`/products/${product._id}`);
      review.remove();
      product.save().then(function() {
        res.redirect(`/products/${product._id}`);
      }).catch(function(err) {
        return next(err);
      });
    });
}

function create(req, res) {
  Product.findById(req.params.id, function(err, product) {
    req.body.user = req.user._id;
    req.body.userName = req.user.name;
    req.body.userAvatar = req.user.avatar;

    product.reviews.push(req.body);
    product.save(function(err) {
      res.redirect(`/products/${product._id}`);
    });
  });
}