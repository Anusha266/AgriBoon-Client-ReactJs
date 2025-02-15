import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const transaction = location.state?.transaction || {}; // Ensure safe access

  const handleOKClick = () => {
    navigate("/"); // Navigate to home page
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
        textAlign: "center",
        padding: 3,
      }}
    >
      {/* Animated Check Icon */}
      <CheckCircleIcon
        sx={{
          fontSize: "80px",
          color: "#4CAF50",
          animation: "pop 0.5s ease-in-out",
        }}
      />

      {/* Success Message */}
      <Typography variant="h4" sx={{ fontWeight: "bold", mt: 2 }}>
        Payment Successful!
      </Typography>
      <Typography variant="body1" sx={{ color: "#555", mt: 1 }}>
        Your payment for <strong>{transaction?.product?.name || "Product"}</strong> has been completed.
      </Typography>

      {/* OK Button */}
      <Button
        variant="contained"
        onClick={handleOKClick}
        sx={{
          marginTop: 3,
          fontSize: "1rem",
          padding: "10px 30px",
          background: "linear-gradient(to right, #4CAF50, #66BB6A)",
          "&:hover": {
            background: "linear-gradient(to right, #66BB6A, #4CAF50)",
          },
        }}
      >
        OK
      </Button>

      {/* Animation Keyframes */}
      <style>
        {`
          @keyframes pop {
            0% { transform: scale(0.5); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
};

export default PaymentSuccess;
