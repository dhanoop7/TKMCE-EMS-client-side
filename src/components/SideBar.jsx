import React, { useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi"; 

import { PiVideoConferenceFill } from "react-icons/pi";
import { GrLogout } from "react-icons/gr"; 

import { FaUsers, FaUserTie, FaCalendarCheck, FaChalkboardTeacher } from "react-icons/fa";

const Sidebar = () => {
  const [open, setOpen] = useState(true);

  const menus = [
    { name: "Add Committee", path: '/add_committee', icon: FaUsers },
    { name: "Show Committee", path: '/show_committee', icon: PiVideoConferenceFill },
    { name: "Employee Management", path: '/add_employee', icon: FaUserTie }, 
    { name: "Leave Management", path: '/leave_management', icon: FaCalendarCheck }, 
    { name: "Conference", path: '/conference_management', icon: FaChalkboardTeacher },
    { name: "Logout", path: '/', icon: GrLogout },
  ];

  return (
    <div className=" h-full fixed">
      <div
        className={`bg-slate-950 text-white h-full ${open ? "w-72" : "w-16"} duration-500 px-4`}
      >
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
              onClick={() => console.log(`Navigating to ${menu.path}`)} // Placeholder for navigation
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


