import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Instructors.css';

const InstructorsPage = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await axios.get('/api/instructors');
        setInstructors(response.data.instructors);
      } catch (error) {
        console.error('Error fetching instructors:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInstructors();
  }, []);

  return (
    <Container className="py-5">
      <h1 className="mb-5">Our Instructors</h1>
      <Row>
        {instructors.map(instructor => (
          <Col lg={4} md={6} key={instructor._id} className="mb-4">
            <Card className="card-hover text-center h-100">
              <Card.Img variant="top" src={instructor.profileImage} alt={instructor.firstName} />
              <Card.Body>
                <Card.Title>{instructor.firstName} {instructor.lastName}</Card.Title>
                <p className="text-muted">{instructor.bio}</p>
                <p className="small">
                  <strong>{instructor.createdCourses?.length || 0}</strong> Courses
                </p>
                <Button as={Link} to={`/instructor/${instructor._id}`} variant="primary">
                  View Profile
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default InstructorsPage;