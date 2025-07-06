import React from 'react';

const DeleteSessionModal = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg text-center">
        <h2 className="text-lg font-semibold mb-4">Delete Session?</h2>
        <p className="text-gray-600 mb-6">Are you sure you want to delete this session? This action cannot be undone.</p>
        <div className="flex justify-center gap-4">
          <button onClick={onCancel} className="px-4 py-1.5 cursor-pointer bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-1.5 cursor-pointer bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteSessionModal;