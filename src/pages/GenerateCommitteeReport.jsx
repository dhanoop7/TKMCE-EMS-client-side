import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import requests from "../config";
import Sidebar from "../components/SideBar";

const GenerateCommitteeReport = () => {
  const [committees, setCommittees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${requests.BaseUrlCommittee}/committees/`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          // Sort committees to show the newest first
          const sortedCommittees = response.data.reverse();
          setCommittees(sortedCommittees);
        } else {
          setCommittees([]);
          console.error("Unexpected data format:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching committees:", error);
        setCommittees([]);
      });
  }, []);

  return (
    <div className="pt-24 flex min-h-screen overflow-hidden bg-gray-900">
      <div className="md:min-w-[18rem]">
        <Sidebar />
      </div>

      <div className="flex-grow pt-20 p-4 sm:p-6 lg:p-10 text-gray-100">
        <h2 className="text-4xl font-semibold text-center text-gray-100 mb-8">
          Committee Reports
        </h2>

        {committees.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {committees.map((committee, index) => (
              <div
                key={index}
                className="bg-gray-800 shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-200 transform hover:-translate-y-1"
              >
                <h3 className="text-2xl font-bold text-gray-200 mb-2">
                  {committee.committe_Name}
                </h3>
                <p className="text-sm text-gray-400 mb-2">
                  <span className="font-medium">Order Number:</span> {committee.order_number}
                </p>
                <p className="text-sm text-gray-400 mb-4 truncate">
                  <span className="font-medium">Order Text:</span> {committee.order_Text}
                </p>
                <button
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition duration-150 ease-in-out focus:outline-none focus:ring focus:ring-blue-300"
                  onClick={() => navigate(`/committee-detail/${committee.id}`)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-10">No committees found.</p>
        )}
      </div>
    </div>
  );
};

export default GenerateCommitteeReport;

