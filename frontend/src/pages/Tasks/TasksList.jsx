import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';

const TasksList = () => {
  const [tasks, setTasks] = useState([]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <Button>Add Task</Button>
      </div>
      <Card>
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center">No tasks yet. Add your first task!</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li key={task.id} className="p-3 bg-gray-50 rounded-md">
                {task.title}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};

export default TasksList;
