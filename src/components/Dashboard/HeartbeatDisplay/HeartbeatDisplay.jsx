import React, { useState, useEffect, useRef } from 'react';
import { Paper, Typography, Box, Checkbox, FormControlLabel } from '@mui/material';
import HeartbeatMeter from './HeartbeatMeter';
import Button from '@mui/joy/Button';
import LinearProgress from '@mui/joy/LinearProgress';
import axios from 'axios';
import io from 'socket.io-client';

const HeartbeatDisplay = () => {
  const [data, setData] = useState({ rr_interval: 0, heart_beat: 0 });
  const [collecting, setCollecting] = useState(false);
  const [summary, setSummary] = useState({ prediction: 0, heartRate: 0 });
  // const [isTesting, setIsTesting] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  const [randomIntervals, setRandomIntervals] = useState([]);
  const socketRef = useRef(null);

  // Generate random rr_interval values
  const generateRandomData = () => {
    let intervalCount = 0;
    const intervals = [];
    const intervalId = setInterval(() => {
      const randomRR = Math.floor(Math.random() * (1200 - 600 + 1)) + 600; // Random rr_interval between 600ms to 1200ms
      intervals.push(randomRR);
      setData({ rr_interval: randomRR, heart_beat: 0 });
      intervalCount++;

      if (intervalCount >= 20) { // Stop after 20 seconds
        clearInterval(intervalId);
        const averageRR = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const averageBPM = Math.round(60000 / averageRR);
        setSummary({ prediction: 1, heartRate: averageBPM }); // Not Stressed
        setCollecting(false);
      }
    }, 1000);
  };

  const startCollection = async () => {
  if (isTesting) {
    // Testing mode — generate random data locally
    setSummary({ prediction: 0, heartRate: 0 });
    setCollecting(true);
    generateRandomData();
  } else {
    // Disconnect any existing socket before creating a new one
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    setSummary({ prediction: 0, heartRate: 0 });

    // Create socket connection
    socketRef.current = io('http://localhost:5000');

    // Wait for connection FIRST, then call API
    socketRef.current.on('connect', async () => {
      console.log('✅ Socket connected:', socketRef.current.id);

      try {
        const response = await axios.post('http://localhost:5000/start-collection');

        if (response.data.status === 'started') {
          setCollecting(true);
        } else if (response.data.status === 'already_running') {
          alert('Data collection is already running.');
          socketRef.current.disconnect();
        }
      } catch (error) {
        console.error('Error calling API:', error);
        socketRef.current.disconnect();
      }
    });

    // Listen for live data
    socketRef.current.on('new_data', (newData) => {
      console.log('📡 new_data received:', newData);
      setData(newData);
    });

    // Listen for final summary
    socketRef.current.on('data_summary', (summaryData) => {
      console.log('📊 summary received:', summaryData);
      setSummary(summaryData);
      setCollecting(false);
      socketRef.current.disconnect(); // Clean up after done
    });

    // Handle errors
    socketRef.current.on('connect_error', (err) => {
      console.error('🔴 Connection error:', err.message);
      alert('Could not connect to server. Make sure Flask is running.');
      setCollecting(false);
    });

    socketRef.current.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });
  }
};
// gpt       ------------------------------------------------------------------gpt

//   const startCollection = async () => {
//   if (isTesting) {
//     // ✅ Keep your testing code SAME
//     setSummary({ prediction: 0, heartRate: 0 });
//     setCollecting(true);
//     generateRandomData();

//   } else {
//     try {
//       // ✅ 1. Connect socket FIRST
//       socketRef.current = io('http://localhost:5000', {
//         transports: ['websocket'] // 🔥 important fix
//       });

//       socketRef.current.on('connect', () => {
//         console.log('✅ Connected to socket');
//       });

//       // 🔥 Debug (optional but recommended)
//       socketRef.current.onAny((event, ...args) => {
//         console.log("EVENT:", event, args);
//       });

//       socketRef.current.on('new_data', (newData) => {
//         console.log('NEW DATA:', newData);
//         setData(newData);
//       });

//       socketRef.current.on('data_summary', (summaryData) => {
//         console.log('SUMMARY:', summaryData);
//         setSummary(summaryData);
//         setCollecting(false);
//       });

//       // ✅ 2. THEN call backend API
//       const response = await axios.post('http://localhost:5000/start-collection');

//       console.log(response);

//       if (response.data.status === 'started') {
//         setSummary({ prediction: 0, heartRate: 0 });
//         setCollecting(true);
//       } else if (response.data.status === 'already_running') {
//         alert('Data collection is already running.');
//       }

//     } catch (error) {
//       console.error('❌ Error:', error);
//     }
//   }
// };
/*
  const startCollection = async () => {
    if (isTesting) {
      // If in testing mode, generate random data instead of calling the API
      setSummary({ prediction: 0, heartRate: 0 });
      setCollecting(true);
      generateRandomData();
    } else {
      // Otherwise, call the API
      try {
        const response = await axios.post('http://localhost:5000/start-collection');
        console.log(response)
        if (response.data.status === 'started') {
          setSummary({ prediction: 0, heartRate: 0 });
          setCollecting(true);

          socketRef.current = io('http://localhost:5000');

          socketRef.current.on('new_data', (newData) => {
            console.log(newData);
            setData(newData);
          });

          socketRef.current.on('data_summary', (summaryData) => {
            setSummary(summaryData);
            console.log('summary data : ', summaryData);
            setCollecting(false);
          });

        } else if (response.data.status === 'already_running') {
          alert('Data collection is already running.');
        }
      } catch (error) {
        console.error('Error starting data collection:', error);
      }
    }
  };
*/
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 2, flexGrow: 1 }}>
      <Typography variant="h6">Self Control</Typography>
      <HeartbeatMeter bpm={data.rr_interval} />
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" sx={{ width: '35%', mr: 1 }}>Heart Rate</Typography>
        {
          summary.prediction ? (
            <Typography variant="body2" sx={{ ml: 10 }}>{Math.round(summary.heartRate)} bpm</Typography>
          ) : (
            <LinearProgress variant="determinate" value={60} sx={{ width: '65%' }} />
          )
        }
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" sx={{ width: '35%', mr: 1 }}>Stress</Typography>
        {
          summary.prediction ? (
            <Typography variant="body2" sx={{ ml: 10 }}>{summary.prediction !== 1 ? 'Stressed' : 'Not Stressed'}</Typography>
          ) : (
            <LinearProgress variant="determinate" value={30} sx={{ width: '65%' }} />
          )
        }
      </Box>
      <Box textAlign='center'>
        <Box> 
          <Button onClick={startCollection} disabled={collecting}>
            {collecting ? 'Collecting Data...' : 'Start Data Collection'}
          </Button>
        </Box>
        {/* <FormControlLabel
          control={
            <Checkbox
              checked={isTesting}
              onChange={(e) => setIsTesting(e.target.checked)}
            />
          }
          label="Testing"
          sx={{ fontSize : '1rem' }}
        /> */}
      </Box>
    </Paper>
  );
}

export default HeartbeatDisplay;
