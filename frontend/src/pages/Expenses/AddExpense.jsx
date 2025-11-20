import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from './../components/Button';

const AddExpense = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle add expense logic
    navigate('/expenses');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Add Expense</h1>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
          />
          <Input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
          />
          <Input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />
          <Input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
          <div className="flex space-x-4">
            <Button type="submit">Add Expense</Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/expenses')}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddExpense;
