import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart
} from '../redux/slices/cartSlice';
import { Button, Table, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const dispatch = useDispatch(); // Used to dispatch cart actions
  const navigate = useNavigate(); // Navigation hook for routing
  const cartItems = useSelector((state) => state.cart.items); // Get cart items from Redux store

  const total = cartItems.reduce((acc, item) => {
    const price = Number(item.discountedprice || item.price || 0); // Handle possible price fields
    return acc + price * item.quantity; // Calculate running total
  }, 0);

  return (
    <Container className="py-5">
      <h2 className="mb-4">🛒 Your Sevas</h2>

      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => {
            const unitPrice = Number(item.discountedprice || item.price || 0); // Determine per-unit price
            return (
              <tr key={item.id}>
                <td>{item.title || item.name || 'N/A'}</td>
                <td>
                  <Button
                    onClick={() => dispatch(decreaseQuantity(item.id))} // Decrease quantity
                    variant="secondary"
                    className="me-2"
                  >
                    -
                  </Button>
                  {item.quantity}
                  <Button
                    onClick={() => dispatch(increaseQuantity(item.id))} // Increase quantity
                    variant="secondary"
                    className="ms-2"
                  >
                    +
                  </Button>
                </td>
                <td>₹{(unitPrice * item.quantity).toFixed(2)}</td>
                <td>
                  <Button
                    onClick={() => dispatch(removeFromCart(item.id))} // Remove item from cart
                    variant="danger"
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <h4 className="mt-4">Total: ₹{total.toFixed(2)}</h4>

      <Button
        variant="success"
        onClick={() => navigate('/payment')} // Navigate to payment page
        disabled={cartItems.length === 0} // Disable if cart is empty
      >
        Proceed to Payment
      </Button>
    </Container>
  );
};

export default Cart;
