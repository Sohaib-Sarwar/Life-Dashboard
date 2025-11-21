import React from 'react';
import Card from '../../components/Card';
import ChartComponent from '../../components/ChartComponent';

const HabitStats = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Habit Statistics</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Completion Rate">
          <ChartComponent type="line" />
        </Card>
        <Card title="Habit Breakdown">
          <ChartComponent type="pie" />
        </Card>
      </div>
    </div>
  );
};

export default HabitStats;
