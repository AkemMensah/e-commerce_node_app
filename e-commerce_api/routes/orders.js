const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Product = require('../models/product');

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *           description: User ID for the order
 *         products:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *                 description: Product ID
 *               quantity:
 *                 type: integer
 *                 description: Quantity of the product
 *         totalAmount:
 *           type: number
 *           description: Total amount for the order
 *         status:
 *           type: string
 *           enum: ['pending', 'shipped', 'delivered', 'cancelled']
 *           description: Status of the order
 *         createdAt:
 *           type: string
 *           format: date
 *           description: Date when the order was created
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       500:
 *         description: Server error
 */

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

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Server error
 */

// GET /orders - Retrieve all orders
router.get('/', async (req, res) => {
    //current page (implementing for pagination)
    const page = req.query.page || 1;
    //number of orders per page
    const ordersPerPage = 1;
    try {
        const orders = await Order.find()
            .sort({createdAt:1})
            .limit(ordersPerPage)
            .skip((page - 1) * ordersPerPage)
            .populate('user products.product'); // Populate user and product details
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The order ID
 *     responses:
 *       200:
 *         description: Order data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */

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
