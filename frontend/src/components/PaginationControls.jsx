import React from 'react';

const PaginationControls = ({ count, pageSize, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(count / pageSize);
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-wrap justify-center items-center gap-2 mt-10">
      <button
        className="px-3 py-1 cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-200"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {pageNumbers.map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={`px-3 py-1 cursor-pointer rounded ${
            currentPage === num
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white'
          }`}
        >
          {num}
        </button>
      ))}

      <button
        className="px-3 py-1 cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-200"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default PaginationControls;
