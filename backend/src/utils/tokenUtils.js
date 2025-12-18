const jwt = require('jsonwebtoken');
const logger = require('./logger');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

/**
 * Generate JWT token
 * @param {string} userId - User ID
 * @param {string} role - User role
 * @returns {string} JWT token
 */
const generateToken = (userId, role) => {
  try {
    const token = jwt.sign(
      {
        id: userId,
        role: role,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRY,
        issuer: 'waste-pickup-app',
        subject: userId.toString(),
      }
    );
    return token;
  } catch (error) {
    logger.error(`Token generation error: ${error.message}`);
    throw error;
  }
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {object|null} Decoded token or null if invalid
 */
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      logger.warn(`Token expired: ${error.message}`);
    } else if (error.name === 'JsonWebTokenError') {
      logger.warn(`Invalid token: ${error.message}`);
    } else {
      logger.error(`Token verification error: ${error.message}`);
    }
    return null;
  }
};

/**
 * Decode token without verification
 * @param {string} token - JWT token
 * @returns {object|null} Decoded token or null if invalid
 */
const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    logger.error(`Token decode error: ${error.message}`);
    return null;
  }
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if token is expired
 */
const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  return decoded.exp * 1000 < Date.now();
};

module.exports = {
  generateToken,
  verifyToken,
  decodeToken,
  isTokenExpired,
};