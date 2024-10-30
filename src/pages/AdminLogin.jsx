import React from 'react';

const AdminLogin = () => {
  return (
    <div className="flex items-center justify-center min-h-screen animated-gradient p-4">
      <div className="bg-black/20 backdrop-blur-md p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md border border-black/30">
        <h2 className="text-2xl font-thin text-center mb-6 text-white">Admin Login</h2>
        <form>
          <div className="mb-4">
            <label className="block text-white text-sm font-thin mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-transparent text-white placeholder-gray-300"
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


