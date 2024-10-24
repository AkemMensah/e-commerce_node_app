# E-commerce API (RESTful API )

This is an e-commerce API built using Node.js, Express, and MongoDB. The API allows users to perform CRUD operations on products, manage orders, and handle user authentication. It also provides full Swagger documentation to make testing and understanding the API easier.

## Features

- **User Management**: Create, view, and manage users.
- **Product Management**: Add, view, update, and delete products.
- **Order Management**: Place, view, and track orders.
- **Authentication and Authorization**: Register,login,view, delete,assign-role etc.
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
- `GET /users/:id/orders`: Get orders for a specific user

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

---

# Authentication and Authorization Routes

This aspect manages the routes for user authentication and role-based authorization, handling user registration, login, profile updates, role assignment, and Google OAuth2 login.

## Routes:

### 1. **POST `/register` - Register a New User**

Registers a new user in the system.

#### Request:
- **Method**: `POST`
- **URL**: `/register`
- **Body** (JSON):
  - `name` (string): User's name
  - `email` (string): User's email (validated)
  - `password` (string): User's password (minimum 6 characters)

#### Response:
- **Success**: Status `201`, Message: `User registered successfully`.
- **Failure**: Status `400` for validation errors or `500` for server errors.

#### Example Request:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Example Response (Success):
```json
{
  "message": "User registered successfully"
}
```

---

### 2. **POST `/login` - Login a User**

Logs in an existing user and returns a JSON Web Token (JWT).

#### Request:
- **Method**: `POST`
- **URL**: `/login`
- **Body** (JSON):
  - `email` (string): User's email
  - `password` (string): User's password

#### Response:
- **Success**: Status `200`, returns the JWT token.
- **Failure**: Status `400` for invalid credentials or `500` for server errors.

#### Example Request:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Example Response (Success):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR..."
}
```

---

### 3. **PUT `/profile` - Update User Profile (Authenticated Users Only)**

Allows authenticated users to update their profile information.

#### Request:
- **Method**: `PUT`
- **URL**: `/profile`
- **Headers**:
  - `Authorization`: Bearer `<JWT token>`
- **Body** (JSON):
  - `name` (string, optional): New user name
  - `email` (string, optional): New user email

#### Response:
- **Success**: Status `200`, Message: `Profile updated successfully`.
- **Failure**: Status `404` for user not found or `500` for server errors.

#### Example Request:
```json
{
  "name": "John Updated",
  "email": "johnupdated@example.com"
}
```

#### Example Response (Success):
```json
{
  "message": "Profile updated successfully"
}
```

---

### 4. **GET `/public-data` - Get Public Data**

Returns a public message that can be accessed by any user, including unauthenticated users.

#### Request:
- **Method**: `GET`
- **URL**: `/public-data`

#### Response:
- **Success**: Status `200`, returns a public message.

#### Example Response (Success):
```json
{
  "message": "This is public data accessible to all users"
}
```

---

### 5. **GET `/profile` - Get User Profile (Authenticated Users Only)**

Returns the authenticated user's profile data (excluding the password).

#### Request:
- **Method**: `GET`
- **URL**: `/profile`
- **Headers**:
  - `Authorization`: Bearer `<JWT token>` received on login

#### Response:
- **Success**: Status `200`, returns the user's profile data.
- **Failure**: Status `404` for user not found or `500` for server errors.

#### Example Response (Success):
```json
{
  "_id": "603fbd271134530cb4cf93d5",
  "name": "John Doe",
  "email": "john@example.com"
}
```

---

### 6. **POST `/assign-role` - Assign Role to a User (Admin Only)**

Allows an admin to assign a role to a user.

#### Request:
- **Method**: `POST`
- **URL**: `/assign-role`
- **Headers**:
  - `Authorization`: Bearer `<Admin JWT token>` received on login
- **Body** (JSON):
  - `userId` (string): The ID of the user to assign the role to
  - `role` (string): The role to assign (e.g., "Admin", "User")

#### Response:
- **Success**: Status `200`, Message: `Role assigned successfully`.
- **Failure**: Status `404` for user not found or `500` for server errors.

#### Example Request:
```json
{
  "userId": "603fbd271134530cb4cf93d5",
  "role": "Admin"
}
```

#### Example Response (Success):
```json
{
  "message": "Role assigned successfully"
}
```

---

### 7. **DELETE `/user/:id` - Delete a User by ID (Admin Only)**

Allows an admin to delete a user by their ID.

#### Request:
- **Method**: `DELETE`
- **URL**: `/user/:id`
- **Headers**:
  - `Authorization`: Bearer `<Admin JWT token>` received on login

#### Response:
- **Success**: Status `200`, Message: `User deleted successfully`.
- **Failure**: Status `404` for user not found or `500` for server errors.

#### Example Request:
```
DELETE /user/603fbd271134530cb4cf93d5
```

#### Example Response (Success):
```json
{
  "message": "User deleted successfully"
}
```

---

### 8. **GET `/auth/google` - Google OAuth2 Login**

Redirects the user to Google for OAuth2 login.

#### Request:
- **Method**: `GET`
- **URL**: `/auth/google`

#### Example:
Navigating to `http://localhost:3000/auth/google` will redirect the user to Google for authentication.

---

### 9. **GET `/auth/google/callback` - Google OAuth2 Callback**

Handles the callback from Google after the user has authenticated.

#### Request:
- **Method**: `GET`
- **URL**: `/auth/google/callback`

#### Response:
- **Success**: Redirects the user to `/dashboard` upon successful authentication.
- **Failure**: Redirects the user to `/` in case of failure.

---

### 10. **GET `/logout` - Logout a User**

Logs out the user by terminating the session.

#### Request:
- **Method**: `GET`
- **URL**: `/logout`

#### Response:
- **Success**: Redirects the user to the homepage or login page.

---

## Middleware:

- **verifyToken**: Middleware that verifies if the request contains a valid JWT token. Used for protecting routes that require authentication.
- **authorizeRoles**: Middleware that checks the user's role to authorize access to admin-only routes.

---


## License

Copyright (c) [2024] [Akem Mensah]