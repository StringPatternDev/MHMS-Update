import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import { Paper, Typography } from '@mui/material';

const data = [
  { name: 'Jan', progress: 30 },
  { name: 'Feb', progress: 50 },
  { name: 'Mar', progress: 70 },
  { name: 'Apr', progress: 30 },
  { name: 'May', progress: 50 },
  { name: 'Jun', progress: 70 },
  { name: 'JUl', progress: 30 },
  { name: 'Aug', progress: 50 }
  // Add more data points
];

const ProgressChart = () => (
  <Paper elevation={3} sx={{ p: 2 }}>
    <Typography variant="h6">Stress Tracking</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="progress" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
  </Paper>
);

export default ProgressChart;