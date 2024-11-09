import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import requests from "../config";
import Sidebar from "../components/SideBar";

const CommitteeDetail = () => {
  const { id } = useParams();
  const [committeeDetails, setCommitteeDetails] = useState(null);
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [receiverName, setReceiverName] = useState("");
  const [role, setRole] = useState("principal");

  useEffect(() => {
    axios
      .get(`${requests.BaseUrlCommittee}/committee-detail/${id}/`)
      .then((response) => {
        setCommitteeDetails(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching committee details:", error);
      });
  }, [id]);

  const handleGeneratePDF = (receiverName, role) => {
    axios
      .get(`${requests.BaseUrlCommittee}/report/${id}/`, {
        params: {
          receiver_name: receiverName,
          role: role,
        },
        responseType: "text", // Ensure we get the HTML content
      })
      .then((response) => {
        const reportHtml = response.data;
  
        // Open a new window to show the HTML content for printing
        const printWindow = window.open("", "_blank");
        printWindow.document.open();
        printWindow.document.write(reportHtml);
        printWindow.document.close();
  
        printWindow.onload = () => {
          // Automatically trigger the print dialog once the report is loaded
          printWindow.print();
        };
      })
      .catch((error) => {
        console.error("Error generating HTML report:", error);
      });
  };
  
  const handleSubmit = async () => {
    try {
      // Send the API request to generate the report
      handleGeneratePDF(receiverName, role); // Pass receiver name and role to handleGeneratePDF
  
      // Close the modal after generating the PDF
      toggleModal();
    } catch (error) {
      console.error("Error in submitting and generating report:", error);
    }
  };
  
  

  if (!committeeDetails) {
    return <p className="text-center text-gray-400 mt-10">Loading...</p>;
  }

  const handleAddSubCommittee = () => {
      navigate(`/add-subcommittee/${id}`); // Navigate to the subcommittee page
    };
  //added for reconstituting purpose
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleReconstitute = () =>{
    // navigate(`//${id}`); 
   
    navigate(`/committee?committeeId=${id}`); //to pass the id to the add committe page for reconstitutingS

  }; //------------------------------------------------------ 

  return (
    <div className="pt-24 flex min-h-screen overflow-hidden bg-gray-900 text-gray-100">
      <div className="md:min-w-[18rem]">
        <Sidebar />
      </div>

      <div className="flex-grow pt-10 pb-8 px-6 lg:px-10">
        <div className="flex flex-col items-center mb-10">
          <h2 className="text-5xl font-semibold text-center text-blue-300 mb-4">
            Committee Details
          </h2>
          <h3 className="text-4xl font-bold text-gray-200 bg-gray-800 px-6 py-2 rounded-lg shadow-lg mb-6">
            {committeeDetails.committe_Name}
          </h3>
        </div>

        <div className="bg-gray-800 text-gray-200 p-8 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="text-xl font-semibold">Order Description</h4>
              <p className="text-lg">{committeeDetails.order_Description}</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold">Order Number</h4>
              <p className="text-lg">{committeeDetails.order_number}</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold">Order Text</h4>
              <p className="text-lg">{committeeDetails.order_Text}</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold">Order Date</h4>
              <p className="text-lg">
                {new Date(committeeDetails.order_date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h4 className="text-xl font-semibold">Committee Expiry</h4>
              <p className="text-lg">
                {committeeDetails.committe_Expiry ? "Active" : "Expired"}
              </p>
            </div>
          </div>
        </div>

        <div className=" shadow-lg rounded-lg p-8 space-y-4 mb-8 border-2 border-blue-500">
          <h3 className="text-2xl font-bold text-white">
            Main Committee Members
          </h3>
          <ul className="list-disc pl-5 text-gray-200 space-y-2">
            {(committeeDetails.main_committee_members || []).map(
              (member, index) => (
                <li key={index} className="leading-relaxed">
                  <span className="text-white">{member.employee?.name}</span> -{" "}
                  {member.role}{" "}
                  <span className="italic text-sm text-gray-300">
                    (Department: {member.employee?.department_name || "N/A"})
                  </span>
                </li>
              )
            )}
          </ul>
        </div>

        {committeeDetails.sub_committees?.length > 0 && (
          <div className="bg-gray-800 shadow-lg rounded-lg p-6 space-y-6">
            <h4 className="text-2xl font-bold text-blue-300 border-b-2 border-blue-500 pb-2 mb-4">
              Subcommittees
            </h4>
            {committeeDetails.sub_committees.map((subCommittee, index) => (
              <div
                key={index}
                className="p-4 bg-gray-700 rounded-lg shadow-md space-y-2"
              >
                <h5 className="text-lg font-semibold text-white">
                  {subCommittee.sub_committee_name}
                </h5>
                <p className="text-gray-300">
                  {subCommittee.sub_committee_Text}
                </p>

                <ul className="list-disc pl-5 text-gray-300 space-y-1">
                  {(subCommittee.members || []).map((member, idx) => (
                    <li
                      key={idx}
                      className="leading-relaxed flex justify-between"
                    >
                      <span className="text-gray-200">
                        {member.employee?.name}
                      </span>
                      <span className="text-sm text-gray-400">
                        {member.role} (Dept:{" "}
                        {member.employee?.department_name || "N/A"})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        <div className=" mt-3 flex flex-row justify-between">
        <button
          onClick={handleAddSubCommittee}
          className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform transition-transform duration-150 hover:scale-105"
        >
          Add Subcommittee
        </button>
        <button
         onClick={handleReconstitute}
        className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform transition-transform duration-150 hover:scale-105"
        >Reconstitute</button>
        </div>

        <div className="flex justify-center mt-10">
          <button
            // onClick={handleGeneratePDF}
            onClick={toggleModal}
            className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform transition-transform duration-150 hover:scale-105"
          >
            Download Committee Report as PDF
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
    <div className="bg-gray-700 p-6 rounded-lg w-11/12 max-w-2xl text-center shadow-xl">
      <h2 className="text-2xl font-semibold mb-4 text-white">Download PDF Report</h2>
      {/* <p className="text-lg mb-6 text-white">Are you sure you want to download the report?</p> */}
      
      {/* Form Fields for Receiver's Name and Role */}
      <div className="mb-4">
        <label htmlFor="receiverName" className="block text-white text-lg mb-2">Receiver's Name</label>
        <input
          id="receiverName"
          type="text"
          value={receiverName}
          onChange={(e) => setReceiverName(e.target.value)}
          className="w-full p-3 rounded-lg text-gray-700 focus:outline-none"
          placeholder="Enter receiver's name"
        />
      </div>
      
      <div className="mb-6">
        <label htmlFor="role" className="block text-white text-lg mb-2">Select Role</label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-3 rounded-lg text-gray-700 focus:outline-none"
        >
          <option value="principal">Principal</option>
          <option value="principalInCharge">Principal In-Charge</option>
        </select>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={handleSubmit}
          // onClickCapture={handleGeneratePDF}
          className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Download Report
        </button>
        <button
          onClick={toggleModal}
          className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition duration-200"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

        {/* {isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
    <div className="bg-gray-700 p-6 rounded-lg w-11/12 max-w-2xl text-center shadow-xl">
      <h2 className="text-2xl font-semibold mb-4">Download PDF Report</h2>
      <p className="text-lg mb-6">Are you sure you want to download the report?</p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleGeneratePDF}
          className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Download Report
        </button>
        <button
          onClick={toggleModal}
          className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition duration-200"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)} */}

      </div>
    </div>
  );
};

export default CommitteeDetail;
