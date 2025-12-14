import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app.js';
import { User } from '../../models/User.js';
import { Sweet } from '../../models/Sweet.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../../config/env.js';

describe('Sweet CRUD Operations', () => {
  const testDbUri = process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/sweet-shop-test';
  let userToken;
  let adminToken;
  let userId;
  let adminId;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(testDbUri);
    }
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Sweet.deleteMany({});
  });

  beforeEach(async () => {
    await Sweet.deleteMany({});
    await User.deleteMany({});

    // Create regular user
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: 'testuser',
      email: 'user@example.com',
      password: hashedPassword,
      role: 'USER',
    });
    userId = user._id.toString();

    // Create admin user
    const admin = await User.create({
      username: 'adminuser',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN',
    });
    adminId = admin._id.toString();

    // Generate tokens
    userToken = jwt.sign(
      { userId, email: 'user@example.com', role: 'USER' },
      config.jwt.secret,
      { expiresIn: '1h' }
    );

    adminToken = jwt.sign(
      { userId: adminId, email: 'admin@example.com', role: 'ADMIN' },
      config.jwt.secret,
      { expiresIn: '1h' }
    );
  });

  describe('POST /api/sweets - Create Sweet', () => {
    test('should create a new sweet with valid data (authenticated)', async () => {
      const sweetData = {
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 5.99,
        quantity: 100,
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send(sweetData)
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('sweet');
      expect(response.body.sweet.name).toBe(sweetData.name);
      expect(response.body.sweet.category).toBe(sweetData.category);
      expect(response.body.sweet.price).toBe(sweetData.price);
      expect(response.body.sweet.quantity).toBe(sweetData.quantity);
    });

    test('should return 401 if not authenticated', async () => {
      const sweetData = {
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 5.99,
        quantity: 100,
      };

      const response = await request(app)
        .post('/api/sweets')
        .send(sweetData)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 if validation fails', async () => {
      const sweetData = {
        name: '', // Invalid: empty name
        category: 'Chocolate',
        price: -5, // Invalid: negative price
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send(sweetData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/sweets - Get All Sweets', () => {
    beforeEach(async () => {
      // Create test sweets
      await Sweet.create([
        { name: 'Chocolate Bar', category: 'Chocolate', price: 5.99, quantity: 100 },
        { name: 'Gummy Bears', category: 'Candy', price: 3.99, quantity: 50 },
        { name: 'Lollipop', category: 'Candy', price: 1.99, quantity: 200 },
      ]);
    });

    test('should get all sweets (authenticated)', async () => {
      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('sweets');
      expect(response.body.sweets).toHaveLength(3);
      expect(response.body).toHaveProperty('count', 3);
    });

    test('should return 401 if not authenticated', async () => {
      await request(app)
        .get('/api/sweets')
        .expect(401);
    });

    test('should filter sweets by name', async () => {
      const response = await request(app)
        .get('/api/sweets/search?name=chocolate')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.sweets).toHaveLength(1);
      expect(response.body.sweets[0].name).toContain('Chocolate');
    });

    test('should filter sweets by category', async () => {
      const response = await request(app)
        .get('/api/sweets/search?category=Candy')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.sweets).toHaveLength(2);
      expect(response.body.sweets.every(s => s.category === 'Candy')).toBe(true);
    });

    test('should filter sweets by price range', async () => {
      const response = await request(app)
        .get('/api/sweets/search?minPrice=2&maxPrice=5')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.sweets.length).toBeGreaterThan(0);
      response.body.sweets.forEach(sweet => {
        expect(sweet.price).toBeGreaterThanOrEqual(2);
        expect(sweet.price).toBeLessThanOrEqual(5);
      });
    });
  });

  describe('GET /api/sweets/:id - Get Sweet by ID', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Test Sweet',
        category: 'Test',
        price: 10.99,
        quantity: 50,
      });
      sweetId = sweet._id.toString();
    });

    test('should get sweet by ID (authenticated)', async () => {
      const response = await request(app)
        .get(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('sweet');
      expect(response.body.sweet._id).toBe(sweetId);
    });

    test('should return 404 if sweet not found', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const response = await request(app)
        .get(`/api/sweets/${fakeId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/sweets/:id - Update Sweet', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Test Sweet',
        category: 'Test',
        price: 10.99,
        quantity: 50,
      });
      sweetId = sweet._id.toString();
    });

    test('should update sweet (authenticated)', async () => {
      const updateData = {
        name: 'Updated Sweet',
        price: 15.99,
      };

      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.sweet.name).toBe(updateData.name);
      expect(response.body.sweet.price).toBe(updateData.price);
    });

    test('should return 404 if sweet not found', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      await request(app)
        .put(`/api/sweets/${fakeId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Updated' })
        .expect(404);
    });
  });

  describe('DELETE /api/sweets/:id - Delete Sweet', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Test Sweet',
        category: 'Test',
        price: 10.99,
        quantity: 50,
      });
      sweetId = sweet._id.toString();
    });

    test('should delete sweet (ADMIN only)', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      
      // Verify sweet is deleted
      const deleted = await Sweet.findById(sweetId);
      expect(deleted).toBeNull();
    });

    test('should return 403 if user is not ADMIN', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });

    test('should return 404 if sweet not found', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      await request(app)
        .delete(`/api/sweets/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });

  describe('POST /api/sweets/:id/purchase - Purchase Sweet', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Test Sweet',
        category: 'Test',
        price: 10.99,
        quantity: 50,
      });
      sweetId = sweet._id.toString();
    });

    test('should purchase sweet and decrease quantity', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 5 })
        .expect(200);

      expect(response.body.sweet.quantity).toBe(45);

      // Verify in database
      const updated = await Sweet.findById(sweetId);
      expect(updated.quantity).toBe(45);
    });

    test('should purchase 1 by default if quantity not specified', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({})
        .expect(200);

      expect(response.body.sweet.quantity).toBe(49);
    });

    test('should return 400 if quantity is zero', async () => {
      await Sweet.findByIdAndUpdate(sweetId, { quantity: 0 });

      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 1 })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('stock');
    });

    test('should return 400 if insufficient quantity', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 100 })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Insufficient');
    });
  });

  describe('POST /api/sweets/:id/restock - Restock Sweet', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Test Sweet',
        category: 'Test',
        price: 10.99,
        quantity: 50,
      });
      sweetId = sweet._id.toString();
    });

    test('should restock sweet and increase quantity (ADMIN only)', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 25 })
        .expect(200);

      expect(response.body.sweet.quantity).toBe(75);

      // Verify in database
      const updated = await Sweet.findById(sweetId);
      expect(updated.quantity).toBe(75);
    });

    test('should return 403 if user is not ADMIN', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 25 })
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 if quantity is missing', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('should return 404 if sweet not found', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      await request(app)
        .post(`/api/sweets/${fakeId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 25 })
        .expect(404);
    });
  });
});

