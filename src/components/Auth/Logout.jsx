// src/components/Logout.js
import React from 'react';
import { Button } from '@mui/material';
import { useNavigate} from 'react-router-dom';
import { useAuth } from '../../context/authContext';

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      // Sign out the user from Firebase
      await logout();

      // Redirect to the login page or home page
      navigate('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  }
  handleLogout();
};

export default Logout;
