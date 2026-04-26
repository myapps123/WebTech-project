const Lesson = require('../models/Lesson');

const getAllLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find()
      .populate('course', 'title');

    res.json({ count: lessons.length, lessons });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate('course', 'title');

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.json({ lesson });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLessonsByCourse = async (req, res) => {
  try {
    const lessons = await Lesson.find({ course: req.params.courseId })
      .sort({ order: 1 });

    res.json({ count: lessons.length, lessons });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createLesson = async (req, res) => {
  try {
    const { title, description, course, videoUrl, duration } = req.body;

    if (!title || !course || !videoUrl) {
      return res.status(400).json({ message: 'Title, course, and videoUrl required' });
    }

    const lesson = new Lesson({
      title,
      description,
      course,
      videoUrl,
      duration
    });

    await lesson.save();
    res.status(201).json({ message: 'Lesson created successfully', lesson });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.json({ message: 'Lesson updated successfully', lesson });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteLesson = async (req, res) => {
  try {
    await Lesson.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllLessons,
  getLessonById,
  getLessonsByCourse,
  createLesson,
  updateLesson,
  deleteLesson
};