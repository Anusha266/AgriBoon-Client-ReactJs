import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfileDisplay = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const url = `${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_GET_CURRENT_USER}`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        console.log("current user is::", response?.data);
        setUserData(response?.data?.data);
        setLoading(false);
      } catch (err) {
        console.log("error while fetching profile data", err);
        setErrorMessage("Failed to fetch profile data.");
        setLoading(false);
        setOpenSnackbar(true);
      }
    };

    fetchUserData();
  }, []);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "#e6f7f5",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#e6f7f5",
        padding: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 5,
          width: "100%",
          maxWidth: "450px",
          boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
          backgroundColor: "#ffffff",
          textAlign: "center",
        }}
      >
        {/* Profile Picture */}
        <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}>
          <Avatar
            alt="N/A"
            src={userData?.profilePic || ""}
            sx={{
              width: 120,
              height: 120,
              border: "4px solid #2193b0",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            }}
          />
        </Box>

        <Typography variant="h5" fontWeight="bold" sx={{ color: "#333", mb: 2 }}>
          {userData?.name || "User Name"}
        </Typography>

        {/* User Details */}
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Email:</strong> {userData?.email || "Not available"}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Phone:</strong> {userData?.phone || "Not available"}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>State:</strong> {userData?.state || "Not available"}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Mandal:</strong> {userData?.mandal || "Not available"}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>District:</strong> {userData?.district || "Not available"}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Village:</strong> {userData?.village || "Not available"}
        </Typography>

        {/* Buttons */}
        <Box sx={{ marginTop: 3, display: "flex", flexDirection: "column", gap: 1 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate("/profile/create")}
            sx={{
              backgroundColor: "#2193b0",
              fontWeight: "bold",
              color: "white",
              padding: "10px",
              borderRadius: 2,
              "&:hover": { backgroundColor: "#1976d2" },
            }}
          >
            Edit Profile
          </Button>

          {/* Back to Home Button */}
          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate("/")}
            sx={{
              borderColor: "#2193b0",
              fontWeight: "bold",
              color: "#2193b0",
              padding: "10px",
              borderRadius: 2,
              "&:hover": { backgroundColor: "#e6f7f5", borderColor: "#1976d2", color: "#1976d2" },
            }}
          >
            Back to Home
          </Button>
        </Box>
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfileDisplay;
