import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app.js';
import { User } from '../../models/User.js';
import bcrypt from 'bcrypt';

describe('POST /api/auth/login', () => {
  const testDbUri = process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/sweet-shop-test';

  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(testDbUri);
    }
  });

  afterAll(async () => {
    // Clean up: remove all users after all tests in this suite
    await User.deleteMany({});
    // Don't close connection here - other test files might still be running
  });

  beforeEach(async () => {
    // Clean up: remove all users before each test
    await User.deleteMany({});
  });

  describe('Happy Path', () => {
    test('should login with valid credentials and return JWT token', async () => {
      // Create a user first
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: hashedPassword,
        role: 'USER',
      });

      const loginData = {
        email: 'test@example.com',
        password: password,
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('_id');
      expect(response.body.user).toHaveProperty('username', user.username);
      expect(response.body.user).toHaveProperty('email', user.email);
      expect(response.body.user).toHaveProperty('role', user.role);
      expect(response.body.user).not.toHaveProperty('password');
      expect(typeof response.body.token).toBe('string');
      expect(response.body.token.length).toBeGreaterThan(0);
    });

    test('should login with case-insensitive email', async () => {
      // Create a user first
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: hashedPassword,
        role: 'USER',
      });

      const loginData = {
        email: 'TEST@EXAMPLE.COM',
        password: password,
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe('test@example.com');
    });

    test('should login with trimmed email', async () => {
      // Create a user first
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: hashedPassword,
        role: 'USER',
      });

      const loginData = {
        email: '  test@example.com  ',
        password: password,
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('token');
    });
  });

  describe('Validation Errors', () => {
    test('should return 400 if email is missing', async () => {
      const loginData = {
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 if password is missing', async () => {
      const loginData = {
        email: 'test@example.com',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 if email is invalid format', async () => {
      const loginData = {
        email: 'invalid-email',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Authentication Failures', () => {
    test('should return 401 if email does not exist', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Invalid');
    });

    test('should return 401 if password is incorrect', async () => {
      // Create a user first
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: hashedPassword,
        role: 'USER',
      });

      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Invalid');
    });
  });

  describe('JWT Token', () => {
    test('should generate valid JWT token with user data', async () => {
      // Create a user first
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: hashedPassword,
        role: 'USER',
      });

      const loginData = {
        email: 'test@example.com',
        password: password,
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      // Verify token is a JWT format (has 3 parts separated by dots)
      const tokenParts = response.body.token.split('.');
      expect(tokenParts.length).toBe(3);
    });

    test('should include user role in token payload', async () => {
      // Create an admin user
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        username: 'adminuser',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'ADMIN',
      });

      const loginData = {
        email: 'admin@example.com',
        password: password,
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.user.role).toBe('ADMIN');
      expect(response.body).toHaveProperty('token');
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty request body', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('should handle empty string password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: '',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });
});

