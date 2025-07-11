import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../redux/slices/cartSlice";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.items);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState("");

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleSendOtp = async () => {
    setError("");

    if (!/^[6-9]\d{9}$/.test(contact)) {
      setError("Invalid mobile number.");
      return;
    }

    try {
      const res = await axiosInstance.get(
        `/users/identity-exist?contact=${contact}`
      );
      const exists = res.data.exists;
      setIsExistingUser(exists);

      if (!exists) {
        const user = await axiosInstance.post("/users", {
          name,
          email,
          contact,
        });
        setUserId(user.data.id);
      } else {
        const existingUser = await axiosInstance.get(
          `/users/by-contact/${contact}`
        );
        setUserId(existingUser.data.id);
      }

      await axiosInstance.post("/users/otp", { contact });
      setShowOtpInput(true);
    } catch (err) {
      console.error(err);
      setError("Registration failed");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axiosInstance.post("/users/otp-verify", {
        contact,
        otp,
      });

      if (response.data.success) {
        // ✅ Save userId to localStorage
        localStorage.setItem("userId", userId);

        // ✅ Place order
        await axiosInstance.post("/orders", {
          user_id: userId,
          items: cart,
          address: {
            name,
            email,
            contact,
            addressType: "Online",
          },
          amounttopay: totalAmount,
          paymentid: Date.now(),
        });

        alert("✅ OTP Verified and Order Placed Successfully.");
        dispatch(clearCart());
        navigate("/user");
      } else {
        setError("Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      setError("OTP Verification or Order Failed");
    }
  };

  return (
    <div className="container mt-5">
      <h2>🔐 Secure Payment</h2>

      {!isExistingUser && (
        <>
          <div className="form-group">
            <label>Full Name</label>
            <input
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </>
      )}

      <div className="form-group">
        <label>Mobile Number</label>
        <input
          className="form-control"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
      </div>

      {!showOtpInput ? (
        <button className="btn btn-primary mt-2" onClick={handleSendOtp}>
          Register & Send OTP
        </button>
      ) : (
        <>
          <input
            className="form-control mt-3"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button className="btn btn-success mt-2" onClick={handleVerifyOtp}>
            Verify OTP & Proceed
          </button>
        </>
      )}

      {error && <div className="text-danger mt-2">{error}</div>}

      <h4 className="mt-5">📄 Order Summary</h4>
      <ul>
        {cart.map((item) => (
          <li key={item.id}>
            {item.name} × {item.quantity} = ₹
            {(item.price * item.quantity).toFixed(2)}
          </li>
        ))}
      </ul>

      <strong>Total Amount: ₹{totalAmount.toFixed(2)}</strong>
    </div>
  );
};

export default Payment;
