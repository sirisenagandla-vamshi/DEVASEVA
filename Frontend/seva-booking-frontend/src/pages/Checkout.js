import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const Checkout = () => {
  const cartItems = useSelector((state) => state.cart.items); // Get cart items from Redux store

  const [fullName, setFullName] = useState(''); // Customer's name
  const [contactNumber, setContactNumber] = useState(''); // Contact number input
  const [address, setAddress] = useState(''); // Delivery address

  const totalAmount = cartItems.reduce(
    (total, item) => total + (item.price || 0) * item.quantity, // Calculate total based on price * quantity
    0
  );

  const handlePlaceOrder = () => {
    if (!fullName || !contactNumber || !address) {
      alert('Please fill in all fields'); // Basic form validation
      return;
    }

    alert(`✅ Order placed successfully for ₹${totalAmount}`); // Simulated confirmation
    console.log('Order details:', {
      fullName,
      contactNumber,
      address,
      cartItems,
      totalAmount,
    });
  };

  return (
    <div className="container mt-4">
      <h2>Checkout</h2>
      <h4>Order Summary</h4>
      <p><strong>Total:</strong> ₹{totalAmount.toFixed(2)}</p>

      <div className="mb-3">
        <label className="form-label">Full Name</label>
        <input
          type="text"
          className="form-control"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Your name"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Contact Number</label>
        <input
          type="tel"
          className="form-control"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          placeholder="10-digit number"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Delivery Address</label>
        <textarea
          className="form-control"
          rows="3"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Your address"
        ></textarea>
      </div>

      <button className="btn btn-primary" onClick={handlePlaceOrder}>
        Place Order
      </button>
    </div>
  );
};

export default Checkout;
