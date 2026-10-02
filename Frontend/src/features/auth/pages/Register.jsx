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
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                    onChange={(e) => setEmail(e.target.value)} 
                    type="email" id="email" name="email" required />
                </div>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                    onChange={(e) => setUsername(e.target.value)}
                    type="text" id="username" name="username" required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                    onChange={(e) => setPassword(e.target.value)}
                    type="password" id="password" name="password" required />
                </div>
                <button className="button primary-button" type="submit">Register</button>
            </form>

            <p>Already have an account? <Link to="/login">Login</Link></p>

        </div>
    </main>
  )
}

export default Register