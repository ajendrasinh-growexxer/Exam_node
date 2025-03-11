const express = require('express');
const { placeOrder, updateOrderStatus, getOrder, getOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, placeOrder);
router.patch('/:id', protect, updateOrderStatus);
router.get('/:id', protect, getOrder);
router.get('/', protect, getOrders);

module.exports = router;