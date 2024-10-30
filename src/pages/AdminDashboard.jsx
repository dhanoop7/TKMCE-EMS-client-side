import React from 'react';
import { FaUsers, FaUserTie, FaCalendarCheck, FaChalkboardTeacher } from 'react-icons/fa'; 
import Sidebar from '../components/SideBar';

const AdminDashboard = () => {
  const sections = [
    { name: "Committee", icon: FaUsers, bgColor: "bg-blue-500", hoverColor: "hover:bg-blue-400" },
    { name: "Employee Management", icon: FaUserTie, bgColor: "bg-green-500", hoverColor: "hover:bg-green-400" },
    { name: "Leave Management", icon: FaCalendarCheck, bgColor: "bg-orange-500", hoverColor: "hover:bg-orange-400" },
    { name: "Conference", icon: FaChalkboardTeacher, bgColor: "bg-purple-500", hoverColor: "hover:bg-purple-400" },
  ];

  return (
    <div className="pt-24 flex min-h-screen overflow-hidden bg-gray-800">
      {/* Sidebar */}
      <div className="md:min-w-[18rem]">
        <Sidebar />
      </div>

      {/* Dashboard Content */}
      <div className="flex-grow pt-20 p-4 sm:p-6 lg:p-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-6 sm:mb-8">Admin Dashboard</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {sections.map((section, index) => (
            <div
              key={index}
              className={`${section.bgColor} ${section.hoverColor} p-4 sm:p-6 rounded-md shadow-md flex flex-col justify-between items-center text-center cursor-pointer`}
            >
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2 sm:mb-3">{section.name}</h3>
              <section.icon className="text-white" size={40} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;



