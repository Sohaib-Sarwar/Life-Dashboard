import React, { useState } from 'react';
import Card from '../../components/Card';

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Calendar</h1>
      <Card>
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <p className="text-gray-500">Calendar component will be implemented here</p>
        </div>
      </Card>
    </div>
  );
};

export default CalendarView;
