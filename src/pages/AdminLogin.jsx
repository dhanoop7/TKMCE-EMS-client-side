import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import requests from '../config';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error on new submission

    try {
      const response = await axios.post(`${requests.BaseUrlAuth}/adminlogin/`, {
        username,
        password,
      });

      // If login is successful, store the access token in cookies
      if (response.data.access) {
        Cookies.set('accessToken', response.data.access, { expires: 1 }); // Expires in 1 day
        
        // Redirect to the admin dashboard or home page
        window.location.href = '/admin-dashboard'; // Adjust the path as needed
      }
    } catch (error) {
      setError(error.response?.data?.detail || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen animated-gradient p-4">
      <div className="bg-black/20 backdrop-blur-md p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md border border-black/30">
        <h2 className="text-2xl font-thin text-center mb-6 text-white">Admin Login</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <div className="mb-4">
            <label className="block text-white text-sm font-thin mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              className="w-full px-4 py-2 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-transparent text-white placeholder-gray-300"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-white text-sm font-thin mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-transparent text-white placeholder-gray-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-slate-800 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition-colors duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
