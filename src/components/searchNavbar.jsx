// TopNavbar.js
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
  Typography
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

const SearchNavbar = ({ isSignedIn, handleMenuOpen, menuAnchor, handleMenuClose,handleLogout, searchTerm, setSearchTerm }) => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" sx={{ display: "flex", justifyContent: "space-between", flexWrap: "no-wrap", minWidth: '1000px', overflow: 'auto', overflowX: "auto", gap: 1, backgroundColor: 'black' }}>
      <Toolbar>
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
              <MenuItem onClick={() => { navigate('/')}}>Home</MenuItem>
              <MenuItem onClick={handleMenuClose}>Search</MenuItem>
              <MenuItem onClick={() => { navigate('/product/upload') }}>Upload</MenuItem>
              <MenuItem onClick={() => { navigate('/transactions') }}>Transactions</MenuItem>
              <MenuItem onClick={()=>{navigate('/profile')}}>Profile</MenuItem>
              <MenuItem onClick={handleMenuClose}>Update Products</MenuItem>
              <MenuItem onClick={handleMenuClose}>Payment Bills</MenuItem>
              <MenuItem onClick={handleMenuClose}>My Reviews</MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
               Logout
              </MenuItem>
            </Box>
          </Menu>
        </Box>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, backgroundColor: "white", borderRadius: 1 }}
          InputProps={{ endAdornment: <SearchIcon /> }}
        />
        <Box sx={{ display: "flex", minWidth: '100px', alignItems: "center", justifyContent: 'center', gap: 1, marginLeft: '2px' }}>
          <IconButton color="inherit" onClick={() => navigate('/cart')}>
            <ShoppingCartIcon sx={{ fontSize: 40 }} />
          </IconButton> 
          <IconButton color="inherit" onClick={()=>{navigate('/profile')}}>
            <AccountCircleIcon sx={{ fontSize: 40 }} />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default SearchNavbar;
