import React from 'react'
import Dashboard from './Dashboard2';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';

const Test = () => {
   return (
      <Router>
         <Box >
            <Routes>
               <Route path="/test" element={<Dashboard />} />
            </Routes>
         </Box>
      </Router>
   )
}

export default Test;