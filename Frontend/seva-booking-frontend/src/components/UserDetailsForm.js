import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserDetailsForm = () => {
  const [step, setStep] = useState("mobile"); // Tracks current form step: mobile, otp, or register
  const [mobile, setMobile] = useState(""); // Stores user mobile number
  const [otp, setOtp] = useState(""); // Stores entered OTP
  const [name, setName] = useState(""); // Stores user name during registration
  const [email, setEmail] = useState(""); // Stores user email during registration
  const [userId, setUserId] = useState(null); // Stores the user ID after verification
  const [error, setError] = useState(""); // Tracks error messages

  const navigate = useNavigate(); // Navigation hook from React Router

  const validateMobile = (number) => {
    // Validates if mobile number starts with 6-9 and is 10 digits
    return /^[6-9]\d{9}$/.test(number);
  };

  const handleMobileSubmit = async (e) => {
    e.preventDefault();
    if (!validateMobile(mobile)) {
      setError("Enter a valid 10-digit mobile number starting with 6-9.");
      return;
    }

    try {
      const res = await axios.get(`/api/users/identity-exist?contact=${mobile}`); // Check if user exists
      console.log(res.data);
      setStep("otp"); // Proceed to OTP if user exists
      setError("");
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setStep("register"); // Move to register if user not found
        setError("");
      } else {
        setError("Something went wrong while checking identity."); // API or server error
      }
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/users", { name, contact: mobile, email }); // Create new user
      await axios.post("/api/otp", { mobile }); // Send OTP after registration
      setStep("otp");
      setError("");
    } catch (err) {
      setError("Failed to register user and send OTP."); // Registration failure
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/otp-verify", { mobile, otp }); // Verify OTP
      if (res.data.message === "OTP verified successfully") {
        const user = await axios.get(`/api/users/${mobile}`); // Fetch user data
        setUserId(user.data.id); // Store user ID
        setError("");
        navigate("/payment"); // Navigate to payment page
      }
    } catch (err) {
      setError("Invalid OTP. Please try again."); // OTP verification failure
    }
  };

  return (
    <div>
      <h3>User Login / Registration</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {step === "mobile" && (
        <form onSubmit={handleMobileSubmit}>
          <input
            type="text"
            placeholder="Enter Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
          <button type="submit">Send OTP</button>
        </form>
      )}

      {step === "register" && (
        <form onSubmit={handleRegisterSubmit}>
          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Register & Send OTP</button>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={handleOtpVerify}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button type="submit">Verify OTP</button>
        </form>
      )}
    </div>
  );
};

export default UserDetailsForm;
