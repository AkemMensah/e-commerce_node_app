const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const { ObjectId } = require('mongodb');

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - description
 *         - category
 *         - stockQuantity
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the product
 *         name:
 *           type: string
 *           description: The product's name
 *         price:
 *           type: number
 *           description: The product's price
 *         description:
 *           type: string
 *           description: The product's description
 *         category:
 *           type: string
 *           description: The product's category
 *         stockQuantity:
 *           type: number
 *           description: The quantity of stock available
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve a list of all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           description: The page number for pagination (default is 1)
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Server error
 */

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

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Retrieve a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product
 *     responses:
 *       200:
 *         description: A product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid ID supplied
 *       404:
 *         description: Product not found
 */

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

/**
 * @swagger
 * /products/category/{category}:
 *   get:
 *     summary: Retrieve products by category
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: category
 *         schema:
 *           type: string
 *         required: true
 *         description: The category of the products
 *     responses:
 *       200:
 *         description: A list of products in the category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       404:
 *         description: No products found for the category
 *       500:
 *         description: Server error
 */

// GET /products/category - Retrieve products by category
router.get('/category/:category', async (req, res) => {
    const category = req.params.category;
    
    try {
        const products = await Product.find({ category });
        
        // Check if products are found
        if (products.length === 0) {
            return res.status(404).json({ message: `No products found for category: ${category}` });
        }

        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Bad request
 */

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

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Invalid ID or bad request
 *       404:
 *         description: Product not found
 */

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

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product to delete
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *       400:
 *         description: Invalid ID supplied
 *       404:
 *         description: Product not found
 */

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
