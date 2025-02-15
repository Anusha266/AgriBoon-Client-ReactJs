import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Divider,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import TopNavbar from "./topNavbar";

const ProductDetail = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar visibility
  const [currentUser, setCurrentUser] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const url = `${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_GET_CURRENT_USER}`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        setCurrentUser(response?.data?.data);
      } catch (err) {
        console.error("Failed to fetch current user:", err);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const URL = `${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_GET_PRODUCT_BY_ID}${id}`;
        const response = await axios.get(URL, {
          headers: { "Content-Type": "application/json" },
        });

        setData(response.data.data[0]);
        setError(null);
      } catch (err) {
        setError("Failed to load product details. Please try again.");
        setSnackbarOpen(true); // Show snackbar if error occurs
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleBuyNow = async () => {
    try {
      const URL = `${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_UPDATE_PRODUCT_BY_ID}${data._id}`;
      const token = localStorage.getItem("token");
      await axios.patch(URL, { status: "pending" }, { headers: { Authorization: `Bearer ${token}` } });

      await axios.post(
        `${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_CREATE_TRANSACTION}`,
        { role: "seller", user: data.owner_details._id, product: data._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/transactions");
    } catch (e) {
      console.error("Error while creating transaction:", e);
      setError("Unable to buy product. Please try again!");
      setSnackbarOpen(true); // Show snackbar for error
    }
  };

  const handleCart = async () => {
    try {
      const URL = `${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_UPDATE_PRODUCT_BY_ID}${data._id}`;
      await axios.patch(URL, { cart: true }, { headers: { "Content-Type": "application/json" } });

      console.log("Product added to cart successfully.");
    } catch (e) {
      console.error("Error updating product cart status:", e);
      setError("Failed to add to cart. Please try again!");
      setSnackbarOpen(true); // Show snackbar for error
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data) {
    return (
      <Typography variant="h6" sx={{ textAlign: "center", marginTop: 4 }}>
        No product data available
      </Typography>
    );
  }

  const isOwner = currentUser && data?.owner_details?._id === currentUser?._id;

  return (
    <>
      <TopNavbar />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "90vh",
          backgroundColor: "#e6f7f5",
          padding: 2,
        }}
      >
        <Card sx={{ maxWidth: 500, width: "100%", boxShadow: 3, borderRadius: 2 }}>
          <CardMedia
            component="img"
            image={data?.image || ""}
            alt={data?.name || "Product Image"}
            sx={{ height: 300, objectFit: "cover", borderTopLeftRadius: "8px", borderTopRightRadius: "8px" }}
          />
          <CardContent>
            <Box>
              <Typography variant="h6">Product Details</Typography>
              <Typography variant="body2"><strong>Product Name:</strong> {data?.name || "N/A"}</Typography>
              <Typography variant="body2"><strong>Quality:</strong> {data?.quality || "N/A"}</Typography>
              <Typography variant="body2"><strong>Min Price:</strong> {data?.max_price || "N/A"}</Typography>
              <Typography variant="body2"><strong>Max Price:</strong> {data?.min_price || "N/A"}</Typography>
              <Typography variant="body2"><strong>Uploaded On:</strong> {data?.uploaded_on || "N/A"}</Typography>
            </Box>
          </CardContent>
          <Divider />
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="success"
                fullWidth
                sx={{ textTransform: "none" }}
                onClick={handleCart}
                disabled={isOwner || data?.cart}
              >
                Add to Cart
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleBuyNow}
                sx={{ textTransform: "none" }}
                disabled={isOwner}
              >
                Buy Now
              </Button>
            </Grid>
          </Grid>
        </Card>
      </Box>

      {/* Snackbar for Error Messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductDetail;
