import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Courses.css';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', level: '', minPrice: 0, maxPrice: 1000 });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/courses');
      setCourses(response.data.courses);
      setFilteredCourses(response.data.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = courses;

    if (filters.search) {
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.level) {
      filtered = filtered.filter(c => c.level === filters.level);
    }

    filtered = filtered.filter(c => c.price >= filters.minPrice && c.price <= filters.maxPrice);

    setFilteredCourses(filtered);
  };

  useEffect(() => {
    handleFilter();
  }, [filters]);

  return (
    <Container className="py-5">
      <h1 className="mb-5">All Courses</h1>
      <Row>
        {/* Sidebar Filters */}
        <Col md={3} className="mb-4">
          <Card>
            <Card.Body>
              <h5 className="mb-3">Filters</h5>
              <Form.Group className="mb-3">
                <Form.Label>Search</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search courses"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Level</Form.Label>
                <Form.Select
                  value={filters.level}
                  onChange={(e) => setFilters({...filters, level: e.target.value})}
                >
                  <option value="">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <Form.Label>Price Range</Form.Label>
                <Form.Range
                  min={0}
                  max={1000}
                  step={10}
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: parseInt(e.target.value)})}
                />
                <p className="mt-2">Up to ${filters.maxPrice}</p>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>

        {/* Courses Grid */}
        <Col md={9}>
          <Row>
            {filteredCourses.map(course => (
              <Col lg={6} key={course._id} className="mb-4">
                <Card className="card-hover h-100">
                  <Card.Img variant="top" src={course.thumbnail} alt={course.title} />
                  <Card.Body>
                    <Card.Title>{course.title}</Card.Title>
                    <p className="text-muted small">{course.instructor?.firstName} {course.instructor?.lastName}</p>
                    <Card.Text>{course.description.substring(0, 100)}...</Card.Text>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="badge bg-info">{course.level}</span>
                      <span className="star-rating">★ {course.rating}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-primary fw-bold fs-5">${course.price}</span>
                      <Button as={Link} to={`/course/${course._id}`} variant="primary" size="sm">
                        View Details
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          {filteredCourses.length === 0 && (
            <div className="text-center py-5">
              <p className="text-muted">No courses found. Try adjusting your filters.</p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default CoursesPage;