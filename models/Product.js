const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2'); // Import the plugin
const { type } = require('os');

const reviewSchema = new mongoose.Schema({
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 100 },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
//   stock: {type: Number, required: true, min: 0},
  category: { type: String, required: true },
  images: [{ type: String, required: true }],
  reviews: [reviewSchema],
}, { timestamps: true });

// Apply the pagination plugin to the schema
productSchema.plugin(mongoosePaginate);

// Virtual for average rating
productSchema.virtual('averageRating').get(function() {
  if (this.reviews.length === 0) return 0;
  const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  return total / this.reviews.length;
});

// Create the Product model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;