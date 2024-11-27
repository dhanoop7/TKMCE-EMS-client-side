import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/SideBar";
import Select from "react-select";
import axios from "axios";
import requests from "../config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const CommitteeMembersAdd = () => {
  const navigate = useNavigate();
  const { committe_id } = useParams();

  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  const employeeTypes = [
    { value: null, label: "All Types" },
    { value: 0, label: "Permanent Teaching" },
    { value: 1, label: "Guest Teaching" },
    { value: 2, label: "Permanent Non-Teaching" },
    { value: 3, label: "Temporary Non-Teaching" },
  ];

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [selectedDepartment, selectedType]);

  const fetchDepartments = async () => {
    setLoadingEmployees(true);
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
    } finally {
      setLoadingEmployees(false); // Stop loading
    }
  };

  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const params = {};
      // Only add department and type to params if they are not null
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

      // Sort employees by score in descending order (highest score first)
      const employeeOptions = response.data
        .sort((a, b) => b.total_score - a.total_score) // Sort by score
        .map((employee) => ({
          value: employee.employee_id,
          label: `${employee.employee_name} - ${employee.designation_name} (${employee.department_name} - Score-${employee.total_score})`,
        }));

      setEmployees(employeeOptions);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoadingEmployees(false); // Stop loading
    }
  };

  const handleEmployeeSelect = (selectedOptions) => {
    setSelectedEmployees(selectedOptions);
  
    const selectedIds = selectedOptions.map((option) => option.value);
  
    // Initialize details for newly selected employees and keep existing ones
    const initialDetails = {};
    selectedOptions.forEach((option) => {
      initialDetails[option.value] = employeeDetails[option.value] || {
        role: "",
        score: "",
      };
    });
  
    // Retain details only for currently selected employees
    setEmployeeDetails((prevDetails) =>
      Object.keys(prevDetails).reduce((newDetails, key) => {
        if (selectedIds.includes(key)) {
          newDetails[key] = prevDetails[key];
        }
        return newDetails;
      }, initialDetails)
    );
  };
  

  const handleRoleChange = (employeeId, role) => {
    setEmployeeDetails((prevDetails) => ({
      ...prevDetails,
      [employeeId]: { ...prevDetails[employeeId], role },
    }));
  };

  const handleScoreChange = (employeeId, score) => {
    setEmployeeDetails((prevDetails) => ({
      ...prevDetails,
      [employeeId]: { ...prevDetails[employeeId], score },
    }));
  };

  const handleAddEmployee = async () => {
    const committeeId = committe_id;
    const members = selectedEmployees.map((employee) => ({
      employee_id: employee.value,
      role: employeeDetails[employee.value]?.role,
      score: employeeDetails[employee.value]?.score,
    }));

    try {
      const response = await axios.post(
        `${requests.BaseUrlCommittee}/add-main-committee-members/`,
        { committee_id: committeeId, members: members }
      );
      console.log("Response:", response.data);
      toast.success("Committee Members Added successfully!");

      setSelectedEmployees([]);
      setSelectedDepartment(null);
      setSelectedType(null);
      setEmployees([]);
      setEmployeeDetails({});
      navigate(`/committee-detail/${committe_id}`);
    } catch (error) {
      console.error("Error adding employees to committee:", error);
      if (error.response) {
        alert("Failed to add some members. Please check the details.");
      }
    }
  };

  const handleSkip = () => {
    navigate(`/committee-detail/${committe_id}`);
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
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "white",
    }),
    input: (base) => ({
      ...base,
      color: "#fff", 
    }),
  };

  return (
    <div className="pt-24 flex min-h-screen bg-gray-900 text-white">
      {/* <div className="md:w-[18rem] ">
        <Sidebar defaultClosed={true}/>
      </div> */}
      <div className="flex-grow p-10 pb-20">
      <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <h2 className="text-3xl font-thin text-center mb-8 text-blue-400">
          Add Committee Members
        </h2>

        <div className="grid gap-8 md:grid-cols-2 ">
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
        </div>

        <div className="mb-6 md:col-span-2 ">
          <label className="block text-lg font-semibold mb-2 text-gray-300">
            Select Employees by Department/Type
          </label>
          <Select
            options={employees}
            value={selectedEmployees}
            onChange={handleEmployeeSelect}
            placeholder="Select employees"
            className="text-gray-100"
            isMulti
            isLoading={loadingEmployees}
            styles={customSelectStyles}
          />
        </div>

        <div className="md:col-span-2 space-y-6">
          {selectedEmployees.map((employee) => (
            <div
              key={`selected-${employee.value}`}
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
                    value={employeeDetails[employee.value]?.role || ""}
                    onChange={(e) =>
                      handleRoleChange(employee.value, e.target.value)
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
                    value={employeeDetails[employee.value]?.score || ""}
                    onChange={(e) =>
                      handleScoreChange(employee.value, e.target.value)
                    }
                    placeholder="Enter score"
                    className="w-full p-2 mt-2 bg-gray-900 border border-gray-600 rounded-md text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="md:col-span-2 flex gap-6">
          <button
            onClick={handleSkip}
            className="w-full p-4 text-lg font-semibold bg-gray-600 hover:bg-gray-500 rounded-md shadow-md"
          >
            Skip
          </button>
          <button
            onClick={handleAddEmployee}
            className="w-full p-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 transition-transform duration-200 transform hover:scale-105 hover:shadow-2xl rounded-md shadow-md flex flex-col justify-between items-center text-center cursor-pointer"
          >
            Add Committee Members
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommitteeMembersAdd;
