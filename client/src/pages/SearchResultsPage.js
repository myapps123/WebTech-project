import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import '../styles/SearchResults.css';

const SearchResultsPage = () => {
  const { query } = useParams();
  const decodedQuery = decodeURIComponent(query || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchCourses = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/courses/search/${encodeURIComponent(decodedQuery)}`);
        setResults(response.data.courses);
      } catch (error) {
        console.error('Error searching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    if (decodedQuery) searchCourses();
  }, [decodedQuery]);

  return (
    <Container className="py-5">
      <h1 className="mb-4">Search Results for "{decodedQuery}"</h1>
      {loading ? (
        <div className="loading-spinner"><p>Searching...</p></div>
      ) : results.length > 0 ? (
        <Row>
          {results.map(course => (
            <Col lg={4} md={6} key={course._id} className="mb-4">
              <Card className="card-hover h-100">
                {course.thumbnail && (
                  <Card.Img variant="top" src={course.thumbnail} alt={course.title} />
                )}
                <Card.Body>
                  <Card.Title>{course.title}</Card.Title>
                  <p className="text-muted small">{course.instructor?.firstName} {course.instructor?.lastName}</p>
                  <p className="text-muted">{course.description?.substring(0, 100)}...</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-primary fw-bold">${course.price}</span>
                    <Button as={Link} to={`/course/${course._id}`} variant="primary" size="sm">View</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="text-center py-5">
          <p className="text-muted fs-5">No courses found matching "{decodedQuery}"</p>
          <Button as={Link} to="/courses" variant="primary" className="mt-3">Browse All Courses</Button>
        </div>
      )}
    </Container>
  );
};

export default SearchResultsPage;
