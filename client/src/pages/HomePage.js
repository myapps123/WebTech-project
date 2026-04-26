import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Home.css';

const HomePage = () => {
  const [topCourses, setTopCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesRes = await axios.get('/api/courses/featured/top-rated');
        const categoriesRes = await axios.get('/api/categories');
        setTopCourses(coursesRes.data.courses);
        setCategories(categoriesRes.data.categories);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={8} className="mx-auto text-center">
              <h1 className="display-4 fw-bold mb-4">Learn Anything, Anywhere, Anytime</h1>
              <p className="lead mb-4">Join thousands of students learning from world-class instructors on our comprehensive e-learning platform.</p>
              <Button as={Link} to="/courses" size="lg" className="me-3" variant="light">
                Explore Courses
              </Button>
              <Button as={Link} to="/instructors" size="lg" variant="outline-light">
                Meet Instructors
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Top Courses Section */}
      <section className="py-5">
        <Container>
          <h2 className="mb-5 text-center">Top Rated Courses</h2>
          <Row>
            {topCourses.slice(0, 6).map(course => (
              <Col md={6} lg={4} key={course._id} className="mb-4">
                <Card className="card-hover h-100">
                  <Card.Img variant="top" src={course.thumbnail} alt={course.title} />
                  <Card.Body>
                    <Card.Title>{course.title}</Card.Title>
                    <Card.Text className="text-muted">{course.description.substring(0, 80)}...</Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="badge bg-warning text-dark">★ {course.rating}</span>
                      <span className="text-primary fw-bold">${course.price}</span>
                    </div>
                    <Button as={Link} to={`/course/${course._id}`} variant="primary" className="w-100 mt-3">
                      View Course
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Categories Section */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="mb-5 text-center">Popular Categories</h2>
          <Row>
            {categories.slice(0, 6).map(category => (
              <Col md={6} lg={4} key={category._id} className="mb-4">
                <Card className="card-hover text-center">
                  <Card.Body>
                    <img src={category.icon} alt={category.name} style={{height: '80px', marginBottom: '15px'}} />
                    <Card.Title>{category.name}</Card.Title>
                    <p className="text-muted">{category.totalCourses} courses</p>
                    <Button as={Link} to={`/category/${category._id}`} variant="outline-primary">
                      Explore
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
};

export default HomePage;