import { BrowserRouter as Router } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AppRoutes from './components/AppRoutes';
// import { seedDoctorsOnce } from './seedDoctors.js';
// import { useEffect } from "react";

const App = () => {

// useEffect(() => {
//   seedDoctorsOnce();
// }, []);


  return (
      <Router>
        <Box sx={{ display: 'flex' }}>
          <Header />
          <Sidebar loggedIn />
          <Box component="main" sx={{ flexGrow: 1, p: 2, mt: 8}}>
            <AppRoutes />
          </Box>
        </Box>
      </Router>
  );
};

export default App;
