const bcrypt = require('bcryptjs');

/**
 * Hash a password
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error(`Password hashing error: ${error.message}`);
  }
};

/**
 * Compare plain password with hashed password
 * @param {string} plainPassword - Plain text password
 * @param {string} hashedPassword - Hashed password
 * @returns {Promise<boolean>} True if passwords match
 */
const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    throw new Error(`Password comparison error: ${error.message}`);
  }
};

/**
 * Generate password reset token
 * @returns {string} Random token
 */
const generateResetToken = () => {
  return require('crypto').randomBytes(32).toString('hex');
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result
 */
const validatePasswordStrength = (password) => {
  const result = {
    isStrong: true,
    errors: [],
  };

  if (password.length < 8) {
    result.isStrong = false;
    result.errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    result.isStrong = false;
    result.errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    result.isStrong = false;
    result.errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    result.isStrong = false;
    result.errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*]/.test(password)) {
    result.isStrong = false;
    result.errors.push('Password must contain at least one special character (!@#$%^&*)');
  }

  return result;
};

module.exports = {
  hashPassword,
  comparePassword,
  generateResetToken,
  validatePasswordStrength,
};