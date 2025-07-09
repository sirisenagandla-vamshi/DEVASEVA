import React from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NavigationBar = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate between routes

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        {/* Brand title that navigates to home */}
        <Navbar.Brand
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Seva App
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" /> {/* Mobile toggle button */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* Home button */}
            <Button
              variant="outline-light"
              className="me-2"
              onClick={() => navigate('/')}
            >
              Home
            </Button>

            {/* Cart button */}
            <Button
              variant="outline-light"
              className="me-2"
              onClick={() => navigate('/cart')}
            >
              Cart
            </Button>

            {/* User profile button */}
            <Button
              variant="outline-info"
              onClick={() => navigate('/user')}
            >
              User
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
