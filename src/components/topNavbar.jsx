import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";

const TopNavbar = ({ isSignedIn, handleMenuOpen, menuAnchor, handleMenuClose, handleSignInSignOut }) => {
  const navigate = useNavigate();

  // Function to navigate to the home page
  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: "linear-gradient(90deg, rgb(107, 114, 104) 0%, rgb(127, 129, 127) 100%)",
        borderBottom: "2px solid #ffffff",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", alignItems: "center" }}>
        {/* Left Side - Menu Icon and Home Icon */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleMenuOpen}
            sx={{ fontSize: 30 }} // Set a size for consistency
          >
            <MenuIcon />

          </IconButton>

          
          {/* Menu */}
        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
          <Box sx={{ px: 2, py: 1, textAlign: "center" }}>
            <Avatar sx={{ margin: "0 auto", mb: 1 }} />
            <Typography variant="body1" gutterBottom>
              Welcome, {isSignedIn ? "User" : "Guest"}
            </Typography>
            <Divider />
            <MenuItem onClick={()=>{navigate('/')}}>Home</MenuItem>
            <MenuItem onClick={handleMenuClose}>Search</MenuItem>
            <MenuItem onClick={() => { navigate('/product/upload') }}>Upload</MenuItem>
            <MenuItem onClick={() => { navigate('/transactions') }}>Transactions</MenuItem>
            <MenuItem onClick={()=>{navigate('/profile')}}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Update Products</MenuItem>
            <MenuItem onClick={handleMenuClose}>Payment Bills</MenuItem>
            <MenuItem onClick={handleMenuClose}>My Reviews</MenuItem>
            <Divider />
            <MenuItem onClick={handleSignInSignOut}>
              {isSignedIn ? "Logout" : "Login"}
            </MenuItem>
          </Box>
        </Menu>

          {/* Home Icon for navigating to "/" */}
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleHomeClick}
            sx={{ fontSize: 30 }} // Set a size for consistency
          >
            <HomeIcon />
          </IconButton>
        </Box>

        {/* Center - AgriBoon Title */}
        <Typography
          variant="h4"
          sx={{
            color: "black",
            fontWeight: "bold",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          AgriBoon
        </Typography>

        {/* Right Side - Cart & Account Icons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton
          color="inherit"
          sx={{ fontSize: 30 }}
          onClick={() => navigate('/cart')}
        >
          <ShoppingCartIcon />
        </IconButton>

          <IconButton color="inherit" sx={{ fontSize: 30 }} onClick={()=>{navigate('/profile')}}>
            <AccountCircleIcon />
          </IconButton>
        </Box>

        
      </Toolbar>
    </AppBar>
  );
};

export default TopNavbar;
