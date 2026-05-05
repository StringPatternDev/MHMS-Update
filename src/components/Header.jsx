import React from 'react';
import { AppBar, Toolbar, Typography, Box, Avatar } from '@mui/material';

const Header = () => {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Mental Health Management
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt="Project" src="/path/to/avatar.jpg" sx={{ mr: 2 }} />
          <Typography>Idea Lab Project</Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
