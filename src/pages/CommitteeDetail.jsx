import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import requests from "../config";
import Sidebar from "../components/SideBar";

const CommitteeDetail = () => {
  const { id } = useParams();
  const [committeeDetails, setCommitteeDetails] = useState(null);

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

  const handleGeneratePDF = () => {
    axios
      .get(`http://127.0.0.1:8000/committee/report/${id}/`, { responseType: "text" })
      .then((response) => {
        const reportHtml = response.data;

        const printWindow = window.open("", "_blank");
        printWindow.document.open();
        printWindow.document.write(reportHtml);
        printWindow.document.close();

        printWindow.onload = () => {
          printWindow.print();
        };
      })
      .catch((error) => {
        console.error("Error generating HTML report:", error);
      });
  };

  if (!committeeDetails) {
    return <p className="text-center text-gray-400 mt-10">Loading...</p>;
  }

  return (
    <div className="pt-24 flex min-h-screen overflow-hidden bg-gray-900 text-gray-100">
      <div className="md:min-w-[18rem]">
        <Sidebar />
      </div>

      <div className="flex-grow pt-10 pb-8 px-6 lg:px-10">
        <div className="flex flex-col items-center">
          <h2 className="text-5xl font-semibold text-center text-blue-300 mb-8">
            Committee Details
          </h2>
          <h3 className="text-2xl font-bold text-gray-200 text-center bg-gray-800 px-6 py-2 rounded-lg shadow-lg mb-10">
            {committeeDetails.committe_Name}
          </h3>
        </div>

        <div className="bg-blue-700 shadow-lg rounded-lg p-8 space-y-8 mb-8 border-2 border-blue-500">
          <h3 className="text-2xl font-bold text-white">Main Committee Members</h3>
          <ul className="list-disc pl-5 text-gray-200 space-y-2">
            {(committeeDetails.main_committee_members || []).map((member, index) => (
              <li key={index} className="leading-relaxed">
                <span className="text-white">{member.employee?.name}</span> - {member.role}{" "}
                <span className="italic text-sm text-gray-300">
                  (Department: {member.employee?.department_name || "N/A"})
                </span>
              </li>
            ))}
          </ul>
        </div>

        {committeeDetails.sub_committees?.length > 0 && (
          <div className="bg-gray-800 shadow-lg rounded-lg p-6 mt-6 space-y-6">
            <h4 className="text-xl font-semibold text-blue-300">Subcommittees</h4>
            {committeeDetails.sub_committees.map((subCommittee, index) => (
              <div key={index} className="p-4 bg-gray-700 rounded-lg space-y-2">
                <h5 className="text-lg font-semibold text-gray-300">
                  {subCommittee.sub_committee_name}
                </h5>
                <p className="text-gray-400">{subCommittee.sub_committee_Text}</p>

                <ul className="list-disc pl-5 text-gray-400 space-y-1">
                  {(subCommittee.members || []).map((member, idx) => (
                    <li key={idx} className="leading-relaxed">
                      <span className="text-gray-200">{member.employee?.name}</span> - {member.role}{" "}
                      <span className="italic text-sm text-gray-400">
                        (Department: {member.employee?.department_name || "N/A"})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-10">
          <button
            onClick={handleGeneratePDF}
            className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform transition-transform duration-150 hover:scale-105"
          >
            Download Committee Report as PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommitteeDetail;
