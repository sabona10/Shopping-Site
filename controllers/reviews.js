const Product = require('../models/product');

module.exports = {
  create,
  delete: deleteReview
};

function deleteReview(req, res, next) {
  Product.findOne({'reviews._id': req.params.id})
    .then(function(product) {
      // Find the review subdoc using the id method
      const review = product.reviews.id(req.params.id);
      // Ensure that the review was created by the logged in user
      if (!review.user.equals(req.user._id)) return res.redirect(`/products/${product._id}`);
      review.remove();
      product.save().then(function() {
        res.redirect(`/products/${product._id}`);
      }).catch(function(err) {
        // Let Express display an error
        return next(err);
      });
    });
}

function create(req, res) {
  // Find the product to embed the review within
  Product.findById(req.params.id, function(err, product) {
    // Add the user-centric info to req.body
    req.body.user = req.user._id;
    req.body.userName = req.user.name;
    req.body.userAvatar = req.user.avatar;

    // Push the subdoc for the review
    product.reviews.push(req.body);
    // Always save the top-level document (not subdocs)
    product.save(function(err) {
      res.redirect(`/products/${product._id}`);
    });
  });
}