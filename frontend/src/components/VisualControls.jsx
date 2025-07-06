// src/components/VisualControls.jsx
import React from 'react';
import clsx from 'clsx';

const VisualControls = ({ view, setView }) => {
  return (
    <div className="flex justify-end mb-6">
      <button
        onClick={() => setView('grid')}
        className={clsx(
          'px-4 py-2 cursor-pointer rounded-l text-white',
          view === 'grid' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'
        )}
      >
        Grid
      </button>
      <button
        onClick={() => setView('list')}
        className={clsx(
          'px-4 py-2 cursor-pointer rounded-r text-white',
          view === 'list' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'
        )}
      >
        List
      </button>
    </div>
  );
};

export default VisualControls;
