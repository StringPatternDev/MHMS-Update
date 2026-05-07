// import React from 'react';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
// import { Paper, Typography } from '@mui/material';
// import {useDashboardData} from '../../context/dashboardDataContext';

// const data = [
//   { name: 'Jan', progress: 30 },
//   { name: 'Feb', progress: 50 },
//   { name: 'Mar', progress: 70 },
//   { name: 'Apr', progress: 30 },
//   { name: 'May', progress: 50 },
//   { name: 'Jun', progress: 70 },
//   { name: 'JUl', progress: 30 },
//   { name: 'Aug', progress: 50 }
//   // Add more data points
// ];

// const ProgressChart = () => {
//   const { dailyVitals, loadingVitals } = useDashboardData();
//   console.log(dailyVitals);


//   return(
//     <Paper elevation={3} sx={{ p: 2 }}>
//       <Typography variant="h6">Stress Tracking</Typography>
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={data}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="progress" fill="#8884d8" />
//           </BarChart>
//         </ResponsiveContainer>
//     </Paper>
//   );
// }

// export default ProgressChart;

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Paper, Typography, Box, Switch, FormControlLabel } from "@mui/material";
import { useDashboardData } from "../../context/dashboardDataContext";

/* ======================================================
   CONFIG
   ====================================================== */

// ✅ Toggle demo mode here (or later via state/UI)
const DEFAULT_DEMO_MODE = true;

/* ======================================================
   HELPERS
   ====================================================== */

/**
 * ✅ Generate last 10 days with real data or zeroes
 */
const getLast10DaysWithDefaults = (dailyVitals) => {
  const result = [];
  const today = new Date();

  const vitalsMap = {};
  dailyVitals.forEach((d) => {
    vitalsMap[d.date] = d;
  });

  for (let i = 9; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    const dateKey = d.toISOString().split("T")[0];

    if (vitalsMap[dateKey]) {
      result.push({
        date: dateKey,
        Stressed: vitalsMap[dateKey].stressedCount || 0,
        "Not Stressed": vitalsMap[dateKey].notStressedCount || 0,
        __demo: false,
      });
    } else {
      result.push({
        date: dateKey,
        Stressed: 0,
        "Not Stressed": 0,
        __demo: true,
      });
    }
  }

  return result;
};

/**
 * ✅ Add realistic random demo data ONLY for empty days
 */
const addRandomDataForEmptyDays = (
  chartData,
  options = {
    minChecks: 1,
    maxChecks: 5,
    stressProbability: 0.35,
  }
) => {
  return chartData.map((day) => {
    if (day.Stressed === 0 && day["Not Stressed"] === 0) {
      const totalChecks =
        Math.floor(
          Math.random() *
            (options.maxChecks - options.minChecks + 1)
        ) + options.minChecks;

      let stressed = 0;
      let notStressed = 0;

      for (let i = 0; i < totalChecks; i++) {
        Math.random() < options.stressProbability
          ? stressed++
          : notStressed++;
      }

      return {
        ...day,
        Stressed: stressed,
        "Not Stressed": notStressed,
        __demo: true,
      };
    }

    return day;
  });
};

/* ======================================================
   COMPONENT
   ====================================================== */

const ProgressChart = () => {
  const { dailyVitals, loadingVitals } = useDashboardData();
  const [demoMode, setDemoMode] = React.useState(DEFAULT_DEMO_MODE);

  if (loadingVitals) {
    return (
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography align="center">Loading progress…</Typography>
      </Paper>
    );
  }

  // ✅ Step 1: Real + zero-filled data
  const baseChartData = getLast10DaysWithDefaults(dailyVitals);

  // ✅ Step 2: Apply demo mode if enabled
  const chartData = demoMode
    ? addRandomDataForEmptyDays(baseChartData)
    : baseChartData;

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">
          Stress vs Not Stressed (Last 10 Days)
        </Typography>

        {/* ✅ Demo Mode Toggle */}
        <FormControlLabel
          control={
            <Switch
              checked={demoMode}
              onChange={(e) => setDemoMode(e.target.checked)}
              color="primary"
            />
          }
          label="Demo Mode"
        />
      </Box>

      <Box sx={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />

            <Bar
              dataKey="Stressed"
              fill="#e53935"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="Not Stressed"
              fill="#43a047"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default ProgressChart;
