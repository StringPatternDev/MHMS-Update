import React from 'react';
import { Box, Grid } from '@mui/material';
// import Sidebar from '../Sidebar';
import Header from '../Header';
import Profile from '../Dashboard/Profile'
import HeartbeatDisplay from '../Dashboard/HeartbeatDisplay/HeartbeatDisplay';
import WeeklyActivities from '../Dashboard/WeeklyActivities';
import DailyTasks from '../Dashboard/DailyTasks/DailyTasks';
import ProgressChart from '../Dashboard/ProgressChart'

import Sidebar from './Sidebar2';

const Dashboard = () => {
  const heartbeat = 70; // Example heartbeat value, you can replace this with dynamic data

  return (
    <Box sx={{ display: 'flex' }}>
      <Header />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Profile></Profile>
          </Grid>
          <Grid container item xs={12} spacing={3} sx={{ display: 'flex' }}>
            <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column' }}>
              <HeartbeatDisplay heartbeat={heartbeat} ></HeartbeatDisplay>
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column' }}>
              <WeeklyActivities />
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column' }}>
              <DailyTasks />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <ProgressChart />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
