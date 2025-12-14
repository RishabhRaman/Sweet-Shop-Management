import { SweetService } from '../services/sweetService.js';

/**
 * Sweet Controller - HTTP request handlers for sweets
 */
export class SweetController {
  constructor() {
    this.sweetService = new SweetService();
  }

  /**
   * Create a new sweet
   * POST /api/sweets
   */
  create = async (req, res, next) => {
    try {
      const sweet = await this.sweetService.createSweet(req.body);
      res.status(201).json({
        message: 'Sweet created successfully',
        sweet,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all sweets with optional search/filter
   * GET /api/sweets
   * GET /api/sweets/search?name=&category=&minPrice=&maxPrice=
   */
  getAll = async (req, res, next) => {
    try {
      const filters = {
        name: req.query.name,
        category: req.query.category,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined,
      };

      // Remove undefined values
      Object.keys(filters).forEach(key => {
        if (filters[key] === undefined) {
          delete filters[key];
        }
      });

      const sweets = await this.sweetService.getSweets(filters);
      res.status(200).json({
        message: 'Sweets retrieved successfully',
        count: sweets.length,
        sweets,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get sweet by ID
   * GET /api/sweets/:id
   */
  getById = async (req, res, next) => {
    try {
      const sweet = await this.sweetService.getSweetById(req.params.id);
      res.status(200).json({
        message: 'Sweet retrieved successfully',
        sweet,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update sweet by ID
   * PUT /api/sweets/:id
   */
  update = async (req, res, next) => {
    try {
      const sweet = await this.sweetService.updateSweet(req.params.id, req.body);
      res.status(200).json({
        message: 'Sweet updated successfully',
        sweet,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete sweet by ID
   * DELETE /api/sweets/:id
   */
  delete = async (req, res, next) => {
    try {
      const sweet = await this.sweetService.deleteSweet(req.params.id);
      res.status(200).json({
        message: 'Sweet deleted successfully',
        sweet,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Purchase sweet (decrease quantity)
   * POST /api/sweets/:id/purchase
   */
  purchase = async (req, res, next) => {
    try {
      const quantity = req.body.quantity || 1;
      const sweet = await this.sweetService.purchaseSweet(req.params.id, quantity);
      res.status(200).json({
        message: 'Purchase successful',
        sweet,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Restock sweet (increase quantity) - ADMIN only
   * POST /api/sweets/:id/restock
   */
  restock = async (req, res, next) => {
    try {
      const sweet = await this.sweetService.restockSweet(req.params.id, req.body.quantity);
      res.status(200).json({
        message: 'Restock successful',
        sweet,
      });
    } catch (error) {
      next(error);
    }
  };
}

