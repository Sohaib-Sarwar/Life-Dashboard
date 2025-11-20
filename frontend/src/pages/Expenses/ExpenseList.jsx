import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from './../components/Button';
import { Link } from 'react-router-dom';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Expenses</h1>
        <Link to="/expenses/add">
          <Button>Add Expense</Button>
        </Link>
      </div>
      <Card>
        {expenses.length === 0 ? (
          <p className="text-gray-500 text-center">No expenses recorded yet.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Category</th>
                <th className="text-left py-2">Description</th>
                <th className="text-right py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} className="border-b">
                  <td className="py-2">{expense.date}</td>
                  <td className="py-2">{expense.category}</td>
                  <td className="py-2">{expense.description}</td>
                  <td className="py-2 text-right">${expense.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
};

export default ExpenseList;
