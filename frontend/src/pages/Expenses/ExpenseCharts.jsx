import React from 'react';
import Card from '../../components/Card';
import ChartComponent from '../../components/ChartComponent';

const ExpenseCharts = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Expense Analytics</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Monthly Spending">
          <ChartComponent type="bar" />
        </Card>
        <Card title="Category Breakdown">
          <ChartComponent type="pie" />
        </Card>
        <Card title="Spending Trend" className="lg:col-span-2">
          <ChartComponent type="line" />
        </Card>
      </div>
    </div>
  );
};

export default ExpenseCharts;
