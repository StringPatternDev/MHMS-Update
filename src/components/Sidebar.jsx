import React from 'react';
import {
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  Typography,
  ListItemButton,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MessageIcon from '@mui/icons-material/Message';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ArticleIcon from '@mui/icons-material/Article';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/userContext';

const Sidebar = () => {
  const { loggedIn } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const activeStyle = {
    color: 'text.secondary', // inactive = gray
    '&.Mui-selected': {
      backgroundColor: '#1976d2',
      color: '#fff', // active = white
    },
    '&.Mui-selected:hover': {
      backgroundColor: '#1565c0',
    },
    '& .MuiListItemIcon-root': {
      color: 'inherit', // icons follow text
    },
  };

  // ✅ items when logged in
  const loggedInItems = [
    { label: 'Home', path: '/', icon: <HomeIcon /> },
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { label: 'Messages', path: '/messages', icon: <MessageIcon /> },
    { label: 'Articles', path: '/articles', icon: <ArticleIcon /> },
    // { label: 'Introduction', path: '/introduction', icon: <InfoIcon /> },
    { label: 'Logout', path: '/logout', icon: <ExitToAppIcon /> },
  ];

  // ✅ items when not logged in
  const loggedOutItems = [
    { label: 'Home', path: '/', icon: <HomeIcon /> },
    { label: 'Articles', path: '/articles', icon: <ArticleIcon /> },
    // { label: 'Introduction', path: '/introduction', icon: <InfoIcon /> },
    { label: 'Login', path: '/login', icon: <LockOpenIcon /> },
    { label: 'Signup', path: '/signup', icon: <PersonAddIcon /> },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
      }}
    >
      <Typography variant="h6" sx={{ p: 2 }}>
        Mind Care
      </Typography>
      <List>
        {(loggedIn ? loggedInItems : loggedOutItems).map(({ label, path, icon }) => (
          <ListItemButton
            key={path}
            onClick={() => navigate(path)}
            selected={isActive(path)}
            sx={activeStyle}
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
