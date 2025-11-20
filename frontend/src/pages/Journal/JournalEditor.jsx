import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from './../components/Button';

const JournalEditor = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle save journal entry logic
    navigate('/journal');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Write Journal Entry</h1>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Entry Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="12"
            placeholder="Write your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex space-x-4">
            <Button type="submit">Save Entry</Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/journal')}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default JournalEditor;
