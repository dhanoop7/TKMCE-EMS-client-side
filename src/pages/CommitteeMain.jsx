import React from 'react'
import Sidebar from '../components/SideBar';
import { useNavigate } from 'react-router-dom';
import { MdGroups } from "react-icons/md";
import { FaFileInvoice } from "react-icons/fa";
import { BsFileEarmarkPersonFill } from "react-icons/bs";

const CommitteeMain = () => {
  const navigate = useNavigate()
  const handleNavigateGenerateReport = () =>{
    navigate("/generate-report")
  }
  const handleNavigateAddCommittee = () =>{
    navigate("/committee")
  }
  const handleNavigateListEmployee = () =>{
    navigate("/list-employee")
  }
  return (
    <div className="pt-24 flex h-screen overflow-hidden bg-gray-800">
      {/* Sidebar */}
      <div className="md:min-w-[18rem]">
        <Sidebar />
      </div>

      {/* Dashboard Content */}
      <div className="flex-grow pt-20 p-4 sm:p-6 lg:p-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-6 sm:mb-8">Committee Management Dashboard</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Add Employee Section */}
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600  transition-transform duration-200 transform hover:scale-105 hover:shadow-2xl p-6 rounded-md shadow-md flex flex-col justify-between items-center text-center cursor-pointer"
             // Open modal on click
             onClick={handleNavigateAddCommittee}
          >
            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">Add Committee</h3>
            <MdGroups className="text-white" size={40} />
          </div>

          {/* Search Employee Section */}
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600  transition-transform duration-200 transform hover:scale-105 hover:shadow-2xl p-6 rounded-md shadow-md flex flex-col justify-between items-center text-center cursor-pointer"
            // Open modal on click
            onClick={handleNavigateGenerateReport}
          >
            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">Generate Report</h3>
            {/* <FaSearch className="text-white" size={40} /> */}
            <FaFileInvoice className='text-white' size={40} />
          </div>

          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600  transition-transform duration-200 transform hover:scale-105 hover:shadow-2xl p-6 rounded-md shadow-md flex flex-col justify-between items-center text-center cursor-pointer"
            // Open modal on click
            onClick={handleNavigateListEmployee}
          >
            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">List Employee</h3>
            {/* <FaSearch className="text-white" size={40} /> */}
            <BsFileEarmarkPersonFill  className='text-white' size={40} />
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default CommitteeMain