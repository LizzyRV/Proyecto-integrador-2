import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Facebook, Instagram } from 'react-bootstrap-icons';

const Footer = () => {
  return (
    <footer className="bg-light text-center text-lg-start mt-auto">
      <Container fluid className="p-3">
        <Row>
          <Col>
            <h5>Odonto Clinic</h5>
            <p>
              Medellín, Antioquia. Colombia 
            </p>
          </Col>
          <Col>
            <h5>Síguenos</h5>
            <div className="d-flex justify-content-center">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="me-3">
                <Facebook size={24} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Instagram size={24} />
              </a>
            </div>
          </Col>
        </Row>
      </Container>
      <div className="bg-dark text-light text-center p-2">
        <p>&copy; 2024 Odonto Clinic. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer