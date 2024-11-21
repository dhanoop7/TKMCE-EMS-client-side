import axios from "axios";
import React, { useEffect, useState } from "react";
import requests from "../config";
import Sidebar from "../components/SideBar";
import Select from "react-select";

const ListEmployee = () => {
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

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

  return (
    <div className="pt-24 flex min-h-screen overflow-hidden bg-gray-900">
      <div className="md:min-w-[18rem]">
        <Sidebar />
      </div>

      <div className="flex-grow p-10 pb-20">
        <h2 className="text-4xl font-extrabold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Committee Members
        </h2>

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
