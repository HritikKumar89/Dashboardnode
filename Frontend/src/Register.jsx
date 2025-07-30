import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !password) {
      alert('Username and password are required');
      return;
    }
    if (password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        navigate('/login');
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to register. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 20, border: '1px solid' }}>
      <h2>Register</h2>
      <div style={{ marginBottom: 10 }}>
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: '100%', padding: 8, marginTop: 4 }}
        />
      </div>
      <div style={{ marginBottom: 10 }}>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: 8, marginTop: 4 }}
        />
      </div>
      <button onClick={handleRegister} disabled={isLoading} style={{ width: '100%', padding: 10 }}>
        {isLoading ? 'Registering...' : 'Register'}
      </button>
    </div>
  );
}

export default Register;

