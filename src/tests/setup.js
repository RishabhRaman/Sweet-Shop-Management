import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Sweet } from '../models/Sweet.js';

// Global cleanup before all test suites
beforeAll(async () => {
  // Ensure clean state before all tests
  const testDbUri = process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/sweet-shop-test';
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(testDbUri);
  }
  // Clean all collections
  await User.deleteMany({});
  await Sweet.deleteMany({});
});

// Global cleanup after all test suites
afterAll(async () => {
  await User.deleteMany({});
  await Sweet.deleteMany({});
  await mongoose.connection.close();
});

