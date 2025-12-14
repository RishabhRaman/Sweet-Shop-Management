import express from 'express';
import { SweetController } from '../controllers/sweetController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validate } from '../middlewares/validation.js';
import {
  createSweetSchema,
  updateSweetSchema,
  purchaseSchema,
  restockSchema,
} from '../validations/sweetValidation.js';

const router = express.Router();
const sweetController = new SweetController();

// All routes require authentication
router.use(authenticate);

/**
 * POST /api/sweets
 * Create a new sweet (requires JWT)
 */
router.post('/', validate(createSweetSchema), sweetController.create);

/**
 * GET /api/sweets
 * GET /api/sweets/search?name=&category=&minPrice=&maxPrice=
 * Get all sweets with optional search/filter (requires JWT)
 */
router.get('/', sweetController.getAll);
router.get('/search', sweetController.getAll);

/**
 * GET /api/sweets/:id
 * Get sweet by ID (requires JWT)
 */
router.get('/:id', sweetController.getById);

/**
 * PUT /api/sweets/:id
 * Update sweet by ID (requires JWT)
 */
router.put('/:id', validate(updateSweetSchema), sweetController.update);

/**
 * DELETE /api/sweets/:id
 * Delete sweet by ID (requires JWT, ADMIN only)
 */
router.delete('/:id', authorize('ADMIN'), sweetController.delete);

/**
 * POST /api/sweets/:id/purchase
 * Purchase sweet - decrease quantity (requires JWT)
 */
router.post('/:id/purchase', validate(purchaseSchema), sweetController.purchase);

/**
 * POST /api/sweets/:id/restock
 * Restock sweet - increase quantity (requires JWT, ADMIN only)
 */
router.post('/:id/restock', authorize('ADMIN'), validate(restockSchema), sweetController.restock);

export default router;

