const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const { authenticateToken } = require('../middleware/auth');

// Get all enrollments (protected)
router.get('/', authenticateToken, enrollmentController.getAllEnrollments);

// Get enrollment by ID
router.get('/:id', enrollmentController.getEnrollmentById);

// Enroll in course (protected)
router.post('/', authenticateToken, enrollmentController.enrollCourse);

// Update enrollment (protected)
router.put('/:id', authenticateToken, enrollmentController.updateEnrollment);

// Get student enrollments
router.get('/student/:studentId', enrollmentController.getStudentEnrollments);

// Check if student is enrolled
router.get('/check/:courseId', authenticateToken, enrollmentController.checkEnrollment);

// Complete course
router.post('/:id/complete', authenticateToken, enrollmentController.completeCourse);

module.exports = router;