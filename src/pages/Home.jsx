import React from "react";
import LiveAlerts from "../components/LiveAlerts"; // Import the alert component

const Home = () => {
  return (
    <div className="pt-24 flex justify-center items-center min-h-screen bg-gradient-to-r from-white to-[#FFD3B6] text-gray-900 px-6">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10 items-center">
        
        {/* Left Side - Description */}
        <section className="space-y-4">
          <h1 className="text-4xl font-semibold">Disaster Management System</h1>
          <p className="text-lg text-gray-700">
            Our system collects and analyzes real-time disaster data, predicts potential risks, 
            and alerts users to ensure safety. Stay informed and report incidents easily.
          </p>
          <button className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg shadow-md">
            Report an Issue
          </button>
        </section>

        {/* Right Side - Live Alerts Component */}
        <LiveAlerts />
        
      </div>
    </div>
  );
};

export default Home;
