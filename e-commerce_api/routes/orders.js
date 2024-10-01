const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Product = require('../models/product');

// POST /orders - Create a new order
router.post('/', async (req, res) => {
    try {
        const { userId, products } = req.body;

        let totalAmount = 0;
        // Calculate total amount for the order
        for (const item of products) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product with ID ${item.product} not found` });
            }
            totalAmount += product.price * item.quantity;
        }

        // Create the new order
        const newOrder = new Order({
            user: userId,
            products: products,
            totalAmount: totalAmount,
        });
        // Save the order
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /orders - Retrieve all orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user products.product'); // Populate user and product details
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /orders/:id - Retrieve an individual order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user products.product'); // Populate user and product details
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
