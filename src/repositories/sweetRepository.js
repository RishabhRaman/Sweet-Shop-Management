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
   * Find sweet by ID
   * @param {string} id - Sweet ID
   * @returns {Promise<Object|null>} Sweet document or null
   */
  async findById(id) {
    return await Sweet.findById(id);
  }

  /**
   * Update sweet by ID
   * @param {string} id - Sweet ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object|null>} Updated sweet document or null
   */
  async updateById(id, updateData) {
    return await Sweet.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  /**
   * Delete sweet by ID
   * @param {string} id - Sweet ID
   * @returns {Promise<Object|null>} Deleted sweet document or null
   */
  async deleteById(id) {
    return await Sweet.findByIdAndDelete(id);
  }

  /**
   * Decrease quantity (purchase)
   * @param {string} id - Sweet ID
   * @param {number} quantity - Quantity to decrease
   * @returns {Promise<Object|null>} Updated sweet document or null
   */
  async decreaseQuantity(id, quantity) {
    return await Sweet.findByIdAndUpdate(
      id,
      { $inc: { quantity: -quantity } },
      { new: true }
    );
  }

  /**
   * Increase quantity (restock)
   * @param {string} id - Sweet ID
   * @param {number} quantity - Quantity to increase
   * @returns {Promise<Object|null>} Updated sweet document or null
   */
  async increaseQuantity(id, quantity) {
    return await Sweet.findByIdAndUpdate(
      id,
      { $inc: { quantity: quantity } },
      { new: true }
    );
  }
}

