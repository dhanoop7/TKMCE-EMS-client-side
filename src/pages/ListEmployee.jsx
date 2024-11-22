import axios from "axios";
import React, { useEffect, useState } from "react";
import requests from "../config";
import Sidebar from "../components/SideBar";
import Select from "react-select";
import * as XLSX from "xlsx";

const ListEmployee = () => {
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);


  const handleDownloadReport = async () => {
    try {
      // Make a GET request to the backend endpoint
      const response = await axios.get("/generate-employee-report/", {
        responseType: "blob", // Important: Specifies the response should be a Blob (binary data)
      });

      // Create a blob from the response data
      const blob = new Blob([response.data], { type: response.headers["content-type"] });

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Employee_Report.xlsx"); // File name for the downloaded file
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading the report:", error);
      alert("Failed to download the report. Please try again.");
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(
        `${requests.BaseUrlEmployee}/departments/`
      );
      const departmentOptions = response.data.map((department) => ({
        value: department.id,
        label: department.department_name,
      }));
      departmentOptions.unshift({ value: null, label: "All Departments" });
      setDepartments(departmentOptions);
    } catch (error) {
      console.error("Error fetching departments:", error);
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

  const fetchEmployeesInCommittees = async () => {
    setLoadingEmployees(true);
    try {
      const params = {};
      if (selectedDepartment?.value)
        params.department = selectedDepartment.value;
      if (selectedType?.value) params.type = selectedType.value;

      const response = await axios.get(
        `${requests.BaseUrlEmployee}/employees-in-committees/`,
        { params }
      );
      // console.log(response.data);

      // Introduce a delay of 1.5 seconds before showing employees
      setTimeout(() => {
        setEmployees(response.data);
        setLoadingEmployees(false);
      }, 1500);
    } catch (error) {
      console.error("Error fetching employees in committees:", error);
      setLoadingEmployees(false);
    }
  };


  const generateExcelReport = async () => {
    try {
      // Fetch data from the backend
      const response = await axios.get(`${requests.BaseUrlEmployee}/generate-employee-report/`, {
        responseType: "json",
      });
  
      const employeeData = response.data; // Assuming backend returns JSON
  
      // Create a new workbook
      const workbook = XLSX.utils.book_new();
  
      // Prepare the data for the sheet
      const sheetData = [["Employee Name", "Total Score"]]; // Headers
      employeeData.forEach((employee) => {
        sheetData.push([employee.employee_name, employee.total_score]); // Populate rows
      });
  
      // Create a worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  
      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Report");
  
      // Generate and trigger the download
      XLSX.writeFile(workbook, "Employee_Report.xlsx");
    } catch (error) {
      console.error("Error generating Excel report:", error);
      alert("Failed to generate the report.");
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

        <button
          className="bg-green-500 text-white font-semibold py-2 px-4 rounded"
          onClick={generateExcelReport}
        >
          Download Employee Report
        </button>

        <div className="grid gap-8 md:grid-cols-2 mb-10">
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2 text-gray-200">
              Type
            </label>
            <Select
              options={employeeTypes}
              value={selectedType}
              onChange={setSelectedType}
              placeholder="Select a type"
              styles={customSelectStyles}
              className="text-gray-100"
            />
          </div>

          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2 text-gray-200">
              Department
            </label>
            <Select
              options={departments}
              value={selectedDepartment}
              onChange={setSelectedDepartment}
              placeholder="Select a department"
              styles={customSelectStyles}
              className="text-gray-100"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={fetchEmployeesInCommittees}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition duration-200 ease-in-out focus:outline-none focus:ring focus:ring-blue-300"
          >
            Fetch Employees
          </button>
        </div>

        {loadingEmployees ? (
          <p className="text-center text-gray-300 mt-8 text-lg font-semibold">
            Loading...
          </p>
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
                            <strong>Committee:</strong>{" "}
                            {committee.committee_name || "N/A"}
                          </p>
                          <p className="text-gray-300">
                            <strong>Subcommittee:</strong>{" "}
                            {committee.subcommittee_name || "N/A"}
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
              <p className="text-center text-gray-400 mt-10 text-lg">
                No employees found.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListEmployee;
