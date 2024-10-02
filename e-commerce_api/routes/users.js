const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Order = require('../models/order');

// GET /users - Get all the users
router.get('/', async (req, res) => {

    //current page (implementing for pagination)
    const page = req.query.page || 1;
    //number of users per page
    const usersPerPage = 3;

    try {
        const users = await User.find()
        .limit(usersPerPage)
        .skip((page - 1)* usersPerPage);
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /users - Create a new user
router.post('/', async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET /users/:id - Get a user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /users/:id/orders - Get orders for a specific user
router.get('/:id/orders', async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.id });
        if (!orders.length) {
            return res.status(404).json({ message: 'No orders found for this user' });
        }
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
