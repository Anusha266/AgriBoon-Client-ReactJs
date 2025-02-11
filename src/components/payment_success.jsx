import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location=useLocation();
  const transaction=location.state;
  console.log(transaction)

  const handleOKClick = () => {
    navigate("/"); // Navigate to the home page
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: 3,
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        Payment Successful!
      </Typography>
      <Typography>payment has been completed.</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOKClick}
        sx={{ width: "200px" }}
      >
        OK
      </Button>
    </Box>
  );
};

export default PaymentSuccess;
