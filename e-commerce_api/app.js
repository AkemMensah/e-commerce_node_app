const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Use CORS to allow cross-origin requests

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS


// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

// Import Routes
const usersRoute = require('./routes/users');
const productsRoute = require('./routes/products');
const ordersRoute = require('./routes/orders');


// Root route that returns HTML
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>E-Commerce API</title>
                <style>
                    .first {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    }
                    .second {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    }
                    h3 {
                    margin-top: 0;
                    margin-bottom: 0;
                    }
                    p {
                    margin-top: 0;
                    }
                    footer {
                    display: flex;
                    flex-direction: space-between;
                    justify-content: center;
                    align-items: center;
                    }
                    .note {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    }
                </style>
            </head>
            <body>
                <div class="first">
                <h1 style="margin-bottom:0;">Welcome to the E-Commerce API</h1>
                <p style="margin-top:0;color: red;">(Best viewed on desktop!)</p>
                <h2 style="margin-top:0;margin-bottom:0">Where would you like to go?</h2>
                <p>Below are some general routes you can explore!</p>
                <ul>
                    <li><a href="/users" target="_blank" >Users</a> - Get all users</li>
                    <li><a href="/products" target="_blank">Products</a> - Get all products</li>
                    <li><a href="/orders" target="_blank">Orders</a> - Get all orders by users</li>
                </ul>
                <p>For Specific routes you may explore the following in the browser or use third party apps:</p>
                </div>
                <div class="second">
                <ul>
                    <h3>Products Routes</h3>
                    <li>GET /products/{id}: Get a specific product by ID</li>
                    <li>GET /products/category/{category}: Get products by category</li>
                    <li>Post /products/{id}: Create new product</li>
                    <li>PUT /products/{id}: Update a product</li>
                    <li>DELETE /products/{id}: Delete a product</li>
                </ul>
                    <ul>
                    <h3>Users Routes</h3>
                    <li>GET /users: Get all users</li>
                    <li>GET /users/{id}: Get a specific user by ID</li>
                    <li>POST /users: Create a new user</li>
                </ul>
                <ul>
                    <h3>Orders Routes</h3>
                    <li>GET /orders: Get all orders</li>
                    <li>POST /orders: Create a new order</li>
                    <li>GET /users/{id}/orders: Get orders for a specific user</li>
                </ul>
                </div>
                <p class="note"><b>NB</b>:There is Pagination implemented for <em> GET: /products</em>, <em>GET /users</em>, and <em>GET /orders</em> routes. To get the next page use eg. <em>/products?page=2</em> and so on.</p>
                <p class="note">For more detailed information, check out the <a href="/api-docs" target="blank"> API Documentation</a></p>
                <hr>
                <footer>                    
                    <p>Copyright (c) [2024] [Akem Mensah]</p>
                </footer>
            </body>

        </html>
    `);
});

// Set up routes
app.use('/users', usersRoute);
app.use('/products', productsRoute);
app.use('/orders', ordersRoute);

// Swagger setup for API documentation
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'E-Commerce API',
            version: '1.0.0',
            description: 'E-Commerce API Documentation',
            contact: {
                name: 'Developer',
            },
            servers: [
                {
                    url: 'http://localhost:3000',
                },
            ],
        },
    },
    apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
