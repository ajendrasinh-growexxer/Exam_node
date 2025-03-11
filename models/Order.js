const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 }
  }],
  status: { type: String, enum: ['Pending', 'Shipped', 'Delivered'], default: 'Pending' },
  totalPrice: { type: Number, required: true, min: 0 },
}, { timestamps: true });

// Apply the pagination plugin
orderSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Order', orderSchema);