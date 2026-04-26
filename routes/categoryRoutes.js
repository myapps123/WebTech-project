const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateToken } = require('../middleware/auth');

// Get all categories
router.get('/', categoryController.getAllCategories);

// Get category by ID
router.get('/:id', categoryController.getCategoryById);

// Create category (protected - admin only)
router.post('/', authenticateToken, categoryController.createCategory);

// Update category (protected - admin only)
router.put('/:id', authenticateToken, categoryController.updateCategory);

// Delete category (protected - admin only)
router.delete('/:id', authenticateToken, categoryController.deleteCategory);

// Get category with courses
router.get('/:id/courses', categoryController.getCategoryWithCourses);

module.exports = router;