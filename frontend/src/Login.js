import React, { useState } from 'react';
import axios from 'axios';
import './auth.css';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      });

      const token = res.data.token;
      localStorage.setItem('token', token);
      onLogin(token); // callback to set auth in App.js
    } catch (err) {
      alert('Login failed. Check credentials.');
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login </h2>
      <form onSubmit={handleLogin} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          className="auth-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="auth-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="auth-button">Login</button>
      </form>
    </div>
  );
}

export default Login;
