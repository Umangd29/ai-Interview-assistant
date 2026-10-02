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
        await handleLogin({email, password});
        navigate('/');
    };

    if (loading) {
        return <main><h1>Loading...</h1></main>;
    }
    return (
    <main>
        <div className="form-container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                    onChange={(e) => setEmail(e.target.value)}
                    type="email" id="email" name="email" required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input 
                    onChange={(e) => setPassword(e.target.value)}
                    type="password" id="password" name="password" required />
                </div>
                <button className="button primary-button" type="submit">Login</button>
            </form>
        </div>
        <p>Don't have an account? <Link to="/register">Register</Link></p>
    </main>
  )
}

export default Login