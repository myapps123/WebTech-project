const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const { authenticateToken } = require('../middleware/auth');

// Get all announcements
router.get('/', announcementController.getAllAnnouncements);

// Get announcement by ID
router.get('/:id', announcementController.getAnnouncementById);

// Create announcement (protected - instructor)
router.post('/', authenticateToken, announcementController.createAnnouncement);

// Update announcement (protected)
router.put('/:id', authenticateToken, announcementController.updateAnnouncement);

// Delete announcement (protected)
router.delete('/:id', authenticateToken, announcementController.deleteAnnouncement);

// Get course announcements
router.get('/course/:courseId', announcementController.getCourseAnnouncements);

module.exports = router;