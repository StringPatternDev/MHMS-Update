import React from 'react';
import { Box, Typography, Button, Container, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 8}}>
      <Box textAlign="center">
        <Typography variant="h2" gutterBottom>
          Welcome to Our Mental Health Management App
        </Typography>
        <Typography variant="h5" gutterBottom>
          Your journey to better mental health starts here.
        </Typography>
        <Typography variant="body1" gutterBottom>
          Explore our features, track your progress, and connect with mental health professionals.
        </Typography>
        <Grid container spacing={2} justifyContent="center" sx={{ mt: 4 }}>
          <Grid item>
            <Button variant="contained" color="primary" onClick={() => navigate('/dashboard')}>
              Dashboard
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="secondary" onClick={() => navigate('/messages')}>
              Messages
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={() => navigate('/articles')}>
              Articles
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;
