import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Box, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // React Router for navigation

const URL = `${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_LOGIN_API}`; // Replace with your actual login API URL

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // success or error
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Initialize navigate function

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true before starting the API call
    setSnackbarMessage('');
    setSnackbarSeverity('success');

    try {
      // Make the API call to log the user in
      const response = await axios.post(URL, { email, password });

      if (response.status === 200) {
        setSnackbarMessage('Login successful');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        console.log('Login successful', response?.data);

        // Store the token in localStorage for authentication
        localStorage.setItem('token', response?.data?.token);

        // Navigate to the home page or another private route
        navigate('/');
      }
      
    } catch (err) {
      console.log("login error:",err)
      if (err.response) {
        // Handle known API errors (e.g., validation errors)
        const errorMessage = err.response.data.message || 'Login failed. Please try again.';
        setSnackbarMessage(errorMessage);
        setSnackbarSeverity('error');
      } else {
        // Handle network errors or unknown issues
        setSnackbarMessage('An error occurred. Please try again later.');
        setSnackbarSeverity('error');
      }
    } finally {
      setLoading(false); // Reset loading state
      setOpenSnackbar(true); // Show the snackbar
    }
  };

  // Close the snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Box sx={{ p: 4, backgroundColor: 'white', borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Email field */}
            <Grid item xs={12}>
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Grid>

            {/* Password field */}
            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Grid>

            {/* Submit button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading} // Disable button while loading
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </Grid>
          </Grid>
        </form>

        {/* "Not Registered Yet?" text and "Sign Up" button */}
        <Grid container justifyContent="center" sx={{ mt: 2 }}>
          <Grid item>
            <Typography variant="body2" align="center">
              Not registered yet?{' '}
              <Button
                variant="text"
                color="primary"
                onClick={() => navigate('/signup')} // Navigate to signup page
              >
                Sign Up
              </Button>
            </Typography>
          </Grid>
        </Grid>

        {/* Snackbar for success or error messages */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default Login;
