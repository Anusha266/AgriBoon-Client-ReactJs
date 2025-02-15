import React, { useState } from "react";
import { 
  Box, TextField, Button, Typography, Alert, IconButton 
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { transaction } = location.state || {}; // Ensure safety with optional chaining
  const minPrice = Math.round(transaction?.product?.min_price || 0);
  const maxPrice = Math.round(transaction?.product?.max_price || 0);

  const [amount, setAmount] = useState(maxPrice); // Default to max price
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setError("");
    setSuccess(false);

    try {
      const isRazorpayLoaded = await loadRazorpayScript();
      if (!isRazorpayLoaded) {
        setError("Failed to load Razorpay SDK. Please try again.");
        return;
      }

      const URL = `${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_RAZORPAY_PAYMENT_ROUTE}${import.meta.env.VITE_RAZORPAY_CREATE_ORDER}`;
      const response = await axios.post(URL, {
        amount,
        transactionId: transaction?._id,
      });

      const { id: order_id, currency } = response.data?.data || {};

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: currency,
        name: "AgriBoon",
        description: `Transaction ID: ${transaction?._id}`,
        order_id: order_id,
        handler: async function (response) {
          var updateURL = `${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_UPDATE_TRANSACTION}${transaction?._id}`;
          await axios.patch(updateURL, { isCompleted: true });

          updateURL = `${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_UPDATE_PRODUCT_BY_ID}${transaction?.product?._id}`;
          await axios.patch(updateURL, { status: "success" });

          navigate("/payment-success", { state: { transaction } });
        },
        prefill: {
          name: transaction?.user?.name || "User",
          email: transaction?.user?.email || "user@example.com",
          contact: transaction?.user?.phone || "0000000000",
        },
        theme: {
          color: "#4CAF50", // Green for success
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        setError("Payment failed. Please try again.");
        console.error("Payment failed:", response.error);
      });

      rzp.open();
    } catch (err) {
      setError("An error occurred while processing payment. Please try again.");
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5", // Same background as other pages
        padding: 2,
      }}
    >
      {/* Back Arrow Button */}
      <IconButton
        onClick={() => navigate("/transactions")}
        sx={{
          position: "absolute",
          top: 20,
          left: 20,
          backgroundColor: "#fff",
          boxShadow: 1,
          "&:hover": { backgroundColor: "#e0e0e0" },
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      {/* Payment Card */}
      <Box
        sx={{
          backgroundColor: "#fff",
          padding: 4,
          borderRadius: 3,
          boxShadow: 3,
          textAlign: "center",
          width: "400px",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          Payment Page
        </Typography>
        <Typography sx={{ fontSize: "1rem", color: "#555", mb: 2 }}>
          Pay for <strong>{transaction?.product?.name || "Product"}</strong>. 
          <br />
          Minimum Price: ₹{minPrice}, Maximum Price: ₹{maxPrice}
        </Typography>

        {/* Amount Input */}
        <TextField
          label="Amount to Pay"
          type="number"
          value={amount}
          onChange={(e) => setAmount(Math.round(Number(e.target.value)))}
          inputProps={{ min: minPrice, max: maxPrice }}
          sx={{
            width: "100%",
            marginBottom: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              transition: "0.2s",
              "&:hover fieldset": {
                borderColor: "#4CAF50",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#4CAF50",
                boxShadow: "0px 0px 8px rgba(76, 175, 80, 0.5)",
              },
            },
          }}
        />

        {/* Error & Success Messages */}
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">Payment Successful!</Alert>}

        {/* Payment Button */}
        <Button
          variant="contained"
          onClick={handlePayment}
          sx={{
            marginTop: 3,
            width: "100%",
            fontSize: "1rem",
            padding: "12px",
            background: "linear-gradient(to right, #4CAF50, #66BB6A)",
            "&:hover": {
              background: "linear-gradient(to right, #66BB6A, #4CAF50)",
            },
          }}
        >
          Pay ₹{amount}
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentPage;
