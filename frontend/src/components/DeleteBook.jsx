import React from 'react';

const DeleteBook = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-bold mb-4 text-center">Delete Book</h2>
        <p className="text-sm text-gray-700 mb-6 text-center">
          Are you sure you want to delete this book? This action cannot be undone.
        </p>
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 cursor-pointer rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 cursor-pointer rounded bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBook;
