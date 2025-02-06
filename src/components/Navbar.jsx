import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-white to-[#FFD3B6] p-5 fixed top-0 w-full z-10 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo / Title */}
        <div className="flex items-center">
          <span className="text-gray-900 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold">
            SDMS
          </span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="#home" className="text-gray-800 hover:text-gray-600 text-lg font-medium">
            Home
          </a>
          <a href="#alerts" className="text-gray-800 hover:text-gray-600 text-lg font-medium">
            Alerts
          </a>
          <a href="#resources" className="text-gray-800 hover:text-gray-600 text-lg font-medium">
            Resources
          </a>
          <a href="#contacts" className="text-gray-800 hover:text-gray-600 text-lg font-medium">
            Emergency Contacts
          </a>
        </div>

        {/* Report Issue Button */}
        <div>
          <a
            href="#report"
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium shadow-md"
          >
            Report Issue
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

