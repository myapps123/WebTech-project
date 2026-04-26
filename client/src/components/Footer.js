import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white mt-5">
      <Container fluid>
        <Row className="py-5">
          <Col md={3} className="mb-4">
            <h5>ELearning Platform</h5>
            <p>Learn anything, anywhere, anytime with our comprehensive online learning platform.</p>
          </Col>
          <Col md={3} className="mb-4">
            <h6>Quick Links</h6>
            <ul className="list-unstyled">
              <li><a href="/">Home</a></li>
              <li><a href="/courses">Courses</a></li>
              <li><a href="/instructors">Instructors</a></li>
              <li><a href="/about">About Us</a></li>
            </ul>
          </Col>
          <Col md={3} className="mb-4">
            <h6>Support</h6>
            <ul className="list-unstyled">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </Col>
          <Col md={3} className="mb-4">
            <h6>Follow Us</h6>
            <div className="social-icons">
              <a href="#" className="me-3"><FaFacebook size={24} /></a>
              <a href="#" className="me-3"><FaTwitter size={24} /></a>
              <a href="#" className="me-3"><FaLinkedin size={24} /></a>
              <a href="#" className="me-3"><FaInstagram size={24} /></a>
            </div>
          </Col>
        </Row>
        <Row className="border-top pt-4">
          <Col className="text-center">
            <p>&copy; 2024 ELearning Platform. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;