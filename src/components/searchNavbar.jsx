import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  TextField,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Typography,
  Select,
  Button
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import SliderPage from './Slider'
import ProductCards from './ProductCards';
import axios from "axios";



const SearchNavbar = ({ isSignedIn, handleMenuOpen, menuAnchor, handleMenuClose, handleLogout, searchTerm, setSearchTerm }) => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState("all");
  const [products,setProducts]=useState([])
  // Products dropdown list with only "All" and "Groundnut" enabled
  const productsList = [
    { label: "All", value: "all", disabled: false },
    { label: "Groundnut", value: "groundnut", disabled: false },
    { label: "Paddy", value: "paddy", disabled: true },
    { label: "Wheat", value: "wheat", disabled: true },
    { label: "Maize", value: "maize", disabled: true },
  ];

  const handleSearch = () => {
    console.log("Searching for:", searchTerm, "in", selectedProduct);
    // API call to search products based on `searchTerm` and `selectedProduct`
  };

  const fetchProductsByName = async(product) => {
    console.log("Fetching  products by name...",product);
    // API call to fetch all products when search box is focused
    const URL=`${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_GET_PRODUCTS_BY_NAME}?name=${product}`
    const token=localStorage.getItem('token');
    console.log(URL,token);
    try {
      const response = await axios.get(URL, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }); 
      console.log("fethcing products by name",response.data)
      setProducts(response.data.data)    
    } catch (error) {
      console.error('Error fetching data:', error);
    }

  };
  const handleAll = async () => {
    // Call your API here to fetch all products
    const URL=`${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_FETCH_ALL_PRODUCTS}`
    const token=localStorage.getItem('token');
    console.log(URL,token);
    try {
      const response = await axios.get(URL, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }); 
      console.log("response data while fetching all products",response.data)
      setProducts(response.data.data)    
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
    const handleProduct=async (product)=>{
      setSelectedProduct(product);
      // console.log("product",product)
      if (product==="all"){
        handleAll(); 
        return;
      }
    
      fetchProductsByName(product);
    }

  return (
    <>
    <AppBar position="static" sx={{ display: "flex", justifyContent: "space-between", flexWrap: "nowrap", minWidth: "1000px", overflowX: "auto", backgroundColor: "black" }}>
      <Toolbar>
        {/* Menu Button */}
        <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          <IconButton edge="start" color="inherit" onClick={handleMenuOpen}>
            <MenuIcon />
          </IconButton>
          <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
            <Box sx={{ px: 2, py: 1, textAlign: "center" }}>
              <Avatar sx={{ margin: "0 auto", mb: 1 }} />
              <Typography variant="body1" gutterBottom>
                Welcome, {isSignedIn ? "User" : "Guest"}
              </Typography>
              <Divider />
              <MenuItem onClick={() => navigate("/")}>Home</MenuItem>
              <MenuItem onClick={handleMenuClose}>Search</MenuItem>
              <MenuItem onClick={() => navigate("/product/upload")}>Upload</MenuItem>
              <MenuItem onClick={() => navigate("/transactions")}>Transactions</MenuItem>
              <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
              <MenuItem onClick={handleMenuClose}>Update Products</MenuItem>
              <MenuItem onClick={handleMenuClose}>Payment Bills</MenuItem>
              <MenuItem onClick={handleMenuClose}>My Reviews</MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Box>
          </Menu>
        </Box>

        {/* Product Selection Dropdown */}
        <Select
          value={selectedProduct}
          onChange={(e) => handleProduct(e.target.value)}
          size="small"
          sx={{ minWidth: 120, backgroundColor: "white", borderRadius: 1, ml: 2 }}
        >
          {productsList.map((product) => (
            <MenuItem key={product.value} value={product.value} disabled={product.disabled}>
              {product.label}
            </MenuItem>
          ))}
        </Select>

        {/* Search Input Field */}
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, backgroundColor: "white", borderRadius: 1, ml: 2 }}
        />

        {/* Search Button */}
        <Button variant="contained" color="primary" onClick={handleSearch} sx={{ ml: 1 }}>
          <SearchIcon />
        </Button>

        {/* Cart and Profile Icons */}
        <Box sx={{ display: "flex", minWidth: "100px", alignItems: "center", justifyContent: "center", gap: 1, ml: 2 }}>
          <IconButton color="inherit" onClick={() => navigate("/cart")}>
            <ShoppingCartIcon sx={{ fontSize: 40 }} />
          </IconButton>
          <IconButton color="inherit" onClick={() => navigate("/profile")}>
            <AccountCircleIcon sx={{ fontSize: 40 }} />
          </IconButton>
        </Box>
      </Toolbar>
      
    </AppBar>


    <SliderPage />
      {/* Render the product cards */}
      {products.length > 0 && <ProductCards products={products} />}
    </>
    
  );
};

export default SearchNavbar;
