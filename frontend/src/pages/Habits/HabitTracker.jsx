import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from './../components/Button';

const HabitTracker = () => {
  const [habits, setHabits] = useState([]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Habit Tracker</h1>
        <Button>Add Habit</Button>
      </div>
      <Card>
        {habits.length === 0 ? (
          <p className="text-gray-500 text-center">No habits tracked yet. Start building better habits!</p>
        ) : (
          <div className="space-y-4">
            {habits.map((habit) => (
              <div key={habit.id} className="p-4 bg-gray-50 rounded-md">
                <h3 className="font-semibold">{habit.name}</h3>
                <p className="text-sm text-gray-600">Streak: {habit.streak} days</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default HabitTracker;
