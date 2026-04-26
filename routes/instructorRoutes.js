const express = require('express');
const router = express.Router();
const instructorController = require('../controllers/instructorController');

// Get all instructors
router.get('/', instructorController.getAllInstructors);

// Get instructor by ID
router.get('/:id', instructorController.getInstructorById);

// Get instructor's courses
router.get('/:id/courses', instructorController.getInstructorCourses);

// Get instructor statistics
router.get('/:id/statistics', instructorController.getInstructorStats);

module.exports = router;