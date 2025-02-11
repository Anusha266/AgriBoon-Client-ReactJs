import React, { useState } from 'react';
import {
  Box,
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
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import ChatIcon from '@mui/icons-material/Chat';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const NegotiationPage = () => {
  const { transactionId } = useParams();
  const location=useLocation()
  const {transaction}=location.state;

  console.log('Entered into negotiation page: transId', transactionId);

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
      navigate(`/otp/${transactionId}`,{
        state:{
          transaction
        }
      });
    } catch (err) {
      console.log('Error in updating OTP status', err);
    }
  };

  const handleCancelTransaction = async () => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_UPDATE_PRODUCT_BY_ID}${transaction?.product._id}`,
        { status: 'failed' }
      );
      console.log('Response in updating transaction to failed', response.data);

      setSnackbarMessage('Your transaction has moved to the failed stage.');
      setSnackbarSeverity('info');
      setSnackbarOpen(true);
      navigate('/transactions');
    } catch (err) {
      console.log('Error in updating transaction to failed', err);

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
        padding: 4,
        borderRadius: 2,
        backgroundColor: '#f5f5f5',
        maxWidth: 600,
        margin: 'auto',
        marginTop: 5,
        boxShadow: 3,
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Negotiation Page
      </Typography>

      {/* Icons Section */}
      <Grid container spacing={4} justifyContent="center" sx={{ marginTop: 2 }}>
        <Grid item>
          <Box
            sx={{
              backgroundColor: '#e3f2fd',
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
            <IconButton color="primary" aria-label="Call">
              <PhoneIcon fontSize="large" />
            </IconButton>
          </Box>
          <Typography align="center" sx={{ marginTop: 1 }}>
            Call
          </Typography>
        </Grid>
        <Grid item>
          <Box
            sx={{
              backgroundColor: '#e8f5e9',
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
            <IconButton color="success" aria-label="Chat">
              <ChatIcon fontSize="large" />
            </IconButton>
          </Box>
          <Typography align="center" sx={{ marginTop: 1 }}>
            Chat
          </Typography>
        </Grid>
        <Grid item>
          <Box
            sx={{
              backgroundColor: '#fbe9e7',
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
            <IconButton color="error" aria-label="Video Call">
              <VideoCallIcon fontSize="large" />
            </IconButton>
          </Box>
          <Typography align="center" sx={{ marginTop: 1 }}>
            Video Call
          </Typography>
        </Grid>
      </Grid>

      {/* Terms and Conditions */}
      <Typography variant="h6" gutterBottom sx={{ marginTop: 4 }}>
        Terms and Conditions
      </Typography>
      <Typography variant="body2" sx={{ marginBottom: 2 }}>
        Please complete the negotiation process via chat, video call, or phone call before proceeding to payment.
      </Typography>
      <Box sx={{ marginBottom: 2 }}>
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
          onClick={() => setOpenDialog(true)}
        >
          I Don't Want This Product
        </Button>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Cancel Transaction</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this transaction? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCancelTransaction} color="error">
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NegotiationPage;
