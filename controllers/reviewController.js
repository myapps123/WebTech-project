const Review = require('../models/Review');
const Course = require('../models/Course');

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('course', 'title')
      .populate('student', 'firstName lastName profileImage')
      .sort({ createdAt: -1 });

    res.json({ count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('course')
      .populate('student');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReviewsByCourse = async (req, res) => {
  try {
    const reviews = await Review.find({ course: req.params.courseId })
      .populate('student', 'firstName lastName profileImage')
      .sort({ createdAt: -1 });

    res.json({ count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createReview = async (req, res) => {
  try {
    const { courseId, rating, comment } = req.body;

    if (!courseId || !rating || !comment) {
      return res.status(400).json({ message: 'Course, rating, and comment required' });
    }

    const review = new Review({
      course: courseId,
      student: req.user.id,
      rating,
      comment
    });

    await review.save();

    // Update course rating
    const allReviews = await Review.find({ course: courseId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Course.findByIdAndUpdate(courseId, { rating: avgRating });

    res.status(201).json({ message: 'Review created successfully', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review || review.student.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({ message: 'Review updated successfully', review: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review || review.student.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markHelpful = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpful: 1 } },
      { new: true }
    );

    res.json({ message: 'Marked as helpful', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllReviews,
  getReviewById,
  getReviewsByCourse,
  createReview,
  updateReview,
  deleteReview,
  markHelpful
};