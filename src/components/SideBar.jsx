import React, { useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi"; 
import { PiVideoConferenceFill } from "react-icons/pi";
import { FaUsers, FaUserTie } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Sidebar = ({ defaultClosed }) => {
  const [open, setOpen] = useState( !defaultClosed );
//   const navigate = useNavigate(); // Get the navigate function

  const menus = [
    {name: "Demo", path: '', icon: MdDashboard},
    { name: "Demo", path: '', icon: FaUsers },
    { name: "Demo", path: '', icon: PiVideoConferenceFill },
    { name: "Demo", path: '', icon: FaUserTie },
    { name: "Demo", path: '', icon: PiVideoConferenceFill },
     
    // { name: "Leave Management", path: '/leave_management', icon: FaCalendarCheck }, 
    // { name: "Conference", path: '/conference_management', icon: FaChalkboardTeacher },
    // { name: "Logout", path: '/', icon: GrLogout },
  ];

//   const handleNavigation = (path) => {
//     navigate(path); // Navigate to the specified path
//   };

  return (
    <div className="h-full fixed">
      <div className={`bg-slate-950 text-white h-full ${open ? "w-72" : "w-16"} duration-500 px-4`}>
        <div className="py-3 flex justify-end">
          <HiMenuAlt3
            size={26}
            className="cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <div className="list-none mt-4 flex flex-col gap-4">
          {menus.map((menu, i) => (
            <div
              key={i}
              className="flex items-center text-xl gap-3.5 font-medium p-2 cursor-pointer hover:bg-gray-800 rounded-md"
            //   onClick={() => handleNavigation(menu.path)} // Call handleNavigation on click
            >
              <div>{React.createElement(menu.icon, { size: "20" })}</div>
              <h2
                style={{ transitionDelay: `${i + 3}00ms` }}
                className={`whitespace-pre duration-500 ${!open && "opacity-0 translate-x-28 overflow-hidden"}`}
              >
                {menu.name}
              </h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
