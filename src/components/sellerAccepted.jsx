import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Snackbar,
  AppBar,
  Toolbar,
  IconButton,
  SnackbarContent,
  Alert
} from '@mui/material';
import { CheckCircle, HourglassEmpty, ArrowBack } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import TopNavbar from './topNavbar';

const SellerAcceptedPage = () => {
  const location = useLocation();
  const transactionDetails = location.state;
  const navigate = useNavigate();

  const [isCompleted, setIsCompleted] = useState(transactionDetails?.isCompleted || false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpGenerated, setOtpGenerated] = useState(false);
  const [isOTPActive, setIsOTPActive] = useState(transactionDetails?.isOTP_active || false);
  const [otpSent, setOtpSent] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');

  useEffect(() => {
    if (!transactionDetails) {
      setSnackbarMessage('Transaction details not found.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  }, [transactionDetails]);

  const generateOTP = () => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    setOtp(otp);
    setOtpGenerated(true);
    return otp;
  };

  const sendOTPToBackend = async () => {
    setLoading(true);
    try {
      const generatedOtp = generateOTP();
      console.log('Generated OTP:', generatedOtp);

      const response = await axios.patch(
        `${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_UPDATE_TRANSACTION}${transactionDetails._id}`,
        { sellerOTP: generatedOtp }
      );
      console.log('OTP sent to backend:', response.data);

      setOtpSent(true);
      setSnackbarMessage('OTP sent successfully!');
      setSnackbarSeverity('success');
    } catch (err) {
      console.error('Error sending OTP:', err);
      setSnackbarMessage('Failed to send OTP.');
      setSnackbarSeverity('error');
    } finally {
      setOpenSnackbar(true);
      setLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_GET_TRANSACTION_BY_ID}${transactionDetails._id}`
      );

      if (response?.data?.data?.isCompleted) {
        setIsCompleted(true);
        setSnackbarMessage('Payment completed successfully!');
        setSnackbarSeverity('success');
      } else {
        setIsCompleted(false);
        setSnackbarMessage('Payment not completed yet.');
        setSnackbarSeverity('error');
      }
    } catch (err) {
      console.error('Error checking payment status:', err);
      setSnackbarMessage('Error checking payment status.');
      setSnackbarSeverity('error');
    } finally {
      setOpenSnackbar(true);
      setLoading(false);
    }
  };

  const checkOTPStatus = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_GET_TRANSACTION_BY_ID}${transactionDetails._id}`
      );

      if (response?.data?.data?.isOTP_active) {
        setIsOTPActive(true);
        setSnackbarMessage('OTP is active!');
        setSnackbarSeverity('success');
      } else {
        setSnackbarMessage('Buyer has not moved to OTP stage yet.');
        setSnackbarSeverity('error');
      }
    } catch (err) {
      console.error('Error checking OTP status:', err);
      setSnackbarMessage('Error checking OTP status.');
      setSnackbarSeverity('error');
    } finally {
      setOpenSnackbar(true);
      setLoading(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#e6f7f5', minHeight: '100vh' }}>
      
      <TopNavbar/>
      <Box sx={{ height: "40px" }} />

      {/* ✅ MAIN CARD */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh' }}>
        <Card sx={{ maxWidth: 450, width: '100%', padding: 3, textAlign: 'center', boxShadow: 5 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Transaction Status
            </Typography>

            {loading ? (
              <CircularProgress />
            ) : (
              <>
                {isCompleted ? (
                  <Box>
                    <CheckCircle color="success" sx={{ fontSize: 80 }} />
                    <Typography variant="h6" sx={{ marginTop: 2 }}>
                      Payment Completed Successfully!
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ marginTop: 2 }}
                      onClick={() => navigate('/')}
                    >
                      OK
                    </Button>
                  </Box>
                ) : (
                  <>
                    {isOTPActive ? (
                      <Box>
                        <Typography variant="h6" sx={{ marginBottom: 2 }}>
                          OTP is active. Proceed with payment status check.
                        </Typography>

                        {otpGenerated && (
                          <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                            Generated OTP: {otp}
                          </Typography>
                        )}

                        {otpSent && (
                          <Button
                            variant="contained"
                            color="primary"
                            sx={{ margin: 1 }}
                            onClick={checkPaymentStatus}
                          >
                            Check Payment Status
                          </Button>
                        )}

                        <Button
                          variant="contained"
                          color="secondary"
                          sx={{ margin: 1 }}
                          onClick={sendOTPToBackend}
                          disabled={otpSent}
                        >
                          Generate OTP
                        </Button>
                      </Box>
                    ) : (
                      <Box>
                        <HourglassEmpty sx={{ fontSize: 80 }} />
                        <Typography variant="h6" sx={{ marginTop: 2 }}>
                          Waiting for Payment...
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
      </Box>

      {/* ✅ SNACKBAR ALERTS */}
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity={snackbarSeverity} onClose={() => setOpenSnackbar(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SellerAcceptedPage;
