import React from "react";
import { 
  Card, CardContent, CardMedia, Button, Typography, Box 
} from "@mui/material";
import { useNavigate } from "react-router-dom"; 

const ProductCards = ({ products }) => {
  const navigate = useNavigate();
  const isProductsAvailable = products.length > 0; // Check if products exist

  const handleViewDetails = (productId) => {
    navigate(`/product/get/${productId}`);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 3,
        justifyContent: "center",
        maxHeight: "600px",
        overflowY: "auto",
        padding: "20px",
        borderRadius: "10px",
        backgroundColor: "",
        minWidth: "1000px",
      }}
    >
      {isProductsAvailable ? (
        products.map((product) => (
          <Card
            key={product._id}
            sx={{
              width: { xs: "85%", sm: "40%", md: "28%", lg: "20%" },
              height: "320px", // Reduced card height
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
            {/* Product Title */}
            <CardContent sx={{ padding: 2, paddingBottom: 0 }}>
              <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
                {product.name}
              </Typography>
            </CardContent>

            {/* Product Image with reduced height */}
            <CardMedia
              component="img"
              alt={product.name}
              height="150" // Reduced image height
              image={product.image}
              sx={{
                objectFit: "cover",
                width: "100%",
                height: "150px",
              }}
            />

            <CardContent sx={{ paddingTop: 1 }}>
              {/* Product Quality */}
              <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1 }}>
                Quality: {product.quality}
              </Typography>

              {/* Product Price Range */}
              <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
                Price: ₹{product.min_price} - ₹{product.max_price}
              </Typography>

              {/* View Button */}
              <Button
                size="small"
                color="primary"
                variant="contained"
                onClick={() => handleViewDetails(product.id)}
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
        ))
      ) : (
        // No Products Available UI
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "400px",
            textAlign: "center",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#777" }}>
            No Products Available
          </Typography>
          <Typography variant="body1" sx={{ color: "#555", marginTop: "10px" }}>
            Please check back later or try searching for something else.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ProductCards;
