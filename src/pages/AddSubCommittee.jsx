import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Sidebar from '../components/SideBar';
import requests from '../config';
import axios from 'axios';


const AddSubCommittee = () => {

    const [committeeDetails, setCommitteeDetails] = useState(null);

    const {id} = useParams()
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
  return (
    <div className="pt-24 flex min-h-screen bg-gray-900 text-white">
        <div className="md:w-[18rem]">
        <Sidebar />
      </div>

      <div className="flex-grow p-10 pb-20">
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-400">
      {committeeDetails.committe_Name}
        </h2>
        <h3 className="text-3xl font-normal text-center mb-8">
          Sub Committee
        </h3>

        <form className="space-y-6" >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
           
            <input
              type="text"
              name="committeeName"
              placeholder="Committee Name"
              className="p-3 rounded-md bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
           
           
            <input
              type="text"
              name="orderText"
              placeholder="Order Text"
              className="p-3 rounded-md bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddSubCommittee