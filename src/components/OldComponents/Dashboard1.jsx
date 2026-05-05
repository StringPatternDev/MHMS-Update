import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';
import ProgressChart from '../ProgressChart';
import HeartbeatMeter from './HeartbeatMeter';
import LinearProgress from '@mui/joy/LinearProgress';
import GaugeChart from 'react-gauge-chart'
import DailyTasks from './DailyTasks'
import Button from '@mui/joy/Button';


const OldDashboard = () => {
  const heartbeat = 70;
  return (
    <Box sx={{ display: 'flex' }}>
      <Header />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6">Ibrahim Kadri</Typography>
              <Typography>Age: 54</Typography>
              <Typography>Consultation: Individual Therapy</Typography>
              <Typography>Visited: Online</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6">Self Control</Typography>
              {/* Add progress bars here */}
              <GaugeChart id="gauge-chart1" />
              <HeartbeatMeter heartbeat={heartbeat} />
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" sx={{ width: '35%', mr: 1 }}>Impulse</Typography>
                <LinearProgress variant="determinate" value={60} sx={{ width: '65%' }} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" sx={{ width: '35%', mr: 1 }}>Anxiety</Typography>
                <LinearProgress variant="determinate" value={30} sx={{ width: '65%' }} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" sx={{ width: '35%', mr: 1 }}>Attention Drift</Typography>
                <LinearProgress variant="determinate" value={50} sx={{ width: '65%' }} />
              </Box>
              <Box textAlign='center'>
                <Button >Button</Button>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6">Weekly Activities</Typography>
              {/* Add pie chart here */}
              <ProgressChart></ProgressChart>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <DailyTasks></DailyTasks>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6">Progress of Well-being</Typography>
              {/* Add bar chart here */}
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6">Messages</Typography>
              {/* Add message component here */}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default OldDashboard;
