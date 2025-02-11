import React, { useState, useEffect } from 'react';
import { Box, Typography, Checkbox, FormControlLabel, Button, CircularProgress, Alert } from '@mui/material';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TermsAndConditions = () => {
   const location= useLocation();
   const { transaction }=location.state;
   console.log("entered into terms and conditions page:tran",transaction)

  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const navigate=useNavigate();
  useEffect(() => {
        
        setProduct(transaction.product); // Update state with product data
      
  }, [transaction]);

  const handleAcceptTerms = () => {
    setAcceptedTerms((prev) => !prev);
  };

  const handleSpeakWithFarmer = async() => {
    
    
        navigate(`/negotiation/${transaction._id}`,{
          state:{
          transaction
        }})
      
 
    
  };
  
  return (
    <Box sx={{ padding: 3, border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : product ? (
        <>
          <Typography variant="h5" gutterBottom>
            Product Details
          </Typography>
          <Typography variant="body1">
            <strong>Name:</strong> {product.name}
          </Typography>
          <Typography variant="body1">
            <strong>Quality:</strong> {product.quality}
          </Typography>
          <Typography variant="body1">
            <strong>Price Range:</strong> ${product.min_price} - ${product.max_price}
          </Typography>
          <Typography variant="body1">
            <strong>Description:</strong> {product.description || "No description available."}
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
            Owner Details
          </Typography>
          <Typography variant="body1">
            <strong>Name:</strong> {product.owner_details.name}
          </Typography>
          <Typography variant="body1">
            <strong>Phone:</strong> {product.owner_details.phone}
          </Typography>
          <Typography variant="body1">
            <strong>Location:</strong> {`${product.owner_details.village}, ${product.owner_details.mandal}, ${product.owner_details.state}`}
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ marginTop: 3 }}>
            Terms and Conditions
          </Typography>
          <Typography variant="body1" gutterBottom>
            Please read and accept the terms and conditions before proceeding.
          </Typography>
          <Box sx={{ marginTop: 2 }}>
            <ol>
              <li>The quality and price of the product are final as per the listed details.</li>
              <li>The buyer is responsible for transportation and delivery arrangements.</li>
              <li>Once accepted, the product cannot be returned.</li>
              <li>Ensure all payment terms are agreed upon before proceeding.</li>
              <li>Direct communication with the owner is for negotiation purposes only.</li>
            </ol>
          </Box>
          <FormControlLabel
            control={<Checkbox checked={acceptedTerms} onChange={handleAcceptTerms} />}
            label="I agree to the terms and conditions"
            sx={{ marginTop: 2 }}
          />
          <Box sx={{ marginTop: 3 }}>
            <Button
              variant="contained"
              color="primary"
              disabled={!acceptedTerms}
              onClick={handleSpeakWithFarmer}
            >
              Speak with Farmer
            </Button>
          </Box>
        </>
      ) : (
        <Typography variant="body1">No product data available.</Typography>
      )}
    </Box>
  );
};

export default TermsAndConditions;
