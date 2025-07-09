import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaUser, FaHistory, FaRupeeSign } from 'react-icons/fa';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const reduxUser = useSelector(state => state.user);

  // Get userId from localStorage (set during login) or Redux
  const userId = localStorage.getItem('userId') || reduxUser?.id;

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) {
        setError('Please login to view profile');
        setLoading(false);
        navigate('/user'); // Redirect to login if no userId
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
  }, [userId, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    // If using Redux, dispatch logout action here
    navigate('/');
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

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          {error}
          <button 
            className="btn btn-link"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">
            <FaUser className="me-2" />
            User Profile
          </h3>
        </div>

        <div className="card-body">
          {userData ? (
            <>
              <div className="row mb-4">
                <div className="col-md-6">
                  <h5>Personal Details</h5>
                  <hr />
                  <p><strong>Name:</strong> {userData.name}</p>
                  <p><strong>Email:</strong> {userData.email}</p>
                  <p><strong>Mobile:</strong> {userData.contact}</p>
                </div>
                <div className="col-md-6 text-end">
                  <button 
                    className="btn btn-danger"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <h5>
                  <FaHistory className="me-2" />
                  Recent Orders
                </h5>
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
                            <td>
                              {new Date(order.created_at).toLocaleDateString()}
                            </td>
                            <td>
                              <ul className="list-unstyled">
                                {order.items.map((item, idx) => (
                                  <li key={idx}>
                                    {item.title} × {item.quantity}
                                  </li>
                                ))}
                              </ul>
                            </td>
                            <td>
                              <FaRupeeSign /> 
                              {order.amounttopay.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="alert alert-info">
                    No recent orders found
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="alert alert-warning">
              No user data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;