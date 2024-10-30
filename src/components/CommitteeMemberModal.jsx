import React, { useState } from 'react';

const employeesData = [
  { id: 1, name: "John Doe", department: "Finance", designation: "Manager" },
  { id: 2, name: "Jane Smith", department: "HR", designation: "Executive" },
  { id: 3, name: "Alice Johnson", department: "IT", designation: "Developer" },
  { id: 4, name: "Bob Brown", department: "Finance", designation: "Analyst" },
  // Add more employee objects as needed
];

const CommitteeMemberModal = ({ showModal, closeModal }) => {
  const [memberDetails, setMemberDetails] = useState({
    employee_id: '',
    role: '',
    score: 0,
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDesignation, setSelectedDesignation] = useState('');

  const handleSave = () => {
    // Logic to save member details goes here
    console.log('Member Details:', memberDetails);
    closeModal();
  };

  const filteredEmployees = employeesData.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment ? employee.department === selectedDepartment : true;
    const matchesDesignation = selectedDesignation ? employee.designation === selectedDesignation : true;
    return matchesSearch && matchesDepartment && matchesDesignation;
  });

  const departments = [...new Set(employeesData.map(emp => emp.department))];
  const designations = [...new Set(employeesData.map(emp => emp.designation))];

  return (
    showModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
        <div className="bg-gray-800 rounded-lg shadow-lg w-full max-w-lg p-6 animate-fade-in">
          <h2 className="text-3xl font-bold text-center text-white mb-6">Add Committee Member</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-white">Search Employee</label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-500 transition"
                  placeholder="Search by name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && filteredEmployees.length > 0 && (
                  <ul className="absolute bg-gray-800 border-black rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto z-10 ">
                    {filteredEmployees.map(employee => (
                      <li
                        key={employee.id}
                        className="p-2 hover:bg-blue-600 cursor-pointer"
                        onClick={() => {
                          setSelectedEmployee(employee);
                          setMemberDetails({ ...memberDetails, employee_id: employee.id });
                          setSearchQuery('');
                        }}
                      >
                        {employee.name} - {employee.department} ({employee.designation})
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">Department</label>
                <select
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-500 transition"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  <option value="">All Departments</option>
                  {departments.map((dept, index) => (
                    <option key={index} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-white">Designation</label>
                <select
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-500 transition"
                  value={selectedDesignation}
                  onChange={(e) => setSelectedDesignation(e.target.value)}
                >
                  <option value="">All Designations</option>
                  {designations.map((designation, index) => (
                    <option key={index} value={designation}>{designation}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">Selected Employee</label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-500 transition"
                  value={selectedEmployee ? `${selectedEmployee.name} - ${selectedEmployee.department} (${selectedEmployee.designation})` : ''}
                  readOnly
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-white">Role</label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-500 transition"
                  value={memberDetails.role}
                  onChange={(e) => setMemberDetails({ ...memberDetails, role: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">Score</label>
                <input
                  type="number"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-500 transition"
                  value={memberDetails.score}
                  onChange={(e) => setMemberDetails({ ...memberDetails, score: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="flex justify-end mt-6 space-x-3">
              <button
                type="button"
                className="py-2 px-4 bg-red-600 rounded-md hover:bg-red-500 transition"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="py-2 px-4 bg-blue-600 rounded-md hover:bg-blue-500 transition"
                onClick={handleSave}
              >
                Save Member
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default CommitteeMemberModal;
