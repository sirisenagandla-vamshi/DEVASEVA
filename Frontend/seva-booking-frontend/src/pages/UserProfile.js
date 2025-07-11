import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaUser, FaHistory, FaRupeeSign } from 'react-icons/fa';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const reduxUser = useSelector(state => state.user);

  const userId = localStorage.getItem('userId') || reduxUser?.id;

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) {
        setError('Please login to view profile');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await axiosInstance.get(`/users/profile?id=${userId}`);

        if (res.data) {
          setUserData(res.data.user);
          setOrders(res.data.latestOrders || []);
        } else {
          setError('No profile data found');
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/payment');
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error && error.includes("login")) {
    return (
      <motion.div
        className="container mt-5 d-flex flex-column align-items-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="alert alert-warning text-center p-4" style={{ maxWidth: '600px' }}>
          <h4>🚫 You're not logged in</h4>
          <p className="mt-3">Please log in or complete a booking to view your profile and recent orders.</p>
          <button className="btn btn-primary mt-2" onClick={() => navigate("/payment")}>
            Go to Login / Payment Page
          </button>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          {error}
          <button className="btn btn-link" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="container mt-4"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">
            <FaUser className="me-2" />
            User Profile
          </h3>
        </div>

        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-6">
              <h5>Personal Details</h5>
              <hr />
              <p><strong>Name:</strong> {userData.name}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Mobile:</strong> {userData.contact}</p>
            </div>
            <div className="col-md-6 text-end">
              <button className="btn btn-danger" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>

          <div className="mt-4">
            <h5><FaHistory className="me-2" /> Recent Orders</h5>
            <hr />
            {orders.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Items</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.order_id}>
                        <td>#{order.order_id}</td>
                        <td>{new Date(order.created_at).toLocaleDateString()}</td>
                        <td>
                          <ul className="list-unstyled">
                            {order.items.map((item, idx) => (
                              <li key={idx}>
                                {item.name || item.title} × {item.quantity}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td><FaRupeeSign /> {order.amounttopay.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="alert alert-info">No recent orders found</div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserProfile;
