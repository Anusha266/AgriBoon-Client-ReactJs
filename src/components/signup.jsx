import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const URL = `${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_SIGNUP_API}`;

const Signup = () => {
  const [formData, setFormData] = useState({
    name: 'Anusha',
    email: 'A@gmail.com',
    password: 'anusha',
    phone: '9642219524',
  });
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSnackbarMessage('');
    setSnackbarSeverity('success');
    setOpenSnackbar(false);

    try {
      const resp = await axios.post(URL, formData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      
      if (resp.status === 201) {
        localStorage.setItem('token', resp.data.token);
        setSnackbarMessage('Signup successful!');
        setSnackbarSeverity('success');
        navigate('/profile/create'); // Redirect to profile setup page
      }
    } catch (err) {
      
      const errorMessage = err.response?.data?.message || 'An error occurred.';
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
    } finally { 
      setLoading(false);
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  return (
    <>
      <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: '80vh', backgroundColor: '#9fc79d' }}>
        <Grid item xs={11} sm={8} md={6} lg={5}>
          <Paper elevation={4} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h5" align="center" sx={{ mb: 2 }}>
              Signup
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                  >
                    {loading ? 'Signing up...' : 'Signup'}
                  </Button>
                </Grid>
              </Grid>
            </form>
            <Typography align="center" sx={{ mt: 2 }}>
              Already registered?{' '}
              <Button variant="text" color="primary" onClick={() => navigate('/login')}>
                Login
              </Button>
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Signup;
