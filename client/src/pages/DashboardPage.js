import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import '../styles/Dashboard.css';

const DashboardPage = () => {
  const { user, token } = useContext(AuthContext);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [stats, setStats] = useState({ totalCourses: 0, completedCourses: 0, inProgress: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !token) return;

    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`/api/enrollments/student/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEnrolledCourses(response.data.enrollments);
        
        setStats({
          totalCourses: response.data.enrollments.length,
          completedCourses: response.data.enrollments.filter(e => e.status === 'completed').length,
          inProgress: response.data.enrollments.filter(e => e.status === 'active').length
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user, token]);

  return (
    <Container className="py-5">
      <h1 className="mb-5">Welcome, {user?.firstName}!</h1>

      <Row className="mb-5">
        <Col md={3} className="mb-3">
          <Card className="stat-card">
            <Card.Body className="text-center">
              <h3 className="text-primary">{stats.totalCourses}</h3>
              <p className="text-muted">Total Courses</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="stat-card">
            <Card.Body className="text-center">
              <h3 className="text-success">{stats.inProgress}</h3>
              <p className="text-muted">In Progress</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="stat-card">
            <Card.Body className="text-center">
              <h3 className="text-info">{stats.completedCourses}</h3>
              <p className="text-muted">Completed</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="stat-card">
            <Card.Body className="text-center">
              <h3 className="text-warning">⭐ 4.5</h3>
              <p className="text-muted">Average Rating</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h3 className="mb-4">My Enrolled Courses</h3>
      <Row>
        {enrolledCourses.length > 0 ? (
          enrolledCourses.map(enrollment => (
            <Col lg={4} md={6} key={enrollment._id} className="mb-4">
              <Card className="card-hover h-100">
                <Card.Img variant="top" src={enrollment.course?.thumbnail} alt={enrollment.course?.title} />
                <Card.Body>
                  <Card.Title>{enrollment.course?.title}</Card.Title>
                  <div className="progress mb-3">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: `${enrollment.progress}%` }}
                    >
                      {enrollment.progress}%
                    </div>
                  </div>
                  <p className="text-muted small">Status: {enrollment.status}</p>
                  <Button as={Link} to={`/lesson/${enrollment._id}`} variant="primary" className="w-100">
                    Continue Learning
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Alert variant="info">No courses enrolled yet. <Link to="/courses">Browse courses</Link></Alert>
        )}
      </Row>
    </Container>
  );
};

export default DashboardPage;