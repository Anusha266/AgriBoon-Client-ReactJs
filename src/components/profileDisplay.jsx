import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Avatar, Paper, Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfileDisplay = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate=useNavigate()
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const url = `${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_GET_CURRENT_USER}`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            "Content-Type": "application/json",
          },
        });
        console.log("current user is::",response?.data)
        setUserData(response?.data?.data);  // Assuming response contains user data
        setLoading(false);
      } catch (err) {
        console.log("error while fetching profile data",err);
        setErrorMessage('Failed to fetch profile data.');
        setLoading(false);
        setOpenSnackbar(true);
      }
    };

    fetchUserData();
  }, []);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (errorMessage) {
    return (
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '80vh', backgroundColor: '#f0f0f0' }}>
      <Grid container justifyContent="center" sx={{ padding: 3 }}>
        <Grid item xs={12} sm={8} md={6} lg={5}>
          <Paper elevation={4} sx={{ padding: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 3 }}>
              <Avatar
                alt="N/A"
                src={userData?.profilePic || null} 
                sx={{ width: 120, height: 120 }}
              />
            </Box>
            <Typography variant="h5" align="center" gutterBottom>
              {userData?.name || 'User Name'}
            </Typography>

            <Typography variant="body1" sx={{ marginBottom: 1 }}>
              <strong>Email:</strong> {userData?.email || 'Not available'}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 1 }}>
              <strong>Phone:</strong> {userData?.phone || 'Not available'}
            </Typography>

            {/* Add other fields if available */}
            <Typography variant="body1" sx={{ marginBottom: 1 }}>
              <strong>State:</strong> {userData?.state || 'Not available'}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 1 }}>
              <strong>Mandal:</strong> {userData?.mandal || 'Not available'}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 1 }}>
              <strong>District:</strong> {userData?.district || 'Not available'}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 1 }}>
              <strong>Village:</strong> {userData?.village || 'Not available'}
            </Typography>

            <Box sx={{ textAlign: 'center', marginTop: 3 }}>
              <Button variant="contained" color="primary" onClick={() => { navigate('/profile/create') }}>
                Edit Profile
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfileDisplay;
