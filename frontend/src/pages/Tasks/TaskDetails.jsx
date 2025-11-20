import React from 'react';
import { useParams } from 'react-router-dom';
import Card from '../../components/Card';

const TaskDetails = () => {
  const { id } = useParams();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Task Details</h1>
      <Card>
        <p className="text-gray-600">Details for task #{id}</p>
      </Card>
    </div>
  );
};

export default TaskDetails;
