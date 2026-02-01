NestJS Business Backend

A modular backend application built with NestJS, showcasing real-world business logic including e-commerce workflows, payments, inventory management, and content (news) management.

This project is designed as a portfolio-grade backend system, focusing on clean architecture, transactional consistency, and realistic business flows.

🚀 Key Features
🔐 Authentication

JWT-based authentication

Simple credential validation

Protected routes using guards

🛒 E-commerce Core

Product catalog with categories

Shopping cart with item aggregation

Order creation as immutable snapshots

Checkout flow with inventory reservation

📦 Inventory Management

Stock initialization per product

Inventory reservation during checkout

Final stock confirmation after successful payment

Reservation cancellation on failed payments

💳 Payments

Stripe PaymentIntent integration (test mode)

Atomic payment confirmation using database transactions

Idempotent payment confirmation handling

📰 News / Content Module

News CRUD functionality

Image attachment support

Independent content domain (separate from e-commerce)

🧩 Architecture Overview

This project follows a modular architecture, where each domain is isolated into its own module:

auth – authentication and authorization

products – product catalog and categories

cart – user shopping cart

orders – checkout and order lifecycle

payments – payment creation and confirmation

inventory – stock management and reservation

news – content and media management

🔁 Business Flow (E-commerce)

User adds products to cart

Checkout creates an immutable order snapshot

Inventory stock is reserved (not reduced yet)

PaymentIntent is created via Stripe

On successful payment:

Inventory is confirmed

Order is marked as PAID

All critical operations are executed atomically using transactions

🛠️ Tech Stack

NestJS

TypeORM

MySQL

Stripe API

JWT Authentication

Postman (manual API testing)

⚙️ Setup & Installation
1️⃣ Clone repository
git clone https://github.com/nikusha555/nestjs-business-backend.git
cd nestjs-business-backend

2️⃣ Install dependencies
npm install

3️⃣ Environment variables

Create .env file based on .env.example:

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=your_password
DB_NAME=your_database

JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_...

4️⃣ Run application
npm run start:dev

🧪 Testing

This project is primarily focused on business logic and architecture.
API endpoints were tested manually using Postman.

📌 Notes

Password hashing is intentionally omitted for simplicity

Stripe integration runs in test mode

Inventory updates occur only after successful payment

The project emphasizes clarity, separation of concerns, and data consistency

👤 Author

Nikusha
Backend / Full-Stack Developer
Focused on scalable backend systems and clean architecture.

💬 Why This Project Exists

This project was built to demonstrate:

Real-world backend problem solving

Proper handling of payments and inventory

Transactional consistency

Modular NestJS architecture