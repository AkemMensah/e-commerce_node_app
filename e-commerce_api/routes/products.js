const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const { ObjectId } = require('mongodb');

// GET /products - Retrieve all products
router.get('/', async (req, res) => {

    //current page (implementing for pagination)
    const page = req.query.page || 1;
    //number of products per page
    const productsPerPage = 3;

    try {
        const products = await Product.find()
            .limit(productsPerPage)
            .skip((page - 1)* productsPerPage);
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /products/:id - Retrieve a specific product by ID
router.get('/:id', async (req, res) => {
    // Check if the ID is valid
    if (!ObjectId.isValid(req.params.id)){
        return res.status(400).json({error: 'Invalid id'})
    };
    // Find the product by ID
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /products - Create a new product
router.post('/', async (req, res) => {
    // Create a new product
    const { name, price, description, category, stockQuantity } = req.body;

    // Validate the request
    const newProduct = new Product({
        name,
        price,
        description,
        category,
        stockQuantity
    });

    // Save the product
    try {
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT /products/:id - Update a product by ID
router.put('/:id', async (req, res) => {
    // Check if the ID is valid
    if (!ObjectId.isValid(req.params.id)){
        return res.status(400).json({error: 'Invalid id'})
    };
    // Update the product
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE /products/:id - Delete a product by ID
router.delete('/:id', async (req, res) => {
    // Check if the ID is valid
    if (!ObjectId.isValid(req.params.id)){
        return res.status(400).json({error: 'Invalid id'})
    };
    // Delete the product
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(204).send(); // No content
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Export the router
module.exports = router;
