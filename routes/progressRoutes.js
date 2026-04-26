const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { authenticateToken } = require('../middleware/auth');

// Get all progress (protected)
router.get('/', authenticateToken, progressController.getAllProgress);

// Get progress by ID
router.get('/:id', progressController.getProgressById);

// Create progress (protected)
router.post('/', authenticateToken, progressController.createProgress);

// Update progress (protected)
router.put('/:id', authenticateToken, progressController.updateProgress);

// Get enrollment progress
router.get('/enrollment/:enrollmentId', progressController.getEnrollmentProgress);

// Mark lesson as completed
router.post('/lesson/:lessonId/complete', authenticateToken, progressController.markLessonComplete);

module.exports = router;