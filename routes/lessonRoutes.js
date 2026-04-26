const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');
const { authenticateToken } = require('../middleware/auth');

// Get all lessons
router.get('/', lessonController.getAllLessons);

// Get lesson by ID
router.get('/:id', lessonController.getLessonById);

// Get lessons by course
router.get('/course/:courseId', lessonController.getLessonsByCourse);

// Create lesson (protected)
router.post('/', authenticateToken, lessonController.createLesson);

// Update lesson (protected)
router.put('/:id', authenticateToken, lessonController.updateLesson);

// Delete lesson (protected)
router.delete('/:id', authenticateToken, lessonController.deleteLesson);

module.exports = router;