import React, { useState, useEffect } from "react";
import axios from "axios";
import request from "../config";

const AddEmployeeModal = ({ showModal, closeModal }) => {
  const initialEmployeeDetails = {
    name: "",
    pen: "",
    pan: "",
    department: "",
    designation: "",
    mob_number: "",
    email: "",
    address: "",
    type: "",
    qualifications: [],
  };

  const initialQualification = {
    qualificationId: "",
    stream: "",
  };

  const [employeeDetails, setEmployeeDetails] = useState(
    initialEmployeeDetails
  );
  const [qualifications, setQualifications] = useState([]);
  const [selectedQualification, setSelectedQualification] =
    useState(initialQualification);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [errors, setErrors] = useState({});

  const typeOptions = [
    { value: 0, label: "Permanent Teaching" },
    { value: 1, label: "Guest Teaching" },
    { value: 2, label: "Non-Teaching" },
  ];

  useEffect(() => {
    fetchDepartments();
    fetchDesignations();
    fetchQualifications();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(
        `${request.BaseUrlEmployee}/departments/`
      );
      setDepartments(response.data || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchDesignations = async () => {
    try {
      const response = await axios.get(
        `${request.BaseUrlEmployee}/designations/`
      );
      setDesignations(response.data || []);
    } catch (error) {
      console.error("Error fetching designations:", error);
    }
  };

  const fetchQualifications = async () => {
    try {
      const response = await axios.get(
        `${request.BaseUrlEmployee}/qualifications/`
      );
      setQualifications(response.data || []);
    } catch (error) {
      console.error("Error fetching qualifications:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleQualificationChange = (index, e) => {
    const { name, value } = e.target;
    const newQualifications = [...employeeDetails.qualifications];
    newQualifications[index] = { ...newQualifications[index], [name]: value };
    setEmployeeDetails((prevDetails) => ({
      ...prevDetails,
      qualifications: newQualifications,
    }));
  };

  const removeQualification = (index) => {
    setEmployeeDetails((prevDetails) => ({
      ...prevDetails,
      qualifications: prevDetails.qualifications.filter((_, i) => i !== index),
    }));
  };

  const addQualification = () => {
    setEmployeeDetails((prevDetails) => ({
      ...prevDetails,
      qualifications: [
        ...prevDetails.qualifications,
        { qualification: "", stream: "" },
      ],
    }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(
        `${request.BaseUrlEmployee}/employees/`,
        employeeDetails,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Employee added successfully:", response.data);

      const employeeId = response.data.id; // Getting the employee ID from the response

      // Save qualifications
      await saveQualifications(employeeId, employeeDetails.qualifications);

      closeModal();
      resetForm();
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        console.error("Error:", error.message);
      }
    }
  };

  const saveQualifications = async (employeeId, qualifications) => {
    try {
      for (const qualification of qualifications) {
        if (qualification.qualification) {
          // Ensure qualification is selected
          await axios.post(
            `${request.BaseUrlEmployee}/employee-qualifications/`,
            {
              employee: employeeId,
              qualification: qualification.qualification,
              stream: qualification.stream,
            }
          );
        }
      }
    } catch (error) {
      console.error("Error saving qualifications:", error);
    }
  };

  const resetForm = () => {
    setEmployeeDetails(initialEmployeeDetails);
    setErrors({});
  };

  const handleCloseModal = () => {
    resetForm();
    closeModal();
  };

  return (
    showModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity px-4 sm:px-0">
        <div className="bg-gray-800 rounded-lg shadow-lg w-full max-w-4xl p-4 sm:p-6 md:p-8 max-h-[80vh] overflow-y-auto animate-fade-in">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-4 sm:mb-6">
            Add Employee
          </h2>
          <form className="space-y-6">
            {/* Personal Details Section */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="w-full text-white p-2 sm:p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-500 transition"
                    value={employeeDetails.name}
                    onChange={handleChange}
                    required
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    PEN
                  </label>
                  <input
                    type="text"
                    name="pen"
                    className="w-full text-white p-2 sm:p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-500 transition"
                    value={employeeDetails.pen}
                    onChange={handleChange}
                    required
                  />
                  {errors.pen && (
                    <p className="text-red-500 text-sm mt-1">{errors.pen[0]}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    PAN
                  </label>
                  <input
                    type="text"
                    name="pan"
                    className="w-full text-white p-2 sm:p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-500 transition"
                    value={employeeDetails.pan}
                    onChange={handleChange}
                    required
                  />
                  {errors.pan && (
                    <p className="text-red-500 text-sm mt-1">{errors.pan[0]}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Details Section */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Contact Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="mob_number"
                    className="w-full p-2 sm:p-3 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-500 transition"
                    value={employeeDetails.mob_number}
                    onChange={handleChange}
                    required
                  />
                  {errors.mob_number && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.mob_number[0]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="w-full p-2 sm:p-3 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-500 transition"
                    value={employeeDetails.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email[0]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    className="w-full p-2 text-white sm:p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-500 transition"
                    value={employeeDetails.address}
                    onChange={handleChange}
                    required
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address[0]}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Education Section */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Education Qualification
              </h3>
              {employeeDetails.qualifications.map((qualification, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">
                      Qualification
                    </label>
                    <select
                      name="qualification"
                      className="w-full p-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-500 transition"
                      value={qualification.qualification}
                      onChange={(e) => handleQualificationChange(index, e)}
                    >
                      <option value="">Select Qualification</option>
                      {qualifications.map((qual) => (
                        <option key={qual.id} value={qual.id}>
                          {qual.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div >
                    <label className="block text-sm font-medium text-white mb-1">
                      Stream
                    </label>
                    <div className="flex">
                      <input
                      type="text"
                      name="stream"
                      className="w-72 p-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-500 transition"
                      value={qualification.stream}
                      onChange={(e) => handleQualificationChange(index, e)}
                      placeholder="Enter stream"
                    />
                    <button
                    type="button"
                    onClick={() => removeQualification(index)}
                    className="p-2 ml-5 sm:p-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                  >
                    Remove
                  </button></div>
                    
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="py-2 px-4 bg-green-600 rounded-md hover:bg-green-500 text-white font-semibold transition"
                onClick={addQualification}
              >
                Add Qualification
              </button>
            </div>

            {/* Job Details Section */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Job Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Department
                  </label>
                  <select
                    name="department"
                    className="w-full p-2 text-white sm:p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-500 transition"
                    value={employeeDetails.department}
                    onChange={handleChange}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.department_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Designation
                  </label>
                  <select
                    name="designation"
                    className="w-full p-2 sm:p-3 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-500 transition"
                    value={employeeDetails.designation}
                    onChange={handleChange}
                  >
                    <option value="">Select Designation</option>
                    {designations.map((designation) => (
                      <option key={designation.id} value={designation.id}>
                        {designation.designation_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Type
                  </label>
                  <select
                    name="type"
                    className="w-full p-2 sm:p-3 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-500 transition"
                    value={employeeDetails.type}
                    onChange={handleChange}
                  >
                    <option value="">Select Type</option>
                    {typeOptions.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                type="button"
                className="py-2 px-4 bg-red-600 rounded-md hover:bg-red-500 text-white font-semibold transition"
                onClick={handleCloseModal}
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
