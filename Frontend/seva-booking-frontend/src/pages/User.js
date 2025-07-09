import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';

const User = () => {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [userExists, setUserExists] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [verified, setVerified] = useState(false);
  const [userData, setUserData] = useState(null);

  const [pin, setPin] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [addressType, setAddressType] = useState('Home');
  const [pinLoading, setPinLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState('');

  const [error, setError] = useState('');

  const handleMobileSubmit = async () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError('Enter valid 10-digit mobile number starting with 6, 7, 8, or 9.');
      return;
    }

    try {
      const res = await axios.get(`/users/identity-exist?contact=${mobile}`);
      setUserExists(res.data.exists);

      if (res.data.exists) {
        await axios.post('/otp', { contact: mobile }); // send OTP
      }

      setShowOtpInput(true);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Try again.');
    }
  };

  const handleOtpSubmit = async () => {
    try {
      const res = await axios.post('/otp-verify', { contact: mobile, otp });

      if (res.data.success) {
        const userRes = await axios.get(`/users/${res.data.userId}`);
        setUserData(userRes.data);
        setVerified(true);
        setError('');
      } else {
        setError('Invalid OTP. Try again.');
      }
    } catch (err) {
      console.error(err);
      setError('OTP verification failed.');
    }
  };

  const handleCreateUser = async () => {
    if (!name || !email) {
      setError('Please fill in both name and email.');
      return;
    }

    try {
      await axios.post('/users', { name, contact: mobile, email });
      await axios.post('/otp', { contact: mobile });

      setUserExists(true);
      setShowOtpInput(true);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to create user.');
    }
  };

  const handlePincodeChange = async (e) => {
    const val = e.target.value;
    setPin(val);

    if (val.length === 6) {
      setPinLoading(true);
      setPincodeError('');
      try {
        const res = await axios.get(`/address-by-pincode/${val}`);
        setCity(res.data.city);
        setState(res.data.state);
      } catch (err) {
        setCity('');
        setState('');
        setPincodeError('Invalid Pincode');
      } finally {
        setPinLoading(false);
      }
    }
  };

  return (
    <Container className="py-5">
      <h2>User Details</h2>

      {!verified ? (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter 10-digit number"
              maxLength="10"
            />
          </Form.Group>

          <Button onClick={handleMobileSubmit} className="mb-3">
            Submit
          </Button>

          {showOtpInput && (
            <>
              {userExists ? (
                <>
                  <Form.Group className="mb-2">
                    <Form.Label>OTP</Form.Label>
                    <Form.Control
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                    />
                  </Form.Group>
                  <Button onClick={handleOtpSubmit}>Verify OTP</Button>
                </>
              ) : (
                <>
                  <Form.Group className="mb-2">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Full Name"
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@domain.com"
                    />
                  </Form.Group>
                  <Button onClick={handleCreateUser}>Create User & Send OTP</Button>
                </>
              )}
            </>
          )}

          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        </>
      ) : (
        <>
          <Alert variant="success">✅ User verified successfully</Alert>
          <h5>Name: {userData.name}</h5>
          <h6>Email: {userData.email}</h6>
          <h6>Mobile: {userData.contact}</h6>

          <hr />
          <h4>Address</h4>

          <Form.Group className="mb-2">
            <Form.Label>Pincode</Form.Label>
            <Form.Control
              type="text"
              value={pin}
              onChange={handlePincodeChange}
              maxLength="6"
              placeholder="Enter 6-digit Pincode"
            />
            {pinLoading && <Spinner animation="border" size="sm" className="ms-2" />}
            {pincodeError && <Form.Text className="text-danger">{pincodeError}</Form.Text>}
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>City</Form.Label>
                <Form.Control value={city} readOnly />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>State</Form.Label>
                <Form.Control value={state} readOnly />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-2">
            <Form.Label>Address Line 1</Form.Label>
            <Form.Control
              type="text"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Address Line 2</Form.Label>
            <Form.Control
              type="text"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Address Type</Form.Label>
            <Form.Select
              value={addressType}
              onChange={(e) => setAddressType(e.target.value)}
            >
              <option>Home</option>
              <option>Work</option>
              <option>Other</option>
            </Form.Select>
          </Form.Group>
        </>
      )}
    </Container>
  );
};

export default User;
