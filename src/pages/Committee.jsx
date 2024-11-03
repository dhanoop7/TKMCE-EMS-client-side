import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import axios from "axios";
import requests from "../config";
import Select from "react-select";

const Committee = () => {
  const [committeeData, setCommitteeData] = useState({
    orderNumber: "",
    committeeName: "",
    orderDate: "",
    expiry: "",
    orderText: "",
    description: "",
  });
  const [existingCommittees, setExistingCommittees] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [mainCommitteeMembers, setMainCommitteeMembers] = useState([]);
  const [subcommittees, setSubcommittees] = useState([]);
  const [department, setDepartment] = useState("");
  const [empType, setEmpType] = useState("");
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [department, empType]);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(
        `${requests.BaseUrlEmployee}/departments/`
      );
      setDepartments(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching departments:", error);
      setDepartments([]);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `${requests.BaseUrlEmployee}/filter-employee/`,
        {
          params: { department, type: empType },
        }
      );
      setEmployees(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setEmployees([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCommitteeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMainCommitteeSelection = (selectedOptions) => {
    const selectedMembersWithDetails = selectedOptions.map((option) => ({
      id: option.id,
      name: option.label,
      role: "",
      score: "",
    }));
    setMainCommitteeMembers(selectedMembersWithDetails);
  };

  const handleSubcommitteeSelection = (selectedOptions, index) => {
    const selectedMembersWithDetails = selectedOptions.map((option) => ({
      id: option.id,
      name: option.label,
      role: "",
      score: "",
    }));
    const updatedSubcommittees = [...subcommittees];
    updatedSubcommittees[index].members = selectedMembersWithDetails;
    setSubcommittees(updatedSubcommittees);
  };

  const handleRoleScoreChange = (index, field, value) => {
    setMainCommitteeMembers((prev) => {
      const updatedMembers = [...prev];
      updatedMembers[index][field] = value;
      return updatedMembers;
    });
  };

  const removeSubcommittee = (index) => {
    const updatedSubcommittees = [...subcommittees];
    updatedSubcommittees.splice(index, 1);
    setSubcommittees(updatedSubcommittees);
  };

  const handleSubcommitteeRoleScoreChange = (
    subIndex,
    memberIndex,
    field,
    value
  ) => {
    setSubcommittees((prev) =>
      prev.map((subcommittee, sIndex) =>
        sIndex === subIndex
          ? {
              ...subcommittee,
              members: subcommittee.members.map((member, mIndex) =>
                mIndex === memberIndex ? { ...member, [field]: value } : member
              ),
            }
          : subcommittee
      )
    );
  };

  const handleSubcommitteeChange = (index, field, value) => {
    const updatedSubcommittees = [...subcommittees];
    updatedSubcommittees[index][field] = value;
    setSubcommittees(updatedSubcommittees);
  };

  const addSubcommittee = () => {
    setSubcommittees((prev) => [
      ...prev,
      { sub_committee_name: "", sub_committee_Text: "", members: [] },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate main committee members' role and score
    const invalidMembers = mainCommitteeMembers.some(
      (member) => !member.role || member.score === ""
    );

    if (invalidMembers) {
      alert("Please ensure all main committee members have a role and score.");
      return;
    }

    const payload = {
      committee: {
        order_number: committeeData.orderNumber,
        committe_Name: committeeData.committeeName,
        order_date: committeeData.orderDate,
        order_Text: committeeData.orderText,
        order_Description: committeeData.description,
        committe_Expiry: committeeData.expiry,
        is_active: true,
      },
      members: mainCommitteeMembers.map((member) => ({
        employee_id: member.id,
        role: member.role,
        score: member.score,
      })),
      subcommittees: subcommittees.map((subcommittee) => ({
        sub_committee_name: subcommittee.sub_committee_name,
        sub_committee_Text: subcommittee.sub_committee_Text,
        members: subcommittee.members.map((submember) => ({
          employee_id: submember.id,
          role: submember.role,
          score: submember.score,
        })),
      })),
    };

    try {
      const response = await axios.post(
        `${requests.BaseUrlCommittee}/create-committee/`,
        payload
      );
      alert("Committee and members saved successfully!");
      // Reset form states
      setCommitteeData({
        orderNumber: "",
        committeeName: "",
        orderDate: "",
        expiry: "",
        orderText: "",
        description: "",
      });
      setMainCommitteeMembers([]);
      setSubcommittees([]);
    } catch (error) {
      console.error("Error saving committee:", error);
      alert("An error occurred while saving the committee. Please try again.");
    }
  };

  const employeeOptions = employees.map((emp) => ({
    value: emp.id,
    label: `${emp.name} - ${emp.designation_name} - ${emp.department_name}`,
    id: emp.id,
  }));

  const handleRemoveMember = (index) => {
    const updatedMembers = mainCommitteeMembers.filter((_, i) => i !== index);
    setMainCommitteeMembers(updatedMembers); // Update the state with the new members array
  };

  const removeMemberFromSubcommittee = (subcommitteeIndex, memberIndex) => {
    const updatedSubcommittees = [...subcommittees];
    updatedSubcommittees[subcommitteeIndex].members.splice(memberIndex, 1);
    setSubcommittees(updatedSubcommittees);
  };

  const TYPE_CHOICES = [
    { value: 0, label: "Permanent Teaching" },
    { value: 1, label: "Guest Teaching" },
    { value: 2, label: "Non-Teaching" },
  ];

  return (
    <div className="pt-24 flex h-full overflow-hidden bg-gray-800 text-white">
      <div className="md:w-[18rem]">
        <Sidebar />
      </div>

      <div className="flex-grow p-10 pb-20">
        <h2 className="text-3xl font-bold text-center mb-8">
          Manage Committees
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <input
              type="text"
              name="orderNumber"
              value={committeeData.orderNumber}
              onChange={handleInputChange}
              placeholder="Order Number"
              className="p-3 rounded-md bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="committeeName"
              value={committeeData.committeeName}
              onChange={handleInputChange}
              placeholder="Committee Name"
              className="p-3 rounded-md bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              name="orderDate"
              value={committeeData.orderDate}
              onChange={handleInputChange}
              className="p-3 rounded-md bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="number"
              name="expiry"
              value={committeeData.expiry}
              onChange={handleInputChange}
              placeholder="Expiry (years)"
              className="p-3 rounded-md bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              name="orderText"
              value={committeeData.orderText}
              onChange={handleInputChange}
              placeholder="Order Text"
              className="p-3 rounded-md bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              name="description"
              value={committeeData.description}
              onChange={handleInputChange}
              placeholder="Description"
              className="p-3 rounded-md bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows="4"
            />
          </div>

          <h3 className="text-2xl font-semibold mb-4">
            Add Main Committee Members
          </h3>

          <div className="flex space-x-4 mb-4">
            <Select
              options={employeeOptions}
              onChange={handleMainCommitteeSelection}
              isMulti
              className="flex-1"
              placeholder="Select Employees for Main Committee"
              isSearchable={true} // Keep the search functionality
              hideSelectedOptions={true} // Hide selected options in the field
              closeMenuOnSelect={false} // Keep the dropdown open after selecting an option
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: "#1F2937",
                  color: "white",
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
                  display: "none", // Hide the selected options display
                }),
              }}
            />

            <Select
              options={[
                { value: "", label: "All Employee Types" }, // Default option
                ...TYPE_CHOICES,
              ]}
              onChange={(option) => {
                setEmpType(option.value);
                // Optionally reset any other filters if needed
              }}
              className="flex-1"
              placeholder="Select Employee Type"
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: "#1F2937",
                  color: "white",
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
                singleValue: (base) => ({
                  ...base,
                  color: "white",
                }),
              }}
            />
            <Select
              options={[
                { value: "", label: "All Departments" }, // Default option
                ...departments.map((dep) => ({
                  value: dep.id,
                  label: dep.department_name,
                })),
              ]}
              onChange={(option) => {
                setDepartment(option.value);
                // Optionally reset any other filters if needed
              }}
              className="flex-1"
              placeholder="Select Department"
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: "#1F2937",
                  color: "white",
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
                singleValue: (base) => ({
                  ...base,
                  color: "white",
                }),
              }}
            />
          </div>

          <div className="flex justify-center">
            <div className="flex flex-col space-y-4 w-full max-w-3xl">
              {mainCommitteeMembers.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-gray-800 p-2 rounded-md"
                >
                  <span className="text-white w-1/4">{member.name}</span>
                  <input
                    type="text"
                    placeholder="Role"
                    value={member.role}
                    onChange={(e) =>
                      handleRoleScoreChange(index, "role", e.target.value)
                    }
                    className="p-1 rounded-md bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
                  />
                  <input
                    type="number"
                    placeholder="Score"
                    value={member.score}
                    onChange={(e) =>
                      handleRoleScoreChange(index, "score", e.target.value)
                    }
                    className="p-1 rounded-md bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-20" // Fixed width for score
                  />
                  <button
                    onClick={() => handleRemoveMember(index)}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <h3 className="text-2xl font-semibold mb-4">Manage Subcommittees</h3>
          {subcommittees.map((subcommittee, index) => (
            <div key={index} className="mb-6">
              <div className="flex space-x-4 mb-4 items-center">
                <input
                  type="text"
                  placeholder="Subcommittee Name"
                  value={subcommittee.sub_committee_name}
                  onChange={(e) =>
                    handleSubcommitteeChange(
                      index,
                      "sub_committee_name",
                      e.target.value
                    )
                  }
                  className="p-2 rounded-md bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
                />
                <input
                  type="text"
                  placeholder="Order Text"
                  value={subcommittee.sub_committee_Text}
                  onChange={(e) =>
                    handleSubcommitteeChange(
                      index,
                      "sub_committee_Text",
                      e.target.value
                    )
                  }
                  className="p-2 rounded-md bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeSubcommittee(index)}
                  className="p-2 text-red-500 hover:text-red-600"
                >
                  Remove Subcommittee
                </button>
              </div>

              <Select
                options={employeeOptions}
                onChange={(selectedOptions) =>
                  handleSubcommitteeSelection(selectedOptions, index)
                }
                isMulti
                className="w-full"
                placeholder="Select Members for Subcommittee"
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: "#1F2937",
                    color: "white",
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
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: "white",
                  }),
                }}
              />

              {subcommittee.members.map((member, memberIndex) => (
                <div
                  key={memberIndex}
                  className="flex items-center space-x-2 mt-2 bg-gray-800 p-2 rounded-md"
                >
                  <span className="text-white w-1/4">{member.name}</span>
                  <input
                    type="text"
                    placeholder="Role"
                    value={member.role}
                    onChange={(e) =>
                      handleSubcommitteeRoleScoreChange(
                        index,
                        memberIndex,
                        "role",
                        e.target.value
                      )
                    }
                    className="p-1 rounded-md bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
                  />
                  <input
                    type="number"
                    placeholder="Score"
                    value={member.score}
                    onChange={(e) =>
                      handleSubcommitteeRoleScoreChange(
                        index,
                        memberIndex,
                        "score",
                        e.target.value
                      )
                    }
                    className="p-1 rounded-md bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-20" // Fixed width for score
                  />
                  <button
                    type="button"
                    onClick={() =>
                      removeMemberFromSubcommittee(index, memberIndex)
                    }
                    className="p-2 text-red-500 hover:text-red-600"
                  >
                    Remove Member
                  </button>
                </div>
              ))}
            </div>
          ))}

          <button
            type="button"
            onClick={addSubcommittee}
            className="p-2 bg-blue-500 rounded-md text-white hover:bg-blue-600"
          >
            Add Subcommittee
          </button>

          <button
            type="submit"
            className="mt-8 px-6 py-3 bg-green-500 rounded-md text-white font-semibold hover:bg-green-600"
          >
            Save Committee
          </button>
        </form>
      </div>
    </div>
  );
};

export default Committee;
