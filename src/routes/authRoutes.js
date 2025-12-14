import express from 'express';
import { AuthController } from '../controllers/authController.js';
import { validate } from '../middlewares/validation.js';
import { registerSchema, loginSchema } from '../validations/authValidation.js';

const router = express.Router();
const authController = new AuthController();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', validate(registerSchema), authController.register);

/**
 * POST /api/auth/login
 * Login user and get JWT token
 */
router.post('/login', validate(loginSchema), authController.login);

export default router;

