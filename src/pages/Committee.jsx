import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Sidebar from "../components/SideBar";
import axios from "axios";
import requests from "../config";

import { useLocation } from "react-router-dom";

const Committee = () => {
  const [committeeData, setCommitteeData] = useState({
    orderNumber: "",
    committeeName: "",
    orderDate: "",
    expiry: "",
    orderText: "",
    description: "",
  });

  const navigate = useNavigate(); // Initialize navigate function
  //-----------start------
  const location = useLocation();
  console.log("Location:", location);
  const queryParams = new URLSearchParams(window.location.search);
  console.log(window.location.search);
  const committeeId = queryParams.get("committeeId");
  const mode = queryParams.get("mode");
  console.log(mode);

  console.log(committeeId, "id");
  // Fetch existing committee data when reconstituting
  useEffect(() => {
    console.log("inside useEffect");
    if (committeeId) {
      console.log("inside if");
      const fetchCommitteeData = async () => {
        try {
          const response = await axios.get(
            `${requests.BaseUrlCommittee}/committee-detail/${committeeId}/`
          );
          const data = response.data;
          console.log(response.data);
          setCommitteeData({
            orderNumber: data.order_number,
            committeeName: data.committe_Name,
            orderDate: data.order_date,
            expiry: data.committe_Expiry,
            orderText: data.order_Text,
            description: data.order_Description,
          });
        } catch (error) {
          console.error("Error fetching committee data:", error);
          alert("Error fetching committee details. Please try again.");
        }
      };
      fetchCommitteeData();
    }
  }, [committeeId]);
  //--------------end---------------
  if (mode === "edit") {
    console.log("hi");
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCommitteeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      order_number: committeeData.orderNumber,
      committe_Name: committeeData.committeeName,
      order_date: committeeData.orderDate,
      order_Text: committeeData.orderText,
      order_Description: committeeData.description,
      committe_Expiry: committeeData.expiry,
    };

    try {
      if (mode === "edit") {
        const response = await axios.put(
          `${requests.BaseUrlCommittee}/edit/${committeeId}/`,
          payload
        );
        alert("Committee edited successfully!");
        navigate(`/committee-detail/${committeeId}`)
      } else {
        const response = await axios.post(
          `${requests.BaseUrlCommittee}/create-committee/`,
          payload
        );
        if (committeeId) {
          alert("Committee  reconstituted successfully!");
        } else {
          alert("Committee saved successfully!");
        }
        navigate(`/add-members/${response.data.id}`);
      }
      // }
      //-end-----------

      // console.log(response.data);
      // alert("Committee saved successfully!");

      // Reset form states
      setCommitteeData({
        orderNumber: "",
        committeeName: "",
        orderDate: "",
        expiry: "",
        orderText: "",
        description: "",
      });

      // Redirect to the Add Members page with the new committee ID
    } catch (error) {
      console.error("Error saving committee:", error);
      // alert("An error occurred while saving the committee. Please try again.");
    }
  };

  return (
    <div className="pt-24 min-h-screen flex h-full overflow-hidden bg-gray-800 text-white">
      <div className="md:w-[18rem]">
        <Sidebar />
      </div>

      <div className="flex-grow p-10 pb-20">
        <h2 className="text-3xl font-bold text-center mb-8">
          {/* Add Committee */}
          <h2 className="text-3xl font-bold text-center mb-8">
            {mode === "edit"
              ? "Edit Committee"
              : committeeId
              ? "Reconstitute Committee"
              : "Add Committee"}
          </h2>
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

          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition duration-150 ease-in-out focus:outline-none focus:ring focus:ring-blue-300 "
          >
            {/* Save Committee and Add Members */}
            {committeeId
              ? mode === "edit"
                ? "Edit Committee"
                : "Reconstitute Committee"
              : "Save Committee and Add Members"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Committee;
