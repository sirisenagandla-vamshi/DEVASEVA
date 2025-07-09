import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Row, Col, Container } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import imageMap from '../utils/imageMap';

const PAGE_SIZE = 9; // Items to show per load

const Home = () => {
  const [sevas, setSevas] = useState([]); // All sevas from backend
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE); // Controls pagination
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSevas = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/sevas');
        setSevas(res.data); // Populate seva list
      } catch (err) {
        console.error('Error fetching sevas:', err);
      }
    };
    fetchSevas();
  }, []);

  const handleAddToCart = (seva) => {
    dispatch(addToCart({
      id: seva.id,
      name: seva.title,
      price: seva.discountedprice,
      quantity: 1,
    }));
  };

  const handleViewMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE); // Show more items on "View More"
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4 fw-bold">Available Sevas</h2>
      <Row>
        {sevas.slice(0, visibleCount).map((seva) => (
          <Col key={seva.id} md={4} className="mb-4">
            <Card className="shadow-sm h-100">
              <Card.Img
                variant="top"
                src={imageMap[seva.title] || 'https://via.placeholder.com/300x200?text=No+Image'}
                alt={seva.title}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <Card.Body className="d-flex flex-column justify-content-between">
                <div>
                  <Card.Title style={{ color: 'black' }} className="fw-bold fs-5">
                    {seva.title}
                  </Card.Title>
                  <Card.Text>{seva.description}</Card.Text>
                  <h6 className="mb-3">
                    Price: ₹{seva.discountedprice ? Number(seva.discountedprice).toFixed(2) : 'N/A'}
                  </h6>
                </div>
                <Button
                  variant="primary"
                  onClick={() => handleAddToCart(seva)}
                  className="mt-2"
                >
                  Add to Cart
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {visibleCount < sevas.length && (
        <div className="text-center mt-4">
          <Button variant="outline-primary" onClick={handleViewMore}>
            View More
          </Button>
        </div>
      )}
    </Container>
  );
};

export default Home;
