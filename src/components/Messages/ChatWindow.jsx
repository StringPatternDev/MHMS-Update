import React, { useState, useRef, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useChat } from "../../context/chatContext";
import MessageItem from "./MessageItem";
import MessageInput from "./MessageInput";

const ChatContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  padding: "14px",
  height: "60vh",
  flexGrow: 1,
  overflow: "auto",
});

const ChatWindow = () => {
  const { selectedUser, messages } = useChat();
  const messagesEndRef = useRef(null);

  // Auto-scroll when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedUser) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="70vh"
      >
        <Typography variant="h6" color="textSecondary">
          Select a contact to start chatting
        </Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <ChatContainer>
        {messages.map((message) => (<MessageItem message={message} />))}
        <div ref={messagesEndRef} />
      </ChatContainer>
      <MessageInput />
    </Box>
  );
};


export default ChatWindow;
