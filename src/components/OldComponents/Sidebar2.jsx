import React from 'react';
import { List, ListItemIcon, ListItemText, Drawer, Toolbar, Divider, ListItemButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ArticleIcon from '@mui/icons-material/Article';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const drawerWidth = 240;

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar />
      <Divider />
      <List>
        <ListItemButton onClick={() => navigate('/')}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate('/login')}>
          <ListItemIcon>
            <LockOpenIcon />
          </ListItemIcon>
          <ListItemText primary="Login" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate('/signup')}>
          <ListItemIcon>
            <PersonAddIcon />
          </ListItemIcon>
          <ListItemText primary="Signup" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate('/logout')}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate('/articles')}>
          <ListItemIcon>
            <ArticleIcon />
          </ListItemIcon>
          <ListItemText primary="Articles" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate('/introduction')}>
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText primary="Introduction" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;
