import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="bg-white border-b shadow px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-semibold text-indigo-700 hover:underline">
        📚 My Library
      </Link>
      {token && (
        <button
          onClick={logout}
          className="bg-red-500 cursor-pointer hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
        >
          Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;
