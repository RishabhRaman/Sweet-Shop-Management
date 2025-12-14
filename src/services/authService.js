import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/userRepository.js';
import { AppError } from '../utils/errorHandler.js';
import { JWTUtil } from '../utils/jwt.js';

/**
 * Auth Service - Business logic layer for authentication
 */
export class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Created user (without password)
   */
  async register(userData) {
    const { username, email, password } = userData;

    // Check if email already exists
    const emailExists = await this.userRepository.emailExists(email);
    if (emailExists) {
      throw new AppError('email already exists', 409);
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await this.userRepository.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'USER',
    });

    // Return user without password
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
  }

  /**
   * Login user and generate JWT token
   * @param {Object} loginData - Login credentials (email, password)
   * @returns {Promise<Object>} User data and JWT token
   */
  async login(loginData) {
    const { email, password } = loginData;

    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate JWT token
    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    const token = JWTUtil.generateToken(tokenPayload);

    // Return user without password and token
    const userObject = user.toObject();
    delete userObject.password;
    return {
      user: userObject,
      token,
    };
  }
}

