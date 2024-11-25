import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import requests from "../config";
import Sidebar from "../components/SideBar";
import { ClipLoader } from "react-spinners"; // Import the ClipLoader spinner
import AddSubmemberModal from "../components/AddSubmemberModal";

const CommitteeDetail = () => {
  const { id } = useParams();
  const [committeeDetails, setCommitteeDetails] = useState(null);
  const navigate = useNavigate();
  const [showSubmemberModal, setShowSubmemberModal] = useState(false);
  const [selectedSubcommittee, setSelectedSubcommittee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [receiverName, setReceiverName] = useState("");
  const [role, setRole] = useState("principal");
  const [loading, setLoading] = useState(true); // Track loading state
  const [copyName, setCopyName] = useState("");

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${requests.BaseUrlCommittee}/committee-detail/${id}/`
      );
      setCommitteeDetails(response.data);
    } catch (error) {
      console.error("Error fetching committee details:", error);
    } finally {
      setTimeout(() => setLoading(false), 1500); // Minimum delay for loading spinner
    }
  };

  const handleAdd = () => {
    navigate(`/add-members/${id}`);
  };

  const handleAlert = (committeeDetailId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to remove this employee?"
    );
    if (isConfirmed) deleteEmployee(committeeDetailId);
  };

  const deleteEmployee = (committeeDetailId) => {
    fetch(
      `${requests.BaseUrlCommittee}/committee-detail/${committeeDetailId}/delete/`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => {
        if (response.ok) {
          alert("Employee removed successfully!");
          fetchData();
        } else {
          alert("Failed to remove employee. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      });
  };

  

  const handleDeleteSubMember = async (subCommitteeId, memberId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this member?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${requests.BaseUrlCommittee}/delete-subcommittee-member/${subCommitteeId}/member/${memberId}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        alert("Member removed successfully!");
        fetchData(); // Refresh data to reflect changes
      } else {
        alert("Failed to remove the member. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleDeleteCommittee = async (committeeId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this committee? This action cannot be undone."
    );
    if (!confirmDelete) return;
  
    try {
      const response = await axios.delete(
        `${requests.BaseUrlCommittee}/delete-committee/${committeeId}/`
      );
  
      if (response.status === 204) {
        alert("Committee deleted successfully!");
        navigate('/generate-report') // Refresh the committee list after deletion
      } else {
        alert("Failed to delete the committee. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting committee:", error);
      alert("An error occurred while deleting the committee. Please try again.");
    }
  };

  const handleGeneratePDF = (receiverName, copyName, role) => {
    axios
      .get(`${requests.BaseUrlCommittee}/report/${id}/`, {
        params: { receiver_name: receiverName,copy_name: copyName, role: role },
        responseType: "text"
      })
      .then((response) => {
        const reportHtml = response.data;
        const printWindow = window.open("", "_blank");
        printWindow.document.open();
        printWindow.document.write(reportHtml);
        printWindow.document.close();
        printWindow.onload = () => printWindow.print();
        setReceiverName("");
        setCopyName(""); 
      })
      .catch((error) => {
        console.error("Error generating HTML report:", error);
      });
  };

  const handleSubmit = async () => {
    // console.log("Submitting with:", { receiverName, copyName, role }); // Debugging log
    handleGeneratePDF(receiverName, copyName, role);

    toggleModal();
  };

  const handleAddSubcommitteeMembers = (subcommittee) => {
    setSelectedSubcommittee(subcommittee);
    setShowSubmemberModal(true);
  };

  const closeSubmemberModal = () => {
    setShowSubmemberModal(false);
    setSelectedSubcommittee(null);
  };

  const handleAddSubCommittee = () => navigate(`/add-subcommittee/${id}`);

  const handleReconstitute = (mode) =>
    navigate(`/committee?committeeId=${id}&mode=${mode}`);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-gray-100">
        <ClipLoader color="#6366F1" size={100} /> {/* Large spinner */}
      </div>
    );
  }

  return (
    <div className="pt-24 flex min-h-screen overflow-hidden bg-gray-900 text-gray-100">
      <div className="md:min-w-[18rem]">
        <Sidebar />
      </div>

      <div className="flex-grow pt-10 pb-8 px-6 lg:px-10 space-y-8">
        
        <header className="flex flex-col items-center mb-8">
          
          <h2 className="text-5xl font-thin text-blue-300 mb-4">
            Committee Details
          </h2>
          <h3 className="text-4xl font-bold text-gray-100 bg-gray-800 px-8 py-4 rounded-lg shadow-lg">
            {committeeDetails.committe_Name}
          </h3>
        </header>

        {/* Committee Details Section */}
        <section className="bg-gray-800 text-gray-300 p-8 rounded-lg shadow-md mb-8">
          <h3 className="text-2xl font-bold text-blue-300 mb-4">
            Committee Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <DetailItem
              title="Order Description"
              content={committeeDetails.order_Description}
            />
            <DetailItem
              title="Order Number"
              content={committeeDetails.order_number}
            />
            <DetailItem
              title="Order Text"
              content={committeeDetails.order_Text}
            />
            <DetailItem
              title="Order Date"
              content={new Date(
                committeeDetails.order_date
              ).toLocaleDateString()}
            />
            <DetailItem
              title="Committee Expiry"
              content={committeeDetails.committe_Expiry ? "Active" : "Expired"}
            />
          </div>
          <div className="flex justify-end mt-6">
            <button
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-150"
              onClick={() => handleReconstitute("edit")}
            >
              Edit Committee
            </button>
          </div>
        </section>

        {/* Main Committee Members Section */}
        <section className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-blue-300 mb-4">
            Main Committee Members
          </h3>
          <ul className="list-disc pl-5 space-y-2">
            {(committeeDetails.main_committee_members || []).map(
              (member, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-gray-700 px-4 py-2 rounded-lg shadow-md"
                >
                  <span className="text-white font-semibold">
                    {member.employee?.name} - {member.role} - Score:{" "}
                    {member.score}
                  </span>
                  <button
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-1 px-3 rounded-md"
                    onClick={() => handleAlert(member.id)}
                  >
                    Remove
                  </button>
                </li>
              )
            )}
          </ul>
          <div className="flex justify-end mt-6">
            <button
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-150"
              onClick={handleAdd}
            >
              Add More Members
            </button>
          </div>
        </section>

        {/* Subcommittees Section */}
        {committeeDetails.sub_committees?.length > 0 && (
          <section className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-blue-300 mb-6">
              Subcommittees
            </h3>
            {committeeDetails.sub_committees.map((subCommittee, index) => (
              <div
                key={index}
                className="bg-gray-700 rounded-lg p-6 shadow-md mb-8"
              >
                <h4 className="text-xl font-bold text-white mb-2">
                  {subCommittee.sub_committee_name}
                </h4>
                <p className="text-gray-300 mb-6">
                  {subCommittee.sub_committee_Text}
                </p>

                <div className="space-y-4 mb-6">
                  {subCommittee.members && subCommittee.members.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {subCommittee.members.map((member, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-gray-600 px-4 py-3  rounded-lg shadow"
                        >
                          <span className="text-gray-200 font-semibold">
                            {member.employee?.name} - {member.role} - Score:{" "}
                            {member.score}
                          </span>
                          <button
                            onClick={() =>
                              handleDeleteSubMember(subCommittee.id, member.id)
                            }
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-1 px-4 rounded-md"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 italic">
                      No members in this subcommittee.
                    </p>
                  )}
                </div>

                <div className="flex justify-between">
                <button
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-150"
                    onClick={() => navigate(`/edit-subcommittee/${id}/${subCommittee.id}`)}
                  >
                    Edit SubCommittee
                  </button>
                  <button
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-150"
                    onClick={() => handleAddSubcommitteeMembers(subCommittee)}
                  >
                    Add Members
                  </button>
                </div>
              </div>
            ))}

          
          </section>
        )}
          <button
              onClick={handleAddSubCommittee}
              className="bg-gradient-to-r from-blue-600 to-purple-600  transition-transform duration-200 transform hover:scale-105 hover:shadow-2xl py-2 px-6 rounded-lg"
            >
              Add Subcommittee
            </button>

        {/* Actions Section */}
        <section className="flex flex-col items-center space-y-4">
          <button
            onClick={() => handleReconstitute("reconstitute")}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition duration-150"
          >
            Reconstitute Committee
          </button>
          <button
            onClick={toggleModal}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900 font-bold py-2 px-6 rounded-lg shadow-lg transition duration-150"
          >
            Generate Report
          </button>

          <button
            onClick={() => handleDeleteCommittee(id)}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-gray-900 font-bold py-2 px-6 rounded-lg shadow-lg transition duration-150"
          >
            Delete Committee
          </button>
        </section>

        {/* Modal for Generating Report */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 text-gray-200 p-6 rounded-lg shadow-lg w-full max-w-lg mx-4">
              <h2 className="text-xl font-semibold mb-4">Generate Report</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold">To:</label>
                  <input
                    type="text"
                    className="w-full mt-1 p-2 bg-transparent border border-gray-700 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold">Copy to:</label>
                  <input
                    type="text"
                    className="w-full mt-1 p-2 bg-transparent border border-gray-700 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    value={copyName}
                    onChange={(e) => setCopyName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold">Role:</label>
                  <select
                    className="w-full mt-1 p-2 bg-transparent border border-gray-700 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option className="bg-gray-500" value="Principal">Principal</option>
                    <option className="bg-gray-500" value="Principal-in-charge">Principal-in-charge</option>
                    {/* <option value="manager">Manager</option> */}
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={toggleModal}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded-md transition duration-150"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-4 rounded-md transition duration-150"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Adding Subcommittee Members */}
        {selectedSubcommittee && (
          <AddSubmemberModal
            committeeId={id}
            subCommitteeId={selectedSubcommittee.id}
            subCommitteeName={selectedSubcommittee.sub_committee_name}
            showModal={showSubmemberModal}
            closeModal={closeSubmemberModal}
            refreshCommitteeDetails={fetchData}
          />
        )}
      </div>
    </div>
  );
};

// Helper Component for Reusability
const DetailItem = ({ title, content }) => (
  <div>
    <h4 className="text-lg font-semibold text-blue-200">{title}</h4>
    <p className="text-md">{content}</p>
  </div>
);

export default CommitteeDetail;
