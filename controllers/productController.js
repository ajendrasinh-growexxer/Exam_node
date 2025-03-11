const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');
const multer = require('multer');
const path = require('path');



// @desc    Add a new product
// @route   POST /api/products
// @access  Public
const addProduct = asyncHandler(async (req, res) => {
    // No need to call `upload` here
    const { name, description, price, category } = req.body;
    const images = req.files.map(file => file.path);
  
    const product = new Product({
      name,
      description,
      price,
      category,
      images
    });
  
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  });
  
 
// @desc    Update a product
// @route   PATCH /api/products/:id
// @access  Public
const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const { category, page = 1, limit = 10, sort } = req.query;
  
    const query = {};
    if (category) query.category = category;
  
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {}
    };
  
    const products = await Product.paginate(query, options);
    res.json(products);
  });

// @desc    Add a review to a product
// @route   POST /api/products/:id/reviews
// @access  Public
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const review = {
      rating,
      comment
    };

    product.reviews.push(review);
    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

module.exports = {
  addProduct,
  updateProduct,
  getProducts,
  addReview
};