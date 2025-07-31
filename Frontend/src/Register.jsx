import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email || !username || !password) {
      alert('All fields are required');
      return;
    }
    if (password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setStep(2);
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      alert('Enter OTP');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Registration successful!');
        navigate('/login');
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f3f4f6',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 8,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: 20 }}>
          {step === 1 ? 'Register' : 'Verify OTP'}
        </h2>

        {step === 1 ? (
          <>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: 8, marginBottom: 10 }}
            />

            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: 8, marginBottom: 10 }}
            />

            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: 8, marginBottom: 20 }}
            />

            <button
              onClick={handleSendOtp}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: 10,
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </>
        ) : (
          <>
            <label>Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={{ width: '100%', padding: 8, marginBottom: 20 }}
            />

            <button
              onClick={handleVerifyOtp}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: 10,
                backgroundColor: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Register;
