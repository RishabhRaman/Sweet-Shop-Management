import { AuthService } from '../services/authService.js';

/**
 * Auth Controller - HTTP request handlers for authentication
 */
export class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Register a new user
   * POST /api/auth/register
   */
  register = async (req, res, next) => {
    try {
      const user = await this.authService.register(req.body);

      res.status(201).json({
        message: 'User registered successfully',
        user,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Login user
   * POST /api/auth/login
   */
  login = async (req, res, next) => {
    try {
      const { user, token } = await this.authService.login(req.body);

      res.status(200).json({
        message: 'Login successful',
        token,
        user,
      });
    } catch (error) {
      next(error);
    }
  };
}

