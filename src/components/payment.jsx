import React, { useState } from "react";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // For navigation
  const { transaction } = location.state; // Get transaction details from state
  const [amount, setAmount] = useState(transaction.product.max_price); // Default to max price
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
      // Load Razorpay script
      const isRazorpayLoaded = await loadRazorpayScript();
      if (!isRazorpayLoaded) {
        setError("Failed to load Razorpay SDK. Please try again.");
        return;
      }

      // Create order on the server
      const URL = `${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_RAZORPAY_PAYMENT_ROUTE}${import.meta.env.VITE_RAZORPAY_CREATE_ORDER}`;
      const response = await axios.post(URL, {
        amount,
        transactionId: transaction?._id,
      });

      const { id: order_id, currency } = response.data.data;

      // Razorpay payment options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: currency,
        name: "AgriBoon",
        description: `Transaction ID: ${transaction._id}`,
        order_id: order_id,
        handler: async function (response) {
          // Success callback
          // Update product status to completed
          var updateURL = `${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_UPDATE_TRANSACTION}${transaction?._id}`;
          await axios.patch(updateURL, { isCompleted: true, }, {
            headers: {
              "Content-Type": "application/json",
            },
          });
    
          updateURL=`${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_UPDATE_PRODUCT_BY_ID}${transaction?.product?._id}`;
          await  axios.patch(updateURL, { status: "success", }, {
            headers: {
              "Content-Type": "application/json",
            },
          });


          // Navigate to OTP success page
          navigate("/payment-success",{
            state:{
                transaction
            }
          });
        },
        prefill: {
          name: transaction?.user?.name,
          email: transaction?.user?.email,
          contact: transaction?.user?.phone,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        // Handle payment failure
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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: 3,
        p: 2,
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        Payment Page
      </Typography>
      <Typography>
        Pay for {transaction.product.name}. Minimum Price: ₹
        {transaction.product.min_price}, Maximum Price: ₹
        {transaction.product.max_price}
      </Typography>

      <TextField
        label="Amount to Pay"
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        inputProps={{ min: transaction.product.min_price }}
        sx={{ width: "200px" }}
      />

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">Payment Successful!</Alert>}

      <Button
        variant="contained"
        color="primary"
        onClick={handlePayment}
        sx={{ width: "200px" }}
      >
        Pay ₹{amount}
      </Button>
    </Box>
  );
};

export default PaymentPage;
