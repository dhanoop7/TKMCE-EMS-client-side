import React from "react";
import Cookies from 'js-cookie'; // Import js-cookie to handle cookies

const Navbar = () => {
  const accessToken = Cookies.get('accessToken'); // Check for the access token

  const handleLogout = () => {
    // Logic for handling logout
    // For example, remove the access token and redirect to login
    Cookies.remove('accessToken'); // Remove the token
    window.location.href = '/'; // Redirect to the login page
  };

  return (
    <nav className="bg-slate-950 p-5 fixed top-0 w-full z-10">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold">TKMCE</span>
          <span className="text-cyan-500 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mx-1">EMS</span>
        </div>
        <div className="flex items-center space-x-4">
          {accessToken ? ( // Conditional rendering based on access token
            <button
              onClick={handleLogout} // Attach the logout handler
              className="text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500  font-semibold py-2 px-4 rounded-full shadow-lg transition duration-150 ease-in-out focus:outline-none focus:ring focus:ring-blue-300  text-xs sm:text-sm md:text-md lg:text-lg xl:text-xl  text-center mb-2"
            >
              Logout
            </button>
          ) : null} {/* Render nothing if the user is not logged in */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

