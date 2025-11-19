import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600">
          Life Dashboard
        </Link>
        <div className="flex items-center space-x-4">
          {/* Navigation items */}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
