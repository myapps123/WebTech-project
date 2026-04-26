const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticateToken } = require('../middleware/auth');

// Get all reviews
router.get('/', reviewController.getAllReviews);

// Get review by ID
router.get('/:id', reviewController.getReviewById);

// Get reviews by course
router.get('/course/:courseId', reviewController.getReviewsByCourse);

// Create review (protected)
router.post('/', authenticateToken, reviewController.createReview);

// Update review (protected)
router.put('/:id', authenticateToken, reviewController.updateReview);

// Delete review (protected)
router.delete('/:id', authenticateToken, reviewController.deleteReview);

// Mark review as helpful
router.post('/:id/helpful', reviewController.markHelpful);

module.exports = router;