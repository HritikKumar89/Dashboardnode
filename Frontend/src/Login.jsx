import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                alert('Login successful!');
                navigate('/Dashboard');
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '100px auto', padding: 20, border: '1px solid' }}>
            <h2>Login</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
            <button onClick={handleLogin} style={{ width: '100%', padding: 10 }}>Login</button>
        </div>
    );
}

export default Login;
