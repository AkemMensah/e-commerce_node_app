# E-commerce API

This is an e-commerce API built using Node.js, Express, and MongoDB. The API allows users to perform CRUD operations on products, manage orders, and handle user authentication. It also provides full Swagger documentation to make testing and understanding the API easier.

## Features

- **User Management**: Create, view, and manage users.
- **Product Management**: Add, view, update, and delete products.
- **Order Management**: Place, view, and track orders.
- **Swagger Documentation**: Auto-generated API documentation using Swagger.

## Technologies Used

- Node.js
- Express
- MongoDB (Mongoose)
- Swagger (for API documentation)

## Getting Started

### Prerequisites

To run this project locally, you will need:

- Node.js (v14.x or later)
- MongoDB (running locally or hosted)
- A package manager like npm or yarn

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/e-commerce-api.git
    ```
2. 2. Navigate to the project directory:
    ```bash
    cd e-commerce-api
    ```
3. Run `npm install` to install all dependencies
4. Create a `.env` file at the root of the project and add your MongoDB connection string:
    ```
    DB_URL=mongodb://localhost:27017/e-commerce
    ```
5. Run `node app.js` to start the server

### Running in Development Mode

To enable live-reload during development, use `nodemon`:

```bash
npm install -g nodemon
nodemon app.js
```

## API Documentation

The API is documented using Swagger. Once the app is running, you can access the Swagger documentation at:

```
http://localhost:3000/api-docs
```

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

NB: You may test the APIs (end points) using Postman.


### Example Endpoints

#### 1. **Get All Products**
- **URL**: `/products`
- **Method**: `GET`
- **Description**: Retrieves a list of all products.
- **Response**:
    ```json
    [
        {
            "_id": "60e64f56fc13ae5564000000",
            "name": "Laptop",
            "price": 1500,
            "description": "A high-end gaming laptop",
            "category": "Electronics",
            "stockQuantity": 50
        }
    ]
    ```

#### 2. **Create a New Order**
- **URL**: `/orders`
- **Method**: `POST`
- **Body**:
    ```json
    {
        "userId": "60e64f56fc13ae5564000000",
        "products": [
            { "product": "60e64f56fc13ae5564000001", "quantity": 2 }
        ]
    }
    ```
- **Response**:
    ```json
    {
        "_id": "60e64f56fc13ae5564000002",
        "user": "60e64f56fc13ae5564000000",
        "products": [
            { "product": "60e64f56fc13ae5564000001", "quantity": 2 }
        ],
        "totalAmount": 3000,
        "status": "pending"
    }
    ```

### Available Endpoints

- `GET /users` - Retrieve all users
- `GET /users/{id}` - Retrieve user by ID
- `POST /users` - Create a new user
- `GET /products` - Retrieve all products
- `GET /products/{id}` - Retrieve specific products by ID
- `POST /products` - Create a new product
- `GET /orders` - Retrieve all orders
- `POST /orders` - Create a new order
- `GET /orders/{id}` - Retrieve an individual order by ID

## License

Copyright (c) [2024] [Akem Mensah]