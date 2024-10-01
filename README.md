# e-commerce_node_app
<!-- An e-commerce backend project built with nodejs and expressjs which focuses more on APIs endpoints. -->

# E-commerce API

This is a RESTful API for an e-commerce platform, built using Node.js, Express, and MongoDB.

## Setup

1. Clone the repository
2. Run `npm install` to install all dependencies
3. Create a `.env` file and add your MongoDB connection string
4. Run `node app.js` to start the server

## API Documentation

API documentation is available at `/api-docs`, powered by Swagger.

## Endpoints

### Users
- `GET /users`: Get all users
- `GET /users/{id}`: Get a specific user
- `POST /users`: Create a new user
- `PUT /users/{id}`: Update a user
- `DELETE /users/{id}`: Delete a user

### Products
- `GET /products`: Get all products (with pagination, filtering, and sorting)
- `GET /products/{id}`: Get a specific product
- `POST /products`: Create a new product
- `PUT /products/{id}`: Update a product
- `DELETE /products/{id}`: Delete a product

### Orders
- `GET /orders`: Get all orders
- `GET /orders/{id}`: Get a specific order
- `POST /orders`: Create a new order
- `PUT /orders/{id}`: Update an order
- `DELETE /orders/{id}`: Delete an order
- `GET /users/{id}/orders`: Get all orders for a specific user

