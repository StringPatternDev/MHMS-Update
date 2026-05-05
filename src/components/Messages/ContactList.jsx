import React, { useState, useEffect } from "react";
import {
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import { useUser } from "../../context/userContext";
import { useChat } from "../../context/chatContext";

const ContactList = () => {
  const [tab, setTab] = useState(0);
  const { isDoctor, contacts, currentUser, loadingContacts } = useUser();
  const { selectedUser, selectUser, getPreviousChats } = useChat();

  const [previousChatIds, setPreviousChatIds] = useState([]);
  const [chatContacts, setChatContacts] = useState([]); // already chatted
  const [otherContacts, setOtherContacts] = useState([]); // not chatted yet

  useEffect(() => {
    const fetchPrevious = async () => {
      if (!currentUser) return;
      const ids = await getPreviousChats();
      setPreviousChatIds(ids);

      // Divide contacts into chatted vs not chatted
      const chatted = contacts.filter((c) => ids.includes(c.id));
      const others = contacts.filter((c) => !ids.includes(c.id));

      setChatContacts(chatted);
      setOtherContacts(others);
    };
    fetchPrevious();
  }, [contacts, currentUser]);

  if (loadingContacts) return <p>...loading</p>;

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const renderContact = (contact) => (
    <React.Fragment key={contact.id}>
      <ListItem
        alignItems="flex-start"
        button
        selected={selectedUser?.id === contact.id}
        onClick={() => selectUser(contact)}
      >
        <ListItemAvatar>
          <Avatar alt={contact.name} src={contact.photoURL || ""} />
        </ListItemAvatar>
        <ListItemText
          primary={contact.name}
          secondary={
            <>
              <Typography component="span" variant="body2" color="textPrimary">
                {contact.email}
              </Typography>
              <br />
              <Typography component="span" variant="body2" color="textSecondary">
                {contact.phoneNumber ? "+91 " + contact.phoneNumber : ""}
              </Typography>
            </>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
    </React.Fragment>
  );

  return (
    <Box sx={{ height: "75vh", flexGrow: 1, overflow: "auto", p: 2 }}>
      {/* Tabs */}
      {!isDoctor && (
        <Tabs value={tab} onChange={handleTabChange} variant="fullWidth">
          <Tab label="Chats" />
          <Tab label="Doctors" />
        </Tabs>
      )}

      <List>
        {/* Doctors only see chats */}
        {isDoctor &&
          chatContacts.map((contact) => renderContact(contact))}

        {/* Users see 2 tabs */}
        {!isDoctor && tab === 0 &&
          chatContacts.map((contact) => renderContact(contact))}

        {!isDoctor && tab === 1 &&
          otherContacts.map((contact) => renderContact(contact))}
      </List>
    </Box>
  );
};

export default ContactList;
