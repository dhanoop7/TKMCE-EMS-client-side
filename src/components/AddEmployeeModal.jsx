import React, { useState, useEffect } from "react";
import axios from "axios";
import request from "../config";

const AddEmployeeModal = ({ showModal, closeModal }) => {
  const [employeeDetails, setEmployeeDetails] = useState({
    name: "",
    pen: "",
    pan: "",
    department: "",
    designation: "",
    mob_number: "",
    email: "",
    address: "",
    // qualifications: [""],
  });
  
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);

  // Function to fetch department data
  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${request.BaseUrlEmployee}/departments/`);
      if (Array.isArray(response.data)) {
        setDepartments(response.data);
      } else {
        console.error("Unexpected data format for departments:", response.data);
        setDepartments([]);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      setDepartments([]);
    }
  };

  // Function to fetch designation data
  const fetchDesignations = async () => {
    try {
      const response = await axios.get(`${request.BaseUrlEmployee}/designations/`);
      if (Array.isArray(response.data)) {
        setDesignations(response.data);
      } else {
        console.error("Unexpected data format for designations:", response.data);
        setDesignations([]);
      }
    } catch (error) {
      console.error("Error fetching designations:", error);
      setDesignations([]);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchDesignations();
  }, []);

  // Single handler for input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
    console.log(employeeDetails);
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(`${request.BaseUrlEmployee}/employees/`, employeeDetails, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Employee added successfully:", response.data);
      closeModal(); 
    } catch (error) {
      if (error.response) {
        console.error("Error adding employee:", error.response.data);
      } else {
        console.error("Error:", error.message);
      }
    }
  };

  return (
    showModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity px-4 sm:px-0">
        <div className="bg-gray-800 rounded-lg shadow-lg w-full max-w-4xl p-4 sm:p-6 md:p-8 max-h-[80vh] overflow-y-auto animate-fade-in">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-4 sm:mb-6">Add Employee</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  className="w-full p-2 sm:p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-500 transition"
                  value={employeeDetails.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">PEN</label>
                <input
                  type="text"
                  name="pen"
                  className="w-full p-2 sm:p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-500 transition"
                  value={employeeDetails.pen}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">PAN</label>
                <input
                  type="text"
                  name="pan"
                  className="w-full p-2 sm:p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-500 transition"
                  value={employeeDetails.pan}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">Department</label>
                <select
                  name="department"
                  className="w-full p-2 sm:p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-500 transition"
                  value={employeeDetails.department}
                  onChange={handleChange}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>{dept.dept_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">Designation</label>
                <select
                  name="designation"
                  className="w-full p-2 sm:p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-500 transition"
                  value={employeeDetails.designation}
                  onChange={handleChange}
                >
                  <option value="">Select Designation</option>
                  {designations.map((designation) => (
                    <option key={designation.id} value={designation.id}>{designation.designation_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">Mobile Number</label>
                <input
                  type="tel"
                  name="mob_number"
                  className="w-full p-2 sm:p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-500 transition"
                  value={employeeDetails.mob_number}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  className="w-full p-2 sm:p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-500 transition"
                  value={employeeDetails.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">Address</label>
                <textarea
                  name="address"
                  className="w-full p-2 sm:p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-500 transition"
                  value={employeeDetails.address}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Uncomment this section if you want to include qualifications
              <div className="col-span-1">
                <label className="block text-sm font-medium text-white mb-1">Qualifications</label>
                {employeeDetails.qualifications.map((qualification, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      className="w-full p-2 sm:p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-500 transition"
                      value={qualification}
                      onChange={(e) => handleQualificationChange(index, e.target.value)}
                      placeholder="Enter qualification"
                    />
                    <button
                      type="button"
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition"
                      onClick={() => {
                        const newQualifications = employeeDetails.qualifications.filter((_, i) => i !== index);
                        setEmployeeDetails({ ...employeeDetails, qualifications: newQualifications });
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition"
                  onClick={addQualification}
                >
                  Add Qualification
                </button>
              </div>
              */}
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                type="button"
                className="py-2 px-4 bg-red-600 rounded-md hover:bg-red-500 text-white font-semibold transition"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="py-2 px-4 bg-blue-600 rounded-md hover:bg-blue-500 text-white font-semibold transition"
                onClick={handleSave}
              >
                Save Employee
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AddEmployeeModal;
