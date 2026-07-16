# Project Name Super Market Management System

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Node.js
- Express.js
- MongoDB

## Description

## ERD 


## User Stories

## 📖 User Stories

### Guest
- As a guest, I want to view the list of available products.
- As a guest, I want to view product details, ratings, reviews, and discounts.
- As a guest, I want to create a new account.

### Customer
- As a customer, I want to log in securely.
- As a customer, I want to log out securely.
- As a customer, I want to browse all available products.
- As a customer, I want to search for products by name, category, or brand.
- As a customer, I want to add products to my shopping cart.
- As a customer, I want to update the quantity of products in my shopping cart.
- As a customer, I want to remove products from my shopping cart.
- As a customer, I want to add or remove products from my wishlist.
- As a customer, I want to leave ratings and reviews for purchased products.
- As a customer, I want to send and receive messages.
- As a customer, I want to complete my purchase.
- As a customer, I want to view my previous orders.
- As a customer, I want to update my profile information.

### Employee
- As an employee, I want to log in securely.
- As an employee, I want to log out securely.
- As an employee, I want to add new products.
- As an employee, I want to edit product information.
- As an employee, I want to delete products.
- As an employee, I want to update product prices and stock quantities.
- As an employee, I want to manage product categories and brands.

### Admin
- As an admin, I want to log in securely.
- As an admin, I want to log out securely.
- As an admin, I want to create employee accounts.
- As an admin, I want to edit employee accounts.
- As an admin, I want to delete employee accounts.
- As an admin, I want to manage all users in the system.
- As an admin, I want to create and manage product discounts.
- As an admin, I want full access to all application features.

## Routes

| Method | Route | Access | Description |
|---------|-------|--------|-------------|
| GET | / | Everyone | Home page |
| GET | /auth/sign-up | Guest | Register page |
| POST | /auth/sign-up | Guest | Create a customer account |
| GET | /auth/sign-in | Guest | Login page |
| POST | /auth/sign-in | Guest | Authenticate user |
| GET | /auth/sign-out | Customer, Employee, Delivery, Admin | Logout |
| GET | /products | Everyone | View all products |
| GET | /products/new | Employee | New product form |
| POST | /products | Employee | Create a product |
| GET | /products/:id | Everyone | View product details |
| GET | /products/:id/edit | Employee | Edit product form |
| PUT | /products/:id | Employee | Update product |
| DELETE | /products/:id | Employee | Delete product |
| GET | /cart | Customer | View shopping cart |
| POST | /cart/items/:productId | Customer | Add product to cart |
| PUT | /cart/items/:productId | Customer | Update cart item quantity |
| DELETE | /cart/items/:productId | Customer | Remove product from cart |
| DELETE | /cart | Customer | Clear shopping cart |
| GET | /wishlist | Customer | View wishlist |
| POST | /wishlist/:productId | Customer | Add product to wishlist |
| DELETE | /wishlist/:productId | Customer | Remove product from wishlist |
| GET | /orders | Customer | View my orders |
| POST | /orders | Customer | Place a new order |
| GET | /orders/:id | Customer | View order details |
| PUT | /orders/:id/cancel | Customer | Cancel an order |
| GET | /dashboard/products | Employee | Manage products |
| GET | /dashboard/orders | Employee | View all orders |
| PUT | /orders/:id/status | Employee | Update order status |
| GET | /delivery/orders | Delivery | View assigned orders |
| GET | /delivery/orders/:id | Delivery | View assigned order |
| PUT | /delivery/orders/:id/status | Delivery | Update delivery status |
| GET | /employees | Admin | View all employees |
| GET | /employees/new | Admin | New employee form |
| POST | /employees | Admin | Create employee account |
| GET | /employees/:id/edit | Admin | Edit employee form |
| PUT | /employees/:id | Admin | Update employee |
| DELETE | /employees/:id | Admin | Delete employee |
| PUT | /products/:id/discount | Admin | Add or update product discount |
| DELETE | /products/:id/discount | Admin | Remove product discount |
| GET | /profile | Logged-in User | View profile |
| GET | /profile/edit | Logged-in User | Edit profile form |
| PUT | /profile | Logged-in User | Update profile |

## Screenshots

## Future Enhancements