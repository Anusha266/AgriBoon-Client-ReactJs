import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Grid,
  IconButton,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  Box,
  Container,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import ChatIcon from '@mui/icons-material/Chat';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const NegotiationPage = () => {
  const { transactionId } = useParams();
  const location = useLocation();
  const { transaction } = location.state || {};

  console.log('Entered into negotiation page: transactionId', transactionId);

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  const navigate = useNavigate();

  const handleAcceptTerms = () => {
    setAcceptedTerms((prev) => !prev);
  };

  const handleProceedToPayment = async () => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_UPDATE_TRANSACTION}${transactionId}`,
        { isOTP_active: true }
      );
      console.log('Response in updating OTP status', response.data);
      navigate(`/otp/${transactionId}`, { state: { transaction } });
    } catch (err) {
      console.error('Error in updating OTP status', err);
      setSnackbarMessage('Failed to update OTP status. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleCancelTransaction = async () => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_UPDATE_PRODUCT_BY_ID}${transaction?.product?._id}`,
        { status: 'failed' }
      );
      console.log('Response in updating transaction to failed', response.data);

      setSnackbarMessage('Your transaction has moved to the failed stage.');
      setSnackbarSeverity('info');
      setSnackbarOpen(true);
      navigate('/transactions');
    } catch (err) {
      console.error('Error in updating transaction to failed', err);
      setSnackbarMessage('Failed to cancel the transaction. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setOpenDialog(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    
    <Box
      sx={{
        minHeight: '100vh', // Full page height
        backgroundColor: '#f5f5f5', // Background same as Terms & Conditions
      }}
    >
       <AppBar position="static" sx={{ backgroundColor: '#00796b' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/transactions')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
             Negotiation
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content Box */}
      <Container
        sx={{
          padding: 4,
          borderRadius: 2,
          backgroundColor: '#fff',
          maxWidth: 600,
          margin: 'auto',
          marginTop: 5,
          boxShadow: 3,
        }}
      >
        {/* Communication Options */}
        <Grid container spacing={4} justifyContent="center" sx={{ marginTop: 2 }}>
          {[
            { label: 'Call', color: '#e3f2fd', icon: <PhoneIcon fontSize="large" />, aria: 'Call' },
            { label: 'Chat', color: '#e8f5e9', icon: <ChatIcon fontSize="large" />, aria: 'Chat' },
            { label: 'Video Call', color: '#fbe9e7', icon: <VideoCallIcon fontSize="large" />, aria: 'Video Call' },
          ].map(({ label, color, icon, aria }, index) => (
            <Grid item key={index}>
              <Box
                sx={{
                  backgroundColor: color,
                  borderRadius: '50%',
                  width: 80,
                  height: 80,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: 2,
                  transition: '0.3s',
                  '&:hover': { transform: 'scale(1.1)' },
                }}
              >
                <IconButton color="primary" aria-label={aria}>
                  {icon}
                </IconButton>
              </Box>
              <Typography align="center" sx={{ marginTop: 1 }}>
                {label}
              </Typography>
            </Grid>
          ))}
        </Grid>

        {/* Terms and Conditions */}
        <Typography variant="h6" gutterBottom sx={{ marginTop: 4 }}>
          Terms and Conditions
        </Typography>
        <Box sx={{ marginBottom: 2, padding: 2, backgroundColor: '#fff', borderRadius: 2 }}>
          <ol>
            <li>Complete at least one form of communication: chat, video call, or phone call.</li>
            <li>Ensure all negotiation terms are mutually agreed upon before payment.</li>
            <li>Keep a record of the communication for future reference.</li>
            <li>Payment must be completed within the stipulated timeframe after negotiation.</li>
            <li>The platform holds no responsibility for disputes arising after payment.</li>
          </ol>
        </Box>

        {/* Accept Terms and Proceed Button */}
        <FormControlLabel
          control={<Checkbox checked={acceptedTerms} onChange={handleAcceptTerms} />}
          label="I agree to the terms and conditions"
        />
        <Box sx={{ marginTop: 3, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            disabled={!acceptedTerms}
            onClick={handleProceedToPayment}
          >
            Proceed to Payment
          </Button>
          <Button
            variant="outlined"
            color="error"
            fullWidth
            onClick={()=>handleCancelTransaction()}
          >
            I Don't Want This Product
          </Button>
        </Box>
      </Container>

      {/* Snackbar */}
      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NegotiationPage;
