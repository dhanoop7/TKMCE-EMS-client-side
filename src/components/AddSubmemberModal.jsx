import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import requests from '../config';

const AddSubmemberModal = ({ committeeId,subCommitteeId,subCommitteeName, showModal, closeModal }) => {
  console.log(committeeId);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const employeeTypes = [
    { value: null, label: "All Types" },
    { value: 0, label: "Permanent Teaching" },
    { value: 1, label: "Guest Teaching" },
    { value: 2, label: "Non-Teaching" },
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
    }),
  };

  useEffect(() => {
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

    fetchDepartments();
  }, [requests.BaseUrlEmployee]);

  useEffect(() => {
    fetchEmployees();
  }, [selectedDepartment, selectedType]);

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
  
      const employeeOptions = response.data.map((employee) => ({
        value: employee.id,
        label: `${employee.name} - ${employee.designation_name} (${employee.department_name})`,
        role: "",
        score: "",
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

  const handleRoleChange = (index, role) => {
    const updatedEmployees = [...selectedEmployees];
    updatedEmployees[index].role = role;
    setSelectedEmployees(updatedEmployees);
  };

  const handleScoreChange = (index, score) => {
    const updatedEmployees = [...selectedEmployees];
    updatedEmployees[index].score = score;
    setSelectedEmployees(updatedEmployees);
  };

  const handleSave = async () => {
    try {
        const membersData = selectedEmployees.map((employee) => ({
            committee_id:committeeId,
            employee_id: employee.value,
            role: employee.role,
            score: employee.score,
        }));
        console.log("DATA:",membersData);

        const response = await axios.post(
            `${requests.BaseUrlCommittee}/subcommittee/${subCommitteeId}/add-members/`,
            { members: membersData } // Assuming your serializer expects a 'members' key
        );

        if (response.status === 201) {
            // Optionally show a success message or perform further actions
            console.log("Members added successfully:", response.data);
            closeModal(); // Close modal after saving
        }
    } catch (error) {
        console.error("Error saving members:", error);
        // Optionally show an error message
    }
};


  return (
    showModal && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg w-1/2 md:w-3/4 lg:w-1/3">
          <h3 className="text-lg font-semibold mb-4 text-blue-400">Add Members to Subcommittee - {subCommitteeName}</h3>

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

          <label className="block text-lg font-semibold mb-2 text-gray-300">Employee</label>
          <Select
            options={employees}
            value={selectedEmployees}
            onChange={handleEmployeeSelect}
            placeholder="Select employees"
            className="text-gray-100 mb-4"
            isMulti
            styles={customSelectStyles}
          />

          {selectedEmployees.length > 0 && (
            <div className="space-y-4">
              {selectedEmployees.map((employee, index) => (
                <div key={employee.value} className="flex items-center justify-between mb-2">
                  <span className="text-gray-200">{employee.label}</span>
                  <input
                    type="text"
                    placeholder="Role"
                    value={employee.role}
                    onChange={(e) => handleRoleChange(index, e.target.value)}
                    className="bg-gray-700 text-white rounded-md p-1 w-32 mx-2"
                  />
                  <input
                    type="number"
                    placeholder="Score"
                    value={employee.score}
                    onChange={(e) => handleScoreChange(index, e.target.value)}
                    className="bg-gray-700 text-white rounded-md p-1 w-32"
                  />
                </div>
              ))}
            </div>
          )}

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
              Submit Members
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default AddSubmemberModal;
