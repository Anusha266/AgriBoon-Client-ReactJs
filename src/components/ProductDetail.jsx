






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
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import TopNavbar from "./topNavbar";

const ProductDetail = () => {
  const [data, setData] = useState(null); // State for product data
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error handling
  const [currentUser, setCurrentUser] = useState(null); // State for current user
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const { id } = useParams(); // Get product ID from route parameters

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleSignInSignOut = () => {
    setIsSignedIn((prev) => !prev);
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const url = `${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_GET_CURRENT_USER}`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("current user is::",response.data)
        setCurrentUser(response?.data?.data); // Save current user info
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
          headers: {
            "Content-Type": "application/json",
          },
        });

        setData(response.data.data[0]); // Update state with API data
        setError(null); // Clear error state on success
      } catch (err) {
        setError("Failed to load product details. Please try again."); // Set error message
      } finally {
        setLoading(false); // Stop loading indicator
      }
    };

    fetchData();
  }, [id]);

  const handleBuyNow = async () => {
    try {
        const URL = `${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_UPDATE_PRODUCT_BY_ID}${data._id}`; // Using product ID in the URL
        console.log(URL)
        const token=localStorage.getItem('token')
        const resp = await axios.patch(
          URL,
          {
            status: "pending", // Passing the status in the body
          },
          {
            headers: {
              "Content-Type": "application/json", // Ensuring correct content type
              'Authorization':`Bearer ${token}`
            },
          }
        );
        console.log("response in handleBuynow",resp)

        //storing data in transaction model
        
        const transResp = await axios.post(
          `${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_CREATE_TRANSACTION}`,
          {

            role:'seller' ,
            user:data.owner_details._id,
            product:data._id

          },
          {
            headers: {
              "Content-Type": "application/json", // Ensuring correct content type
              'Authorization':`Bearer ${token}`
            },
          }
        );
        console.log("response while creating transaction:",transResp.data)

        
        
    
      } catch (e) {
        console.error("Error while creating transaction data:", e); // Handle error
      }
  };
  

  const handleCart=async()=>{
    try{
      const URL=`${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_UPDATE_PRODUCT_BY_ID}${data._id}`
      const resp = await axios.patch(URL,
        {
            cart:true
        },
        {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("While upating product status to cart",resp.data)
    }
    catch(e){
      console.log("Error updating product cart status",e)
    }
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6">No product data available</Typography>
      </Box>
    );
  }

  const isOwner = currentUser && data?.owner_details?._id === currentUser?._id;

  return (
    <>
      <TopNavbar
        isSignedIn={isSignedIn}
        handleMenuOpen={handleMenuOpen}
        menuAnchor={menuAnchor}
        handleMenuClose={handleMenuClose}
        handleSignInSignOut={handleSignInSignOut}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "90vh",
          backgroundColor: "#f4f4f4",
          padding: 2,
        }}
      >
        <Card
          sx={{
            maxWidth: 500,
            width: "100%",
            boxShadow: 3,
            borderRadius: 2,
          }}
        >
          <CardMedia
            component="img"
            image={data?.image || ""}
            alt={data?.name || "Product Image"}
            sx={{
              height: 300,
              objectFit: "cover",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
            }}
          />
          <CardContent>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {data?.name || "N/A"}
            </Typography>
            {/* Rest of the details */}
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
                disabled={isOwner || (data?.cart)} // Disable if user is owner
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
                disabled={isOwner} // Disable if user is owner
              >
                Buy Now
              </Button>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </>
  );
};

export default ProductDetail;













