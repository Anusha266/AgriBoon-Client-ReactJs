import React, { useState, useEffect } from "react";
import { Box, Grid, Card, CardMedia, CardContent, Typography, CircularProgress,CardActions,Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import TopNavbar from "./topNavbar";
const Cart = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  


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
       <TopNavbar/>      
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={2}>
        {cartProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
              {/* Product Image */}
              <CardMedia
                component="img"
                height="300"
                image={product?.image}
                alt={product?.name}
              />

              {/* Product Details */}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{product?.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  ₹{Math.round(product?.min_price)} - ₹{Math.round(product?.max_price)}
                </Typography>
              </CardContent>

              {/* View Button at the Bottom Right */}
              <CardActions sx={{ justifyContent: "flex-end", padding: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate(`/product/get/${product.id}`)}
                  sx={{ cursor: "pointer" }}
                >
                  View
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
   
    </>
  );
};

export default Cart;
