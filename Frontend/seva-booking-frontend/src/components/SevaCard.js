import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import imageMap from '../utils/imageMap';
import styles from './SevaCard.module.css';

const SevaCard = ({ seva }) => {
  const dispatch = useDispatch(); // Hook to dispatch Redux actions
  const [quantity, setQuantity] = useState(1); // State to manage quantity input

  const handleAddToCart = () => {
    // Dispatches the selected seva item with quantity to the Redux cart
    dispatch(addToCart({ ...seva, quantity: Number(quantity) }));
  };

  return (
    <div className="card m-3" style={{ width: '18rem', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <img
        src={imageMap[seva.media?.toLowerCase()]} // Dynamically maps image based on seva media key
        className="card-img-top"
        alt={seva.title}
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <div className="card-body">
        <h5 className="card-title">{seva.title}</h5>
        <p className="card-text text-muted" style={{ fontSize: '14px' }}>{seva.description}</p>
        <p><strong>₹{seva.discountedprice}</strong> <s style={{ color: 'gray' }}>₹{seva.marketprice}</s></p>
        <div className="input-group mb-2">
          <input
            type="number"
            value={quantity}
            min="1"
            className="form-control"
            onChange={(e) => setQuantity(e.target.value)} // Updates quantity state on input change
          />
        </div>
        <button onClick={handleAddToCart} className="btn btn-primary w-100">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default SevaCard;
