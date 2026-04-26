const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

// Get all users
router.get('/', userController.getAllUsers);

// Get user by ID
router.get('/:id', userController.getUserById);

// Update user profile (protected)
router.put('/:id', authenticateToken, userController.updateUser);

// Delete user (protected)
router.delete('/:id', authenticateToken, userController.deleteUser);

// Get user's enrolled courses
router.get('/:id/courses', userController.getUserCourses);

// Get instructor details
router.get('/:id/instructor-profile', userController.getInstructorProfile);

module.exports = router;