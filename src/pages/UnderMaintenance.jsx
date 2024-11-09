import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTools } from 'react-icons/fa';

const UnderMaintenance = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white p-6">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <FaTools className="text-blue-500 text-6xl animate-bounce" />
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-bold mb-4">Page Under Maintenance</h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-8">
          We’re making some improvements to bring you a better experience. Please check back soon.
        </p>
        
        <button
          onClick={handleGoBack}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-transform duration-200 transform hover:scale-105 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default UnderMaintenance;
