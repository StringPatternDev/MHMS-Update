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
import { useNavigate } from "react-router-dom";

const DoctorPatientGrid = () => {
  const { contacts, loadingContacts } = useUser();
  const navigate = useNavigate();

  if (loadingContacts) return <Typography>Loading patients...</Typography>;

  if (!contacts.length) {
    return (
      <>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Your Patients
        </Typography>
        <Typography>No patients have contacted you yet.</Typography>
      </>
    );
  }

  return (
    <>
      {/* ✅ Heading */}
      <Typography
        variant="h5"
        fontWeight={600}
        sx={{ mb: 3 }}
      >
        Your Patients
      </Typography>

      <Grid container spacing={3}>
        {contacts.map((patient) => (
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
                  <Typography>Phone: {patient.phoneNumber}</Typography>
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