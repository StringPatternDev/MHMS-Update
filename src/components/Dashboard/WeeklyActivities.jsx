import React from 'react';
import { Paper, Typography, Box} from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';

const data = [
  { id: 0, value: 10, label: 'Article' , color: 'rgb(2, 178, 175)'},
  { id: 1, value: 15, label: 'Medication', color: 'rgb(184, 0, 216)' },
  { id: 2, value: 20, label: 'Consultation', color: 'rgb(46, 150, 255)'}
];

const WeeklyActivities = () => {
  return (
    <Paper elevation={3} sx={{ p: 2, flexGrow: 1, backgroundColor: '#f5f5f5' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Weekly Activities</Typography>
      <PieChart
        series={[
          {
            data,
            highlightScope: { faded: 'global', highlighted: 'item' },
            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
          },
        ]}
        height={175}
        margin={{ top: 0, bottom: 20, left: 0, right:0 }}
        slotProps={{
          legend: {
            direction: 'column',
            position: { vertical: 'bottom', horizontal: 'middle' },
            padding: 0,
            hidden: true
          },
        }}
      />
      {data.map((d) => (
        <Box key={d.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{display: 'flex'}}>
              <Box sx={{border: '10px solid ' + d.color, borderRadius: '100%', mr: 2}}></Box>
              <Typography variant="body2" sx={{ fontSize: 15}}>{d.label}</Typography>
            </Box>
            <Typography variant="body2" sx={{ fontSize: 15, mr: 2 }}>{d.value}</Typography>
        </Box>
      ))}
    </Paper>
  );
};

export default WeeklyActivities;
