import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/SideBar";
import requests from "../config";
import axios from "axios";
import AddSubmemberModal from "../components/AddSubmemberModal";

const AddSubCommittee = () => {
  const [committeeDetails, setCommitteeDetails] = useState(null);
  const [subCommitteeData, setSubCommitteeData] = useState({
    committeeName: "",
    orderText: "",
  });
  const { id } = useParams();
  console.log('committeeid:',id);
  const [subCommitteeId, setSubCommitteeId] = useState(null);
  const [subCommitteeName, setSubCommitteeName] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();

  // Fetch committee details
  useEffect(() => {
    axios
      .get(`${requests.BaseUrlCommittee}/committee-detail/${id}/`)
      .then((response) => {
        setCommitteeDetails(response.data);
      })
      .catch((error) => {
        console.error("Error fetching committee details:", error);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubCommitteeData({ ...subCommitteeData, [name]: value });
  };

  const openAddModal = () => setShowAddModal(true);
  const closeAddModal = () => setShowAddModal(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const postData = {
      committee_id: id,
      sub_committee_name: subCommitteeData.committeeName,
      sub_committee_Text: subCommitteeData.orderText,
    };

    axios
      .post(`${requests.BaseUrlCommittee}/committee/${id}/subcommittee/`, postData)
      .then((response) => {
        console.log("Subcommittee created:", response.data);
        alert("Subcommittee created successfully!");
        setSubCommitteeData({ committeeName: "", orderText: "" });
        setSubCommitteeId(response.data.id);
        setSubCommitteeName(response.data.sub_committee_name) // Get the ID of the created subcommittee
        openAddModal(); // Open the modal after successful submission
      })
      .catch((error) => {
        console.error("Error creating subcommittee:", error);
        alert("Failed to create subcommittee.");
      });
  };

  const handleFinish = () => {
    navigate(`/committee-detail/${id}`);
  };

  return (
    <div className="pt-24 flex min-h-screen bg-gray-900 text-white">
      <div className="md:w-[18rem]">
        <Sidebar defaultClosed={true}/>
      </div>

      <div className="flex-grow p-10 pb-20">
        {committeeDetails ? (
          <>
            <h2 className="text-3xl font-bold text-center mb-8 text-blue-400">
              {committeeDetails.committe_Name}
            </h2>
            <h3 className="text-3xl font-normal text-center mb-8">
              Sub Committee
            </h3>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
                <div className="col-span-2 md:col-span-1">
                  <label
                    htmlFor="committeeName"
                    className="text-gray-300 text-sm font-semibold mb-1 block"
                  >
                    Committee Name
                  </label>
                  <input
                    type="text"
                    name="committeeName"
                    id="committeeName"
                    value={subCommitteeData.committeeName}
                    onChange={handleInputChange}
                    placeholder="Enter Committee Name"
                    className="w-full p-3 rounded-md bg-gray-800 text-white placeholder-gray-500 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label
                    htmlFor="orderText"
                    className="text-gray-300 text-sm font-semibold mb-1 block"
                  >
                    Order Text
                  </label>
                  <input
                    type="text"
                    name="orderText"
                    id="orderText"
                    value={subCommitteeData.orderText}
                    onChange={handleInputChange}
                    placeholder="Enter Order Text"
                    className="w-full p-3 rounded-md bg-gray-800 text-white placeholder-gray-500 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Submit
                </button>
              </div>
            </form>

            <div className="flex justify-center mt-8">
              <button
                type="button"
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                onClick={handleFinish}
              >
                Finish
              </button>
            </div>

            {/* AddSubmemberModal should only be displayed when showAddModal is true */}
            <AddSubmemberModal
              committeeId={id}
              subCommitteeId={subCommitteeId}
              subCommitteeName={subCommitteeName}
              showModal={showAddModal}
              closeModal={closeAddModal}
            />
          </>
        ) : (
          <p className="text-center text-gray-400">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default AddSubCommittee;

