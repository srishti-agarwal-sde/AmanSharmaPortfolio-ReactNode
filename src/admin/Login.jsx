import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch(err) {
      setError('Server error connecting to backend.');
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="glass-card login-card">
        <h2>Admin Gateway</h2>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleLogin}>
          <input 
            type="password" 
            placeholder="Enter Secret Key" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Access Control</button>
        </form>
        <a href="/" className="back-link">Return to Public Site</a>
      </div>
    </div>
  );
}
