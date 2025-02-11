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
  Avatar,
  IconButton,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PROFILE_API_URL = `${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_CREATE_PROFILE_API}`;

const ProfileSetup = () => {
  const [profileData, setProfileData] = useState({
    state: 'Andhra Pradesh',
    mandal: 'Tekkali',
    district: 'Srikakulam',
    village: 'Anakapalle',
    address: 'Default Address',
  });
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSnackbarMessage('');
    setSnackbarSeverity('success');
    setOpenSnackbar(false);

    const formData = new FormData();
    formData.append('state', profileData.state);
    formData.append('mandal', profileData.mandal);
    formData.append('district', profileData.district);
    formData.append('village', profileData.village);
    formData.append('address', profileData.address);
    if (profilePic) {
      formData.append('profilePic', profilePic);
    }

    try {
      const response = await axios.post(PROFILE_API_URL, formData, {
        headers: { 
            'Content-Type': 'multipart/form-data' ,
            'Authorization':`Bearer ${localStorage.getItem('token')}`
        },
        withCredentials: true,
      });
      console.log("Profile setup response",response?.data)
      if (response.status === 200) {
        setSnackbarMessage('Profile updated successfully!');
        setSnackbarSeverity('success');
        navigate('/'); // Redirect to home or dashboard
      }
    } catch (err) {
        console.log("error in profile setup",err);
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
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: '80vh', backgroundColor: '#e6f7f5' }}
    >
      <Grid item xs={11} sm={8} md={6} lg={5}>
        <Paper elevation={4} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h5" align="center" sx={{ mb: 2 }}>
            Profile Setup
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Profile Picture */}
              <Grid item xs={12} align="center">
                <Avatar
                  src={preview}
                  alt="Profile Preview"
                  sx={{ width: 100, height: 100, mb: 2 }}
                />
                <label htmlFor="profile-pic-upload">
                  <input
                    accept="image/*"
                    id="profile-pic-upload"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                  <IconButton color="primary" component="span">
                    <PhotoCamera />
                  </IconButton>
                </label>
              </Grid>

              {/* State */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="State"
                  name="state"
                  value={profileData.state}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>

              {/* Mandal */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Mandal"
                  name="mandal"
                  value={profileData.mandal}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>

              {/* District */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="District"
                  name="district"
                  value={profileData.district}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>

              {/* Village */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Village"
                  name="village"
                  value={profileData.village}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>

              {/* Address */}
              <Grid item xs={12}>
                <TextField
                  label="Address"
                  name="address"
                  value={profileData.address}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  fullWidth
                  required
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Profile'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default ProfileSetup;
