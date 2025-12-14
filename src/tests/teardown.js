import mongoose from 'mongoose';

/**
 * Global teardown - runs after all tests complete
 */
export default async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    console.log('✅ Test database connection closed');
  }
};

