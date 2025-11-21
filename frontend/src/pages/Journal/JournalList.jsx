import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import Button from './../components/Button';

const JournalList = () => {
  const [entries, setEntries] = useState([]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Journal</h1>
        <Link to="/journal/new">
          <Button>New Entry</Button>
        </Link>
      </div>
      <div className="space-y-4">
        {entries.length === 0 ? (
          <Card>
            <p className="text-gray-500 text-center">No journal entries yet. Start writing!</p>
          </Card>
        ) : (
          entries.map((entry) => (
            <Card key={entry.id}>
              <h3 className="font-semibold text-lg mb-2">{entry.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{entry.date}</p>
              <p className="text-gray-700">{entry.preview}</p>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default JournalList;
