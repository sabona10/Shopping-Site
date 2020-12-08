const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  content: {type: String, required: true},
  rating: {type: Number, min: 1, max: 5, default: 5},
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  userName: String,
  userAvatar: String
}, {
  timestamps: true
});

const productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description:String,
  brand:String,
  pics:[String],
  price:Number,
  gender: String,
  images: [{
    type: Schema.Types.ObjectId,
    ref: 'Cart'
  }],
  onSale: { type: Boolean, default: false },
  isInStock: { type: Boolean, default: false },
  reviews: [reviewSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);