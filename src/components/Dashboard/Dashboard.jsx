import React from 'react';
import { Box, Grid } from '@mui/material';
import Profile from './Profile'
import HeartbeatDisplay from './HeartbeatDisplay/HeartbeatDisplay';
import WeeklyActivities from './WeeklyActivities';
import DailyTasks from './DailyTasks/DailyTasks';
import ProgressChart from './ProgressChart'
import EditProfileDialog from "./EditProfileDialog"
import PaitentGrid from "./PaitentGrid"
import { useUser } from "../../context/userContext";

const Dashboard = () => {
  const { isDoctor } = useUser();

  return (
      <>
        <EditProfileDialog/>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Profile></Profile>
          </Grid>
          {!isDoctor && <>
            <Grid container item xs={12} spacing={3} sx={{ display: 'flex' }}>
              <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                <HeartbeatDisplay />
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
          </>}
          {isDoctor && <Grid item xs={12}>
            <PaitentGrid />
          </Grid>}
        </Grid>
      </>
  );
};

export default Dashboard;
