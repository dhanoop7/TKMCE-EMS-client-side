import React, { useEffect, useState } from "react";
import axios from "axios";
import requests from "../config";
import Sidebar from "../components/SideBar";
import Select from "react-select";

const ListEmployee = () => {
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState({
    value: null,
    label: "All Departments",
  });
  const [selectedType, setSelectedType] = useState({
    value: null,
    label: "All Types",
  });
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [selectedOrder, setSelectedOrder] = useState("asc");

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Debounce logic to delay API calls
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchText]);

  // Fetch employees when debouncedSearchText or selectedDepartment changes
  useEffect(() => {
    fetchEmployeesInCommittees();
  }, [debouncedSearchText, selectedDepartment, selectedType]);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${requests.BaseUrlEmployee}/departments/`);
      const departmentOptions = response.data.map((department) => ({
        value: department.id,
        label: department.department_name,
      }));
      departmentOptions.unshift({ value: null, label: "All Departments" });
      setDepartments(departmentOptions);

      if (!selectedDepartment) {
        setSelectedDepartment(departmentOptions[0]);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchEmployeesInCommittees = async () => {
    setLoadingEmployees(true);
    try {
      const params = {};
      if (selectedDepartment?.value) params.department = selectedDepartment.value;
      if (selectedType?.value !== null) params.type = selectedType.value;
      if (debouncedSearchText) params.search = debouncedSearchText;

      const response = await axios.get(
        `${requests.BaseUrlEmployee}/employees-in-committees/`,
        { params }
      );
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees in committees:", error);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const employeeTypes = [
    { value: null, label: "All Types" },
    { value: 0, label: "Permanent Teaching" },
    { value: 1, label: "Guest Teaching" },
    { value: 2, label: "Permanent Non-Teaching" },
    { value: 3, label: "Temporary Non-Teaching" },
  ];

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#1f2937",
      color: "#fff",
      border: "1px solid #4b5563",
      padding: "5px",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#fff",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#374151",
      color: "#fff",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#4b5563" : "#374151",
      color: "#fff",
      cursor: "pointer",
    }),
  };

  const handleGenerateExcel = async () => {
    try {
      // console.log("Generating Excel Report with filters:");
      // console.log("Selected Department:", selectedDepartment);
      // console.log("Selected Type:", selectedType);
      // console.log("Sort Order:", selectedOrder);
  
      // Construct query parameters
      const params = {
        type: selectedType.value,
        order: selectedOrder,
      };
  
      if (selectedDepartment.value) {
        params.department = selectedDepartment.value;
      }
  
      // Make the API request to fetch the report
      const response = await axios.get(
        `${requests.BaseUrlEmployee}/generate-employee-report/`, // Update the URL as per your backend
        { params, responseType: 'blob' } // 'blob' to handle binary data (Excel file)
      );
  
      // Create a link to download the Excel file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'employee_report.xlsx'); // File name for download
      document.body.appendChild(link);
      link.click(); // Trigger download
      setIsModalOpen(false); // Close the modal after generating the report
    } catch (error) {
      console.error("Error generating Excel report:", error);
      alert("There was an error generating the report.");
    }
  };

  return (
    <div className="pt-24 flex min-h-screen overflow-hidden bg-gray-900">
      <div className="md:min-w-[18rem]">
        <Sidebar />
      </div>

      <div className="flex-grow p-10 pb-20">
        <h2 className="text-4xl font-extrabold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Committee Members
        </h2>

        <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-3 mb-10 items-end">
          {/* Type Select */}
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2 text-gray-200">Type</label>
            <Select
              options={employeeTypes}
              value={selectedType}
              onChange={setSelectedType}
              placeholder="Select a type"
              styles={customSelectStyles}
              className="text-gray-100"
            />
          </div>

          {/* Department Select */}
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2 text-gray-200">Department</label>
            <Select
              options={departments}
              value={selectedDepartment}
              onChange={setSelectedDepartment}
              placeholder="Select a department"
              styles={customSelectStyles}
              className="text-gray-100"
            />
          </div>

          {/* Generate Excel Report Button */}
          <div className="flex justify-start md:justify-end">
            <button
              onClick={() => setIsModalOpen(true)} // Open modal when button is clicked
              className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:scale-105 hover:shadow-lg transform transition-transform duration-200"
            >
              Generate Excel Report
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2 text-gray-200">Search</label>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by employee name"
            className="w-full bg-gray-800 text-gray-200 p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        {loadingEmployees ? (
          <p className="text-center text-gray-300 mt-8 text-lg font-semibold">Loading...</p>
        ) : (
          <div className="mt-8 space-y-8">
            {employees.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {employees.map((employee) => (
                  <div
                    key={employee.employee_id}
                    className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-200 ease-in-out"
                  >
                    <h3 className="text-xl font-bold text-blue-400 mb-4 text-center">
                      {employee.employee_name}
                    </h3>
                    <div className="space-y-4">
                      {employee.committees.map((committee, index) => (
                        <div
                          key={index}
                          className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors duration-150"
                        >
                          <p className="text-gray-300">
                            <strong>Committee:</strong> {committee.committee_name || "N/A"}
                          </p>
                          <p className="text-gray-300">
                            <strong>Subcommittee:</strong> {committee.subcommittee_name || "N/A"}
                          </p>
                          <p className="text-gray-300">
                            <strong>Role:</strong> {committee.role}
                          </p>
                          <p className="text-gray-300">
                            <strong>Score:</strong> {committee.score}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400 mt-10 text-lg">No employees found.</p>
            )}
          </div>
        )}
      </div>

      {/* Custom Modal for Excel Report Filters */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-bold text-blue-400 mb-4">Filter Options for Report</h3>

            {/* Type Select */}
            <div className="mb-4">
              <label className="block text-lg font-semibold mb-2 text-gray-200">Type</label>
              <Select
                options={employeeTypes}
                value={selectedType}
                onChange={setSelectedType}
                placeholder="Select a type"
                styles={customSelectStyles}
              />
            </div>

            {/* Sorting Order Select */}
            <div className="mb-4">
              <label className="block text-lg font-semibold mb-2 text-gray-200">Sort by Score</label>
              <Select
                options={[
                  { value: "asc", label: "Ascending" },
                  { value: "desc", label: "Descending" },
                ]}
                value={{ value: selectedOrder, label: selectedOrder === "asc" ? "Ascending" : "Descending" }}
                onChange={(e) => setSelectedOrder(e.value)}
                placeholder="Select Order"
                styles={customSelectStyles}
              />
            </div>

            {/* Modal Buttons */}
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateExcel}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Generate Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListEmployee;
