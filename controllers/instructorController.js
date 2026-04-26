const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

const getAllInstructors = async (req, res) => {
  try {
    const instructors = await User.find({ role: 'instructor' })
      .select('-password')
      .populate('createdCourses', 'title thumbnail');

    res.json({ count: instructors.length, instructors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInstructorById = async (req, res) => {
  try {
    const instructor = await User.findById(req.params.id)
      .select('-password')
      .populate('createdCourses');

    if (!instructor || instructor.role !== 'instructor') {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    res.json({ instructor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.params.id })
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.json({ count: courses.length, courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInstructorStats = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.params.id });
    const totalEnrollments = await Enrollment.countDocuments({
      course: { $in: courses.map(c => c._id) }
    });
    const totalStudents = await Enrollment.find({
      course: { $in: courses.map(c => c._id) }
    }).distinct('student');

    const avgRating = courses.length > 0
      ? courses.reduce((sum, c) => sum + c.rating, 0) / courses.length
      : 0;

    res.json({
      totalCourses: courses.length,
      totalEnrollments,
      totalStudents: totalStudents.length,
      averageRating: avgRating.toFixed(1)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllInstructors,
  getInstructorById,
  getInstructorCourses,
  getInstructorStats
};