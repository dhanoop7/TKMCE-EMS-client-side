import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/SideBar";
import Select from "react-select";
import axios from "axios";
import requests from "../config";

const CommitteeMembersAdd = () => {
  const navigate = useNavigate()
  const { committe_id } = useParams();
  console.log("Committee ID:", committe_id);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const employeeTypes = [
    { value: null, label: "All Types" },
    { value: 0, label: "Permanent Teaching" },
    { value: 1, label: "Guest Teaching" },
    { value: 2, label: "Non-Teaching" },
  ];

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [selectedDepartment, selectedType]);

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

  const fetchEmployees = async () => {
    try {
      const params = {};
      if (selectedDepartment && selectedDepartment.value !== null) {
        params.department = selectedDepartment.value;
      }
      if (selectedType && selectedType.value !== null) {
        params.type = selectedType.value;
      }

      const response = await axios.get(
        `${requests.BaseUrlEmployee}/filter-employee/`,
        { params }
      );

      const employeeOptions = response.data.map((employee) => ({
        value: employee.id,
        label: `${employee.name} - ${employee.designation_name} (${employee.department_name})`,
      }));
      setEmployees(employeeOptions);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleEmployeeSelect = (selectedOptions) => {
    const updatedEmployees = selectedOptions.map((option) => {
      const existingEmployee = selectedEmployees.find(
        (emp) => emp.value === option.value
      );
      return {
        ...option,
        role: existingEmployee ? existingEmployee.role : "",
        score: existingEmployee ? existingEmployee.score : "",
      };
    });
    setSelectedEmployees(updatedEmployees);
  };

  const handleRoleChange = (index, value) => {
    const updatedEmployees = [...selectedEmployees];
    updatedEmployees[index].role = value;
    setSelectedEmployees(updatedEmployees);
  };

  const handleScoreChange = (index, value) => {
    const updatedEmployees = [...selectedEmployees];
    updatedEmployees[index].score = value;
    setSelectedEmployees(updatedEmployees);
  };

  const handleAddEmployee = async () => {
    const committeeId = committe_id;
    const members = selectedEmployees.map((employee) => ({
      employee_id: employee.value,
      role: employee.role,
      score: employee.score,
    }));

    try {
      const response = await axios.post(
        `${requests.BaseUrlCommittee}/add-main-committee-members/`,
        {
          committee_id: committeeId,
          members: members,
        }
      );
      console.log("Response:", response.data);
      alert("Main committee members added successfully!");

      // Reset all states after successful submission
      setSelectedEmployees([]);
      setSelectedDepartment(null);
      setSelectedType(null);
      setEmployees([]);
      navigate(`/committee-detail/${committe_id}`)
      
    } catch (error) {
      console.error("Error adding employees to committee:", error);
      if (error.response) {
        alert("Failed to add some members. Please check the details.");
      }
    }
  };

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

  // const handleAddSubCommittee = () => {
  //   navigate(`/add-subcommittee/${committe_id}`); // Navigate to the subcommittee page
  // };

  return (
    <div className="pt-24 flex min-h-screen bg-gray-900 text-white">
      <div className="md:w-[18rem]">
        <Sidebar />
      </div>

      <div className="flex-grow p-10 pb-20">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-400">
          Add Committee Members
        </h2>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Department Selection */}
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2 text-gray-300">
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

          {/* Type Selection */}
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2 text-gray-300">
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

          {/* Employee Multi-Selection */}
          <div className="mb-6 md:col-span-2">
            <label className="block text-lg font-semibold mb-2 text-gray-300">
              Employee
            </label>
            <Select
              options={employees}
              value={selectedEmployees}
              onChange={handleEmployeeSelect}
              placeholder="Select employees"
              className="text-gray-100"
              isMulti
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: "#1F2937",
                  color: "white",
                  minHeight: "50px",
                  width: "100%",
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: "#1F2937",
                  color: "white",
                }),
                option: (base, { isFocused }) => ({
                  ...base,
                  backgroundColor: isFocused ? "#3B82F6" : "#1F2937",
                }),
                multiValue: (base) => ({
                  ...base,
                  backgroundColor: "#3B82F6",
                  maxWidth: "100px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }),
                multiValueLabel: (base) => ({
                  ...base,
                  color: "white",
                }),
                multiValueRemove: (base) => ({
                  ...base,
                  color: "white",
                  ":hover": {
                    backgroundColor: "#3B82F6",
                    color: "white",
                  },
                }),
              }}
            />
          </div>

          {/* Roles and Scores for Selected Employees */}
          <div className="md:col-span-2 space-y-6">
            {selectedEmployees.map((employee, index) => (
              <div
                key={employee.value}
                className="bg-gray-800 p-4 rounded-md shadow-lg border border-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-lg font-semibold text-gray-100">
                    {employee.label}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Role Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Role
                    </label>
                    <input
                      type="text"
                      placeholder="Enter role"
                      value={employee.role}
                      onChange={(e) => handleRoleChange(index, e.target.value)}
                      className="w-full bg-gray-700 p-2 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Score Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Score
                    </label>
                    <input
                      type="number"
                      placeholder="Enter score"
                      value={employee.score}
                      onChange={(e) =>
                        handleScoreChange(index, e.target.value)
                      }
                      className="w-full bg-gray-700 p-2 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-between mt-8">
          <button
            onClick={handleAddEmployee}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded"
          >
            Finish
          </button>
          {/* <button
            onClick={handleAddSubCommittee} // Button to navigate to Add Subcommittee page
            className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded"
          >
            Add Subcommittee
          </button> */}
        </div>
        </div>
      </div>
    </div>
  );
};

export default CommitteeMembersAdd;
