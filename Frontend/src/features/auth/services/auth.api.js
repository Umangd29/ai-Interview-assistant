import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api/auth',
  withCredentials: true // Include credentials in the request
});

export async function registerUser({ username, email, password }) {
  try {
    const response = await API.post('/register', {
      username,
      email,
      password
    });
    return response.data;
  } catch (error) {
    console.error('Register error:', error.response ? error.response.data : error.message);
    throw new Error('Failed to register user');
  }
}

export async function loginUser({ email, password }) {
  try {
    const response = await API.post('/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response ? error.response.data : error.message);
    throw new Error('Failed to login user');
  }
}

export async function logoutUser() {
  try {
    const response = await API.get('/logout');
    return response.data;
  } catch (error) {
    console.error('Logout error:', error.response ? error.response.data : error.message);
    throw new Error('Failed to logout user');
  }
}

export async function getMe() {
  try {
    const response = await API.get('/get-me');
    return response.data;
  } catch (error) {
    console.error('GetMe error:', error.response ? error.response.data : error.message);
    throw new Error('Failed to fetch user information');
  }
}