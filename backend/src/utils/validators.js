/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password
 * @param {string} password - Password to validate
 * @returns {boolean} True if valid password (minimum 6 characters)
 */
const validatePassword = (password) => {
  return password && password.length >= 6;
};

/**
 * Validate phone number
 * @param {string} phoneNumber - Phone number to validate
 * @returns {boolean} True if valid phone number
 */
const validatePhoneNumber = (phoneNumber) => {
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return phoneRegex.test(phoneNumber);
};

/**
 * Validate user role
 * @param {string} role - Role to validate
 * @returns {boolean} True if valid role
 */
const validateRole = (role) => {
  const validRoles = ['customer', 'collector', 'admin'];
  return validRoles.includes(role);
};

/**
 * Validate MongoDB ObjectId
 * @param {string} id - ID to validate
 * @returns {boolean} True if valid ObjectId
 */
const validateObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Sanitize user input to prevent XSS
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

/**
 * Validate address object
 * @param {object} address - Address to validate
 * @returns {boolean} True if valid address
 */
const validateAddress = (address) => {
  if (!address || typeof address !== 'object') return false;
  return !!(address.street || address.city || address.state || address.zipCode);
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateRole,
  validateObjectId,
  sanitizeInput,
  validateAddress,
};