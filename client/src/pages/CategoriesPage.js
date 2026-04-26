import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <Container className="py-5">
      <h1 className="mb-5">Course Categories</h1>
      <Row>
        {categories.map(category => (
          <Col lg={4} md={6} key={category._id} className="mb-4">
            <Card className="card-hover h-100">
              <Card.Img variant="top" src={category.image} alt={category.name} style={{height: '200px', objectFit: 'cover'}} />
              <Card.Body>
                <Card.Title>{category.name}</Card.Title>
                <Card.Text>{category.description}</Card.Text>
                <p className="text-muted">
                  <small>{category.totalCourses} courses available</small>
                </p>
                <Button as={Link} to={`/category/${category._id}`} variant="primary" className="w-100">
                  View Courses
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CategoriesPage;