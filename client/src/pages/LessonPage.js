import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, ProgressBar, Badge } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/Lesson.css';

const LessonPage = () => {
  const { enrollmentId } = useParams();
  const [enrollment, setEnrollment] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        const enrollmentRes = await axios.get(`/api/enrollments/${enrollmentId}`);
        setEnrollment(enrollmentRes.data.enrollment);

        const lessonsRes = await axios.get(`/api/lessons/course/${enrollmentRes.data.enrollment.course._id}`);
        setLessons(lessonsRes.data.lessons);
        setCurrentLesson(lessonsRes.data.lessons[0]);

        const progressRes = await axios.get(`/api/progress/enrollment/${enrollmentId}`);
        setProgress(progressRes.data.progress);
      } catch (error) {
        console.error('Error fetching lesson data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLessonData();
  }, [enrollmentId]);

  const markLessonComplete = async (lessonId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `/api/progress/lesson/${lessonId}/complete`,
        { enrollmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Lesson marked as complete!');
    } catch (error) {
      console.error('Error marking lesson complete:', error);
    }
  };

  if (loading) return <div className="loading-spinner"><p>Loading...</p></div>;

  return (
    <Container fluid className="py-5">
      <Row>
        {/* Video Player Section */}
        <Col lg={8} className="mb-4">
          {currentLesson && (
            <Card>
              <Card.Body>
                <div className="video-player mb-4">
                  <iframe
                    width="100%"
                    height="450"
                    src={currentLesson.videoUrl}
                    title={currentLesson.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <h2>{currentLesson.title}</h2>
                <p className="text-muted">{currentLesson.description}</p>
                <Button
                  variant="success"
                  onClick={() => markLessonComplete(currentLesson._id)}
                  className="mb-3"
                >
                  Mark as Complete
                </Button>
                <div className="lesson-content mt-4">
                  <h5>Lesson Notes</h5>
                  <p>{currentLesson.content}</p>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>

        {/* Sidebar - Lessons List */}
        <Col lg={4}>
          <Card>
            <Card.Header>
              <h5>{enrollment?.course?.title}</h5>
              <p className="text-muted small mb-0">Progress: {enrollment?.progress}%</p>
              <ProgressBar now={enrollment?.progress || 0} className="mt-2" />
            </Card.Header>
            <Card.Body className="p-0">
              {lessons.map((lesson, index) => {
                const isCompleted = progress.some(p => p.lesson._id === lesson._id && p.isCompleted);
                return (
                  <div
                    key={lesson._id}
                    className={`lesson-item p-3 border-bottom cursor-pointer ${
                      currentLesson?._id === lesson._id ? 'active' : ''
                    } ${isCompleted ? 'completed' : ''}`}
                    onClick={() => setCurrentLesson(lesson)}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-1">Lesson {index + 1}</h6>
                        <p className="text-muted small mb-0">{lesson.title}</p>
                      </div>
                      {isCompleted && <Badge bg="success">✓</Badge>}
                    </div>
                  </div>
                );
              })}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LessonPage;