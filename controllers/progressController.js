const Progress = require('../models/Progress');
const Enrollment = require('../models/Enrollment');
const Lesson = require('../models/Lesson');

const getAllProgress = async (req, res) => {
  try {
    const progress = await Progress.find()
      .populate('enrollment')
      .populate('lesson');

    res.json({ count: progress.length, progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProgressById = async (req, res) => {
  try {
    const progress = await Progress.findById(req.params.id)
      .populate('enrollment')
      .populate('lesson');

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    res.json({ progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProgress = async (req, res) => {
  try {
    const { enrollmentId, lessonId } = req.body;

    if (!enrollmentId || !lessonId) {
      return res.status(400).json({ message: 'Enrollment and lesson IDs required' });
    }

    const existingProgress = await Progress.findOne({
      enrollment: enrollmentId,
      lesson: lessonId
    });

    if (existingProgress) {
      return res.status(400).json({ message: 'Progress already exists for this lesson' });
    }

    const progress = new Progress({
      enrollment: enrollmentId,
      lesson: lessonId,
      lastWatchedAt: Date.now()
    });

    await progress.save();
    res.status(201).json({ message: 'Progress created successfully', progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProgress = async (req, res) => {
  try {
    const { watchedDuration, isCompleted } = req.body;

    const progress = await Progress.findByIdAndUpdate(
      req.params.id,
      {
        watchedDuration,
        isCompleted,
        lastWatchedAt: Date.now(),
        completedAt: isCompleted ? Date.now() : undefined,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    // Update enrollment progress if lesson is completed
    if (isCompleted) {
      const enrollment = await Enrollment.findById(progress.enrollment);
      if (enrollment) {
        if (!enrollment.completedLessons.includes(req.params.lesson)) {
          enrollment.completedLessons.push(progress.lesson);
          const totalLessons = await Lesson.countDocuments({ course: enrollment.course });
          enrollment.progress = (enrollment.completedLessons.length / totalLessons) * 100;
          await enrollment.save();
        }
      }
    }

    res.json({ message: 'Progress updated successfully', progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEnrollmentProgress = async (req, res) => {
  try {
    const progressList = await Progress.find({ enrollment: req.params.enrollmentId })
      .populate('lesson');

    res.json({ count: progressList.length, progress: progressList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markLessonComplete = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { enrollmentId } = req.body;

    let progress = await Progress.findOne({
      enrollment: enrollmentId,
      lesson: lessonId
    });

    if (!progress) {
      progress = new Progress({
        enrollment: enrollmentId,
        lesson: lessonId,
        isCompleted: true,
        completedAt: Date.now()
      });
      await progress.save();
    } else {
      progress.isCompleted = true;
      progress.completedAt = Date.now();
      await progress.save();
    }

    res.json({ message: 'Lesson marked as complete', progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProgress,
  getProgressById,
  createProgress,
  updateProgress,
  getEnrollmentProgress,
  markLessonComplete
};