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

  const generatePDF = () => {
    axios({
      url: `http://127.0.0.1:8000/committee/report/${id}/`,
      method: 'GET',
      responseType: 'blob', // Important
    })
      .then((response) => {
        // Create a URL for the PDF blob
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `committee_report_${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
      });
  };

  if (!committeeDetails) {
    return <p className="text-center text-gray-400 mt-10">Loading...</p>;
  }

  return (
    <div className="pt-24 flex min-h-screen overflow-hidden bg-gray-900">
      <div className="md:min-w-[18rem]">
        <Sidebar />
      </div>

      <div className="flex-grow pt-20 p-4 sm:p-6 lg:p-10 text-gray-100">
        <h2 className="text-4xl font-semibold text-center text-gray-100 mb-8">
          Committee Details: {committeeDetails.committe_Name}
        </h2>
        
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-6">
          <h3 className="text-2xl font-bold text-gray-200 mb-3">
            Order Number: {committeeDetails.order_number}
          </h3>
          <p className="text-gray-400 mb-4">
            <span className="font-medium">Order Text:</span> {committeeDetails.order_Text}
          </p>
          <p className="text-gray-400 mb-4">
            <span className="font-medium">Description:</span> {committeeDetails.order_Description}
          </p>
          
          <div className="mt-6">
            <h4 className="text-xl font-semibold text-gray-200 mb-3">Main Committee Members:</h4>
            <ul className="list-disc pl-5 text-gray-400">
              {(committeeDetails.main_committee_members || []).map((member, index) => (
                <li key={index}>
                  {member.employee?.name} - {member.role} (Department: {member.employee?.department_name || 'N/A'})
                </li>
              ))}
            </ul>
          </div>

          {committeeDetails.sub_committees?.length > 0 && (
            <div className="mt-8">
              <h4 className="text-xl font-semibold text-gray-200 mb-3">Subcommittees:</h4>
              {committeeDetails.sub_committees.map((subCommittee, index) => (
                <div key={index} className="mt-4 p-4 bg-gray-700 rounded-lg">
                  <h5 className="text-lg font-semibold text-gray-300 mb-2">
                    {subCommittee.sub_committee_name}
                  </h5>
                  <p className="text-gray-400 mb-3">{subCommittee.sub_committee_Text}</p>
                  
                  <ul className="list-disc pl-5 text-gray-400">
                    {(subCommittee.members || []).map((member, idx) => (
                      <li key={idx}>
                        {member.employee?.name} - {member.role} (Department: {member.employee?.department_name || 'N/A'})
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={generatePDF}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Generate PDF
        </button>
      </div>
    </div>
  );
};

export default CommitteeDetail;


