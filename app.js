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
mongoose.connect(process.env.CLOUD_DB_URL);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

// Import Routes
const usersRoute = require('./routes/users');
const productsRoute = require('./routes/products');
const ordersRoute = require('./routes/orders');
const authRoutes = require('./routes/auth');


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
                <section class="endPoints">
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
                <hr>
                </section>
                <section class="auth" style="font-size:18px;display:flex;flex-direction:column;justity-content:center;margin:10px 0 ">
                <p style="text-align:center">For Authentication and Role-Based Authorization, you may explore the following routes:</p>
                <ul style="display:flex;flex-direction:column;align-items:center">
                    <li>POST /api/auth/register: Register a new user</li>
                    <li>POST /api/auth/login: Login a user - receive jwt token</li>
                    <li>GET /api/auth/profile: Get user profile</li>
                    <li>PUT /api/auth/profile: Update user profile</li>
                    <li>GET /api/public-data - Get Public Data</li>
                    <li>POST /api/assign-role - Assign Role to a User (Admin Only)</li>
                    <li>DELETE /user/:id - Delete a User by ID (Admin Only)</li>
                </ul>
                </section>
                <p class="note"><b>NB</b>:There is Pagination implemented for <em> GET: /products</em>, <em>GET /users</em>, and <em>GET /orders</em> routes. To get the next page use eg. <em>/products?page=2</em> and so on.</p>
                <p class="note">For more detailed information, check out the <a href="/docs" target="blank"> API Documentation</a></p>
                <hr>
                <footer>                    
                    <p>Copyright (c) [2024] [Akem Mensah]</p>
                </footer>
            </body>

        </html>
    `);
});

// Setting up routes
app.use('/users', usersRoute);
app.use('/products', productsRoute);
app.use('/orders', ordersRoute);
app.use('/api/auth', authRoutes);

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
                // {
                    // url: process.env.NODE_ENV === 'production' 
            // ? 'https://e-commerce-node-app.vercel.app/'  //Vercel deployment URL (production)
            // : 'http://localhost:3000', // Localhost (development)
                // },
                {
                    url: process.env.VERCEL_URL 
                        ? `https://${process.env.VERCEL_URL}`  // Automatically detect the Vercel deployment URL
                        : 'http://localhost:3000', // Localhost (development)
                },
            ],
        },
    },
    apis: ['./routes/*.js'], // Path to the API docs
};

// "rewrites": [
//     { "source": "/docs/(.*)", "destination": "/docs/$1" }
//   ]

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
