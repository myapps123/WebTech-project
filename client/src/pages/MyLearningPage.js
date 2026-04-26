import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import '../styles/MyLearning.css';

const MyLearningPage = () => {
  const { user, token } = useContext(AuthContext);
  const [enrollments, setEnrollments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!user || !token) return;
      try {
        const response = await axios.get(`/api/enrollments/student/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEnrollments(response.data.enrollments);
      } catch (error) {
        console.error('Error fetching enrollments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, [user, token]);

  const filteredEnrollments = enrollments.filter(e => {
    if (filter === 'all') return true;
    return e.status === filter;
  });

  return (
    <Container className="py-5">
      <h1 className="mb-4">My Learning</h1>

      <div className="filter-buttons mb-4">
        {['all', 'active', 'completed'].map(f => (
          <Button
            key={f}
            variant={filter === f ? 'primary' : 'outline-primary'}
            className="me-2"
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All Courses' : f === 'active' ? 'In Progress' : 'Completed'}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="loading-spinner"><p>Loading...</p></div>
      ) : (
        <Row>
          {filteredEnrollments.length > 0 ? (
            filteredEnrollments.map(enrollment => (
              <Col lg={6} key={enrollment._id} className="mb-4">
                <Card className="card-hover h-100">
                  {enrollment.course?.thumbnail && (
                    <Card.Img variant="top" src={enrollment.course.thumbnail} alt={enrollment.course.title} />
                  )}
                  <Card.Body>
                    <Card.Title>{enrollment.course?.title}</Card.Title>
                    <div className="progress mb-3">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${enrollment.progress || 0}%` }}
                      >
                        {enrollment.progress || 0}%
                      </div>
                    </div>
                    <p className="text-muted small">
                      Status: <span className="text-capitalize">{enrollment.status}</span>
                    </p>
                    {enrollment.status === 'completed' && (
                      <Button variant="success" className="w-100 mb-2">Download Certificate</Button>
                    )}
                    <Button as={Link} to={`/lesson/${enrollment._id}`} variant="primary" className="w-100">
                      {enrollment.status === 'completed' ? 'Review Course' : 'Continue Learning'}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <Alert variant="info">
                No courses in this category. <Link to="/courses">Browse courses</Link>
              </Alert>
            </Col>
          )}
        </Row>
      )}
    </Container>
  );
};

export default MyLearningPage;
