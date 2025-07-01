import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { Card } from 'antd';

interface ExpensesByStatusProps {
  status: string;
  count: number;
  color_code: string;
}

interface ExpensesByStatusChartProps {
  data: ExpensesByStatusProps[];
}

const ExpensesByStatusChart: React.FC<ExpensesByStatusChartProps> = ({ data }) => {
  return (
    <Card title="Expenses by Status" className="h-full">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{
            top: 20, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color_code} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default ExpensesByStatusChart;
