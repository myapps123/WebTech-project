import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import axios from 'axios';
import '../styles/InstructorDetail.css';

const InstructorDetailPage = () => {
  const { id } = useParams();
  const [instructor, setInstructor] = useState(null);
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        const instructorRes = await axios.get(`/api/instructors/${id}`);
        setInstructor(instructorRes.data.instructor);

        const coursesRes = await axios.get(`/api/instructors/${id}/courses`);
        setCourses(coursesRes.data.courses);

        try {
          const statsRes = await axios.get(`/api/instructors/${id}/statistics`);
          setStats(statsRes.data);
        } catch (_) {}
      } catch (error) {
        console.error('Error fetching instructor:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInstructorData();
  }, [id]);

  if (loading) return <div className="loading-spinner"><p>Loading...</p></div>;

  if (!instructor) return (
    <Container className="py-5 text-center">
      <p className="text-muted">Instructor not found.</p>
    </Container>
  );

  return (
    <Container className="py-5">
      <Row className="mb-5">
        <Col lg={3} className="text-center">
          {instructor.profileImage && (
            <img src={instructor.profileImage} alt={instructor.firstName} className="instructor-avatar mb-3" />
          )}
        </Col>
        <Col lg={9}>
          <h1>{instructor.firstName} {instructor.lastName}</h1>
          <p className="lead text-muted">{instructor.bio}</p>
          {stats && (
            <Row className="mt-4">
              <Col md={3}>
                <Card className="text-center"><Card.Body>
                  <h4>{stats.totalCourses}</h4>
                  <p className="text-muted mb-0">Courses</p>
                </Card.Body></Card>
              </Col>
              <Col md={3}>
                <Card className="text-center"><Card.Body>
                  <h4>{stats.totalStudents}</h4>
                  <p className="text-muted mb-0">Students</p>
                </Card.Body></Card>
              </Col>
              <Col md={3}>
                <Card className="text-center"><Card.Body>
                  <h4>{stats.totalEnrollments}</h4>
                  <p className="text-muted mb-0">Enrollments</p>
                </Card.Body></Card>
              </Col>
              <Col md={3}>
                <Card className="text-center"><Card.Body>
                  <h4>★ {stats.averageRating}</h4>
                  <p className="text-muted mb-0">Rating</p>
                </Card.Body></Card>
              </Col>
            </Row>
          )}
        </Col>
      </Row>

      <h3 className="mb-4">Courses by {instructor.firstName}</h3>
      <Row>
        {courses.length > 0 ? courses.map(course => (
          <Col lg={4} md={6} key={course._id} className="mb-4">
            <Card className="card-hover h-100">
              {course.thumbnail && (
                <Card.Img variant="top" src={course.thumbnail} alt={course.title} style={{height:'200px', objectFit:'cover'}} />
              )}
              <Card.Body>
                <Card.Title>{course.title}</Card.Title>
                <Badge bg="info">{course.level}</Badge>
                <div className="mt-3">
                  <p className="text-primary fw-bold">${course.price}</p>
                  <Button as={Link} to={`/course/${course._id}`} variant="primary" className="w-100">
                    View Course
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        )) : (
          <Col><p className="text-muted">No courses published yet.</p></Col>
        )}
      </Row>
    </Container>
  );
};

export default InstructorDetailPage;
