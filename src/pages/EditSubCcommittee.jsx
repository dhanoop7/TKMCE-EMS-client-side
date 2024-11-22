import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/SideBar";
import requests from "../config";
import axios from "axios";

const EditSubCcommittee = () => {
  const [subCommitteeData, setSubCommitteeData] = useState({
    committeeName: "",
    orderText: "",
  });
  const { committeeId, subcommitteeId } = useParams(); // Extract committeeId and subcommitteeId from the URL
  const navigate = useNavigate();

  // Fetch subcommittee details when the component mounts
  useEffect(() => {
    // Make an API call to fetch the subcommittee details based on the subcommitteeId
    axios
      .get(`${requests.BaseUrlCommittee}/single-subcommittee/${committeeId}/subcommittee/${subcommitteeId}/`)
      .then((response) => {
        console.log(response.data);
        // Set the fetched subcommittee data into the state
        setSubCommitteeData({
          committeeName: response.data.sub_committee_name,
          orderText: response.data.sub_committee_Text,
        });
      })
      .catch((error) => {
        console.error("Error fetching subcommittee details:", error);
        alert("Failed to fetch subcommittee details.");
      });
  }, [committeeId, subcommitteeId]); // Dependencies are id and subcommitteeId

  // Handle input field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubCommitteeData({ ...subCommitteeData, [name]: value });
  };

  // Handle form submission to update the subcommittee
  const handleSubmit = (e) => {
    e.preventDefault();

    const postData = {
      sub_committee_name: subCommitteeData.committeeName,
      sub_committee_Text: subCommitteeData.orderText,
    };

    // Make PUT request to update the subcommittee
    axios
      .put(`${requests.BaseUrlCommittee}/edit-subcommittee/${subcommitteeId}/`, postData)
      .then((response) => {
        console.log("Subcommittee updated:", response.data);
        alert("Subcommittee updated successfully!");
        navigate(`/committee-detail/${committeeId}`); // Redirect to committee details page
      })
      .catch((error) => {
        console.error("Error updating subcommittee:", error);
        alert("Failed to update subcommittee.");
      });
  };

  // Navigate back to committee details page
  const handleFinish = () => {
    navigate(`/committee-detail/${committeeId}`);
  };

  return (
    <div className="pt-24 flex min-h-screen bg-gray-900 text-white">
      <div className="md:w-[18rem]">
        <Sidebar />
      </div>

      <div className="flex-grow p-10 pb-20">
        {subCommitteeData.committeeName ? (
          <>
            <h2 className="text-3xl font-bold text-center mb-8 text-blue-400">
              {subCommitteeData.committeeName}
            </h2>
            <h3 className="text-3xl font-normal text-center mb-8">Edit Subcommittee</h3>

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
                  Edit
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
          </>
        ) : (
          <p className="text-center text-gray-400">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default EditSubCcommittee;

