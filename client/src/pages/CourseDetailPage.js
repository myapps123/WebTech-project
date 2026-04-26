import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Tabs, Tab, ListGroup } from 'react-bootstrap';
import { FaStar, FaPlay, FaBook, FaGraduationCap } from 'react-icons/fa';
import axios from 'axios';
import '../styles/CourseDetail.css';

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const courseRes = await axios.get(`/api/courses/${id}`);
        setCourse(courseRes.data.course);
        setReviews(courseRes.data.reviews);

        const lessonsRes = await axios.get(`/api/lessons/course/${id}`);
        setLessons(lessonsRes.data.lessons);
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseDetails();
  }, [id]);

  const handleEnroll = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await axios.post(
        '/api/enrollments',
        { courseId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Enrolled successfully!');
    } catch (error) {
      console.error('Error enrolling:', error);
    }
  };

  if (loading) return <div className="loading-spinner"><p>Loading...</p></div>;

  return (
    <Container className="py-5">
      {course && (
        <>
          <Row className="mb-5">
            <Col lg={8}>
              <img src={course.thumbnail} alt={course.title} className="course-hero-image mb-4" />
              <h1>{course.title}</h1>
              <div className="mb-3">
                <span className="star-rating me-3"><FaStar /> {course.rating}</span>
                <Badge bg="info" className="me-2">{course.level}</Badge>
                <Badge bg="success">{course.totalStudents} students</Badge>
              </div>
              <p className="lead text-muted">{course.description}</p>
            </Col>
            <Col lg={4}>
              <Card>
                <Card.Body>
                  <h3 className="text-primary mb-3">${course.price}</h3>
                  <Button onClick={handleEnroll} variant="primary" size="lg" className="w-100 mb-3">
                    Enroll Now
                  </Button>
                  <Button variant="outline-primary" className="w-100 mb-3">
                    Add to Wishlist
                  </Button>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <FaBook className="me-2" /> {lessons.length} Lessons
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <FaPlay className="me-2" /> {course.duration} hours
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <FaGraduationCap className="me-2" /> Certificate
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={8}>
              <Tabs defaultActiveKey="curriculum" className="mb-4">
                <Tab eventKey="curriculum" title="Curriculum">
                  <div className="py-3">
                    <h5>Course Lessons</h5>
                    {lessons.map((lesson, index) => (
                      <Card key={lesson._id} className="mb-2">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="mb-1">Lesson {index + 1}: {lesson.title}</h6>
                              <p className="text-muted small mb-0">{lesson.duration} min</p>
                            </div>
                            <Button variant="outline-primary" size="sm">Preview</Button>
                          </div>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                </Tab>
                <Tab eventKey="reviews" title="Reviews">
                  <div className="py-3">
                    <h5>Student Reviews</h5>
                    {reviews.map(review => (
                      <Card key={review._id} className="mb-3">
                        <Card.Body>
                          <div className="d-flex justify-content-between">
                            <div>
                              <strong>{review.student?.firstName} {review.student?.lastName}</strong>
                              <p className="star-rating mb-1">{'★'.repeat(review.rating)}</p>
                            </div>
                          </div>
                          <p className="text-muted">{review.comment}</p>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                </Tab>
              </Tabs>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default CourseDetailPage;