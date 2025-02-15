import React, { useState } from 'react';
import {
  Box,
  Button,
  MenuItem,
  Select,
  Typography,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
} from '@mui/material';
import { styled } from '@mui/system';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TopNavbar from './topNavbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ImageUploadBox = styled(Box)({
  border: '2px dashed #ccc',
  borderRadius: '8px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: '#f9f9f9',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    backgroundColor: '#f1f1f1',
  },
  height: '150px',
});

const productTypes = ["Groundnut", "Wheat", "Paddy", "Maize"];
const activeProductTypes = ["Groundnut"];
const statesOfIndia = [
  "Andhra Pradesh",
  "Karnataka",
  "Tamil Nadu",
  "Telangana",
  "Maharashtra",
  "Punjab",
  "Haryana",
  "Kerala",
];
const activeStates = ["Andhra Pradesh"];



const UploadProductPage = () => {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [fetchedProductDetails, setFetchedProductDetails] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("info");
  const [popupOpen, setPopupOpen] = useState(false);

  const navigate=useNavigate()

  const handleProductChange = (event) => {
    setSelectedProduct(event.target.value);
  };

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const handlePopupClose = () => {
    setPopupOpen(false);
  };

  const handleGetDetails = async () => {
    if (!selectedProduct || !selectedState || !selectedImage) {
      setPopupMessage("Please fill in all the fields and upload an image.");
      setPopupSeverity("error");
      setPopupOpen(true);
      return;
    }

    const URL = import.meta.env.VITE_FETCH_PRODUCT_PRICE_API;
    const formData = new FormData();

    formData.append("image", selectedImage);
    formData.append("inflation_rate", 0.08);
    formData.append("product_name", selectedProduct.toLowerCase());

    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    

    try {
      const response = await axios.post(URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const details = {
        image: selectedImage,
        name: selectedProduct.toLowerCase(),
        quality: response?.data?.data?.Quality || "N/A",
        min_price: response?.data?.data?.modal_price || "N/A",
        max_price: response?.data?.data?.max_price || "N/A",
        uploaded_on: new Date().toISOString().split('T')[0],
      };

      setFetchedProductDetails(details);
      setPopupMessage("Details fetched successfully!");
      setPopupSeverity("success");
      setPopupOpen(true);
    } catch (error) {
      setPopupMessage("An error occurred while fetching details. Please try again.");
      setPopupSeverity("error");
      setPopupOpen(true);
    }
  };

  const handleUpload = async () => {
    if (!fetchedProductDetails || !selectedImage) {
      setPopupMessage("Please fetch product details and select an image before uploading.");
      setPopupSeverity("error");
      setPopupOpen(true);
      
      return;
    }
  
    try {
      const URL = `${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_PRODUCT_UPLOAD_API}`;
  
      // Create a FormData object for the upload
      const formData = new FormData();
      formData.append("image", selectedImage); // Include the image file
      formData.append("name", fetchedProductDetails.name);
      formData.append("quality", fetchedProductDetails.quality);
      formData.append("min_price", fetchedProductDetails.min_price);
      formData.append("max_price", fetchedProductDetails.max_price);
      formData.append("uploaded_on", fetchedProductDetails.uploaded_on);
  
      // Send the FormData to the backend
      const response = await axios.post(URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add token for authorization
        },
      });
      
      console.log("Response while uploading the product:", response);
      setPopupMessage("Uploaded successfully!");
      setPopupSeverity("success");
      setPopupOpen(true);
      navigate('/')
    } catch (error) {
      console.error("Error while uploading the product:", error.response?.data || error.message);
      setPopupMessage("An error occurred while uploading the product. Please try again.");
      setPopupSeverity("error");
      setPopupOpen(true);
    }
  };
  

  return (
    <>
        <TopNavbar/>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '90vh',
          backgroundColor: '#e6f7f5',
        }}
      >
        <Box
          sx={{
            width: '450px',
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: 3,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
            Upload Product
          </Typography>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select Product</InputLabel>
            <Select
              value={selectedProduct}
              onChange={handleProductChange}
              label="Select Product"
            >
              {productTypes.map((product) => (
                <MenuItem
                  key={product}
                  value={product}
                  disabled={!activeProductTypes.includes(product)}
                >
                  {product}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select State</InputLabel>
            <Select
              value={selectedState}
              onChange={handleStateChange}
              label="Select State"
            >
              {statesOfIndia.map((state) => (
                <MenuItem
                  key={state}
                  value={state}
                  disabled={!activeStates.includes(state)}
                >
                  {state}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <ImageUploadBox component="label">
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
            {selectedImage ? (
              <Typography variant="body2">Image Uploaded Successfully</Typography>
            ) : (
              <>
                <CloudUploadIcon sx={{ fontSize: 50, color: '#757575' }} />
                <Typography variant="body1" sx={{ mt: 1 }}>
                  Select Product Image
                </Typography>
              </>
            )}
          </ImageUploadBox>

          {fetchedProductDetails && (
            <Box sx={{ mt: 3, p: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
              <Typography variant="h6">Product Details</Typography>
              <Typography variant="body2"><strong>Product Name:</strong> {fetchedProductDetails.name}</Typography>
              <Typography variant="body2"><strong>Quality:</strong> {fetchedProductDetails.quality}</Typography>
              <Typography variant="body2"><strong>Min Price:</strong> {fetchedProductDetails.min_price}</Typography>
              <Typography variant="body2"><strong>Max Price:</strong> {fetchedProductDetails.max_price}</Typography>
              <Typography variant="body2"><strong>Uploaded On:</strong> {fetchedProductDetails.uploaded_on}</Typography>
            </Box>
          )}

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: 3,
            }}
          >
            <Button variant="outlined" onClick={handleGetDetails}>
              Get Details
            </Button>
            <Button variant="contained" onClick={handleUpload}>
              Upload
            </Button>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={popupOpen}
        autoHideDuration={6000}
        onClose={handlePopupClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handlePopupClose} severity={popupSeverity} sx={{ width: '100%' }}>
          {popupMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UploadProductPage;
