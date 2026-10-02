import React from 'react'
import '../auth.form.scss'
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../hooks/useAuth.js';
import { useState } from 'react';

const Login = () => {

    const { loading,handleLogin } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await handleLogin({ email, password });
        if (success) {
            navigate('/');
        }
    };

    if (loading) {
        return <main><h1>Loading...</h1></main>;
    }

  return (
    <main>
      <div className="form-container">
        <div className="form-header">
          <div className="form-logo">&hearts;</div>
          <span className="form-eyebrow">WELCOME BACK</span>
          <h1>Login</h1>
          <p>Sign in to continue your interview preparation.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            className="button primary-button"
            type="submit"
          >
            Login
            <span className="button-arrow">→</span>
          </button>
        </form>

        <p className="form-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </main>
  );
}

export default Login