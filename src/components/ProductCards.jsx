import React from "react";
import { Card, CardContent, CardMedia, Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom"; // To navigate to the product detail page

const ProductCards = ({ products }) => {
  const navigate = useNavigate();

  // Function to handle navigation to the detail page and passing data
  const handleViewDetails = (productId) => {
    navigate(`/product/get/${productId}`,{
      state:{data:products}
    })}
  
    // navigate(`/product/${product._id}`, { state: { product } });                                                 
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 3,
        justifyContent: "center",
        maxHeight: "600px", // Increased height for the box
        overflowY: "auto", // Allow scrolling when content exceeds maxHeight
        padding: "20px", // Padding around the cards container
        borderRadius: "10px",
        backgroundColor: "#f9f9f9",
        minWidth: "1000px",
      }}
    >
      {products.map((product) => (
        <Card
          key={product._id}
          sx={{
            width: { xs: "85%", sm: "40%", md: "28%", lg: "20%" }, // Slightly reduced width
            height: "350px", // Increased card height for better image display
            boxShadow: 3,
            borderRadius: "10px",
            overflow: "hidden",
            transition: "transform 0.3s ease-in-out",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: 6,
            },
            backgroundColor: "#fff",
            position: "relative",
          }}
        >
          {/* Product Title Above the Image */}
          <CardContent sx={{ padding: 2, paddingBottom: 0 }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
              {product.name}
            </Typography>
          </CardContent>

          {/* Product Image */}
          <CardMedia
            component="img"
            alt={product.name}
            height="200" // Adjusted image height
            image={product.image}
            sx={{
              objectFit: "cover",
              width: "100%",
              height: "200px", // Ensures the image fits within the allocated space
            }}
          />

          <CardContent sx={{ paddingTop: 1 }}>
            {/* Product Quality */}
            <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1 }}>
              Quality: {product.quality}
            </Typography>

            {/* Product Price Range */}
            <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
              Price Range: ₹{product.min_price} - ₹{product.max_price}
            </Typography>

            {/* View Button at the Bottom Right */}
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={()=>handleViewDetails(product.id)}
              sx={{
                position: "absolute",
                bottom: 10,
                right: 10,
                fontWeight: "bold",
                backgroundColor: "#007BFF",
                "&:hover": {
                  backgroundColor: "#0056b3",
                },
              }}
            >
              View
            </Button>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default ProductCards;
