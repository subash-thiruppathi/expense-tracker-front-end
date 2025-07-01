import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from 'antd';

interface ExpensesByCategoryProps {
  category: string;
  count: number;
  total: number;
}

interface ExpensesByCategoryChartProps {
  data: ExpensesByCategoryProps[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const ExpensesByCategoryChart: React.FC<ExpensesByCategoryChartProps> = ({ data }) => {
  console.log('ExpensesByCategoryChart Data:', data);
  return (
    <Card title="Expenses by Category" className="h-full">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="total"
            nameKey="category"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `$${value?.toFixed(2)}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default ExpensesByCategoryChart;
