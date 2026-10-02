import React from 'react'
import '../auth.form.scss'
import { useNavigate, Link } from 'react-router';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';


const Register = () => { 

    const navigateToLogin = useNavigate();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const { loading, handleRegister } = useAuth(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleRegister({email, username, password});
        navigate('/');
    }   
  return (
    <main>
      <div className="form-container">
        <div className="form-header">
          <div className="form-logo">&hearts;</div>
          <span className="form-eyebrow">GET STARTED</span>
          <h1>Create Account</h1>
          <p>Join us and start building your interview strategy.</p>
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
            <label htmlFor="username">Username</label>
            <input
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              id="username"
              name="username"
              placeholder="Choose a username"
              autoComplete="username"
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
              placeholder="Create a password"
              autoComplete="new-password"
              required
            />
          </div>

          <button
            className="button primary-button"
            type="submit"
          >
            Create Account
            <span className="button-arrow">→</span>
          </button>
        </form>

        <p className="form-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </main>
  );
}

export default Register