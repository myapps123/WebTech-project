import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/CategoryDetail.css';

const CategoryDetailPage = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryAndCourses = async () => {
      try {
        const response = await axios.get(`/api/categories/${id}/courses`);
        setCategory(response.data.category);
        setCourses(response.data.courses);
      } catch (error) {
        console.error('Error fetching category:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryAndCourses();
  }, [id]);

  if (loading) return <div className="loading-spinner"><p>Loading...</p></div>;

  return (
    <Container className="py-5">
      {category && (
        <>
          <Row className="mb-5">
            <Col lg={12}>
              {category.image && (
                <img src={category.image} alt={category.name} className="category-banner mb-4" />
              )}
              <h1>{category.name}</h1>
              <p className="lead text-muted">{category.description}</p>
              <Badge bg="primary" className="mb-4">{courses.length} Courses</Badge>
            </Col>
          </Row>

          <Row>
            <Col lg={12}>
              <h3 className="mb-4">Courses in {category.name}</h3>
            </Col>
          </Row>

          <Row>
            {courses.length > 0 ? courses.map(course => (
              <Col lg={4} md={6} key={course._id} className="mb-4">
                <Card className="card-hover h-100">
                  {course.thumbnail && (
                    <Card.Img variant="top" src={course.thumbnail} alt={course.title} style={{height:'200px', objectFit:'cover'}} />
                  )}
                  <Card.Body>
                    <Card.Title>{course.title}</Card.Title>
                    <p className="text-muted small">{course.instructor?.firstName} {course.instructor?.lastName}</p>
                    <div className="d-flex justify-content-between mb-3">
                      <Badge bg="info">{course.level}</Badge>
                      <span className="star-rating">★ {course.rating}</span>
                    </div>
                    <h6 className="text-primary">${course.price}</h6>
                    <Button as={Link} to={`/course/${course._id}`} variant="primary" className="w-100">
                      View Course
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            )) : (
              <Col>
                <p className="text-muted">No courses available in this category yet.</p>
              </Col>
            )}
          </Row>
        </>
      )}
    </Container>
  );
};

export default CategoryDetailPage;
