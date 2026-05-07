import {
  Grid,
  Paper,
  Typography,
  Avatar,
  Button,
  Box
} from "@mui/material";
import MessageIcon from "@mui/icons-material/Message";
import { useUser } from "../../context/userContext";
import { useChat } from "../../context/chatContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DoctorPatientGrid = () => {
  const { contacts, loadingContacts, currentUser } = useUser();
  const { getPreviousChats } = useChat();
  const navigate = useNavigate();

  const [chatPatients, setChatPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const filterChattedPatients = async () => {
      if (!currentUser) return;

      const chatIds = await getPreviousChats(); // ✅ SAME logic as ContactList

      const filtered = contacts.filter((p) =>
        chatIds.includes(p.id)
      );

      setChatPatients(filtered);
      setLoading(false);
    };

    filterChattedPatients();
  }, [contacts, currentUser]);

  if (loadingContacts || loading) {
    return (
      <Typography align="center">
        Loading patients...
      </Typography>
    );
  }

  if (!chatPatients.length) {
    return (
      <>
        <Typography
          variant="h5"
          align="center"
          fontWeight={600}
          sx={{ mb: 2 }}
        >
          Your Patients
        </Typography>

        <Typography align="center">
          No patients have chatted with you yet.
        </Typography>
      </>
    );
  }

  return (
    <>
      {/* ✅ Centered Heading */}
      <Typography
        variant="h5"
        align="center"
        fontWeight={600}
        sx={{ mb: 3 }}
      >
        Your Patients
      </Typography>

      <Grid container spacing={3}>
        {chatPatients.map((patient) => (
          <Grid item xs={12} md={6} key={patient.id}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Box display="flex" alignItems="center">
                <Avatar
                  src="/default-profile-pic.png"
                  sx={{ width: 56, height: 56, mr: 2 }}
                />
                <Box flexGrow={1}>
                  <Typography variant="h6">
                    {patient.name || "Unnamed Patient"}
                  </Typography>
                  <Typography>Email: {patient.email}</Typography>
                  <Typography>
                    Phone: {patient.phoneNumber || "N/A"}
                  </Typography>
                </Box>
              </Box>

              <Box mt={2} textAlign="right">
                <Button
                  variant="contained"
                  startIcon={<MessageIcon />}
                  onClick={() =>
                    navigate("/messages", {
                      state: { userId: patient.id }
                    })
                  }
                >
                  Message
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default DoctorPatientGrid;