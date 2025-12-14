import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

/**
 * JWT Utility - Token generation and verification
 */
export class JWTUtil {
  /**
   * Generate JWT token for user
   * @param {Object} payload - Token payload (user data)
   * @returns {string} JWT token
   */
  static generateToken(payload) {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
  }

  /**
   * Verify JWT token
   * @param {string} token - JWT token to verify
   * @returns {Object} Decoded token payload
   */
  static verifyToken(token) {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}

