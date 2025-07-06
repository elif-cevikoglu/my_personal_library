// src/components/FilterControls.jsx
import React from 'react';

const FilterControls = ({
  searchTerm,
  setSearchTerm,
  ordering,
  setOrdering,
  genre,
  setGenre,
  isRead,
  setIsRead,
  pageSize,
  setPageSize,
  onApplyFilters,
  onClearFilters
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onApplyFilters();
      }}
      className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-8"
    >
      <input
        type="text"
        placeholder="Title or Author"
        className="border border-gray-300 px-3 py-2 rounded-md focus:ring focus:outline-none"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <select
        className="border border-gray-300 px-3 py-2 rounded-md focus:ring focus:outline-none"
        value={ordering}
        onChange={(e) => setOrdering(e.target.value)}
      >
        <option value="">Sort by</option>
        <option value="title">Title (A-Z)</option>
        <option value="-title">Title (Z-A)</option>
        <option value="created_at">Oldest First</option>
        <option value="-created_at">Newest First</option>
      </select>

      <input
        type="text"
        placeholder="Genre"
        className="border border-gray-300 px-3 py-2 rounded-md focus:ring focus:outline-none"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
      />

      <select
        className="border border-gray-300 px-3 py-2 rounded-md focus:ring focus:outline-none"
        value={isRead}
        onChange={(e) => setIsRead(e.target.value)}
      >
        <option value="">All</option>
        <option value="true">Read</option>
        <option value="false">Unread</option>
      </select>

      <select
        className="border border-gray-300 px-3 py-2 rounded-md focus:ring focus:outline-none"
        value={pageSize}
        onChange={(e) => setPageSize(Number(e.target.value))}
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
      </select>

      <button
        type="submit"
        className="bg-blue-600 cursor-pointer text-white font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Apply
      </button>

      <button
        type="button"
        onClick={onClearFilters}
        className="bg-red-500 cursor-pointer text-white font-medium px-4 py-2 rounded-md hover:bg-red-700 transition"
      >
        Reset
      </button>
    </form>
  );
};

export default FilterControls;
