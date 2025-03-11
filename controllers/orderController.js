const Order = require('../models/Order');
const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private
const placeOrder = asyncHandler(async (req, res) => {
  const { customerName, customerEmail, products } = req.body;

  let totalPrice = 0;
  const orderProducts = [];

  for (const item of products) {
    const product = await Product.findById(item.productId);

    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${item.productId}`);
    }
    console.log(product.stock);
    console.log(item.quantity);

    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for product: ${product.name}`);
    }

    totalPrice += product.price * item.quantity;
    orderProducts.push({
      productId: product._id,
      quantity: item.quantity
    });

    product.stock -= item.quantity;
    await product.save();
  }

  const order = new Order({
    user: req.user._id, // Associate the order with the logged-in user
    customerName,
    customerEmail,
    products: orderProducts,
    totalPrice
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

// @desc    Update the status of an order
// @route   PATCH /api/orders/:id
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get a specific order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('products.productId');

  if (order) {
    // Ensure the order belongs to the logged-in user or the user is an admin
    if (order.user.toString() === req.user._id.toString() || req.user.isAdmin) {
      res.json(order);
    } else {
      res.status(403);
      throw new Error('Not authorized to view this order');
    }
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 10 } = req.query;
  
    const query = {};
    if (status) query.status = status;
  
    // If the user is not an admin, only fetch their orders
    if (!req.user.isAdmin) {
      query.user = req.user._id;
    }
  
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      populate: 'products.productId', // Populate product details
      sort: { createdAt: -1 } // Sort by creation date (newest first)
    };
  
    const orders = await Order.paginate(query, options);
    res.json(orders);
  });

module.exports = {
  placeOrder,
  updateOrderStatus,
  getOrder,
  getOrders
};