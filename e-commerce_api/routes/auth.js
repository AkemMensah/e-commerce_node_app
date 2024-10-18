const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/user');
const verifyToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/role'); 

const router = express.Router();

// POST /register - Register a new user
router.post('/register', [
    // Validate user input
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
], async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    // Extract user input data from request body
    const { name, email, password } = req.body;
    
    try {
        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        // save the user to the database
        user = new User({ name, email, password });
        await user.save();

        // return a response to the client
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /login - Login a user
router.post('/login', async (req, res) => {
    // Extract user input data from request body
    const { email, password } = req.body;
    
    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials-email' });
        
        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials-psswd' });

        // Generate a token and send it to the user
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /profile (Authenticated users)
router.put('/profile', verifyToken, async (req, res) => {
    // Extract user input data from request body
    const { name, email } = req.body;

    try {
        // Find the user by ID
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Update the user profile
        user.name = name || user.name;
        user.email = email || user.email;

        // Save the updated user profile
        await user.save();
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /public-data - (Accessible to all users including guests)
router.get('/public-data', (req, res) => {
    res.json({ message: 'This is public data accessible to all users' });
});

// GET /profile - Protected route: (accessible only to authenticated users)
router.get('/profile', verifyToken, async (req, res) => {
    try {
        // Find the user by ID and return the user data excluding the password
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /   asisign-role - Admin-only route: Assign role to a user
router.post('/assign-role', verifyToken, authorizeRoles('Admin'), async (req, res) => {
    const { userId, role } = req.body;

    try {
        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Update the user role
        user.role = role;
        await user.save();

        // Return a response to the user
        res.status(200).json({ message: 'Role assigned successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /user/:id - Admin-only route: Delete a user by ID
router.delete('/user/:id', verifyToken, authorizeRoles('Admin'), async (req, res) => {
    try {
        // Find the user by ID
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Delete the user
        await user.remove();

        // Return a response to the client
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
