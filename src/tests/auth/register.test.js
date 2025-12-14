import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app.js';
import { User } from '../../models/User.js';

describe('POST /api/auth/register', () => {
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
    test('should register a new user with valid data', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('_id');
      expect(response.body.user).toHaveProperty('username', userData.username);
      expect(response.body.user).toHaveProperty('email', userData.email);
      expect(response.body.user).not.toHaveProperty('password');
      expect(response.body.user).toHaveProperty('role', 'USER');

      // Verify user was saved in database
      const userInDb = await User.findOne({ email: userData.email });
      expect(userInDb).toBeTruthy();
      expect(userInDb.username).toBe(userData.username);
      expect(userInDb.password).not.toBe(userData.password); // Password should be hashed
    });

    test('should set default role as USER', async () => {
      const userData = {
        username: 'testuser2',
        email: 'test2@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.user.role).toBe('USER');
    });
  });

  describe('Validation Errors', () => {
    test('should return 400 if username is missing', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 if email is missing', async () => {
      const userData = {
        username: 'testuser',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 if password is missing', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 if username is too short (less than 3 characters)', async () => {
      const userData = {
        username: 'ab',
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 if email is invalid', async () => {
      const userData = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 if password is too short (less than 6 characters)', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: '12345',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Duplicate Email', () => {
    test('should return 409 if email already exists', async () => {
      const userData = {
        username: 'testuser',
        email: 'existing@example.com',
        password: 'password123',
      };

      // Create first user
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Try to register with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'anotheruser',
          email: 'existing@example.com',
          password: 'password456',
        })
        .expect(409);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('email');
    });
  });

  describe('Password Hashing', () => {
    test('should hash password before saving to database', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Email is normalized (lowercased and trimmed) in the database
      const normalizedEmail = userData.email.toLowerCase().trim();
      const userInDb = await User.findOne({ email: normalizedEmail });
      expect(userInDb).toBeTruthy();
      expect(userInDb.password).not.toBe(userData.password);
      expect(userInDb.password.length).toBeGreaterThan(20); // bcrypt hashes are long
    });
  });

  describe('Edge Cases', () => {
    test('should trim whitespace from username and email', async () => {
      const userData = {
        username: '  testuser  ',
        email: '  TEST@EXAMPLE.COM  ',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.user.username).toBe('testuser');
      expect(response.body.user.email).toBe('test@example.com');
    });

    test('should handle empty request body', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });
});

