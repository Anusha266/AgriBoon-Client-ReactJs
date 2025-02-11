import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Button, Drawer, Box, IconButton, Typography,List,ListItem,ListItemButton,ListItemText } from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import ProductCards from './ProductCards'; // Assuming ProductCards is in the same directory
import axios from "axios";
import SliderPage from './Slider'
const ProductNavbar = ({ productCategories }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [products, setProducts] = useState([]);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
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
      console.log(response.data)
      setProducts(response.data.data)    
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#b2afb3", color: "black",minWidth:'1000px', overflow:'auto' }} elevation={0}>
        <Toolbar sx={{ display: { xs: "none", sm: "flex" }, justifyContent: "left" }}>
          <Button color="inherit" onClick={handleAll} sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}>
            ALL
          </Button>
        </Toolbar>

        <Toolbar sx={{ display: { xs: "flex", sm: "none" }, justifyContent: "space-between" }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6">Categories</Typography>
          </Box>
          <IconButton color="inherit" onClick={toggleDrawer(true)}>
            <CategoryIcon />
          </IconButton>
          <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
            <Box sx={{ width: 250 }} role="presentation">
              <List>
                {productCategories.map((category) => (
                  <ListItem key={category} disablePadding>
                    <ListItemButton>
                      <ListItemText primary={category} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Drawer>
        </Toolbar>
      </AppBar>

      <SliderPage />
      {/* Render the product cards */}
      {products.length > 0 && <ProductCards products={products} />}
    </>
  );
};

export default ProductNavbar;
