import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CommitteeMemberModal = ({ showModal, closeModal, committeeId }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [department, setDepartment] = useState('');
  const [departments, setDepartments] = useState([]);
  const [role, setRole] = useState('');
  const [score, setScore] = useState('');
  const [subcommittees, setSubcommittees] = useState([]);
  const [selectedSubcommittee, setSelectedSubcommittee] = useState('');

  useEffect(() => {
    if (showModal) {
      fetchEmployees();
      fetchDepartments();
      fetchSubcommittees();
    }
  }, [showModal]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/employee/filter-employee/', {
        params: { department },
      });
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/employee/departments/');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchSubcommittees = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/employee/subcommittees/');
      setSubcommittees(response.data);
    } catch (error) {
      console.error('Error fetching subcommittees:', error);
    }
  };

  const handleMemberSelection = (member) => {
    setSelectedMembers((prev) => [...prev, member]);
  };

  const handleSubmitMembers = async () => {
    const payload = {
      committee_id: committeeId,
      members: selectedMembers.map(member => ({
        id: member.id,
        role,
        score
      })),
    };

    try {
      await axios.post('http://127.0.0.1:8000/employee/add-members/', payload);
      alert('Members added successfully!');
      closeModal();
    } catch (error) {
      console.error('Error adding members:', error);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white text-black rounded-lg p-8">
        <h2 className="text-xl mb-4">Add Members to Committee</h2>
        <label className="block mb-2">Search Employees:</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded p-2 mb-4 w-full"
        />
        <div className="mb-4">
          <label className="block mb-2">Department:</label>
          <select
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              fetchEmployees();
            }}
            className="border rounded p-2 mb-4 w-full"
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.name}>{dept.name}</option>
            ))}
          </select>
        </div>
        <div>
          <h3 className="text-lg mb-2">Employees:</h3>
          <ul>
            {employees.filter(emp => emp.name.toLowerCase().includes(searchTerm.toLowerCase())).map(emp => (
              <li key={emp.id} className="flex justify-between items-center border-b py-2">
                <span>{emp.name}</span>
                <button onClick={() => handleMemberSelection(emp)} className="bg-blue-500 text-white rounded px-2">Add</button>
              </li>
            ))}
          </ul>
        </div>
        <h3 className="text-lg mt-4 mb-2">Selected Members:</h3>
        <ul>
          {selectedMembers.map(member => (
            <li key={member.id} className="flex justify-between items-center border-b py-2">
              <span>{member.name}</span>
              <button onClick={() => setSelectedMembers(selectedMembers.filter(m => m.id !== member.id))} className="bg-red-500 text-white rounded px-2">Remove</button>
            </li>
          ))}
        </ul>
        <label className="block mt-4 mb-2">Role:</label>
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border rounded p-2 mb-4 w-full"
        />
        <label className="block mb-2">Score:</label>
        <input
          type="number"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          className="border rounded p-2 mb-4 w-full"
        />
        <button onClick={handleSubmitMembers} className="bg-green-500 text-white rounded px-4 py-2">Submit</button>
        <button onClick={closeModal} className="bg-gray-500 text-white rounded px-4 py-2 ml-2">Close</button>
      </div>
    </div>
  );
};

export default CommitteeMemberModal;
