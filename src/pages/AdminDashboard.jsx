import React from 'react';
import { FaUsers, FaUserTie, FaCalendarCheck, FaChalkboardTeacher } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/SideBar';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const sections = [
    { name: "Committee", icon: FaUsers, bgColor: "bg-gradient-to-r from-blue-600 to-purple-600", path: "/committee-dashboard" },
    { name: "Employee Management", icon: FaUserTie, bgColor: "bg-gradient-to-r from-blue-600 to-purple-600", path: "/employee" },
    { name: "Leave Management", icon: FaCalendarCheck, bgColor: "bg-gradient-to-r from-blue-600 to-purple-600", path: "/under-maintenance" },
    { name: "Conference", icon: FaChalkboardTeacher, bgColor: "bg-gradient-to-r from-blue-600 to-purple-600", path: "/under-maintenance" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="pt-24 flex min-h-screen overflow-hidden bg-gray-800">
      <div className="md:min-w-[18rem]">
        <Sidebar />
      </div>

      <div className="flex-grow pt-20 p-4 sm:p-6 lg:p-10">
        <h2 className="text-3xl sm:text-4xl font-thin text-center text-white mb-6 sm:mb-8">Admin Dashboard</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-10 pt-10">
          {sections.map((section, index) => (
            <div
              key={index}
              className={`${section.bgColor} text-white font-semibold p-6 sm:p-8 rounded-md shadow-lg flex flex-col justify-between items-center text-center cursor-pointer transition-transform duration-200 transform hover:scale-105 hover:shadow-2xl`}
              onClick={() => handleNavigation(section.path)}
            >
              <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">{section.name}</h3>
              <section.icon className="text-white" size={48} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;





