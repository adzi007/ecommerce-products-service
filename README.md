# Ecommerce Product Service
The **Product Service** is a microservice designed to handle **CRUD operations** for products, **stock validation** for orders, and **caching** for product details. It acts as a backend API for both **public frontend applications** and **other microservices**, ensuring efficient and consistent product management.

This service uses **Redis** for **locking transactions** to prevent race conditions during stock validation and **caching product details** to improve performance. It is built with **Nest.js**, uses **MySQL** as the primary database, and runs in a **Dockerized environment** for scalability and ease of deployment.

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Architecture](#architecture)
- [Screenshots / Examples](#screenshots--examples)
- [Deployment](#deployment)
- [License](#license)

## Features
- Manage product
- Retrieve cart product
- Ensures stock locking with Redis
- Validate stock decrement 

## Tech Stack
- Bun
- Nest.js
- Drizzle
- Redis
- Mysql
- Docker + Docker Compose

## Getting Started

### Prerequisites
- Docker
- Go 1.21+

## Running Locally (Docker)

1. Clone the project
```bash
git https://github.com/adzi007/ecommerce-products-service.git
cd ecommerce-products-service
```
2. CD into the project and create an .env or edit from .env.example file following with fields bellow
```
DB_HOST=ecommerce-products-db
DB_USERNAME=YOUR_DB_USERBANE
DB_PASSWORD=YOUR_DB_PASSWORD
DB_NAME=YOUR_DB_NAME
DATABASE_URL=mysql://YOUR_DB_USERBANE:YOUR_DB_PASSWORD@ecommerce-products-db:3307/ecommerce_app
AUTH_SERVER_URL=
REALM=
CLIENT_ID=
SECRET=
REDIS_HOST=ecommerce-redis
REDIS_PORT=6379
```

3. Build container
```
docker-compose up --build
```

The App will be running at `http://localhost:5001`

## Database Migration
1. Enter the ecommerce-products-service container and executing database migration command
```
docker exec -it ecommerce-products-service /bin/bash
```

2. Execute migration database
```
mysql -h db -u root -p${DB_PASSWORD} ${DB_NAME} < ./drizzle/0000_purple_power_pack.sql
```
## API Documentation
comming soon
