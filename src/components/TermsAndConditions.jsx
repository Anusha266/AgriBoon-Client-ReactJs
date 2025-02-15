import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  IconButton,
  Container,
  Card,
  CardContent
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLocation, useNavigate } from 'react-router-dom';

const TermsAndConditions = () => {
  const location = useLocation();
  const { transaction } = location.state;
  console.log("Entered into terms and conditions page: tran", transaction);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setProduct(transaction?.product || null);
  }, [transaction]);

  const handleAcceptTerms = () => {
    setAcceptedTerms((prev) => !prev);
  };

  const handleSpeakWithFarmer = () => {
    navigate(`/negotiation/${transaction?._id}`, {
      state: { transaction }
    });
  };

  return (
    <Box sx={{ backgroundColor: '#e6f7f5', minHeight: '100vh' }}>
      {/* Top Navigation Bar */}
      <AppBar position="static" sx={{ backgroundColor: '#00796b' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/transactions')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Terms & Conditions
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ padding: 4 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : product ? (
          <Card sx={{ padding: 3, borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              {/* Product Details */}
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Product Details
              </Typography>
              <Typography variant="body1">
                <strong>Name:</strong> {product?.name}
              </Typography>
              <Typography variant="body1">
                <strong>Quality:</strong> {product?.quality}
              </Typography>
              <Typography variant="body1">
                <strong>Price Range:</strong> ${Math.round(product?.min_price)} - ${Math.round(product?.max_price)}
              </Typography>
              <Typography variant="body1">
                <strong>Description:</strong> {product?.description || "No description available."}
              </Typography>

              {/* Owner Details */}
              <Typography variant="h6" fontWeight="bold" sx={{ marginTop: 3 }}>
                Owner Details
              </Typography>
              <Typography variant="body1">
                <strong>Name:</strong> {product?.owner_details?.name}
              </Typography>
              <Typography variant="body1">
                <strong>Phone:</strong> {product?.owner_details?.phone}
              </Typography>
              <Typography variant="body1">
                <strong>Location:</strong> {`${product?.owner_details?.village}, ${product?.owner_details?.mandal}, ${product?.owner_details?.state}`}
              </Typography>

              {/* Terms and Conditions */}
              <Typography variant="h5" fontWeight="bold" sx={{ marginTop: 3 }}>
                Terms and Conditions
              </Typography>
              <Typography variant="body1" gutterBottom>
                Please read and accept the terms and conditions before proceeding.
              </Typography>
              <Box sx={{ marginTop: 2, padding: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                <ol>
                  <li>The quality and price of the product are final as per the listed details.</li>
                  <li>The buyer is responsible for transportation and delivery arrangements.</li>
                  <li>Once accepted, the product cannot be returned.</li>
                  <li>Ensure all payment terms are agreed upon before proceeding.</li>
                  <li>Direct communication with the owner is for negotiation purposes only.</li>
                </ol>
              </Box>

              {/* Checkbox and Buttons */}
              <FormControlLabel
                control={<Checkbox checked={acceptedTerms} onChange={handleAcceptTerms} />}
                label="I agree to the terms and conditions"
                sx={{ marginTop: 2 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate('/transactions')}
                >
                  Go Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!acceptedTerms}
                  onClick={handleSpeakWithFarmer}
                >
                  Speak with Farmer
                </Button>
              </Box>
            </CardContent>
          </Card>
        ) : (
          <Typography variant="body1">No product data available.</Typography>
        )}
      </Container>
    </Box>
  );
};

export default TermsAndConditions;
