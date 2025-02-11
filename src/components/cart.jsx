import React, { useState, useEffect } from "react";
import { Box, Grid, Card, CardMedia, CardContent, Typography, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import TopNavbar from "./topNavbar";
const Cart = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);

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
    const fetchCartProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_GET_CART_PRODUCTS}`);
        console.log("response in fetching card products",response.data)

        setCartProducts(response.data.data);

    } catch (err) {
        setError("Failed to fetch cart products. Please try again.",err);
      } finally {
        setLoading(false);
      }
    };

    fetchCartProducts();
  }, []);

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

  return (
    <>
       <TopNavbar
        isSignedIn={isSignedIn}
        handleMenuOpen={handleMenuOpen}
        menuAnchor={menuAnchor}
        handleMenuClose={handleMenuClose}
        handleSignInSignOut={handleSignInSignOut}
      />      
      <Box sx={{ padding: 3 }}>
        <Grid container spacing={2}>
          {cartProducts.map(product => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Card onClick={() => navigate(`/product/get/${product.id}`)} sx={{ cursor: "pointer" }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={product?.image}
                  alt={product?.name}
                />
                <CardContent>
                  <Typography variant="h6">{product?.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    ₹{product?.min_price} - ₹{product?.max_price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>    
    </>
  );
};

export default Cart;
