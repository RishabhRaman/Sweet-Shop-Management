import mongoose from 'mongoose';
import { config } from './env.js';

/**
 * MongoDB connection configuration
 * Note: Connection is not established here - it will be done in server.js
 */
export const connectDB = async () => {
  try {
    if (!config.mongodb.uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(config.mongodb.uri, {
      // Mongoose 6+ options
    });

    console.log('✅ MongoDB Atlas connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB disconnected');
  } catch (error) {
    console.error('❌ MongoDB disconnection error:', error.message);
  }
};

