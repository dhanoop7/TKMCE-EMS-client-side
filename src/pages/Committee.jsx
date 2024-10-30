import React, { useState } from "react";
import Sidebar from '../components/SideBar';
import CommitteeMemberModal from '../components/CommitteeMemberModal';

const Committee = () => {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    openModal(); // Open the modal to add members
  };

  return (
    <div className="pt-24 flex h-full overflow-hidden bg-gray-800 text-white">
      <div className="md:w-[18rem]">
        <Sidebar />
      </div>

      <div className="flex-grow p-10">
        <h2 className="text-3xl font-bold text-center mb-8">Manage Committees</h2>

        {/* Form for adding/editing committees */}
        <div className="bg-gray-700 p-6 rounded-lg shadow-lg mb-8">
          <h3 className="text-2xl font-semibold mb-4">Add / Edit Committee</h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Order Number</label>
                <input
                  type="text"
                  className="w-full p-2 bg-gray-800 rounded-md focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Committee Name</label>
                <input
                  type="text"
                  className="w-full p-2 bg-gray-800 rounded-md focus:outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Order Date</label>
                <input
                  type="date"
                  className="w-full p-2 bg-gray-800 rounded-md focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Expiry (years)</label>
                <input
                  type="number"
                  className="w-full p-2 bg-gray-800 rounded-md focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Order Text</label>
              <input
                type="text"
                className="w-full p-2 bg-gray-800 rounded-md focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                className="w-full p-2 bg-gray-800 rounded-md focus:outline-none"
                rows="3"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-2 mt-4 bg-blue-600 rounded-md hover:bg-blue-500 transition"
            >
              Save Committee
            </button>
          </form>
        </div>

        {/* Existing Committees */}
        <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-4">Existing Committees</h3>
          {/* List existing committees here */}
        </div>
      </div>

      {/* Member Modal */}
      <CommitteeMemberModal showModal={showModal} closeModal={closeModal} />
    </div>
  );
};

export default Committee;



