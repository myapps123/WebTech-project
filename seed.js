const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// ─── Models ───────────────────────────────────────────────────────────────────

const UserSchema = new mongoose.Schema({
  firstName: String, lastName: String, email: { type: String, unique: true },
  password: String, role: { type: String, default: 'student' },
  bio: String, profileImage: String, createdCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

const CategorySchema = new mongoose.Schema({
  name: String, description: String,
  image: String, icon: String, totalCourses: { type: Number, default: 0 }
});
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

const CourseSchema = new mongoose.Schema({
  title: String, description: String,
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  price: Number, level: String, thumbnail: String,
  rating: { type: Number, default: 4.5 },
  totalStudents: { type: Number, default: 0 },
  duration: { type: Number, default: 10 },
  tags: [String], isPublished: { type: Boolean, default: true },
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }]
}, { timestamps: true });
const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);

const LessonSchema = new mongoose.Schema({
  title: String, description: String,
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  videoUrl: String, duration: Number, order: Number, content: String
});
const Lesson = mongoose.models.Lesson || mongoose.model('Lesson', LessonSchema);

const ReviewSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: Number, comment: String
}, { timestamps: true });
const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

// ─── Data ─────────────────────────────────────────────────────────────────────

const categoriesData = [
  {
    name: 'Web Development',
    description: 'Learn HTML, CSS, JavaScript, React, Node.js and build modern websites.',
    image: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=800',
    icon: 'https://cdn-icons-png.flaticon.com/512/1051/1051277.png'
  },
  {
    name: 'Data Science',
    description: 'Master data analysis, machine learning, AI and become a data expert.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    icon: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png'
  },
  {
    name: 'Mobile Development',
    description: 'Build powerful iOS and Android apps with React Native and Flutter.',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
    icon: 'https://cdn-icons-png.flaticon.com/512/545/545245.png'
  },
  {
    name: 'UI/UX Design',
    description: 'Design beautiful user interfaces and great user experiences.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    icon: 'https://cdn-icons-png.flaticon.com/512/1006/1006771.png'
  },
  {
    name: 'Cybersecurity',
    description: 'Learn ethical hacking, network security, and protect digital systems.',
    image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800',
    icon: 'https://cdn-icons-png.flaticon.com/512/2716/2716652.png'
  },
  {
    name: 'Cloud Computing',
    description: 'Master AWS, Azure, Google Cloud and modern DevOps practices.',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800',
    icon: 'https://cdn-icons-png.flaticon.com/512/4215/4215831.png'
  }
];

const instructorsData = [
  {
    firstName: 'James', lastName: 'Anderson',
    email: 'james@elearning.com', password: '123456', role: 'instructor',
    bio: 'Full Stack Developer with 8 years of experience in React, Node.js and MongoDB.',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    firstName: 'Emily', lastName: 'Johnson',
    email: 'emily@elearning.com', password: '123456', role: 'instructor',
    bio: 'Data Scientist and AI researcher with a PhD in Machine Learning.',
    profileImage: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    firstName: 'Michael', lastName: 'Roberts',
    email: 'michael@elearning.com', password: '123456', role: 'instructor',
    bio: 'Mobile developer specializing in React Native and Flutter apps.',
    profileImage: 'https://randomuser.me/api/portraits/men/55.jpg'
  },
  {
    firstName: 'Sophia', lastName: 'Williams',
    email: 'sophia@elearning.com', password: '123456', role: 'instructor',
    bio: 'Award-winning UI/UX designer with experience at top tech companies.',
    profileImage: 'https://randomuser.me/api/portraits/women/68.jpg'
  }
];

const studentsData = [
  { firstName: 'Ali', lastName: 'Hassan', email: 'ali@student.com', password: '123456', role: 'student', profileImage: 'https://randomuser.me/api/portraits/men/10.jpg' },
  { firstName: 'Zara', lastName: 'Hussain', email: 'zara@student.com', password: '123456', role: 'student', profileImage: 'https://randomuser.me/api/portraits/women/12.jpg' },
  { firstName: 'Bilal', lastName: 'Nawaz', email: 'bilal@student.com', password: '123456', role: 'student', profileImage: 'https://randomuser.me/api/portraits/men/22.jpg' }
];

const reviewComments = [
  'Excellent course! I learned so much and the instructor explains everything clearly.',
  'Very well structured content. Highly recommended for beginners.',
  'Great course with practical examples. Worth every penny!',
  'The instructor is amazing and the content is up to date.',
  'Best course I have taken online. Clear explanations and great projects.',
  'Very informative and easy to follow. I built my first project after this!'
];

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elearning_db');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}), Category.deleteMany({}),
      Course.deleteMany({}), Lesson.deleteMany({}), Review.deleteMany({})
    ]);
    console.log('🗑️  Cleared existing data');

    // Create categories
    const categories = await Category.insertMany(categoriesData);
    console.log(`📁 Created ${categories.length} categories`);

    // Create instructors
    const instructors = [];
    for (const data of instructorsData) {
      const inst = new User(data);
      await inst.save();
      instructors.push(inst);
    }
    console.log(`👨‍🏫 Created ${instructors.length} instructors`);

    // Create students
    const students = [];
    for (const data of studentsData) {
      const s = new User(data);
      await s.save();
      students.push(s);
    }
    console.log(`👨‍🎓 Created ${students.length} students`);

    // Course templates
    const coursesData = [
      // Web Development courses
      {
        title: 'Complete Web Development Bootcamp',
        description: 'Learn web development from scratch. Master HTML, CSS, JavaScript, React, Node.js, and MongoDB to become a full-stack developer.',
        category: categories[0]._id, instructor: instructors[0]._id,
        price: 49.99, level: 'Beginner', rating: 4.8, totalStudents: 1240, duration: 42,
        thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800',
        tags: ['html', 'css', 'javascript', 'react', 'nodejs']
      },
      {
        title: 'Advanced React & Redux Masterclass',
        description: 'Deep dive into React hooks, Redux Toolkit, Context API, and build production-grade applications.',
        category: categories[0]._id, instructor: instructors[0]._id,
        price: 59.99, level: 'Advanced', rating: 4.9, totalStudents: 856, duration: 35,
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
        tags: ['react', 'redux', 'javascript']
      },
      {
        title: 'Node.js & Express Backend Development',
        description: 'Build scalable REST APIs with Node.js, Express, MongoDB. Learn authentication, file uploads, and deployment.',
        category: categories[0]._id, instructor: instructors[0]._id,
        price: 44.99, level: 'Intermediate', rating: 4.7, totalStudents: 672, duration: 28,
        thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800',
        tags: ['nodejs', 'express', 'mongodb', 'api']
      },
      // Data Science courses
      {
        title: 'Python for Data Science & Machine Learning',
        description: 'Master Python, Pandas, NumPy, Matplotlib, Scikit-learn and build real machine learning models.',
        category: categories[1]._id, instructor: instructors[1]._id,
        price: 64.99, level: 'Intermediate', rating: 4.9, totalStudents: 2100, duration: 50,
        thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
        tags: ['python', 'machine learning', 'data science', 'pandas']
      },
      {
        title: 'Deep Learning & Neural Networks',
        description: 'Learn TensorFlow, Keras, and PyTorch. Build CNNs, RNNs, and transformer models from scratch.',
        category: categories[1]._id, instructor: instructors[1]._id,
        price: 74.99, level: 'Advanced', rating: 4.8, totalStudents: 945, duration: 45,
        thumbnail: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800',
        tags: ['deep learning', 'tensorflow', 'neural networks', 'ai']
      },
      // Mobile Development courses
      {
        title: 'React Native: Build Mobile Apps',
        description: 'Create cross-platform iOS and Android apps with React Native. Deploy to both app stores.',
        category: categories[2]._id, instructor: instructors[2]._id,
        price: 54.99, level: 'Intermediate', rating: 4.7, totalStudents: 780, duration: 32,
        thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800',
        tags: ['react native', 'mobile', 'ios', 'android']
      },
      {
        title: 'Flutter & Dart Complete Course',
        description: 'Build beautiful native mobile apps with Flutter. Cover state management, animations, and Firebase.',
        category: categories[2]._id, instructor: instructors[2]._id,
        price: 49.99, level: 'Beginner', rating: 4.6, totalStudents: 620, duration: 38,
        thumbnail: 'https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?w=800',
        tags: ['flutter', 'dart', 'mobile development']
      },
      // UI/UX courses
      {
        title: 'UI/UX Design with Figma',
        description: 'Learn design thinking, wireframing, prototyping and build stunning interfaces with Figma.',
        category: categories[3]._id, instructor: instructors[3]._id,
        price: 39.99, level: 'Beginner', rating: 4.8, totalStudents: 1560, duration: 25,
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
        tags: ['figma', 'ui design', 'ux design', 'prototyping']
      },
      // Cybersecurity
      {
        title: 'Ethical Hacking & Penetration Testing',
        description: 'Learn ethical hacking from scratch. Understand network security, vulnerability assessment, and penetration testing.',
        category: categories[4]._id, instructor: instructors[0]._id,
        price: 69.99, level: 'Intermediate', rating: 4.7, totalStudents: 890, duration: 40,
        thumbnail: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800',
        tags: ['hacking', 'cybersecurity', 'network security', 'kali linux']
      },
      // Cloud
      {
        title: 'AWS Cloud Practitioner & Solutions Architect',
        description: 'Master Amazon Web Services. Prepare for AWS certifications and build cloud-native applications.',
        category: categories[5]._id, instructor: instructors[1]._id,
        price: 79.99, level: 'Intermediate', rating: 4.9, totalStudents: 1100, duration: 48,
        thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800',
        tags: ['aws', 'cloud', 'devops', 'certification']
      }
    ];

    // Lesson templates per course
    const lessonTemplates = [
      [
        { title: 'Introduction & Course Overview', duration: 10, videoUrl: 'https://www.youtube.com/embed/qz0aGYrrlhU', content: 'Welcome to the course! In this lesson we cover what you will learn.' },
        { title: 'Setting Up Your Environment', duration: 15, videoUrl: 'https://www.youtube.com/embed/qz0aGYrrlhU', content: 'Install all required tools and configure your development environment.' },
        { title: 'Core Concepts & Fundamentals', duration: 25, videoUrl: 'https://www.youtube.com/embed/qz0aGYrrlhU', content: 'Learn the fundamental concepts that form the foundation of this course.' },
        { title: 'Building Your First Project', duration: 30, videoUrl: 'https://www.youtube.com/embed/qz0aGYrrlhU', content: 'Put your knowledge into practice by building a real project step by step.' },
        { title: 'Advanced Topics & Best Practices', duration: 20, videoUrl: 'https://www.youtube.com/embed/qz0aGYrrlhU', content: 'Explore advanced topics and industry best practices.' },
        { title: 'Final Project & Next Steps', duration: 35, videoUrl: 'https://www.youtube.com/embed/qz0aGYrrlhU', content: 'Complete the final project and learn what to study next.' }
      ]
    ];

    // Create courses with lessons and reviews
    let totalCourses = 0;
    let totalLessons = 0;
    let totalReviews = 0;

    for (const courseData of coursesData) {
      const course = new Course(courseData);
      await course.save();
      totalCourses++;

      // Add lessons
      const lessons = lessonTemplates[0];
      const lessonIds = [];
      for (let i = 0; i < lessons.length; i++) {
        const lesson = new Lesson({
          ...lessons[i],
          course: course._id,
          order: i + 1
        });
        await lesson.save();
        lessonIds.push(lesson._id);
        totalLessons++;
      }

      // Link lessons to course
      course.lessons = lessonIds;
      await course.save();

      // Update category course count
      await Category.findByIdAndUpdate(courseData.category, { $inc: { totalCourses: 1 } });

      // Add reviews from students
      for (const student of students) {
        const rating = Math.floor(Math.random() * 2) + 4; // 4 or 5
        const comment = reviewComments[Math.floor(Math.random() * reviewComments.length)];
        await Review.create({ course: course._id, student: student._id, rating, comment });
        totalReviews++;
      }

      // Update instructor's created courses
      await User.findByIdAndUpdate(courseData.instructor, {
        $push: { createdCourses: course._id }
      });
    }

    console.log(`📚 Created ${totalCourses} courses`);
    console.log(`🎬 Created ${totalLessons} lessons`);
    console.log(`⭐ Created ${totalReviews} reviews`);

    console.log('\n✅ Database seeded successfully!\n');
    console.log('═══════════════════════════════════════');
    console.log('  LOGIN CREDENTIALS');
    console.log('═══════════════════════════════════════');
    console.log('  INSTRUCTORS:');
    console.log('  Email: ahmed@elearning.com  | Pass: 123456');
    console.log('  Email: sara@elearning.com   | Pass: 123456');
    console.log('  Email: omar@elearning.com   | Pass: 123456');
    console.log('  Email: fatima@elearning.com | Pass: 123456');
    console.log('');
    console.log('  STUDENTS:');
    console.log('  Email: ali@student.com      | Pass: 123456');
    console.log('  Email: zara@student.com     | Pass: 123456');
    console.log('  Email: bilal@student.com    | Pass: 123456');
    console.log('═══════════════════════════════════════\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
