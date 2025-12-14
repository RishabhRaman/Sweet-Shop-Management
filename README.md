# Sweet Shop Management System

A complete full-stack Sweet Shop Management System built with Node.js, Express, MongoDB Atlas, and React, following Test-Driven Development (TDD) principles and clean architecture.

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Language**: JavaScript (ES6+)
- **Framework**: Express.js
- **Database**: MongoDB Atlas (cloud-hosted)
- **ODM**: Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: Zod
- **Testing**: Jest + Supertest
- **Environment Config**: dotenv

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: Context API / Zustand
- **Testing**: Jest + React Testing Library

## Project Structure

```
sweet-shop-management/
 ├── src/                   # Backend source code
 │    ├── app.js           # Express app configuration
 │    ├── server.js         # Server entry point
 │    ├── config/           # Configuration files
 │    ├── models/           # Mongoose models
 │    ├── repositories/     # Data access layer
 │    ├── services/         # Business logic layer
 │    ├── controllers/      # HTTP request handlers
 │    ├── routes/           # API route definitions
 │    ├── middlewares/      # Express middlewares
 │    ├── validations/      # Zod validation schemas
 │    ├── utils/            # Utility functions
 │    └── tests/            # Test files
 └── client/                # Frontend React application
      ├── src/
      │    ├── pages/       # React pages (Register, Login, Dashboard)
      │    ├── components/  # React components
      │    ├── contexts/    # React Context (Auth)
      │    ├── services/    # API service layer
      │    └── App.jsx      # Main App component
      ├── index.html
      └── vite.config.js    # Vite configuration
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (free tier works)
- npm or yarn

### 1. Clone and Install

```bash
# Install dependencies
npm install
```

### 2. MongoDB Atlas Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user (Database Access)
4. Whitelist your IP address (Network Access)
5. Get your connection string (Connect → Connect your application)
6. Copy the connection string

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sweet-shop?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
```

**Important**: Replace `username`, `password`, and `cluster` with your actual MongoDB Atlas credentials.

### 4. Run the Application

**Backend (API Server):**
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```
The API server will start on `http://localhost:3000`

**Frontend (React App):**
```bash
# Development mode
npm run client

# Or from the client directory
cd client
npm run dev
```
The frontend will start on `http://localhost:5173`

**Note:** Make sure both backend and frontend are running. The frontend will automatically proxy API requests to the backend.

### 5. Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "...",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "USER",
    "createdAt": "..."
  }
}
```

#### POST /api/auth/login
Login and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "_id": "...",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

### Sweets Endpoints (JWT Protected)

#### POST /api/sweets
Create a new sweet (requires JWT).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "name": "Chocolate Bar",
  "category": "Chocolate",
  "price": 5.99,
  "quantity": 100
}
```

#### GET /api/sweets
Get all sweets (requires JWT).

#### GET /api/sweets/search?name=&category=&minPrice=&maxPrice=
Search and filter sweets (requires JWT).

#### PUT /api/sweets/:id
Update a sweet (requires JWT).

#### DELETE /api/sweets/:id
Delete a sweet (requires JWT, ADMIN only).

### Inventory Endpoints (JWT Protected)

#### POST /api/sweets/:id/purchase
Purchase a sweet (decreases quantity, requires JWT).

#### POST /api/sweets/:id/restock
Restock a sweet (increases quantity, requires JWT, ADMIN only).

## Testing Strategy

This project follows **Test-Driven Development (TDD)** with the Red → Green → Refactor cycle:

1. **Red**: Write failing tests first
2. **Green**: Implement minimal code to pass tests
3. **Refactor**: Improve code while keeping tests green

### Test Coverage

Tests cover:
- ✅ Happy paths
- ✅ Validation errors
- ✅ Authentication failures
- ✅ Authorization failures
- ✅ Edge cases
- ✅ Database operations

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## Architecture Principles

### Clean Architecture Layers

1. **Controllers**: Handle HTTP requests/responses only
2. **Services**: Contain all business logic
3. **Repositories**: Interact with Mongoose models
4. **Models**: Define data schemas
5. **Validations**: Input validation schemas
6. **Middlewares**: Request processing (auth, validation, etc.)

### Rules

- ❌ No database logic in controllers
- ❌ No business logic in controllers
- ✅ Centralized error handling
- ✅ Async/await everywhere
- ✅ SOLID principles

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT-based authentication
- ✅ Role-based authorization (USER/ADMIN)
- ✅ Input validation with Zod
- ✅ Secure environment variables
- ✅ No password exposure in responses

## My AI Usage

### AI Tools Used
- **ChatGPT** (via Cursor AI) - Used throughout the development process

### How AI Was Used

1. **Project Initialization**: AI assisted in setting up the complete project structure, package.json configuration, and Jest setup for ES modules.

2. **Architecture Design**: AI helped design the clean architecture structure with proper separation of concerns (controllers, services, repositories).

3. **Test Writing**: AI generated comprehensive test suites following TDD principles, including happy paths, validation errors, and edge cases.

4. **Code Generation**: AI generated boilerplate code for models, validations, error handling, and middleware following best practices.

5. **Documentation**: AI assisted in creating comprehensive README with setup instructions and API documentation.

### Impact on Workflow

- **Faster Development**: Significantly reduced time spent on boilerplate code and configuration
- **Best Practices**: AI ensured adherence to industry standards and clean code principles
- **Comprehensive Testing**: AI helped generate thorough test coverage from the start
- **Error Prevention**: AI caught potential issues early in the development process


## License

ISC

## Contributing

This is a TDD learning project. Contributions should follow the Red → Green → Refactor cycle.

# Sweet-Shop-Management
