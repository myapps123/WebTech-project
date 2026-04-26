const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authenticateToken } = require('../middleware/auth');

// Get all courses
router.get('/', courseController.getAllCourses);

// Get course by ID
router.get('/:id', courseController.getCourseById);

// Create course (protected - instructor only)
router.post('/', authenticateToken, courseController.createCourse);

// Update course (protected)
router.put('/:id', authenticateToken, courseController.updateCourse);

// Delete course (protected)
router.delete('/:id', authenticateToken, courseController.deleteCourse);

// Get courses by category
router.get('/category/:categoryId', courseController.getCoursesByCategory);

// Get courses by instructor
router.get('/instructor/:instructorId', courseController.getCoursesByInstructor);

// Search courses
router.get('/search/:query', courseController.searchCourses);

// Get top rated courses
router.get('/featured/top-rated', courseController.getTopRatedCourses);

module.exports = router;