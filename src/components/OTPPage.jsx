import React, { useState, useRef } from "react";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const OTPPage = () => {
  const [otp, setOtp] = useState(["", "", "", ""]); // State for storing each digit of OTP
  const [error, setError] = useState(""); // State for handling errors
  const [success, setSuccess] = useState(false); // State for handling success
  const inputRefs = useRef([]); // Refs for managing input focus
  const navigate = useNavigate(); // For navigation
  const { transactionId } = useParams(); // Extract roleId from route params
  const location=useLocation()
  const {transaction}=location.state
  console.log("entered into OTP page:transId",transactionId)

  // Handle input change for each box
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return; // Allow only single-digit numbers

    const newOtp = [...otp];
    newOtp[index] = value; // Update the digit in the state
    setOtp(newOtp);

    // Move focus to the next box if a digit is entered
    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace to move to the previous input box
  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Function to handle OTP submission
  const handleOTPSubmit = async () => {
    setError(""); // Reset error state
    setSuccess(false); // Reset success state

    const otpString = otp.join(""); // Combine the OTP digits into a single string

    // Validate OTP input
    if (otpString.length !== 4 || isNaN(otpString)) {
      setError("Please enter a valid 4-digit OTP");
      return;
    }

    try {
      // Axios POST request (replace URL with your endpoint)
      const URL = `${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_COMPARE_OTP}`;
      const response = await axios.post(URL, {
        id:transactionId,
        otp: otpString,
      });

      // Handle response
      console.log("response in OTP comparision:",response.data)
      if (response.data.data.isEqual) {
        setSuccess(true);
        navigate('/payments',{
          state:{
            transaction
          }
        })
        
        

      } else {
        setError("Wrong OTP. Please try again.");
      }
    } catch (err) {
        console.log("An error occurred while verifying OTP. Please try again.",err)
      setError("An error occurred while verifying OTP. Please try again.");
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
        Enter OTP
      </Typography>

      {/* OTP Input Boxes */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
        }}
      >
        {otp.map((digit, index) => (
          <TextField
            key={index}
            inputRef={(ref) => (inputRefs.current[index] = ref)} // Store input refs
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)} // Handle change
            onKeyDown={(e) => handleKeyDown(e, index)} // Handle backspace
            variant="outlined"
            inputProps={{ maxLength: 1, style: { textAlign: "center" } }} // Limit to 1 digit
            sx={{ width: "50px" }}
            error={Boolean(error)}
          />
        ))}
      </Box>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">OTP Verified Successfully!</Alert>}

      {/* Submit Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleOTPSubmit}
        sx={{ width: "200px" }}
      >
        Proceed to Payment
      </Button>
    </Box>
  );
};

export default OTPPage;
