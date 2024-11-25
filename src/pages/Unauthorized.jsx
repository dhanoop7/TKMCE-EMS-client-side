import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate('/'); // Navigate to the login page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white p-6">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <FaLock className="text-red-500 text-6xl animate-pulse" />
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold mb-4">Unauthorized Access</h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-8">
          You must be logged in to access this page. Please login to continue.
        </p>

        <button
          onClick={handleGoToLogin}
          className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-transform duration-200 transform hover:scale-105 focus:outline-none focus:ring focus:ring-red-300"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
