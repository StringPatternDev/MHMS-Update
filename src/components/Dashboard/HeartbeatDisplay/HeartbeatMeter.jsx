import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GaugeChart from 'react-gauge-chart';

const HeartbeatMeter = ({bpm}) => {
  return (
    <>
      <GaugeChart
          id="bpm-meter"
          nrOfLevels={20}
          percent={bpm / 1500}
          colors={['#FF5F6D', '#FFC371']}
          arcWidth={0.3}
          needleColor="#345243"
          hideText={true}
          animate={false}
        />
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <FavoriteIcon sx={{ color: 'red', mr: 1 }} />
        <Box sx={{ width: '100%' }}>
          <Typography variant="body2" sx={{ mb: 1 }}>{`R-R Intervel: ${bpm} ms`}</Typography>
          <LinearProgress variant="determinate" value={bpm/15} />
        </Box>
      </Box>
    </>
  );
};

export default HeartbeatMeter;
