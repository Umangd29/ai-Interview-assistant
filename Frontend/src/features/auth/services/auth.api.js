import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    withCredentials: true,
})


export async function registerUser({ username, email, password }) {
  try {
    const response = await API.post('/api/auth/register', {
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
    const response = await API.post('/api/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response ? error.response.data : error.message);
    throw new Error('Failed to login user');
  }
}

export async function logoutUser() {
  try {
    const response = await API.post('/api/auth/logout');
    return response.data;
  } catch (error) {
    console.error('Logout error:', error.response ? error.response.data : error.message);
    throw new Error('Failed to logout user');
  }
}

export async function getMe() {
  try {
    const response = await API.get('/api/auth/get-me');
    return response.data;
  } catch (error) {
    console.error('GetMe error:', error.response ? error.response.data : error.message);
    throw new Error('Failed to fetch user information');
  }
}