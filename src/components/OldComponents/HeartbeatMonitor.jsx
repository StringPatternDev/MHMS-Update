import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000'); // Adjust the URL if necessary

function HeartbeatMonitor() {
  const [data, setData] = useState({ rr_interval: 0, heart_beat: 0 });
  const [collecting, setCollecting] = useState(false);
  const [summary, setSummary] = useState({ average_rr_interval: 0, average_heart_beat: 0 });

  useEffect(() => {
    socket.on('new_data', (newData) => {
      setData(newData);
    });

    socket.on('data_summary', (summaryData) => {
      setSummary(summaryData);
      setCollecting(false);
    });

    return () => {
      socket.off('new_data');
      socket.off('data_summary');
    };
  }, []);

  const startCollection = async () => {
    try {
      const response = await axios.post('http://localhost:5000/start-collection');
      if (response.data.status === 'started') {
        setCollecting(true);
      } else if (response.data.status === 'already_running') {
        alert('Data collection is already running.');
      }
    } catch (error) {
      console.error('Error starting data collection:', error);
    }
  };

  return (
    <div className="App">
      <h1>Real-Time Heart Rate Monitor</h1>
      <button onClick={startCollection} disabled={collecting}>
        {collecting ? 'Collecting Data...' : 'Start Data Collection'}
      </button>
      <p>RR Interval: {data.rr_interval}</p>
      <p>Heart Beat: {data.heart_beat.toFixed(2)}</p>
      {!collecting && summary.average_rr_interval !== 0 && (
        <div>
          <h2>Summary</h2>
          <p>Average RR Interval: {summary.average_rr_interval.toFixed(2)}</p>
          <p>Average Heart Beat: {summary.average_heart_beat.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}

export default HeartbeatMonitor;
