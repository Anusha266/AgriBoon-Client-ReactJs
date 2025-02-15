import React, { useState, useRef } from "react";
import { 
  Box, TextField, Button, Typography, Alert, IconButton 
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";

const OTPPage = () => {
  const [otp, setOtp] = useState(["", "", "", ""]); // OTP State
  const [error, setError] = useState(""); // Error State
  const [success, setSuccess] = useState(false); // Success State
  const inputRefs = useRef([]); // Input Refs
  const navigate = useNavigate();
  const { transactionId } = useParams();
  const location = useLocation();
  const { transaction } = location.state;

  console.log("Entered OTP page: transId", transactionId);

  // Handle OTP Input Change
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return; // Only allow single-digit numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus to next box if a digit is entered
    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle Backspace Navigation
  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle OTP Submission
  const handleOTPSubmit = async () => {
    setError("");
    setSuccess(false);

    const otpString = otp.join(""); // Convert OTP array to string

    // Validate OTP
    if (otpString.length !== 4 || isNaN(otpString)) {
      setError("Please enter a valid 4-digit OTP");
      return;
    }

    try {
      const URL = `${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_COMPARE_OTP}`;
      const response = await axios.post(URL, {
        id: transactionId,
        otp: otpString,
      });

      console.log("Response in OTP comparison:", response.data);

      if (response.data.data.isEqual) {
        setSuccess(true);
        navigate("/payments", {
          state: { transaction },
        });
      } else {
        setError("Wrong OTP. Please try again.");
      }
    } catch (err) {
      console.log("Error verifying OTP:", err);
      setError("An error occurred while verifying OTP. Please try again.");
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
        backgroundColor: "#f5f5f5", // Same as previous pages
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

      {/* OTP Container */}
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
          Enter OTP
        </Typography>

        {/* OTP Input Boxes */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            marginBottom: 2,
          }}
        >
          {otp.map((digit, index) => (
            <TextField
              key={index}
              inputRef={(ref) => (inputRefs.current[index] = ref)}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              variant="outlined"
              inputProps={{
                maxLength: 1,
                style: { textAlign: "center", fontSize: "1.5rem" },
              }}
              sx={{
                width: "60px",
                height: "60px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  transition: "0.2s",
                  "&:hover fieldset": {
                    borderColor: "black",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "black",
                    
                  },
                },
              }}
              error={Boolean(error)}
            />
          ))}
        </Box>

        {/* Error / Success Messages */}
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">OTP Verified Successfully!</Alert>}

        {/* Submit Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleOTPSubmit}
          sx={{
            marginTop: 3,
            width: "100%",
            fontSize: "1rem",
            padding: "12px",
            background: "rgb(96, 150, 61)",
            "&:hover": {
              background: "rgb(68, 138, 21)",
            },
          }}
        >
          Proceed to Payment
        </Button>
      </Box>
    </Box>
  );
};

export default OTPPage;
