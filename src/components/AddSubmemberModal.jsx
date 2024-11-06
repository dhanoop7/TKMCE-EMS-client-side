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
  console.log(committeeId);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [topScoringEmployees, setTopScoringEmployees] = useState([]);
  const [selectedTopScorers, setSelectedTopScorers] = useState([]);

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
      color: "#fff",
      cursor: "pointer",
    }),
  };

  useEffect(() => {
    fetchDepartments();
    fetchTopScoringEmployees();
  }, [selectedEmployees]);

  useEffect(() => {
    fetchEmployees();
  }, [selectedDepartment, selectedType, selectedTopScorers]);

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

      // Exclude employees already selected as top scorers
      const selectedTopScorerIds = selectedTopScorers.map(emp => emp.value);
      const employeeOptions = response.data
        .filter(employee => !selectedTopScorerIds.includes(employee.id))
        .map((employee) => ({
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

  const fetchTopScoringEmployees = async () => {
    try {
      const response = await axios.get(`${requests.BaseUrlEmployee}/employees-by-score/`);
      const selectedEmployeeIds = selectedEmployees.map(emp => emp.value);
      const sortedEmployeeOptions = response.data
        .filter(employee => !selectedEmployeeIds.includes(employee.employee_id))
        .map((employee) => ({
          value: employee.employee_id,
          label: `${employee.employee_name} (${employee.department_name}) - Score: ${employee.total_score}`,
          score: employee.total_score, // Adding score for sorting
        }))
        .sort((a, b) => b.score - a.score); // Sort by score in descending order

      setTopScoringEmployees(sortedEmployeeOptions);
    } catch (error) {
      console.error("Error fetching top scoring employees:", error);
    }
  };

  const handleEmployeeSelect = (selectedOptions) => {
    setSelectedEmployees(selectedOptions || []);
  };

  const handleTopScorerSelect = (selectedOptions) => {
    setSelectedTopScorers(selectedOptions || []);
  };

  const handleRoleChange = (index, role, isTopScorer) => {
    if (isTopScorer) {
      setSelectedTopScorers((prevTopScorers) => {
        const updatedTopScorers = [...prevTopScorers];
        updatedTopScorers[index] = {
          ...updatedTopScorers[index],
          role: role,
        };
        return updatedTopScorers;
      });
    } else {
      setSelectedEmployees((prevEmployees) => {
        const updatedEmployees = [...prevEmployees];
        updatedEmployees[index] = {
          ...updatedEmployees[index],
          role: role,
        };
        return updatedEmployees;
      });
    }
  };

  const handleScoreChange = (index, score, isTopScorer) => {
    if (isTopScorer) {
      setSelectedTopScorers((prevTopScorers) => {
        const updatedTopScorers = [...prevTopScorers];
        updatedTopScorers[index] = {
          ...updatedTopScorers[index],
          score: score,
        };
        return updatedTopScorers;
      });
    } else {
      setSelectedEmployees((prevEmployees) => {
        const updatedEmployees = [...prevEmployees];
        updatedEmployees[index] = {
          ...updatedEmployees[index],
          score: score,
        };
        return updatedEmployees;
      });
    }
  };

  const resetFields = () => {
    setSelectedDepartment(null);
    setSelectedType(null);
    setSelectedEmployees([]);
    setSelectedTopScorers([]);
  };

  const handleSave = async () => {
    try {
      // Combine selected employees and top scorers
      const membersData = [
        ...selectedEmployees,
        ...selectedTopScorers,
      ].map((employee) => ({
        committee_id: committeeId,
        employee_id: employee.value,
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
      // Optionally, add user feedback here (e.g., toast notifications)
    }
  };

  return (
    showModal && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg w-3/4 lg:w-2/3 xl:w-1/2 overflow-y-auto max-h-screen">
          <h3 className="text-lg font-semibold mb-4 text-blue-400">
            Add Members to Subcommittee - {subCommitteeName}
          </h3>

          {/* Department Selection */}
          <Select
            options={departments}
            styles={customSelectStyles}
            placeholder="Select Department"
            onChange={setSelectedDepartment}
            isClearable
            className="mb-4"
          />

          {/* Employee Type Selection */}
          <Select
            options={employeeTypes}
            styles={customSelectStyles}
            placeholder="Select Employee Type"
            onChange={setSelectedType}
            isClearable
            className="mb-4"
          />

          {/* Select Employees by Department/Type */}
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

          {/* Select Top-Scoring Employees */}
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2 text-gray-300">
              Select Top-Scoring Employees
            </label>
            <Select
              options={topScoringEmployees}
              value={selectedTopScorers}
              onChange={handleTopScorerSelect}
              placeholder="Select top-scoring employees"
              className="text-gray-100 mb-4"
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

          {/* Selected Employees */}
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
                        handleRoleChange(index, e.target.value, false)
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
                      value=""
                      onChange={(e) =>
                        handleScoreChange(index, e.target.value, false)
                      }
                      placeholder="Enter score"
                      className="w-full p-2 mt-2 bg-gray-900 border border-gray-600 rounded-md text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}

            {selectedTopScorers.map((employee, index) => (
              <div
                key={`top-scorer-${employee.value}-${index}`}
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
                        handleRoleChange(index, e.target.value, true)
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
                      value={employee.score || ""}
                      onChange={(e) =>
                        handleScoreChange(index, e.target.value, true)
                      }
                      placeholder="Enter score"
                      className="w-full p-2 mt-2 bg-gray-900 border border-gray-600 rounded-md text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
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