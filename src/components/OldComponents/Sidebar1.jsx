import React from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MessageIcon from '@mui/icons-material/Message';
import HomeIcon from '@mui/icons-material/Home';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ArticleIcon from '@mui/icons-material/Article';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
// import SettingsIcon from '@mui/icons-material/Settings';
// import BarChartIcon from '@mui/icons-material/BarChart';
// import EventNoteIcon from '@mui/icons-material/EventNote';
// import PeopleIcon from '@mui/icons-material/People';

import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
      }}
    >
      <Typography variant="h6" sx={{ p: 2 }}>Mind Care</Typography>
      <List>

        <ListItem button key="Home">
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>

        <ListItem button>
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

        <ListItem button key="Articles">
          <ListItemIcon><ArticleIcon /></ListItemIcon>
          <ListItemText primary="Articles" />
        </ListItem>

        <ListItem button>
          <ListItemIcon><MessageIcon /></ListItemIcon>
          <ListItemText primary="Messages" />
        </ListItem>

        <ListItem button key="Login">
          <ListItemIcon><LockOpenIcon /></ListItemIcon>
          <ListItemText primary="Login" />
        </ListItem>

        <ListItem button key="Signup">
          <ListItemIcon><PersonAddIcon /></ListItemIcon>
          <ListItemText primary="Signup" />
        </ListItem>

        <ListItem button key="Logout">
          <ListItemIcon><ExitToAppIcon /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>

        {/* <ListItem button>
          <ListItemIcon><SettingsIcon /></ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem> */}

        {/* <ListItem button>
          <ListItemIcon><BarChartIcon /></ListItemIcon>
          <ListItemText primary="Report" />
        </ListItem> */}

        {/* <ListItem button>
          <ListItemIcon><EventNoteIcon /></ListItemIcon>
          <ListItemText primary="Appointments" />
        </ListItem> */}

        {/* <ListItem button>
          <ListItemIcon><PeopleIcon /></ListItemIcon>
          <ListItemText primary="Patients" />
        </ListItem> */}

      </List>
    </Drawer>
  );
};

export default Sidebar;
