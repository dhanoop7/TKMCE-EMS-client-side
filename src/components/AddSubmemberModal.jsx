import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import requests from "../config";

const AddSubmemberModal = ({
  committeeId,
  subCommitteeId,
  subCommitteeName,
  showModal,
  closeModal,
}) => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

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
    }),
    singleValue: (provided) => ({ ...provided, color: "#fff" }),
    menu: (provided) => ({ ...provided, backgroundColor: "#374151" }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#4b5563" : "#374151",
      color: "#fff",
      cursor: "pointer",
    }),
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [selectedDepartment, selectedType]);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${requests.BaseUrlEmployee}/departments/`);
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
      
      const response = await axios.get(`${requests.BaseUrlEmployee}/filter-employee/`, { params });
      
      // Sort employees by score in descending order (highest score first)
      const employeeOptions = response.data
        .sort((a, b) => b.total_score - a.total_score)  // Sort by score
        .map((employee) => ({
          value: employee.employee_id,
          label: `${employee.employee_name} - ${employee.designation_name} (${employee.department_name} - Score-${employee.total_score})`,
          role: "",
          score: "",
        }));
        
      setEmployees(employeeOptions);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };
  
  

  const handleEmployeeSelect = (selectedOptions) => {
    setSelectedEmployees(selectedOptions || []);
  };

  const handleRoleChange = (index, role) => {
    setSelectedEmployees((prevEmployees) => {
      const updatedEmployees = [...prevEmployees];
      updatedEmployees[index] = {
        ...updatedEmployees[index],
        role: role,
      };
      return updatedEmployees;
    });
  };

  const handleScoreChange = (index, score) => {
    setSelectedEmployees((prevEmployees) => {
      const updatedEmployees = [...prevEmployees];
      updatedEmployees[index] = {
        ...updatedEmployees[index],
        score: score,
      };
      return updatedEmployees;
    });
  };

  const resetFields = () => {
    setSelectedDepartment(null);
    setSelectedType(null);
    setSelectedEmployees([]);
  };

  const handleSave = async () => {
    try {
      const membersData = selectedEmployees.map((employee) => ({
        committee_id: committeeId,
        employee_id: employee.value,  // Ensure we're using employee_id here
        role: employee.role,
        score: employee.score,
      }));
  
      console.log("DATA:", membersData);
  
      const response = await axios.post(
        `${requests.BaseUrlCommittee}/subcommittee/${subCommitteeId}/add-members/`,
        { members: membersData }
      );
  
      if (response.status === 201) {
        console.log("Members added successfully:", response.data);
        resetFields();
        closeModal();
      }
    } catch (error) {
      console.error("Error saving members:", error);
    }
  };

  return (
    showModal && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg w-3/4 lg:w-2/3 xl:w-1/2 overflow-y-auto h-[500px]">
          <h3 className="text-lg font-semibold mb-4 text-blue-400">
            Add Members to Subcommittee - {subCommitteeName}
          </h3>

          <Select
            options={departments}
            styles={customSelectStyles}
            placeholder="Select Department"
            onChange={setSelectedDepartment}
            isClearable
            className="mb-4"
          />

          <Select
            options={employeeTypes}
            styles={customSelectStyles}
            placeholder="Select Employee Type"
            onChange={setSelectedType}
            isClearable
            className="mb-4"
          />

          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2 text-gray-300">
              Select Employees
            </label>
            <Select
              options={employees}
              value={selectedEmployees}
              onChange={handleEmployeeSelect}
              placeholder="Select employees"
              className="text-gray-100 mb-4"
              isMulti
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: "#1F2937",
                  color: "white",
                  minHeight: "50px",
                  width: "80%",
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: "#1F2937",
                  color: "white",
                  width:"600px",
                }),
                option: (base, { isFocused }) => ({
                  ...base,
                  backgroundColor: isFocused ? "#3B82F6" : "#1F2937",
                  color: "#fff",
                }),
                multiValue: (base) => ({
                  ...base,
                  backgroundColor: "#3B82F6",
                  maxWidth: "150px",
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

          <div className="space-y-6">
            {selectedEmployees.map((employee, index) => (
              <div
                key={`selected-${employee.value}-${index}`}
                className="bg-gray-800 p-4 rounded-md shadow-lg border border-gray-700"
              >
                <p className="text-lg font-semibold text-gray-100 mb-4">
                  {employee.label}
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block font-medium text-gray-300">
                      Role
                    </label>
                    <input
                      type="text"
                      value={employee.role || ""}
                      onChange={(e) =>
                        handleRoleChange(index, e.target.value)
                      }
                      placeholder="Enter role"
                      className="w-full p-2 mt-2 bg-gray-900 border border-gray-600 rounded-md text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-300">
                      Score
                    </label>
                    <input
                      type="number"
                      min="0"
                      onWheel={(e) => e.target.blur()}
                      value={employee.score || ""}
                      onChange={(e) =>
                        handleScoreChange(index, e.target.value)
                      }
                      placeholder="Enter score"
                      className="w-full p-2 mt-2 bg-gray-900 border border-gray-600 rounded-md text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <button
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={handleSave}
            >
              Save Members
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default AddSubmemberModal;
