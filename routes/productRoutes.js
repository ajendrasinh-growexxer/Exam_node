const express = require('express');
const { addProduct, updateProduct, getProducts, addReview } = require('../controllers/productController');
const upload = require('../middleware/multer');

const router = express.Router();

// Apply the `upload` middleware only here
router.post('/', upload, addProduct);
router.patch('/:id', updateProduct);
router.get('/', getProducts);
router.post('/:id/reviews', addReview);

module.exports = router;