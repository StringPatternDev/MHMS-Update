import {
  Grid,
  Paper,
  Typography,
  Avatar,
  Button,
  Box
} from "@mui/material";
import MessageIcon from "@mui/icons-material/Message";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import { useUser } from "../../context/userContext";
import { useChat } from "../../context/chatContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgressChartDialog from "./ProgressChartDialog";
import { useDashboardData } from "../../context/dashboardDataContext";

const PaitentGrid = () => {
  const { contacts, currentUser } = useUser();
  const { getPreviousChats } = useChat();
  const navigate = useNavigate();
  const { loadVitalsForUser } = useDashboardData();

  const [chatPatients, setChatPatients] = useState([]);
  const [chartOpen, setChartOpen] = useState(false);

  useEffect(() => {
    const loadPatients = async () => {
      if (!currentUser) return;

      const ids = await getPreviousChats();
      setChatPatients(contacts.filter(p => ids.includes(p.id)));
    };

    loadPatients();
  }, [contacts, currentUser]);

  if (!chatPatients.length) {
    return (
      <Typography align="center">
        No patients have contacted you yet.
      </Typography>
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
                <Avatar sx={{ mr: 2 }}>
                  {patient.name?.[0]}
                </Avatar>

                <Box flexGrow={1}>
                  <Typography variant="h6">
                    {patient.name}
                  </Typography>
                  <Typography>{patient.email}</Typography>
                  <Typography>
                    {patient.phoneNumber || "N/A"}
                  </Typography>
                </Box>
              </Box>

              {/* ✅ Buttons */}
              <Box
                mt={2}
                display="flex"
                justifyContent="flex-end"
                gap={2}
              >
                <Button
                  variant="outlined"
                  startIcon={<ShowChartIcon />}
                  onClick={() => {
                    loadVitalsForUser(patient.id);
                    setChartOpen(true);
                  }}
                >
                  Progress
                </Button>

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

      {/* ✅ Chart Dialog */}
      <ProgressChartDialog
        open={chartOpen}
        onClose={() => setChartOpen(false)}
      />
    </>
  );
};

export default PaitentGrid;