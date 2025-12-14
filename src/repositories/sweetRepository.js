import { Sweet } from '../models/Sweet.js';

/**
 * Sweet Repository - Data access layer for Sweet model
 */
export class SweetRepository {
  /**
   * Create a new sweet
   * @param {Object} sweetData - Sweet data
   * @returns {Promise<Object>} Created sweet document
   */
  async create(sweetData) {
    const sweet = new Sweet(sweetData);
    return await sweet.save();
  }

  /**
   * Find all sweets
   * @param {Object} filters - Search filters
   * @returns {Promise<Array>} Array of sweet documents
   */
  async findAll(filters = {}) {
    const query = {};

    if (filters.userId) {
      query.user = filters.userId;
    }

    if (filters.name) {
      query.name = { $regex: filters.name, $options: 'i' };
    }

    if (filters.category) {
      query.category = { $regex: filters.category, $options: 'i' };
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.price = {};
      if (filters.minPrice !== undefined) {
        query.price.$gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        query.price.$lte = filters.maxPrice;
      }
    }

    return await Sweet.find(query).sort({ createdAt: -1 });
  }

  /**
   * Find sweet by ID and user
   * @param {string} id - Sweet ID
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} Sweet document or null
   */
  async findByIdAndUser(id, userId) {
    return await Sweet.findOne({ _id: id, user: userId });
  }

  /**
   * Update sweet by ID and user
   * @param {string} id - Sweet ID
   * @param {Object} updateData - Data to update
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} Updated sweet document or null
   */
  async updateByIdAndUser(id, updateData, userId) {
    return await Sweet.findOneAndUpdate(
      { _id: id, user: userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  /**
   * Delete sweet by ID and user
   * @param {string} id - Sweet ID
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} Deleted sweet document or null
   */
  async deleteByIdAndUser(id, userId) {
    return await Sweet.findOneAndDelete({ _id: id, user: userId });
  }

  /**
   * Decrease quantity (purchase)
   * @param {string} id - Sweet ID
   * @param {number} quantity - Quantity to decrease
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} Updated sweet document or null
   */
  async decreaseQuantityAndUser(id, quantity, userId) {
    return await Sweet.findOneAndUpdate(
      { _id: id, user: userId },
      { $inc: { quantity: -quantity } },
      { new: true }
    );
  }

  /**
   * Increase quantity (restock)
   * @param {string} id - Sweet ID
   * @param {number} quantity - Quantity to increase
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} Updated sweet document or null
   */
  async increaseQuantityAndUser(id, quantity, userId) {
    return await Sweet.findOneAndUpdate(
      { _id: id, user: userId },
      { $inc: { quantity: quantity } },
      { new: true }
    );
  }
}

