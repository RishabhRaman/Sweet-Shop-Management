import { User } from '../models/User.js';

/**
 * User Repository - Data access layer for User model
 * Handles all database operations related to users
 */
export class UserRepository {
  /**
   * Create a new user
   * @param {Object} userData - User data (username, email, password, role)
   * @returns {Promise<Object>} Created user document
   */
  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} User document or null
   */
  async findByEmail(email) {
    return await User.findOne({ email: email.toLowerCase().trim() });
  }

  /**
   * Find user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object|null>} User document or null
   */
  async findById(id) {
    return await User.findById(id);
  }

  /**
   * Check if email exists
   * @param {string} email - User email
   * @returns {Promise<boolean>} True if email exists
   */
  async emailExists(email) {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    return !!user;
  }
}

