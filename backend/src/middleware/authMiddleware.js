const { verifyToken } = require('../utils/tokenUtils');
const User = require('../models/User');
const logger = require('../utils/logger');

// Verify JWT token
exports.authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is missing',
      });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    // Get user from database
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'User account is inactive',
      });
    }

    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    logger.error(`Authentication error: ${error.message}`);
    res.status(403).json({
      success: false,
      message: 'Token verification failed',
    });
  }
};

// Role-based access control
exports.authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn(`Unauthorized access attempt by ${req.user.email} with role ${req.user.role}`);
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action',
      });
    }

    next();
  };
};

// Optional authentication - doesn't fail if token is missing
exports.optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next();
    }

    const decoded = verifyToken(token);
    if (decoded) {
      const user = await User.findById(decoded.id);
      if (user && user.isActive) {
        req.user = {
          id: user._id,
          email: user.email,
          role: user.role,
        };
      }
    }

    next();
  } catch (error) {
    logger.error(`Optional authentication error: ${error.message}`);
    next();
  }
};

// Check if user is owner of resource
exports.isOwner = (req, res, next) => {
  if (req.params.userId && req.user.id.toString() !== req.params.userId) {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to access this resource',
    });
  }
  next();
};