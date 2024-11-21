import axios from 'axios';
import React, { useEffect, useState } from 'react';
import requests from '../config';
import Sidebar from '../components/SideBar';
import Select from 'react-select';

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
      const response = await axios.get(`${requests.BaseUrlEmployee}/departments/`);
      const departmentOptions = response.data.map((department) => ({
        value: department.id,
        label: department.department_name,
      }));
      departmentOptions.unshift({ value: null, label: 'All Departments' });
      setDepartments(departmentOptions);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const employeeTypes = [
    { value: null, label: 'All Types' },
    { value: 0, label: 'Permanent Teaching' },
    { value: 1, label: 'Guest Teaching' },
    { value: 2, label: 'Permanent Non-Teaching' },
    { value: 3, label: 'Temporary Non-Teaching' },
  ];

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#1f2937',
      color: '#fff',
      border: '1px solid #4b5563',
      padding: '5px',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#fff',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#374151',
      color: '#fff',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#4b5563' : '#374151',
      color: '#fff',
      cursor: 'pointer',
    }),
  };

  const fetchEmployeesInCommittees = async () => {
    setLoadingEmployees(true);
    try {
      const params = {};
      if (selectedDepartment?.value) params.department = selectedDepartment.value;
      if (selectedType?.value) params.type = selectedType.value;

      const response = await axios.get(
        `${requests.BaseUrlEmployee}/employees-in-committees/`,
        { params }
      );

      // Introduce a delay of 1.5 seconds before showing employees
      setTimeout(() => {
        setEmployees(response.data);
        setLoadingEmployees(false);
      }, 1500);
    } catch (error) {
      console.error('Error fetching employees in committees:', error);
      setLoadingEmployees(false);
    }
  };

  return (
    <div className="pt-24 flex min-h-screen overflow-hidden bg-gray-900">
      <div className="md:min-w-[18rem]">
        <Sidebar />
      </div>

      <div className="flex-grow p-10 pb-20">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-400">
          Committee Members
        </h2>

        <div className="grid gap-8 md:grid-cols-2">
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

        <button
          onClick={fetchEmployeesInCommittees}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition duration-150 ease-in-out focus:outline-none focus:ring focus:ring-blue-300"
        >
          Fetch Employees
        </button>

        {loadingEmployees ? (
          <p className="text-center text-gray-300 mt-6">Loading...</p>
        ) : (
          <div className="mt-6 space-y-4">
            {employees.length > 0 ? (
              employees.map((employee) => (
                <div key={employee.employee_id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                  <h3 className="text-lg font-semibold text-blue-400">
                    {employee.employee_name}
                  </h3>
                  <p className="text-gray-300">Committee: {employee.committee_name || 'N/A'}</p>
                  <p className="text-gray-300">Subcommittee: {employee.subcommittee_name || 'N/A'}</p>
                  <p className="text-gray-300">Role: {employee.role}</p>
                  <p className="text-gray-300">Score: {employee.score}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 mt-10">No employees found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListEmployee;
