import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Sidebar from "../components/SideBar";
import axios from "axios";
import requests from "../config";

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
      const response = await axios.post(
        `${requests.BaseUrlCommittee}/create-committee/`,
        payload
      );

      console.log(response.data);
      alert("Committee saved successfully!");

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
      navigate(`/add-members/${response.data.id}`);
    } catch (error) {
      console.error("Error saving committee:", error);
      alert("An error occurred while saving the committee. Please try again.");
    }
  };

  return (
    <div className="pt-24 flex h-full overflow-hidden bg-gray-800 text-white">
      <div className="md:w-[18rem]">
        <Sidebar />
      </div>

      <div className="flex-grow p-10 pb-20">
        <h2 className="text-3xl font-bold text-center mb-8">
          Add Committee
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
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save Committee and Add Members
          </button>
        </form>
      </div>
    </div>
  );
};

export default Committee;