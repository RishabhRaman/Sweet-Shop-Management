import { SweetRepository } from '../repositories/sweetRepository.js';
import { AppError } from '../utils/errorHandler.js';

/**
 * Sweet Service - Business logic layer for sweets
 */
export class SweetService {
  constructor() {
    this.sweetRepository = new SweetRepository();
  }

  /**
   * Create a new sweet
   * @param {Object} sweetData - Sweet data
   * @returns {Promise<Object>} Created sweet
   */
  async createSweet(sweetData) {
    return await this.sweetRepository.create(sweetData);
  }

  /**
   * Get all sweets with optional filters
   * @param {Object} filters - Search filters
   * @returns {Promise<Array>} Array of sweets
   */
  async getSweets(filters = {}) {
    return await this.sweetRepository.findAll(filters);
  }

  /**
   * Get sweet by ID
   * @param {string} id - Sweet ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Sweet document
   */
  async getSweetById(id, userId) {
    const sweet = await this.sweetRepository.findByIdAndUser(id, userId);
    if (!sweet) {
      throw new AppError('Sweet not found', 404);
    }
    return sweet;
  }

  /**
   * Update sweet by ID
   * @param {string} id - Sweet ID
   * @param {Object} updateData - Data to update
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Updated sweet
   */
  async updateSweet(id, updateData, userId) {
    const sweet = await this.sweetRepository.updateByIdAndUser(id, updateData, userId);
    if (!sweet) {
      throw new AppError('Sweet not found', 404);
    }
    return sweet;
  }

  /**
   * Delete sweet by ID
   * @param {string} id - Sweet ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Deleted sweet
   */
  async deleteSweet(id, userId) {
    const sweet = await this.sweetRepository.deleteByIdAndUser(id, userId);
    if (!sweet) {
      throw new AppError('Sweet not found', 404);
    }
    return sweet;
  }

  /**
   * Purchase sweet (decrease quantity)
   * @param {string} id - Sweet ID
   * @param {number} quantity - Quantity to purchase
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Updated sweet
   */
  async purchaseSweet(id, quantity = 1, userId) {
    // Get current sweet
    const sweet = await this.sweetRepository.findByIdAndUser(id, userId);
    if (!sweet) {
      throw new AppError('Sweet not found', 404);
    }

    // Check if enough quantity available
    if (sweet.quantity < quantity) {
      throw new AppError('Insufficient quantity available', 400);
    }

    if (sweet.quantity === 0) {
      throw new AppError('Sweet is out of stock', 400);
    }

    // Decrease quantity
    const updatedSweet = await this.sweetRepository.decreaseQuantityAndUser(id, quantity, userId);
    return updatedSweet;
  }

  /**
   * Restock sweet (increase quantity) - ADMIN only
   * @param {string} id - Sweet ID
   * @param {number} quantity - Quantity to add
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Updated sweet
   */
  async restockSweet(id, quantity, userId) {
    const sweet = await this.sweetRepository.findByIdAndUser(id, userId);
    if (!sweet) {
      throw new AppError('Sweet not found', 404);
    }

    // Increase quantity
    const updatedSweet = await this.sweetRepository.increaseQuantityAndUser(id, quantity, userId);
    return updatedSweet;
  }
}

