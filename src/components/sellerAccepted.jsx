import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Snackbar,
  SnackbarContent,
  Alert
} from '@mui/material';
import { CheckCircle, HourglassEmpty } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const SellerAcceptedPage = () => {
  const location = useLocation(); // React Router hook for getting state passed from another component
  const transactionDetails = location.state; // Transaction details passed from previous page

  const [isCompleted, setIsCompleted] = useState(transactionDetails?.isCompleted || false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [otp, setOtp] = useState(''); // State to store the OTP
  const [otpGenerated, setOtpGenerated] = useState(false);
  const [isOTPActive, setIsOTPActive] = useState(transactionDetails?.isOTP_active || false);
  const [otpSent, setOtpSent] = useState(false); // State to track if OTP is sent
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error'); // "success" or "error"

  const navigate = useNavigate(); // React Router hook to navigate programmatically

  useEffect(() => {
    if (!transactionDetails) {
      setError('Transaction details are not found.');
    }
  }, [transactionDetails]);

  const generateOTP = () => {
    const otp = Math.floor(1000 + Math.random() * 9000); // Generate a 6-digit random OTP
    setOtp(otp);
    setOtpGenerated(true);
    return otp;
  };

  const sendOTPToBackend = async () => {
    setLoading(true);
    try {
      const generatedOtp = generateOTP();
      console.log('Generated OTP:', generatedOtp);

      // Send OTP to backend
      const response = await axios.patch(
        `${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_UPDATE_TRANSACTION}${transactionDetails._id}`,
        { sellerOTP: generatedOtp }
      );
      console.log('OTP sent to backend:', response.data);

      // Update state to reflect successful OTP send
      setOtpSent(true);
      setSnackbarMessage('OTP sent successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (err) {
      console.error('Error sending OTP to backend:', err);
      setSnackbarMessage('Failed to send OTP.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_GET_TRANSACTION_BY_ID}${transactionDetails._id}`
      );
      console.log('Payment status response:', response.data);

      if (response?.data?.data?.isCompleted) {
        setIsCompleted(true);
        setSnackbarMessage('Payment completed successfully!');
        setSnackbarSeverity('success');
      
      } else {
        setIsCompleted(false);
        setSnackbarMessage('Payment not completed yet.');
        setSnackbarSeverity('error');

      }
      setOpenSnackbar(true);
    } catch (err) {
      console.error('Error checking payment status:', err);
      setSnackbarMessage('Error checking payment status.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const checkOTPStatus = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_GET_TRANSACTION_BY_ID}${transactionDetails._id}`
      );
      console.log('OTP status response:', response.data);

      if (response?.data?.data?.isOTP_active) {
        setIsOTPActive(true);
        setSnackbarMessage('OTP is active!');
        setSnackbarSeverity('success');
      } else {
        setSnackbarMessage('Buyer has not moved to OTP stage yet.');
        setSnackbarSeverity('error');
      }
      setOpenSnackbar(true);
    } catch (err) {
      console.error('Error checking OTP status:', err);
      setSnackbarMessage('Error checking OTP status.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/'); // Navigate back to home or desired page
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Card sx={{ maxWidth: 400, margin: 'auto', padding: 2 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Seller Accepted Page
          </Typography>

          {loading ? (
            <CircularProgress />
          ) : (
            <>
              {isCompleted ? (
                <Box sx={{ textAlign: 'center' }}>
                  <CheckCircle color="success" sx={{ fontSize: 60 }} />
                  <Typography variant="h6" sx={{ marginTop: 2 }}>
                    Payment Completed Successfully!
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: 2 }}
                    onClick={handleBack}
                  >
                    OK
                  </Button>
                </Box>
              ) : (
                <>
                  {isOTPActive ? (
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ marginTop: 2 }}>
                        OTP is active. Proceed with payment status check.
                      </Typography>

                      {otpGenerated && (
                        <Typography variant="body1" sx={{ marginTop: 2 }}>
                          Generated OTP: <strong>{otp}</strong>
                        </Typography>
                      )}

                      {otpSent && (
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ marginTop: 2 }}
                          onClick={checkPaymentStatus}
                        >
                          Check Payment Status
                        </Button>
                      )}

                      <Button
                        variant="contained"
                        color="secondary"
                        sx={{ marginTop: 2 }}
                        onClick={sendOTPToBackend}
                        disabled={otpSent} // Disable once OTP is sent
                      >
                        Generate OTP
                      </Button>
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: 'center' }}>
                      <HourglassEmpty sx={{ fontSize: 60 }} />
                      <Typography variant="h6" sx={{ marginTop: 2 }}>
                        Waiting for Payment to be Completed...
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ marginTop: 2 }}
                        onClick={checkOTPStatus}
                      >
                        Check OTP Status
                      </Button>
                    </Box>
                  )}
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <SnackbarContent
          message={snackbarMessage}
          sx={{
            backgroundColor: snackbarSeverity === 'error' ? 'red' : 'green',
            color: 'white',
          }}
        />
      </Snackbar>
    </Box>
  );
};

export default SellerAcceptedPage;
