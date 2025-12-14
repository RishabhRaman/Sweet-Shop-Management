import { JWTUtil } from '../utils/jwt.js';
import { AppError } from '../utils/errorHandler.js';

/**
 * JWT Authentication Middleware
 * Verifies JWT token and attaches user info to request
 */
export const authenticate = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authentication required. Please provide a valid token.', 401);
    }

    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      throw new AppError('Authentication required. Please provide a valid token.', 401);
    }

    // Verify token
    const decoded = JWTUtil.verifyToken(token);

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Invalid or expired token', 401));
    }
  }
};

/**
 * Role-based Authorization Middleware
 * Checks if user has required role
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('Insufficient permissions. Admin access required.', 403));
    }

    next();
  };
};

