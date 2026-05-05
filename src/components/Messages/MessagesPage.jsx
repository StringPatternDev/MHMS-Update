import React from 'react';
import { Box, Paper } from '@mui/material';
import ContactList from './ContactList';
import ChatWindow from './ChatWindow';
// import { ChatProvider } from "../../context/chatContext";

const MessagesPage = () => (
  // <ChatProvider>
    <Box sx={{ display: 'flex', height: 'calc(100vh - 115px)' }}>
      {/* Left Sidebar */}
      <Box sx={{ width: 300, borderRight: '1px solid #ddd' }}>
        <Paper sx={{ height: '100%', overflow: 'auto' }}>
          <ContactList />
        </Paper>
      </Box>

      {/* Right Chat Display */}
      <Box sx={{ flexGrow: 1 }}>
        <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <ChatWindow />
        </Paper>
      </Box>
    </Box>
  // </ChatProvider>
);

export default MessagesPage;
