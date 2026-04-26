const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');
const Review = require('../models/Review');

const getAllCourses = async (req, res) => {
  try {
    const { category, level, minPrice, maxPrice, sortBy } = req.query;
    let query = { isPublished: true };

    if (category) query.category = category;
    if (level) query.level = level;
    if (minPrice) query.price = { $gte: minPrice };
    if (maxPrice) query.price = { ...query.price, $lte: maxPrice };

    let courses = await Course.find(query)
      .populate('instructor', 'firstName lastName profileImage')
      .populate('category', 'name');

    if (sortBy === 'rating') {
      courses.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'students') {
      courses.sort((a, b) => b.totalStudents - a.totalStudents);
    } else if (sortBy === 'newest') {
      courses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.json({ count: courses.length, courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'firstName lastName profileImage bio')
      .populate('category', 'name')
      .populate('lessons');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const reviews = await Review.find({ course: req.params.id })
      .populate('student', 'firstName lastName profileImage');

    res.json({ course, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCourse = async (req, res) => {
  try {
    const { title, description, category, price, level, tags } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Title, description, and category required' });
    }

    const course = new Course({
      title,
      description,
      category,
      price,
      level,
      tags,
      instructor: req.user.id
    });

    await course.save();
    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.json({ message: 'Course updated successfully', course: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCoursesByCategory = async (req, res) => {
  try {
    const courses = await Course.find({ category: req.params.categoryId, isPublished: true })
      .populate('instructor', 'firstName lastName')
      .populate('category', 'name');

    res.json({ count: courses.length, courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCoursesByInstructor = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.params.instructorId })
      .populate('category', 'name');

    res.json({ count: courses.length, courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchCourses = async (req, res) => {
  try {
    const { query } = req.params;
    const courses = await Course.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } }
      ],
      isPublished: true
    }).populate('instructor', 'firstName lastName');

    res.json({ count: courses.length, courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTopRatedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .sort({ rating: -1 })
      .limit(10)
      .populate('instructor', 'firstName lastName profileImage')
      .populate('category', 'name');

    res.json({ courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCoursesByCategory,
  getCoursesByInstructor,
  searchCourses,
  getTopRatedCourses
};