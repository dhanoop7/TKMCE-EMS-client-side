import React, { useState } from "react";
import Select from "react-select";
import { Dialog } from "@headlessui/react"; // For modal functionality

const FilterModal = ({ isOpen, closeModal, applyFilters }) => {
  const [selectedType, setSelectedType] = useState({ value: null, label: "All Types" });
  const [selectedOrder, setSelectedOrder] = useState("asc");

  const employeeTypes = [
    { value: null, label: "All Types" },
    { value: 0, label: "Permanent Teaching" },
    { value: 1, label: "Guest Teaching" },
    { value: 2, label: "Permanent Non-Teaching" },
    { value: 3, label: "Temporary Non-Teaching" },
  ];

  const sortingOptions = [
    { value: "asc", label: "Ascending" },
    { value: "desc", label: "Descending" },
  ];

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#1f2937",
      color: "#fff",
      border: "1px solid #4b5563",
      padding: "5px",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#fff",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#374151",
      color: "#fff",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#4b5563" : "#374151",
      color: "#fff",
      cursor: "pointer",
    }),
  };

  const handleApplyFilters = () => {
    applyFilters(selectedType, selectedOrder);
    closeModal();
  };

  return (
    <Dialog open={isOpen} onClose={closeModal}>
      <Dialog.Overlay className="fixed inset-0 bg-gray-800 bg-opacity-75" />
      <Dialog.Panel className="fixed top-1/4 left-1/4 right-1/4 p-6 bg-gray-900 rounded-lg shadow-lg">
        <Dialog.Title className="text-2xl font-bold text-gray-200">Filter Options</Dialog.Title>
        <div className="mt-4">
          <label className="block text-lg font-semibold mb-2 text-gray-200">Select Type</label>
          <Select
            options={employeeTypes}
            value={selectedType}
            onChange={setSelectedType}
            placeholder="Select a type"
            styles={customSelectStyles}
          />
        </div>

        <div className="mt-4">
          <label className="block text-lg font-semibold mb-2 text-gray-200">Sort by Score</label>
          <Select
            options={sortingOptions}
            value={{ value: selectedOrder, label: selectedOrder === "asc" ? "Ascending" : "Descending" }}
            onChange={(selected) => setSelectedOrder(selected.value)}
            placeholder="Select order"
            styles={customSelectStyles}
          />
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleApplyFilters}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Apply Filters
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};

export default FilterModal;
