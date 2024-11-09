import React, { useState } from 'react';



const SearchEmployeeModal = ({ showModal, closeModal }) => {
 

  return (
    showModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
        <div className="bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl p-6 animate-fade-in">
          <h2 className="text-3xl font-bold text-center text-white mb-6">Emopl</h2>
          <form className="space-y-6">
            
          </form>
        </div>
      </div>
    )
  );
};

export default SearchEmployeeModal;
