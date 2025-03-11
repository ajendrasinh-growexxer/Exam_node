# Product Order API

This is a RESTful API for managing products and orders.

## Installation

1. Clone the repository
2. Run `npm install`
3. Create a `.env` file and add the required environment variables
4. Run `npm start`

## API Documentation

### Products

- **POST /api/products**: Add a new product
- **PATCH /api/products/:id**: Update a product
- **GET /api/products**: List all products
- **POST /api/products/:id/reviews**: Add a review to a product

### Orders

- **POST /api/orders**: Place a new order
- **PATCH /api/orders/:id**: Update the status of an order
- **GET /api/orders/:id**: Retrieve the details of a specific order
- **GET /api/orders**: List all orders