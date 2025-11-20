import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './components/NavBar';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
