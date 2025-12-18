const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/me', authenticateToken, authController.getCurrentUser);
router.put('/profile', authenticateToken, authController.updateProfile);
router.post('/logout', authenticateToken, authController.logout);

// Admin only routes
router.get('/users', authenticateToken, authorize('admin'), (req, res) => {
  res.json({ message: 'List all users' });
});

router.put('/users/:userId/role', authenticateToken, authorize('admin'), (req, res) => {
  res.json({ message: 'Update user role' });
});

router.delete('/users/:userId', authenticateToken, authorize('admin'), (req, res) => {
  res.json({ message: 'Delete user' });
});

module.exports = router;