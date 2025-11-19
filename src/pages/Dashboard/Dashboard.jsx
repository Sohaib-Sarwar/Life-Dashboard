import React from 'react';
import Card from '../../components/Card';

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Tasks">
          <p className="text-gray-600">Overview of your tasks</p>
        </Card>
        <Card title="Habits">
          <p className="text-gray-600">Your habit streaks</p>
        </Card>
        <Card title="Expenses">
          <p className="text-gray-600">Monthly spending summary</p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
